import { useTranslations } from "next-intl";
import { ballotLetterScale, type BallotLetterScale } from "@/lib/content/ballot-letters";
import { cn } from "@/lib/utils";

type Size = "normal" | "compact";

const LETTER_SIZE: Record<Size, Record<BallotLetterScale, string>> = {
  normal: {
    regular: "text-[1.75rem] sm:text-[2.125rem]",
    narrow: "text-[1.375rem] sm:text-[1.625rem]",
  },
  compact: { regular: "text-base", narrow: "text-xs" },
};

/**
 * A list's ballot letters drawn as the paper slip a voter picks up in the
 * polling booth: white paper, the letters large and black, the list's name in
 * small type beneath. A factual picture of the slip, in no party's colours.
 *
 * The paper stays white with black type whatever the page's theme, and the
 * letters are always Hebrew, right to left, whatever the page's language.
 * The `compact` size has no room for the name and shows the letters only, so
 * it belongs next to a party or list name.
 *
 * Renders nothing for a list that has no letters yet.
 */
export function BallotSlip({
  letters,
  listName,
  size = "normal",
  className,
}: {
  letters: string;
  /** In the page's language. Shown at the normal size only. */
  listName?: string;
  size?: Size;
  className?: string;
}) {
  const t = useTranslations("Common");
  if (!letters) return null;
  const compact = size === "compact";
  return (
    <span
      data-testid="ballot-slip"
      data-letters={letters}
      data-size={size}
      className={cn(
        "inline-flex shrink-0 flex-col items-center justify-center rounded-[3px] border border-neutral-800 bg-white text-center text-black shadow-sm",
        compact ? "h-12 w-10 px-0.5" : "min-h-24 w-20 gap-1.5 px-1.5 py-2.5 sm:min-h-28 sm:w-24",
        className,
      )}
    >
      {/* One labelled unit: the name is read once, the drawn letters not at all. */}
      <span role="img" aria-label={t("ballotLetters", { letters })}>
        <span
          aria-hidden="true"
          lang="he"
          dir="rtl"
          className={cn(
            "block leading-none font-black whitespace-nowrap",
            LETTER_SIZE[size][ballotLetterScale(letters)],
          )}
        >
          {letters}
        </span>
      </span>
      {!compact && listName && (
        <span
          data-testid="ballot-slip-name"
          className="text-[0.625rem] leading-[1.2] font-medium text-balance wrap-anywhere"
        >
          {listName}
        </span>
      )}
    </span>
  );
}
