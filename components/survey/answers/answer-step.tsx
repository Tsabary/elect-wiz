"use client";

/**
 * Step 2: one screen per ranked issue (PRD Step 2). Each preset option is
 * already an editable text field: pick it as written, adjust its wording in
 * place, or write your own answer. Option order is this session's shuffle.
 * No feedback is ever given on answer quality.
 */
import { useTranslations } from "next-intl";
import { useId, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { MAX_ANSWER_CHARS } from "@/lib/matching/contract";
import {
  draftFor,
  editOption,
  editOwn,
  isAnswered,
  optionOrder,
  optionText,
  OWN_ANSWER,
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
  headingRef,
}: {
  issue: ClientIssue;
  index: number;
  total: number;
  state: SurveyState;
  onChange: (fn: (s: SurveyState) => SurveyState) => void;
  onBack: () => void;
  onNext: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("Answers");
  const uid = useId();
  const draft = draftFor(state, issue.id);
  const options = optionOrder(state, issue.id, issue.options);
  const answered = isAnswered(issue, draft);
  const name = `answer-${issue.id}`;

  const update = (fn: (d: typeof draft) => typeof draft) =>
    onChange((s) => setDraft(s, issue.id, fn(draftFor(s, issue.id))));

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
        <ProgressBar value={index + 1} max={total + 1} />
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
        {options.map((option, i) => {
          const selected = draft.selected === option.id;
          const edited = Object.hasOwn(draft.optionTexts, option.id);
          const text = optionText(draft, option.id, option.text);
          const radioId = `${uid}-opt-${option.id}`;
          return (
            <div
              key={option.id}
              data-testid="answer-option"
              data-option-id={option.id}
              data-selected={selected}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                if (!selected) update((d) => selectAnswer(d, option.id));
              }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border-2 p-3 transition-colors",
                selected
                  ? "border-foreground bg-muted/40"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={radioId}
                  className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <input
                    id={radioId}
                    type="radio"
                    name={name}
                    value={option.id}
                    checked={selected}
                    aria-describedby={`${radioId}-text`}
                    onChange={() => update((d) => selectAnswer(d, option.id))}
                    className="accent-foreground size-5"
                  />
                  {t("optionLabel", { n: i + 1 })}
                  {edited && (
                    <span className="text-muted-foreground font-normal" data-testid="edited-badge">
                      · {t("edited")}
                    </span>
                  )}
                </label>
                {edited && (
                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={() =>
                      update((d) => editOption(d, option.id, option.text, option.text))
                    }
                  >
                    {t("undoEdit")}
                  </Button>
                )}
              </div>
              <span id={`${radioId}-text`} hidden>
                {text}
              </span>
              <textarea
                aria-label={t("optionTextLabel", { n: i + 1 })}
                value={text}
                maxLength={MAX_ANSWER_CHARS}
                rows={3}
                dir="auto"
                onChange={(e) =>
                  update((d) => editOption(d, option.id, e.target.value, option.text))
                }
                data-testid="option-text"
                className="bg-background focus-visible:ring-ring/50 [field-sizing:content] w-full resize-y rounded-lg border px-3 py-2 text-base leading-relaxed outline-none focus-visible:ring-3"
              />
            </div>
          );
        })}

        <div
          data-testid="answer-own"
          data-selected={draft.selected === OWN_ANSWER}
          className={cn(
            "flex flex-col gap-2 rounded-xl border-2 border-dashed p-3 transition-colors",
            draft.selected === OWN_ANSWER ? "border-foreground bg-muted/40" : "border-border",
          )}
        >
          <label
            htmlFor={`${uid}-own`}
            className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-medium"
          >
            <input
              id={`${uid}-own`}
              type="radio"
              name={name}
              value={OWN_ANSWER}
              checked={draft.selected === OWN_ANSWER}
              onChange={() => update((d) => selectAnswer(d, OWN_ANSWER))}
              className="accent-foreground size-5"
            />
            {t("ownLabel")}
          </label>
          <textarea
            aria-label={t("ownTextLabel")}
            placeholder={t("ownPlaceholder")}
            value={draft.ownText}
            maxLength={MAX_ANSWER_CHARS}
            rows={3}
            dir="auto"
            onChange={(e) => update((d) => editOwn(d, e.target.value))}
            onFocus={() => {
              if (draft.ownText === "" && draft.selected === null)
                update((d) => selectAnswer(d, OWN_ANSWER));
            }}
            data-testid="own-text"
            className="bg-background focus-visible:ring-ring/50 [field-sizing:content] w-full resize-y rounded-lg border px-3 py-2 text-base leading-relaxed outline-none focus-visible:ring-3"
          />
        </div>
      </div>

      <StepNav
        backLabel={t("back")}
        nextLabel={index + 1 < total ? t("next") : t("nextToAnythingElse")}
        hint={answered ? null : t("needAnswer")}
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!answered}
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
