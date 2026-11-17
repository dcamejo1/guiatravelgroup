import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VerifyBadge } from "@/components/ui/VerifyBadge";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp/message";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "weddings" });
  return pageMetadata({
    locale,
    href: () => "/weddings",
    title: t("eyebrow"),
    description: t("intro"),
  });
}

const GALLERY = [1, 2, 3, 4] as const;

/** Kept simple on purpose until the agency says what she wants to show. */
export default async function WeddingsPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const kindLabels = { video: t("common.video"), image: t("common.photo") };

  // Written in Spanish for the agency, with the traveler's language noted.
  const whatsapp = buildWhatsAppUrl(
    site.whatsappNumber,
    [
      ...(site.demo ? ["[DEMO]"] : []),
      "Hola Guía Travel Group,",
      "Quisiera información sobre bodas en Venezuela.",
      "",
      `Idioma del viajero: ${locale === "es" ? "Español" : "English"}`,
    ].join("\n"),
  );

  return (
    <>
      <PageHeader eyebrow={t("weddings.eyebrow")} title={t("weddings.title")}>
        <p>{t("weddings.intro")}</p>
        <p className="mt-4 text-base">
          {t("weddings.detailsNote")}
          <VerifyBadge label={t("common.placeholder")} />
        </p>
        <div className="mt-8">
          {whatsapp ? (
            <ButtonAnchor href={whatsapp} size="lg">
              {t("weddings.cta")}
            </ButtonAnchor>
          ) : (
            <ButtonLink href="/contact" size="lg">
              {t("weddings.cta")}
            </ButtonLink>
          )}
        </div>
      </PageHeader>

      <section
        aria-label={t("weddings.gallery")}
        className="shell pb-24 lg:pb-36"
      >
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-md">
          <MediaSlot
            slotKey="weddings.hero"
            locale={locale}
            accent="#D9A89A"
            sizes="100vw"
            kindLabels={kindLabels}
          />
        </Reveal>
        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.map((n, i) => (
            <li key={n}>
              <Reveal
                delay={i * 0.06}
                className="relative aspect-[4/5] overflow-hidden rounded-md"
              >
                <MediaSlot
                  slotKey={`weddings.gallery-${n}`}
                  locale={locale}
                  accent={i % 2 ? "#C9B89A" : "#D9A89A"}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  kindLabels={kindLabels}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
