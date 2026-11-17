import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { getGuideArticle, getGuideArticles } from "@/data";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const entries = await getGuideArticles();
  return entries.map((entry) => ({
    slug: entry.slug[params.locale as Locale],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = await getGuideArticle(slug, locale as Locale);
  return entry ? { title: entry.title[locale as Locale] } : {};
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = await getGuideArticle(slug, locale as Locale);
  if (!entry) notFound();
  return <ComingSoon title={entry.title[locale as Locale]} />;
}
