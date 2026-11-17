import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE } from "./detect";

/**
 * Every page has a localized URL. Dynamic slugs (`[slug]`) that differ by
 * language are translated through the data layer (see `getSlugMap`), because
 * `pathnames` only localizes the static parts.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // Language is only auto-detected for the root URL, in `src/proxy.ts`.
  localeDetection: false,
  // hreflang is emitted in page metadata instead, where differing slugs can be translated.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/destinations": { en: "/destinations", es: "/destinos" },
    "/destinations/[slug]": {
      en: "/destinations/[slug]",
      es: "/destinos/[slug]",
    },
    "/plan": { en: "/plan", es: "/planifica" },
    "/guide": { en: "/guide", es: "/guia" },
    "/guide/[slug]": { en: "/guide/[slug]", es: "/guia/[slug]" },
    "/weddings": { en: "/weddings", es: "/bodas" },
    "/about": { en: "/about", es: "/nosotros" },
    "/contact": { en: "/contact", es: "/contacto" },
    "/privacy": { en: "/privacy", es: "/privacidad" },
    "/terms": { en: "/terms", es: "/terminos" },
    "/styleguide": "/styleguide",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
export type StaticPathname = Exclude<
  AppPathname,
  "/destinations/[slug]" | "/guide/[slug]"
>;
