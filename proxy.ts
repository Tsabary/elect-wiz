import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

/**
 * First visits land on Hebrew whatever the browser language: the browser's
 * `Accept-Language` is dropped before next-intl sees it. A manual switch is
 * still remembered (the locale cookie), so someone who chose English keeps it.
 */
export default function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("accept-language");
  return handleLocale(new NextRequest(request, { headers }));
}

export const config = {
  // Everything except API routes, Next internals, Vercel internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
