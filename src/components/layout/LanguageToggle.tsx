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

export function LanguageToggle({
  slugMap,
  tone = "dark",
}: {
  slugMap: SlugMap;
  tone?: "dark" | "light";
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const other: Locale = locale === "en" ? "es" : "en";
  const href = useAlternateHref(slugMap, locale, other);

  const remember = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
    track("language_toggled", { to: other });
  };

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
