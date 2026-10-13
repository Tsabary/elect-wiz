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

## degel-hatorah (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (9 sections, 10 issue sub-sections, 8 other-positions sub-sections, same order)
- Claims compared: ~240 · Differences found: 23 · Fixed: 23 · Unresolved: 0
- Mechanical checks: the sequence of `[n]` citations is identical across the whole document; the option IDs on every "closest option(s)" line are identical; Sources 1–80 are identical (count, order, titles, URLs).

| Anchor | Difference | Resolution |
|---|---|---|
| overview | Naturalness: the parenthesis repeated the bare name in quotes ("דגל התורה") after "באנגלית: Degel HaTorah". | Removed the repeated name. The English gloss "Banner of the Torah" is not needed in Hebrew. |
| overview | Meaning drift (name): "הרב אלעזר מנחם שך" added a partial middle name that the English does not have. | Changed to "הרב אלעזר שך". |
| overview | Naturalness: "כסיעה נפרדת, בנפרד מאגודת ישראל" (redundant). | Changed to "כסיעה עצמאית, נפרדת מאגודת ישראל". |
| overview | Naturalness/consistency: the list was called "**יהדות התורה והשבת**" where the English says "United Torah Judaism". The document uses "יהדות התורה" everywhere else. | Changed to "**יהדות התורה**". The full registered name still follows in quotes. |
| overview, leadership | Names (2 places): Elyakim Stark was spelled "אלקים", which reads as a divine name. The registry and the agudat-yisrael Hebrew edition spell it "אליקים". | Changed to "אליקים" in both places. |
| leadership | Meaning drift: "MKs more loyal to it" (to the Rabbi's household) was rendered "נאמנים לו" (to him personally). | Changed to "נאמנים יותר לבית הרב". |
| leadership | Meaning drift: "Top of the joint list" was rendered "ראש הרשימה המשותפת" (the head of the list, one person). | Changed to "המקומות הראשונים ברשימה המשותפת". |
| leadership | Meaning drift: in "and was its director" (its = the Institute), "מנהלו" was ambiguous between the project and the Institute. | Changed to "ושימש מנהל המכון". |
| issue-cost-of-living | Naturalness: "הזכיר ... כתלונות נגד הממשלה". | Changed to "ציין ... כטענות נגד הממשלה". |
| issue-cost-of-living, other-haredi-education | Meaning drift (2 places): "secured about NIS 1 billion" was rendered "הבטיח", which in Hebrew mainly means "promised". | Changed to "השיג" in both places. |
| issue-cost-of-living | Meaning drift: in "מדגל התורה דאז", "then" attached to the party rather than to the MK. | Changed to "וחבר הכנסת דאז מדגל התורה אליהו ברוכי". |
| issue-gaza | Naturalness/meaning: "Tentative, mixed and dated" was rendered as feminine adjectives with no noun ("זהירה, מעורבת ומיושנת"). | Changed to "הערכה זהירה; הראיות מעורבות ומיושנות." |
| issue-gaza | Naturalness: "הצדדו בסיום הלחימה ובהצבת החטופים" (unnatural verb). | Changed to "תמכו בסיום הלחימה ובהעמדת החטופים". |
| issue-haredi-enlistment | Naturalness: "גרמה לממשלה להתחייב" (sounds coercive). | Changed to "השיגה התחייבות של הממשלה". |
| other-lgbt | Consistency: the same Pindrus quote ("permissiveness regarding *arayot*") was worded differently from the Leadership section ("בכל הנוגע לעריות" vs "בעניין העריות"). | Unified to "ההפקרות בעניין העריות". |
| issue-judicial-system | Loaded wording: "נדחפים השינויים" (being pushed) for "being pursued". | Changed to "מקודמים". |
| other-death-penalty | Naturalness: "final reading" was rendered "בקריאה האחרונה". | Changed to "בקריאה השלישית", the standard Knesset term with the same meaning. |
| coalition | Naturalness: "קיבלה את יושב ראש ועדת הכספים / ועדת הפנים" (it received the chair person). | Changed to "קיבלה את ראשות ועדת הכספים / ועדת הפנים". |
| coalition | Meaning drift: "over the draft law" was rendered "בגלל הצעת החוק" (unspecified bill). | Changed to "בגלל חוק הגיוס". |
| coalition | Naturalness: the bracketed insertion came after the name ("בנתניהו [ראש הממשלה בנימין]"). | Changed to "ב[ראש הממשלה בנימין] נתניהו". |
| coalition | Meaning drift (quote consistency): the second citation of the same Lando quote dropped "any" ("אין לנו עוד אמון"). | Changed to "אין לנו עוד שום אמון בנתניהו", matching the first citation and the English. |

Checked and found correct (no change):
- **"Ten times" (author flag):** the dated list gives 1996, 1999, 2005, 2008, three in 2019, 2020, 2022 and 2026, which is 10. The one split that was not shortly before an election is 2005, which matches "each time but one". The English is consistent, so it is not questioned. One wording nit for the owner (not a parity issue): the sentence opens "Knesset faction records show…" while the 2026 split is sourced to [73], a House Committee session record, not to the faction records [72].
- **"Moshe Azriel Rosenthal" (author flag):** the Hebrew "משה עזריאל רוזנטל" matches the registry `he` form (lists.json). The registry's `en` form is "Moshe Rosenthal", while the English document says "Moshe Azriel Rosenthal". This is a registry/English naming nit, not a parity difference; noted for the orchestrator.
- **Pindrus as "יצחק זאב פינדרוס":** matches the registry `he` form.
- **"המכון החרדי לענייני ציבור" (author flag):** it is a direct, plausible rendering of "Haredi Institute for Public Affairs". The Hebrew Knesset biography [11] could not be checked offline, so the form is still unconfirmed. Left as is.
- **"עריקים" (author flag):** it appears only in the original source titles [2], [39], which must be kept, and as "שהוכרזו עריקים" for "declared deserters", the legal status of specific individuals. The glossary note allows this. Accepted.
- **Hebrew labels outside the tag table (author flag):** each matches its English label: רקע = Background, הערכה = Assessment, היקף = Scope, מגבלות הראיות = Limits of the evidence, רקורד = Record, לא נמצאה עמדה מתועדת (אחרת) = No (other) documented position found. "הצהרות:" = "Statements:" is a plural of the tag.
- **Glossary:** the required terms are used: חרדי, תלמידי ישיבות, גיוס, צה״ל, יהודה ושומרון, יישובים/התיישבות, החלת ריבונות ישראלית (with "המכונה גם סיפוח" exactly where the English says "also called annexation"), מתקפת 7 באוקטובר, ועדת חקירה ממלכתית, ועדה שתמונה באמצעות הכנסת, בג״ץ/בית המשפט העליון, ההלכה (החוק הדתי היהודי), השב״כ (…), מעצר בלי משפט, חוק יסוד. No avoid.he term appears outside the allowed uses above. The words "נחקרה"/"שנחקרו" do not appear. All dates are day first.
- Validation: no error names the file ✔ (`pnpm validate:content` passed).

## agudat-yisrael (checked 2026-10-13; EN researchedAsOf 2026-10-06)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (frontmatter identical except `lang: he`; the files line up line for line)
- Claims compared: ~330 · Differences found: 21 · Fixed: 21 · Unresolved: 0
- Checked by script on every line: `[n]` citations identical on every line ✔; option IDs on every "closest option(s)" line identical ✔; Sources list (93 entries) byte-identical, with the same count, order and URLs ✔; evidence-tier tags identical ✔; no "נחקרה"/"שנחקרו" ✔; dates day first ✔.

| Anchor | Difference | Resolution |
|---|---|---|
| issue-gaza, issue-october-7-inquiry | meaning drift (2): "tentative" was given as "זמנית" (temporary) | Changed to "הערכה זהירה" (Gaza: "הערכה זהירה, והראיות מעורבות") |
| issue-gaza | meaning drift: "post-ceasefire choices" was given as "הבחירות שאחרי הפסקת האש", which reads as "the elections after the ceasefire" | Changed to "האפשרויות שעל הפרק אחרי הפסקת האש" |
| leadership | meaning drift: "Gur and other Haredi Talmud Torah schools" was given as "of Gur and of other Haredi courts" | Changed to "תלמודי תורה של גור ותלמודי תורה חרדיים אחרים" |
| other-haredi-education-daycare | meaning drift: "criteria for state daycare subsidies" was given as subsidies for state-run daycares ("מעונות יום ממלכתיים") | Changed to "הקריטריונים לסבסוד המדינה למעונות יום" |
| coalition | meaning drift: "list leader" Asher was given as "יושב ראש הרשימה" | Changed to "ראש הרשימה" |
| coalition | naturalness (flagged by the author): "Kept in 2022." was given as "קוים ב-2022.", which is ambiguous without niqqud (it reads as "קווים", lines) | Changed to "ההבטחה קוימה ב-2022." |
| other-consumer-taxes | naturalness (flagged by the author): the quote "another wicked decree" was given as "עוד גזירה רשעה" (unidiomatic) | Changed to "עוד גזירה מרושעת", which is the source's own wording (title of [55]). It stays in quotation marks and attributed to Goldknopf; "גזירה" alone is not a glossary avoid term (the avoid term is "גזירת הגיוס") |
| issue-judicial-system | naturalness: the quoted agreement wording "strengthen governability" was given as "לחזק את היכולת למשול" | Changed to "לחזק את המשילות", the standard Hebrew term |
| overview, leadership, coalition, issue-cost-of-living, issue-haredi-enlistment, other-torah-study-funding, other-haredi-education-daycare, track-record | naturalness (13): literal or ungrammatical wording ("שמירה על תלמידי ישיבות מחוץ לשירות", "שני הגברים", "חדשות 12 דיווחה" ×2, "קיבל תפקיד שרים", "שר ירושלים ומורשת", "את המחויבויות חתמה", the broken quote "שאין \"ראוי עוד", "השאירה דחיות", "מימון ממלכתי", "התנגדו ... כאל קיצוצים", "מוחזק בחזרה") | Rewritten in plain Hebrew with the same meaning |

Author's flags, verified with no change needed:
- Council of Torah Sages: the English itself gives "מועצת גדולי התורה" for Agudat Yisrael's council, so the Hebrew is correct. "מועצת חכמי התורה" (used in shas/the-reservists) is Shas's council, a different body.
- Tessler: the English uses "Yoel Yaakov Tessler" in his leadership heading and "Yaakov Tessler" elsewhere, and the Hebrew mirrors this exactly (יואל יעקב טסלר / יעקב טסלר). The registry has no Hebrew entry for Tessler. Left as it is.
- "מגזר" appears only inside quotation marks (line 177 "מגזר מסוים", line 193 "המגזר", where the English quotes "sector" in both places) and in source titles. The glossary avoid term is "המגזר הערבי" only.
- Avoid-list words inside quotes, all attributed and matching an English quotation (allowed under the project ruling): "פדיון שבויים" (Goldknopf, "redeeming captives"), "רדיפת עולם התורה" (Council letter), "הרדיפה הדתית" (Porush), "הרפורמה המשפטית" (Goldknopf, Tessler and Roth letter). There are no avoid-list words outside quotes.
- Names follow the registry (יצחק גולדקנופ; the full forms יצחק זאב פינדרוס and משה עזריאל רוזנטל on the top-places line, which match lists.json).
- Validation: no error names the file ✔ (`pnpm validate:content`: "Content validation passed")

## taal (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 29 anchors, same order; Hebrew headings per the 5a table and issue `he.title`)
- Claims compared: ~300 · Differences found: 28 · Fixed: 28 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| issue-haredi-enlistment, issue-religion-and-state | meaning drift: "Tentative" given as "זמנית" (= temporary) in 2 Closest option(s) lines and 2 "the mapping is tentative" sentences | Changed to "בהסתייגות" / "ההתאמה אינה ודאית" |
| overview | meaning drift: Bin Said's charge that Tibi ran the party "in an individual manner" given as "בדרך אישית" (reads as "personally") | Changed to "באופן יחידני" |
| leadership | meaning drift: "Top of the Joint List" given as "ראש הרשימה" (the single head) | Changed to "צמרת הרשימה המשותפת" |
| other-wartime-speech | meaning drift (strength): Vivian Silver "was killed" given as "שנרצחה" | Changed to "שנהרגה" to match the English |
| other-security-prisoners | meaning drift (strength): "unanswered for months" given as "חודשים ארוכים" | Changed to "במשך חודשים" |
| coalition | meaning drift: "recalling the 1992 outside support for Rabin" given as "ונזכר" (he remembered); the next quote was broken ("ושה"נעשה") | Changed to "והזכיר את התמיכה..., ואמר: "נעשה..." |
| issue-october-7-inquiry | glossary: "Knesset-based inquiry" given as "ועדה חלופית שתפעל מטעם הכנסת", not the glossary term | Changed to "ועדת חקירה חלופית שתמונה באמצעות הכנסת" |
| issue-judicial-system | glossary/naturalness: "settlements" in the list of Supreme Court rulings given as bare "יישובים" (reads as "towns") | Changed to the glossary form "ההתיישבות" |
| overview, leadership, legal, information-availability | names: "הייתם זחלקה" ×5; the standard Hebrew spelling of the family name (also used in this project's Balad file) is זחאלקה | Changed to "הייתם זחאלקה" |
| leadership | names: "אוסמה סעדי"; standard Hebrew form is "אוסאמה סעדי" | Fixed |
| issue-housing, other-arab-citizens-equality, track-record | names: "חוק קמניץ" ×3; standard spelling is "חוק קמיניץ" | Fixed |
| leadership | names: Wye River Memorandum given as "הסכם ואי ריבר" | Changed to "מזכר ואי ריבר" |
| overview, leadership, legal | naturalness (16 edits): English gloss "(באנגלית: Ta'al, the Arab Movement for Renewal)" removed; "לקחה את שמה" → "אימצה"; "מנהיגה ותיק" → "מנהיגה הוותיק"; "היסטוריית הברית" → "הבריתות"; ambiguous CEC short form "(הוועדה)" ×6 → "ועדת הבחירות" (it clashed with "ועדת הפיוס" and the Ethics Committee); "בקבלה בקשה" → "וקיבלה בכך בקשה"; "לפי בקשה... לפי הסעיף" → "בעקבות בקשה..., לפי הסעיף"; "בעל תפקיד במפלגה" → "בתע"ל"; Comptroller "החזיק בידו" ×2 → "עיכב". Also in issue-cost-of-living: "מגיל לידה ועד דוקטורט" → "מהלידה ועד הדוקטורט" and nested parentheses on the 2025 budget date → semicolons; issue-iran: "תקיפה באיראן" → "תקיפת איראן"; issue-judicial-system: "מעריץ את התמדת" → "מעריך את התמדתם"; coalition: "לא הכוס תה שלי" → "לא כוס התה שלי", "ראש ממשלה מעבר" → "ראש ממשלת מעבר" | Fixed in Hebrew |
- Checked with no difference: evidence-tier tags (14 Action, 4 Formal commitment, 26 Statement, 1 Context, 1 Background, 10 Closest option(s), same claims; no Contradiction or Limited-information tags in either); the full `[n]` sequence (193 citation groups) matches the English token for token; Sources list identical (116 entries, same order, titles and URLs); option IDs on every Closest option(s) line identical; all numbers, vote tallies and dates match and dates are day-first; no "נחקרה"/"שנחקרו".
- Author's flagged quoted terms: **all kept, each meets the ruling.** "להפיכה המשטרית" (glossary avoid "הפיכה משטרית") is inside Tibi's attributed quote ("אמר טיבי") where the English quotes "regime overhaul", with the same bracketed gloss [שינויים במערכת המשפט]. "התנחלויות" (Feb 2024) and "אזרחים פלסטינים של ישראל" are not on any `avoid.he` list (the settlements avoid-list is קולוניות / מושבות כיבוש); both are inside attributed quotes where the English quotes "settlements" and "Palestinian citizens of Israel". The same ruling also covers three other quoted avoid-list terms: "טיהור אתני" ("מה שכינה", EN quotes "ethnic cleansing"), "לסיים את הכיבוש" (Feb 2024 quote, EN "ending the occupation") and "מיסוד האפרטהייד" (Hadash–Ta'al quote). No unquoted or unattributed use of any avoid term was found; "המגזר הערבי" and "ערביי ישראל" do not appear.
- Names not in the registry: דראושה, ע'סאן עבדאללה, אעתימאד קעדאן, לית' כבהא, יוסף עטאונה, סמיר בן סעיד, וליד דקה, אנסטסיה מיכאלי and ויויאן סילבר are standard Hebrew spellings. Two were corrected (זחאלקה, אוסאמה סעדי; rows above). Registry names (Jabareen, Tibi, Ghattas, Awawdeh, Cassif, Abu Shehadeh, the Joint List, ballot letters ודם) all match.
- English oddities the author kept: the doubled "see the Haredi enlistment section" in the Religion-and-state Action bullet is redundant but not wrong, and the Hebrew mirrors it. The 25 March vs 24 March budget-vote date is explicitly explained in the English body and source 107, so it is not an error.
- English questioned: none.
- Validation: no error names the file ✔ (`pnpm validate:content` passed)
