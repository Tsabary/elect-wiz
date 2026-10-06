import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { JointListLabel } from "@/components/parties/joint-list-label";
import { calendarDate } from "@/components/polls/poll-note";
import { PollInfo } from "@/components/research/poll-info";
import { ResearchDocument } from "@/components/research/research-document";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getList, getLists, getParties, getParty, getResearchDoc } from "@/lib/content/loaders";
import { partySummary } from "@/lib/content/party-view";
import { pageMetadata } from "@/lib/site";
import { resolveNow, timeModes } from "@/lib/time-modes";

// Time-sensitive (poll blackout): statically generated, revalidated about every 5 minutes.
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getParties().map((p) => ({ locale, partyId: p.id })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/parties/[partyId]">): Promise<Metadata> {
  const { locale, partyId } = (await params) as { locale: Locale; partyId: string };
  const party = getParty(partyId);
  if (!party) return {};
  const t = await getTranslations({ locale, namespace: "Research" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: `parties/${partyId}`,
    title: party.name[locale],
    description: t("description", { name: party.name[locale] }),
    siteName: m("siteName"),
  });
}

export default async function PartyPage({ params }: PageProps<"/[locale]/parties/[partyId]">) {
  const { locale, partyId } = (await params) as { locale: Locale; partyId: string };
  setRequestLocale(locale);
  const party = getParty(partyId);
  const list = party && getList(party.listId);
  const doc = party && getResearchDoc(partyId, locale);
  if (!party || !list || !doc) notFound();

  const t = await getTranslations("Research");
  const format = await getFormatter();
  const summary = partySummary(party, getParties(), getLists(), locale);
  const modes = timeModes(resolveNow());
  const researchedAsOf = doc.researchedAsOf || party.researchedAsOf;

  return (
    <article className="flex flex-col gap-8">
      <nav aria-label={t("breadcrumbLabel")} className="text-sm">
        <Link href="/parties" className="text-muted-foreground underline underline-offset-4">
          {t("backToParties")}
        </Link>
      </nav>

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-balance" data-testid="party-name">
          {summary.name}
        </h1>
        <dl className="grid gap-x-6 gap-y-2 rounded-xl border p-4 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-muted-foreground">{t("leader")}</dt>
          <dd>{summary.leader}</dd>
          <dt className="text-muted-foreground">{t("list")}</dt>
          <dd>{summary.list.name}</dd>
          {summary.list.ballotLetters && (
            <>
              <dt className="text-muted-foreground">{t("ballotLetters")}</dt>
              <dd className="font-semibold">{summary.list.ballotLetters}</dd>
            </>
          )}
          {researchedAsOf && (
            <>
              <dt className="text-muted-foreground">{t("researchedAsOf")}</dt>
              <dd data-testid="researched-as-of">
                {format.dateTime(calendarDate(researchedAsOf), {
                  dateStyle: "long",
                  timeZone: "UTC",
                })}
              </dd>
            </>
          )}
        </dl>
        {summary.list.isJoint && (
          <p className="rounded-lg border px-4 py-3 text-sm">
            <JointListLabel
              partners={summary.partners}
              listName={summary.list.name}
              ballotLetters={summary.list.ballotLetters}
            />
          </p>
        )}
        {party.limitedInfo && (
          <p
            role="note"
            data-testid="limited-info"
            className="bg-muted rounded-lg border px-4 py-3 text-sm"
          >
            <strong>{t("limitedInfoTitle")}</strong> {t("limitedInfoBody")}
          </p>
        )}
      </header>

      <ResearchDocument doc={doc} afterOverview={<PollInfo list={list} modes={modes} />} />
    </article>
  );
}
