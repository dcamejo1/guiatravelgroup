"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Button, ButtonAnchor } from "@/components/ui/Button";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Tooltip } from "@/components/ui/Tooltip";
import { site } from "@/content/site";
import { track } from "@/lib/analytics/track";
import { useRouter } from "@/lib/i18n/navigation";
import {
  MAX_TRAVELERS,
  calculateQuote,
  travelerCount,
} from "@/lib/pricing/engine";
import { estimateBucket, formatUsd } from "@/lib/pricing/format";
import type { CatalogItem, Locale, Localized } from "@/lib/types";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp/message";
import { ItemCard } from "./ItemCard";
import { Summary } from "./Summary";
import { STEPS, usePlan, type Prefill, type StepId } from "./usePlan";

export interface BuilderDestination {
  id: string;
  slugs: Localized;
  name: Localized;
  kicker: Localized;
  accent: string;
  media: string;
}

const todayIso = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

const field =
  "h-12 w-full rounded-md border border-ocean/25 bg-ivory px-4 text-base text-ocean placeholder:text-muted/70 transition-colors hover:border-ocean/50 focus:border-ocean";

export function TripBuilder({
  locale,
  destinations,
  catalog,
}: {
  locale: Locale;
  destinations: BuilderDestination[];
  catalog: CatalogItem[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const [today] = useState(todayIso);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [state, dispatch] = usePlan({
    locale,
    catalog,
    getPrefill: (): Prefill => {
      const wanted = searchParams.get("destination");
      const destination = destinations.find(
        (d) =>
          d.id === wanted || d.slugs.en === wanted || d.slugs.es === wanted,
      );
      const ids = [searchParams.get("package"), searchParams.get("item")];
      return {
        destinationId: destination?.id,
        items: catalog.filter((item) => ids.includes(item.id)),
      };
    },
    // Drop the parameters so a refresh does not re-add something the visitor removed.
    onPrefillApplied: () => {
      if (searchParams.size > 0) router.replace("/plan", { scroll: false });
    },
  });
  const { draft, step, maxStep, ready } = state;

  const names = useMemo(
    () => Object.fromEntries(destinations.map((d) => [d.id, d.name])),
    [destinations],
  );
  const quote = useMemo(() => calculateQuote(draft, catalog), [draft, catalog]);
  const travelers = travelerCount(draft);
  const stepId: StepId = STEPS[step];
  const selected = destinations.filter((d) =>
    draft.destinationIds.includes(d.id),
  );
  const tripWide = (category: CatalogItem["category"]) =>
    catalog.filter(
      (i) => i.category === category && i.destinationIds.length === 0,
    );

  /** Fires once per visit, on the first real interaction. */
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("plan_started");
  };

  const goTo = (next: number) => {
    markStarted();
    if (next > step) track("plan_step_completed", { step: stepId });
    dispatch({ type: "step", step: next });
    setSheetOpen(false);
  };

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  const firstRender = useRef(true);
  useEffect(() => {
    if (!ready) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step, ready]);

  const add = (item: CatalogItem, destinationId?: string) => {
    markStarted();
    track("item_added", { id: item.id, category: item.category });
    dispatch({ type: "add", item, destinationId, catalog });
  };
  const remove = (itemId: string, destinationId?: string) => {
    track("item_removed", { id: itemId });
    dispatch({ type: "remove", itemId, destinationId });
  };

  const itemList = (items: CatalogItem[], destinationId?: string) => (
    <ul className="space-y-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          draft={draft}
          destinationId={destinationId}
          locale={locale}
          onAdd={() => add(item, destinationId)}
          onRemove={() => remove(item.id, destinationId)}
          onUpdate={(change) =>
            dispatch({ type: "update", itemId: item.id, destinationId, change })
          }
        />
      ))}
    </ul>
  );

  const message = buildWhatsAppMessage({
    draft,
    quote,
    destinationNames: names,
    siteUrl: site.url,
    demo: site.demo,
  });
  const whatsappUrl = buildWhatsAppUrl(site.whatsappNumber, message);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      track("message_copied");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be refused; select the text so it can be copied by hand.
      const node = document.getElementById("whatsapp-message");
      if (node) window.getSelection()?.selectAllChildren(node);
    }
  };

  const canContinue = stepId !== "where" || draft.destinationIds.length > 0;
  const stepper = (label: string) => ({
    decreaseLabel: t("plan.item.decrease", { label }),
    increaseLabel: t("plan.item.increase", { label }),
  });

  const steps: Record<StepId, ReactNode> = {
    group: (
      <div className="space-y-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["adults", "children"] as const).map((kind) => (
            <div
              key={kind}
              className="flex items-center justify-between rounded-md border border-line bg-ivory p-5"
            >
              <span className="font-display text-xl">
                {t(`plan.group.${kind}`)}
              </span>
              <NumberStepper
                label={t(`plan.group.${kind}`)}
                value={draft.travelers[kind]}
                min={kind === "adults" ? 1 : 0}
                max={MAX_TRAVELERS - (travelers - draft.travelers[kind])}
                onChange={(value) => {
                  markStarted();
                  dispatch({
                    type: "patch",
                    draft: { travelers: { ...draft.travelers, [kind]: value } },
                  });
                }}
                {...stepper(t(`plan.group.${kind}`))}
              />
            </div>
          ))}
          {travelers >= MAX_TRAVELERS && (
            <p className="text-sm text-muted sm:col-span-2">
              {t("plan.group.maxGroup", { count: MAX_TRAVELERS })}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="font-display text-2xl">
            {t("plan.group.datesHeading")}
          </legend>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              className="size-5 accent-ocean"
              checked={draft.flexibleDates}
              onChange={(e) =>
                dispatch({
                  type: "patch",
                  draft: { flexibleDates: e.target.checked },
                })
              }
            />
            {t("plan.group.flexible")}
          </label>
          {!draft.flexibleDates && (
            <label className="mt-5 block max-w-xs text-sm font-semibold">
              {t("plan.group.startDate")}
              <input
                type="date"
                min={today}
                value={draft.startDate ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "patch",
                    draft: { startDate: e.target.value || undefined },
                  })
                }
                className={`${field} mt-2`}
              />
            </label>
          )}
        </fieldset>

        <label className="block max-w-md text-sm font-semibold">
          {t("plan.group.name")}{" "}
          <span className="font-normal text-muted">
            ({t("plan.group.optional")})
          </span>
          <input
            type="text"
            autoComplete="given-name"
            maxLength={60}
            value={draft.name ?? ""}
            onChange={(e) =>
              dispatch({ type: "patch", draft: { name: e.target.value } })
            }
            className={`${field} mt-2`}
          />
        </label>
      </div>
    ),

    where: (
      <div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {destinations.map((d) => {
            const on = draft.destinationIds.includes(d.id);
            return (
              <li
                key={d.id}
                className={`overflow-hidden rounded-md border bg-ivory transition-colors duration-300 ${
                  on ? "border-ocean" : "border-line"
                }`}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    markStarted();
                    dispatch({ type: "toggleDestination", id: d.id });
                  }}
                  className="group relative block aspect-[16/10] w-full overflow-hidden text-left text-ivory"
                >
                  <MediaSlot
                    slotKey={d.media}
                    locale={locale}
                    accent={d.accent}
                    sizes="(min-width: 640px) 40vw, 100vw"
                    play={false}
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,42,58,0.8),rgba(10,42,58,0.05)_65%)]" />
                  <span
                    className={`absolute right-4 top-4 inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors ${
                      on
                        ? "bg-ivory text-ocean"
                        : "bg-ocean/55 text-ivory backdrop-blur group-hover:bg-ocean"
                    }`}
                  >
                    <span aria-hidden="true">{on ? "✓" : "+"}</span>
                    {on ? t("plan.where.added") : t("plan.where.add")}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="eyebrow block text-ivory/80">
                      {d.kicker[locale]}
                    </span>
                    <span className="display mt-1.5 block text-3xl">
                      {d.name[locale]}
                    </span>
                  </span>
                </button>
                {on && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm font-semibold">
                      {t("plan.where.nights")}
                    </span>
                    <NumberStepper
                      size="sm"
                      label={`${t("plan.where.nights")}: ${d.name[locale]}`}
                      value={draft.nightsByDestination[d.id] ?? 1}
                      min={1}
                      max={30}
                      onChange={(nights) =>
                        dispatch({ type: "nights", id: d.id, nights })
                      }
                      {...stepper(t("plan.where.nights"))}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {!canContinue && (
          <p role="status" className="mt-6 text-sm text-muted">
            {t("plan.where.needOne")}
          </p>
        )}
      </div>
    ),

    what: (
      <div className="space-y-14">
        {selected.map((d) => {
          const own = catalog.filter((i) => i.destinationIds.includes(d.id));
          return (
            <section key={d.id} aria-label={d.name[locale]}>
              <h3 className="display text-4xl">{d.name[locale]}</h3>
              <p className="eyebrow mt-7 text-muted">
                {t("plan.what.packages")}
              </p>
              <p className="mb-4 mt-1.5 text-sm text-muted">
                {t("plan.what.packageHint")}
              </p>
              {itemList(
                own.filter((i) => i.category === "package"),
                d.id,
              )}
              <p className="eyebrow mb-4 mt-9 text-muted">
                {t("plan.what.activities")}
              </p>
              {itemList(
                own.filter((i) => i.category === "activity"),
                d.id,
              )}
            </section>
          );
        })}
      </div>
    ),

    transport: (
      <div>
        {itemList(tripWide("transport"))}
        <p className="mt-6 flex items-center gap-2.5 text-sm text-muted">
          <Tooltip label={t("plan.transport.secureLabel")}>
            {t("plan.transport.secure")}
          </Tooltip>
          {t("plan.transport.secureLabel")}
        </p>
      </div>
    ),

    extras: (
      <div className="space-y-10">
        {itemList(tripWide("extra"))}
        <label className="block text-sm font-semibold">
          {t("plan.extras.notes")}{" "}
          <span className="font-normal text-muted">
            ({t("plan.group.optional")})
          </span>
          <textarea
            rows={4}
            maxLength={300}
            placeholder={t("plan.extras.notesPlaceholder")}
            value={draft.notes ?? ""}
            onChange={(e) =>
              dispatch({ type: "patch", draft: { notes: e.target.value } })
            }
            className={`${field} mt-2 h-auto py-3 leading-relaxed`}
          />
        </label>
      </div>
    ),

    review: (
      <div className="space-y-10">
        <div className="rounded-md border border-line bg-ivory p-6 md:p-8 lg:hidden">
          <Summary
            draft={draft}
            quote={quote}
            names={names}
            locale={locale}
            onRemove={remove}
          />
        </div>
        {quote.lines.length === 0 && (
          <p className="text-muted">{t("plan.review.empty")}</p>
        )}

        <div>
          <h3 className="font-display text-2xl">{t("plan.review.message")}</h3>
          <p className="mt-1.5 text-sm text-muted">
            {t("plan.review.messageHint")}
          </p>
          <div className="mt-5 rounded-md bg-[#e7f6e3] p-4 md:p-6">
            <pre
              id="whatsapp-message"
              lang="es"
              className="max-w-xl whitespace-pre-wrap break-words rounded-lg rounded-tr-none bg-[#d9fdd3] p-4 font-sans text-sm leading-relaxed text-[#111b21] shadow-sm"
            >
              {message}
            </pre>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            {whatsappUrl ? (
              <ButtonAnchor
                href={whatsappUrl}
                size="lg"
                onClick={() =>
                  track("whatsapp_clicked", {
                    destinations: draft.destinationIds,
                    itemCount: quote.lines.length,
                    estimateBucket: estimateBucket(quote.totalUsd),
                    locale,
                  })
                }
              >
                {t("plan.review.send")}
              </ButtonAnchor>
            ) : (
              <Button size="lg" disabled>
                {t("plan.review.send")}
              </Button>
            )}
            <Button
              variant={whatsappUrl ? "outline" : "primary"}
              size="lg"
              onClick={copyMessage}
            >
              {copied ? t("plan.review.copied") : t("plan.review.copy")}
            </Button>
            <span role="status" className="sr-only">
              {copied ? t("plan.review.copied") : ""}
            </span>
          </div>
          {!whatsappUrl && (
            <p className="mt-3 text-sm text-muted">
              {t("plan.review.noNumber")}
            </p>
          )}
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-muted">
            {t("plan.summary.disclaimer")}
          </p>
        </div>
      </div>
    ),
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="shell pb-40 pt-28 lg:pb-28 lg:pt-36">
      <header className="max-w-2xl">
        <p className="eyebrow text-lagoon">
          {t("plan.stepOf", { current: step + 1, total: STEPS.length })}
        </p>
        <h1 className="display mt-3 text-5xl md:text-6xl">{t("plan.title")}</h1>
        <p className="mt-4 leading-relaxed text-muted">{t("plan.intro")}</p>
      </header>

      <nav aria-label={t("plan.progress")} className="mt-10">
        <ol className="flex gap-1.5 md:gap-2">
          {STEPS.map((id, i) => {
            const reachable =
              i <= maxStep && (i <= 1 || draft.destinationIds.length > 0);
            return (
              <li key={id} className="min-w-0 flex-1">
                <button
                  type="button"
                  disabled={!ready || !reachable}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => goTo(i)}
                  className="group block w-full text-left disabled:cursor-default"
                >
                  <span
                    className={`block h-0.5 w-full transition-colors duration-500 ${
                      i <= step ? "bg-ocean" : "bg-ocean/15"
                    }`}
                  />
                  <span
                    className={`mt-3 hidden truncate text-xs font-semibold md:block ${
                      i === step
                        ? "text-ocean"
                        : reachable
                          ? "text-muted group-hover:text-ocean"
                          : "text-muted/60"
                    }`}
                  >
                    <span aria-hidden="true" className="mr-1.5 opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t(`plan.steps.${id}`)}
                  </span>
                  <span className="sr-only md:hidden">
                    {t(`plan.steps.${id}`)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-20">
        <div aria-busy={!ready}>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="display scroll-mt-28 text-4xl outline-none md:text-5xl"
          >
            {t(`plan.${stepId}.heading`)}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            {t(`plan.${stepId}.text`)}
          </p>

          <div
            className={`mt-9 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          >
            {steps[stepId]}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            {step > 0 ? (
              <Button variant="outline" onClick={() => goTo(step - 1)}>
                ← {t("plan.back")}
              </Button>
            ) : (
              <span />
            )}
            {isLast ? (
              <Button
                variant="ghost"
                onClick={() => {
                  dispatch({ type: "reset", locale });
                  started.current = false;
                }}
              >
                {t("plan.review.startOver")}
              </Button>
            ) : (
              <Button
                disabled={!ready || !canContinue}
                onClick={() => goTo(step + 1)}
              >
                {step === STEPS.length - 2
                  ? t("plan.toReview")
                  : t("plan.next")}{" "}
                →
              </Button>
            )}
          </div>
        </div>

        <aside className="sticky top-28 hidden rounded-md border border-line bg-sand-soft/60 p-7 lg:block">
          <Summary
            draft={draft}
            quote={quote}
            names={names}
            locale={locale}
            onRemove={remove}
          />
        </aside>
      </div>

      {/* Small screens: the estimate stays in reach in a bar that opens into the full summary. */}
      <div
        data-bottom-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 backdrop-blur lg:hidden"
      >
        {sheetOpen && (
          <div
            id="trip-sheet"
            className="max-h-[65svh] overflow-y-auto border-b border-line px-5 py-6"
          >
            <Summary
              draft={draft}
              quote={quote}
              names={names}
              locale={locale}
              onRemove={remove}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5">
          <div>
            <p className="eyebrow text-muted">{t("plan.summary.total")}</p>
            <p className="font-display text-2xl leading-tight tabular-nums">
              {formatUsd(quote.totalUsd, locale)}
            </p>
          </div>
          <Button
            variant="outline"
            aria-expanded={sheetOpen}
            aria-controls="trip-sheet"
            onClick={() => setSheetOpen((v) => !v)}
          >
            {sheetOpen ? t("plan.summary.hide") : t("plan.summary.view")}
            {!sheetOpen && quote.lines.length > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-ocean text-[0.6875rem] text-ivory">
                {quote.lines.length}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
