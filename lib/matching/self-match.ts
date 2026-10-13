/**
 * Self-match test (plan-deterministic-matching.md, Testing strategy → "Self-match
 * test"; Decision 6). For each researched party, an invented voter answers the
 * issues where the party has a recorded position and picks the party's own
 * option on each; the party should then come out on top.
 *
 * Pure: it works from parsed positions, grids and constants, needs no texts, and
 * so runs on a corpus whose matching content is still being written.
 */
import {
  optionPairs,
  pairKey,
  POSITION_LEVELS,
  type DistancesFile,
  type MatchingConfig,
  type PositionLevel,
  type PositionRow,
  type PositionsFile,
} from "../content/schemas";
import { issueScore } from "./score";

/** Same tolerance as the scoring: scores equal on paper count as a tie. */
const EPSILON = 1e-9;

export interface SelfMatchInput {
  /** The survey's issues with their option IDs. */
  issues: readonly { id: string; optionIds: readonly string[] }[];
  positions: readonly PositionsFile[];
  distances: readonly DistancesFile[];
  config: MatchingConfig;
  /** The researched parties. */
  partyIds: readonly string[];
}

/** One issue of a party's self-match voter. */
export interface SelfMatchIssue {
  issueId: string;
  /** The option the voter picks: the party's highest-level held option. */
  optionId: string;
  /** The party's own level on that option. */
  level: PositionLevel;
  /** The party holds that option only in part. */
  inPart: boolean;
  /** The party's own score on the issue. */
  score: number;
}

/** Blocking: another party outscores the tested party on an issue it holds as `main`. */
export interface SelfMatchFailure {
  partyId: string;
  issueId: string;
  optionId: string;
  score: number;
  otherPartyId: string;
  otherScore: number;
}

/** Reported, not blocking: another party finishes ahead overall. */
export interface SelfMatchBehind {
  partyId: string;
  /** The tested party's score over its known issues, equal weights. */
  score: number;
  otherPartyId: string;
  otherScore: number;
  /** The issues where the other party scores higher, with the tested party's level there. */
  issues: { issueId: string; optionId: string; level: PositionLevel; otherScore: number }[];
}

export interface SelfMatchParty {
  partyId: string;
  issues: SelfMatchIssue[];
  /** Equal-weight average over `issues`. */
  score: number;
  /** Parties with exactly the same score: a tie passes. */
  tiedWith: string[];
}

export interface SelfMatchReport {
  /** The parties tested, in the order given. */
  parties: SelfMatchParty[];
  failures: SelfMatchFailure[];
  behind: SelfMatchBehind[];
  /** Parties not tested and issues left out, each with the reason. */
  notes: string[];
}

/**
 * The option a party's self-match voter picks on an issue: its highest-level
 * held option (`main`, else `either`, else `secondary`), ties by option ID.
 * Null for an unclear row. `inPart` says the party holds that option only in
 * part, so, like a non-`main` level, being outscored on it is not a failure.
 */
export function selfMatchOption(
  row: PositionRow,
): { optionId: string; level: PositionLevel; inPart: boolean } | null {
  if (row.unclear) return null;
  for (const level of POSITION_LEVELS) {
    const held = row.held
      .filter((h) => h.level === level)
      .sort((a, b) => (a.optionId < b.optionId ? -1 : 1));
    if (held.length > 0) return { optionId: held[0].optionId, level, inPart: !!held[0].inPart };
  }
  return null;
}

const mean = (values: readonly number[]) => values.reduce((a, b) => a + b, 0) / values.length;

export function runSelfMatch(input: SelfMatchInput): SelfMatchReport {
  const { config } = input;
  const report: SelfMatchReport = { parties: [], failures: [], behind: [], notes: [] };

  // An issue takes part when it has positions and a grid covering every pair.
  const usable = new Map<string, { rows: Map<string, PositionRow>; grid: DistancesFile }>();
  for (const issue of input.issues) {
    const positions = input.positions.find((p) => p.issueId === issue.id);
    const grid = input.distances.find((d) => d.issueId === issue.id);
    if (!positions || !grid) {
      const what = [!positions && "positions", !grid && "distance grid"].filter(Boolean);
      report.notes.push(`issue "${issue.id}" left out: no ${what.join(" and no ")}`);
      continue;
    }
    const have = new Set(grid.pairs.map((p) => pairKey(p.a, p.b)));
    if (optionPairs(issue.optionIds).some(([a, b]) => !have.has(pairKey(a, b)))) {
      report.notes.push(`issue "${issue.id}" left out: its distance grid is missing pairs`);
      continue;
    }
    usable.set(issue.id, { rows: new Map(positions.rows.map((r) => [r.partyId, r])), grid });
  }

  /** Parties left out of a comparison because a row of theirs is missing. */
  const incomplete = new Set<string>();
  for (const partyId of input.partyIds) {
    // The voter: the party's own option on each issue where it has a position.
    const picks: SelfMatchIssue[] = [];
    for (const [issueId, { rows, grid }] of usable) {
      const row = rows.get(partyId);
      const pick = row && selfMatchOption(row);
      if (!row || !pick) continue;
      picks.push({ issueId, ...pick, score: issueScore(row, pick.optionId, grid, config) });
    }
    if (picks.length === 0) {
      report.notes.push(`party "${partyId}" skipped: no known position on any usable issue`);
      continue;
    }
    const score = mean(picks.map((p) => p.score));
    const tiedWith: string[] = [];

    for (const otherPartyId of input.partyIds) {
      if (otherPartyId === partyId) continue;
      const otherScores: number[] = [];
      for (const pick of picks) {
        const { rows, grid } = usable.get(pick.issueId)!;
        const row = rows.get(otherPartyId);
        if (!row) break;
        otherScores.push(issueScore(row, pick.optionId, grid, config));
      }
      if (otherScores.length < picks.length) {
        incomplete.add(otherPartyId);
        continue;
      }
      const higher = picks
        .map((pick, i) => ({ ...pick, otherScore: otherScores[i] }))
        .filter((p) => p.otherScore > p.score + EPSILON);
      for (const p of higher) {
        if (p.level !== "main" || p.inPart) continue;
        report.failures.push({
          partyId,
          issueId: p.issueId,
          optionId: p.optionId,
          score: p.score,
          otherPartyId,
          otherScore: p.otherScore,
        });
      }
      const otherScore = mean(otherScores);
      if (otherScore > score + EPSILON) {
        report.behind.push({
          partyId,
          score,
          otherPartyId,
          otherScore,
          issues: higher.map(({ issueId, optionId, level, otherScore }) => ({
            issueId,
            optionId,
            level,
            otherScore,
          })),
        });
      } else if (Math.abs(otherScore - score) <= EPSILON) {
        tiedWith.push(otherPartyId);
      }
    }
    report.parties.push({ partyId, issues: picks, score, tiedWith });
  }
  for (const partyId of incomplete) {
    report.notes.push(
      `party "${partyId}" has no row on some usable issue, so it was left out of the comparisons that need it`,
    );
  }
  return report;
}

const n = (value: number) => value.toFixed(3);

/** The report as Markdown, for the reviewer of the positions. */
export function formatSelfMatchReport(report: SelfMatchReport, corpus: string): string {
  const lines = [
    `# Self-match report (${corpus} corpus)`,
    "",
    "Written by the self-match test (`lib/matching/self-match.ts`). For each researched party, a voter answers the issues where the party has a recorded position, picks the party's highest-level option on each, and every party is scored on those issues with equal weights.",
    "",
    `- Parties tested: ${report.parties.length}`,
    `- Blocking failures (outscored on a \`main\` issue): ${report.failures.length}`,
    `- Reported for review (another party finishes ahead overall): ${report.behind.length}`,
    "",
    "## Blocking failures",
    "",
  ];
  if (report.failures.length === 0) lines.push("None.");
  for (const f of report.failures) {
    lines.push(
      `- \`${f.partyId}\` on \`${f.issueId}\` (\`${f.optionId}\`, main): scores ${n(f.score)}, \`${f.otherPartyId}\` scores ${n(f.otherScore)}.`,
    );
  }
  lines.push("", "## Reported for review", "");
  if (report.behind.length === 0) lines.push("None.");
  else
    lines.push(
      "Expected by design when the tested party's own rows are `either` or `secondary`; each case can also point at a row that deserves a second look.",
      "",
    );
  for (const b of report.behind) {
    const where = b.issues
      .map((i) => `\`${i.issueId}\` (own level ${i.level}, other scores ${n(i.otherScore)})`)
      .join("; ");
    lines.push(
      `- \`${b.partyId}\` (${n(b.score)}) finishes behind \`${b.otherPartyId}\` (${n(b.otherScore)}). Outscored on: ${where || "no single issue"}.`,
    );
  }
  lines.push(
    "",
    "## Parties",
    "",
    "| Party | Known issues | Score | Tied with |",
    "| --- | --- | --- | --- |",
  );
  for (const p of report.parties) {
    lines.push(
      `| \`${p.partyId}\` | ${p.issues.length} | ${n(p.score)} | ${p.tiedWith.map((id) => `\`${id}\``).join(", ") || "–"} |`,
    );
  }
  lines.push("", "## Notes", "");
  if (report.notes.length === 0) lines.push("None.");
  for (const note of report.notes) lines.push(`- ${note}`);
  return lines.join("\n") + "\n";
}
