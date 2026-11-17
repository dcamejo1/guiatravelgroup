import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClosingCta } from "@/components/home/sections";
import { PageHeader } from "@/components/layout/PageHeader";
import { MediaSlot } from "@/components/media/MediaSlot";
import { Reveal } from "@/components/ui/Reveal";
import { VerifyBadge } from "@/components/ui/VerifyBadge";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale,
    href: () => "/about",
    title: t("eyebrow"),
    description: t("intro"),
  });
}

const ITEMS = ["trips", "transport", "weddings"] as const;

export default async function AboutPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader eyebrow={t("about.eyebrow")} title={t("about.title")}>
        <p>{t("about.intro")}</p>
      </PageHeader>

      <section className="shell grid items-center gap-10 pb-20 lg:grid-cols-12 lg:gap-16 lg:pb-32">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-md lg:col-span-7">
          <MediaSlot
            slotKey="about.hero"
            locale={locale}
            accent="#0E6F74"
            sizes="(min-width: 1024px) 55vw, 100vw"
            kindLabels={{ video: t("common.video"), image: t("common.photo") }}
          />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <h2 className="display text-4xl md:text-5xl">
            {t("about.storyTitle")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {t("about.storyPlaceholder")}
            <VerifyBadge label={t("common.placeholder")} />
          </p>
        </Reveal>
      </section>

      <section className="bg-sand-soft">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl">
              {t("about.whatTitle")}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-10 border-t border-ocean/15 pt-10 md:grid-cols-3">
            {ITEMS.map((key, i) => (
              <li key={key}>
                <Reveal delay={i * 0.08}>
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-light italic text-lagoon"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-2xl">
                    {t(`about.items.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-muted">
                    {t(`about.items.${key}.text`)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta locale={locale} />
    </>
  );
}
