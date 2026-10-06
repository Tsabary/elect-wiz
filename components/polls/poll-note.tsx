import { useFormatter, useTranslations } from "next-intl";
import type { PollNote } from "@/lib/content/polls";
import { ELECTORAL_THRESHOLD_PERCENT } from "@/lib/content/polls";

/** Parses a registry date (YYYY-MM-DD) as a calendar date. */
export function calendarDate(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

/**
 * The factual threshold / not-polled note (PRD "Below-threshold note" and
 * "Not-polled note"). Purely factual, no advice. Callers hide it during the poll
 * blackout (it's also null from the registry/route then).
 */
export function PollNoteText({ note }: { note: PollNote }) {
  const t = useTranslations("Polls");
  const format = useFormatter();
  const date = format.dateTime(calendarDate(note.asOf), { dateStyle: "long", timeZone: "UTC" });
  if (note.kind === "not-polled") {
    return <span data-testid="poll-note-not-polled">{t("notPolled")}</span>;
  }
  return (
    <span data-testid="poll-note-below-threshold">
      {t("belowThreshold", {
        threshold: format.number(ELECTORAL_THRESHOLD_PERCENT / 100, {
          style: "percent",
          maximumFractionDigits: 2,
        }),
        percent: format.number(note.percent / 100, { style: "percent", maximumFractionDigits: 1 }),
        date,
      })}
    </span>
  );
}
