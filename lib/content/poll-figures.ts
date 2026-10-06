/**
 * Heuristic detector for poll figures in research prose (plan Testing §1).
 *
 * A "poll figure" is polling/survey wording next to a number, seat count or
 * percentage. Current Knesset seats and past election results are allowed
 * because they don't use polling wording ("holds 14 seats", "won 4.1% in 2022").
 * Research must never contain poll figures: the polling line is rendered from
 * the registry snapshot so the blackout can hide it.
 */

const POLL_WORD_EN =
  /\b(poll|polls|polled|polling|pollster|pollsters|survey|surveys|surveyed|projected|projection|projections|forecast|forecasts)\b/i;
// Hebrew words are written with prefixes (ב/ה/ו/ש/ל/מ/כ), so match as substrings.
const POLL_WORD_HE = /(סקר|סקרים|סקרי|סוקר|מדגם|תחזית|תחזיות|צפוי(?:ה)?\s+לקבל|חזוי)/;
// Not about opinion polls.
const POLL_EXCEPTIONS_EN = /\bpolling (station|stations|place|places|booth|booths|day)\b/gi;
const POLL_EXCEPTIONS_HE = /(קלפי|קלפיות)/g;

// Years (1900–2099) and full dates are not figures.
const YEAR_OR_DATE = /\b(?:\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:19|20)\d{2})\b/g;
// Citation markers like [3] or [1, 4].
const CITATION = /\[\d+(?:\s*[,–-]\s*\d+)*\]/g;
const FIGURE = /(\d|%|\bper ?cent\b|\bseats?\b|\bmandates?\b|אחוז|מנדט|מנדטים|מושבים)/i;

export interface PollFigureHit {
  sentence: string;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?;:])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function findPollFigures(text: string): PollFigureHit[] {
  const hits: PollFigureHit[] = [];
  for (const sentence of splitSentences(text)) {
    const cleaned = sentence
      .replace(POLL_EXCEPTIONS_EN, " ")
      .replace(POLL_EXCEPTIONS_HE, " ")
      .replace(CITATION, " ")
      .replace(YEAR_OR_DATE, " ");
    const hasPollWord = POLL_WORD_EN.test(cleaned) || POLL_WORD_HE.test(cleaned);
    if (hasPollWord && FIGURE.test(cleaned)) hits.push({ sentence });
  }
  return hits;
}
