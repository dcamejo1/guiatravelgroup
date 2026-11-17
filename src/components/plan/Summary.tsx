"use client";

import { useTranslations } from "next-intl";
import { addNights } from "@/lib/pricing/engine";
import { formatFactors, formatUsd } from "@/lib/pricing/format";
import type { Locale, Localized, QuoteDraft, QuoteResult } from "@/lib/types";

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

/** The running "receipt": what is in the trip, line by line, and the estimate. */
export function Summary({
  draft,
  quote,
  names,
  locale,
  onRemove,
  showTitle = true,
}: {
  draft: QuoteDraft;
  quote: QuoteResult;
  names: Record<string, Localized>;
  locale: Locale;
  onRemove?: (itemId: string, destinationId?: string) => void;
  showTitle?: boolean;
}) {
  const t = useTranslations("plan.summary");

  const groups = [
    ...draft.destinationIds.map((id) => ({
      id,
      title: `${names[id]?.[locale] ?? id} · ${t("nights", { count: draft.nightsByDestination[id] ?? 0 })}`,
      lines: quote.lines.filter((l) => l.destinationId === id),
    })),
    {
      id: "trip",
      title: t("tripWide"),
      lines: quote.lines.filter((l) => !l.destinationId),
    },
  ].filter((group) => group.lines.length > 0 || group.id !== "trip");

  const dates =
    draft.startDate && !draft.flexibleDates
      ? `${formatDate(draft.startDate, locale)} → ${formatDate(addNights(draft.startDate, quote.nights), locale)}`
      : t("flexible");

  return (
    <div>
      {showTitle && <h2 className="font-display text-2xl">{t("title")}</h2>}
      <p className={`text-sm text-muted ${showTitle ? "mt-1.5" : ""}`}>
        {t("travelers", { count: quote.travelers })}
        {quote.nights > 0 && <> · {t("nights", { count: quote.nights })}</>}
        {" · "}
        {dates}
      </p>

      {groups.length === 0 ? (
        <p className="mt-6 border-t border-line pt-6 text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-6 space-y-6 border-t border-line pt-6">
          {groups.map((group) => (
            <section key={group.id}>
              <h3 className="eyebrow text-muted">{group.title}</h3>
              {group.lines.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {group.lines.map((line) => {
                    const why = formatFactors(line.factors, locale);
                    return (
                      <li
                        key={`${line.itemId}:${line.destinationId ?? ""}`}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium leading-snug">
                            {line.label[locale]}
                          </p>
                          {why && (
                            <p className="mt-0.5 text-xs text-muted">{why}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="tabular-nums">
                            {line.unavailableReason
                              ? t("notAvailable")
                              : formatUsd(line.subtotalUsd, locale)}
                          </span>
                          {onRemove && (
                            <button
                              type="button"
                              aria-label={t("remove", {
                                name: line.label[locale],
                              })}
                              onClick={() =>
                                onRemove(line.itemId, line.destinationId)
                              }
                              className="grid size-6 place-items-center rounded-full text-muted transition-colors hover:bg-ocean/10 hover:text-ocean"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-ocean/20 pt-5">
        <p className="flex items-baseline justify-between gap-4">
          <span className="eyebrow">{t("total")}</span>
          <span className="font-display text-4xl tabular-nums">
            {formatUsd(quote.totalUsd, locale)}
          </span>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
