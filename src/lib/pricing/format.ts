import type { LineFactors, Locale } from "@/lib/types";

type Forms = { one: string; other: string };

const WORDS: Record<Locale, Record<string, Forms>> = {
  en: {
    travelers: { one: "traveler", other: "travelers" },
    nights: { one: "night", other: "nights" },
    vehicle: { one: "vehicle", other: "vehicles" },
    room: { one: "room", other: "rooms" },
  },
  es: {
    travelers: { one: "viajero", other: "viajeros" },
    nights: { one: "noche", other: "noches" },
    vehicle: { one: "vehículo", other: "vehículos" },
    room: { one: "habitación", other: "habitaciones" },
  },
};

const count = (locale: Locale, word: string, n: number) =>
  `${n} ${n === 1 ? WORDS[locale][word].one : WORDS[locale][word].other}`;

/** "2 travelers × 4 nights". Empty string when the price is a flat amount. */
export function formatFactors(factors: LineFactors, locale: Locale): string {
  const parts: string[] = [];
  const people = factors.participants ?? factors.travelers;
  if (people !== undefined) parts.push(count(locale, "travelers", people));
  if (factors.units !== undefined && factors.unitKind)
    parts.push(count(locale, factors.unitKind, factors.units));
  if (factors.nights !== undefined)
    parts.push(count(locale, "nights", factors.nights));
  if (factors.quantity !== undefined) parts.push(`× ${factors.quantity}`);
  return parts.join(" × ").replace("× ×", "×");
}

/** Whole dollars unless there are cents. */
export function formatUsd(amount: number, locale: Locale): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Coarse range for analytics, so the exact quote is never logged. */
export function estimateBucket(totalUsd: number): string {
  if (totalUsd < 500) return "<500";
  if (totalUsd < 1000) return "500-1000";
  if (totalUsd < 2500) return "1000-2500";
  if (totalUsd < 5000) return "2500-5000";
  return "5000+";
}
