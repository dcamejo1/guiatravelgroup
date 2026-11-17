import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/content/site";
import { getSlugMap } from "@/data";
import { routing } from "@/lib/i18n/routing";
import { travelAgencyLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/types";
import "../globals.css";

const fraunces = localFont({
  src: [
    { path: "../../fonts/fraunces-latin-full-normal.woff2", style: "normal" },
    { path: "../../fonts/fraunces-latin-full-italic.woff2", style: "italic" },
  ],
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = localFont({
  src: "../../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0a2a3a" };

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    // The demo must not be indexed. Production turns this off via NEXT_PUBLIC_DEMO=false.
    robots: site.demo ? { index: false, follow: false } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, meta, slugMap] = await Promise.all([
    getTranslations("common"),
    getTranslations("meta"),
    getSlugMap(),
  ]);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${manrope.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col">
        <JsonLd data={travelAgencyLd(locale as Locale, meta("description"))} />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-ocean px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t("skipToContent")}
          </a>
          <Header slugMap={slugMap} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <DemoBanner show={site.demo} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
