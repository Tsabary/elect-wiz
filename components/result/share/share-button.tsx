"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sharePath } from "@/lib/share/params";

type Status = "idle" | "copied" | "manual";

/**
 * Shares only the matched party IDs and the language (never answers, never poll
 * data). Native share sheet on touch devices, copy-link elsewhere.
 */
export function ShareButton({ partyIds, topName }: { partyIds: string[]; topName: string }) {
  const t = useTranslations("Share");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState("");

  async function share() {
    const link = new URL(sharePath(locale, partyIds), window.location.origin).toString();
    setUrl(link);
    const text = t("shareText", { name: topName });
    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: t("shareTitle"), text, url: link });
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }

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
        onClick={share}
        data-testid="share-button"
      >
        {status === "copied" ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
        {t("button")}
      </Button>
      <p role="status" aria-live="polite" className="text-sm" data-testid="share-status">
        {status === "copied" ? t("copied") : ""}
      </p>
      {status === "manual" && (
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
