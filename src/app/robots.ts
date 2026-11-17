import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Search and AI crawlers we explicitly welcome, so the agency can be found in AI answers too. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

/**
 * Crawling is allowed everywhere. While the site is a demo, indexing is
 * blocked separately with `noindex` (meta tag and X-Robots-Tag header), which
 * crawlers can only see if they are allowed to fetch the pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/en/styleguide", "/es/styleguide"],
      },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
