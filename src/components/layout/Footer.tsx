import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/lib/i18n/navigation";
import type { StaticPathname } from "@/lib/i18n/routing";
import { buildWhatsAppUrl } from "@/lib/whatsapp/message";

const EXPLORE: { href: StaticPathname; key: string }[] = [
  { href: "/destinations", key: "destinations" },
  { href: "/plan", key: "plan" },
  { href: "/guide", key: "guide" },
  { href: "/weddings", key: "weddings" },
];
const COMPANY: { href: StaticPathname; key: string }[] = [
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export async function Footer() {
  const t = await getTranslations();
  const whatsapp = buildWhatsAppUrl(site.whatsappNumber);
  const linkClass = "text-ivory/75 transition-colors hover:text-ivory";

  return (
    <footer className="bg-ocean text-ivory">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr] lg:py-24">
        <div>
          <p className="display text-4xl lg:text-5xl">{site.name}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/75">
            {t("footer.tagline")}
          </p>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border-b border-turquoise pb-1 text-sm font-semibold text-ivory transition-colors hover:text-turquoise"
            >
              {t("common.whatsapp")} →
            </a>
          )}
        </div>
        <nav aria-label={t("footer.explore")}>
          <p className="eyebrow text-ivory/50">{t("footer.explore")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("footer.company")}>
          <p className="eyebrow text-ivory/50">{t("footer.company")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {COMPANY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className={linkClass}>
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                {t("footer.terms")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ivory/15">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.name}. {t("footer.rights")} {t("footer.operated")}.
          </p>
          {site.demo && <p>{t("footer.demoNote")}</p>}
        </div>
      </div>
    </footer>
  );
}
