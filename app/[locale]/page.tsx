import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StartSurveyLink } from "@/components/home/start-survey-link";
import { ElectionOverBanner } from "@/components/time/election-over-banner";
import { ElectionGate } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import { getVersions } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (election-over): revalidate about every 5 minutes.
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    description: t("description"),
    siteName: t("siteName"),
    siteImage: false, // same segment as app/[locale]/opengraph-image
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const { electionOver } = timeModes(resolveNow());
  const steps = ["rank", "answer", "anythingElse", "result"] as const;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-start gap-5" aria-labelledby="intro-heading">
        <h1
          id="intro-heading"
          className="text-3xl leading-tight font-bold text-balance sm:text-4xl"
        >
          {t("heading")}
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg text-pretty">{t("lead")}</p>
        <ElectionGate
          serverOver={electionOver}
          open={
            <div className="flex flex-col items-start gap-3">
              <StartSurveyLink
                surveyContentVersion={getVersions().surveyContentVersion}
                dir={localeDirection[locale]}
              />
              <p className="text-muted-foreground text-sm">{t("duration")}</p>
            </div>
          }
          closed={<ElectionOverBanner />}
        />
        <p className="bg-muted/60 rounded-lg border px-4 py-3 text-sm" data-testid="privacy-note">
          {t("privacyNote")}{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-4">
            {t("privacyLink")}
          </Link>
        </p>
      </section>

      <section aria-labelledby="steps-heading" className="flex flex-col gap-4">
        <h2 id="steps-heading" className="text-xl font-semibold">
          {t("stepsHeading")}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 rounded-xl border p-4">
              <span
                aria-hidden="true"
                className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">{t(`steps.${step}.title`)}</h3>
                <p className="text-muted-foreground text-sm">{t(`steps.${step}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="neutral-heading" className="flex flex-col gap-3">
        <h2 id="neutral-heading" className="text-xl font-semibold">
          {t("neutralHeading")}
        </h2>
        <p className="max-w-prose">{t("neutralBody")}</p>
        <p className="max-w-prose">{t("decisionAid")}</p>
        <p>
          <Link href="/how-it-works" className="font-medium underline underline-offset-4">
            {t("howItWorksLink")}
          </Link>
        </p>
      </section>
    </div>
  );
}
