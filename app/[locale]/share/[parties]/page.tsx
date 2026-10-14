import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BallotArt } from "@/components/brand/ballot-art";
import { SharedResult } from "@/components/result/share/shared-result";
import { StartSurveyLink } from "@/components/home/start-survey-link";
import { ElectionOverBanner } from "@/components/time/election-over-banner";
import { ElectionGate } from "@/components/time/time-modes";
import { localeDirection, type Locale } from "@/i18n/routing";
import { getIssues, getParties, getVersions } from "@/lib/content/loaders";
import { researchedPartyIds } from "@/lib/content/party-view";
import { parseSharedParties } from "@/lib/share/params";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (election-over); generated on demand (canonical addresses only, see
// proxy.ts), revalidated every minute (TIME_SENSITIVE_REVALIDATE_SECONDS).
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Params = { locale: Locale; parties: string };

function sharedParties(locale: Locale, segment: string) {
  const parties = getParties();
  // Only researched parties can be a match; a listed party's ID is ignored.
  return parseSharedParties(segment, researchedPartyIds(parties)).map((id) => {
    const p = parties.find((x) => x.id === id)!;
    return { id, name: p.name[locale] };
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/share/[parties]">): Promise<Metadata> {
  const { locale, parties: segment } = (await params) as Params;
  const t = await getTranslations({ locale, namespace: "Share" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  const shared = sharedParties(locale, segment);
  const ids = shared.map((p) => p.id).join(",");
  return {
    ...pageMetadata({
      locale,
      path: ids ? `share/${ids}` : "share",
      title: shared[0] ? t("metaTitle", { name: shared[0].name }) : t("metaTitleGeneric"),
      description: t("metaDescription"),
      siteName: m("siteName"),
      siteImage: false,
    }),
    // Share pages are per-result variants; keep them out of search results.
    robots: { index: false, follow: true },
  };
}

export default async function SharePage({ params }: PageProps<"/[locale]/share/[parties]">) {
  const { locale, parties: segment } = (await params) as Params;
  setRequestLocale(locale);
  const t = await getTranslations("Share");
  const shared = sharedParties(locale, segment);
  const top = shared[0];
  const researched = getParties().filter((p) => p.tier === "researched");
  const versions = getVersions();
  const { electionOver } = timeModes(resolveNow());

  return (
    <div className="flex flex-col gap-12" data-testid="share-landing">
      {top && (
        <SharedResult
          parties={shared}
          names={Object.fromEntries(researched.map((p) => [p.id, p.name[locale]]))}
          issues={getIssues().map((i) => ({
            id: i.id,
            title: i[locale].title,
            options: i.options.map((o) => ({ id: o.id, text: o[locale] })),
          }))}
          surveyContentVersion={versions.surveyContentVersion}
          matchingVersion={versions.matchingVersion}
        />
      )}

      <section
        className="flex items-end justify-between gap-6"
        aria-labelledby={top ? "invite-heading" : undefined}
      >
        <div className="flex flex-col items-start gap-5">
          {top ? (
            <h2 id="invite-heading" className="display text-3xl sm:text-5xl">
              {t("inviteHeading")}
            </h2>
          ) : (
            <h1 className="display text-4xl sm:text-6xl">{t("landingGenericHeading")}</h1>
          )}
          <p className="max-w-prose text-lg leading-relaxed">{t("inviteBody")}</p>
          <ElectionGate
            serverOver={electionOver}
            open={
              <StartSurveyLink
                surveyContentVersion={versions.surveyContentVersion}
                dir={localeDirection[locale]}
              />
            }
            closed={<ElectionOverBanner />}
          />
        </div>
        <BallotArt className="hidden text-[13px] sm:block" />
      </section>
    </div>
  );
}
