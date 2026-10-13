/**
 * GET /api/matching/<locale> — the matching bundle of the active corpus in one
 * language (shape in lib/matching/data.ts): positions, grids, constants and that
 * language's result texts and points. No poll data and no registry facts.
 *
 * Static: built once per deployment from the content files, one file per
 * language. The address always serves the current bundle; the `?v=` the survey
 * adds is only a cache-busting parameter and is ignored here, so a tab opened
 * before a redeploy never asks for a file that no longer exists.
 */
import { isLocale, locales } from "@/i18n/routing";
import { getMatchingBundle } from "@/lib/content/loaders";

export const dynamic = "force-static";
// Only the site's languages exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/matching/[locale]">,
): Promise<Response> {
  const { locale } = await ctx.params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  return Response.json(getMatchingBundle(locale));
}
