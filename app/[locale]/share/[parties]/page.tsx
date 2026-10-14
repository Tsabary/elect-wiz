import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BallotArt } from "@/components/brand/ballot-art";
import { StartSurveyLink } from "@/components/home/start-survey-link";
import { ElectionOverBanner } from "@/components/time/election-over-banner";
import { ElectionGate } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import { getParties, getVersions } from "@/lib/content/loaders";
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
  const [top, ...rest] = shared;
  const { electionOver } = timeModes(resolveNow());

  return (
    <div className="flex flex-col gap-12" data-testid="share-landing">
      {/* Party links aren't prefetched: only a click fetches a party page (as on the result). */}
      {top && (
        <section
          className="bg-ink text-ink-foreground on-ink -mx-4 flex flex-col gap-5 px-4 py-8 sm:mx-0 sm:rounded-sm sm:p-10"
          aria-labelledby="shared-heading"
        >
          <p className="eyebrow">{t("landingEyebrow")}</p>
          <h1 id="shared-heading" className="display text-4xl sm:text-6xl">
            <Link
              href={`/parties/${top.id}`}
              prefetch={false}
              className="underline-offset-8 hover:underline"
              data-testid="shared-top"
            >
              {top.name}
            </Link>
          </h1>
          {rest.length > 0 && (
            <div className="border-ink-foreground/25 flex flex-col gap-2 border-t pt-4">
              <p className="text-ink-muted text-sm font-medium">{t("alsoClose")}</p>
              <ul className="flex flex-col" data-testid="shared-rest">
                {rest.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/parties/${p.id}`}
                      prefetch={false}
                      className="decoration-ink-foreground/40 hover:decoration-ink-foreground inline-flex min-h-9 items-center text-lg font-medium underline decoration-1 underline-offset-4"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-ink-muted text-sm">{t("landingNote")}</p>
        </section>
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
                surveyContentVersion={getVersions().surveyContentVersion}
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
