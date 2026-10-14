import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BallotArt } from "@/components/brand/ballot-art";
import { KnessetBand } from "@/components/home/knesset-band";
import { StartSurveyLink } from "@/components/home/start-survey-link";
import { ElectionOverBanner } from "@/components/time/election-over-banner";
import { ElectionGate } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import { getVersions } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (election-over): revalidated every minute, never served older than
// next.config.ts `expireTime` (TIME_SENSITIVE_REVALIDATE_SECONDS).
export const revalidate = 60;

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
  const m = await getTranslations("Metadata");
  const { electionOver } = timeModes(resolveNow());
  const steps = ["rank", "answer", "result"] as const;

  return (
    <>
      {/* The booth: cardboard ground, the slip and its envelope beside the question. */}
      <section
        className="col-full page-grid bg-kraft border-foreground/15 relative -mt-8 overflow-hidden border-b sm:-mt-12"
        aria-labelledby="intro-heading"
      >
        <div className="col-wide grid items-center gap-x-12 pt-10 pb-12 sm:pt-16 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative z-10 flex flex-col items-start gap-6">
            <p className="eyebrow">{m("ogSecondary")}</p>
            <h1 id="intro-heading" className="display text-[2.75rem] sm:text-6xl lg:text-7xl">
              {t("heading")}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pretty sm:text-xl">{t("lead")}</p>
            <ElectionGate
              serverOver={electionOver}
              open={
                <div className="flex flex-col items-start gap-4 pt-1">
                  <StartSurveyLink
                    surveyContentVersion={getVersions().surveyContentVersion}
                    dir={localeDirection[locale]}
                  />
                  <p className="text-muted-foreground text-sm font-medium">{t("duration")}</p>
                </div>
              }
              closed={<ElectionOverBanner />}
            />
          </div>
          <BallotArt
            animate
            className="absolute end-4 -bottom-[3.4em] text-[10px] sm:end-10 sm:text-[14px] lg:relative lg:end-auto lg:bottom-auto lg:text-[23px]"
          />
        </div>
      </section>

      <div className="col-full page-grid border-foreground/15 border-b">
        <p className="col-wide py-4 text-sm leading-relaxed" data-testid="privacy-note">
          {t("privacyNote")}{" "}
          <Link href="/privacy" className="link">
            {t("privacyLink")}
          </Link>
        </p>
      </div>

      <section
        aria-labelledby="steps-heading"
        className="col-wide flex flex-col gap-8 pt-14 sm:pt-20"
      >
        <h2 id="steps-heading" className="display text-3xl sm:text-4xl">
          {t("stepsHeading")}
        </h2>
        <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step}
              className="border-foreground flex gap-4 border-t-2 pt-4 sm:flex-col sm:gap-3"
            >
              <span
                aria-hidden="true"
                className="display text-primary w-9 shrink-0 text-6xl leading-[0.85] sm:w-auto sm:text-7xl"
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl leading-snug font-bold">{t(`steps.${step}.title`)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(`steps.${step}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="neutral-heading"
        className="col-full mt-16 -mb-24 sm:mt-24 sm:-mb-28"
      >
        <KnessetBand alt={t("knessetPhotoAlt")}>
          <div className="page-grid pt-6 pb-14 sm:pb-20">
            <div className="col-wide grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <h2 id="neutral-heading" className="display text-3xl sm:text-5xl">
                {t("neutralHeading")}
              </h2>
              <div className="flex flex-col gap-4 text-lg leading-relaxed">
                <p>{t("neutralBody")}</p>
                <p>{t("decisionAid")}</p>
                <p>
                  <Link
                    href="/how-it-works"
                    className="decoration-ink-foreground/50 hover:decoration-ink-foreground font-medium underline decoration-1 underline-offset-4"
                  >
                    {t("howItWorksLink")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </KnessetBand>
      </section>
    </>
  );
}
