# Status

## Done

**Phase 0 — Scaffold.** Next.js 16 (App Router, Cache Components on), TypeScript strict, Tailwind 4, next-intl, motion, zod, vitest, PostHog. Fonts are self-hosted (`src/fonts`).

**Phase 1 — Design system and shell.** Tokens in `src/app/globals.css`. Header (transparent over the hero, solid after scroll, full-screen mobile menu), footer, language toggle, demo notice, buttons, tooltip, scroll reveal, media slot, localized 404. Reference page at `/en/styleguide`.

**Phase 2 — Data layer and logic.** Types, typed content, zod validation, data-access layer, pricing engine, WhatsApp message builder, language detection, `track()`. 54 unit tests pass.

**Phase 3 — Home.** Hero video, trust strip, destination showcase, how it works, guide teaser, weddings teaser, closing call to action. English and Spanish.

**Phase 4 — Destinations.** Index page and the five destination pages from one template: hero, at a glance, highlights, sample packages, activities, FAQs. "Start with this trip" and "Add to my trip" open the builder with that choice applied.

**Phase 5 — Quote builder (`/plan`).** Six steps (group, where, what, transport, extras, review), live estimate (sticky summary on desktop, bottom bar on phones), nights per destination, one package per destination, participants and quantity controls, Spanish WhatsApp message preview, Send on WhatsApp, Copy message, Start over. The draft survives a refresh (sessionStorage) and links such as `/plan?destination=los-roques&package=los-roques-package-a` merge into it.

Builder walkthrough: walked through in a browser in both languages at 390 and 1440 px: a two-destination trip for 4 travelers came to the expected $102, the WhatsApp link carried exactly the previewed message, the draft survived a reload, and a prefilled link added to the saved draft without wiping it.

**Phase 6 — Remaining pages.** Guide hub and four guide articles (outlines flagged "To verify"), about, weddings (simple, with a placeholder gallery and a WhatsApp button), contact (WhatsApp first), privacy and terms (plain-language drafts).

**Phase 7 — SEO and AI visibility.** Every page has a localized title and description, canonical URL, hreflang (en, es, x-default) and share-card tags. Structured data: TravelAgency sitewide, TouristDestination and breadcrumbs on destinations, FAQPage for confirmed answers, Article on guide pages. `/sitemap.xml` (36 URLs with language alternates), `/robots.txt` (search and AI crawlers welcome), `/llms.txt`. While `NEXT_PUBLIC_DEMO` is on, pages carry `noindex` (meta tag and `X-Robots-Tag`).

**Phase 8 — Polish and QA.**

- All 23 page variants load without console errors or horizontal overflow at 390, 820 and 1440 px, each with one `h1`, the right `lang`, and alt text on every image.
- Lighthouse (mobile, production build, demo flag off): accessibility 100, best practices 100 and SEO 100 on the home page, Los Roques, the builder and the guide. Performance: home 99, guide 100, builder 82–87, Los Roques 73–83 across runs (the plan's target is 85; the low runs were on a cold image cache in a small sandbox, so re-measure on Vercel).
- With the demo flag on, SEO scores 69 because of the intended `noindex`.

## Not done

- **Vercel preview.** Deploying creates a project in the owner's Vercel account, so it waits for a go-ahead. README has the steps.
- **Share images** use the hero photo (or the destination's own photo) directly, not a generated card with text.

## Next (after the demo)

See section 16 of `PLAN.md`: real content and prices, a database with a price editor, the domain, production analytics consent.

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
