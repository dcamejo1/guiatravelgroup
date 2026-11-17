import type {
  CatalogItem,
  LineFactors,
  QuoteDraft,
  QuoteLine,
  QuoteResult,
  QuoteSelection,
  UnavailableReason,
} from "@/lib/types";

export const MAX_TRAVELERS = 20;
export const DEFAULT_NIGHTS = 3;

const roundCents = (value: number) => Math.round(value * 100) / 100;
const atLeastOne = (value: number | undefined) =>
  Math.max(1, Math.floor(value ?? 1));

export function travelerCount(draft: Pick<QuoteDraft, "travelers">): number {
  return draft.travelers.adults + draft.travelers.children;
}

/** Trip length: the sum of the nights of every selected destination. */
export function totalNights(
  draft: Pick<QuoteDraft, "destinationIds" | "nightsByDestination">,
): number {
  return draft.destinationIds.reduce(
    (sum, id) => sum + (draft.nightsByDestination[id] ?? 0),
    0,
  );
}

export function availability(
  item: CatalogItem,
  travelers: number,
): UnavailableReason | undefined {
  const { minTravelers, maxTravelers } = item.pricing;
  if (minTravelers !== undefined && travelers < minTravelers)
    return "min_travelers";
  if (maxTravelers !== undefined && travelers > maxTravelers)
    return "max_travelers";
  return undefined;
}

/** Nights that apply to a selection: its destination's nights, or the whole trip for trip-wide items. */
function nightsFor(
  selection: QuoteSelection,
  draft: Pick<QuoteDraft, "destinationIds" | "nightsByDestination">,
): number {
  if (selection.destinationId) {
    return draft.nightsByDestination[selection.destinationId] ?? 0;
  }
  return totalNights(draft);
}

export function priceLine(
  item: CatalogItem,
  selection: QuoteSelection,
  draft: Pick<
    QuoteDraft,
    "travelers" | "destinationIds" | "nightsByDestination"
  >,
): QuoteLine {
  const travelers = travelerCount(draft);
  const quantity = item.allowQuantity ? atLeastOne(selection.quantity) : 1;
  const nights = nightsFor(selection, draft);
  const { unit, amountUsd, capacity } = item.pricing;
  const factors: LineFactors = {};
  let subtotal: number;

  switch (unit) {
    case "per_person": {
      const participants = Math.min(
        travelers,
        atLeastOne(selection.participants ?? travelers),
      );
      factors.participants = participants;
      subtotal = amountUsd * participants * quantity;
      break;
    }
    case "per_group":
      subtotal = amountUsd * quantity;
      break;
    case "per_vehicle": {
      const units = Math.ceil(travelers / atLeastOne(capacity));
      factors.units = units;
      factors.unitKind = "vehicle";
      subtotal = amountUsd * units * quantity;
      break;
    }
    case "per_night": {
      const units = capacity ? Math.ceil(travelers / atLeastOne(capacity)) : 1;
      factors.nights = nights;
      if (capacity) {
        factors.units = units;
        factors.unitKind = "room";
      }
      subtotal = amountUsd * nights * units * quantity;
      break;
    }
    case "per_person_per_night":
      factors.travelers = travelers;
      factors.nights = nights;
      subtotal = amountUsd * travelers * nights * quantity;
      break;
  }

  if (quantity > 1) factors.quantity = quantity;
  const unavailableReason = availability(item, travelers);

  return {
    itemId: item.id,
    destinationId: selection.destinationId,
    category: item.category,
    label: item.name,
    unit,
    quantity,
    factors,
    subtotalUsd: unavailableReason ? 0 : roundCents(subtotal),
    ...(unavailableReason ? { unavailableReason } : {}),
  };
}

/** Prices every selection. Unknown item ids are skipped; unavailable lines count as zero. */
export function calculateQuote(
  draft: QuoteDraft,
  items: readonly CatalogItem[],
): QuoteResult {
  const byId = new Map(items.map((item) => [item.id, item]));
  const lines = draft.selections.flatMap((selection) => {
    const item = byId.get(selection.itemId);
    return item ? [priceLine(item, selection, draft)] : [];
  });
  return {
    lines,
    totalUsd: roundCents(lines.reduce((sum, l) => sum + l.subtotalUsd, 0)),
    nights: totalNights(draft),
    travelers: travelerCount(draft),
  };
}

const sameSlot = (a: QuoteSelection, b: QuoteSelection) =>
  a.itemId === b.itemId && a.destinationId === b.destinationId;

/**
 * Adds an item to the draft. A package replaces any other package already
 * chosen for the same destination. Adding an item twice leaves it as is.
 */
export function addSelection(
  draft: QuoteDraft,
  item: CatalogItem,
  destinationId?: string,
  items: readonly CatalogItem[] = [],
): QuoteDraft {
  const next: QuoteSelection = { itemId: item.id, destinationId, quantity: 1 };
  if (draft.selections.some((s) => sameSlot(s, next))) return draft;

  let selections = draft.selections;
  if (item.category === "package") {
    const packageIds = new Set(
      items.filter((i) => i.category === "package").map((i) => i.id),
    );
    selections = selections.filter(
      (s) => !(s.destinationId === destinationId && packageIds.has(s.itemId)),
    );
  }
  return { ...draft, selections: [...selections, next] };
}

export function removeSelection(
  draft: QuoteDraft,
  itemId: string,
  destinationId?: string,
): QuoteDraft {
  return {
    ...draft,
    selections: draft.selections.filter(
      (s) => !sameSlot(s, { itemId, destinationId, quantity: 1 }),
    ),
  };
}

/** Adds `nights` to an ISO date using date-only arithmetic. */
export function addNights(isoDate: string, nights: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + nights));
  return date.toISOString().slice(0, 10);
}

export function emptyDraft(locale: QuoteDraft["locale"]): QuoteDraft {
  return {
    locale,
    travelers: { adults: 2, children: 0 },
    flexibleDates: true,
    destinationIds: [],
    nightsByDestination: {},
    selections: [],
  };
}
