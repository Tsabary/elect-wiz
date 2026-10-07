"use client";

/**
 * Step 3: the optional "anything else" question (PRD Step 3). The importance
 * choice appears only once something is written. Skipping has no effect.
 */
import { useTranslations } from "next-intl";
import { useId, type RefObject } from "react";
import { ANYTHING_ELSE_IMPORTANCE, MAX_ANSWER_CHARS } from "@/lib/matching/contract";
import {
  anythingElseComplete,
  setAnythingElseImportance,
  setAnythingElseText,
  type SurveyState,
} from "@/lib/survey/state";
import { StepNav } from "../answers/answer-step";
import { ProgressBar } from "../progress-bar";

export function AnythingElseStep({
  state,
  onChange,
  onBack,
  onSubmit,
  headingRef,
}: {
  state: SurveyState;
  onChange: (fn: (s: SurveyState) => SurveyState) => void;
  onBack: () => void;
  onSubmit: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("AnythingElse");
  const uid = useId();
  const { text, importance } = state.anythingElse;
  const hasText = text.trim().length > 0;
  const complete = anythingElseComplete(state);

  return (
    <section
      aria-labelledby={`${uid}-h`}
      className="flex flex-col gap-5"
      data-testid="anything-else-step"
    >
      <header className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">{t("stepLabel")}</p>
        <ProgressBar value={1} max={1} />
        <h1
          id={`${uid}-h`}
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl leading-snug font-bold text-balance outline-none"
        >
          {t("heading")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("optional")}</p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-text`} className="font-medium">
          {t("textLabel")}
        </label>
        <textarea
          id={`${uid}-text`}
          value={text}
          maxLength={MAX_ANSWER_CHARS}
          rows={4}
          dir="auto"
          placeholder={t("placeholder")}
          onChange={(e) => onChange((s) => setAnythingElseText(s, e.target.value))}
          data-testid="anything-else-text"
          className="bg-background focus-visible:ring-ring/50 [field-sizing:content] w-full resize-y rounded-lg border px-3 py-2 text-base leading-relaxed outline-none focus-visible:ring-3"
        />
      </div>

      {hasText && (
        <fieldset className="flex flex-col gap-2" data-testid="anything-else-importance">
          <legend className="mb-2 font-medium">{t("importanceLegend")}</legend>
          {ANYTHING_ELSE_IMPORTANCE.map((value) => (
            <label
              key={value}
              className="has-[:checked]:border-primary has-[:checked]:bg-accent/60 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2"
            >
              <input
                type="radio"
                name={`${uid}-importance`}
                value={value}
                checked={importance === value}
                onChange={() => onChange((s) => setAnythingElseImportance(s, value))}
                className="accent-foreground size-5"
              />
              {t(`importance.${value}`)}
            </label>
          ))}
        </fieldset>
      )}

      <StepNav
        backLabel={t("back")}
        nextLabel={t("submit")}
        hint={complete ? null : t("needImportance")}
        onBack={onBack}
        onNext={onSubmit}
        nextDisabled={!complete}
        nextTestId="submit-survey"
      />
    </section>
  );
}
