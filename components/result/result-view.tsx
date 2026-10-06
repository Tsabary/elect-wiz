"use client";

/**
 * The result (PRD Step 4): top match plus 2–3 runners-up, a per-issue breakdown,
 * factual notes from the registry, a disclaimer and sharing. Deliberately no
 * "edit answers" or "try again" affordances.
 */
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import type { MatchResponse } from "@/lib/matching/contract";
import type { ClientIssue } from "@/components/survey/types";
import { Link } from "@/i18n/navigation";
import { ResultEntryCard } from "./result-entry";
import { ShareButton } from "./share/share-button";

export function ResultView({
  result,
  issues,
  headingRef,
}: {
  result: MatchResponse;
  issues: ClientIssue[];
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("Result");
  const [top, ...rest] = result.entries;
  const issueById = new Map(issues.map((i) => [i.id, i]));
  const totalRanked = Math.max(0, ...result.entries.flatMap((e) => e.breakdown.map((b) => b.rank)));

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
          totalRanked={totalRanked}
          serverBlackout={result.meta.blackout}
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
              totalRanked={totalRanked}
              serverBlackout={result.meta.blackout}
            />
          ))}
        </section>
      )}

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
        partyIds={result.entries.map((e) => e.partyId)}
        topName={top?.metadata.name ?? ""}
      />
    </article>
  );
}
