/**
 * Prints one party's computed agreement labels for every issue and option, in
 * the form the Stage 7c texts brief expects (`{{COMPUTED_LABELS}}`).
 *
 * Usage: tsx scripts/print-computed-labels.ts <partyId>  (real corpus)
 */
import fs from "node:fs";
import path from "node:path";
import { issueAgreement } from "../lib/matching/score";

const partyId = process.argv[2];
if (!partyId) {
  console.error("usage: tsx scripts/print-computed-labels.ts <partyId>");
  process.exit(1);
}
const root = path.join(process.cwd(), "content");
const read = (rel: string) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const config = read("matching/config.json");

for (const file of fs.readdirSync(path.join(root, "issues")).sort()) {
  const issue = read(`issues/${file}`);
  const row = read(`matching/positions/${issue.id}.json`).rows.find(
    (r: { partyId: string }) => r.partyId === partyId,
  );
  if (!row) throw new Error(`no positions row for "${partyId}" on "${issue.id}"`);
  if (row.unclear) {
    console.log(`${issue.id}: unclear`);
    continue;
  }
  const grid = read(`matching/distances/${issue.id}.json`);
  const held = row.held
    .map((h: { optionId: string; level: string }) => `${h.optionId} ${h.level}`)
    .join(", ");
  console.log(`${issue.id} (held: ${held})`);
  for (const o of issue.options) {
    console.log(`  ${o.id}: ${issueAgreement(row, o.id, grid, config)}`);
  }
}
