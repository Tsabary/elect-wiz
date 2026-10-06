import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProsePage } from "@/components/layout/prose-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";

const SECTIONS = [
  "summary",
  "answers",
  "device",
  "ai",
  "counts",
  "sharing",
  "cookies",
  "abuse",
  "hosting",
  "terms",
  "contact",
];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "privacy",
    title: t("title"),
    description: t("description"),
    siteName: m("siteName"),
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  setRequestLocale((await params).locale as Locale);
  return <ProsePage namespace="Privacy" sectionKeys={SECTIONS} />;
}
