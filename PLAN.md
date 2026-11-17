# Exploring Venezuela by Guía Travel Group — Demo Site Implementation Plan

> Working name: **Exploring Venezuela** (operated by **Guía Travel Group**). The brand name is tentative and must live in a single config file so it can change in one place.

---

## 0. How to use this document (read first)

This plan is for the model implementing the site (and for the developer reviewing it).

- Read the whole document before writing code.
- Build **phase by phase** (section 14). After each phase: run the checks listed for it, commit, write a short status note in `STATUS.md`, and **stop for review** where the phase says so.
- Do **not** invent business facts: prices, package contents, safety statements, entry requirements, testimonials, team bios. Use the placeholder system in section 7.
- Anything marked **LOCKED** is a decision already made with the developer. Don't revisit it. If you think a locked decision is a mistake, say so in your phase report and keep going with the locked choice.
- When a Next.js, next-intl, PostHog or Tailwind API is involved, **check the current official docs** instead of relying on memory. File conventions (for example `middleware` vs `proxy`) change between major versions.
- Prefer simple, boring code. No dependencies beyond those named here without a stated reason in `STATUS.md`.

Project directory: `/Users/danielcamejo/Coding/guiatravelgroup` (scaffold here; it may be empty or contain only this file).

---

## 1. Product summary

**What it is.** A bilingual (English/Spanish) marketing and trip-planning website for Guía Travel Group, a Venezuela-based travel agency that runs trips to Los Roques, Canaima (Angel Falls), Margarita, Mérida and cruises, and also offers transport and weddings. The agency currently works entirely through WhatsApp and has no website.

**Who it's for.** Primarily foreigners considering Venezuela, who need confidence that a trip is possible and well organised. Secondarily the Venezuelan diaspora and Spanish-speaking travelers.

**The core experience.**
1. A visitor is inspired by cinematic imagery of Venezuela's nature.
2. They understand how a trip works and feel confident.
3. They build a trip in the **quote builder**, see a live **estimated** cost, and tap one button that opens WhatsApp with a **pre-written message** to the agency owner (Elizabeth). She only reviews and confirms.

**The developer's aim.** He is Venezuelan and wants to be able to tell anyone "you should go to Venezuela" and send them this link. The site should reduce friction and build confidence. It must feel premium, chic and unique, not like a template.

**This build is a demo** to show Elizabeth on a Vercel preview URL. She will react to it and then decide on features (including a backend for editing prices).

---

## 2. Locked decisions

| Area | Decision |
|---|---|
| Framework | Next.js (latest stable, App Router), React, TypeScript (strict) |
| Styling | Tailwind CSS |
| Backend / DB | **None for the demo.** Content, catalog and prices are typed data files behind a data-access layer (section 8). |
| Languages | English + Spanish from day one, localized URLs, hreflang |
| Currency | USD only |
| Analytics | PostHog behind a `track()` wrapper (section 11) |
| Hosting | Vercel preview URL. No custom domain yet. |
| Contact channel | WhatsApp deep link with pre-filled Spanish message |
| Prices | Placeholders ($1 amounts) so logic works. Clearly marked as demo. |
| Armored transport | Not on the homepage or trust strip. A quiet, optional mention only inside the builder's transport step (tooltip) and in the FAQ/guide. |
| Python service | Not needed. If a backend is added later it lives inside this Next.js project (route handlers / server actions). |

---

## 3. Non-goals for the demo

No authentication, admin panel, CMS, database, payments, real booking or availability, children's pricing, seasonal pricing, blog, reviews system, or multi-currency. Don't build them or stub them with fake UI. The data layer must make adding them later easy (section 16).

---

## 4. Tech stack and conventions

- **Next.js** App Router, **TypeScript strict**, no `any`.
- **Tailwind CSS** with design tokens in the theme (section 6).
- **i18n:** `next-intl` (check current docs for routing, `pathnames`, and the root-redirect/detection file convention for the installed Next version).
- **Animation:** `motion` (Framer Motion). Respect `prefers-reduced-motion`.
- **Validation / data:** `zod` for validating the catalog data at build/test time.
- **Tests:** `vitest` for unit tests (pricing engine, WhatsApp message builder, locale detection helper). One Playwright smoke test is optional, not required.
- **Fonts:** `next/font/local` with self-hosted variable font files (from the `@fontsource-variable` packages, copied into `src/fonts`), so builds need no network font fetch. Display: **Fraunces**. Body: **Manrope**. Both must render Spanish accents correctly.
- **Lint/format:** ESLint (Next config) + Prettier.
- **Package manager:** pnpm (or npm if pnpm is unavailable). Commit the lockfile.
- **Git:** initialise a repo if absent. One commit per phase minimum, conventional messages.
- **Images:** `next/image` for all raster images. Video via a custom `<MediaSlot>` (section 12).

Suggested structure (adjust to the installed Next/next-intl conventions):

```
src/
  app/[locale]/...              # routes
  components/
    ui/                         # Button, Tooltip, Badge, Section, etc.
    layout/                     # Header, Footer, LanguageToggle, DemoBanner
    media/MediaSlot.tsx
    home/ destinations/ plan/ guide/
  content/                      # typed data (the "demo database")
    site.ts                     # brand, contact, social, WhatsApp config
    destinations.ts
    catalog.ts                  # packages, activities, transport, extras
    guide.ts
    faq.ts
  data/                         # data-access layer (the ONLY thing pages import)
    index.ts
  lib/
    pricing/                    # engine + tests
    whatsapp/                   # message builder + tests
    analytics/track.ts
    seo/ (jsonld.ts, metadata.ts)
    i18n/ (routing, detection)
  messages/en.json, es.json
public/media/<slug>/            # real photos/videos land here
```

---

## 5. Information architecture and routes

All pages exist in both locales with **localized slugs**. Use next-intl `pathnames`.

| Page | EN | ES |
|---|---|---|
| Root | `/` → redirect (section 9) | |
| Home | `/en` | `/es` |
| Destinations index | `/en/destinations` | `/es/destinos` |
| Destination detail | `/en/destinations/[slug]` | `/es/destinos/[slug]` |
| Plan (quote builder) | `/en/plan` | `/es/planifica` |
| Guide hub | `/en/guide` | `/es/guia` |
| Guide article | `/en/guide/[slug]` | `/es/guia/[slug]` |
| Weddings | `/en/weddings` | `/es/bodas` |
| About | `/en/about` | `/es/nosotros` |
| Contact | `/en/contact` | `/es/contacto` |
| Privacy / Terms | `/en/privacy`, `/en/terms` | `/es/privacidad`, `/es/terminos` |

Destination slugs: `los-roques`, `canaima`, `margarita`, `merida`, `cruises` (ES slug for cruises: `cruceros`; others unchanged). Guide articles: `getting-there` / `como-llegar`, `money` / `dinero`, `getting-around` / `moverse`, `when-to-go` / `cuando-ir`.

Also: `not-found` page (both locales), `sitemap.xml`, `robots.txt`, `llms.txt`.

**Navigation:** Destinations, Plan your trip, Guide, Weddings, About, Contact. Persistent language toggle. Primary CTA "Plan my trip" / "Planifica tu viaje".

---

## 6. Design system

**Direction: chic, nature-led, editorial.** Think boutique resort / high-end travel magazine. Venezuela's landscapes (Los Roques' water, Angel Falls, Canaima's tepuis, beaches, the Andes) are the luxury; the interface stays quiet and lets imagery lead. Not a "Venezuelan home" feel and not a flag-colour treatment.

**Tokens (starting point; define as Tailwind theme colors):**

| Token | Hex | Use |
|---|---|---|
| `ivory` | `#FAF7F2` | page background |
| `ocean` | `#0A2A3A` | text, dark overlays, footer |
| `turquoise` | `#2BB5B8` | primary accent, links, focus |
| `sand` | `#E9DCC7` | soft section backgrounds, hairlines |
| `coral` | `#FF6B3D` | primary CTA only; use sparingly |

Add neutral steps derived from ocean/sand for borders and muted text. Each destination may define an `accent` colour used in its cards and page details.

**Typography.** Fraunces for headlines (light/regular weights, generous size, tight leading). Manrope for body. Small uppercase labels with wide tracking (`tracking-[0.2em]`, text-xs) for eyebrows and metadata. Fluid type scale.

**Layout and feel.** 12-column grid, generous whitespace, large full-bleed imagery, hairline borders, small radii (4–8px), very light shadows. No heavy gradients, no stock-template card grids with drop shadows, no emoji in UI chrome. Photography is cropped large and confidently.

**Motion.** Restrained and purposeful: scroll reveals, smooth page/section transitions, hover video previews on destination cards, a gentle parallax on the hero at most. All motion disabled or simplified under `prefers-reduced-motion`.

**Accessibility.** WCAG AA contrast (check text over video with a scrim), visible focus rings, keyboard-complete builder, semantic landmarks, alt text via the media slot labels, `lang` attribute per locale.

**Mobile first.** Most visitors arrive from WhatsApp/Instagram on phones. Design mobile first; desktop enhances.

**Core components:** `Header` (transparent over hero, solid ivory after scroll), `Footer`, `LanguageToggle`, `DemoBanner`, `Button` (primary coral / secondary outline / ghost), `Eyebrow`, `Section`, `MediaSlot`, `DestinationCard` (tall, video preview on hover/tap), `PackageCard`, `StepIndicator`, `Tooltip`, `FaqAccordion`, `TrustStrip`, `PriceTag` (always shows the estimate qualifier where relevant).

### Home page sections (in order)

1. **Hero:** full-viewport video slot with scrim, short confident headline, one-line subhead, primary CTA "Plan my trip", secondary "Explore destinations". Transparent header on top.
2. **Trust strip:** local team · English and Spanish · airport pickup and private transfers · tailored itineraries · direct WhatsApp. (No armored-transport mention here.)
3. **Destinations:** immersive row of tall cards (Los Roques, Canaima, Margarita, Mérida, Cruises). Each links to its page. Video preview plays on hover with a mouse; on touch devices it plays when the card scrolls into view, and a tap always navigates.
4. **How it works:** three steps: choose your trip → see an estimate → confirm on WhatsApp.
5. **Going to Venezuela?** confidence section teasing the guide (getting there, money, getting around, when to go) with links.
6. **Weddings teaser.**
7. **Closing CTA band** and footer.

Draft copy lives in `messages/*.json`. Write it in a warm, first-person voice, **natively** in each language (not word-for-word translation). Keep copy short.

### Destination page template (all five)

Hero media, tagline, **At a glance** (best time to go, typical stay, how to get there: all `VERIFY` placeholders), highlights (3–6, each with a media slot), **sample packages** (from catalog; "Start with this trip" → `/plan?destination=…&package=…`), **activities** (from catalog; "Add to my trip"), 3–5 FAQs (also emitted as FAQPage JSON-LD), closing CTA. Cruises and Mérida use the same template.

---

## 7. Content and placeholder policy

**The rule: never present invented facts as real.**

- `NEXT_PUBLIC_DEMO=true` shows a slim, dismissible `DemoBanner` ("Demo — prices and details are placeholders") and prefixes the WhatsApp message with a demo line.
- Prices are `$1`-style placeholders. Package names and contents are obviously generic ("Los Roques package — placeholder") and live in data files, easy to replace.
- **Safety, entry requirements, flights, money and connectivity content** must not be asserted as fact. Draft the guide articles as structured outlines with short placeholder text, and render a visible `VERIFY` badge on every statement that needs checking by a human against official sources. In demo mode these badges are visible.
- Testimonials, team names, counts ("500+ travelers"), awards, and certifications: **do not invent**. Use clearly marked placeholder slots.
- Armored/secure vehicle: in the builder's transport step show a quiet tooltip/inline note such as "Need extra peace of mind? Ask us about secure vehicle options." Mention it in the FAQ/guide only.
- WhatsApp number comes from an env var. Never hardcode a phone number in source or in this plan.

---

## 8. Data model and data-access layer

Design principle: **pages and components never import from `content/` directly.** They call functions in `data/index.ts`. Later, those functions can read from a database with no other code changes.

```ts
export type Locale = 'en' | 'es';
export type Localized = Record<Locale, string>;

export type PricingUnit =
  | 'per_person'
  | 'per_group'
  | 'per_vehicle'
  | 'per_night'
  | 'per_person_per_night';

export interface Pricing {
  unit: PricingUnit;
  amountUsd: number;          // placeholder values in demo
  capacity?: number;          // people per unit. Required for 'per_vehicle' (seats);
                              // optional for 'per_night' (people per room; omitted = one unit for the group)
  minTravelers?: number;
  maxTravelers?: number;
}

export type ItemCategory = 'package' | 'activity' | 'transport' | 'extra';

export interface CatalogItem {
  id: string;                  // stable, e.g. 'lr-package-classic'
  category: ItemCategory;
  destinationIds: string[];    // empty array = available everywhere (e.g. airport pickup)
  name: Localized;
  description: Localized;
  pricing: Pricing;
  allowQuantity?: boolean;     // e.g. 2 sessions
  includes?: Localized[];      // for packages: what's included (placeholder text)
  media?: string;              // MediaSlot key
  isPlaceholder: boolean;      // true for all demo items
}

export interface Destination {
  id: string;                  // 'los-roques' ...
  slug: Localized;
  name: Localized;
  tagline: Localized;
  accent: string;              // hex
  atAGlance: { label: Localized; value: Localized; verify: boolean }[];
  highlights: { title: Localized; text: Localized; media: string }[];
  faqIds: string[];
  heroMedia: string;
}

export interface QuoteSelection {
  itemId: string;
  destinationId?: string;   // the destination this item was added under; undefined for trip-wide items
  quantity: number;
  participants?: number;    // per_person items only; defaults to all travelers, can be lowered
}

export interface QuoteDraft {
  locale: Locale;
  travelers: { adults: number; children: number };
  startDate?: string;                         // ISO date (date-only arithmetic, no time zones)
  flexibleDates: boolean;
  destinationIds: string[];
  nightsByDestination: Record<string, number>; // nights are per destination; trip nights = their sum
  selections: QuoteSelection[];
  name?: string;                              // optional, included in message
  notes?: string;
}

export interface QuoteLine {
  itemId: string;
  label: Localized;
  unit: PricingUnit;
  quantity: number;
  factors: LineFactors;            // structured (travelers, nights, units, quantity) so the line can be
                                   // explained in any language, e.g. "2 travelers × 4 nights"
  subtotalUsd: number;
  unavailableReason?: string;
}

export interface QuoteResult {
  lines: QuoteLine[];
  totalUsd: number;
  nights: number;
  travelers: number;
}
```

**Data-access functions (the demo implementation reads typed files; keep signatures stable):**

```ts
getDestinations(): Promise<Destination[]>
getDestination(idOrSlug: string, locale: Locale): Promise<Destination | null>
getCatalogItems(opts?: { destinationIds?: string[]; category?: ItemCategory }): Promise<CatalogItem[]>
getCatalogItem(id: string): Promise<CatalogItem | null>
getFaqs(ids: string[]): Promise<Faq[]>
getGuideArticles(locale: Locale): Promise<GuideArticle[]>
```

They are `async` on purpose so a database or CMS can replace the files later.

**Demo catalog (all placeholder, `$1`-style amounts).** For each destination include: 2 packages, 3 activities (varied pricing units: per person, per group, per night), plus shared items: airport pickup (per vehicle, capacity 4), ground transfer (per vehicle), extra night (per night), a per-person extra. Names must read as placeholders (for example "Los Roques package A (placeholder)"). Validate every item with `zod` in a test: `capacity` present for `per_vehicle`, ids unique, both locales filled.

**Package rule:** at most one package per destination. Choosing a second package for the same destination replaces the first.

---

## 9. Internationalization and locale detection

- Locales: `en`, `es`. Default `en`.
- Localized pathnames as in section 5. Switching language keeps the user on the equivalent page.
- **Root (`/`) only** is redirected, using this order: (1) locale cookie from a prior choice, (2) `Accept-Language`, (3) country from the hosting platform's geo header (on Vercel `x-vercel-ip-country`; Spanish-speaking countries map to `es`), (4) default `en`.
- **Never redirect other URLs by IP or language**, and never redirect crawlers away from either locale. Every localized URL must be crawlable.
- Emit `hreflang` alternates (`en`, `es`, `x-default`) and canonical URLs on every page.
- The toggle sets the cookie. Unit-test the detection helper (cookie > Accept-Language > country > default).
- **Dynamic slugs differ by language** (`cruises`/`cruceros`, every guide article). The i18n library's `pathnames` only localizes static segments, so the language toggle, `hreflang` alternates and the sitemap must translate dynamic slugs through the data layer (look the entity up by its current-locale slug, emit its other-locale slug).
- Strings live in `messages/en.json` and `messages/es.json`. No hardcoded user-visible strings in components. Spanish is written natively, not machine-literal.

---

## 10. Quote builder (`/plan`)

The builder is the product. It builds a trip, shows a live **estimate**, and produces the WhatsApp message.

### Steps

1. **Group and dates.** Adults, children (counted as travelers for pricing in the demo), an optional start date with a "my dates are flexible" toggle. Optional name. Collected first so every price shown is already correct for them.
2. **Where.** Pick one or more destinations (visual cards) and set **nights for each one** (sensible default, for example 3). Multiple allowed; items are grouped by destination. Trip length is the sum; the end date is derived from the start date.
3. **What.** Packages and activities for the chosen destinations. At most one package per destination (a new choice replaces the old one); activities and extras are additive. Per-person activities let the traveler lower the number of participants (for example 2 of 4).
4. **Transport.** Airport pickup, transfers, between-destination moves (placeholders). Include the quiet "Need extra peace of mind? Ask us about secure vehicle options." tooltip here.
5. **Extras.** Anything else from the catalog.
6. **Review.** Full itemized estimate, the Spanish WhatsApp message preview, the disclaimer, and the **Send on WhatsApp** button. Also a **Copy message** fallback.

A **live summary** ("Your trip") stays visible: sticky sidebar on desktop, collapsible bottom bar on mobile. It shows items, per-line subtotals and the running **Estimated total**.

### Behavior rules

- Prefill from the URL: `/plan?destination=los-roques&package=lr-package-a` jumps to a sensible step with that selection applied. URL parameters are **merged into** any saved draft (add the destination/item); they never wipe it.
- If `NEXT_PUBLIC_WHATSAPP_NUMBER` is unset, the Send button is disabled with a short explanation and **Copy message** becomes the primary action. Never render a broken `wa.me` link.
- Persist the draft in `sessionStorage` (wrapped in try/catch; storage may be unavailable). Offer "Start over".
- Back/next navigation, a step indicator, keyboard accessible, no dead ends. Users can jump between completed steps.
- Items unavailable for the party size (min/max travelers) are shown disabled with a reason.
- Validation: travelers ≥ 1 (cap at a sensible max such as 20), nights ≥ 1 per destination, quantity ≥ 1 where allowed, 1 ≤ participants ≤ travelers.
- The estimate always carries the qualifier: **"Estimated total. This is an estimate; Elizabeth will confirm the exact price on WhatsApp and it may be higher or lower."** (Provide natural Spanish.) The qualifier appears next to every displayed total, in the summary, and in the message.
- Format money with `Intl.NumberFormat` per locale, whole dollars unless cents exist.
- Show a line multiplier explanation (for example "2 travelers × 4 nights") so the math is transparent.

### Pricing engine (`lib/pricing`)

Pure functions, fully unit-tested.

| Unit | Formula |
|---|---|
| `per_person` | amount × participants × quantity (participants defaults to all travelers) |
| `per_group` | amount × quantity |
| `per_vehicle` | amount × ceil(travelers / capacity) × quantity |
| `per_night` | amount × nights × units × quantity, where units = ceil(travelers / capacity), or 1 when capacity is omitted |
| `per_person_per_night` | amount × travelers × nights × quantity |

`nights` for a line is the nights of **the destination the item was added under** (`selection.destinationId`); trip-wide items (no destination) use the total trip nights. Round to cents at the line level. Tests must cover: each unit, quantity, participants, vehicle and room rounding (1, 4, 5, 8, 9 travelers with capacity 4), a two-destination trip with different nights, min/max travelers, empty selection, package replacement, and total equals the sum of lines.

### WhatsApp message (`lib/whatsapp`)

- Link: `https://wa.me/<digits>?text=<encodeURIComponent(message)>`, where `<digits>` is `NEXT_PUBLIC_WHATSAPP_NUMBER` (international format, digits only).
- **The message is written in Spanish** for Elizabeth, with one line noting the traveler's language. Template (adapt wording, keep structure):

```
Hola Guía Travel Group,
Quisiera solicitar una cotización.

Nombre: {name | "—"}
Destino(s): {destinations}
Viajeros: {adults} adulto(s), {children} niño(s)
Fechas: {start date → end date | "Flexibles"} ({total nights} noches)
Noches por destino: {destination: nights, ...}   (only when more than one destination)

Servicios:
- {item} — {multiplierExplanation} = ${subtotal}
- ...

Total estimado: ${total} USD
(Estimado. Sujeto a confirmación del precio final.)

Idioma del viajero: {English|Español}
Notas: {notes | "—"}
Enviado desde {site url}
```

- In demo mode, prepend `[DEMO — precios de prueba]`.
- Keep the final URL well under common limits (target a message under ~1,500 characters). If it would be longer, drop item descriptions first and keep the totals. Always offer **Copy message** as a fallback.
- Unit-test the builder: both traveler locales, flexible vs fixed dates, many items (truncation), special characters (accents, `&`, newlines).

### Analytics events (section 11) fire from the builder: started, step completed, item added/removed, WhatsApp clicked, message copied.

---

## 11. Analytics

- `lib/analytics/track.ts` exposes `track(event, props?)`. Without a PostHog key it logs to the console in development and does nothing in production.
- With `NEXT_PUBLIC_POSTHOG_KEY`, initialise PostHog on the client. For the demo use cookieless/in-memory persistence so no consent banner is required; note in `STATUS.md` that consent must be revisited before production.
- **No personal data** in events (no names, notes, phone numbers).
- Events: `page_view` (automatic), `language_toggled`, `destination_viewed {id}`, `cta_clicked {location}`, `plan_started`, `plan_step_completed {step}`, `item_added {id, category}`, `item_removed {id}`, `whatsapp_clicked {destinations, itemCount, estimateBucket, locale}`, `message_copied`.
- `estimateBucket` is a coarse range (for example `<500`, `500-1000`) so the exact quote is never logged.

---

## 12. Media and the placeholder system

- `<MediaSlot>` props: `kind` (`video` | `image`), `slotKey`, `label` (Localized), `aspect`, optional `src`/`poster`, `priority`.
- **No file at `src` → render a tasteful labeled placeholder**, for example "VIDEO · Los Roques beach · 16:9". Keep it attractive (soft gradient from the destination's accent) but obviously a placeholder. Show only in demo mode; otherwise render nothing harmful.
- Real videos: `<video muted loop playsInline preload="none">` with `poster`, lazy loaded, paused when off-screen, never autoplaying under reduced motion. Provide WebM + MP4 sources when both exist.
- Real files go in `public/media/<destination-slug>/…`. For the demo, hero loops should be short (about 5–10 s), compressed, a few MB at most.
- Document in `README.md` how to add a real video/image: drop the file and fill `src` in one media manifest (`content/media.ts`). Swapping a placeholder for a real file must be a one-line change.
- Required slots (at minimum): home hero video; one hero per destination; 3–4 highlight images per destination; weddings hero and gallery (4); about hero; guide hub hero; destination card preview clips (5).
- Production later: object storage + CDN (for example Cloudflare R2) or a video service. Not in this build.
- **Real media supplied by the developer (Los Roques, August 2026):** a daytime drone video (home hero), a 360 video over clear water near sunset, an underwater snorkeling video by the reef, a drone photo of a sandbar, a beach photo, and two photos from the Dos Mosquises turtle sanctuary. Compress videos to short muted web loops with poster frames. Photos showing recognisable people need those people's consent before the site goes public; prefer landscape shots for prominent slots.

---

## 13. SEO and AI visibility

- `generateMetadata` on every page: localized title/description, canonical, `hreflang` alternates, Open Graph/Twitter. Use `next/og` for share images.
- JSON-LD: `TravelAgency` (sitewide, with placeholder `sameAs`), `BreadcrumbList`, `TouristDestination` on destination pages, `FAQPage` where FAQs render, `Article` on guide articles.
- `app/sitemap.ts` listing every localized URL with alternates. `app/robots.ts` explicitly allows major search and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) and points to the sitemap.
- `llms.txt` route: concise, structured description of the site, key pages in both languages, and what the agency offers (no invented facts).
- **Demo only:** when `NEXT_PUBLIC_DEMO=true`, serve `noindex` (meta robots and `X-Robots-Tag`) so the preview isn't indexed. Production flips this off via env.
- Semantic HTML (one `h1` per page, ordered headings), descriptive link text, image alt text, fast mobile performance (lazy video, sized images, minimal client JS on content pages).
- Prefer static generation for content pages; the builder is a client component island.

---

## 14. Build phases

Each phase ends with its checks, a commit, and a `STATUS.md` update. **Stop and report after phases 3, 5 and 8** so the developer can review before continuing. Phase 2 is verified by its unit tests and reported together with phase 3. The phase 3 gate is the design review: the look established on the home page is reused everywhere after it.

### Phase 0 — Scaffold
Create the Next.js app (TypeScript, Tailwind, ESLint, App Router, `src/` dir). The scaffolder refuses a folder that already contains unrelated files such as `PLAN.md`, so scaffold in a temporary folder and move the result into the project directory. Add Prettier, vitest, zod, motion, next-intl, PostHog. Create `.env.example` (section 15), `.gitignore` (include `.env*.local`), `README.md` skeleton, `STATUS.md`.
**Done when:** `build`, `lint`, and `test` scripts run clean; dev server shows a placeholder page in both `/en` and `/es`.

### Phase 1 — Design system and shell
Tailwind tokens, fonts, `Header` (transparent→solid), `Footer`, `LanguageToggle`, `DemoBanner`, `Button`, `Section`, `Eyebrow`, `Tooltip`, `MediaSlot`, 404 page. Brand/config in `content/site.ts`.
**Done when:** every shell component renders on a style-guide route (`/en/styleguide`; not `_styleguide`, because underscore folders are private in the App Router; excluded from sitemap, noindex), responsive at 360/768/1280 widths, keyboard-navigable, language toggle works.

### Phase 2 — Data layer and pricing engine
Types, zod schemas, catalog and destination data (placeholders), `data/index.ts`, the pricing engine, the WhatsApp message builder, locale detection helper, `track()`.
**Done when:** unit tests pass for all items in section 10 (every pricing unit, vehicle rounding, message builder, locale detection) and the catalog validates. No UI beyond the style guide yet.

### Phase 3 — Home  ⟵ **review gate (design)**
All home sections (section 6) with real i18n copy drafts, `MediaSlot`s, destination cards with hover/tap preview, scroll reveals.
**Done when:** the home page is complete in EN and ES, passes keyboard and reduced-motion checks, and looks right at 360/768/1280.

### Phase 4 — Destinations
Index page and the destination template for all five, driven by the data layer. "Start with this trip" and "Add to my trip" link into `/plan`.
**Done when:** all five destinations render in both locales with localized slugs; FAQs render; links prefill the builder correctly.

### Phase 5 — Quote builder  ⟵ **review gate**
Full builder (section 10): steps, live summary, estimate qualifier, persistence, URL prefill, WhatsApp link, copy fallback, analytics events.
**Done when:** a traveler can complete a trip in EN and ES; totals match the pricing engine; the WhatsApp link opens with the correct Spanish message (verify with the developer's test number via `.env.local`); mobile layout works with the bottom summary bar; tests pass.

### Phase 6 — Guide, About, Weddings, Contact, Legal
Guide hub and four articles as outlined placeholders with `VERIFY` badges; About; Weddings (simple page with placeholder gallery and a WhatsApp CTA); Contact (WhatsApp-first); Privacy/Terms placeholders.
**Done when:** all pages exist in both locales with correct slugs and metadata, and no unverified statement is presented as fact.

### Phase 7 — SEO, AI visibility, analytics
Metadata and JSON-LD everywhere, sitemap, robots, `llms.txt`, demo `noindex`, OG images, PostHog wiring and event checks.
**Done when:** structured data validates, sitemap lists all localized URLs with alternates, `llms.txt` serves, `noindex` toggles with the env var, and events appear in the console (and in PostHog when a key is set).

### Phase 8 — Polish and QA  ⟵ **review gate**
Responsive pass, accessibility pass, performance pass, copy proofreading (EN and ES), empty/error states, README (how to run, how to add media, how to edit the catalog, how to deploy to Vercel, env vars). Deploy a Vercel preview.
**Done when:** the global acceptance checklist below passes.

---

## 15. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO=true
NEXT_PUBLIC_WHATSAPP_NUMBER=            # international format, digits only
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

Real values go in `.env.local` (git-ignored) and in the Vercel project settings.

---

## 16. After the demo (not in scope now)

- **Database and price admin.** Replace the bodies of the `data/` functions with database or CMS reads; add an authenticated page for the owner to edit prices and items. Keep it inside this Next.js project.
- Real content, photography and video; real prices; verified guide content.
- Weddings details, testimonials, children's and seasonal pricing, minimum stays.
- Custom domain registered under the business owner's control; production analytics consent; flip `NEXT_PUBLIC_DEMO` off.
- Video hosting on object storage/CDN.
- Ongoing SEO content (blog/journal).

---

## 17. Global acceptance checklist

- [ ] `build`, `lint`, `test` all pass; no TypeScript errors; no `any`.
- [ ] Every page exists in EN and ES with localized slugs, canonical and hreflang.
- [ ] Root redirect follows cookie → Accept-Language → country → default; other URLs never redirect by language.
- [ ] No hardcoded user-visible strings outside `messages/*.json` and data files.
- [ ] No invented facts; every placeholder is clearly marked; demo banner and message prefix show in demo mode.
- [ ] Estimate qualifier appears wherever a total is shown and in the WhatsApp message.
- [ ] WhatsApp message is in Spanish, itemized, includes traveler language, and stays within length limits with a copy fallback.
- [ ] All pricing units tested; totals equal the sum of lines.
- [ ] Armored transport is not on the homepage or trust strip.
- [ ] Keyboard-only and reduced-motion usage work; AA contrast over video via scrim.
- [ ] Mobile-first layouts verified at 360, 768 and 1280.
- [ ] Lighthouse (mobile) targets on key pages: Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 90, Performance ≥ 85 with lazy video.
- [ ] `noindex` on in demo, off via env for production.
- [ ] README explains running, media swap, catalog editing, env vars, deployment.

---

## 18. Open questions to confirm with Elizabeth (do not block the build)

1. Brand and domain: "Exploring Venezuela" as the public name, with Guía Travel Group as operator?
2. Real packages, activities, transport options and prices per destination; per-person vs per-group rules.
3. Whether children are priced differently; minimum group sizes; seasonality.
4. Wedding offering and what she wants shown.
5. Safety, entry and payment guidance she is comfortable publishing (and sources to cite).
6. Photos and videos she has, and permission to use them.
7. Preferred WhatsApp number and hours; whether Instagram should be linked.
8. How payments are taken from foreign travelers (affects the guide and any future checkout).
