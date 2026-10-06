"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";

const noop = () => () => {};

/** The intro's start button. Says "continue" when progress is saved on this device. */
export function StartSurveyLink({
  surveyContentVersion,
  dir,
}: {
  surveyContentVersion: string;
  dir: "rtl" | "ltr";
}) {
  const t = useTranslations("Common");
  const hasProgress = useSyncExternalStore(
    noop,
    () => createSurveyStorage(browserLocalStorage()).load(surveyContentVersion) !== null,
    () => false,
  );
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href="/survey"
      data-testid="start-survey"
      className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-6 text-base")}
    >
      {hasProgress ? t("resumeSurvey") : t("startSurvey")}
      <Arrow aria-hidden="true" />
    </Link>
  );
}
