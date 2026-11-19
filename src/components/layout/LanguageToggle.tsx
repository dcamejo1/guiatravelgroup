"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { track } from "@/lib/analytics/track";
import { LOCALE_COOKIE } from "@/lib/i18n/detect";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/types";

export type SlugMap = Record<
  "destinations" | "guide",
  Record<string, Record<Locale, string>>
>;

type Href = Parameters<typeof Link>[0]["href"];

/** The same page in another language, translating slugs that differ (cruises ↔ cruceros). */
function useAlternateHref(slugMap: SlugMap, from: Locale, to: Locale): Href {
  const pathname = usePathname();
  const slug = useParams<{ slug?: string }>().slug;

  if (pathname === "/destinations/[slug]" || pathname === "/guide/[slug]") {
    const group =
      pathname === "/destinations/[slug]"
        ? slugMap.destinations
        : slugMap.guide;
    const entry = Object.values(group).find((s) => s[from] === slug);
    return { pathname, params: { slug: entry?.[to] ?? slug ?? "" } };
  }
  return pathname;
}

/** Each language named in itself, as users look for their own. */
const NATIVE_NAMES: Record<Locale, string> = { en: "English", es: "Español" };

export function LanguageToggle({
  slugMap,
  tone = "dark",
  variant = "compact",
}: {
  slugMap: SlugMap;
  tone?: "dark" | "light";
  /** compact: "EN / ES" for the header bar; segmented: a full pill switch for the mobile menu. */
  variant?: "compact" | "segmented";
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const other: Locale = locale === "en" ? "es" : "en";
  const href = useAlternateHref(slugMap, locale, other);

  const remember = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
    track("language_toggled", { to: other });
  };

  if (variant === "segmented") {
    return (
      <div
        role="group"
        aria-label={t("language")}
        className="relative grid grid-cols-2 rounded-full border border-line bg-sand-soft/60 p-1 text-sm font-medium"
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ocean shadow-sm transition-transform duration-500 ease-soft ${
            locale === "es" ? "translate-x-full" : ""
          }`}
        />
        {(["en", "es"] as const).map((code) =>
          code === locale ? (
            <span
              key={code}
              aria-current="true"
              lang={code}
              className="relative z-10 py-2.5 text-center text-ivory"
            >
              {NATIVE_NAMES[code]}
            </span>
          ) : (
            <Link
              key={code}
              href={href}
              locale={code}
              hrefLang={code}
              lang={code}
              aria-label={t("switchTo")}
              onClick={remember}
              className="relative z-10 rounded-full py-2.5 text-center text-ocean/60 transition-colors hover:text-ocean"
            >
              {NATIVE_NAMES[code]}
            </Link>
          ),
        )}
      </div>
    );
  }

  const active = tone === "light" ? "text-ivory" : "text-ocean";
  const idle =
    tone === "light"
      ? "text-ivory/60 hover:text-ivory"
      : "text-ocean/50 hover:text-ocean";

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="eyebrow flex items-center gap-2"
    >
      {(["en", "es"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
          )}
          {code === locale ? (
            <span aria-current="true" className={active}>
              {code}
            </span>
          ) : (
            <Link
              href={href}
              locale={code}
              hrefLang={code}
              lang={code}
              aria-label={t("switchTo")}
              onClick={remember}
              className={`transition-colors ${idle}`}
            >
              {code}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
