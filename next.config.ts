import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** Sent with every response: no framing, no full-URL referrers, no MIME sniffing. */
const SECURITY_HEADERS = [
  // A script-src policy is left out on purpose: Next's inline scripts would need nonces.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Content files (ISR) and OG-image fonts are read from disk at runtime; ship them with every function.
  outputFileTracingIncludes: { "/**": ["./content/**/*", "./assets/fonts/**/*"] },
  /*
   * The poll blackout (research/legal-findings.md) must reach every response
   * within minutes of its instant, with no visit or cron needed to trigger it.
   * The time-sensitive pages revalidate every 60 s, but revalidation alone is
   * stale-while-revalidate: Next's default `expire` of a year would let the first
   * request after the instant, however late, get the cached pre-blackout page.
   * `expireTime` caps the age of anything served: past it, Next's cache (and
   * Vercel's, which takes the same value from the build) renders afresh before
   * answering instead of serving the old copy, and the `Cache-Control` it sends
   * (`s-maxage=60, stale-while-revalidate=90`) lets a downstream cache keep a
   * copy at most as long again. So a page rendered before the instant is never
   * served more than 2.5 minutes after it by Next or Vercel, or 5 minutes behind
   * another CDN that honours the header. Only routes with a `revalidate` get
   * this; fully static pages are unaffected. Keep it above that `revalidate`
   * (TIME_SENSITIVE_REVALIDATE_SECONDS in lib/time-modes.ts).
   */
  expireTime: 150,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default withNextIntl(nextConfig);
