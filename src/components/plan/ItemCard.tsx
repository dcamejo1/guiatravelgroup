"use client";

import { useTranslations } from "next-intl";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { availability, priceLine, travelerCount } from "@/lib/pricing/engine";
import { formatUsd } from "@/lib/pricing/format";
import { unitMessage } from "@/lib/pricing/units";
import type {
  CatalogItem,
  Locale,
  QuoteDraft,
  QuoteSelection,
} from "@/lib/types";

/**
 * One thing that can be added to the trip. Shows how it is priced, what it
 * comes to for this group, and, once added, the controls that apply to it.
 */
export function ItemCard({
  item,
  draft,
  destinationId,
  locale,
  onAdd,
  onRemove,
  onUpdate,
}: {
  item: CatalogItem;
  draft: QuoteDraft;
  destinationId?: string;
  locale: Locale;
  onAdd: () => void;
  onRemove: () => void;
  onUpdate: (change: { quantity?: number; participants?: number }) => void;
}) {
  const t = useTranslations();
  const travelers = travelerCount(draft);
  const selection: QuoteSelection | undefined = draft.selections.find(
    (s) => s.itemId === item.id && s.destinationId === destinationId,
  );
  const selected = Boolean(selection);
  const isPackage = item.category === "package";
  const blocked = availability(item, travelers);
  const line = priceLine(
    item,
    selection ?? { itemId: item.id, destinationId, quantity: 1 },
    draft,
  );
  const unit = unitMessage(item.pricing);
  const name = item.name[locale];

  return (
    <li
      className={`rounded-md border p-5 transition-colors duration-300 md:p-6 ${
        selected ? "border-ocean bg-ivory" : "border-line bg-ivory/60"
      } ${blocked ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="font-display text-xl leading-snug md:text-2xl">
            {name}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {item.description[locale]}
          </p>
          {isPackage && item.includes && (
            <p className="mt-3 text-xs text-muted">
              <span className="font-semibold text-ocean">
                {t("plan.item.includes")}:
              </span>{" "}
              {item.includes.map((inc) => inc[locale]).join(" · ")}
            </p>
          )}
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="whitespace-nowrap">
            <span className="font-display text-2xl">
              {formatUsd(item.pricing.amountUsd, locale)}
            </span>{" "}
            <span className="text-xs text-muted">
              {t(`units.${unit.key}`, { count: unit.count })}
            </span>
          </p>
          {!blocked && (
            <p className="mt-0.5 text-xs font-semibold text-lagoon">
              {t("plan.item.forYourGroup", {
                amount: formatUsd(line.subtotalUsd, locale),
              })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {selected && item.allowQuantity && (
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span>{t("plan.item.quantity")}</span>
              <NumberStepper
                size="sm"
                label={`${t("plan.item.quantity")}: ${name}`}
                value={selection?.quantity ?? 1}
                min={1}
                max={20}
                onChange={(quantity) => onUpdate({ quantity })}
                decreaseLabel={t("plan.item.decrease", {
                  label: t("plan.item.quantity"),
                })}
                increaseLabel={t("plan.item.increase", {
                  label: t("plan.item.quantity"),
                })}
              />
            </div>
          )}
          {selected && item.pricing.unit === "per_person" && travelers > 1 && (
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span>{t("plan.item.participants")}</span>
              <NumberStepper
                size="sm"
                label={`${t("plan.item.participants")}: ${name}`}
                value={Math.min(
                  selection?.participants ?? travelers,
                  travelers,
                )}
                min={1}
                max={travelers}
                onChange={(participants) => onUpdate({ participants })}
                decreaseLabel={t("plan.item.decrease", {
                  label: t("plan.item.participants"),
                })}
                increaseLabel={t("plan.item.increase", {
                  label: t("plan.item.participants"),
                })}
              />
            </div>
          )}
          {blocked && (
            <p className="text-xs font-semibold text-coral-deep">
              {blocked === "min_travelers"
                ? t("plan.item.unavailableMin", {
                    count: item.pricing.minTravelers ?? 0,
                  })
                : t("plan.item.unavailableMax", {
                    count: item.pricing.maxTravelers ?? 0,
                  })}
            </p>
          )}
        </div>

        <button
          type="button"
          aria-pressed={selected}
          aria-label={`${selected ? t("plan.item.remove") : isPackage ? t("plan.item.choose") : t("plan.item.add")}: ${name}`}
          disabled={Boolean(blocked) && !selected}
          onClick={selected ? onRemove : onAdd}
          className={`ml-auto inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40 ${
            selected
              ? "bg-ocean text-ivory hover:bg-ocean-soft"
              : "border border-ocean/25 hover:border-ocean hover:bg-ocean hover:text-ivory"
          }`}
        >
          {selected ? (
            <>
              <span aria-hidden="true">✓</span>
              {isPackage ? t("plan.item.chosen") : t("plan.item.added")}
            </>
          ) : isPackage ? (
            t("plan.item.choose")
          ) : (
            <>
              <span aria-hidden="true">+</span>
              {t("plan.item.add")}
            </>
          )}
        </button>
      </div>
    </li>
  );
}
