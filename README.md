# Exploring Venezuela — Guía Travel Group

Bilingual (English/Spanish) demo site for Guía Travel Group. Visitors explore destinations, build a trip with a live estimate, and send it to the agency on WhatsApp as a pre-written message.

- `PLAN.md` is the full implementation plan.
- `STATUS.md` says what is built so far and what comes next.

## Run it

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`.

## Environment variables

| Variable                                              | Purpose                                                                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                | Public URL of the site, no trailing slash.                                                                                                       |
| `NEXT_PUBLIC_DEMO`                                    | `true` (default) shows the demo notice, marks WhatsApp messages as demo and blocks search indexing. Set to `false` for production.               |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                         | Number that receives quotes. International format, digits only. Use your own while testing. Without it, WhatsApp buttons are hidden or disabled. |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional analytics. Without a key, events are logged to the console in development.                                                              |

`.env.local` is git-ignored. Set the same variables in the Vercel project settings.

## Where things live

```
src/
  app/[locale]/        pages (every route exists in /en and /es)
  components/          UI, grouped by area
  content/             the "demo database": typed data files
  data/                data-access layer: the only thing pages import content through
  lib/pricing/         quote engine (+ tests)
  lib/whatsapp/        WhatsApp message builder (+ tests)
  lib/i18n/            routing, localized URLs, language detection
  lib/analytics/       track() wrapper around PostHog
  messages/            en.json / es.json interface copy
public/media/          photos and videos
```

## Add or replace a photo or video

1. Put the file in `public/media/<folder>/`.
2. Open `src/content/media.ts`, find the slot, and set `src` (plus `poster` for a video, and `srcMobile` if you have a smaller version).

A slot without `src` renders a labeled placeholder in demo mode, so nothing breaks while media is missing.

Videos should be short, muted loops. To compress one:

```bash
ffmpeg -i input.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 27 \
  -pix_fmt yuv420p -movflags +faststart output.mp4
ffmpeg -ss 3 -i input.mp4 -frames:v 1 -q:v 3 poster.jpg
```

## Edit destinations, packages and prices

Everything is in `src/content/`:

- `destinations.ts`: names, taglines, highlights, at-a-glance facts.
- `catalog.ts`: packages, activities, transport and extras, each with a pricing unit (`per_person`, `per_group`, `per_vehicle`, `per_night`, `per_person_per_night`).
- `guide.ts`, `faq.ts`: guide outlines and FAQs.

All prices and package details are placeholders right now. Run `pnpm test` after editing: the content tests check the data is valid.

When the agency needs to edit prices herself, replace the function bodies in `src/data/index.ts` with database or CMS reads. Nothing else has to change.

## Languages

- Interface copy: `src/messages/en.json` and `es.json`.
- Content copy: `{ en, es }` fields in `src/content`.
- URLs are localized (`/en/destinations/cruises` ↔ `/es/destinos/cruceros`) in `src/lib/i18n/routing.ts`.
- Only the root URL `/` redirects by language: saved choice, then browser language, then country, then English.

## Deploy to Vercel

1. Push the repository to GitHub and import it in Vercel (framework: Next.js, no extra settings).
2. Add the environment variables above.
3. Every push gets a preview URL.

## SEO and AI visibility

- `src/lib/seo/metadata.ts`: titles, canonical URLs, hreflang and share cards. Each page calls `pageMetadata()`.
- `src/lib/seo/jsonld.ts`: structured data.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`.

## Before going public

- Replace placeholder prices, packages and guide content with verified information.
- Get consent from anyone recognisable in photos.
- Set `NEXT_PUBLIC_DEMO=false` (this also removes the "To verify" badges, so do it only once the content is real) and set `NEXT_PUBLIC_SITE_URL` to the real domain.
- Have the privacy and terms drafts reviewed, and review analytics consent.
