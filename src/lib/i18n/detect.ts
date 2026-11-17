import { LOCALES, type Locale } from "@/lib/types";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const DEFAULT_LOCALE: Locale = "en";

/** ISO country codes where Spanish is the main language. */
const SPANISH_SPEAKING = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

/** Best supported locale from an Accept-Language header, honouring q-values. */
export function fromAcceptLanguage(
  header: string | null | undefined,
): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.trim().slice(2)) : 1;
      return { lang: tag.toLowerCase().split("-")[0], quality, index };
    })
    .filter((entry) => entry.quality > 0 && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  const match = ranked.find((entry) => isLocale(entry.lang));
  return match ? (match.lang as Locale) : null;
}

/**
 * Used for the root URL only. Order: the visitor's saved choice, then the
 * browser language, then the country, then English.
 */
export function detectLocale(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(input.cookie)) return input.cookie;
  const fromHeader = fromAcceptLanguage(input.acceptLanguage);
  if (fromHeader) return fromHeader;
  if (input.country && SPANISH_SPEAKING.has(input.country.toUpperCase()))
    return "es";
  return DEFAULT_LOCALE;
}
