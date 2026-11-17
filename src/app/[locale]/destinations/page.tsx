import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/layout/ComingSoon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("destinations") };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <ComingSoon title={t("destinations")} />;
}
