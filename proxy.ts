import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import placeholderParties from "./content/placeholder/registry/parties.json";
import realParties from "./content/registry/parties.json";
import { isLocale, LOCALE_CHOICE_COOKIE, locales, routing } from "./i18n/routing";
import { activeCorpus } from "./lib/content/config";
import { checkShareRoute } from "./lib/share/params";

const handleLocale = createMiddleware(routing);

/** The parties a share link may name: the researched ones of the active corpus. */
const shareablePartyIds = (
  activeCorpus() === "placeholder" ? placeholderParties : realParties
).parties
  .filter((p) => p.tier === "researched")
  .map((p) => p.id);

/** next-intl's cookie, which used to be set on ordinary visits too. */
const LEGACY_LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Before next-intl:
 *
 * - **Share links** reach the renderer only in their canonical form (each
 *   distinct address is rendered once and cached): another spelling of a valid
 *   set is redirected to it, and a link with no valid party is a 404, rendered
 *   from one fixed address. See `checkShareRoute`.
 * - **Language:** a first visit lands on Hebrew whatever the browser language.
 *   The browser's `Accept-Language` never reaches next-intl; in its place goes
 *   the language the visitor picked with the switch, if they ever did (the
 *   choice cookie, written only by components/layout/language-switch.tsx).
 *   next-intl's own cookie is off (i18n/routing.ts), so opening an /en link
 *   remembers nothing; one it left behind earlier is deleted.
 */
export default function proxy(request: NextRequest) {
  const share = checkShareRoute(request.nextUrl.pathname, shareablePartyIds, locales);
  if (share.kind === "redirect") {
    const url = request.nextUrl.clone();
    url.pathname = share.path;
    return NextResponse.redirect(url, 308);
  }
  if (share.kind === "not-found") {
    // Any unknown path under the locale renders the localized 404 (app/[locale]/[...rest]).
    return NextResponse.rewrite(new URL(`/${share.locale}/share-not-found`, request.url));
  }

  const headers = new Headers(request.headers);
  headers.delete("accept-language");
  const choice = request.cookies.get(LOCALE_CHOICE_COOKIE)?.value;
  if (isLocale(choice)) headers.set("accept-language", choice);
  const response = handleLocale(new NextRequest(request, { headers }));
  if (request.cookies.has(LEGACY_LOCALE_COOKIE)) response.cookies.delete(LEGACY_LOCALE_COOKIE);
  return response;
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals, Vercel internals and files with an extension.
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Share links always, even with a dot in them: otherwise `share/a,junk.1` would
    // skip the check above and be rendered and cached as a new page.
    "/:locale/share/:path*",
  ],
};
