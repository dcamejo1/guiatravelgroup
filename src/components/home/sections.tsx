import { getTranslations } from "next-intl/server";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { getDestinations, getGuideArticles } from "@/data";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp/message";
import { DestinationRail } from "./DestinationRail";

const arrowLink =
  "group inline-flex items-center gap-2 border-b border-ocean/40 pb-1 text-sm font-semibold transition-colors hover:border-ocean";
const arrow = (
  <span
    aria-hidden="true"
    className="transition-transform duration-300 group-hover:translate-x-1"
  >
    →
  </span>
);

export async function DestinationsShowcase({ locale }: { locale: Locale }) {
  const [t, destinations] = await Promise.all([
    getTranslations(),
    getDestinations(),
  ]);

  return (
    <section className="py-20 lg:py-32">
      <Reveal className="shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow text-lagoon">
            {t("home.destinations.eyebrow")}
          </p>
          <h2 className="display mt-4 text-5xl md:text-6xl lg:text-7xl">
            {t("home.destinations.title")}
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="leading-relaxed text-muted">
            {t("home.destinations.text")}
          </p>
          <Link href="/destinations" className={`${arrowLink} mt-5`}>
            {t("home.destinations.all")}
            {arrow}
          </Link>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-12 max-w-[90rem] lg:mt-16" delay={0.1}>
        <DestinationRail
          locale={locale}
          exploreLabel={t("home.destinations.explore")}
          kindLabels={{ video: t("common.video"), image: t("common.photo") }}
          cards={destinations.map((d) => ({
            id: d.id,
            slug: d.slug[locale],
            name: d.name[locale],
            kicker: d.kicker[locale],
            tagline: d.tagline[locale],
            accent: d.accent,
            media: d.cardMedia,
          }))}
        />
      </Reveal>
    </section>
  );
}

const STEPS = ["choose", "estimate", "confirm"] as const;

export async function HowItWorks({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  return (
    <section className="bg-sand-soft">
      <div className="shell grid gap-12 py-20 lg:grid-cols-[5fr_6fr] lg:gap-24 lg:py-32">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-md lg:aspect-auto lg:min-h-[40rem]">
          <MediaSlot
            slotKey="home.how"
            locale={locale}
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow text-lagoon">{t("home.how.eyebrow")}</p>
            <h2 className="display mt-4 max-w-xl text-5xl md:text-6xl">
              {t("home.how.title")}
            </h2>
          </Reveal>

          <ol className="mt-12 border-t border-ocean/15">
            {STEPS.map((step, i) => (
              <li key={step} className="border-b border-ocean/15">
                <Reveal
                  delay={i * 0.08}
                  className="grid grid-cols-[3.5rem_1fr] gap-4 py-7 md:grid-cols-[5rem_1fr]"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-light italic text-lagoon md:text-4xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl">
                      {t(`home.how.steps.${step}.title`)}
                    </h3>
                    <p className="mt-2 max-w-md leading-relaxed text-muted">
                      {t(`home.how.steps.${step}.text`)}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <ButtonLink href="/plan" size="lg">
              {t("common.planTrip")}
            </ButtonLink>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              {t("home.how.note")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export async function GuideTeaser({ locale }: { locale: Locale }) {
  const [t, articles] = await Promise.all([
    getTranslations(),
    getGuideArticles(),
  ]);
  return (
    <section className="shell grid gap-12 py-20 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:py-32">
      <Reveal>
        <p className="eyebrow text-lagoon">{t("home.guide.eyebrow")}</p>
        <h2 className="display mt-4 text-5xl md:text-6xl">
          {t("home.guide.title")}
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-muted">
          {t("home.guide.text")}
        </p>
        <Link href="/guide" className={`${arrowLink} mt-7`}>
          {t("home.guide.all")}
          {arrow}
        </Link>
      </Reveal>

      <ul className="border-t border-line">
        {articles.map((article, i) => (
          <li key={article.id} className="border-b border-line">
            <Reveal delay={i * 0.06}>
              <Link
                href={{
                  pathname: "/guide/[slug]",
                  params: { slug: article.slug[locale] },
                }}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 md:grid-cols-[4rem_1fr_auto]"
              >
                <span aria-hidden="true" className="eyebrow text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-2xl transition-colors group-hover:text-lagoon md:text-3xl">
                    {article.title[locale]}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                    {article.summary[locale]}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function WeddingsTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  return (
    <section className="shell pb-20 lg:pb-32">
      <div className="grid overflow-hidden rounded-md bg-ocean text-ivory md:grid-cols-2">
        <Reveal className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
          <p className="eyebrow text-turquoise">{t("home.weddings.eyebrow")}</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">
            {t("home.weddings.title")}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ivory/80">
            {t("home.weddings.text")}
          </p>
          <div className="mt-8">
            <ButtonLink href="/weddings" variant="outline-light">
              {t("home.weddings.cta")}
            </ButtonLink>
          </div>
        </Reveal>
        <div className="relative min-h-72 md:min-h-[28rem]">
          <MediaSlot
            slotKey="home.weddings"
            locale={locale}
            accent="#D9A89A"
            sizes="(min-width: 768px) 50vw, 100vw"
            kindLabels={{ video: t("common.video"), image: t("common.photo") }}
          />
        </div>
      </div>
    </section>
  );
}

export async function ClosingCta({
  locale,
  title,
  planQuery,
}: {
  locale: Locale;
  /** Overrides the default headline, e.g. on destination pages. */
  title?: string;
  /** Prefills the builder, e.g. `{ destination: "los-roques" }`. */
  planQuery?: Record<string, string>;
}) {
  const t = await getTranslations();
  const whatsapp = buildWhatsAppUrl(site.whatsappNumber);
  return (
    <section className="relative isolate overflow-hidden bg-ocean text-ivory">
      <div className="absolute inset-0 -z-20">
        <MediaSlot slotKey="home.cta" locale={locale} sizes="100vw" />
      </div>
      <div className="absolute inset-0 -z-10 bg-ocean/45" />
      <Reveal className="shell flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
        <h2 className="display max-w-4xl text-5xl md:text-7xl">
          {title ?? t("home.cta.title")}
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/90">
          {t("home.cta.text")}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink
            href={planQuery ? { pathname: "/plan", query: planQuery } : "/plan"}
            size="lg"
          >
            {t("common.planTrip")}
          </ButtonLink>
          {whatsapp && (
            <ButtonAnchor href={whatsapp} variant="outline-light" size="lg">
              {t("common.whatsapp")}
            </ButtonAnchor>
          )}
        </div>
      </Reveal>
    </section>
  );
}
