import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClosingCta } from "@/components/home/sections";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { getDestinations } from "@/data";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "destinationsPage" });
  return pageMetadata({
    locale,
    href: () => "/destinations",
    title: t("eyebrow"),
    description: t("text"),
  });
}

export default async function DestinationsPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, destinations] = await Promise.all([
    getTranslations(),
    getDestinations(),
  ]);
  const kindLabels = { video: t("common.video"), image: t("common.photo") };

  return (
    <>
      <section className="shell pb-14 pt-36 lg:pb-20 lg:pt-48">
        <p className="eyebrow text-lagoon">{t("destinationsPage.eyebrow")}</p>
        <h1 className="display mt-4 max-w-5xl text-5xl md:text-7xl lg:text-8xl">
          {t("destinationsPage.title")}
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
          {t("destinationsPage.text")}
        </p>
      </section>

      <ul className="shell space-y-16 pb-24 lg:space-y-28 lg:pb-36">
        {destinations.map((d, i) => (
          <li key={d.id}>
            <Reveal>
              <Link
                href={{
                  pathname: "/destinations/[slug]",
                  params: { slug: d.slug[locale] },
                }}
                className="group grid items-end gap-6 lg:grid-cols-12 lg:gap-12"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-md lg:col-span-8 lg:aspect-[16/9] ${
                    i % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <div className="absolute inset-0 transition-transform duration-[1400ms] ease-soft group-hover:scale-[1.04]">
                    <MediaSlot
                      slotKey={d.heroMedia}
                      locale={locale}
                      accent={d.accent}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      kindLabels={kindLabels}
                      play={false}
                    />
                  </div>
                </div>
                <div className="lg:col-span-4 lg:pb-4">
                  <p className="eyebrow text-muted">
                    <span aria-hidden="true">
                      {String(i + 1).padStart(2, "0")} ·{" "}
                    </span>
                    {d.kicker[locale]}
                  </p>
                  <h2 className="display mt-3 text-5xl md:text-6xl">
                    {d.name[locale]}
                  </h2>
                  <p className="mt-4 max-w-sm leading-relaxed text-muted">
                    {d.tagline[locale]}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 border-b border-ocean/40 pb-1 text-sm font-semibold transition-colors group-hover:border-ocean">
                    {t("destinationsPage.explore", { name: d.name[locale] })}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      <ClosingCta locale={locale} />
    </>
  );
}
