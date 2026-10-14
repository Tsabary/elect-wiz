"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducer, useSyncExternalStore } from "react";
import { StartOverDialog } from "@/components/survey/start-over";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { surveyStatus } from "@/lib/survey/state";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";

/** Re-reads the saved survey when another tab changes or deletes it. */
const subscribe = (onChange: () => void) =>
  createSurveyStorage(browserLocalStorage()).subscribe(onChange);

/**
 * The intro's start button. With a survey under way on this device it says
 * "continue", and with a finished one "see my result"; either way "start over"
 * sits next to it, and asks first. Opening the survey without doing anything is
 * not progress.
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
  const status = useSyncExternalStore(
    subscribe,
    () =>
      surveyStatus(
        createSurveyStorage(browserLocalStorage()).load(surveyContentVersion, { keep: true }),
      ),
    () => "new" as const,
  );
  const resumable = status !== "new";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  function startOver() {
    createSurveyStorage(browserLocalStorage()).clear();
    reread();
    router.push("/survey");
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <Link
        href="/survey"
        data-testid="start-survey"
        data-resume={status === "in-progress"}
        data-status={status}
        className={cn(buttonVariants({ size: "lg" }), "cta h-14 gap-3 px-8 text-lg font-bold")}
      >
        {status === "finished"
          ? t("seeResult")
          : status === "in-progress"
            ? t("resumeSurvey")
            : t("startSurvey")}
        <Arrow aria-hidden="true" />
      </Link>
      {resumable && (
        <StartOverDialog
          onConfirm={startOver}
          focusAfter={null}
          finished={status === "finished"}
          trigger={
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/30 h-14 gap-2 px-5 text-base"
              data-testid="home-start-over"
            />
          }
        />
      )}
    </div>
  );
}
