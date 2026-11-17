import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/destinations/ViewTracker";
import { ClosingCta } from "@/components/home/sections";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VerifyBadge } from "@/components/ui/VerifyBadge";
import {
  getCatalogItems,
  getDestination,
  getDestinations,
  getFaqs,
} from "@/data";
import { Link } from "@/lib/i18n/navigation";
import { formatUsd } from "@/lib/pricing/format";
import { unitMessage } from "@/lib/pricing/units";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug[params.locale as Locale] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = await getDestination(slug, locale as Locale);
  if (!d) return {};
  return {
    title: d.name[locale as Locale],
    description: d.tagline[locale as Locale],
  };
}

export default async function DestinationPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const d = await getDestination(slug, locale);
  if (!d) notFound();

  const [t, items, faqs] = await Promise.all([
    getTranslations(),
    getCatalogItems({ destinationIds: [d.id] }),
    getFaqs(d.faqIds),
  ]);
  const own = items.filter((item) => item.destinationIds.includes(d.id));
  const packages = own.filter((item) => item.category === "package");
  const activities = own.filter((item) => item.category === "activity");
  const kindLabels = { video: t("common.video"), image: t("common.photo") };
  const name = d.name[locale];

  const price = (item: (typeof own)[number]) => {
    const unit = unitMessage(item.pricing);
    return (
      <p className="whitespace-nowrap">
        <span className="font-display text-3xl">
          {formatUsd(item.pricing.amountUsd, locale)}
        </span>{" "}
        <span className="text-xs text-muted">
          {t(`units.${unit.key}`, { count: unit.count })}
        </span>
      </p>
    );
  };

  return (
    <>
      <ViewTracker id={d.id} />

      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ocean text-ivory">
        <div className="absolute inset-0 -z-20 animate-drift">
          <MediaSlot
            slotKey={d.heroMedia}
            locale={locale}
            accent={d.accent}
            priority
            sizes="100vw"
            kindLabels={kindLabels}
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(10,42,58,0.55)_0%,rgba(10,42,58,0)_30%,rgba(10,42,58,0)_45%,rgba(10,42,58,0.78)_100%)]" />
        <div className="shell pb-14 pt-40 lg:pb-20">
          <p className="eyebrow animate-rise text-ivory/85">
            {d.kicker[locale]}
          </p>
          <h1 className="display mt-4 animate-rise text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.9] [animation-delay:120ms]">
            {name}
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-ivory/90 [animation-delay:240ms]">
            {d.tagline[locale]}
          </p>
          <div className="mt-8 animate-rise [animation-delay:360ms]">
            <ButtonLink
              href={{ pathname: "/plan", query: { destination: d.id } }}
              size="lg"
            >
              {t("common.planTrip")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        aria-label={t("destination.atAGlance")}
        className="border-b border-line"
      >
        <dl className="shell grid gap-8 py-10 sm:grid-cols-3 md:py-12">
          {d.atAGlance.map((fact, i) => (
            <div
              key={fact.label.en}
              className={i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}
            >
              <dt className="eyebrow text-muted">{fact.label[locale]}</dt>
              <dd className="mt-2 font-display text-2xl">
                {fact.value[locale]}
                {fact.verify && <VerifyBadge label={t("common.verify")} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell py-20 lg:py-32">
        <Reveal>
          <p className="eyebrow text-lagoon">{t("destination.highlights")}</p>
        </Reveal>
        <ul className="mt-10 space-y-16 lg:space-y-28">
          {d.highlights.map((h, i) => (
            <li key={h.title.en}>
              <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-md lg:col-span-7 ${
                    i % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <MediaSlot
                    slotKey={h.media}
                    locale={locale}
                    accent={d.accent}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    kindLabels={kindLabels}
                  />
                </div>
                <div className="lg:col-span-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-light italic text-lagoon"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display mt-3 text-4xl md:text-5xl">
                    {h.title[locale]}
                  </h2>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                    {h.text[locale]}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-sand-soft">
        <div className="shell py-20 lg:py-28">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-lagoon">{t("destination.packages")}</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">{name}</h2>
            <p className="mt-5 leading-relaxed text-muted">
              {t("destination.packagesText")}
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {packages.map((item, i) => (
              <li key={item.id}>
                <Reveal
                  delay={i * 0.08}
                  className="flex h-full flex-col rounded-md border border-line bg-ivory p-7 md:p-9"
                >
                  <h3 className="font-display text-2xl md:text-3xl">
                    {item.name[locale]}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    {item.description[locale]}
                  </p>
                  {item.includes && (
                    <div className="grow">
                      <p className="eyebrow mt-7 text-muted">
                        {t("destination.includes")}
                      </p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {item.includes.map((inc) => (
                          <li key={inc.en} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-turquoise"
                            />
                            {inc[locale]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
                    {price(item)}
                    <ButtonLink
                      href={{
                        pathname: "/plan",
                        query: { destination: d.id, package: item.id },
                      }}
                    >
                      {t("destination.startWith")}
                    </ButtonLink>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell grid gap-12 py-20 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:py-28">
        <Reveal>
          <p className="eyebrow text-lagoon">{t("destination.activities")}</p>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            {t("destination.activitiesText")}
          </p>
        </Reveal>
        <ul className="border-t border-line">
          {activities.map((item, i) => (
            <li key={item.id} className="border-b border-line">
              <Reveal
                delay={i * 0.06}
                className="grid gap-4 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
              >
                <div>
                  <h3 className="font-display text-2xl">{item.name[locale]}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description[locale]}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
                  {price(item)}
                  <Link
                    href={{
                      pathname: "/plan",
                      query: { destination: d.id, item: item.id },
                    }}
                    className="group inline-flex items-center gap-2 border-b border-ocean/40 pb-0.5 text-sm font-semibold transition-colors hover:border-ocean"
                  >
                    {t("destination.addToTrip")}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {faqs.length > 0 && (
        <section className="shell grid gap-10 pb-20 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:pb-32">
          <Reveal>
            <p className="eyebrow text-lagoon">{t("destination.faq")}</p>
          </Reveal>
          <div className="border-t border-line">
            {faqs.map((faq) => (
              <details key={faq.id} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                  {faq.question[locale]}
                  <span
                    aria-hidden="true"
                    className="text-2xl font-light transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 leading-relaxed text-muted">
                  {faq.answer[locale]}
                  {faq.verify && <VerifyBadge label={t("common.verify")} />}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <ClosingCta
        locale={locale}
        title={t("destination.ctaTitle", { name })}
        planQuery={{ destination: d.id }}
      />
    </>
  );
}
