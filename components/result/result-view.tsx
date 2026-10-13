"use client";

/**
 * The result (PRD Step 4): top match plus the next closest parties, a per-issue
 * breakdown, factual notes from the registry, a disclaimer and sharing.
 * Deliberately no "edit answers" or "try again" affordances.
 *
 * The result carries every researched party in score order: the first
 * `FULL_ENTRIES` are shown as full cards, the rest as compact rows behind a
 * "show all" control. Share links carry the first `TOP_ENTRIES` only.
 */
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { FULL_ENTRIES, TOP_ENTRIES, type MatchResponse } from "@/lib/matching/contract";
import type { ClientIssue } from "@/components/survey/types";
import { Link } from "@/i18n/navigation";
import { ResultEntryCard, ResultEntryRow } from "./result-entry";
import { ShareButton } from "./share/share-button";

export function ResultView({
  result,
  issues,
  serverBlackout,
  headingRef,
}: {
  result: MatchResponse;
  issues: ClientIssue[];
  /** The blackout state the page was rendered with; `PollContent` re-checks it in the browser. */
  serverBlackout: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("Result");
  const [top, ...rest] = result.entries.slice(0, FULL_ENTRIES);
  const others = result.entries.slice(FULL_ENTRIES);
  const issueById = new Map(issues.map((i) => [i.id, i]));
  // Some party texts are in another language than the page (Hebrew content pending).
  const hasFallbackTexts = result.entries.some((e) => e.textsLang);

  return (
    <article className="flex flex-col gap-6" data-testid="result" aria-labelledby="result-heading">
      <header className="flex flex-col gap-3">
        <h1
          id="result-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-bold outline-none"
        >
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">{t("intro")}</p>
      </header>

      {hasFallbackTexts && (
        <p
          role="note"
          data-testid="content-fallback-notice"
          className="bg-muted rounded-xl border px-4 py-3 text-sm font-medium"
        >
          {t("contentFallbackNotice")}
        </p>
      )}

      {result.weakMatch && (
        <p
          role="note"
          data-testid="weak-match"
          className="bg-muted rounded-xl border px-4 py-3 font-medium"
        >
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
          <h2 id="runners-up-heading" className="text-xl font-semibold">
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
          <summary
            data-testid="show-all"
            className="cursor-pointer py-2.5 font-medium underline underline-offset-4"
          >
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
            <Link href="/parties" className="underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <aside
        data-testid="disclaimer"
        className="rounded-xl border px-4 py-3 text-sm leading-relaxed"
      >
        <p className="font-semibold">{t("disclaimerTitle")}</p>
        <p className="text-muted-foreground">{t("disclaimer")}</p>
        <p className="mt-2">
          <Link href="/how-it-works" className="underline underline-offset-4">
            {t("howItWorksLink")}
          </Link>
        </p>
      </aside>

      <ShareButton
        partyIds={result.entries.slice(0, TOP_ENTRIES).map((e) => e.partyId)}
        topName={top?.metadata.name ?? ""}
      />
    </article>
  );
}
