import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { VerifyBadge } from "@/components/ui/VerifyBadge";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp/message";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale,
    href: () => "/contact",
    title: t("eyebrow"),
    description: t("text"),
  });
}

export default async function ContactPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const whatsapp = buildWhatsAppUrl(site.whatsappNumber);

  const facts = [
    { label: t("contact.languagesLabel"), value: t("contact.languagesValue") },
    { label: t("contact.basedLabel"), value: t("contact.basedValue") },
    {
      label: t("contact.hoursLabel"),
      value: t("contact.hoursValue"),
      verify: true,
    },
  ];

  return (
    <>
      <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.title")}>
        <p>{t("contact.text")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {whatsapp ? (
            <ButtonAnchor href={whatsapp} size="lg">
              {t("contact.whatsapp")}
            </ButtonAnchor>
          ) : (
            <p className="text-base">{t("contact.noNumber")}</p>
          )}
          <ButtonLink href="/plan" variant="outline" size="lg">
            {t("contact.or")}
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="border-t border-line">
        <dl className="shell grid gap-8 py-12 sm:grid-cols-3 lg:pb-32">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}
            >
              <dt className="eyebrow text-muted">{fact.label}</dt>
              <dd className="mt-2 font-display text-2xl">
                {fact.value}
                {fact.verify && <VerifyBadge label={t("common.verify")} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
