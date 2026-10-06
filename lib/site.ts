/**
 * Site-wide URL and metadata helpers.
 *
 * Operator anonymity (plan Security §3): nothing here may name the operator.
 * Metadata carries no author, publisher or creator fields.
 */
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";

/** Absolute base URL for metadata (OG images, canonical and hreflang links). */
export function siteUrl(env: Record<string, string | undefined> = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel =
    env.VERCEL_ENV === "production" ? env.VERCEL_PROJECT_PRODUCTION_URL : env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${env.PORT ?? 3000}`);
}

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Locale, string> = { he: "he_IL", en: "en_US" };

/** `/he/parties` → per-locale path for `path` ("" for the home page). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Canonical and hreflang alternates for a page path (without the locale prefix).
 * `x-default` points at Hebrew, the default locale.
 */
export function alternatesFor(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("he", path),
    },
  };
}

/** Common per-page metadata: title, description, alternates and Open Graph basics. */
export function pageMetadata(opts: {
  locale: Locale;
  path?: string;
  title?: string;
  description: string;
  siteName: string;
  /**
   * Use the site-wide preview image (default). Pages with their own
   * `opengraph-image` in the same segment (share pages) pass false.
   */
  siteImage?: boolean;
}): Metadata {
  const { locale, path = "", title, description, siteName, siteImage = true } = opts;
  // A page-level `openGraph` replaces the parent's, including the inherited
  // file-based image, so the site image is referenced explicitly.
  const images = siteImage
    ? [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, type: "image/png" }]
    : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: localePath(locale, path),
      ...(title ? { title } : {}),
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
