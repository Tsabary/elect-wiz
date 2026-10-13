"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
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

/** The registry facts under a party's name: joint list or ballot letters, poll note, limited information. */
function EntryFacts({ entry, serverBlackout }: { entry: MatchEntry; serverBlackout: boolean }) {
  const t = useTranslations("Result");
  const m = entry.metadata;
  return (
    <>
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
    </>
  );
}

/** The per-issue breakdown followed by the "also worth knowing" points. */
function EntryDetails({
  entry,
  issueById,
}: {
  entry: MatchEntry;
  issueById: Map<string, ClientIssue>;
}) {
  const breakdown = [...entry.breakdown].sort((a, b) => a.rank - b.rank);
  return (
    <>
      {breakdown.length > 0 && (
        <ol className="flex flex-col gap-3" data-testid="breakdown">
          {breakdown.map((b) => (
            <BreakdownItem
              key={b.issueId}
              item={b}
              partyId={entry.partyId}
              title={issueById.get(b.issueId)?.title ?? b.issueId}
            />
          ))}
        </ol>
      )}
      <Points entry={entry} />
    </>
  );
}

function ResearchLink({ entry }: { entry: MatchEntry }) {
  const t = useTranslations("Result");
  const locale = useLocale();
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={`/parties/${entry.partyId}`}
      className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-medium underline underline-offset-4"
      data-testid="research-link"
    >
      {t("readResearch", { name: entry.metadata.name })}
      <Arrow className="size-4" aria-hidden="true" />
    </Link>
  );
}

const hasDetails = (entry: MatchEntry) => entry.breakdown.length > 0 || entry.points.length > 0;

/** One of the parties shown in full. The top match's details are open; the others' are collapsed. */
export function ResultEntryCard({
  entry,
  position,
  issueById,
  serverBlackout,
}: {
  entry: MatchEntry;
  position: number;
  issueById: Map<string, ClientIssue>;
  serverBlackout: boolean;
}) {
  const t = useTranslations("Result");
  const isTop = position === 0;
  const headingId = `party-${entry.partyId}`;
  const details = <EntryDetails entry={entry} issueById={issueById} />;

  return (
    <section
      aria-labelledby={headingId}
      data-testid="result-entry"
      data-party-id={entry.partyId}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 sm:p-5",
        isTop && "border-primary border-2",
      )}
    >
      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm font-medium">
          {isTop ? t("topMatchLabel") : t("runnerUpLabel", { n: position + 1 })}
        </p>
        <h2 id={headingId} className={cn("font-bold text-balance", isTop ? "text-2xl" : "text-xl")}>
          <Link href={`/parties/${entry.partyId}`} className="underline-offset-4 hover:underline">
            {entry.metadata.name}
          </Link>
        </h2>
        <EntryFacts entry={entry} serverBlackout={serverBlackout} />
      </header>

      {isTop ? (
        details
      ) : hasDetails(entry) ? (
        <details className="group flex flex-col gap-3">
          <summary className="cursor-pointer text-sm font-medium underline underline-offset-4">
            {t("showBreakdown")}
          </summary>
          <div className="mt-3 flex flex-col gap-4">{details}</div>
        </details>
      ) : null}

      <ResearchLink entry={entry} />
    </section>
  );
}

/**
 * One of the parties behind "show all": a compact row that opens to the same
 * facts, breakdown and points as a full card.
 */
export function ResultEntryRow({
  entry,
  position,
  issueById,
  serverBlackout,
}: {
  entry: MatchEntry;
  position: number;
  issueById: Map<string, ClientIssue>;
  serverBlackout: boolean;
}) {
  const t = useTranslations("Result");
  return (
    <li data-testid="result-row" data-party-id={entry.partyId} className="rounded-xl border">
      <details className="group">
        {/* A flex summary has no native marker, so the chevron shows the open state. */}
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
          <span className="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
            {t("position", { n: position + 1 })}
          </span>
          <span className="grow font-semibold">{entry.metadata.name}</span>
          <ChevronDown
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="flex flex-col gap-4 border-t px-4 py-4">
          <div className="flex flex-col gap-2">
            <EntryFacts entry={entry} serverBlackout={serverBlackout} />
          </div>
          <EntryDetails entry={entry} issueById={issueById} />
          <ResearchLink entry={entry} />
        </div>
      </details>
    </li>
  );
}

/** The "also worth knowing" points, each linked to its place in the party's research. */
function Points({ entry }: { entry: MatchEntry }) {
  const t = useTranslations("Result");
  if (entry.points.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" data-testid="points">
      <h3 className="font-semibold">{t("pointsHeading")}</h3>
      <ul className="flex flex-col gap-3">
        {entry.points.map((point, i) => (
          <li
            key={point.anchor}
            className="flex flex-col gap-1.5 rounded-lg border p-3"
            data-testid="point"
          >
            <p className="text-sm leading-relaxed">{point.text}</p>
            <Link
              href={`/parties/${entry.partyId}#${point.anchor}`}
              className="inline-flex min-h-8 items-center self-start py-1 text-sm underline underline-offset-4"
              aria-label={t("pointLinkAria", { n: i + 1, name: entry.metadata.name })}
              data-testid="point-link"
            >
              {t("readInResearch")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BreakdownItem({
  item,
  partyId,
  title,
}: {
  item: IssueBreakdown;
  partyId: string;
  title: string;
}) {
  const t = useTranslations("Result");
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
            className="bg-primary/70 block h-full rounded-full"
            style={{ width: `${Math.round(item.weight * 100)}%` }}
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
