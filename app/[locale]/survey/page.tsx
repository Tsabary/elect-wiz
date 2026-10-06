import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SurveyApp } from "@/components/survey/survey-app";
import type { ClientIssue } from "@/components/survey/types";
import type { Locale } from "@/i18n/routing";
import { getIssues, getVersions } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (election-over): revalidate about every 5 minutes.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/survey">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Survey" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  return {
    ...pageMetadata({
      locale,
      path: "survey",
      title: t("metaTitle"),
      description: m("description"),
      siteName: m("siteName"),
    }),
    robots: { index: false, follow: true },
  };
}

export default async function SurveyPage({ params }: PageProps<"/[locale]/survey">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { electionOver } = timeModes(resolveNow());
  if (electionOver) redirect(`/${locale}`);

  const issues: ClientIssue[] = getIssues().map((i) => ({
    id: i.id,
    title: i[locale].title,
    description: i[locale].description,
    moreInfo: i[locale].moreInfo,
    question: i[locale].question,
    options: i.options.map((o) => ({ id: o.id, text: o[locale] })),
  }));

  return (
    <SurveyApp
      issues={issues}
      surveyContentVersion={getVersions().surveyContentVersion}
      serverElectionOver={electionOver}
    />
  );
}
