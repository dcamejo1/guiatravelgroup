import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/content/site";
import { getLegalPage } from "@/data";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const page = await getLegalPage("terms");
  return pageMetadata({
    locale,
    href: () => "/terms",
    title: page.title[locale],
    description: page.sections[0].body[locale],
  });
}

export default async function LegalPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, page] = await Promise.all([
    getTranslations("legal"),
    getLegalPage("terms"),
  ]);

  return (
    <>
      <PageHeader eyebrow={site.name} title={page.title[locale]}>
        {site.demo && <p className="text-sm text-coral-deep">{t("draft")}</p>}
      </PageHeader>
      <div className="shell pb-24 lg:pb-36">
        <div className="max-w-3xl">
          {page.sections.map((section) => (
            <section
              key={section.heading.en}
              className="border-t border-line py-9"
            >
              <h2 className="font-display text-2xl md:text-3xl">
                {section.heading[locale]}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                {section.body[locale]}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
