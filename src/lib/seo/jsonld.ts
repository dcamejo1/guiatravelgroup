import { site } from "@/content/site";
import type { Faq, Locale } from "@/lib/types";

type Thing = Record<string, unknown>;

const ORGANIZATION_ID = `${site.url}/#agency`;

/** Sitewide: who runs the site. Only facts we know; no invented contact details. */
export function travelAgencyLd(locale: Locale, description: string): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORGANIZATION_ID,
    name: site.operator,
    alternateName: site.name,
    url: `${site.url}/${locale}`,
    description,
    areaServed: { "@type": "Country", name: "Venezuela" },
    availableLanguage: ["en", "es"],
    ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function touristDestinationLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    containedInPlace: { "@type": "Country", name: "Venezuela" },
  };
}

/** Only answers that have been confirmed go into structured data. */
export function faqLd(faqs: Faq[], locale: Locale): Thing | null {
  const confirmed = faqs.filter((faq) => !faq.verify);
  if (confirmed.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: confirmed.map((faq) => ({
      "@type": "Question",
      name: faq.question[locale],
      acceptedAnswer: { "@type": "Answer", text: faq.answer[locale] },
    })),
  };
}

export function articleLd(input: {
  headline: string;
  description: string;
  url: string;
  locale: Locale;
}): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    inLanguage: input.locale,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}
