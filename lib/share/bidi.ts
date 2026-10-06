/**
 * Minimal visual reordering for right-to-left text in generated images.
 *
 * The OG image renderer (satori, behind `next/og`) lays text out strictly left to
 * right and doesn't implement the Unicode bidirectional algorithm, so Hebrew
 * would come out reversed. This converts a single line of logical-order text with
 * an RTL base direction into visual (left-to-right) order: Latin words and
 * numbers stay readable, Hebrew runs are reversed, and brackets are mirrored.
 * It covers party names and short UI strings, not the full UBA.
 */

const RTL = /[֐-׿יִ-ﭏ؀-ۿ]/;
const LTR = /[A-Za-z0-9À-ɏ]/;
const MIRROR: Record<string, string> = {
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  "«": "»",
  "»": "«",
};

type Dir = "R" | "L" | "N";

function classify(ch: string): Dir {
  if (RTL.test(ch)) return "R";
  if (LTR.test(ch)) return "L";
  return "N";
}

export function hasRtl(text: string): boolean {
  return RTL.test(text);
}

/** Converts one logical-order RTL line to visual order. LTR-only text is returned unchanged. */
export function visualRtl(text: string): string {
  if (!hasRtl(text)) return text;
  const chars = Array.from(text);
  // Number terminators (%, currency) attached to digits travel with the number.
  const dirs = chars.map((c, i) =>
    /[%\u20AA$\u00B0]/.test(c) && (/\d/.test(chars[i - 1] ?? "") || /\d/.test(chars[i + 1] ?? ""))
      ? "L"
      : classify(c),
  );

  // Neutrals between two LTR characters belong to the LTR run; all others are RTL.
  const levels = dirs.map((d, i) => {
    if (d === "L") return 2;
    if (d === "R") return 1;
    let prev: Dir = "R";
    for (let j = i - 1; j >= 0; j--)
      if (dirs[j] !== "N") {
        prev = dirs[j];
        break;
      }
    let next: Dir = "R";
    for (let j = i + 1; j < dirs.length; j++)
      if (dirs[j] !== "N") {
        next = dirs[j];
        break;
      }
    return prev === "L" && next === "L" ? 2 : 1;
  });

  // Mirror brackets that end up in RTL runs.
  const glyphs = chars.map((c, i) => (levels[i] === 1 && MIRROR[c] ? MIRROR[c] : c));

  // Reverse LTR runs (level 2), then the whole line (levels >= 1): UBA rule L2.
  const out = [...glyphs];
  let i = 0;
  while (i < out.length) {
    if (levels[i] === 2) {
      let j = i;
      while (j < out.length && levels[j] === 2) j++;
      const run = out.slice(i, j).reverse();
      out.splice(i, j - i, ...run);
      i = j;
    } else i++;
  }
  return out.reverse().join("");
}
