"use client";

/**
 * The survey flow: ranking → one answer screen per ranked issue → result. Runs
 * fully in the browser: progress lives only in on-device storage (PRD FR25),
 * and the result is computed here from the matching bundle, so the answers
 * never leave the device. A finished survey stays saved, so coming back to it
 * shows the result again, worked out afresh from the saved answers, for up to
 * 7 days and never after polls close (lib/survey/storage.ts). The only calls
 * out are the two anonymous counts (`lib/tally/client.ts`).
 *
 * "Start over" (on the survey screens and under the result) puts a new survey
 * in place of the current one: empty, with new shuffle seeds, counted anew. A
 * "start over" in another tab does the same here (lib/survey/store.ts).
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

/**
 * What the screen shows. Every phase past the survey screens names the survey it
 * belongs to (its option seed): when another tab replaces or deletes that survey,
 * the phase no longer applies and this tab is back on the survey screens.
 */
type Phase =
  | { kind: "survey" }
  /** Submitted before the matching bundle arrived. */
  | { kind: "loading"; seed: number }
  | { kind: "result"; seed: number; result: MatchResponse; input: MatchInput }
  | { kind: "error"; seed: number; code: MatchErrorCode; input: MatchInput };

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
  const [shownPhase, setPhase] = useState<Phase>({ kind: "survey" });
  const phase: Phase =
    shownPhase.kind !== "survey" && state?.optionSeed !== shownPhase.seed
      ? { kind: "survey" }
      : shownPhase;
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

  function show(loaded: BundleLoadResult, input: MatchInput, seed: number) {
    // Another tab replaced or deleted this survey while the result was on its way.
    if (!store || store.get().optionSeed !== seed) return;
    const res = loaded.ok ? matchLocally(loaded.bundle, input, parties) : loaded;
    if (res.ok) {
      // Kept until "start over" or for RESULT_RETENTION_DAYS, so coming back shows the result again.
      const first = !store.get().finished;
      store.set((s) => (s.finished ? s : { ...s, finished: true, finishedAt: Date.now() }));
      setPhase({ kind: "result", seed, result: res.result, input });
      // Anonymous count, fire-and-forget, only the first time this result is shown:
      // the top parties' IDs only, never the answers.
      if (first) tallyResult(res.result.entries.map((e) => e.partyId));
    } else {
      // Whatever was loaded couldn't be used: "try again" fetches it afresh.
      bundleRequest.current = null;
      bundleResult.current = null;
      setPhase({ kind: "error", seed, code: res.code, input });
    }
  }

  async function match(input: MatchInput) {
    if (!store) return;
    const seed = store.get().optionSeed;
    // The loading state shows only if the bundle hasn't arrived yet.
    if (bundleResult.current) return show(bundleResult.current, input, seed);
    setPhase({ kind: "loading", seed });
    show(await loadBundle(), input, seed);
  }

  // Coming back to a finished survey: work the result out again from the saved answers.
  const reopening = !!state?.finished && phase.kind === "survey";
  useEffect(() => {
    if (!reopening || !store) return;
    const input = buildMatchInput(store.get(), issues);
    if (!input) {
      // The saved answers no longer make a complete survey: carry on with it instead.
      store.set((s) => ({ ...s, finished: false }));
      return;
    }
    const seed = store.get().optionSeed;
    let cancelled = false;
    void loadBundle().then((loaded) => {
      if (!cancelled) show(loaded, input, seed);
    });
    return () => {
      cancelled = true;
    };
    // `show` is recreated every render; the effect only needs to run when reopening starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reopening, store, issues, loadBundle]);

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
        <div className="bg-kraft h-10 w-2/3 animate-pulse rounded-sm motion-reduce:animate-none" />
        <div className="bg-kraft h-24 animate-pulse rounded-sm motion-reduce:animate-none" />
        <div className="bg-kraft h-24 animate-pulse rounded-sm motion-reduce:animate-none" />
      </div>
    );
  }

  if (phase.kind === "loading" || reopening) return <LoadingState headingRef={headingRef} />;
  if (phase.kind === "result") {
    return (
      <ResultView
        result={phase.result}
        input={phase.input}
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
        <p role="note" className="note">
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
          key={`${restarts}:${state.optionSeed}`}
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
