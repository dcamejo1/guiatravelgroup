import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getSlugMap } from "@/data";
import { LOCALE_COOKIE, detectLocale, isLocale } from "@/lib/i18n/detect";
import { routing } from "@/lib/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Only the root URL is redirected by language (saved choice, then browser
 * language, then country, then English). Every localized URL is served as is,
 * so crawlers can reach both languages.
 */
/** URL segment of each section that has per-language slugs, by locale. */
const SLUG_SECTIONS = {
  destinations: { en: "destinations", es: "destinos" },
  guide: { en: "guide", es: "guia" },
} as const;

/**
 * True when the URL points at a destination or guide article that does not
 * exist in that language (for example `/en/destinations/cruceros`).
 */
async function isUnknownSlug(pathname: string): Promise<boolean> {
  const [locale, section, slug, ...rest] = pathname.split("/").filter(Boolean);
  if (!isLocale(locale) || !slug || rest.length > 0) return false;
  const slugMap = await getSlugMap();
  for (const key of ["destinations", "guide"] as const) {
    // Both spellings are checked: the i18n router accepts either before redirecting.
    if (Object.values(SLUG_SECTIONS[key]).includes(section as never)) {
      const known = Object.values(slugMap[key]).some(
        (s) => s[locale] === decodeURIComponent(slug),
      );
      return !known;
    }
  }
  return false;
}

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const locale = detectLocale({
      cookie: request.cookies.get(LOCALE_COOKIE)?.value,
      acceptLanguage: request.headers.get("accept-language"),
      country: request.headers.get("x-vercel-ip-country"),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }
  if (await isUnknownSlug(request.nextUrl.pathname)) {
    // Send it to the localized 404 page with a real 404 status.
    const url = request.nextUrl.clone();
    url.pathname = `/${url.pathname.split("/")[1]}/not-found`;
    return NextResponse.rewrite(url);
  }
  return handleI18nRouting(request);
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
