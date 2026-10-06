"use client";

import { useTranslations } from "next-intl";
import { useTimeModes } from "@/components/time/time-modes";

/**
 * The one neutral sentence shown for every party instead of poll information
 * during the blackout (research/legal-findings.md §3.1, impact 1), and in the
 * post-election archive.
 */
export function PollBlackoutNotice({ serverElectionOver }: { serverElectionOver: boolean }) {
  const t = useTranslations("Polls");
  const { electionOver } = useTimeModes({ blackout: true, electionOver: serverElectionOver });
  return (
    <span data-testid="poll-blackout-notice">{electionOver ? t("archive") : t("blackout")}</span>
  );
}
