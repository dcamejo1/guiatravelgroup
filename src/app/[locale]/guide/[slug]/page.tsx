import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ClosingCta } from "@/components/home/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { VerifyBadge } from "@/components/ui/VerifyBadge";
import { getGuideArticle, getGuideArticles } from "@/data";
import { Link } from "@/lib/i18n/navigation";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import {
  localizedUrl,
  pageMetadata,
  type LocalizedHref,
} from "@/lib/seo/metadata";
import type { GuideArticle, Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

const hrefOf =
  (article: GuideArticle): LocalizedHref =>
  (l) => ({ pathname: "/guide/[slug]", params: { slug: article.slug[l] } });

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const articles = await getGuideArticles();
  return articles.map((a) => ({ slug: a.slug[params.locale as Locale] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getGuideArticle(slug, locale as Locale);
  if (!article) return {};
  return pageMetadata({
    locale: locale as Locale,
    href: hrefOf(article),
    title: article.title[locale as Locale],
    description: article.summary[locale as Locale],
  });
}

export default async function GuideArticlePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const [t, article, articles] = await Promise.all([
    getTranslations(),
    getGuideArticle(slug, locale),
    getGuideArticles(),
  ]);
  if (!article) notFound();

  const index = articles.findIndex((a) => a.id === article.id);
  const next = articles[(index + 1) % articles.length];
  const url = localizedUrl(locale, hrefOf(article));

  return (
    <>
      <JsonLd
        data={articleLd({
          headline: article.title[locale],
          description: article.summary[locale],
          url,
          locale,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), url: localizedUrl(locale, () => "/") },
          {
            name: t("guidePage.eyebrow"),
            url: localizedUrl(locale, () => "/guide"),
          },
          { name: article.title[locale], url },
        ])}
      />

      <article className="shell grid gap-12 pb-20 pt-36 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:pb-32 lg:pt-48">
        <header className="lg:sticky lg:top-32 lg:self-start">
          <Link
            href="/guide"
            className="eyebrow text-lagoon transition-colors hover:text-ocean"
          >
            ← {t("guidePage.all")}
          </Link>
          <h1 className="display mt-6 text-5xl md:text-7xl">
            {article.title[locale]}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {article.summary[locale]}
          </p>
        </header>

        <div className="border-t border-line">
          {article.sections.map((section) => (
            <section
              key={section.heading.en}
              className="border-b border-line py-9"
            >
              <h2 className="font-display text-2xl md:text-3xl">
                {section.heading[locale]}
                {section.verify && <VerifyBadge label={t("common.verify")} />}
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {section.body[locale]}
              </p>
            </section>
          ))}

          <Link
            href={{
              pathname: "/guide/[slug]",
              params: { slug: next.slug[locale] },
            }}
            className="group mt-10 flex items-center justify-between gap-6 rounded-md bg-sand-soft p-7 transition-colors hover:bg-sand md:p-9"
          >
            <span>
              <span className="eyebrow block text-muted">
                {t("guidePage.next")}
              </span>
              <span className="display mt-2 block text-3xl md:text-4xl">
                {next.title[locale]}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-2xl transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>
      </article>

      <ClosingCta locale={locale} title={t("guidePage.ctaTitle")} />
    </>
  );
}
