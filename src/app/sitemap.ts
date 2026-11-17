import type { MetadataRoute } from "next";
import { getDestinations, getGuideArticles } from "@/data";
import {
  languageAlternates,
  localizedUrl,
  type LocalizedHref,
} from "@/lib/seo/metadata";
import { LOCALES } from "@/lib/types";

/** Every public page in both languages, each pointing at its translation. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, articles] = await Promise.all([
    getDestinations(),
    getGuideArticles(),
  ]);

  const pages: LocalizedHref[] = [
    () => "/",
    () => "/destinations",
    ...destinations.map((d): LocalizedHref => (l) => ({
      pathname: "/destinations/[slug]",
      params: { slug: d.slug[l] },
    })),
    () => "/plan",
    () => "/guide",
    ...articles.map((a): LocalizedHref => (l) => ({
      pathname: "/guide/[slug]",
      params: { slug: a.slug[l] },
    })),
    () => "/weddings",
    () => "/about",
    () => "/contact",
    () => "/privacy",
    () => "/terms",
  ];

  return pages.flatMap((href) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(locale, href),
      alternates: { languages: languageAlternates(href) },
    })),
  );
}
