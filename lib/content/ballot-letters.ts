/**
 * How large a ballot slip prints its letters. A list has one to four Hebrew
 * letters, and the slip is the same width whatever their number, so longer
 * codes are set smaller.
 */
export type BallotLetterScale = "wide" | "medium" | "narrow";

/** The number of letters as a reader counts them (final forms and marks included once each). */
export function ballotLetterCount(letters: string): number {
  return [...new Intl.Segmenter("he", { granularity: "grapheme" }).segment(letters.trim())].length;
}

export function ballotLetterScale(letters: string): BallotLetterScale {
  const count = ballotLetterCount(letters);
  if (count <= 2) return "wide";
  return count === 3 ? "medium" : "narrow";
}
