# Status

## Done

**Phase 0 — Scaffold.** Next.js 16 (App Router, Cache Components on), TypeScript strict, Tailwind 4, next-intl, motion, zod, vitest, PostHog. Fonts are self-hosted (`src/fonts`).

**Phase 1 — Design system and shell.** Tokens in `src/app/globals.css`. Header (transparent over the hero, solid after scroll, full-screen mobile menu), footer, language toggle, demo notice, buttons, tooltip, scroll reveal, media slot, localized 404. Reference page at `/en/styleguide`.

**Phase 2 — Data layer and logic.** Types, typed content, zod validation, data-access layer, pricing engine, WhatsApp message builder, language detection, `track()`. 54 unit tests pass.

**Phase 3 — Home.** Hero video, trust strip, destination showcase, how it works, guide teaser, weddings teaser, closing call to action. English and Spanish.

Checks: `pnpm build`, `pnpm lint`, `pnpm typecheck` and `pnpm test` are clean. Checked in a browser at 390, 820 and 1440 px wide: language toggle (including `cruises` ↔ `cruceros`), root redirect order, skip link, reduced motion (videos never load), no horizontal overflow.

## Review gate: design

The look set on the home page is reused by every page after it. Review it before phase 4.

## Next

- **Phase 4:** destinations index and the five destination pages.
- **Phase 5:** quote builder (review gate).
- **Phase 6:** guide, about, weddings, contact, legal.
- **Phase 7:** SEO, hreflang, JSON-LD, sitemap, robots, `llms.txt`, analytics checks.
- **Phase 8:** polish, QA, Vercel preview (review gate).

Pages for phases 4–6 exist as "in progress" stand-ins so navigation works.

## Decisions and deviations from the plan

- **Line explanations are structured.** `QuoteLine.factors` (travelers, nights, units…) replaces the plan's `multiplierExplanation` string, so the same line can be explained in English on screen and in Spanish in the WhatsApp message. `formatFactors()` turns it into text.
- **Demo notice is a small floating pill**, not a bar across the top, so it does not sit on the hero video.
- **Unknown slugs get a real 404 from `src/proxy.ts`.** With Cache Components, `notFound()` inside a streamed page shows the 404 page but answers 200, so the proxy checks destination and guide slugs first.
- **next-intl's automatic `Link` hreflang header is off.** It cannot translate slugs that differ by language. hreflang goes into page metadata in phase 7.
- **Coral buttons use dark text.** White on coral fails AA contrast.
- **A deeper turquoise (`lagoon`) is used for text**; the brand turquoise is too light for small text on ivory.
- **PostHog uses in-memory persistence** (no cookies). Revisit consent before production.

## Needs a human

- **Copy.** Headlines, trust-strip claims and destination descriptions are drafts. Confirm them with the agency.
- **Photos with recognisable people** (the Dos Mosquises turtle photos) are in `public/media/los-roques/` for the Los Roques page and are not used on the home page. Get consent before the site is public.
- **Missing media.** Canaima, Margarita, Mérida, cruises and weddings show placeholders.
- **Guide content** is outlines only, flagged to verify.
- **Brand name.** "Exploring Venezuela" is tentative; it lives in `src/content/site.ts`.
