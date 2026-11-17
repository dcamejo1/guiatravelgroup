import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClosingCta } from "@/components/home/sections";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { getFaqs, getGuideArticles } from "@/data";
import { Link } from "@/lib/i18n/navigation";
import { faqLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "guidePage" });
  return pageMetadata({
    locale,
    href: () => "/guide",
    title: t("eyebrow"),
    description: t("text"),
  });
}

export default async function GuidePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, articles, faqs] = await Promise.all([
    getTranslations(),
    getGuideArticles(),
    getFaqs(),
  ]);

  return (
    <>
      <JsonLd data={faqLd(faqs, locale)} />
      <PageHeader eyebrow={t("guidePage.eyebrow")} title={t("guidePage.title")}>
        <p>{t("guidePage.text")}</p>
        {site.demo && (
          <p className="mt-4 text-sm text-coral-deep">
            {t("guidePage.draftNote")}
          </p>
        )}
      </PageHeader>

      <ul className="shell grid gap-5 pb-20 md:grid-cols-2 lg:pb-28">
        {articles.map((article, i) => (
          <li key={article.id}>
            <Reveal delay={(i % 2) * 0.08} className="h-full">
              <Link
                href={{
                  pathname: "/guide/[slug]",
                  params: { slug: article.slug[locale] },
                }}
                className="group flex h-full flex-col rounded-md border border-line bg-sand-soft/50 p-7 transition-colors duration-300 hover:border-ocean md:p-10"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-light italic text-lagoon"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="display mt-6 text-4xl md:text-5xl">
                  {article.title[locale]}
                </h2>
                <p className="mt-4 max-w-sm leading-relaxed text-muted">
                  {article.summary[locale]}
                </p>
                <ul className="mt-6 space-y-1.5 text-sm text-muted">
                  {article.sections.map((s) => (
                    <li key={s.heading.en} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-turquoise"
                      />
                      {s.heading[locale]}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">
                  {t("guidePage.read")}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      <section className="shell grid gap-10 pb-20 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:pb-32">
        <Reveal>
          <h2 className="display text-4xl md:text-5xl">
            {t("guidePage.faqTitle")}
          </h2>
        </Reveal>
        <FaqList faqs={faqs} locale={locale} verifyLabel={t("common.verify")} />
      </section>

      <ClosingCta locale={locale} title={t("guidePage.ctaTitle")} />
    </>
  );
}
