"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";

/** Shown for the whole time the result is being prepared (up to the 60 s client timeout). */
export function LoadingState({ headingRef }: { headingRef: RefObject<HTMLHeadingElement | null> }) {
  const t = useTranslations("Result");
  return (
    <section
      aria-busy="true"
      aria-labelledby="loading-heading"
      className="flex flex-col items-center gap-6 py-10 text-center"
      data-testid="result-loading"
    >
      <Loader2
        className="text-muted-foreground size-10 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2" role="status">
        <h1
          id="loading-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold outline-none"
        >
          {t("loadingTitle")}
        </h1>
        <p className="text-muted-foreground max-w-sm">{t("loadingBody")}</p>
      </div>
      <div className="flex w-full max-w-md flex-col gap-3" aria-hidden="true">
        <div className="bg-muted h-20 animate-pulse rounded-xl motion-reduce:animate-none" />
        <div className="bg-muted h-14 animate-pulse rounded-xl motion-reduce:animate-none" />
        <div className="bg-muted h-14 animate-pulse rounded-xl motion-reduce:animate-none" />
      </div>
    </section>
  );
}
