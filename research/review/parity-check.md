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


## haredi-public (checked 2026-10-13; EN researchedAsOf 2026-10-06)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (frontmatter identical except `lang: he`; Sources list identical: 41 entries, same order, titles and URLs; all option IDs identical)
- Claims compared: ~210 · Differences found: 21 · Fixed: 21 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| overview | Naturalness (2): "(באנגלית: HaTzibur HaCharedi)" labelled a transliteration as English; "אין שותפות לרשימה" (wrong noun for "list partners") | "(בתעתיק לאנגלית: …)"; "אין שותפים לרשימה" |
| leadership | Meaning drift (2): "which this project's registry transliterates as 'Litner'" became "וכך הוא מתועתק ברישום" (unclear, implies the Hebrew form); same issue for Pardi ("ובמקביל ברישום הוא מתועתק") | Both now say the project's data transliterates the name into English as Litner / Pardi |
| leadership | Meaning drift (2): "former administrative principal" lost "administrative"; "went back to complete his matriculation exams" lost "went back" | "מנהל אדמיניסטרטיבי לשעבר"; "וחזר להשלים בגרויות"; also removed stray niqqud in "פניני חן" |
| leadership, other-womens-representation | Meaning drift (2): "media and internal pressure from Haredi women" became "pressure from the media and from Haredi women from within" (splits the source of pressure) | "לחץ תקשורתי ופנימי מצד נשים חרדיות" in both places |
| issue-crime-in-arab-society | Citation/tag: [20–33, 37] moved from the searches sentence to "None of these addresses the issue" | Moved back to the searches sentence |
| issue-gaza | Meaning drift: "policy position" rendered "עמדה מדינית" (reads as diplomatic position) | "עמדת מדיניות" |
| issue-haredi-enlistment | Meaning drift: "service must be possible" weakened to "אפשר יהיה לשרת" | "שהשירות חייב להתאפשר" |
| issue-haredi-enlistment | Naturalness (2): "מילואימניקים" (slang); "צורך של ביטחון הלאום" | "משרתי מילואים"; "צורך ביטחוני לאומי" |
| issue-housing | Citation/tag: the English quotes "increase the number of construction starts fivefold" as platform wording; Hebrew dropped the quotation marks | Quotation marks restored |
| other-haredi-education | Meaning drift: "better-trained teachers" became "מוכשרים יותר" (more talented); naturalness: "rooted in Torah" as "שבנוי על" | "בעלי הכשרה טובה יותר"; "שמושרש בתורה ובדרך ארץ" |
| other-livelihood-and-welfare | Loaded wording/meaning drift: "labor unions" as "הסתדרויות עובדים" (evokes the Histadrut specifically) | "חובת החברות באיגודי עובדים" |
| other-womens-representation | Naturalness: "Change over time" bullet was a verbless sentence; citation/tag: quote boundary of "no one is prouder than me" left "אין" outside the quote | Rewritten as a full sentence (same facts, dates, [19]/[23]); quote now "אין מי שגאה יותר ממני" |
| coalition | Naturalness: "ושכשנשאל … ענה" (ungrammatical reported clause) | "וכשנשאל … ענה" |
| information-availability | Loaded/ambiguous wording: "נושאי הסקר" for "survey issues" reads as an opinion poll (the site uses "סקרים" for polls and "שאלון" for the questionnaire) | "עשרת הנושאים שבשאלון" |
- Author's flags: (a) changed to "שאלון" as above. (b) "חוזרים בתשובה" kept: it is the standard neutral Hebrew term for people who became religious later in life (also used in the admissions section as "חוזרות בתשובה"). (c) Tag forms "מעשה (שיחות):", "שינוי לאורך זמן:", "רקורד בעמידה בהתחייבויות קואליציוניות:" kept: consistent with the stage-5 table ("מעשה") and accurate equivalents.
- Glossary: no `avoid.he` term used. "רדיפת לומדי התורה" (close to the avoided "רדיפת בני ישיבות") appears only in quotation marks, attributed "(ניסוח המפלגה)", where the English quotes the same words: allowed under the project ruling. No "נחקרה/שנחקרו". Dates day first throughout.
- English questioned: none.
- Validation: no error names the file ✔

## balad (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 9 sections and 18 sub-anchors in the same order; frontmatter matches except `lang: he`)
- Claims compared: ~280 (every sentence and bullet in every section; 94 sources) · Differences found: 16 · Fixed: 16 · Unresolved: 0
- Citations: the `[n]` sequence across the document is identical to the English; Sources list is identical (94 entries, same order, titles and URLs). Evidence-tier tags match claim for claim. Option IDs on all "closest option(s)" lines match (14 IDs).

| Anchor | Difference | Resolution |
|---|---|---|
| issue-haredi-enlistment | meaning drift: "Tentative" was rendered "באופן זמני" (temporarily), and "The mapping is tentative" as "ההתאמה זמנית" | Changed to "בהסתייגות:" and "ההתאמה אינה ודאית" |
| issue-cost-of-living, issue-housing | meaning drift (2): "net income" was rendered "ההכנסה הפנויה" (disposable income) | Changed to "ההכנסה נטו של משק הבית" in both places |
| issue-crime-in-arab-society | meaning drift: "the harms it blames on the current government's policies" was rendered "הפגיעות שהיא מטילה על מדיניות הממשלה" (harms it imposes on the policies) | Changed to "הנזקים שהיא תולה במדיניות הממשלה הנוכחית" |
| issue-gaza | meaning drift: "urged the United States" was rendered "דרש מ" (demanded; stronger) | Changed to "קרא לארצות הברית לומר לישראל" |
| issue-gaza | meaning drift: quote "against the attack of civilians" was rendered "לפגיעה באזרחים" (harming; softer) | Changed to "לתקיפת אזרחים" |
| legal | meaning drift: "revolting" was rendered "מקוממים" (outrageous) | Changed to "מעוררי שאט נפש" |
| other-land-and-negev | meaning drift: "the removal of Bedouin citizens" was rendered "העברתם" (relocation; softer) | Changed to "פינוים" |
| issue-gaza | glossary / loaded wording: "בסיום הכיבוש" contains the avoid.he term "סיום הכיבוש" outside quotation marks (English attributes it as "the party's term" but doesn't quote it); the gloss also used "שנכבשו" for "taken" | Reworded as "בסיום מה שהמפלגה מכנה הכיבוש (כלומר השליטה הישראלית בשטחים שישראל תפסה ב-1967)", which keeps the English attribution and avoids the exact avoid string. The attributed "what he called the occupation" in issue-judicial-system ("ממה שהוא כינה כיבוש") matches the English and was kept |
| issue-judea-samaria | glossary: the pre-1967-border term was used without its mandated "(הקו הירוק)" | Changed to "(הגבול שלפני 1967, הקו הירוק)" |
| overview, legal | naturalness (2): "a majority was likely to uphold" was rendered "שרוב צפוי" (unclear: a majority of whom?) | "שרוב השופטים צפוי" / "שרובם צפוי" |
| overview | naturalness: "בין מנהיגיה הקודמים הידועים נוסף" | "בין מנהיגיה הידועים בעבר נמנה גם" |
| issue-crime-in-arab-society | naturalness: "עבירות נשק חמורות שלא כדין" | "עבירות חמורות של נשק בלתי חוקי" |
| other-workers-and-welfare | naturalness: "גמלאות להגנה על היריון" | the standard term "גמלת שמירת היריון" |
| coalition | naturalness: "Balad cited" was rendered "הסתמכה על" (relied on) | "נימקה זאת ב..." |
| track-record | naturalness: "מותב של 11 שופטי בית המשפט העליון" | "הרכב של 11 שופטים בבית המשפט העליון" |

Author's flagged points:
- (a) The English has the bold `**No documented position found.**` at issue-october-7-inquiry and issue-religion-and-state. The Hebrew `**לא נמצאה עמדה מתועדת.**` matches it in both places. In issue-crime-in-arab-society the English sentence is not bold, and neither is the Hebrew. No change.
- (b) "התנחלויות" appears only inside the quoted bill title `"חוק פינוי ההתנחלויות"` (the English quotes "Settlements Evacuation") and in the Hebrew title of source 34. Everywhere else the Hebrew uses "יישובים". Accepted under the ruling.
- (c) Occupation: fixed as in the table row above.
- (d) Terror wording: there are three "טרור" uses and each matches the English word for word. Overview: "Hezbollah, the Iran-backed terror organization in Lebanon" is "חיזבאללה, ארגון הטרור בלבנון שאיראן תומכת בו". Coalition: Eisenkot's condition, "recognition of Hamas as a terror organization that must be dismantled", is "הכרה בחמאס כארגון טרור שיש לפרקו", attributed to Eisenkot as in the English. Legal: the CEC ground "supporting the armed struggle of a terror organization" is "תמיכה במאבק מזוין של ארגון טרור". Nothing is added or dropped. No change.
- (e) "נחקר" appears once (legal: "הוא נחקר בחקירה זו"). The English says "he was questioned in that investigation", so it is allowed. Neither "נחקרה" nor "שנחקרו" appears anywhere, and the party investigation is headed "חקירת מימון המפלגה". No change.
- (f) Nahaya Wishahi, written "נהאיה וישאחי": the spelling is unconfirmed. I can't check it from the two documents or the registry, since she is not in `lists.json` topCandidates. This is not a parity difference and is not counted as unresolved, but it is noted for owner follow-up. Other names match the registry, including "פאתן ג'טאס" (registry form). Former MK Basel Ghattas in the legal section is written "בסאל גטאס"; that inconsistent transliteration is noted but not changed, since neither form can be checked from the inputs.
- Dates are day first throughout. No poll figures.
- Validation: no error names the file ✔ (`pnpm validate:content` passed)
