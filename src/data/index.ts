/**
 * Data-access layer. Pages and components read content ONLY through these
 * functions, never from `src/content` directly. They are async on purpose:
 * swapping the typed files for a database or CMS later means changing the
 * function bodies here and nothing else.
 */
import { catalog } from "@/content/catalog";
import { destinations } from "@/content/destinations";
import { faqs } from "@/content/faq";
import { guideArticles } from "@/content/guide";
import { legal, type LegalPage } from "@/content/legal";
import type {
  CatalogItem,
  Destination,
  Faq,
  GuideArticle,
  ItemCategory,
  Locale,
} from "@/lib/types";

export async function getDestinations(): Promise<Destination[]> {
  return destinations;
}

/** Finds a destination by id, or by its slug in the given locale. */
export async function getDestination(
  idOrSlug: string,
  locale?: Locale,
): Promise<Destination | null> {
  return (
    destinations.find(
      (d) => d.id === idOrSlug || (locale && d.slug[locale] === idOrSlug),
    ) ?? null
  );
}

/**
 * Catalog items, optionally narrowed. With `destinationIds`, trip-wide items
 * (those with no destination) are included too.
 */
export async function getCatalogItems(opts?: {
  destinationIds?: string[];
  category?: ItemCategory;
}): Promise<CatalogItem[]> {
  return catalog.filter((item) => {
    if (opts?.category && item.category !== opts.category) return false;
    if (opts?.destinationIds) {
      const tripWide = item.destinationIds.length === 0;
      const matches = item.destinationIds.some((id) =>
        opts.destinationIds!.includes(id),
      );
      if (!tripWide && !matches) return false;
    }
    return true;
  });
}

export async function getCatalogItem(id: string): Promise<CatalogItem | null> {
  return catalog.find((item) => item.id === id) ?? null;
}

export async function getFaqs(ids?: string[]): Promise<Faq[]> {
  if (!ids) return faqs;
  return ids.flatMap((id) => faqs.find((f) => f.id === id) ?? []);
}

export async function getGuideArticles(): Promise<GuideArticle[]> {
  return guideArticles;
}

export async function getGuideArticle(
  idOrSlug: string,
  locale?: Locale,
): Promise<GuideArticle | null> {
  return (
    guideArticles.find(
      (a) => a.id === idOrSlug || (locale && a.slug[locale] === idOrSlug),
    ) ?? null
  );
}

/**
 * Slugs that differ by language, for the language toggle, hreflang and the
 * sitemap. Keyed by route, then by entity id.
 */
export async function getSlugMap(): Promise<
  Record<"destinations" | "guide", Record<string, Record<Locale, string>>>
> {
  return {
    destinations: Object.fromEntries(destinations.map((d) => [d.id, d.slug])),
    guide: Object.fromEntries(guideArticles.map((a) => [a.id, a.slug])),
  };
}

export async function getLegalPage(
  id: "privacy" | "terms",
): Promise<LegalPage> {
  return legal[id];
}
