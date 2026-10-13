"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducer, useSyncExternalStore } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { hasProgress } from "@/lib/survey/state";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";

const noop = () => () => {};

/**
 * The intro's start button. When the user has made progress on this device it
 * says "continue", with "start over" next to it; opening the survey without
 * doing anything is not progress.
 */
export function StartSurveyLink({
  surveyContentVersion,
  dir,
}: {
  surveyContentVersion: string;
  dir: "rtl" | "ltr";
}) {
  const t = useTranslations("Common");
  const router = useRouter();
  // Read again after "start over" has cleared the saved survey.
  const [, reread] = useReducer((n: number) => n + 1, 0);
  const resumable = useSyncExternalStore(
    noop,
    () => {
      const saved = createSurveyStorage(browserLocalStorage()).load(surveyContentVersion);
      return saved !== null && hasProgress(saved);
    },
    () => false,
  );
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  function startOver() {
    createSurveyStorage(browserLocalStorage()).clear();
    reread();
    router.push("/survey");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/survey"
        data-testid="start-survey"
        data-resume={resumable}
        className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-6 text-base")}
      >
        {resumable ? t("resumeSurvey") : t("startSurvey")}
        <Arrow aria-hidden="true" />
      </Link>
      {resumable && (
        <Button
          variant="outline"
          size="lg"
          className="h-12 gap-2 px-5 text-base"
          onClick={startOver}
          data-testid="home-start-over"
        >
          <RotateCcw aria-hidden="true" />
          {t("startOver")}
        </Button>
      )}
    </div>
  );
}
