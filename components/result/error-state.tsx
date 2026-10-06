"use client";

import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { errorInfo, errorMessageKey } from "@/lib/matching/client";
import type { MatchErrorCode } from "@/lib/matching/contract";
import { cn } from "@/lib/utils";

/**
 * Localized error per code. "Try again" (which fetches a fresh abuse token via the
 * token hook) only on retryable errors; restart for validation / content-version
 * mismatch; nothing to retry once the election is over. Survey progress is kept,
 * so nothing is lost.
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
        {action === "none" && (
          <Link
            href="/parties"
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}
          >
            {t("MatchErrors.browseParties")}
          </Link>
        )}
      </div>
    </section>
  );
}
