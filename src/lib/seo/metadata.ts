import type { Metadata } from "next";
import { site } from "@/content/site";
import { getPathname } from "@/lib/i18n/navigation";
import { LOCALES, type Locale } from "@/lib/types";

type Href = Parameters<typeof getPathname>[0]["href"];
/** The same page in each language. Slugs that differ by language are resolved here. */
export type LocalizedHref = (locale: Locale) => Href;

const DEFAULT_IMAGE = {
  url: "/media/home/hero-poster.jpg",
  width: 1920,
  height: 1080,
};

export const absoluteUrl = (path: string) => `${site.url}${path}`;

export const localizedUrl = (locale: Locale, href: LocalizedHref) =>
  absoluteUrl(getPathname({ locale, href: href(locale) }));

/** Every language version of a page, plus `x-default` (English), for hreflang and the sitemap. */
export function languageAlternates(
  href: LocalizedHref,
): Record<string, string> {
  const urls = Object.fromEntries(
    LOCALES.map((l) => [l, localizedUrl(l, href)]),
  );
  return { ...urls, "x-default": urls.en };
}

/** Title, description, canonical URL, hreflang and share-card tags for a page. */
export function pageMetadata(input: {
  locale: Locale;
  href: LocalizedHref;
  title: string;
  description: string;
  /** Uses the title as is, without the "— Exploring Venezuela" suffix. */
  absoluteTitle?: boolean;
  image?: { url: string; width: number; height: number };
}): Metadata {
  const { locale, href, title, description } = input;
  const url = localizedUrl(locale, href);
  const image = input.image ?? DEFAULT_IMAGE;
  return {
    title: input.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(href) },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: locale === "es" ? "es_VE" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_VE",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
