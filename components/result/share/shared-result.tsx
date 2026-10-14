"use client";

/**
 * The shared result on a share page. A plain link shows the parties in its
 * address, as rendered on the server. A link with answers (`#a=…`, see
 * lib/share/answers.ts) is read here, in the browser, and never reaches the
 * server: the result is worked out again from the answers with the survey's own
 * matching, so the page can't show a result they don't produce, and the answers
 * are listed below it (issue and chosen position only, no per-party breakdown,
 * no poll data). Unreadable answers leave the plain view with a short note.
 * Nothing here is counted.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { loadMatchingBundle, type BundleLocale } from "@/lib/matching/data";
import { answersFromHash, decodeAnswers, sharedTopParties } from "@/lib/share/answers";
import { sharePath } from "@/lib/share/params";
import { SharedParties, type SharedParty } from "./shared-parties";

export interface SharedIssue {
  id: string;
  title: string;
  options: { id: string; text: string }[];
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const hashAnswers = () => answersFromHash(window.location.hash);
const noAnswers = () => null;

type Outcome = { value: string; top: string[] | null };

export function SharedResult({
  parties,
  names,
  issues,
  surveyContentVersion,
  matchingVersion,
}: {
  /** The parties in the link's address. */
  parties: SharedParty[];
  /** Every party a shared result may name, by ID. */
  names: Record<string, string>;
  issues: SharedIssue[];
  surveyContentVersion: string;
  matchingVersion: string;
}) {
  const t = useTranslations("Share");
  const locale = useLocale() as BundleLocale;
  const value = useSyncExternalStore(subscribe, hashAnswers, noAnswers);
  const decoded = useMemo(
    () => (value === null ? null : decodeAnswers(value, { surveyContentVersion, issues })),
    [value, surveyContentVersion, issues],
  );
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    if (value === null || !decoded?.ok) return;
    let cancelled = false;
    void loadMatchingBundle({ locale, matchingVersion, surveyContentVersion }).then((res) => {
      if (cancelled) return;
      const top = res.ok ? sharedTopParties(res.bundle, decoded.input, Object.keys(names)) : null;
      setOutcome({ value, top });
    });
    return () => {
      cancelled = true;
    };
  }, [value, decoded, locale, matchingVersion, surveyContentVersion, names]);

  const current = outcome?.value === value ? outcome : null;
  const top = current?.top ?? null;

  // The address names the parties the answers produce, so a copy of it (and its
  // preview image) agrees with what this page shows.
  useEffect(() => {
    if (!top) return;
    const path = sharePath(locale, top);
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path + window.location.hash);
    }
  }, [top, locale]);

  if (value === null) return <SharedParties parties={parties} note="landingNote" />;

  const failed = !decoded?.ok || (current && !top);
  if (failed) {
    return (
      <div className="flex flex-col gap-4">
        <SharedParties parties={parties} note="landingNote" />
        <p role="note" className="note" data-testid="shared-answers-unavailable">
          {t("answersUnavailable")}
        </p>
      </div>
    );
  }
  if (!top || !decoded?.ok) {
    // Working the result out: the address's parties, which an untouched link shares.
    return (
      <div aria-busy="true" data-testid="shared-answers-pending">
        <SharedParties parties={parties} note={null} />
      </div>
    );
  }

  const issueById = new Map(issues.map((i) => [i.id, i]));
  return (
    <div className="flex flex-col gap-8" data-testid="shared-with-answers">
      <SharedParties
        parties={top.map((id) => ({ id, name: names[id] }))}
        note="landingNoteAnswers"
      />
      <section aria-labelledby="shared-answers-heading" className="flex flex-col gap-3">
        <h2
          id="shared-answers-heading"
          className="display border-foreground border-t-2 pt-4 text-2xl sm:text-3xl"
        >
          {t("answersHeading")}
        </h2>
        <p className="text-muted-foreground max-w-prose text-sm">{t("answersIntro")}</p>
        <ol className="flex flex-col gap-3" data-testid="shared-answers">
          {decoded.input.ranked.map((issueId, i) => {
            const issue = issueById.get(issueId)!;
            const optionId = decoded.input.answers[issueId];
            const option = issue.options.find((o) => o.id === optionId)!;
            return (
              <li
                key={issueId}
                className="border-foreground/15 flex gap-3 border-b pb-3"
                data-testid="shared-answer"
                data-issue-id={issueId}
                data-option-id={optionId}
              >
                <span className="display w-6 shrink-0 text-xl tabular-nums" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-bold">{issue.title}</p>
                  <p className="max-w-prose leading-relaxed">{option.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
