/**
 * Profile test (plan-deterministic-matching.md, Testing strategy → "Profile
 * test"; PRD requirement 40): runs invented voters through the scoring and
 * compares the outcome with what was expected before any score was seen.
 *
 * Pure, and needs no result texts, so it runs on a corpus that has only
 * positions, grids and constants.
 */
import type { VoterProfile } from "../content/schemas";
import { TOP_ENTRIES } from "./contract";
import { MatchDataError, MatchInputError, rankParties, type MatchingData } from "./score";

export interface ProfileOutcome {
  profile: VoterProfile;
  pass: boolean;
  /** The highest-scoring parties in result order, `TOP_ENTRIES` at most. */
  top: { partyId: string; score: number }[];
  /** Why the profile failed; empty when it passed. */
  problems: string[];
  /** Lists with two or more parties in the top, with those parties. */
  sameList: { listId: string; partyIds: string[] }[];
}

export interface ProfileCheckInput {
  /** Positions, grids and constants; texts are not used. */
  data: MatchingData;
  profiles: readonly VoterProfile[];
  /** The researched parties, each with the list it runs on. */
  parties: readonly { id: string; listId: string }[];
}

export interface ProfileCheckReport {
  outcomes: ProfileOutcome[];
  /** How many profiles have two or more parties of one list in their top. */
  sameListProfiles: number;
}

export function runProfiles(input: ProfileCheckInput): ProfileCheckReport {
  const listOf = new Map(input.parties.map((p) => [p.id, p.listId]));
  const outcomes = input.profiles.map((profile): ProfileOutcome => {
    let ranked;
    try {
      ranked = rankParties(
        input.data,
        { ranked: profile.ranked, answers: profile.answers },
        input.parties.map((p) => p.id),
      );
    } catch (e) {
      // Content that can't be scored yet (a missing file, row or pair) fails the profile.
      if (!(e instanceof MatchDataError) && !(e instanceof MatchInputError)) throw e;
      return { profile, pass: false, top: [], problems: [e.message], sameList: [] };
    }
    const top = ranked.slice(0, TOP_ENTRIES).map(({ partyId, score }) => ({ partyId, score }));
    const topIds = top.map((t) => t.partyId);
    const { expect } = profile;
    const problems: string[] = [];
    if (!expect.topAnyOf.includes(topIds[0])) {
      problems.push(`top is "${topIds[0]}", expected one of: ${expect.topAnyOf.join(", ")}`);
    }
    for (const id of expect.inTop4 ?? []) {
      if (!topIds.includes(id)) problems.push(`"${id}" is not in the top ${TOP_ENTRIES}`);
    }
    for (const id of expect.notInTop4 ?? []) {
      if (topIds.includes(id)) problems.push(`"${id}" is in the top ${TOP_ENTRIES}`);
    }
    const byList = new Map<string, string[]>();
    for (const id of topIds) {
      const listId = listOf.get(id) ?? id;
      byList.set(listId, [...(byList.get(listId) ?? []), id]);
    }
    const sameList = [...byList]
      .filter(([, ids]) => ids.length > 1)
      .map(([listId, partyIds]) => ({ listId, partyIds }));
    return { profile, pass: problems.length === 0, top, problems, sameList };
  });
  return { outcomes, sameListProfiles: outcomes.filter((o) => o.sameList.length > 0).length };
}

/** The report as plain text, one block per profile. */
export function formatProfileReport(report: ProfileCheckReport): string {
  const lines: string[] = [];
  for (const o of report.outcomes) {
    const { expect } = o.profile;
    lines.push(`${o.pass ? "PASS" : "FAIL"}  ${o.profile.id}: ${o.profile.description}`);
    lines.push(
      `      expected: top one of [${expect.topAnyOf.join(", ")}]` +
        (expect.inTop4?.length ? `; in top ${TOP_ENTRIES}: [${expect.inTop4.join(", ")}]` : "") +
        (expect.notInTop4?.length
          ? `; not in top ${TOP_ENTRIES}: [${expect.notInTop4.join(", ")}]`
          : ""),
    );
    lines.push(
      `      actual:   top ${o.top[0]?.partyId ?? "(none)"}; top ${TOP_ENTRIES}: ` +
        (o.top.map((t) => `${t.partyId} ${t.score.toFixed(3)}`).join(", ") || "(none)"),
    );
    for (const s of o.sameList) {
      lines.push(`      same list: ${s.partyIds.join(", ")} (${s.listId})`);
    }
    for (const p of o.problems) lines.push(`      problem:  ${p}`);
  }
  const failed = report.outcomes.filter((o) => !o.pass).length;
  lines.push(
    "",
    `${report.outcomes.length - failed} of ${report.outcomes.length} profiles pass.`,
    `Two or more parties of one list share a top ${TOP_ENTRIES} in ${report.sameListProfiles} of ${report.outcomes.length} profiles.`,
  );
  return lines.join("\n");
}
