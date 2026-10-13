/**
 * How large a ballot slip prints its letters. Every list is set at the same
 * size, chosen to fit three letters, so the slips look alike (owner decision
 * 2026-10-13). Only a code of four or more letters, which no list has today,
 * is set smaller so it still fits the slip.
 */
export type BallotLetterScale = "regular" | "narrow";

/** The number of letters as a reader counts them (final forms and marks included once each). */
export function ballotLetterCount(letters: string): number {
  return [...new Intl.Segmenter("he", { granularity: "grapheme" }).segment(letters.trim())].length;
}

export function ballotLetterScale(letters: string): BallotLetterScale {
  return ballotLetterCount(letters) <= 3 ? "regular" : "narrow";
}
