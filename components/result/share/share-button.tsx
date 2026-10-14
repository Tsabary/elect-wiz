"use client";

import { Check, Copy, ListChecks, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { ClientIssue } from "@/components/survey/types";
import { Button } from "@/components/ui/button";
import type { MatchInput } from "@/lib/matching/score";
import { answersHash, encodeAnswers } from "@/lib/share/answers";
import { sharePath } from "@/lib/share/params";
import { tallyShared } from "@/lib/tally/client";

type Kind = "plain" | "answers";
type Status = { kind: Kind; state: "idle" | "copied" | "manual" };

/**
 * Two ways to share the result. The primary link carries only the matched party
 * IDs and the language (never answers, never poll data). The secondary one, only
 * on request, adds the ranking and the chosen options in the URL's fragment
 * (lib/share/answers.ts), which the browser never sends to the site. Native share
 * sheet on touch devices, copy-link elsewhere.
 *
 * A completed share (the sheet finished, or the link was copied) sends one
 * anonymous count saying only whether the link held answers; a cancelled sheet
 * or a link left for manual copying sends nothing.
 */
export function ShareButton({
  partyIds,
  topName,
  input,
  issues,
  surveyContentVersion,
}: {
  partyIds: string[];
  topName: string;
  /** The ranking and answers the result was worked out from. */
  input: MatchInput;
  issues: readonly ClientIssue[];
  surveyContentVersion: string;
}) {
  const t = useTranslations("Share");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>({ kind: "plain", state: "idle" });
  const [url, setUrl] = useState("");
  const answers = encodeAnswers(input, { surveyContentVersion, issues });

  async function share(kind: Kind) {
    const path = sharePath(locale, partyIds) + (kind === "answers" ? answersHash(answers!) : "");
    const link = new URL(path, window.location.origin).toString();
    setUrl(link);
    setStatus({ kind, state: "idle" });
    const text = t("shareText", { name: topName });
    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: t("shareTitle"), text, url: link });
        tallyShared(kind === "answers");
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      setStatus({ kind, state: "copied" });
      tallyShared(kind === "answers");
    } catch {
      setStatus({ kind, state: "manual" });
    }
  }

  const copied = (kind: Kind) => status.kind === kind && status.state === "copied";

  return (
    <section
      aria-labelledby="share-heading"
      className="bg-kraft flex flex-col gap-3 rounded-sm p-5 sm:p-7"
      data-testid="share"
    >
      <h2 id="share-heading" className="display text-2xl sm:text-3xl">
        {t("heading")}
      </h2>
      <p className="max-w-prose text-sm leading-relaxed">{t("explainer")}</p>
      <Button
        size="lg"
        className="mt-1 h-12 gap-2 self-start px-6 text-base font-bold"
        onClick={() => share("plain")}
        data-testid="share-button"
      >
        {copied("plain") ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
        {t("button")}
      </Button>
      {answers && (
        <div className="border-foreground/20 mt-2 flex flex-col items-start gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="lg"
            className="h-11 gap-2 px-4 text-base"
            onClick={() => share("answers")}
            aria-describedby="share-answers-note"
            data-testid="share-answers-button"
          >
            {copied("answers") ? <Check aria-hidden="true" /> : <ListChecks aria-hidden="true" />}
            {t("answersButton")}
          </Button>
          <p id="share-answers-note" className="text-sm" data-testid="share-answers-note">
            {t("answersNote")}
          </p>
        </div>
      )}
      <p role="status" aria-live="polite" className="text-sm" data-testid="share-status">
        {status.state === "copied" ? t("copied") : ""}
      </p>
      {status.state === "manual" && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center gap-1">
            <Copy className="size-4" aria-hidden="true" />
            {t("manualCopy")}
          </span>
          <input
            readOnly
            value={url}
            dir="ltr"
            className="bg-card border-foreground/25 rounded-sm border px-2 py-1.5"
            onFocus={(e) => e.currentTarget.select()}
            data-testid="share-url"
          />
        </label>
      )}
      {url && (
        <span hidden data-testid="share-url-value">
          {url}
        </span>
      )}
    </section>
  );
}
