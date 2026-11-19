"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/content/site";
import { track } from "@/lib/analytics/track";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { StaticPathname } from "@/lib/i18n/routing";
import { LanguageToggle, type SlugMap } from "./LanguageToggle";

const NAV: { href: StaticPathname; key: string }[] = [
  { href: "/destinations", key: "destinations" },
  { href: "/guide", key: "guide" },
  { href: "/weddings", key: "weddings" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

/** Pages that open with full-bleed media, where the header starts transparent. */
const OVER_MEDIA = new Set<string>(["/", "/destinations/[slug]"]);

export function Header({ slugMap }: { slugMap: SlugMap }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = OVER_MEDIA.has(pathname) && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
          light
            ? "border-b border-transparent text-ivory"
            : "border-b border-line bg-ivory/90 text-ocean backdrop-blur-md"
        }`}
      >
        <div className="shell flex h-18 items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex flex-col leading-none"
          >
            <span className="whitespace-nowrap font-display text-xl tracking-tight sm:text-[1.375rem] [font-variation-settings:'SOFT'_60]">
              {site.name}
            </span>
            <span className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.24em] opacity-70">
              {t("common.by")} {site.operator}
            </span>
          </Link>

          <nav aria-label={t("nav.label")} className="hidden lg:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname.startsWith(item.href) ? "page" : undefined
                    }
                    className="relative py-2 opacity-85 transition-opacity after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-soft hover:opacity-100 hover:after:scale-x-100 aria-[current=page]:opacity-100 aria-[current=page]:after:scale-x-100"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden sm:block">
              <LanguageToggle
                slugMap={slugMap}
                tone={light ? "light" : "dark"}
              />
            </div>
            <div className="hidden md:block">
              <Link
                href="/plan"
                onClick={() => track("cta_clicked", { location: "header" })}
                className={buttonClasses("primary")}
              >
                {t("common.planTrip")}
              </Link>
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 grid size-11 place-items-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-18 z-45 overflow-y-auto bg-ivory lg:hidden"
      >
        <nav
          aria-label={t("nav.label")}
          className="shell flex min-h-full flex-col pb-10 pt-6"
        >
          <ul className="border-t border-line">
            {[{ href: "/plan" as const, key: "plan" }, ...NAV].map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display block py-5 text-3xl"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between pt-10">
            <LanguageToggle slugMap={slugMap} />
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className={buttonClasses("primary")}
            >
              {t("common.planTrip")}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
