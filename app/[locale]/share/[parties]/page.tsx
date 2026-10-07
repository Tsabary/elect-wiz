import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StartSurveyLink } from "@/components/home/start-survey-link";
import { ElectionOverBanner } from "@/components/time/election-over-banner";
import { ElectionGate } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import { getParties, getVersions } from "@/lib/content/loaders";
import { parseSharedParties } from "@/lib/share/params";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (election-over); generated on demand and revalidated about every 5 minutes.
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

type Params = { locale: Locale; parties: string };

function sharedParties(locale: Locale, segment: string) {
  const parties = getParties();
  return parseSharedParties(
    segment,
    parties.map((p) => p.id),
  ).map((id) => {
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
    <div className="flex flex-col gap-8" data-testid="share-landing">
      {top ? (
        <section
          className="border-primary flex flex-col gap-4 rounded-2xl border-2 p-5"
          aria-labelledby="shared-heading"
        >
          <p className="text-muted-foreground text-sm font-medium">{t("landingEyebrow")}</p>
          <h1 id="shared-heading" className="text-3xl font-bold text-balance">
            <Link
              href={`/parties/${top.id}`}
              className="underline-offset-4 hover:underline"
              data-testid="shared-top"
            >
              {top.name}
            </Link>
          </h1>
          {rest.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">{t("alsoClose")}</p>
              <ul className="flex flex-col gap-1" data-testid="shared-rest">
                {rest.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/parties/${p.id}`}
                      className="font-medium underline underline-offset-4"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-muted-foreground text-sm">{t("landingNote")}</p>
        </section>
      ) : (
        <h1 className="text-3xl font-bold">{t("landingGenericHeading")}</h1>
      )}

      <section className="flex flex-col items-start gap-4" aria-labelledby="invite-heading">
        <h2 id="invite-heading" className="text-2xl font-semibold">
          {t("inviteHeading")}
        </h2>
        <p className="text-muted-foreground max-w-prose">{t("inviteBody")}</p>
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
      </section>
    </div>
  );
}
