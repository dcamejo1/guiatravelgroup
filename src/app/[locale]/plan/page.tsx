import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { TripBuilder } from "@/components/plan/TripBuilder";
import { getCatalogItems, getDestinations } from "@/data";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plan" });
  return { title: t("title"), description: t("intro") };
}

export default async function PlanPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [destinations, catalog] = await Promise.all([
    getDestinations(),
    getCatalogItems(),
  ]);

  return (
    // The builder reads the URL (?destination=…), which is only known per request.
    <Suspense fallback={<div className="min-h-svh" />}>
      <TripBuilder
        locale={locale}
        catalog={catalog}
        destinations={destinations.map((d) => ({
          id: d.id,
          slugs: d.slug,
          name: d.name,
          kicker: d.kicker,
          accent: d.accent,
          media: d.cardMedia,
        }))}
      />
    </Suspense>
  );
}
