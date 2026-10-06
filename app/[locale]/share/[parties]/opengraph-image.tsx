import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getParties } from "@/lib/content/loaders";
import { OG_SIZE, renderOgImage } from "@/lib/og/render";
import { parseSharedParties } from "@/lib/share/params";

// Party names only: no answers, no poll figures or threshold notes, no operator identity.
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; parties: string }>;
}) {
  const { locale: raw, parties: segment } = await params;
  const locale: Locale = raw === "en" ? "en" : "he";
  const t = await getTranslations({ locale, namespace: "Share" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  const all = getParties();
  const names = parseSharedParties(
    segment,
    all.map((p) => p.id),
  ).map((id) => all.find((p) => p.id === id)!.name[locale]);
  const [top, ...rest] = names;
  return renderOgImage({
    rtl: locale === "he",
    siteName: m("siteName"),
    eyebrow: top ? t("ogEyebrow") : undefined,
    headline: top ?? t("ogGenericHeadline"),
    secondary: rest.length
      ? t("ogAlsoClose", {
          names: new Intl.ListFormat(locale, { type: "conjunction" }).format(rest),
        })
      : undefined,
    cta: t("ogCta"),
  });
}
