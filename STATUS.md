# Status

## Done

**Phase 0 — Scaffold.** Next.js 16 (App Router, Cache Components on), TypeScript strict, Tailwind 4, next-intl, motion, zod, vitest, PostHog. Fonts are self-hosted (`src/fonts`).

**Phase 1 — Design system and shell.** Tokens in `src/app/globals.css`. Header (transparent over the hero, solid after scroll, full-screen mobile menu), footer, language toggle, demo notice, buttons, tooltip, scroll reveal, media slot, localized 404. Reference page at `/en/styleguide`.

**Phase 2 — Data layer and logic.** Types, typed content, zod validation, data-access layer, pricing engine, WhatsApp message builder, language detection, `track()`. 54 unit tests pass.

**Phase 3 — Home.** Hero video, trust strip, destination showcase, how it works, guide teaser, weddings teaser, closing call to action. English and Spanish.

**Phase 4 — Destinations.** Index page and the five destination pages from one template: hero, at a glance, highlights, sample packages, activities, FAQs. "Start with this trip" and "Add to my trip" open the builder with that choice applied.

**Phase 5 — Quote builder (`/plan`).** Six steps (group, where, what, transport, extras, review), live estimate (sticky summary on desktop, bottom bar on phones), nights per destination, one package per destination, participants and quantity controls, Spanish WhatsApp message preview, Send on WhatsApp, Copy message, Start over. The draft survives a refresh (sessionStorage) and links such as `/plan?destination=los-roques&package=los-roques-package-a` merge into it.

Checks: build, lint, type check and 55 unit tests are clean. Walked through in a browser in both languages at 390 and 1440 px: a two-destination trip for 4 travelers came to the expected $102, the WhatsApp link carried exactly the previewed message, the draft survived a reload, and a prefilled link added to the saved draft without wiping it.

## Review gate: quote builder

Try the builder end to end before phase 6. Things worth an opinion: the order of the steps, the wording of the WhatsApp message, and whether the placeholder items resemble what the agency really sells.

## Next

- **Phase 6:** guide, about, weddings, contact, legal.
- **Phase 7:** SEO, hreflang, JSON-LD, sitemap, robots, `llms.txt`, analytics checks.
- **Phase 8:** polish, QA, Vercel preview (review gate).

Pages for phase 6 exist as "in progress" stand-ins so navigation works.

## Decisions and deviations from the plan

- **Line explanations are structured.** `QuoteLine.factors` (travelers, nights, units…) replaces the plan's `multiplierExplanation` string, so the same line can be explained in English on screen and in Spanish in the WhatsApp message. `formatFactors()` turns it into text.
- **Demo notice is a small floating pill**, not a bar across the top, so it does not sit on the hero video.
- **Unknown slugs get a real 404 from `src/proxy.ts`.** With Cache Components, `notFound()` inside a streamed page shows the 404 page but answers 200, so the proxy checks destination and guide slugs first.
- **next-intl's automatic `Link` hreflang header is off.** It cannot translate slugs that differ by language. hreflang goes into page metadata in phase 7.
- **Coral buttons use dark text.** White on coral fails AA contrast.
- **A deeper turquoise (`lagoon`) is used for text**; the brand turquoise is too light for small text on ivory.
- **A prefilled link opens on step 1 for a new visitor.** The choice is already in the summary; group size comes first so prices are right. Returning visitors land on the "What" step.
- **Children count as travelers** for pricing, as the plan says. Child pricing is a later decision.
- **PostHog uses in-memory persistence** (no cookies). Revisit consent before production.

## Needs a human

- **Copy.** Headlines, trust-strip claims and destination descriptions are drafts. Confirm them with the agency.
- **Photos with recognisable people** (the Dos Mosquises turtle photos) are used on the Los Roques page (not on the home page). Get consent before the site is public.
- **Missing media.** Canaima, Margarita, Mérida, cruises and weddings show placeholders.
- **Guide content** is outlines only, flagged to verify.
- **Brand name.** "Exploring Venezuela" is tentative; it lives in `src/content/site.ts`.
