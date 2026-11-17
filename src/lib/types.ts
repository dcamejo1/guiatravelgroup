export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export type Localized = Record<Locale, string>;

export type PricingUnit =
  | "per_person"
  | "per_group"
  | "per_vehicle"
  | "per_night"
  | "per_person_per_night";

export interface Pricing {
  unit: PricingUnit;
  /** Placeholder values while NEXT_PUBLIC_DEMO is on. */
  amountUsd: number;
  /**
   * People per unit. Required for `per_vehicle` (seats). Optional for
   * `per_night` (people per room); omitted means one unit for the whole group.
   */
  capacity?: number;
  minTravelers?: number;
  maxTravelers?: number;
}

export type ItemCategory = "package" | "activity" | "transport" | "extra";

export interface CatalogItem {
  id: string;
  category: ItemCategory;
  /** Empty array = trip-wide item, available whatever the destination. */
  destinationIds: string[];
  name: Localized;
  description: Localized;
  pricing: Pricing;
  allowQuantity?: boolean;
  includes?: Localized[];
  media?: string;
  isPlaceholder: boolean;
}

export interface AtAGlanceFact {
  label: Localized;
  value: Localized;
  /** True while a human still has to confirm the value. */
  verify: boolean;
}

export interface Destination {
  /** Stable id; equals the English slug. */
  id: string;
  slug: Localized;
  name: Localized;
  /** Short line under the name on cards, e.g. "Caribbean archipelago". */
  kicker: Localized;
  tagline: Localized;
  accent: string;
  atAGlance: AtAGlanceFact[];
  highlights: { title: Localized; text: Localized; media: string }[];
  faqIds: string[];
  heroMedia: string;
  cardMedia: string;
}

export interface Faq {
  id: string;
  question: Localized;
  answer: Localized;
  verify: boolean;
}

export interface GuideArticle {
  id: string;
  slug: Localized;
  title: Localized;
  summary: Localized;
  sections: { heading: Localized; body: Localized; verify: boolean }[];
}

export interface QuoteSelection {
  itemId: string;
  /** Destination the item was added under; undefined for trip-wide items. */
  destinationId?: string;
  quantity: number;
  /** `per_person` items only. Defaults to every traveler. */
  participants?: number;
}

export interface QuoteDraft {
  locale: Locale;
  travelers: { adults: number; children: number };
  /** ISO date (YYYY-MM-DD). Date-only arithmetic, no time zones. */
  startDate?: string;
  flexibleDates: boolean;
  destinationIds: string[];
  nightsByDestination: Record<string, number>;
  selections: QuoteSelection[];
  name?: string;
  notes?: string;
}

/** The numbers a line was multiplied by, kept structured so they can be explained in any language. */
export interface LineFactors {
  travelers?: number;
  participants?: number;
  nights?: number;
  units?: number;
  unitKind?: "vehicle" | "room";
  quantity?: number;
}

export type UnavailableReason = "min_travelers" | "max_travelers";

export interface QuoteLine {
  itemId: string;
  destinationId?: string;
  category: ItemCategory;
  label: Localized;
  unit: PricingUnit;
  quantity: number;
  factors: LineFactors;
  subtotalUsd: number;
  unavailableReason?: UnavailableReason;
}

export interface QuoteResult {
  lines: QuoteLine[];
  totalUsd: number;
  nights: number;
  travelers: number;
}
