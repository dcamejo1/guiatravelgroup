import { site } from "@/content/site";
import { getDestinations, getGuideArticles } from "@/data";
import { localizedUrl } from "@/lib/seo/metadata";

/**
 * /llms.txt: a short, structured description of the site for AI assistants.
 * Built from the same data as the pages, so it never states anything the site
 * does not.
 */
export async function GET() {
  const [destinations, articles] = await Promise.all([
    getDestinations(),
    getGuideArticles(),
  ]);
  const both = (href: Parameters<typeof localizedUrl>[1]) =>
    `${localizedUrl("en", href)} (English), ${localizedUrl("es", href)} (Español)`;

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is the website of ${site.operator}, a travel agency based in Venezuela. It organises tailor-made trips within Venezuela (Los Roques, Canaima and Angel Falls, Margarita, Mérida) and Caribbean cruises, plus airport pickup, private transfers and weddings. Travelers build a trip on the site, see an estimated cost in USD, and send the request to the agency on WhatsApp. The site is available in English and Spanish.`,
    "",
    "Prices on the site are estimates. The agency confirms the final price directly with the traveler on WhatsApp; nothing is booked on the website itself.",
    ...(site.demo
      ? [
          "",
          "Note: this is a demo. Prices, packages and guide content are placeholders and must not be quoted as real.",
        ]
      : []),
    "",
    "## Destinations",
    ...destinations.map(
      (d) =>
        `- [${d.name.en}](${localizedUrl("en", (l) => ({ pathname: "/destinations/[slug]", params: { slug: d.slug[l] } }))}): ${d.kicker.en}. ${d.tagline.en} En español: ${localizedUrl("es", (l) => ({ pathname: "/destinations/[slug]", params: { slug: d.slug[l] } }))}`,
    ),
    "",
    "## Plan a trip",
    `- Trip builder with a live estimate: ${both(() => "/plan")}`,
    `- Contact (WhatsApp first): ${both(() => "/contact")}`,
    "",
    "## Travel guide",
    `- Guide overview: ${both(() => "/guide")}`,
    ...articles.map(
      (a) =>
        `- [${a.title.en}](${localizedUrl("en", (l) => ({ pathname: "/guide/[slug]", params: { slug: a.slug[l] } }))}): ${a.summary.en}`,
    ),
    "",
    "## About",
    `- About the agency: ${both(() => "/about")}`,
    `- Weddings: ${both(() => "/weddings")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
