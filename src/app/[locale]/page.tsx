import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
  ClosingCta,
  DestinationsShowcase,
  GuideTeaser,
  HowItWorks,
  WeddingsTeaser,
} from "@/components/home/sections";
import type { Locale } from "@/lib/types";

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
