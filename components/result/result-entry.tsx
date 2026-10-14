"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BallotSlip } from "@/components/parties/ballot-slip";
import { JointListLabel } from "@/components/parties/joint-list-label";
import { PollNoteText } from "@/components/polls/poll-note";
import type { ClientIssue } from "@/components/survey/types";
import { PollContent } from "@/components/time/time-modes";
import { Link } from "@/i18n/navigation";
import type { AgreementLevel, IssueBreakdown, MatchEntry } from "@/lib/matching/contract";
import { cn } from "@/lib/utils";

/*
 * Privacy: no link to a party page here is prefetched (`prefetch={false}`).
 * A prefetch would make the browser ask the server for the user's top parties
 * as soon as the result shows, and the host's logs would tie the address to
 * them. Only a click fetches a party page.
 */

/** Neutral, shape-based agreement markers (no colour coding, no party colours). */
const AGREEMENT_MARK: Record<AgreementLevel, string> = {
  agrees: "●",
  partially: "◐",
  disagrees: "○",
  "party-position-unclear": "?",
};

/** The tag around the marker goes from filled to hollow with the agreement, in ink only. */
const AGREEMENT_TAG: Record<AgreementLevel, string> = {
  agrees: "bg-foreground text-background border-foreground",
  partially: "bg-kraft border-foreground/40",
  disagrees: "border-foreground/40",
  "party-position-unclear": "border-foreground/40 border-dashed",
};

/**
 * `lang` and `dir` for a party text shown in another language than the page
 * (the "Hebrew content pending" fallback), so it is read and laid out correctly.
 */
const textLangProps = (lang: MatchEntry["textsLang"]) =>
  lang ? ({ lang, dir: lang === "he" ? "rtl" : "ltr" } as const) : {};

/**
 * The registry facts under a party's name: joint list, poll note, limited
 * information. The ballot letters are on the slip shown beside the name.
 * `brief` leaves out the limited-information note, for a collapsed row.
 */
function EntryFacts({
  entry,
  serverBlackout,
  brief = false,
}: {
  entry: MatchEntry;
  serverBlackout: boolean;
  brief?: boolean;
}) {
  const t = useTranslations("Result");
  const m = entry.metadata;
  return (
    <>
      {m.isJointList && (
        <p className="text-sm">
          <JointListLabel partners={m.partners} listName={m.listName} prefetch={false} />
        </p>
      )}
      {m.pollNote && (
        <PollContent serverBlackout={serverBlackout}>
          <p className="text-muted-foreground text-sm">
            <PollNoteText note={m.pollNote} />
          </p>
        </PollContent>
      )}
      {m.limitedInfo && !brief && (
        <p role="note" className="note" data-testid="result-limited-info">
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
        <ol className="flex flex-col" data-testid="breakdown">
          {breakdown.map((b) => (
            <BreakdownItem
              key={b.issueId}
              item={b}
              partyId={entry.partyId}
              textsLang={entry.textsLang}
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
      prefetch={false}
      className="link inline-flex min-h-11 items-center gap-1 self-start"
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
      className={cn("sheet flex flex-col", isTop ? "overflow-hidden" : "gap-4 p-4 sm:p-5")}
    >
      {/* The party's name, with its list's ballot slip beside it. The top match gets the dark band. */}
      <header
        className={cn(
          "flex items-start gap-4",
          isTop &&
            "bg-ink text-ink-foreground on-ink items-center px-4 py-6 sm:gap-8 sm:px-7 sm:py-9",
        )}
      >
        <div className="flex min-w-0 grow flex-col gap-2">
          <p className={isTop ? "eyebrow" : "text-muted-foreground text-sm font-bold"}>
            {isTop ? t("topMatchLabel") : t("runnerUpLabel", { n: position + 1 })}
          </p>
          <h2
            id={headingId}
            className={cn("display", isTop ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl")}
          >
            <Link
              href={`/parties/${entry.partyId}`}
              prefetch={false}
              className="underline-offset-4 hover:underline"
            >
              {entry.metadata.name}
            </Link>
          </h2>
          {!isTop && <EntryFacts entry={entry} serverBlackout={serverBlackout} />}
        </div>
        <BallotSlip
          letters={entry.metadata.ballotLetters}
          listName={entry.metadata.listName}
          className={cn(isTop && "slip-drop rotate-3 shadow-[0_14px_28px_-10px_rgb(0_0_0/0.7)]")}
        />
      </header>

      {isTop ? (
        <div className="flex flex-col gap-5 p-4 sm:p-7">
          <EntryFacts entry={entry} serverBlackout={serverBlackout} />
          {details}
          <ResearchLink entry={entry} />
        </div>
      ) : (
        <>
          {hasDetails(entry) ? (
            <details className="group flex flex-col gap-3">
              <summary className="link-plain cursor-pointer py-1 text-sm font-medium">
                {t("showBreakdown")}
              </summary>
              <div className="mt-3 flex flex-col gap-4">{details}</div>
            </details>
          ) : null}
          <ResearchLink entry={entry} />
        </>
      )}
    </section>
  );
}

/**
 * One of the parties behind "show all": a compact row that opens to the same
 * facts, breakdown and points as a full card. While closed, the joint list and
 * poll note show under the name, as on the cards above.
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
  const m = entry.metadata;
  return (
    <li data-testid="result-row" data-party-id={entry.partyId} className="sheet group/row">
      <details className="group">
        {/* A flex summary has no native marker, so the chevron shows the open state. */}
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
          <span className="text-muted-foreground min-w-7 shrink-0 text-sm font-bold tabular-nums">
            {t("position", { n: position + 1 })}
          </span>
          <span className="min-w-0 grow font-bold">{entry.metadata.name}</span>
          <BallotSlip letters={entry.metadata.ballotLetters} size="compact" />
          <ChevronDown
            className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </summary>
        <div className="border-foreground/15 flex flex-col gap-4 border-t px-4 py-4">
          <div className="flex flex-col gap-2">
            <EntryFacts entry={entry} serverBlackout={serverBlackout} />
          </div>
          <EntryDetails entry={entry} issueById={issueById} />
          <ResearchLink entry={entry} />
        </div>
      </details>
      {/* Outside <summary>, which must not hold links; once open, the same facts lead the details. */}
      {(m.isJointList || m.pollNote) && (
        <div
          className="flex flex-col gap-1 ps-13 pe-4 pb-3 group-has-[details[open]]/row:hidden"
          data-testid="row-facts"
        >
          <EntryFacts entry={entry} serverBlackout={serverBlackout} brief />
        </div>
      )}
    </li>
  );
}

/** The "also worth knowing" points, each linked to its place in the party's research. */
function Points({ entry }: { entry: MatchEntry }) {
  const t = useTranslations("Result");
  if (entry.points.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" data-testid="points">
      <h3 className="eyebrow">{t("pointsHeading")}</h3>
      <ul className="flex flex-col">
        {entry.points.map((point, i) => (
          <li
            key={point.anchor}
            className="border-foreground/15 flex flex-col gap-1.5 border-t py-3 last:pb-0"
            data-testid="point"
          >
            <p className="leading-relaxed" {...textLangProps(entry.textsLang)}>
              {point.text}
            </p>
            <Link
              href={`/parties/${entry.partyId}#${point.anchor}`}
              prefetch={false}
              className="link inline-flex min-h-8 items-center self-start py-1 text-sm"
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
  textsLang,
  title,
}: {
  item: IssueBreakdown;
  partyId: string;
  textsLang: MatchEntry["textsLang"];
  title: string;
}) {
  const t = useTranslations("Result");
  return (
    <li
      className="border-foreground/15 flex flex-col gap-2 border-t py-4 last:pb-0"
      data-testid="breakdown-item"
      data-issue-id={item.issueId}
      data-agreement={item.agreement}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-sm font-bold",
            AGREEMENT_TAG[item.agreement],
          )}
        >
          <span aria-hidden="true">{AGREEMENT_MARK[item.agreement]}</span>
          {t(`agreement.${item.agreement}`)}
        </span>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span>{t("importance", { rank: item.rank })}</span>
        <span
          aria-hidden="true"
          className="bg-foreground/15 h-1.5 w-20 overflow-hidden rounded-full"
        >
          <span
            className="bg-primary block h-full rounded-full"
            style={{ width: `${Math.round(item.weight * 100)}%` }}
          />
        </span>
      </div>
      <p className="leading-relaxed" {...textLangProps(textsLang)}>
        {item.explanation}
      </p>
      <Link
        href={`/parties/${partyId}#${item.anchor}`}
        prefetch={false}
        className="link inline-flex min-h-8 items-center self-start py-1 text-sm"
        aria-label={t("readInResearchAria", { title })}
        data-testid="breakdown-link"
      >
        {t("readInResearch")}
      </Link>
    </li>
  );
}
