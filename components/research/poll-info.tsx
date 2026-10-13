import { useFormatter, useTranslations } from "next-intl";
import { PollBlackoutNotice } from "@/components/polls/poll-blackout-notice";
import { calendarDate, PollNoteText } from "@/components/polls/poll-note";
import { PollContent } from "@/components/time/time-modes";
import { pollingLineFor, pollNoteFor } from "@/lib/content/polls";
import type { List } from "@/lib/content/schemas";
import type { TimeModes } from "@/lib/time-modes";

/**
 * The Overview's polling block, rendered from the registry snapshot (never from
 * the research markdown) so the blackout can hide it, both at render time and in
 * the browser once the instant passes.
 */
export function PollInfo({ list, modes }: { list: List; modes: TimeModes }) {
  const t = useTranslations("Polls");
  const format = useFormatter();
  const fallback = <PollBlackoutNotice serverElectionOver={modes.electionOver} />;
  const line = pollingLineFor(list.poll, { blackout: modes.blackout });
  const note = pollNoteFor(list.poll, { blackout: modes.blackout });
  const constituent = list.poll.status === "polled" ? (list.poll.constituentPolls ?? []) : [];

  const content =
    modes.blackout || (!line && !note) ? null : (
      <div className="flex flex-col gap-2" data-testid="poll-info">
        {line && (
          <p data-testid="polling-line">
            {t("line", {
              percent: format.number(line.percent / 100, {
                style: "percent",
                maximumFractionDigits: 1,
              }),
              date: format.dateTime(calendarDate(line.asOf), { dateStyle: "long", timeZone: "UTC" }),
            })}{" "}
            <a href={line.sourceUrl} rel="noopener noreferrer" target="_blank" className="link-plain">
              {t("source", { title: line.sourceTitle })}
            </a>
          </p>
        )}
        {note && (
          <p>
            <PollNoteText note={note} />
          </p>
        )}
        {constituent.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer">{t("constituentHeading")}</summary>
            <ul className="mt-2 flex flex-col gap-2">
              {constituent.map((p, i) => (
                <li key={i}>
                  <a href={p.url} rel="noopener noreferrer" target="_blank" className="link-plain">
                    {p.pollster}
                  </a>
                  {" · "}
                  {[
                    p.commissionedBy ?? p.media,
                    p.fieldworkDates,
                    p.sampleSize ? t("sampleSize", { n: p.sampleSize }) : null,
                    p.marginOfError ? t("marginOfError", { moe: p.marginOfError }) : null,
                    t("published", {
                      date: format.dateTime(calendarDate(p.publishedOn), { dateStyle: "medium", timeZone: "UTC" }),
                    }),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );

  return (
    <div className="note mt-2 max-w-prose">
      <h3 className="mb-1 font-bold">{t("heading")}</h3>
      {modes.blackout ? (
        fallback
      ) : content ? (
        <PollContent serverBlackout={false} fallback={fallback}>
          {content}
        </PollContent>
      ) : (
        <p className="text-muted-foreground">{t("pending")}</p>
      )}
    </div>
  );
}
