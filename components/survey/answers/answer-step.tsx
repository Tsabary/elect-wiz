"use client";

/**
 * Step 2: one screen per ranked issue (PRD Step 2). The user picks one of the
 * issue's preset positions; each is a radio card. Option order is this
 * session's shuffle. The last screen's primary button submits the survey.
 */
import { useTranslations } from "next-intl";
import { useId, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  draftFor,
  isAnswered,
  optionOrder,
  selectAnswer,
  setDraft,
  type SurveyState,
} from "@/lib/survey/state";
import { cn } from "@/lib/utils";
import { MoreInfo } from "../more-info";
import { ProgressBar } from "../progress-bar";
import type { ClientIssue } from "../types";

export function AnswerStep({
  issue,
  index,
  total,
  state,
  onChange,
  onBack,
  onNext,
  onSubmit,
  headingRef,
}: {
  issue: ClientIssue;
  index: number;
  total: number;
  state: SurveyState;
  onChange: (fn: (s: SurveyState) => SurveyState) => void;
  onBack: () => void;
  /** Goes to the next answer screen. */
  onNext: () => void;
  /** Submits the survey; used on the last answer screen instead of `onNext`. */
  onSubmit: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("Answers");
  const uid = useId();
  const draft = draftFor(state, issue.id);
  const options = optionOrder(state, issue.id, issue.options);
  const answered = isAnswered(issue, draft);
  const isLast = index + 1 >= total;
  const name = `answer-${issue.id}`;

  const select = (optionId: string) =>
    onChange((s) => setDraft(s, issue.id, selectAnswer(draftFor(s, issue.id), optionId)));

  return (
    <section
      aria-labelledby={`${uid}-q`}
      className="flex flex-col gap-5"
      data-testid="answer-step"
      data-issue-id={issue.id}
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground font-medium" data-testid="answer-progress">
            {t("progress", { current: index + 1, total })}
          </p>
          <p className="text-muted-foreground">{t("rankBadge", { rank: index + 1 })}</p>
        </div>
        <ProgressBar value={index + 1} max={total} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium">{issue.title}</p>
          <MoreInfo issue={issue} />
        </div>
        <h1
          id={`${uid}-q`}
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl leading-snug font-bold text-balance outline-none"
        >
          {issue.question}
        </h1>
        <p className="text-muted-foreground text-sm" id={`${uid}-help`}>
          {t("instructions")}
        </p>
      </header>

      <div
        role="radiogroup"
        aria-labelledby={`${uid}-q`}
        aria-describedby={`${uid}-help`}
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const selected = draft.selected === option.id;
          return (
            // The whole card is the radio's label, so a tap anywhere on it selects.
            <label
              key={option.id}
              data-testid="answer-option"
              data-option-id={option.id}
              data-selected={selected}
              className={cn(
                "has-[:focus-visible]:ring-ring/50 flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors has-[:focus-visible]:ring-3",
                selected ? "border-primary bg-accent/60" : "border-border hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => select(option.id)}
                className="accent-foreground mt-0.5 size-5 shrink-0"
              />
              <span className="text-base leading-relaxed" data-testid="option-text">
                {option.text}
              </span>
            </label>
          );
        })}
      </div>

      <StepNav
        backLabel={t("back")}
        nextLabel={isLast ? t("submit") : t("next")}
        hint={answered ? null : t("needAnswer")}
        onBack={onBack}
        onNext={isLast ? onSubmit : onNext}
        nextDisabled={!answered}
        nextTestId={isLast ? "submit-survey" : "step-next"}
      />
    </section>
  );
}

export function StepNav({
  backLabel,
  nextLabel,
  hint,
  onBack,
  onNext,
  nextDisabled,
  nextTestId = "step-next",
}: {
  backLabel: string;
  nextLabel: string;
  hint: string | null;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextTestId?: string;
}) {
  const hintId = useId();
  return (
    <div className="bg-background/95 sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0">
      {hint && (
        <p id={hintId} className="text-muted-foreground text-sm">
          {hint}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          className="h-12 flex-1 text-base sm:flex-none sm:px-6"
          onClick={onBack}
          data-testid="step-back"
        >
          {backLabel}
        </Button>
        <Button
          size="lg"
          className="h-12 flex-[2] text-base sm:flex-none sm:px-8"
          onClick={onNext}
          disabled={nextDisabled}
          aria-describedby={hint ? hintId : undefined}
          data-testid={nextTestId}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
