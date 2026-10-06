import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { OG_SIZE, renderOgImage } from "@/lib/og/render";

// Site-wide preview image: site copy only, no operator identity.
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "he" }, { locale: "en" }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "en" ? "en" : "he";
  const m = await getTranslations({ locale, namespace: "Metadata" });
  const t = await getTranslations({ locale, namespace: "Share" });
  return renderOgImage({
    rtl: locale === "he",
    siteName: m("siteName"),
    headline: m("ogHeadline"),
    secondary: m("ogSecondary"),
    cta: t("ogCta"),
  });
}
