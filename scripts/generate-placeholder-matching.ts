/**
 * Generates the FICTIONAL placeholder matching content
 * (`content/placeholder/matching/`): positions and a distance grid per issue,
 * result texts in both languages for every researched placeholder party, and the
 * voter profiles. The scoring constants (`config.json`) are kept by hand and
 * only read here.
 *
 * Each party's stand comes from `placeholder-positions.ts`, which the research
 * generator reads too, so the two always agree. Re-run both after the issues,
 * the stands or the constants change:
 *
 *   pnpm exec tsx scripts/generate-placeholder-research.ts
 *   pnpm exec tsx scripts/generate-placeholder-matching.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  issueAnchor,
  issueSchema,
  matchingConfigSchema,
  OPTION_TEXT_AGREEMENTS,
  optionPairs,
  partiesFileSchema,
  type DistancesFile,
  type Issue,
  type IssueOption,
  type PartyTexts,
  type PositionRow,
  type PositionsFile,
  type ProfilesFile,
} from "../lib/content/schemas";
import { closeness, issueAgreement } from "../lib/matching/score";
import { standOn } from "./placeholder-positions";

type OptionTextAgreement = (typeof OPTION_TEXT_AGREEMENTS)[number];

const root = path.join(process.cwd(), "content");
const outDir = path.join(root, "placeholder", "matching");
const readJson = (...rel: string[]) => JSON.parse(fs.readFileSync(path.join(root, ...rel), "utf8"));

const issues: Issue[] = fs
  .readdirSync(path.join(root, "issues"))
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => issueSchema.parse(readJson("issues", f)));

// Listed parties take no part in matching.
const parties = partiesFileSchema
  .parse(readJson("placeholder", "registry", "parties.json"))
  .parties.filter((p) => p.tier === "researched");

const config = matchingConfigSchema.parse(readJson("placeholder", "matching", "config.json"));

function write(rel: string, data: unknown) {
  const file = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

// ------------------------------------------------------------------ positions and grids

function positions(issue: Issue): PositionsFile {
  const rows = parties.map((p): PositionRow => {
    const stand = standOn(p.id, issue);
    return {
      partyId: p.id,
      unclear: !stand,
      held: (stand ?? []).map((h) => ({ optionId: h.option.id, level: h.level })),
      anchor: issueAnchor(issue.id),
      basis: stand
        ? "Fictional: taken from the placeholder research's closest-option line."
        : "Fictional: the placeholder research says no documented position was found.",
    };
  });
  return { issueId: issue.id, rows };
}

/**
 * The placeholder grid treats an issue's options as evenly spaced on a line, in
 * the order they are listed: neighbours are close, the two ends are opposites.
 * (The real grids are judged pair by pair and assume no such line.)
 */
function distances(issue: Issue): DistancesFile {
  const ids = issue.options.map((o) => o.id);
  const pairs = optionPairs(ids).map(([a, b]) => {
    const steps = Math.abs(ids.indexOf(a) - ids.indexOf(b));
    return {
      a,
      b,
      closeness: Math.round((1 - steps / (ids.length - 1)) * 100) / 100,
      reason: `Fictional: ${steps} of ${ids.length - 1} steps apart in the option list.`,
    };
  });
  return { issueId: issue.id, pairs };
}

// ------------------------------------------------------------------ result texts

type Lang = "en" | "he";

/** The text for a user who chose `option`, written for the label the score gives. */
function optionText(
  lang: Lang,
  agreement: OptionTextAgreement,
  option: IssueOption,
  held: IssueOption,
): string {
  const quoted = `"${held[lang]}"`;
  if (lang === "en") {
    if (held.id === option.id)
      return "This fictional party's documented position is the option you chose. Placeholder text.";
    return {
      agrees: `This fictional party's documented position is close to the option you chose: ${quoted} Placeholder text.`,
      partially: `This fictional party's documented position partly overlaps with the option you chose: ${quoted} Placeholder text.`,
      disagrees: `This fictional party's documented position is far from the option you chose: ${quoted} Placeholder text.`,
      "party-position-unclear": `Only a tentative indication was found for this fictional party, and it points to: ${quoted} Placeholder text.`,
    }[agreement];
  }
  if (held.id === option.id)
    return "העמדה המתועדת של המפלגה הבדיונית הזו היא האפשרות שבחרת. טקסט ממלא מקום.";
  return {
    agrees: `העמדה המתועדת של המפלגה הבדיונית הזו קרובה לאפשרות שבחרת: ${quoted} טקסט ממלא מקום.`,
    partially: `העמדה המתועדת של המפלגה הבדיונית הזו חופפת בחלקה לאפשרות שבחרת: ${quoted} טקסט ממלא מקום.`,
    disagrees: `העמדה המתועדת של המפלגה הבדיונית הזו רחוקה מהאפשרות שבחרת: ${quoted} טקסט ממלא מקום.`,
    "party-position-unclear": `למפלגה הבדיונית הזו נמצאה רק אינדיקציה ראשונית, והיא מצביעה על: ${quoted} טקסט ממלא מקום.`,
  }[agreement];
}

const UNCLEAR_TEXT: Record<Lang, string> = {
  en: "No documented position on this issue was found for this fictional party. Placeholder text.",
  he: "לא נמצאה עמדה מתועדת בנושא זה עבור המפלגה הבדיונית הזו. טקסט ממלא מקום.",
};

/** "Also worth knowing" points; the anchors are sub-sections of the placeholder research. */
const POINTS: { anchor: string; en: string; he: string }[] = [
  {
    anchor: "other-environment",
    en: "Supports expanding fictional national parks. Placeholder text.",
    he: "תומכת בהרחבת גנים לאומיים בדיוניים. טקסט ממלא מקום.",
  },
  {
    anchor: "other-transport",
    en: "Backs a fictional national network of cycling paths. Placeholder text.",
    he: "תומכת ברשת ארצית בדיונית של שבילי אופניים. טקסט ממלא מקום.",
  },
];

function texts(
  partyId: string,
  lang: Lang,
  files: { positions: PositionsFile; grid: DistancesFile }[],
): PartyTexts {
  const entries = issues.map((issue, i): [string, PartyTexts["issues"][string]] => {
    const anchor = issueAnchor(issue.id);
    const { positions, grid } = files[i];
    const row = positions.rows.find((r) => r.partyId === partyId)!;
    if (row.unclear) return [issue.id, { anchor, unclear: { text: UNCLEAR_TEXT[lang] } }];
    const options = issue.options.map((option) => {
      // The held option the score rests on is the one the text talks about.
      const best = [...row.held].sort(
        (a, b) =>
          config.levels[b.level] * closeness(grid, b.optionId, option.id) -
          config.levels[a.level] * closeness(grid, a.optionId, option.id),
      )[0];
      const held = issue.options.find((o) => o.id === best.optionId)!;
      const agreement = issueAgreement(row, option.id, grid, config);
      return [option.id, { agreement, text: optionText(lang, agreement, option, held) }];
    });
    return [issue.id, { anchor, options: Object.fromEntries(options) }];
  });
  return {
    partyId,
    lang,
    issues: Object.fromEntries(entries),
    points: POINTS.map((p) => ({ text: p[lang], anchor: p.anchor })),
  };
}

// ------------------------------------------------------------------ profiles

/** The option at `index` of an issue's list (negative counts from the end). */
function pick(issueId: string, index: number): string {
  const { options } = issues.find((i) => i.id === issueId)!;
  return options[(index + options.length) % options.length].id;
}

/**
 * Builds a profile from `[issueId, optionIndex]` pairs in rank order. Options are
 * named by index for the same reason as in `placeholder-positions.ts`.
 */
function profile(
  id: string,
  description: string,
  answers: [string, number][],
  expect: ProfilesFile["profiles"][number]["expect"],
  reason: string,
): ProfilesFile["profiles"][number] {
  return {
    id,
    description,
    ranked: answers.map(([issueId]) => issueId),
    answers: Object.fromEntries(answers.map(([issueId, index]) => [issueId, pick(issueId, index)])),
    expect,
    reason,
  };
}

/**
 * The placeholder voters. Each produces one result case the end-to-end tests
 * need; `tests/fixtures/matching.ts` names them for the tests.
 */
const PLACEHOLDER_PROFILES: ProfilesFile["profiles"] = [
  profile(
    "joint-list-top",
    "Picks the third option on five issues.",
    [
      ["gaza", 2],
      ["haredi-enlistment", 2],
      ["housing", 2],
      ["iran-and-regional-security", 2],
      ["judicial-system", 2],
    ],
    { topAnyOf: ["green-valley"], inTop4: ["olive-branch"], notInTop4: ["pebble-citizens"] },
    "Green Valley holds the third option on all five; its joint-list partner Olive Branch sits one option away.",
  ),
  profile(
    "below-threshold-top",
    "Shares The Lighthouse's own mix of positions.",
    [
      ["gaza", 4],
      ["housing", 3],
      ["judea-samaria", 4],
      ["crime-in-arab-society", 2],
      ["october-7-inquiry", 2],
    ],
    { topAnyOf: ["lighthouse"], inTop4: ["cedar-tradition"] },
    "The Lighthouse, whose list polls below the threshold, holds all five options; Cedar Tradition shares three and is unclear on the inquiry.",
  ),
  profile(
    "limited-information-top",
    "Cares most about the three issues Pebble Citizens has a position on.",
    [
      ["cost-of-living", 1],
      ["crime-in-arab-society", 0],
      ["housing", 2],
      ["gaza", 4],
      ["haredi-enlistment", 3],
    ],
    { topAnyOf: ["pebble-citizens"] },
    "Pebble Citizens holds the first three options and has no documented position on the other two, where no other party is close enough to overtake it.",
  ),
  profile(
    "weak-match",
    "Alternates between the last and the first option, which no party does.",
    [
      ["cost-of-living", -1],
      ["gaza", 0],
      ["haredi-enlistment", 0],
      ["judicial-system", -1],
      ["religion-and-state", 0],
    ],
    { topAnyOf: ["green-valley", "blue-horizon", "olive-branch"], notInTop4: ["lighthouse"] },
    "Every party is far from this voter on at least two of the five issues, so the top score stays below the weak-match level.",
  ),
  profile(
    "unclear-position",
    "Picks the last option everywhere and ranks the October 7 inquiry.",
    [
      ["gaza", -1],
      ["haredi-enlistment", -1],
      ["housing", -1],
      ["iran-and-regional-security", -1],
      ["october-7-inquiry", -1],
    ],
    { topAnyOf: ["cedar-tradition"] },
    "Cedar Tradition holds the last option on four issues and has no documented position on the inquiry.",
  ),
];

// ------------------------------------------------------------------ write

for (const dir of ["positions", "distances", "texts"]) {
  fs.rmSync(path.join(outDir, dir), { recursive: true, force: true });
}
const files = issues.map((issue) => ({ positions: positions(issue), grid: distances(issue) }));
files.forEach(({ positions, grid }) => {
  write(`positions/${positions.issueId}.json`, positions);
  write(`distances/${grid.issueId}.json`, grid);
});
for (const lang of ["en", "he"] as const) {
  for (const p of parties) write(`texts/${lang}/${p.id}.json`, texts(p.id, lang, files));
}
write("profiles.json", { profiles: PLACEHOLDER_PROFILES });
console.log(
  `Wrote placeholder matching content: ${issues.length} issues, ${parties.length} parties, ` +
    `${PLACEHOLDER_PROFILES.length} profiles.`,
);
