"use client";

/**
 * The survey flow: ranking → one answer screen per ranked issue → "anything
 * else" → submission → result. Runs fully in the browser; progress lives only in
 * on-device storage until the user submits (PRD FR25).
 */
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ResultView } from "@/components/result/result-view";
import { ErrorState } from "@/components/result/error-state";
import { LoadingState } from "@/components/result/loading-state";
import { useOnElectionOver } from "@/components/time/time-modes";
import { useRouter } from "@/i18n/navigation";
import type { MatchErrorCode, MatchRequest, MatchResponse } from "@/lib/matching/contract";
import { submitMatch } from "@/lib/matching/client";
import {
  buildMatchRequest,
  goTo,
  normalizeStep,
  type SurveyState,
  type SurveyStep,
} from "@/lib/survey/state";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";
import { createSurveyStore, type SurveyStore } from "@/lib/survey/store";
import { AnswerStep } from "./answers/answer-step";
import { AnythingElseStep } from "./anything-else/anything-else-step";
import { RankingStep } from "./ranking/ranking-step";
import type { ClientIssue } from "./types";

type Phase =
  | { kind: "survey" }
  | { kind: "submitting"; request: Omit<MatchRequest, "token"> }
  | { kind: "result"; result: MatchResponse; request: Omit<MatchRequest, "token"> }
  | { kind: "error"; code: MatchErrorCode; request: Omit<MatchRequest, "token"> };

/** Development/preview only: `?mockScenario=` forces a mock result or error (ignored in production). */
function mockScenarioFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("mockScenario") ?? undefined;
}

const serverSnapshot = () => null;

export function SurveyApp({
  issues,
  surveyContentVersion,
  serverElectionOver,
}: {
  issues: ClientIssue[];
  surveyContentVersion: string;
  serverElectionOver: boolean;
}) {
  const locale = useLocale() as "he" | "en";
  const t = useTranslations("Survey");
  const router = useRouter();
  const [store] = useState<SurveyStore | null>(() =>
    typeof window === "undefined"
      ? null
      : createSurveyStore(surveyContentVersion, createSurveyStorage(browserLocalStorage())),
  );
  const state = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    store?.get ?? serverSnapshot,
    serverSnapshot,
  );
  const [phase, setPhase] = useState<Phase>({ kind: "survey" });
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
        : (step?.kind ?? "loading");

  // Move focus to the new screen's heading and scroll to the top on every step change.
  useEffect(() => {
    if (stepKey === "loading") return;
    window.scrollTo({ top: 0, behavior: "instant" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepKey]);

  const update = useCallback((fn: (s: SurveyState) => SurveyState) => store?.set(fn), [store]);
  const go = (next: SurveyStep) => update((s) => goTo(s, next));

  async function send(request: Omit<MatchRequest, "token">) {
    setPhase({ kind: "submitting", request });
    const res = await submitMatch(request, { mockScenario: mockScenarioFromUrl() });
    if (res.ok) {
      // The result is shown once; a refresh starts a new survey (PRD, plan Data model §5).
      store?.clear();
      setPhase({ kind: "result", result: res.result, request });
    } else {
      setPhase({ kind: "error", code: res.code, request });
    }
  }

  function submit() {
    if (!state) return;
    const request = buildMatchRequest(state, issues, locale);
    if (request) void send(request);
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

  if (phase.kind === "submitting") return <LoadingState headingRef={headingRef} />;
  if (phase.kind === "result") {
    return <ResultView result={phase.result} issues={issues} headingRef={headingRef} />;
  }
  if (phase.kind === "error") {
    return (
      <ErrorState
        code={phase.code}
        headingRef={headingRef}
        onRetry={() => void send(phase.request)}
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
      {step.kind === "ranking" && (
        <RankingStep
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
          onNext={() =>
            go(
              step.index + 1 < ranked.length
                ? { kind: "answer", index: step.index + 1 }
                : { kind: "anything-else" },
            )
          }
          headingRef={headingRef}
        />
      )}
      {step.kind === "anything-else" && (
        <AnythingElseStep
          state={state}
          onChange={update}
          onBack={() => go({ kind: "answer", index: ranked.length - 1 })}
          onSubmit={submit}
          headingRef={headingRef}
        />
      )}
    </div>
  );
}
