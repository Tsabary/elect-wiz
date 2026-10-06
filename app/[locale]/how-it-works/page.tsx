import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProsePage } from "@/components/layout/prose-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";

const SECTIONS = [
  "issues",
  "research",
  "matching",
  "polls",
  "limitations",
  "neutrality",
  "corrections",
];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/how-it-works">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "HowItWorks" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "how-it-works",
    title: t("title"),
    description: t("description"),
    siteName: m("siteName"),
  });
}

export default async function HowItWorksPage({ params }: PageProps<"/[locale]/how-it-works">) {
  setRequestLocale((await params).locale as Locale);
  return <ProsePage namespace="HowItWorks" sectionKeys={SECTIONS} />;
}
