import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface SharedParty {
  id: string;
  name: string;
}

/**
 * The top of a share page: the shared closest match and the next closest. Used by
 * the server-rendered page and, for a link with answers, by `SharedResult` with
 * the parties worked out from them.
 */
export function SharedParties({
  parties,
  note,
}: {
  parties: readonly SharedParty[];
  /** The line under the parties; none while answers are being worked out. */
  note: "landingNote" | "landingNoteAnswers" | null;
}) {
  const t = useTranslations("Share");
  const [top, ...rest] = parties;
  if (!top) return null;
  return (
    // Party links aren't prefetched: only a click fetches a party page (as on the result).
    <section
      className="bg-ink text-ink-foreground on-ink -mx-4 flex flex-col gap-5 px-4 py-8 sm:mx-0 sm:rounded-sm sm:p-10"
      aria-labelledby="shared-heading"
    >
      <p className="eyebrow">{t("landingEyebrow")}</p>
      <h1 id="shared-heading" className="display text-4xl sm:text-6xl">
        <Link
          href={`/parties/${top.id}`}
          prefetch={false}
          className="underline-offset-8 hover:underline"
          data-testid="shared-top"
        >
          {top.name}
        </Link>
      </h1>
      {rest.length > 0 && (
        <div className="border-ink-foreground/25 flex flex-col gap-2 border-t pt-4">
          <p className="text-ink-muted text-sm font-medium">{t("alsoClose")}</p>
          <ul className="flex flex-col" data-testid="shared-rest">
            {rest.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/parties/${p.id}`}
                  prefetch={false}
                  className="decoration-ink-foreground/40 hover:decoration-ink-foreground inline-flex min-h-9 items-center text-lg font-medium underline decoration-1 underline-offset-4"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {note && (
        <p className="text-ink-muted text-sm" data-testid="shared-note">
          {t(note)}
        </p>
      )}
    </section>
  );
}
