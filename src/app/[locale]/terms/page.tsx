import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/layout/ComingSoon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("terms") };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("footer");
  return <ComingSoon title={t("terms")} />;
}
