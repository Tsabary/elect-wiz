# Hebrew edition parity check (Stage 5b)

One section per party. Each Hebrew edition was written by a Stage 5a agent (Sonnet) and checked by a different Stage 5b agent (Opus), which fixed every difference in the Hebrew. English is canonical and was not edited.

## the-reservists (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 25 anchors, same order; Hebrew headings per 5a table and issue `he.title`)
- Claims compared: ~320 · Differences found: 25 · Fixed: 25 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| leadership | meaning drift: fiber-optic fund said to be one the companies "had funded" (שמימנו), where EN says a fund paid for by the companies to finance networks | Changed to "קרן במימון חברות הטלפון והאינטרנט שתממן רשתות" |
| leadership | meaning drift: Kipa's description of Wilf, "הידועה בשנים האחרונות בעבודתה", could be read as describing the Oz party rather than Wilf | Changed to "וכמי שידועה בשנים האחרונות..." |
| issue-haredi-enlistment | meaning drift: "חוק הפטור" (a law) for EN "exemption bill" | Changed to "הצעת חוק הפטור" |
| issue-iran-and-regional-security | meaning drift: "ושיש לו ערבויות אמריקאיות" could be read as Hendel having the guarantees, not the deal | Changed to "ושהוא מגובה בערבויות אמריקאיות" |
| other-settlement-and-agriculture | meaning drift: "יציבות המזון" for "food security" | Changed to "ביטחון תזונתי" |
| other-defense-industry | meaning drift (strength): "אינה יכולה להיות תלויה" (cannot) for EN "must not depend" | Changed to "אסור לישראל להיות תלויה" |
| track-record | meaning drift: "ניצחה בהתנגדות הליכוד" (reads as won *by objecting*) for "defeated Likud's objection" | Changed to "גברה על התנגדות הליכוד" |
| issue-crime-in-arab-society | glossary: "החזקת חשודים ללא משפט" instead of glossary term מעצר בלי משפט | Changed to "מעצר חשודים בלי משפט" |
| leadership | glossary/names: No. 4 spelled "חביב וולוביץ'"; registry (lists.json) has "חביב ווליבוביץ" | Changed to registry form |
| overview, leadership, issue-cost-of-living, issue-crime-in-arab-society, issue-gaza, issue-housing, issue-judicial-system, issue-religion-and-state, other-wounded-and-mental-health, coalition, track-record, information-availability | naturalness (16 edits): redundant "המילואימניקים (HaMiluimnikim, המילואימניקים)"; "הונחה לדיון מקדים" phrasing (now "דיון מוקדם"); "קהילה" → "יישוב" (Yonatan); "הדיור הסבסודי" ×2 → "המסובסד"; "ההיקף" ×2 → "הפרימטר" and "בגובה השולט" → "בשטחים הגבוהים הצופים"; "הטבות מס בתאגידים" → "במס חברות"; "מוצאים כבלתי סבירות"; "מתן אמירה לכנסת" → "מתן משקל"; "שעשתה רפורמה" → "שקידמה רפורמה"; "קרובי משפחה שכולים" → "בני משפחות שכולות"; "סמכויות אכיפה" → "סמכויות שיטור" (policing powers); "ממשל" → "ממשלה"; "ברמת מעשה" → "שמסומנים כ'מעשה'"; "בנושאים אחד אחד" → "נושא אחר נושא" | Fixed in Hebrew |
- Checked with no difference: evidence-tier tags (21 Formal commitment, 4 Action, all Statements, 2 Change over time, 10 Closest option(s), same claims); the full `[n]` citation sequence matches the English token for token; Sources list identical (68 entries, same order and URLs); option IDs on every Closest option(s) line identical; dates day-first; no "נחקרה"/"שנחקרו".
- Author's flagged question (quoted "חוק השתמטות" and "מדינת טרור"): **kept.** Ruling: a glossary `avoid.he` term may appear only inside quotation marks *and* explicitly attributed to the party or speaker ("שהמפלגה מכנה", "במצע המפלגה כתוב", "הוא כינה"), and only where the English quotes the equivalent words ("evasion law", "a terror state"). The glossary avoid-lists govern neutral system text; elsewhere its notes allow loaded terms inside a side's own stated rationale, and rendering a quote with neutral words would misreport what the party said (a meaning-drift failure). The same ruling covers the quoted "מהציבור שמשתמט משירות" (EN "from the public that evades service") and Hendel's quoted "מערב פרוע במגזר הערבי" (EN "Arab sector", also in quotes). No unquoted or unattributed use of any avoid term was found.
- English questioned: none.
- Validation: no error names the file ✔ (`pnpm validate:content` passed)
- Trial verdict: Sonnet is good enough for the other parties, with an Opus 5b check kept. None of the 25 differences was a dropped/added claim or loaded wording, and all citations, tags and option IDs were exact. The 7 meaning-drift items were small word-choice or ambiguity slips, not changes to claims. Most fixes were naturalness edits.

