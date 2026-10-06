/**
 * Generates the FICTIONAL placeholder research documents
 * (`content/placeholder/research/{en,he}/<party-id>.md`) from the current issues
 * and the placeholder registry, so the placeholder corpus always has one
 * sub-section per issue. Re-run after the issues change:
 *
 *   npx tsx scripts/generate-placeholder-research.ts
 *
 * Deleted together with the placeholder corpus in Task 4.1.
 */
import fs from "node:fs";
import path from "node:path";
import { issueSchema, partiesFileSchema, type Issue, type Party } from "../lib/content/schemas";

const root = path.join(process.cwd(), "content");
const outDir = path.join(root, "placeholder", "research");

const issues: Issue[] = fs
  .readdirSync(path.join(root, "issues"))
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => issueSchema.parse(JSON.parse(fs.readFileSync(path.join(root, "issues", f), "utf8"))));

const parties: Party[] = partiesFileSchema.parse(
  JSON.parse(fs.readFileSync(path.join(root, "placeholder", "registry", "parties.json"), "utf8")),
).parties;

const lists = JSON.parse(
  fs.readFileSync(path.join(root, "placeholder", "registry", "lists.json"), "utf8"),
).lists as { id: string; memberPartyIds: string[]; name: { he: string; en: string } }[];

/** Which option each fictional party leans to, as an index offset. */
const PROFILE: Record<string, number> = {
  "blue-horizon": 0,
  "olive-branch": 1,
  "green-valley": 2,
  "cedar-tradition": 3,
  lighthouse: 1,
  "pebble-citizens": -1, // limited information
};

const TIERS = {
  en: ["Action", "Formal commitment", "Statement"],
  he: ["מעשה", "התחייבות רשמית", "הצהרה"],
};

function doc(p: Party, lang: "en" | "he"): string {
  const name = p.name[lang];
  const list = lists.find((l) => l.id === p.listId)!;
  const partners = list.memberPartyIds
    .filter((id) => id !== p.id)
    .map((id) => parties.find((x) => x.id === id)!);
  const offset = PROFILE[p.id] ?? 0;
  const he = lang === "he";
  const L = (en: string, heText: string) => (he ? heText : en);

  const issueSubs = issues
    .map((issue, i) => {
      const t = issue[lang];
      if (offset < 0) {
        return `### ${t.title} {#issue-${issue.id}}\n\n${L(
          "No published position, voting record or platform statement on this issue was found for this fictional party [1].",
          "לא נמצאו עמדה מפורסמת, רקורד הצבעות או מצע בנושא זה עבור המפלגה הבדיונית הזו [1].",
        )}\n`;
      }
      const opt = issue.options[(offset + i) % issue.options.length];
      const tier = TIERS[lang][(offset + i) % 3];
      return `### ${t.title} {#issue-${issue.id}}\n\n**${L("Evidence", "ראיה")}: ${tier}.** ${L(
        `This fictional party's position is closest to: "${opt.en}"`,
        `עמדת המפלגה הבדיונית הזו הכי קרובה ל: "${opt.he}"`,
      )} [${(i % 3) + 1}].\n\n${L(
        "Placeholder text for UI development only. It describes no real party.",
        "טקסט ממלא מקום לפיתוח הממשק בלבד. אינו מתאר מפלגה אמיתית.",
      )}\n`;
    })
    .join("\n");

  const partnerLine = partners.length
    ? L(
        `Runs on the joint list "${list.name.en}" with ${partners.map((x) => x.name.en).join(", ")}. The two parties have not split after any past election (fictional) [2].`,
        `רצה ברשימה המשותפת "${list.name.he}" יחד עם ${partners.map((x) => x.name.he).join(", ")}. המפלגות לא התפצלו אחרי בחירות קודמות (בדיוני) [2].`,
      )
    : L("Runs on its own list [2].", "רצה ברשימה עצמאית [2].");

  return `---
partyId: ${p.id}
lang: ${lang}
researchedAsOf: ${p.researchedAsOf ?? "2026-10-06"}
---

## ${L("Overview", "סקירה כללית")} {#overview}

${L(
  `**${name}** is a FICTIONAL party used as placeholder content while the real research is prepared. It was "founded" in 2019 and currently holds 4 seats in the Knesset (fictional) [1].`,
  `**${name}** היא מפלגה בדיונית שמשמשת תוכן ממלא מקום עד שהמחקר האמיתי יהיה מוכן. היא "נוסדה" ב־2019 ומחזיקה כיום 4 מושבים בכנסת (בדיוני) [1].`,
)}

${partnerLine}

## ${L("Leadership and key candidates", "הנהגה ומועמדים מובילים")} {#leadership}

${L(`Led by ${p.leader.en} (fictional person) [1].`, `בראשות ${p.leader.he} (דמות בדיונית) [1].`)}

## ${L("Positions on the issues", "עמדות בנושאים")} {#issues}

${issueSubs}
## ${L("Other notable positions", "עמדות בולטות נוספות")} {#other-positions}

### ${L("Environment", "סביבה")} {#other-environment}

${L("Supports expanding fictional national parks [3].", "תומכת בהרחבת גנים לאומיים בדיוניים [3].")}

## ${L("Coalition stance", "עמדה לגבי קואליציה")} {#coalition}

${L("Has said it would join any coalition that adopts its fictional platform [2].", "הצהירה שתצטרף לכל קואליציה שתאמץ את המצע הבדיוני שלה [2].")}

## ${L("Track record", "רקורד")} {#track-record}

${L("Has not served in government (fictional) [1].", "לא כיהנה בממשלה (בדיוני) [1].")}

## ${L("Legal or ethical matters involving leaders", "הליכים משפטיים או אתיים הנוגעים להנהגה")} {#legal}

${L("No indictments, convictions or official inquiries (fictional) [1].", "אין כתבי אישום, הרשעות או חקירות רשמיות (בדיוני) [1].")}

## ${L("Sources", "מקורות")} {#sources}

1. ${L("Fictional party profile, placeholder data", "פרופיל מפלגה בדיוני, נתוני דמה")}. https://example.org/placeholder/${p.id}/profile
2. ${L("Fictional list announcement, placeholder data", "הודעת רשימה בדיונית, נתוני דמה")}. https://example.org/placeholder/${p.id}/list
3. ${L("Fictional platform, placeholder data", "מצע בדיוני, נתוני דמה")}. https://example.org/placeholder/${p.id}/platform

## ${L("Information availability", "זמינות מידע")} {#information-availability}

${
  p.limitedInfo
    ? L(
        "**Limited information.** This fictional party has no voting record and no published platform [1].",
        "**מידע מוגבל.** למפלגה הבדיונית הזו אין רקורד הצבעות ואין מצע מפורסם [1].",
      )
    : L(
        "Sufficient public information was available for this fictional party [1].",
        "נמצא מספיק מידע ציבורי על המפלגה הבדיונית הזו [1].",
      )
}
`;
}

for (const lang of ["en", "he"] as const) {
  const dir = path.join(outDir, lang);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const p of parties) fs.writeFileSync(path.join(dir, `${p.id}.md`), doc(p, lang));
}
console.log(
  `Wrote ${parties.length * 2} placeholder research documents for ${issues.length} issues.`,
);
