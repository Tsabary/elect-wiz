"use client";

/**
 * The survey flow: ranking → one answer screen per ranked issue → result. Runs
 * fully in the browser: progress lives only in on-device storage (PRD FR25),
 * and the result is computed here from the matching bundle, so the answers
 * never leave the device. The only calls out are the two anonymous counts
 * (`lib/tally/client.ts`).
 *
 * "Start over" (on the survey screens and under the result) puts a new survey
 * in place of the current one: empty, with new shuffle seeds, counted anew.
 */
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ResultView } from "@/components/result/result-view";
import { ErrorState } from "@/components/result/error-state";
import { LoadingState } from "@/components/result/loading-state";
import { useOnElectionOver } from "@/components/time/time-modes";
import { useRouter } from "@/i18n/navigation";
import type { MatchErrorCode, MatchResponse, PartyMetadata } from "@/lib/matching/contract";
import {
  loadMatchingBundle,
  matchLocally,
  type BundleLoadResult,
  type BundleLocale,
} from "@/lib/matching/data";
import type { MatchInput } from "@/lib/matching/score";
import {
  buildMatchInput,
  goTo,
  hasProgress,
  normalizeStep,
  type SurveyState,
  type SurveyStep,
} from "@/lib/survey/state";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";
import { createSurveyStore, type SurveyStore } from "@/lib/survey/store";
import { tallyResult, tallySurveyStarted } from "@/lib/tally/client";
import { AnswerStep } from "./answers/answer-step";
import { RankingStep } from "./ranking/ranking-step";
import { SurveyStartOver } from "./start-over";
import type { ClientIssue } from "./types";

type Phase =
  | { kind: "survey" }
  /** Submitted before the matching bundle arrived. */
  | { kind: "loading" }
  | { kind: "result"; result: MatchResponse }
  | { kind: "error"; code: MatchErrorCode; input: MatchInput };

const serverSnapshot = () => null;

export function SurveyApp({
  issues,
  parties,
  surveyContentVersion,
  matchingVersion,
  serverElectionOver,
  serverBlackout,
}: {
  issues: ClientIssue[];
  /** Registry facts for the researched parties, by party ID, with the blackout applied on the server. */
  parties: Record<string, PartyMetadata>;
  surveyContentVersion: string;
  /** Only names the matching bundle for caching; a newer bundle is used as it comes. */
  matchingVersion: string;
  serverElectionOver: boolean;
  serverBlackout: boolean;
}) {
  const locale = useLocale() as BundleLocale;
  const t = useTranslations("Survey");
  const router = useRouter();
  const [store] = useState<SurveyStore | null>(() =>
    typeof window === "undefined"
      ? null
      : createSurveyStore(surveyContentVersion, createSurveyStorage(browserLocalStorage()), {
          // Anonymous count, fire-and-forget: once per new survey, at its first ranking change.
          onStarted: () => tallySurveyStarted(),
        }),
  );
  const state = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    store?.get ?? serverSnapshot,
    serverSnapshot,
  );
  const [phase, setPhase] = useState<Phase>({ kind: "survey" });
  /** Counts "start over"s, so a new survey gets fresh screens and focus even on the same step. */
  const [restarts, setRestarts] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const issueIds = issues.map((i) => i.id);

  const goHome = useCallback(() => router.replace("/"), [router]);
  const over = useOnElectionOver(serverElectionOver, goHome);

  const step: SurveyStep | null = state ? normalizeStep(state, issueIds) : null;
  const stepKey =
    phase.kind !== "survey"
      ? phase.kind
      : step?.kind === "answer"
        ? `answer-${step.index}`
        : (step?.kind ?? "starting");

  // Move focus to the new screen's heading and scroll to the top on every step change.
  useEffect(() => {
    if (stepKey === "starting") return;
    window.scrollTo({ top: 0, behavior: "instant" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepKey, restarts]);

  const update = useCallback((fn: (s: SurveyState) => SurveyState) => store?.set(fn), [store]);
  const go = (next: SurveyStep) => update((s) => goTo(s, next));

  // The matching bundle: one request, shared by the prefetch and the submit.
  // A failed request is forgotten, so the next call tries again.
  const bundleRequest = useRef<Promise<BundleLoadResult> | null>(null);
  const bundleResult = useRef<BundleLoadResult | null>(null);
  const loadBundle = useCallback(() => {
    bundleRequest.current ??= loadMatchingBundle({
      locale,
      matchingVersion,
      surveyContentVersion,
    }).then((res) => {
      if (res.ok) bundleResult.current = res;
      else bundleRequest.current = null;
      return res;
    });
    return bundleRequest.current;
  }, [locale, matchingVersion, surveyContentVersion]);

  // Start fetching when the user reaches the first answer screen, so the result
  // normally appears with no wait.
  const answering = step?.kind === "answer";
  useEffect(() => {
    if (answering) void loadBundle();
  }, [answering, loadBundle]);

  function show(loaded: BundleLoadResult, input: MatchInput) {
    const res = loaded.ok ? matchLocally(loaded.bundle, input, parties) : loaded;
    if (res.ok) {
      // The result is shown once; a refresh starts a new survey (PRD, plan Data model §5).
      store?.clear();
      setPhase({ kind: "result", result: res.result });
      // Anonymous count, fire-and-forget: the top parties' IDs only, never the answers.
      tallyResult(res.result.entries.map((e) => e.partyId));
    } else {
      // Whatever was loaded couldn't be used: "try again" fetches it afresh.
      bundleRequest.current = null;
      bundleResult.current = null;
      setPhase({ kind: "error", code: res.code, input });
    }
  }

  async function match(input: MatchInput) {
    // The loading state shows only if the bundle hasn't arrived yet.
    if (bundleResult.current) return show(bundleResult.current, input);
    setPhase({ kind: "loading" });
    show(await loadBundle(), input);
  }

  function submit() {
    if (!state) return;
    const input = buildMatchInput(state, issues);
    if (input) void match(input);
  }

  /** Replaces the survey in hand (or the result shown) with a new, empty one at the ranking step. */
  function startOver() {
    store?.clear();
    setPhase({ kind: "survey" });
    setRestarts((n) => n + 1);
  }

  function restart() {
    store?.clear();
    // Reload so the page picks up the current survey content.
    window.location.reload();
  }

  if (over) return <p className="text-muted-foreground">{t("closed")}</p>;

  if (!state || !step) {
    return (
      <div aria-busy="true" className="flex flex-col gap-4" data-testid="survey-loading">
        <div className="bg-muted h-8 w-2/3 animate-pulse rounded" />
        <div className="bg-muted h-24 animate-pulse rounded-xl" />
        <div className="bg-muted h-24 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (phase.kind === "loading") return <LoadingState headingRef={headingRef} />;
  if (phase.kind === "result") {
    return (
      <ResultView
        result={phase.result}
        issues={issues}
        serverBlackout={serverBlackout}
        headingRef={headingRef}
        onStartOver={startOver}
      />
    );
  }
  if (phase.kind === "error") {
    return (
      <ErrorState
        code={phase.code}
        headingRef={headingRef}
        onRetry={() => void match(phase.input)}
        onRestart={restart}
      />
    );
  }

  const ranked = state.ranked
    .map((id) => issues.find((i) => i.id === id))
    .filter((i): i is ClientIssue => !!i);

  return (
    <div className="flex flex-col gap-6" data-testid="survey" data-step={stepKey}>
      {!store?.storageAvailable && (
        <p role="note" className="text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {t("noStorage")}
        </p>
      )}
      {hasProgress(state) && (
        <div className="-mt-2 -mb-4 flex justify-end">
          <SurveyStartOver onConfirm={startOver} headingRef={headingRef} />
        </div>
      )}
      {step.kind === "ranking" && (
        <RankingStep
          key={restarts}
          issues={issues}
          state={state}
          onChange={update}
          onContinue={() => go({ kind: "answer", index: 0 })}
          headingRef={headingRef}
        />
      )}
      {step.kind === "answer" && ranked[step.index] && (
        <AnswerStep
          key={ranked[step.index].id}
          issue={ranked[step.index]}
          index={step.index}
          total={ranked.length}
          state={state}
          onChange={update}
          onBack={() =>
            go(step.index === 0 ? { kind: "ranking" } : { kind: "answer", index: step.index - 1 })
          }
          onNext={() => go({ kind: "answer", index: step.index + 1 })}
          onSubmit={submit}
          headingRef={headingRef}
        />
      )}
    </div>
  );
}
