import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
  ClosingCta,
  DestinationsShowcase,
  GuideTeaser,
  HowItWorks,
  WeddingsTeaser,
} from "@/components/home/sections";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    href: () => "/",
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <TrustStrip />
      <DestinationsShowcase locale={locale} />
      <HowItWorks locale={locale} />
      <GuideTeaser locale={locale} />
      <WeddingsTeaser locale={locale} />
      <ClosingCta locale={locale} />
    </>
  );
}
