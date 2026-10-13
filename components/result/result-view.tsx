"use client";

/**
 * The result (PRD Step 4): top match plus the next closest parties, a per-issue
 * breakdown, factual notes from the registry, a disclaimer and sharing.
 * Deliberately no "edit answers". "Start over" (owner decision 2026-10-13: matching
 * now costs nothing) sits under the share box and opens a new, empty survey.
 *
 * The result carries every researched party in score order: the first
 * `FULL_ENTRIES` are shown as full cards, the rest as compact rows behind a
 * "show all" control. Share links carry the first `TOP_ENTRIES` only.
 */
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { FULL_ENTRIES, TOP_ENTRIES, type MatchResponse } from "@/lib/matching/contract";
import type { ClientIssue } from "@/components/survey/types";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ResultEntryCard, ResultEntryRow } from "./result-entry";
import { ShareButton } from "./share/share-button";

export function ResultView({
  result,
  issues,
  serverBlackout,
  headingRef,
  onStartOver,
}: {
  result: MatchResponse;
  issues: ClientIssue[];
  /** The blackout state the page was rendered with; `PollContent` re-checks it in the browser. */
  serverBlackout: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** Leaves the result for a new, empty survey. The saved survey is already gone by now. */
  onStartOver: () => void;
}) {
  const t = useTranslations("Result");
  const tCommon = useTranslations("Common");
  const [top, ...rest] = result.entries.slice(0, FULL_ENTRIES);
  const others = result.entries.slice(FULL_ENTRIES);
  const issueById = new Map(issues.map((i) => [i.id, i]));
  // Some party texts are in another language than the page (Hebrew content pending).
  const hasFallbackTexts = result.entries.some((e) => e.textsLang);

  return (
    <article className="flex flex-col gap-8" data-testid="result" aria-labelledby="result-heading">
      <header className="flex flex-col gap-3">
        <h1
          id="result-heading"
          ref={headingRef}
          tabIndex={-1}
          className="display text-4xl outline-none sm:text-6xl"
        >
          {t("heading")}
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">{t("intro")}</p>
      </header>

      {hasFallbackTexts && (
        <p role="note" data-testid="content-fallback-notice" className="note font-medium">
          {t("contentFallbackNotice")}
        </p>
      )}

      {result.weakMatch && (
        <p role="note" data-testid="weak-match" className="note !text-base font-bold">
          {t("weakMatch")}
        </p>
      )}

      {top && (
        <ResultEntryCard
          entry={top}
          position={0}
          issueById={issueById}
          serverBlackout={serverBlackout}
        />
      )}

      {rest.length > 0 && (
        <section aria-labelledby="runners-up-heading" className="flex flex-col gap-4">
          <h2
            id="runners-up-heading"
            className="display border-foreground border-t-2 pt-4 text-2xl sm:text-3xl"
          >
            {t("runnersUpHeading")}
          </h2>
          {rest.map((entry, i) => (
            <ResultEntryCard
              key={entry.partyId}
              entry={entry}
              position={i + 1}
              issueById={issueById}
              serverBlackout={serverBlackout}
            />
          ))}
        </section>
      )}

      {others.length > 0 && (
        <details data-testid="all-parties">
          <summary data-testid="show-all" className="link-plain cursor-pointer py-2.5 font-medium">
            {t("showAll", { count: others.length })}
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            <p className="text-muted-foreground text-sm" data-testid="all-parties-note">
              {t("allPartiesNote")}
            </p>
            <ol className="flex flex-col gap-2" data-testid="all-parties-list">
              {others.map((entry, i) => (
                <ResultEntryRow
                  key={entry.partyId}
                  entry={entry}
                  position={FULL_ENTRIES + i}
                  issueById={issueById}
                  serverBlackout={serverBlackout}
                />
              ))}
            </ol>
          </div>
        </details>
      )}

      {/* No poll wording, so it stays up during the blackout. */}
      <p className="text-sm" data-testid="not-all-lists">
        {t.rich("notAllLists", {
          link: (chunks) => (
            <Link href="/parties" className="link">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <aside
        data-testid="disclaimer"
        className="border-foreground flex flex-col gap-1 border-y-2 py-4 text-sm leading-relaxed"
      >
        <p className="display text-lg">{t("disclaimerTitle")}</p>
        <p className="text-muted-foreground max-w-prose">{t("disclaimer")}</p>
        <p className="mt-1">
          <Link href="/how-it-works" className="link">
            {t("howItWorksLink")}
          </Link>
        </p>
      </aside>

      <ShareButton
        partyIds={result.entries.slice(0, TOP_ENTRIES).map((e) => e.partyId)}
        topName={top?.metadata.name ?? ""}
      />

      <div className="flex flex-col items-start gap-2">
        <Button
          variant="outline"
          size="lg"
          className="h-11 gap-2 px-4 text-base"
          onClick={onStartOver}
          aria-describedby="start-over-hint"
          data-testid="start-over"
        >
          <RotateCcw aria-hidden="true" />
          {tCommon("startOver")}
        </Button>
        <p id="start-over-hint" className="text-muted-foreground text-sm">
          {t("startOverHint")}
        </p>
      </div>
    </article>
  );
}
