"use client";

import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { errorInfo, errorMessageKey, type MatchErrorCode } from "@/lib/matching/contract";

/**
 * Localized error per code. "Try again" when the matching data couldn't be
 * loaded (the answers are kept, so nothing is lost); "start again" when the
 * survey content has changed since the survey was begun.
 */
export function ErrorState({
  code,
  onRetry,
  onRestart,
  headingRef,
}: {
  code: MatchErrorCode;
  onRetry: () => void;
  onRestart: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations();
  const { action } = errorInfo(code);
  return (
    <section
      role="alert"
      aria-labelledby="error-heading"
      className="flex flex-col gap-4 rounded-xl border p-5"
      data-testid="result-error"
      data-error-code={code}
    >
      <h1
        id="error-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-bold outline-none"
      >
        {t("MatchErrors.title")}
      </h1>
      <p>{t(errorMessageKey(code))}</p>
      <div className="flex flex-wrap gap-2">
        {action === "retry" && (
          <Button
            size="lg"
            className="h-12 px-6 text-base"
            onClick={onRetry}
            data-testid="error-retry"
          >
            {t("MatchErrors.retry")}
          </Button>
        )}
        {action === "restart" && (
          <Button
            size="lg"
            className="h-12 px-6 text-base"
            onClick={onRestart}
            data-testid="error-restart"
          >
            {t("MatchErrors.restart")}
          </Button>
        )}
      </div>
    </section>
  );
}
