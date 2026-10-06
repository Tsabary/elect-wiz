"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { JointListLabel } from "@/components/parties/joint-list-label";
import { PollNoteText } from "@/components/polls/poll-note";
import type { ClientIssue } from "@/components/survey/types";
import { PollContent } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import type { AgreementLevel, IssueBreakdown, MatchEntry } from "@/lib/matching/contract";
import { cn } from "@/lib/utils";

/** Neutral, shape-based agreement markers (no colour coding, no party colours). */
const AGREEMENT_MARK: Record<AgreementLevel, string> = {
  agrees: "●",
  partially: "◐",
  disagrees: "○",
  "party-position-unclear": "?",
};

export function ResultEntryCard({
  entry,
  position,
  issueById,
  totalRanked,
  serverBlackout,
}: {
  entry: MatchEntry;
  position: number;
  issueById: Map<string, ClientIssue>;
  totalRanked: number;
  serverBlackout: boolean;
}) {
  const t = useTranslations("Result");
  const locale = useLocale();
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  const isTop = position === 0;
  const m = entry.metadata;
  const breakdown = [...entry.breakdown].sort((a, b) => a.rank - b.rank);
  const headingId = `party-${entry.partyId}`;

  const details = (
    <>
      {breakdown.length > 0 && (
        <ol className="flex flex-col gap-3" data-testid="breakdown">
          {breakdown.map((b) => (
            <BreakdownItem
              key={b.issueId}
              item={b}
              partyId={entry.partyId}
              title={issueById.get(b.issueId)?.title ?? b.issueId}
              totalRanked={totalRanked}
            />
          ))}
        </ol>
      )}
      {entry.anythingElseNote && (
        <div className="rounded-lg border px-3 py-2 text-sm" data-testid="anything-else-note">
          <p className="font-medium">{t("anythingElseHeading")}</p>
          <p className="text-muted-foreground">{entry.anythingElseNote.explanation}</p>
          <Link
            href={`/parties/${entry.partyId}#${entry.anythingElseNote.anchor}`}
            className="inline-flex min-h-8 items-center py-1 text-sm underline underline-offset-4"
            data-testid="anything-else-link"
          >
            {t("readInResearch")}
          </Link>
        </div>
      )}
    </>
  );

  return (
    <section
      aria-labelledby={headingId}
      data-testid="result-entry"
      data-party-id={entry.partyId}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 sm:p-5",
        isTop && "border-foreground border-2",
      )}
    >
      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm font-medium">
          {isTop ? t("topMatchLabel") : t("runnerUpLabel", { n: position + 1 })}
        </p>
        <h2 id={headingId} className={cn("font-bold text-balance", isTop ? "text-2xl" : "text-xl")}>
          <Link href={`/parties/${entry.partyId}`} className="underline-offset-4 hover:underline">
            {m.name}
          </Link>
        </h2>
        {m.isJointList && (
          <p className="text-sm">
            <JointListLabel
              partners={m.partners}
              listName={m.listName}
              ballotLetters={m.ballotLetters}
            />
          </p>
        )}
        {!m.isJointList && m.ballotLetters && (
          <p className="text-muted-foreground text-sm">
            {t("ballotLetters", { letters: m.ballotLetters })}
          </p>
        )}
        {m.pollNote && (
          <PollContent serverBlackout={serverBlackout}>
            <p className="text-muted-foreground text-sm">
              <PollNoteText note={m.pollNote} />
            </p>
          </PollContent>
        )}
        {m.limitedInfo && (
          <p
            role="note"
            className="bg-muted rounded-lg px-3 py-2 text-sm"
            data-testid="result-limited-info"
          >
            <strong>{t("limitedInfoTitle")}</strong> {t("limitedInfoBody")}
          </p>
        )}
      </header>

      {isTop ? (
        details
      ) : breakdown.length > 0 || entry.anythingElseNote ? (
        <details className="group flex flex-col gap-3">
          <summary className="cursor-pointer text-sm font-medium underline underline-offset-4">
            {t("showBreakdown")}
          </summary>
          <div className="mt-3 flex flex-col gap-3">{details}</div>
        </details>
      ) : null}

      <Link
        href={`/parties/${entry.partyId}`}
        className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-medium underline underline-offset-4"
        data-testid="research-link"
      >
        {t("readResearch", { name: m.name })}
        <Arrow className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}

function BreakdownItem({
  item,
  partyId,
  title,
  totalRanked,
}: {
  item: IssueBreakdown;
  partyId: string;
  title: string;
  totalRanked: number;
}) {
  const t = useTranslations("Result");
  const weight = item.weight ?? (totalRanked ? (totalRanked - item.rank + 1) / totalRanked : 0);
  return (
    <li
      className="flex flex-col gap-1.5 rounded-lg border p-3"
      data-testid="breakdown-item"
      data-issue-id={item.issueId}
      data-agreement={item.agreement}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="font-semibold">{title}</h3>
        <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium">
          <span aria-hidden="true">{AGREEMENT_MARK[item.agreement]}</span>
          {t(`agreement.${item.agreement}`)}
        </span>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span>{t("importance", { rank: item.rank })}</span>
        <span aria-hidden="true" className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
          <span
            className="bg-foreground/60 block h-full rounded-full"
            style={{ width: `${Math.round(weight * 100)}%` }}
          />
        </span>
      </div>
      <p className="text-sm leading-relaxed">{item.explanation}</p>
      <Link
        href={`/parties/${partyId}#${item.anchor}`}
        className="inline-flex min-h-8 items-center self-start py-1 text-sm underline underline-offset-4"
        aria-label={t("readInResearchAria", { title })}
        data-testid="breakdown-link"
      >
        {t("readInResearch")}
      </Link>
    </li>
  );
}
