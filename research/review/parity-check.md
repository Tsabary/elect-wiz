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

## eretz-yisrael-shelanu (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 9 sections and all 16 sub-anchors, same order)
- Claims compared: ≈190 (every paragraph, bullet and sentence, all 9 sections) · Differences found: 24 · Fixed: 24 · Unresolved: 0
- Mechanical checks: the in-text citation sequence is identical (170 markers before Sources, and the Information availability markers also match); the Sources list is identical (87 entries, same order, same titles and URLs); the evidence-tier tags pair one-to-one on the same claims; the option IDs on all 10 "closest option(s)" lines are identical.
- Flagged items verified: "emigration" is rendered "הגירה" with no added framing. It appears only where the English has it: IDI's list of initiatives, attributed to IDI; the Gaza lead and the track record, as "עידוד הגירה" (the English has no "voluntary" there, so "מרצון" was correctly not added); and inside the Wasserlauf and Kroizer quotes. The closest-option line uses "עידוד הגירה מרצון", matching the English "voluntary". "ועדת חקירה ממלכתית-לאומית" is kept in quotation marks and attributed to the government or the bill, as in the English. "מלחמה כוללת" appears only inside Kroizer's quote. "במקומות הראשונים ברשימה" is fine. "secured" is rendered "השיג/השיגה" (2 places). "זמני/זמנית" does not appear for "tentative" ("סמכויותיה הזמניות" renders "temporary powers", which is correct). There is no "נחקרה/שנחקרו" and no avoid.he terms. Names match the registry.

| Anchor | Difference | Resolution |
|---|---|---|
| leadership, other-migrants | Meaning drift (softening): the English says "campaign to **deport** African asylum seekers and migrants"; the Hebrew had "הרחקת" (2 places) | Changed to "לגירוש" in both places |
| issue-haredi-enlistment | Meaning drift: "counterproductive" was rendered "מזיקים" ("harmful") | Changed to "משיגים את ההפך" |
| issue-gaza | Meaning drift and naturalness: in "...שארגנו מועצת שומרון, תנועת נחלה ואחרים וקרא לחדש..." the subject of "וקרא" could be read as Wasserlauf, whereas in the English it is the conference that calls for renewed settlement; "Samaria Regional Council" was also given as "מועצת שומרון" | Changed to "שארגנו המועצה האזורית שומרון, תנועת נחלה ואחרים, שקרא לחדש..." |
| issue-gaza | Citation/tag (quotation): the English quotes Otzma's warning that it would "bring down the government"; the Hebrew gave it without quotation marks, so it read as narrator paraphrase (the coalition section quotes it) | Added the quotation marks: ש"תפיל את הממשלה" |
| overview | Naturalness and slight addition: "עמוד הרשימה באתר ועדת הבחירות המרכזית (ועדת הבחירות)" added "website" and a redundant gloss | Changed to "עמוד הרשימה של ועדת הבחירות המרכזית" |
| overview, issues, other-positions, information-availability | Naturalness: the Latin acronym "IDI" was used in the Hebrew body (10 places) | Changed to "המכון הישראלי לדמוקרטיה" (the "(IDI)" gloss at first mention removed); Sources left untouched |
| issue-cost-of-living, issue-october-7-inquiry | Naturalness: the ungrammatical "חיפושים... שנחזרו בבדיקת העובדות" (2 places) | Changed to "שבוצעו שוב בבדיקת העובדות" |
| overview, issue-crime-in-arab-society, issue-haredi-enlistment | Naturalness: "ששה" changed to "שישה"; "כלי אכיפה חמורים יותר" changed to "מחמירים יותר"; "בעקרון" changed to "בעיקרון" (3 places) | Fixed |
| issue-iran-and-regional-security | Naturalness: "negotiated agreement" was rendered with the tautology "הסכם מוסכם" | Changed to "הסכם במשא ומתן" |
| other-agriculture | Naturalness: the heading "יבוא בעלי חיים חיים" | Changed to "חקלאות ויבוא חי של בעלי חיים" |
| track-record | Naturalness: "לא הוצג במחקר זה ש..." | Changed to "המחקר לא הראה ש..." |
- Validation: no error names the file ✔ (the only errors are about research/he/blue-and-white.md, another agent's unfinished file)

## raam (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (29 headings, same order; frontmatter identical except `lang: he`)
- Claims compared: ~310 sentences across all sections, plus 91 Sources entries · Differences found: 17 · Fixed: 17 · Unresolved: 0
- Checked and identical, no change needed: every `[n]` on every line; all 91 Sources entries (numbers, order, titles, URLs); every option ID on the "closest option(s)" lines; evidence-tier tags on every bullet; issue headings match `he.title`; all numbers, vote tallies and dates (day first). "Secured" is rendered "השיגה". "Tentative" is rendered "בהסתייגות" / "לא ודאית", never "זמני/ת". No "נחקרה/שנחקרו". No `avoid.he` glossary terms.
- Labels the author flagged: "**הקשר:**" (Context) and "**שינוי לאורך זמן:**" (Change over time) match the forms used in the other Hebrew files ✔. "The rest of the top of the list includes …" → "במקומות הבאים ברשימה נמצאים …" (positions 6–9) says the same thing ✔ (not counted as a difference).
- Names not in the registry: יאסר חוג'יראת, איברהים א-טורי, עבד אל-כרים מסרי and עבד אל-כרים עזאם are standard Hebrew spellings, and no other Hebrew file uses a different form ✔. Dahamsha and Ghanaim were changed (see table).

| Anchor | Difference | Resolution |
|---|---|---|
| overview, leadership, issues, other-positions, coalition, legal, information-availability | glossary/names: "יואב סגלוביץ'" (12×) differed from the registry form "יואב סגלוביץ" | Changed to the registry form everywhere |
| overview, religion-and-state | names: "יחיא דהמשה" (2×) is not the usual Hebrew spelling of this family name | Changed to "דהאמשה", the standard Hebrew spelling (as for former Ra'am MK עבד אל-מאלכ דהאמשה) |
| track-record | names: "מאזן ג'נאים" (3×) differs from the Knesset's Hebrew spelling | Changed to "מאזן גנאים" |
| overview | naturalness / slight meaning drift: "religious council" was rendered "מועצת הדת" (2×), which in Israel means a municipal religious council; "general conference" was rendered "ועידת המפלגה" | Changed to "המועצה הדתית של התנועה" and "הוועידה הכללית של המפלגה" |
| overview | naturalness: "governing coalition" was rendered "קואליציה שולטת" | Changed to "קואליציה ממשלתית" |
| leadership | meaning drift: "its first-ever primary" was rendered "פריימריז ראשונים מסוגם" ("first of their kind") | Changed to "הפריימריז הראשונים בתולדותיה" |
| leadership | naturalness: typo "בוהוועדה" | Changed to "בוועדה" |
| issue-cost-of-living | meaning drift: "opposition motions" was narrowed to "הצעות אי-אמון של האופוזיציה" | Changed to "הצעות של האופוזיציה" |
| issue-crime-in-arab-society | naturalness: "תוכנית הפשיעה" ("the crime plan", taken literally) | Changed to "התוכנית למאבק בפשיעה" |
| issue-iran-and-regional-security | meaning drift: "Knesset motions and votes" was narrowed to "הצעות האי-אמון וההצבעות" | Changed to "ההצעות וההצבעות של רע"ם בכנסת" |
| issue-judicial-system | meaning drift: "linking any support to action against crime" was rendered ambiguously ("קשר כל תמיכה בפעולה …", which can read as "linked any support in action") | Changed to "קשר כל תמיכה לפעולה נגד הפשיעה" |
| issue-judicial-system | naturalness: the redundant "הסכמה על כללים מוסכמים" ("agreement on agreed rules") | Changed to "הגעה לכללים מוסכמים" |
| other-equality, track-record | naturalness/terminology: "temporary provision" was rendered "ההוראה הזמנית" (2×), not the legal term | Changed to "הוראת השעה" |
| other-arab-local-budgets (heading text) | naturalness: ungrammatical "והתוכנית החומש" | Changed to "ותוכנית החומש" (anchor unchanged) |
| other-lgbt | meaning drift: Segalovitz's first-person quote "go my own way" was put in quotation marks as a third-person paraphrase ("ילך בדרכו שלו") and was inconsistent with the leadership section | Changed to: ילך "בדרך שלי" |
| coalition | meaning drift: "while leaving the door open" was rendered as a future act ("ויותירו") | Changed to "אך השאירו את הדלת פתוחה" |
| track-record | naturalness: "בקואליציה השלטת"; "יושבי ראש לוועדת הפנים ולוועדה …" (2 fixes, same kind) | Changed to "בקואליציה" and "ראשות ועדת הפנים והוועדה …" |
| information-availability | naturalness: the English gloss "(מצע)" was carried into the Hebrew after the word "מצע" itself | Removed the duplicate gloss |

- English questioned: none
- Validation: `pnpm validate:content` passed; no error names the file ✔

## national-union-tkuma (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (15 sub-anchors and order match; the 12 option IDs match; Sources 1–105 identical in count, order, titles and URLs)
- Claims compared: ~265 · Differences found: 17 · Fixed: 17 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| overview | naturalness (×4): "ותפעל בתחומי הביטחון וב"תיקונים..."" was awkward; the Hardal gloss "החלק הדתי-לאומי המקפיד יותר" was clumsy; "7 מהם שייכים" was in the wrong tense; Strock "רשומה כמי שהוגשה מטעם" | Rewrote: "ותפעל בתחום הביטחון ולמען "תיקונים במערכת המשפט""; "החלק המקפיד יותר בקיום מצוות בציבור הדתי-לאומי"; "ו-7 מהם היו של מפלגתו"; "רשומה כמועמדת מטעם עתיד אחד" |
| leadership | meaning drift: Itam's "close to 700 reserve days" was given as "כ-700" (about) | Changed to "קרוב ל-700" |
| leadership | meaning drift: Tal moved down for "new reserved places" became "places reserved for new candidates" | Changed to "ולמקומות שמורים חדשים" |
| leadership | naturalness: Mor's forum "התנגדה לעסקות הפסקת אש חלקיות בעניין החטופים" | Changed to "לעסקות חלקיות לשחרור חטופים והפסקת אש" |
| issue-crime-in-arab-society | naturalness: the quoted Smotrich sentence had broken agreement ("חלק גדול מהרשויות... נפל... בניגוד לרצונו") | Changed to "נפלו... בניגוד לרצונן". "במגזר הערבי" kept: it is inside the quote and the English quotes "Arab sector" |
| issue-crime-in-arab-society | naturalness: closest-option gloss "סמכויות מסוג סמכויות נגד טרור" | Changed to "סמכויות כמו אלה שמשמשות נגד טרור" (matches the option's he text) |
| issue-judicial-system | naturalness: typo inside the quote, "לממשול" | Changed to "למשול" |
| issue-october-7-inquiry | glossary: "ועדה שתיבחר באמצעות הכנסת" instead of the glossary term | Changed to "ועדה שתמונה באמצעות הכנסת" |
| issue-religion-and-state | naturalness: "וממשרד לשירותי דת" (missing article) | Changed to "ומהמשרד לשירותי דת" |
| other-palestinian-authority | meaning drift: "clearance revenues" was rendered "כספי הסילוק" (wrong term) | Changed to "כספי הסליקה". The label "מעשה והצהרה" matches the English "Action and statement", so it was kept |
| track-record | naturalness: "פריט אחר פריט" | Changed to "סעיף אחר סעיף". "בוצע / לא בוצע / בוצע חלקית" is natural and was kept |
| legal | meaning drift: "in their personal capacity" was rendered "בתוקף אישיותם" ("by virtue of their personality") | Changed to "במעמדם האישי" |
| legal | citation/tag: [92] had moved from the sanctions statement to the following editorial sentence | [92] moved back after the quote, as in the English |
| information-availability | naturalness (×2): the redundant "מצע כתוב מלא (מצע)"; and "הדומיין... אירח רק דף מציין מקום", which is calqued and unnatural | Changed to "מצע בחירות כתוב ומלא לשנת 2026" and "באתר שנראה כאתר המפלגה היה רק דף ללא תוכן ממשי" |

Author flags reviewed, no change needed:
- "settler-dominated slate": the English quotes it and attributes it to Yuval Karni (Ynetnews), and the Hebrew does the same ("רשימה שנשלטת על ידי מתנחלים"). This is allowed under the quoted-and-attributed rule, so it was kept.
- Labels "שינוי לאורך זמן" (Change over time), "מצב" (Status) and "מעשה והצהרה" each match an English label. "מצב:" is used in other Hebrew files too.
- Other avoid.he terms appear only inside attributed quotes whose English counterpart is quoted: "מדינת טרור ערבית" ("Arab terror state"), "ועדה... מוטה" ("biased commission"), and "ממלכתית-לאומית" / "ועדת חקירה לאומית" (the party's words). There is no "זמני/זמנית" for "tentative": the "זמני" forms present translate "temporary/temporarily". There is no "נחקר/נחקרה/שנחקרו".
- Names: the Hebrew forms in the registry are used (סמוטריץ', פייגלין, סטרוק, רוטמן, צבי מור, the list and partner-party names). Names not in the registry match the other Hebrew files (איזנקוט, נעם סולברג, יצחק עמית, אריאל קלנר, מאי גולן, אורית סטרוק) or are the standard spellings (וולדיגר, סולומון, סוכות, אוהד טל, איתמר איתם, יצחק זגה, רעות בן חיים, יוסי בכר, יובל קרני, סלים ג'ובראן, ג'יי די ונס). "האיחוד הלאומי – תקומה" uses an en dash where the registry has a hyphen. The quoted registered name keeps the hyphen, and other Hebrew files use the en dash, so this was left as is.
- Validation: no error names the file ✔ (`pnpm validate:content` passed)

## shas (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (9 sections and 18 sub-sections, same order; issue headings match each issue's `he.title`)
- Citations: the `[n]` sequence matches line by line; Sources lists identical (102 entries, same order and URLs) ✔ · Evidence-tier tags identical on every bullet (32 Action, 22 Statement, 6 Formal commitment, 4 Contradiction, plus Change over time and Background) ✔ · Option IDs on every "closest option(s)" line identical ✔ · No `avoid.he` terms; no "נחקרה/שנחקרו" ✔
- Claims compared: 351 (344 sentences plus 7 track-record table rows) · Differences found: 45 · Fixed: 45 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| overview | Meaning drift: Deri "who was not a minister" rendered in the present tense ("שאינו שר") inside a past-tense passage | "שלא כיהן כשר" |
| overview | Naturalness (4): "בהחלטות גדולות"; "חולים בבתי חולים"; a quote rendered "לא סיפקה את החוק" (calque of "failed to deliver"); "major" | "בהכרעות מרכזיות"; "מאושפזים בבתי חולים"; "נכשלה בהעברת החוק" |
| leadership | Meaning drift (2): "acting Interior/Health Minister" rendered "שר ... בפועל", which reads as "de facto minister" | "ממלא מקום שר הפנים/הבריאות" |
| leadership | Naturalness (3): "ובכאן דווח" (Kan was unrecognizable as the broadcaster's name); a clumsy "קבעה בניגוד לעמדתו ... כשהשאירה"; a grammar error "חברי הכנסת ותיקים" | "ותאגיד השידור כאן דיווח"; "וגברה על עמדתו של דרעי בשיבוץ אחד לפחות: היא השאירה..."; "הוותיקים" |
| issue-haredi-enlistment | Meaning drift (3): Bismuth said yeshiva students "should be allowed to" keep studying, rendered "צריכים להמשיך ללמוד"; the bill "increasing enlistment, according to its supporters" rendered as a completed past fact ("הגדילה"); "the law's text ran until" rendered "נוסח החוק היה בתוקף עד" | "יש לאפשר ל..."; "תוך הגדלת הגיוס, לדברי תומכיה"; "לפי נוסחו, החוק היה אמור לחול עד" |
| issue-religion-and-state | Meaning drift: "ritual-bath attendants" (both genders) rendered with the feminine form only ("בלניות") | "בלנים ובלניות במקוואות" |
| issue-religion-and-state | Citation/tag: "joint statement" rendered "הצהרה משותפת" inside a Statement-tagged bullet, the same word as the tag | "הודעה משותפת" |
| issue-religion-and-state | Naturalness: "התנגדו היסטורית" | "התנגדו לאורך השנים" |
| issue-judicial-system | Meaning drift: the court "struck out" the Shas petition, rendered "דחה" (dismissed) | "מחק" |
| issue-october-7-inquiry, issue-judea-samaria | Meaning drift (4): failed votes ("failed 51–53", "14–66", "32–56", "8–45") rendered "נכשלה ברוב של X מול Y", which implies the losing side was a majority | "נכשלה, X מול Y" |
| issue-gaza | Naturalness: misspelled "ויכנס" in a quote | "וייכנס" |
| issue-iran-and-regional-security | Glossary: Hezbollah gloss "הנתמך בידי איראן" differs from the mandatory glossary wording | "ארגון הטרור בלבנון שאיראן תומכת בו" |
| issue-judea-samaria, information-availability | Citation/tag (3, raised by the author): "Knesset declaration" / "non-binding declaration" / "a declaration vote" rendered "הצהרה", the same word as the Statement tag, inside an Action bullet and on the closest-option line | "הצעה לגילוי דעת" / "גילוי דעת לא מחייב" / "הצבעה על גילוי דעת" (the closest-option line also kept "co-submitted and voted for": "הייתה בין מגישי ... והצביעה בעדו") |
| issue-cost-of-living | Naturalness (5): gender error "שר הרווחה מרגי תמכה"; misspelled "בעקרון" (×3, in two quotes and the track-record table) | "תמך"; "בעיקרון" |
| other-temple-mount | Naturalness: misspelled "ככוונים" | "כמכוונים" |
| coalition | Meaning drift: Eisenkot's reply on "universal service" rendered "גיוס אוניברסלי" (universal draft) | "שירות אוניברסלי" |
| legal | Meaning drift: label "Candidate challenge" rendered "ערעור על מועמד" (appeal); the matter was a request to strike a candidate | "בקשה לפסילת מועמד" |
| legal | Naturalness (13): "Status:" rendered "מעמד:" (×7; it reads as a person's standing; raised by the author); "הורשע בלקיחת שוחד שביצע"; "מושב החורף ... של המושב השלישי" (the Knesset's term is "כנס"); "איבוד שכר" (×2); organization name "הידוש" (garbled transliteration of Hiddush); "קבוצת עתים" | "מצב ההליך:"; "הורשע בשוחד, עבירה שביצע..."; "כנס החורף/הקיץ"; "שלילת שכר"; "חידוש"; "ארגון עתים" |
- Author's flags reviewed: "שינוי לאורך זמן" and "רקע (לפני 2021):" are faithful to the EN labels; no change needed. "מעמד:" was changed (see above). "הצהרה" for the Knesset declaration was changed to "גילוי דעת" (see above). "גיוס אוניברסלי" was changed to "שירות אוניברסלי" to match the EN "universal service". "באופן זמני" for "temporarily" is correct (it is not "tentative") and was kept. "השיג" is used for "secured", and the council is "מועצת חכמי התורה" throughout.
- English questioned: none. The Iran "Closest option(s)" line having no [n] is consistent with the Gaza and other summary lines, which restate cited bullets. Yinon Azoulay "from seventh to second place" does not conflict with anything else in the document, and both languages match.
- Validation: no error names the file ✔ (`pnpm validate:content` exits 0)

## blue-and-white (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (same 33 anchors, same order; issue sub-headings match each issue's `he.title`)
- Citations: the `[n]` sequence is identical across the whole body ✔; Sources list identical (87 entries, same order, same titles and URLs) ✔; closest-option IDs identical ✔; frontmatter matches except `lang` ✔; dates day first ✔; no "נחקרה/שנחקרו" (the only "נחקרו" is Fifth Dimension employees "questioned under caution") ✔
- Claims compared: ~300 · Differences found: 17 · Fixed: 17 · Unresolved: 0
| Anchor | Difference | Resolution |
|---|---|---|
| overview | Naturalness (2): English glosses left in the Hebrew: "חוסן לישראל" (Israel Resilience) and "המכון הישראלי לדמוקרטיה (מכון IDI)" | Removed both glosses |
| overview | Naturalness: heading "מספר המושבים הנוכחי" is a literal rendering of "Current seats" | Changed to "מספר חברי הכנסת כיום" |
| overview | Meaning drift: "תושבי הצפון ויישובים סמוכים לרצועת עזה" read as if candidates include communities, not residents of communities near Gaza | Changed to "תושבי הצפון ותושבי היישובים הסמוכים לרצועת עזה" |
| issue-cost-of-living, other-reservists | Meaning drift (2): ארנונה glossed as "מס רכוש עירוני". In Hebrew, מס רכוש is a different tax, and ארנונה needs no gloss | Removed the gloss in both places |
| issue-gaza | Naturalness: ungrammatical "ישראל אסור שתאפשר להתהוות של איומים" | Changed to "אסור לישראל לאפשר היווצרות של איומים…" |
| issue-gaza (closest) | Meaning drift (strength): "he has said there should be no Israeli settlement" was rendered "אמר שאסור שתהיה" (must not) | Changed to "אמר שלא צריכה להיות התיישבות ישראלית בעזה". Checked the rest of the flagged sentence: "תמיכתו בפברואר 2025 בהעברה מרצון חולקת מרכיב אחד עם `resume-fighting-full-control`" says exactly what the English says ✔ |
| issue-iran-and-regional-security | Naturalness: same ungrammatical "ישראל אסור שתאפשר התהוות" | Changed to "אסור לישראל לאפשר היווצרות של איומים…" |
| other-nation-state-law | Meaning drift and naturalness (4): the heading "שוויון בחוק יסוד: ישראל כמדינת הלאום של העם היהודי והקהילה הדרוזית" could be read as "the nation-state of the Jewish people and the Druze community". The full statute name was also repeated where the English uses the short name | Heading changed to "שוויון בחוק הלאום והקהילה הדרוזית". The definition line now gives "חוק הלאום (חוק יסוד: ישראל – מדינת הלאום של העם היהודי)", and later mentions use "חוק הלאום" |
| other-arab-parties | Loaded wording: "the security decisions ahead" was rendered "שעומדות לפנינו" (first person, "before us") | Changed to "ההחלטות הביטחוניות הצפויות" |
| other-governance | Naturalness: heading "שלטון וכהונות מוגבלות" | Changed to "משילות והגבלת כהונה" |
| coalition | Meaning drift: "must be 'returned to the political margins'" (passive) was rendered "צריכים 'לחזור לשוליים'" (they should go back) | Changed to "צריכים 'להיות מוחזרים לשוליים הפוליטיים'" |
| coalition | Naturalness: gender agreement error "שלושה מערכות בחירות" | Changed to "שלוש מערכות בחירות" |
- Checked, no change (author flags and rulings):
  - "המשתמטים" (coalition, 20 September 2026): it sits inside quotation marks and is attributed ("מפלגתו אמרה…"). The English quotes and attributes the same words ("the draft dodgers"), so it is allowed under the ruling ✔.
  - "פנינה תמנו-שטה": the registry's `he` is "פנינה תמנו", but the English writes the longer name "Pnina Tamano-Shata" throughout, and so does the registry's own `en`. Decision: keep "תמנו-שטה" for parity with the English.
  - "Dated background" as "רקע מתקופה קודמת": the meaning is equivalent and the wording is neutral. Kept.
  - "Tentatively" as "בהסתייגות": not "זמני/זמנית". Kept.
  - No `avoid.he` term appears anywhere else. The glossary `he` forms are used (צה״ל, השב״כ, מעצר בלי משפט, החלת ריבונות ישראלית, ועדת חקירה ממלכתית, גושי ההתיישבות, הרבנות הראשית and others).
  - "Change over time" is "שינוי לאורך זמן" ✔.
- Validation: no error names the file ✔ (the remaining errors concern other parties' files)

## amcha-yisrael (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 35 anchors in the same order; frontmatter matches except `lang: he`)
- Claims compared: ~250 · Differences found: 37 · Fixed: 37 · Unresolved: 0
- Checked line by line by script and by reading: `[n]` citations identical on every line, option IDs identical on every "closest option(s)" line, evidence-tier tags identical, Sources list identical (69 entries, same order and URLs), numbers and dates match. No "נחקרה"/"שנחקרו". Dates are day first.

| Anchor | Difference | Resolution |
|---|---|---|
| overview | meaning drift: "residents of settlements" rendered "תושבי יישובים" (reads as "residents of towns") | → "תושבי ההתיישבות" (glossary term) |
| overview | naturalness (6): Hebrew gloss of a Hebrew name ("בתרגום חופשי"); "לשעבר מפקד"; clumsy "ונעשה צעד שהיה נגד לחצו"; "פיזור סמכויות"; "בוחרים לראשונה"; "Ynet, שהעתיק" | Reworded: "השם מתפרש בערך כ…"; "מפקד לשעבר"; "והיה בניגוד ללחץ… על מפלגות הימין הקטנות להתמזג"; "ביזור"; "בוחרים חדשים"; "כפי שדיווח Ynet, שהביא את נוסח הודעת הוועדה" |
| leadership | dropped/added claim (2): "elite" (Sayeret Matkal, Maglan) dropped; Bodnero described as in "אגף התקציבים", a detail the English doesn't give | Restored "ביחידות העילית"; Bodnero → "כלכלן שעסק בעבר בתקציב הבריאות במשרד האוצר" |
| leadership, track-record | meaning drift (2): Eli called a city ("מהעיר עלי"); Ben Zion's "acting head" rendered "מנהל אותה בפועל" (de facto runs it), in 2 places | → "מהיישוב עלי"; "ממלא מקום ראש המועצה" (both places) |
| leadership | names (5): candidate names not in the registry checked against the CEC list [1] (rendered image) and the party's team page [4]: "לאלי דראי"/"סעדיה יעקב דראי" → "ללי דרעי"/"סעדיה יעקב דרעי"; "אלי גינו" → "אלי ג'ינו"; "עלאם איבראהים" → "עלם איברהים" (party page; the CEC lists "אבראהים עלמאדין", and the party form matches the English "Alam Ibrahim"); "משה הר-ציון" → "משה הר ציון". Others (בודנרו, דוידי בן ציון, אביב עזרא, סיגל קראוניק-עטיה, אריק מת'יו רובין, לילך אידלברג, משה טולדנו, רז מלכה, דור יצחק לוי) match the sources/English and need no change. No other Hebrew research file mentions these people. | Fixed |
| leadership, other-service-rewards | naturalness/register (3): slang "תנועת מילואימניקים" (2 places); "שהשתדלנות שלה בכנסת (הלובי)"; "בגיוס לשירות הציבורי" (ambiguous with military enlistment) | → "תנועת משרתי המילואים"; "שהשדולה שלה בכנסת"; "בקבלה לעבודה בשירות הציבורי"; "נגמ"ש" → "הנגמ"ש" |
| issue-haredi-enlistment, coalition | glossary/registry names (2): "גולדקנופף" in body text (registry: "יצחק גולדקנופ"); "יוליה מלינובסקי" (registry: "יוליה מלינובסקי קונין") | Body text uses the registry forms; the source title in Sources #33 is unchanged |
| issue-crime-in-arab-society | meaning drift: "gives no support to `invest-in-arab-communities-first`" rendered "ואינה תומכת" (could read as opposition) | → "ואין בעמדתה תמיכה ב…" |
| issue-gaza, information-availability | meaning drift (2): "unnamed former official" rendered "שלא נקבע שמו" ("whose name was not decided") | → "גורם לשעבר אחד שלא נחשף שמו" (both places) |
| issue-gaza | naturalness: "אויב ששופך מלחמה" | → "אויב שיוצא למלחמה נגד ישראל" |
| issue-haredi-enlistment | naturalness (2): broken quote syntax 'שמי ש"אינם…"'; "עימתו אותו" | → 'וש"מי שלא משרתים, לא לומדים ולא תורמים לא ייהנו מהטבות"'; "התעמתו איתו" |
| issue-iran-and-regional-security, issue-judea-samaria | naturalness (2): "המיפוי הוא בהסתייגות"; "כפי שנשלף לצורך המחקר" | → "המיפוי נעשה בהסתייגות"; "כפי שנבדק לצורך מחקר זה" |
| issue-judicial-system | meaning drift: "the attorney general" rendered "הייעוץ המשפטי לממשלה" (the advisory system) | → "היועץ המשפטי לממשלה" (glossary) |
| other-security-doctrine | meaning drift: "suspected attack" on the flydubai flight softened to "תקרית חשודה"; naturalness: "דורכים ברגל" for "stamping their feet" | → "חשד לתקיפה של טיסת פליידובאי בדרכה לישראל"; "רוקעים ברגליים" |
| other-periphery-local-government | meaning drift: "calls strengthening border areas 'a national and security goal'" rendered "קוראת לחיזוק…" (calls *for*) | → "מגדירה את חיזוק אזורי הגבול 'יעד לאומי וביטחוני'" |
| coalition | naturalness (4): "ואותו בלבד נמליץ"; "הדמוקרטים משמאל"; "61st finger" gloss "הקול שנותן לממשלה את רוב החברים"; tense "לא רצה" in reported speech | → "ורק עליו נמליץ"; "מפלגת השמאל הדמוקרטים"; "הקול שמעניק לממשלה את הרוב"; "לא רוצה" |
| legal | naturalness: "בלי אישור במסלול המתאים" | → "בלי אישור בערוצים המקובלים" |

- Flags from the author were reviewed: "עריק" (other-governance) refers to the legal status of one specific person, and the English uses "deserter" in the same place, so it is kept. "מתפרעים חרדים קיצוניים" sits in quotation marks and is attributed to Winter ("שמה שכינה"), where the English quotes "extremist Haredi rioters", so it is kept. "Public diplomacy" is rendered consistently as "הסברה", once as "דיפלומטיה ציבורית (הסברה)", and "public-diplomacy system" in the founding-document quote as "מערך דיפלומטיה והסברה", so all are kept. "temporary truces" → "הפסקות אש זמניות" is "temporary", not "tentative", so it is kept. Every "Tentative" mapping is "בהסתייגות".
- Note for the orchestrator (not unresolved): the CEC list [1] gives No. 13 as "אבראהים עלמאדין" (Alamaddin), while the English "Alam Ibrahim" follows the party's site. The Hebrew follows the English and the party's site.
- Validation: no error names the file ✔ (remaining errors concern other parties' unfinished Hebrew files, e.g. jewish-national-front)
- Re-check after owner corrections (01f1991, 13 October 2026): pass. No. 13 is now EN "Alamaddin Ibrahim" / HE "עלמאדין אבראהים" in the 12–18 line, matching the committee's list [1] ("אבראהים עלמאדין", family name first) with the given name first like the other entries; the rest of the line is unchanged in both. The candidate is not in the registry; no "Alam Ibrahim" or "עלם איברהים" remains in either edition. This settles the note for the orchestrator above. `pnpm validate:content` passed.

## yesh-atid (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (9 sections, same order; issue sub-anchors identical)
- Citations: per-line `[n]` sequences compared in order on all 272 non-empty lines; identical, including order inside each claim ✔. Sources: 114 = 114, same order, same titles, same URLs ✔. Option IDs on every "closest option(s)" line: identical ✔. Evidence-tier tags: same tags on the same claims ✔.
- Claims compared: ~312 (sentences) · Differences found: 26 · Fixed: 25 · Unresolved: 0 (the English question was resolved by the owner in commit 01f1991)
| Anchor | Difference | Resolution |
|---|---|---|
| track-record | glossary: "Equal Service law" rendered "חוק השוויון בנטל". The glossary treats "שוויון בנטל" as one camp's slogan | Now "חוק השוויון בשירות", which says what the English says. Lapid's May 2013 quote "יהיה שוויון בנטל" (#issue-haredi-enlistment) is kept: it is in quotation marks and attributed, and the English quotes the same words |
| leadership | naturalness/term: "Northern Corps" rendered "הקורפוס הצפוני" (the author's guess; the term is not used in Hebrew) | Now "הגיס הצפוני" (the standard Hebrew word for a corps) |
| leadership, issue-judea-samaria | glossary: avoid.he terms "חוק השתמטות מתועב" (Tibon) and "מדינת טרור" (Lapid) | Kept. Both are in quotation marks and explicitly attributed, where the English quotes the same words. This follows the standing ruling ✔ |
| issue-october-7-inquiry, issue-judea-samaria, issue-religion-and-state, track-record | naturalness/meaning: 10 failed votes written as "נדחתה/נדחו ברוב של X–Y". This says the losing side had the majority | 10 fixed: now "נדחתה ב-X קולות מול Y" (for–against order unchanged) |
| issue-iran-and-regional-security | meaning drift: "pursue normalization with Saudi Arabia" rendered "להמשיך בנורמליזציה" (implies normalization already exists) | Now "לחתור לנורמליזציה" |
| issue-haredi-enlistment, other-early-childhood | meaning drift (small): "those who serve" rendered in the past tense ("ששירת/ששירתו") | 2 fixed: "למי שמשרתים", "משרתים אחרים" |
| overview, leadership, issue-housing, track-record | naturalness: 9 fixes. "היסטוריה בחירתית" → "היסטוריה בבחירות"; redundant "ביחד (B'Yachad / ביחד)" → registry name "ביחד בראשות נפתלי בנט"; "אותיות ההצבעה" → "אותיות הפתק"; "בהנהגתו" → "בראשותו"; "ראש ממשלה במעבר" → "ראש ממשלת מעבר"; added the missing verb "נמצא" in "לפיד במקום ה-2"; the candidate-list note "מסומן כמספר" was rewritten; "תוכנית מקומית" → "תוכנית מתאר מקומית"; the founding sentence about the leadership contest was smoothed | Fixed |
| track-record | naturalness/added title: "Voted against the Torah study basic law" rendered as if it were an official title ("חוק יסוד: לימוד תורה") | Now "חוק היסוד בעניין לימוד תורה" |
| overview | English questioned: "Two related episodes are relevant:" is followed by three bullets. The third bullet (the 2020 Blue and White split) is a different kind of episode (Yesh Atid's earlier joint list, not these two partners), so the count or the framing in the English looks wrong | Resolved by the owner (01f1991, decision 6 in research/review/hebrew-english-questioned.md): English now "Three earlier episodes are relevant:", Hebrew "שלושה אירועים קודמים רלוונטיים:". Hebrew matches the new English |
- Rulings checked: no "נחקרה/שנחקרו"; no "זמני/זמנית"; no "ממלא מקום" needed; no Latin acronyms in prose (OECD is spelled out in Hebrew). Outlet names (The Times of Israel, Ynet, Ynetnews, Jerusalem Post, PBS) are left in Latin script as proper names; "PBS" is the only Latin acronym and was left unchanged as an outlet name. Area letters A/B/C follow the glossary ("שטח C"). Dates are day first throughout.
- Not changed: candidate names that are not in the registry (נאור שירי, יוראי להב הרצנו, יסמין סקס פרידמן, נטע אטיאס and others). The registry names that do appear (top 5 of the list, party names, the CEC filing name) match. The feminine form "מנהלת הסיעה" for Neta Attias cannot be checked against the English, which does not mark gender; left as is.
- Validation: no error names the file ✔
- Re-check after owner corrections (01f1991, 13 October 2026): pass. EN "Three earlier episodes are relevant:" = HE "שלושה אירועים קודמים רלוונטיים:" (count, "earlier" = "קודמים", colon); nothing else in the overview changed; the three bullets are unchanged in both. `pnpm validate:content` passed.

## jewish-national-front (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 9 sections and all 15 sub-section anchors, same order; issue headings match `he.title`)
- Sources list: identical ✔ (90 entries, same order, same titles and URLs; byte-identical). `[n]` sequence: identical across the whole body ✔. Option IDs on all "closest option(s)" lines: identical ✔ (11 IDs).
- Claims compared: ~365 (sentence level, all sections) · Differences found: 20 · Fixed: 20 · Unresolved: 0

| Anchor | Difference | Resolution |
|---|---|---|
| overview | naturalness: Latin transliteration "(Hazit Yehudit Leumit)" and English gloss "("Jewish Power")" left inside Hebrew prose (2 items; aids for English readers only, no claim) | Removed |
| overview | naturalness: "חסרו בהן חתימותיו של שליש" (wrong possessive) | "חתימות של שליש מחברי הוועדה" |
| issue-* (9 sub-sections) | citation/tag: closest-option tag written "**האפשרות הקרובה:**" instead of the mandated "**האפשרות/ות הקרובה/ות:**" (9 lines) | Replaced in all 9 |
| leadership | meaning drift: Gotliv para, "has said it will ask for the Justice Ministry" rendered "תדרוש" (stronger) | "תבקש" |
| leadership, issue-housing | meaning drift: Wasserlauf's ministry rendered "(המשרד) לפיתוח הנגב, הגליל והחוסן הלאומי", adding "development" not in the English "Negev, Galilee and National Resilience" (2 places) | "השר/המשרד לנגב, לגליל ולחוסן הלאומי" |
| leadership | meaning drift: Eliyahu "suggested that dropping a nuclear bomb on Gaza was within the realm of possibility" rendered "אמר ש...היא אחת האפשרויות" (stronger) | "רמז ש...היא בגדר האפשר" |
| leadership, legal | glossary/ruling: Latin acronym "ה-AP" in prose (2 places) | "סוכנות הידיעות" / "סוכנות הידיעות Associated Press" |
| issue-gaza | meaning drift: "conditional on international participation" rendered "שיתוף פעולה בינלאומי" | "בתנאי שתהיה השתתפות בינלאומית" |
| issue-iran-and-regional-security | naturalness: "שישראל "אסור לה להסתפק..."" (quote spliced into broken syntax) | "שאסור לישראל "להסתפק..." ואסור לה "לסגת..."" (quoted words unchanged) |
| issue-judicial-system | meaning drift: "Supreme Court Deputy President" rendered "המשנה לנשיאת" (adds a gender for the President that the English does not state) | "המשנה לנשיא בית המשפט העליון" (the title's standard form) |
| issue-judicial-system | naturalness: "החזרת דרישות העמידה" (calque) | "החזרת כללי זכות העמידה" |
| issue-haredi-enlistment | meaning drift: "Ynet survey of parties' enlistment plans" rendered "סקר של ynet" (2 places); in Hebrew "סקר" reads as an opinion poll and sits next to a date, which the English does not mean. No figure is involved in either language | "(בתשובה ל)פנייה של ynet בספטמבר 2026, שביקשה מהמפלגות את תוכניותיהן בנושא הגיוס" |
| issue-haredi-enlistment | glossary/meaning drift: "gradual enlistment by agreement" rendered "שילוב הדרגתי בצבא" | "גיוס הדרגתי בהסכמה" (glossary: גיוס) |
| issue-housing, issue-cost-of-living | naturalness: "פלטפורמה" for "platform" (2 places) | "מצע" |
| issue-religion-and-state | naturalness: "יהודים נאסרו בתפילה שם" | "נאסר על יהודים להתפלל שם" |
| coalition | naturalness/tag: track-record tags "**קוים:**" / "**קוים בחלקו:**" (ambiguous spelling, reads as "lines") | "**קוימה:**" / "**קוימה בחלקה:**" |
| coalition | meaning drift: "approved it ... over the votes of the three Otzma Yehudit ministers" rendered "חרף הצבעתם" (doesn't say they voted against) | "אף ששלושת שרי עוצמה יהודית הצביעו נגד" |
| track-record | naturalness: typo "לא אוששר" | "לא אושש" |
| legal | meaning drift: "200 hours of community service" rendered "200 שעות עבודות שירות" (עבודות שירות is a different sentence, counted in months) | "200 שעות של שירות לתועלת הציבור". The 2004 "three months of community service work" kept as "עבודות שירות" (months, so it fits) |
| legal | naturalness: "ובן גביר נאסר לדבר" and "השניים הוטלו עליהם סנקציות" (ungrammatical, 2 items) | "ונאסר על בן גביר לדבר" / "שעל השניים הוטלו סנקציות" |

Points the author flagged:
- Gotliv's name "טלי (רויטל) גוטליב": kept. The English itself writes "Tally (Revital) Gotliv" (everyday name first, legal name in brackets), so the Hebrew mirrors it. The registry form "רויטל טלי גוטליב" is the CEC filing order. Both forms contain the same names. Elsewhere "טלי גוטליב" / "גוטליב" match the English "Tally Gotliv" / "Gotliv".
- "הנוכל בנט": kept. It is inside quotation marks, attributed to Ben Gvir, and translates the same words the English quotes ("the fraud Bennett").
- "Ynet survey": changed (see table row). No figure in either language.
- "ועדה חוקרת בעלת סמכויות חקירה פליליות": kept. It is a faithful, neutral rendering of "investigative committee with criminal investigative powers", and it doesn't clash with any glossary term ("ועדת חקירה ממלכתית" would be wrong here).
- 12 October 2026 dates vs researchedAsOf 2026-10-07: not a parity difference. The Hebrew carries the same dates. In the English this reads as a later fact-check pass (sources 82–84, 88, 89 accessed 2026-10-12), and "as of" statements carry their own dates. I don't judge the English wrong, but the owner may want researchedAsOf bumped if later checks should count as the research date. Not counted as unresolved.
- Source 78 vs body "25–24": consistent. Source 78 says "25 for, 24 against, 1 present not voting", and the body's 25–24 is for–against. Not counted.
- Owner's wording rule: the Hebrew never says the party "נחקרה" / "שנחקרו". The "נחקר" forms that remain refer to people questioned by police or quoted speech ✔. No "זמני/זמנית" for "tentative" (the remaining "שקט זמני" and "עובדים זמניים" translate "temporary"). "נדחתה" is used for failed votes. "שינוי לאורך זמן" ✔. avoid.he terms appear only inside attributed quotes that match the English ("הסיפוח" in Ben Gvir's "what about annexation?"; the party's "national" framework) ✔. Dates are day first ✔.
- English questioned: none.
- Validation: no error names the file ✔

## hadash (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 29 headings, same order; issue headings match `he.title`)
- Sources: 136 entries, identical count, order, titles and URLs ✔ · `[n]` citations identical on every line ✔ · closest-option IDs identical ✔ · evidence-tier tags identical ✔
- Claims compared: ~320 (sentence/clause level, every paragraph and bullet) · Differences found: 22 · Fixed: 21 · Unresolved: 0 (the English question was resolved by the owner in commit 7451c62)
| Anchor | Difference | Resolution |
|---|---|---|
| leadership | English Faten Ghattas bullet says "he holds a doctorate… and directs" then "chose her"; the registry and the rest of the English treat Ghattas as a woman. Hebrew uses feminine throughout ("בעלת דוקטורט ומנהלת"). | Resolved by the owner (7451c62, decision 1 in research/review/hebrew-english-questioned.md): English now "she holds a doctorate". Hebrew was already feminine ("בעלת דוקטורט ... ומנהלת", "בחרה בה") and matches the new English |
| overview | naturalness (2): "ברובם של המקרים" → "לרוב"; "אין משא ומתן מתנהל" → "אין כרגע משא ומתן" | Fixed |
| issue-cost-of-living | naturalness (2): typo "ששלמות" → "שמשלמות"; ambiguous "הצבעותיה" (could read as the Joint List's) → "ההצבעות והצעות החוק של חד"ש" | Fixed |
| issue-gaza | meaning drift (2): "Throughout the war" was "במהלך המלחמה" → "לאורך כל המלחמה"; Odeh quote "end the war on Gaza" was "המלחמה בעזה" → "המלחמה על עזה". naturalness (1): ungrammatical "כשההפסקת אש" → "כשהפסקת האש" | Fixed |
| issue-haredi-enlistment | naturalness (2): "המפלגה הקומוניסטית של ישראל" → "הישראלית" (consistent with the rest of the file); "ההתאמה בהסתייגות משום ש" → "ההתאמה היא בהסתייגות, משום ש" | Fixed |
| issue-iran-and-regional-security | meaning drift (1): "the war with Iran" was "המלחמה באיראן" → "המלחמה עם איראן". naturalness (2): "בשם" → "שכותרתה" (statement title); "קווי טרום 1967" → "הקווים שלפני 1967" (in line with the glossary's pre-1967 term) | Fixed |
| issue-judea-samaria | naturalness/glossary (1): "קווי טרום 1967" → "הקווים שלפני 1967". Checked and kept: "settlers" = "מתיישבים" (neutral form of the glossary's יישובים/התיישבות, not "מתנחלים"); July 2024 "resolution" = "החלטת הכנסת"; July 2025 "motion" = "גילוי דעת"; failed vote "ברוב של 47 מול 9" | Fixed |
| other-palestinian-state | naturalness (1): quote "זכאי לזכות להגדרה עצמית" → "ראוי לזכות להגדרה עצמית" ("deserve the right") | Fixed |
| other-bedouin-negev | meaning drift (1): "where the community of Dror is planned" was "שבמקומו" (in its place) → "שבשטחו מתוכנן היישוב דרור" | Fixed |
| coalition | meaning drift (1): Odeh quote "to remove Netanyahu" was "להפיל" (bring down) → "להוריד את נתניהו" | Fixed |
| track-record | meaning drift (1): "led and joined" attached only to the crime protests; the anti-war protests read as a dangling item → restructured so both cover crime protests (2026) and anti-war protests (2025) | Fixed |
| legal | naturalness (1): "חשבון פוליטי" → "חיסול חשבונות פוליטי"; dropped/added claim (1): "בהאג" added to the ICJ name, not in English → removed | Fixed |
| information-availability | naturalness (2): "המפלגה הקומוניסטית של ישראל" → "הישראלית"; "הותאמו לדיווחים" → "הוצלבו עם דיווחים" | Fixed |
- Also checked and correct as flagged by the author: Cassif's "הפיכה פשיסטית במלוא עוזה" stays quoted and attributed; "כיבוש" appears only in attributed phrasing ("מה שכינה הכיבוש") and in a source title; the attorney general is feminine for the incumbent; "Tentative" = "בהסתייגות" (no זמני/זמנית); failed votes put the majority first; names match the registry (פאתן ג'טאס, יוסף ג'בארין, אלתג'מוע אלווטני אלדמוקרטי); no "נחקרה/שנחקרו"; no avoid.he term (the only hit, "שחורים", is part of the proper name "הפנתרים השחורים"); no Latin acronyms in prose; dates day first.
- Validation: no error names the file ✔ (the 4 remaining errors are all about research/he/byachad-bennett.md)
- Re-check after owner corrections (7451c62, 14 October 2026): pass. EN "she holds a doctorate in political science and directs" = HE "בעלת דוקטורט במדעי המדינה ומנהלת"; the name matches the registry (פאתן ג'טאס / Faten Ghattas); the Hebrew is unchanged and needs no change. `pnpm validate:content` passed.

## yisrael-beytenu (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (frontmatter identical except `lang: he`; issue headings match each issue's `he.title`)
- Claims compared: 277 prose claims + 89 source entries · Differences found: 29 · Fixed: 29 · Unresolved: 0
- Every line has the same numbers and the same `[n]` citations as the English, and the same evidence-tier tags. The Sources list is identical (89 entries, same order, same URLs). Option IDs on all 10 closest-option lines are identical.

| Anchor | Difference | Resolution |
|---|---|---|
| overview | Naturalness: the Hebrew kept the English gloss `(באנגלית "Israel Our Home")`, a translation of the party name that is redundant for Hebrew readers | Removed |
| overview | Naturalness: in the Ballot paragraph the Hebrew list name was repeated as its own parenthetical gloss | Removed the duplicate parenthetical |
| overview | Meaning drift: "the people who serve in the IDF" was translated "ששירתו" (past tense) | Changed to "שמשרתים" |
| leadership | Naturalness: misspelling "גוף היעוץ" | Changed to "גוף הייעוץ" |
| leadership | Meaning drift (name): the No. 5 heading read "יוליה מלינובסקי קונין", while the English and the rest of the Hebrew file use "Yulia Malinovsky" / "יוליה מלינובסקי" | Changed to "יוליה מלינובסקי" for internal consistency. Note: amcha-yisrael.md uses "מלינובסקי קונין" |
| issue-haredi-enlistment | Naturalness: two grammar errors ("אחד מהדרישות", "לבחירות שנייה") | Changed to "אחת הדרישות" and "לבחירות שניות" |
| issue-haredi-enlistment | Meaning drift: the English says "evading service"; the Hebrew "הימנעות" is softer | Changed to "התחמקות משירות" (the avoided term "השתמטות" was not used) |
| issue-haredi-enlistment | Meaning drift: "draft law" (a conscription law) was translated "טיוטת חוק" (a draft bill), and "equitable" as "הוגנת" | Changed to "חוק גיוס "מקיף, רחב ושוויוני"" |
| issue-judea-samaria | Naturalness/convention: a passed vote was given as "25 מול 24" without "ברוב של" | Changed to "ברוב של 25 מול 24" |
| issue-judea-samaria | Meaning drift: "security and administrative responsibility" was translated "ביטחונית ואזרחית" | Changed to "ביטחונית ומנהלית" |
| issues, other-death-penalty, track-record, information-availability | Naturalness: "final reading" was translated "בקריאה האחרונה" (8 instances) | Changed to the standard Knesset term "בקריאה השלישית" (8 fixes) |
| issue-religion-and-state | Naturalness: "they do not decide the line below" was translated "אינן קובעות את הקביעה שלהלן", and the kashrut bullet had a dangling modifier ("כשר האוצר, חוק ההסדרים…") | Rewrote both sentences with the same meaning (2 fixes) |
| issue-cost-of-living | Naturalness: misspelling "שאיפשר" | Changed to "שאפשר" |
| issue-cost-of-living | Meaning drift: "excise tax on coal" was translated with the generic "המס" | Changed to "הבלו על הפחם" |
| other-aliyah-seniors | Loaded wording: the heading used "קשישים" for "senior citizens" | Changed to "אזרחים ותיקים", the neutral term already used elsewhere in the file |
| other-reservists | Meaning drift: "those who serve" was translated "מי ששירתו" (past tense) | Changed to "מי שמשרתים" |
| other-lgbt | Naturalness: a subject-verb agreement error ("ותמכה" with plural MKs), and the tag "**מידע מוגבל.**" was followed by a sentence fragment | Changed to "ותמכו" and "המידע על עמדתה הנוכחית של המפלגה מוגבל." (2 fixes) |
| coalition | Naturalness: "rejecting a proposal" was translated "סירב להצעה" | Changed to "דחה הצעה" |
| legal | Naturalness: "has not been named a suspect" was translated "לא נקרא חשוד" | Changed to "לא הוגדר חשוד" |

- Checked with no change needed:
  - Ma'ale Adumim: the English gives 31 to 9 (Knesset record) and 32 to 9 (Times of Israel), each attributed. The Hebrew matches, so the English is not self-contradictory.
  - Death-penalty "Contradiction": the English says "six of its MKs" (not "all") on 13 October 2021, and "seven" voted on 28 July 2021. This is consistent within the document, so the English is not questioned.
  - Glossary avoid-terms appear only inside attributed quotes that match the English quotes: "בין ציונות להשתמטות", "ועדה פוליטית" (twice) and "כפייה דתית". "ברירת המחדל" is a false positive.
  - Failed votes give the majority first, and passed votes use "ברוב של X מול Y".
  - "אקורד סיום צורם ומריר במיוחד" is the original Hebrew wording of the same quote, as shown in source [36]'s title. It was kept.
  - No "נחקרה"/"שנחקרו", no "זמני/זמנית", and no Latin acronyms in the prose (Ynet and Ynetnews are outlet names). Dates are day first. Registry names are used for all parties and leaders.
- Validation: no error names the file ✔ (the only errors concern research/he/byachad-bennett.md, which another agent is working on)

## new-economic-party (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 9 sections and all 30 issue/other-position anchors, same order)
- Claims compared: ~282 sentence-level claims in 145 paragraphs/bullets, plus 75 sources · Differences found: 21 · Fixed: 21 · Unresolved: 0
- Citations: same `[n]` on every line (checked line by line, in order); Sources list identical (75 entries, same order, titles and URLs) ✔. Option IDs on all "closest option(s)" lines identical ✔. Evidence-tier tags identical on all 123 tagged items. The extra labels ("בדיקת עובדות", "רקע מתוארך (...)", "הצהרה (במסגרת רשמית)", "התחייבות רשמית (תמיכה בקבוצות מסוימות)", "התחייבות רשמית (רשימה משותפת)") each match a label that is in the English ✔.
- Flagged items: "ערביי ישראל" appears only inside Zelekha's quote, attributed, where the English quotes the same words ("most of Israel's Arabs are loyal citizens"), so it's allowed under the ruling ✔. "צו זמני" translates "temporary" (not "tentative"), so it stays ✔. "Tentatively" is rendered "בהסתייגות", not זמני ✔. Candidate names (הנדל, וילף, אדומי, ווליבוביץ, לנגמן, גלבוע, ביטון, טרופר) match `content/registry/lists.json` and `content/research/he/the-reservists.md` ✔.

| Anchor | Difference | Resolution |
|---|---|---|
| overview | Change over time: Tropper's "fairly significant left-wing views" was rendered "דעות שמאלניות למדי", which drops "significant" (meaning drift) | Changed to "דעות שמאל משמעותיות למדי" |
| overview | The Hebrew added "(הוועדה)" after the committee's name, copying the English "(CEC)" abbreviation, but never used it later (naturalness) | Removed |
| leadership | "IDF Military Intelligence research division" was rendered "אגף המחקר של אמ"ן", the wrong Hebrew unit name (naturalness) | Changed to "חטיבת המחקר של אמ"ן" |
| leadership | "their records are not researched here" was rendered "הרקורד שלהם לא נחקר כאן", which breaks the owner's "נחקר" wording rule (loaded wording) | Changed to "הרקורד שלהם אינו נבדק כאן" |
| issue-cost-of-living | 2 wording fixes: "חיסכון 'מסיבי' ביעילות" became "התייעלות 'מסיבית'", and "קונים של צי רכב" became "רוכשי ציי רכב" (naturalness) | Fixed |
| issue-crime-in-arab-society | "קיימות ראיות מעטות ספציפיות" read as a word-for-word translation (naturalness) | Changed to "יש מעט ראיות ספציפיות" |
| issue-judicial-system | The sentence saying the transcript could not be reached was clumsy (naturalness) | Changed to "לא ניתן היה לגשת לפרוטוקול הרשמי של הוועדה" |
| issue-religion-and-state | 2 places: "kashrut certification" was rendered "הסמכת הכשרות", which in Hebrew reads as certifying rabbis, not certifying food. The closest-option line has the same problem (meaning drift) | Changed to "מתן תעודות הכשרות" in both places ("…לרבנים שהוסמכו לרבנות") |
| issue-religion-and-state | The agunot/get phrase was repeated and clumsy (naturalness) | Changed to "ולמסורבות גט (נשים שבעליהן מסרבים לתת להן גט דתי)" |
| other-health | "interns and residents" was rendered "המתמחים והמתמחים בהתמחות" (meaning drift) | Changed to "הסטאז'רים והמתמחים" |
| other-welfare | "team" was rendered "קבוצה" (naturalness) | Changed to "צוות" |
| other-environment-animals | 2 wording fixes: "חילוץ מינרלים" became "הפקת מינרלים", and "שילוחי" became "משלוחי" (naturalness) | Fixed |
| other-agriculture | "farming cooperatives" was rendered "שיתופים חקלאיים" (naturalness) | Changed to "אגודות שיתופיות חקלאיות" |
| coalition | 2 wording fixes: the sentence opening "ice דיווח" became "אתר ice דיווח", and "יתבעו" became "ידרשו" (naturalness) | Fixed |
| legal | "summoned for questioning" was rendered "לחקירה", which in a section that says there were no criminal investigations reads as a criminal probe (loaded wording) | Changed to "לתשאול" |
| legal | "State Attorney Moshe Lador" was rendered "המשנה לפרקליט המדינה" (meaning drift) | Changed to "פרקליט המדינה" |
| (throughout) | 9 instances: glossary forms use gershayim (צה״ל, שב״כ, בג״ץ) but the file used ASCII quotes (glossary) | Standardised to the glossary forms (prose only; source titles unchanged) |

- Kinds: meaning drift 5 · loaded wording 2 · dropped/added claim 0 · citation/tag 0 · glossary 1 (9 instances) · naturalness 13
- English questioned: none
- Validation: no error names the file ✔ (the 4 current errors all concern research/he/byachad-bennett.md)

## israel-first (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (all 23 headings, same order; issue headings use each issue's `he.title`)
- Claims compared: ~360 claim sentences in 9 sections, plus 65 sources · Differences found: 19 · Fixed: 19 · Unresolved: 0
- Checked line by line by script: identical `[n]` on every line, identical option IDs on every "האפשרות/ות הקרובה/ות" line, identical figures and dates, evidence-tier tags on the same claims, Sources list byte-identical (65 entries, same order and URLs). No `avoid.he` terms, no "נחקרה/שנחקרו", no "זמני/ת" for "tentative" ("מקלט זמני" = "temporary refuge", correct).

| Anchor | Difference | Resolution |
|---|---|---|
| overview | naturalness: "אין מפלגת קודמת" (wrong grammatical form) | "אין מפלגה שקדמה לה" |
| overview | meaning drift: quote "compromises at the expense of those who serve" given in the past tense ("מי ששירת") | "מי שמשרתים" |
| overview | naturalness: "ש, לדבריה, מרגישים" | "שלדבריה מרגישים" |
| leadership, other-cannabis…, track-record | meaning drift (10 instances): "legalize/legalization" given as "הסדרה חוקית", which blurs the difference from "regulate" (used for the 2025 medical-cannabis bill in the same section) | "לגליזציה" throughout; "להסדרת השימוש…" kept for "regulate" |
| leadership | naturalness: "רועי חיים דנינו (רוי)": the English "(Roi)" is a Latin-spelling variant and means nothing in Hebrew | dropped the parenthesis; registry form kept |
| leadership | meaning drift: Bino's "national field headquarters" given without "field" | "ראש מטה השטח הארצי" |
| issue-cost-of-living | naturalness: nested parentheses around the 25/24 March sitting note | one parenthesis with a semicolon, same content |
| issue-crime-in-arab-society, issue-housing | naturalness (2): first person "חיפשנו" where the English is impersonal (and no other Hebrew file uses it) | "נערך חיפוש … על" |
| issue-gaza | naturalness: "להושיב בה ישראלים" | "ליישב בה ישראלים" |
| issue-haredi-enlistment | naturalness: "נטל השירות החובה" (grammar) | "נטל שירות החובה" |
| issue-housing | naturalness: "לא יישמה זאת לנושא הדיור" | "לא החילה זאת על תחום הדיור" |
| issue-judea-samaria | loaded wording: "attackers" given as "מחבלים" (stronger than the English) | "במבצעי פיגועים" |
| other-cannabis-and-individual-liberty | naturalness: "חסמים ובירוקרטיה מפני חולים" (reads as "barriers from patients") | "עבור חולים" |
| other-education | naturalness: "להוט באמת לחינוך" | "באמת נלהב מחינוך" |
| other-education | naturalness: "ושב-40% מהבנים…" (grammar) | "וש-40% מהבנים…" |
| other-civil-liberties-lgbt-animals-environment | loaded wording / naturalness: "זוגות הומוסקסואלים" (clinical, dated) for "gay couples" | "זוגות חד-מיניים" |
| coalition | naturalness: "שותף ציוני שאינו בר-קיימא" | "בגלל דבריו בעבר הוא אינו שותף ציוני אפשרי" |
| legal | dropped/added claim (descriptor): "Lahav 433 major-crimes unit" given without "major-crimes" | "ביחידה המשטרתית לחקירת פשיעה חמורה, להב 433" |
| legal | naturalness: "מתן שם לחשוד" | "על כך שמישהו הוגדר כחשוד" |

- Points the author flagged:
  - "להוציא" for Pollard's "remove": the same neutral strength. Kept.
  - Judicial Selection Committee composition (1+1+1+2+3 = 8): the English states no total, so it is not wrong on its face, and the Hebrew matches. Not questioned.
  - The 25 March 2025 vote and the note about the 24 March sitting: consistent on their face (the vote is filed under the previous day's sitting). Not questioned.
  - The Statement bullets citing [14]: the tag and citation fit the claims. Not questioned.
  - "(באנגלית: Israel First)" for "(Hebrew: Yisrael Tchila)": the same fact (the name in the other language), nothing dropped.
  - "התובע הכללי" for "Chief Prosecutor": fits the bill's title. Kept.
  - Candidate names: Nos. 1 to 5 match the registry's `topCandidates`. The registry has no Hebrew forms for the other candidates.
- Validation: no error names the file ✔ (`pnpm validate:content` exits 0)

## atid-echad (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (9 sections, 10 issue sub-sections, 8 other-position sub-sections; issue headings match `he.title`)
- Claims compared: ~340 (every sentence, bullet and table row) · Differences found: 31 · Fixed: 30 · Unresolved: 0 (the English question was resolved by the owner in commit 7451c62)
- Checked by script and by reading: `[n]` citations identical line by line; evidence-tier tags on the same claims; option IDs on all 10 closest-option lines identical (tag reads exactly "**האפשרות/ות הקרובה/ות:**"); Sources list byte-identical to English (89 entries, same order and URLs); no `avoid.he` glossary term in the body; no "נחקרה/שנחקרו"; no "זמני/זמנית"; dates day first.

| Anchor | Difference | Resolution |
|---|---|---|
| judicial-system | meaning drift: Judicial Selection Law tally "2 present but not voting" rendered "2 נמנעים" (abstained) | Fixed: "2 נכחו ולא הצביעו" |
| legal | meaning drift: "individual candidates named in the request" rendered "המועמדים הבודדים" (reads as "the few/lone candidates") | Fixed: "המועמדים שנזכרו בשמם בבקשה" |
| other-settlers-us | meaning drift (minor): "a certificate of honour" rendered "תעודת הצטיינות" (certificate of excellence) | Fixed: "תעודת כבוד" |
| information-availability | loaded wording: "took over the registration" rendered "השתלט" (seized); plus 1 naturalness ("כלי עבור" → "מסגרת עבור", matching the overview's wording) | Fixed: "קיבל לידיו את הרישום"; 2 fixes |
| haredi-enlistment, judea-samaria, october-7-inquiry | naturalness (project rule, no Latin acronyms in prose): "JTA", "AP", "N12" in body text | Fixed: "סוכנות הידיעות היהודית", "סוכנות הידיעות אסושייטד פרס", "חדשות 12" (3 fixes; Sources list left verbatim) |
| overview | naturalness/grammar: "פעולה של שרה" (ministerial action), "שמיוחס לו הקמתה" | Fixed: "פעולה כשרה", "שמיוחסת לו" (2 fixes) |
| leadership | naturalness: "שאר ראש הרשימה" | Fixed: "שאר צמרת הרשימה" (1) |
| issue-cost-of-living, issue-haredi-enlistment, issue-religion-and-state | naturalness: "final reading" rendered "הקריאה האחרונה" | Fixed: "הקריאה השלישית" (5 occurrences) |
| issue-cost-of-living | naturalness: tag "הקשר של שותפה" | Fixed: "הקשר מצד השותפים" (1) |
| issue-haredi-enlistment | naturalness/grammar: "בעיניי זו עלבון", "ישנה מ-2021" | Fixed: "זה עלבון", "קודמת ל-2021" (2) |
| issue-housing | naturalness/grammar: "מנהלי משרדים" (directors-general), "צמידתה למדד", "חמש בסיסי" | Fixed: "מנכ"לי משרדים", "הצמדתה", "חמישה בסיסי" (3) |
| issue-judea-samaria | naturalness/grammar: gender agreement "הוציאה הרכב… והשאירה" | Fixed: "הוציא… והשאיר" (2) |
| issue-october-7-inquiry | naturalness: "לקהות את דעת הקהל" | Fixed: "להקהות" (1) |
| issue-religion-and-state | naturalness: "לא מוכנים לתת למכור" | Fixed: "לתת להם למכור" (1) |
| coalition | naturalness: "שרטוט קווים אדומים" (×3), "את הישארות" | Fixed: "הצבת קווים אדומים", "את ההישארות" (4) |
| track-record | spelling: "שקויימה" | Fixed: "שקוימה" (1) |
| leadership / track-record vs issue-judea-samaria | English questioned: the same Likud–Religious Zionism coalition agreement is "signed on 1 December 2022" [20] in Leadership and the track-record table, but "signed on 28 December 2022" [89] in the Judea and Samaria contradiction bullet. The English contradicts itself on the signing date (likely: agreed/initial signing 1 Dec per the Ynetnews report, final signed copy tabled 28 Dec). Hebrew mirrors the English exactly. | Resolved by the owner (7451c62, decision 3 in research/review/hebrew-english-questioned.md): the contradiction bullet now says "signed in its final form on 28 December 2022" [89], and the Hebrew says "שנחתם בנוסחו הסופי ב-28 בדצמבר 2022". The 1 December mentions [20] are unchanged in both. Hebrew matches the new English |

- Not questioned: October 7 inquiry. The English says the government decided "not to set up a state commission of inquiry and instead to promote a commission of inquiry" whose composition reflects broad agreement; source [28]'s headline "תוקם ועדת חקירה לא ממלכתית" says the same thing, so the English is consistent. Hebrew wording matches the glossary ("ועדת חקירה ממלכתית").
- Terms checked and kept: "מתיישבים" for settlers (neutral; no glossary entry, no avoid term); quoted "יישובים צעירים" (attributed as the ministry's own term), "מפלגת מדף" (attributed to the press), "טרור לאומני" (inside quotation marks, attributed to the security chiefs and to Strock's reply, as in the English); "גילוי דעת" for the Knesset declaratory motion; failed votes put the majority first ("נדחתה ברוב של 66 מול 14", "56 מול 32").
- Validation: no error names the file ✔ (`pnpm validate:content` passed)
- Re-check after owner corrections (7451c62, 14 October 2026): pass. EN "signed in its final form on 28 December 2022" = HE "שנחתם בנוסחו הסופי ב-28 בדצמבר 2022" ("in its final form" = "בנוסחו הסופי", date day first, citation [89] unchanged); nothing else in the bullet changed. `pnpm validate:content` passed.

## byachad-bennett (checked 2026-10-13; EN researchedAsOf 2026-10-06)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (31 headings, same order; frontmatter identical except `lang: he`)
- Claims compared: ~390 (every paragraph, bullet and sentence in all sections) · Differences found: 12 · Fixed: 11 · Unresolved: 0 (the English question was resolved by the owner in commit 7451c62)
| Anchor | Difference | Resolution |
|---|---|---|
| overview | naturalness: English glosses of the party and list names, "(Together led by Bennett – Restoring Hope)" and "(Together (B'Yachad) led by Naftali Bennett)", left in Hebrew prose (2 items; aids for English readers only, no claim) | Removed |
| leadership | loaded wording / naturalness: "openly gay candidates" as "מועמדים הומוסקסואלים בגלוי" (clinical, word-for-word) | "אחד משני המועמדים ברשימה שהם גאים מוצהרים" |
| issue-cost-of-living | glossary/ruling: Latin acronym "OECD" in prose (3 places: "(OECD)" after the full name, "ב-OECD", "ה-OECD") | Written out each time as "(במדינות) הארגון לשיתוף פעולה ולפיתוח כלכלי"; no Latin left |
| issue-haredi-enlistment | added claim: plan name given as "ביחד נתקן – חוק המשרתים"; the English names it only "Those Who Serve Law" | "חוק המשרתים" (now consistent with the other-military-manpower mention) |
| issue-october-7-inquiry, coalition | citation/tag: tag "**הצהרה (הצהרת המנהיגים המשותפת):**" repeats "הצהרה" and could read as a second Statement tag; the coalition bullet called the same document "הצהרה" | Tag kept as Statement with a distinct qualifier: "**הצהרה (הכרזה משותפת של המנהיגים):**"; coalition prose "חתמו על הכרזה" (not "גילוי דעת", which is reserved for Knesset declarations) |
| issue-religion-and-state | loaded wording / glossary: "ends its monopoly" as "מבטלת את המונופול שלה" in narrative text; the glossary avoids "מונופול הרבנות" as a neutral description | "מבטלת את הבלעדיות שלה": same meaning (the Rabbinate stays, loses exclusivity), neutral. The source title "מונופול הרבנות נשבר" in Sources [25] untouched |
| other-pensions-and-older-people, information-availability | naturalness: "older people" as "אנשים מבוגרים" (literal; 4 places incl. the heading) | "אזרחים ותיקים" (standard Israeli term, as in other Hebrew documents) |
| coalition | meaning drift: Lapid's "and hopefully, even with Likud" as "ואם יהיה אפשר" ("if possible") | "ובתקווה, גם עם הליכוד" |
| track-record | naturalness (2 items): "קווי האדום" (ungrammatical); "בהצבעתו של בנט" (ambiguous for "with Bennett's vote") | "הקווים האדומים"; "ובנט הצביע בעדה" |
| legal | name: English "Justice Alroni", Hebrew "השופט אלרון" | Resolved by the owner (7451c62, decision 4 in research/review/hebrew-english-questioned.md): English now "Justice Yosef Elron" (confirmed against [72]), Hebrew "השופט יוסף אלרון". Hebrew matches the new English; neither edition still has "Alroni"/"אלרוני" |
| information-availability | naturalness: "את תנאי ההסכם ... לא נמצאו" (broken construction) | "תנאי ההסכם ... לא נמצאו במסמך רשמי" |

- Checked and kept as flagged by the author:
  - "defections" as "עריקתם" (overview): standard neutral Israeli political usage for lawmakers leaving a coalition, same strength as "defections". The glossary's avoided "עריקים" applies to yeshiva students, not here. Kept.
  - Candidate names from the CEC list match the English and the registry's `together` topCandidates.
  - "Change over time" is "שינוי לאורך זמן" throughout; closest-option tag is exactly "**האפשרות/ות הקרובה/ות:**"; "temporary" ("צעד זמני", "בחינה זמנית") translates "temporary", not "tentative"; failed votes put the majority first ("נדחתה ברוב של 44 מול 40", "52 מול 47"); ties (54–54, 59–59) given as ties.
- Tags, citations, options: evidence-tier tags and option IDs identical line by line (70 tags/IDs); `[n]` sequences identical on every line; Sources identical (96 entries, same order, same titles and URLs).
- Rulings: no "נחקרה/שנחקרו"; no avoid.he term outside quotes or source titles ("קרטלים" is inside Bennett's quoted words, which the English quotes; "מונופול הרבנות" only in source title [25]); no Latin acronyms left in prose (Ynet/Ynetnews are outlet names); dates day first.
- Validation: no error names the file ✔
- Re-check after owner corrections (7451c62, 14 October 2026): pass. EN "Justice Yosef Elron described" = HE "השופט יוסף אלרון תיאר" (the standard Hebrew spelling of the justice's name; he is not in the registry); nothing else in the bullet changed. `pnpm validate:content` passed.

## chomat-torat-yisrael (checked 2026-10-13; EN researchedAsOf 2026-10-07)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (frontmatter identical except `lang: he`; the files line up line for line, 342 lines each)
- Claims compared: ~300 · Differences found: 22 · Fixed: 22 · Unresolved: 0
- Checked by script on every line: `[n]` citations identical ✔; option IDs on every "closest option(s)" line identical ✔; evidence-tier tags identical ✔; Sources list (97 entries) byte-identical, with the same count, order and URLs ✔; no "נחקרה"/"שנחקרו" ✔; no "זמני/זמנית" ✔; dates day first ✔.

| Anchor | Difference | Resolution |
|---|---|---|
| leadership | meaning drift: "The other top-five candidates" (four names, the others in the top five besides Porush) was given as "חמשת המועמדים הראשונים האחרים", which says there are five more | "שאר המועמדים בחמישייה הראשונה שייכים..." |
| issue-judicial-system | meaning drift: "(See Coalition stance for how this pledge played out.)" was given as "how the pledge was fulfilled" ("התקיימה"), but the Coalition section says it was not delivered | "(על מה שעלה בגורל ההתחייבות הזו ראו...)" |
| issue-gaza | meaning drift: "post-ceasefire choices" was given as "הבחירות שלאחר הפסקת האש", which reads as "the elections after the ceasefire" | "האפשרויות שעל הפרק אחרי הפסקת האש" |
| coalition | meaning drift: he "warned against the left ... controlling funding decisions" was given as a left that already controls them ("ששולט") | "מפני מצב שבו השמאל ... ישלוט בהחלטות על מימון" |
| coalition | dropped claim: the quote "can't pass a draft law" lost the word "draft" ("לא יכול להעביר חוק") | "לא יכול להעביר חוק גיוס" |
| coalition | meaning drift: "reprimanded" was given as "הוכיחו אותו", which without niqqud also reads as "proved him" | "ננזף" |
| coalition | naturalness: the quote "any other agreement is not acceptable to us" was broken ("ושאין \"כל הסכמה אחרת מקובלת עלינו\"") | "וש\"כל הסכמה אחרת אינה מקובלת עלינו\"" (the wording of source [77]'s title) |
| coalition, track-record | naturalness (3): "Kept (eventually)", "Not delivered" and "Delivered" were given as "קוים" / "לא קוים", which without niqqud reads as "lines" | "ההבטחה קוימה (בסופו של דבר)", "ההבטחה לא קוימה", "הושג" |
| issue-judea-samaria | ruling: failed votes gave the losing side first ("נכשלה ב-8 מול 45"; "נדחו ב-43 מול 68 וב-40 מול 69"), 3 votes | Majority first: "נדחתה ב-45 קולות מול 8"; "נדחו ב-68 קולות מול 43 וב-69 קולות מול 40" |
| issue-judea-samaria | glossary/ruling: the July 2025 Knesset "sovereignty motion" was given as "הצעת הריבונות" | "גילוי הדעת בעניין ריבונות מיולי 2025" |
| information-availability | ruling: "final reading" was given as "הקריאה האחרונה" | "הקריאה השלישית" |
| leadership, issue-haredi-enlistment, issue-crime-in-arab-society | glossary/naming (3, flagged by the author): the English "Minister of Jerusalem and Jewish Tradition" / "Minister of Jerusalem" was given as "השר לירושלים ולמסורת ישראל" / "כשר לירושלים" | "שר ירושלים ומסורת ישראל" / "כשר ירושלים", the form used in this party's checked Hebrew result texts and matching "משרד ירושלים ומסורת ישראל" in track-record. (agudat-yisrael's "ירושלים ומורשת" follows that file's own English, "Jerusalem and Heritage". The two English documents name the ministry differently; each Hebrew file now follows its own English.) |
| overview, leadership, issue-haredi-enlistment, issue-judicial-system, issue-religion-and-state, information-availability | naturalness (9): the English gloss ("Wall of the Torah of Israel") and the Latin spelling "(Eliakim)" left in Hebrew prose; "להתנתק סופית ומוחלטת"; "הקטינו את הפיצול" (played down); "המועמד העליון"; "חבר הכנסת ותיק הכהונה"; "מראיינים של פרוש" (indefinite); "אנחנו לא נותנים שום אמון"; "אחרי שייעשה זאת"; "אליקים שטארק, אינו מותיר רקורד" | Removed the Latin glosses; "סופית ולחלוטין"; "הצניעו"; "המועמד הראשון"; "הוותיק"; "מראייניו של פרוש"; "אין לנו שום אמון"; "אחרי שזה ייעשה"; "למועמד השני שלה ... אין רקורד פומבי" |

Author's flags, checked:
- "גזירת הגיוס" (an avoid.he term) is allowed: it stays inside quotation marks and is attributed to Porush's interviewers ("מה שהם כינו"), and the English quotes and attributes the same words ("what they called the 'conscription decree'").
- "Persecution" quotes: "מסע הרדיפה הרומס", "רדיפת הדת והמסורת" (2), "רודפי לומדי התורה", "לומדי התורה הנרדפים", "תלמידי ישיבות נרדפים" and "לרדוף את לומדי התורה" are all in quotation marks and attributed to Porush, matching English quotations. No avoid term appears outside quotes or source titles ("משתמטים" and "עריקים" appear only in the titles of [35], [40] and [44]). "(סיפוח)" follows the English "(annexation)" next to "החלת ריבונות", so it is not used as the only term. "הרפורמה" appears only inside Porush's quote.
- "נמנע" is used only where the English says "abstain" (October 7 inquiry ×2, death penalty, information availability). "1 present not voting" appears only in source [90], which is unchanged.
- "Other top candidates": the English is not wrong on its face. Porush is #4, so the other top-five candidates are the four listed. No "English questioned". Only the Hebrew wording was fixed (see table).
- Names follow the registry and the checked result texts: חומת תורת ישראל, מאיר פרוש, אליקים שטארק, and the lists.json forms יצחק זאב פינדרוס and משה עזריאל רוזנטל.
- Other rulings: "secured" = "השיגו" (2) ✔; "tentative" = "אינה ודאית" (not זמני) ✔; "שינוי לאורך זמן" ✔; the closest-option tag is exactly "**האפשרות/ות הקרובה/ות:**" ✔; "acting minister" does not occur. JDN and i24NEWS are kept as outlet names, as in the other checked Hebrew files (like Ynet).
- Validation: no error names the file ✔ (`pnpm validate:content`: "Content validation passed"; the self-match report was not rewritten)

## the-democrats-party (checked 2026-10-14; EN researchedAsOf 2026-10-06)
- Hebrew edition by: Stage 5a agent (Sonnet) · Parity check by: Stage 5b agent (Opus, different)
- Sections/anchors: identical ✔ (29 headings, same order; issue headings match `he.title`; frontmatter identical except `lang: he`)
- Claims compared: 373 (every paragraph, bullet and sentence in all sections), plus the 92-entry Sources list · Differences found: 24 · Fixed: 24 · Unresolved: 0
- Mechanical checks: the same `[n]` on every line, the same evidence-tier tags line for line, the same option IDs on all 10 "closest option(s)" lines, the Sources list byte-identical (92 entries, same order and URLs), all numbers and dates match (day first), straight quotes, no Latin acronyms in the prose, no "נחקרה"/"שנחקרו".
- Opening line: dropping "(in Hebrew, הדמוקרטים)" is the only omission there. The formation, Golan's election (28 May 2024, 95.15%), the 30 June 2024 announcement, the reserved places 4/8/12/16 and the quarter share, the 12 July 2024 approval, the 20 Feb 2026 update (places 6, 8, 14) and the self-description are all present. The CEC parenthetical Hebrew names in the "Legal structure" paragraph were also dropped as redundant, and the content is kept.

| Anchor | Difference | Resolution |
|---|---|---|
| overview | Glossary (orchestrator rule): "former Meretz leaders" was written as "יושבי ראש לשעבר של מרצ" ("chair" wording where the English says "leaders"). | Changed to "ראשי מרצ לשעבר". |
| overview | Meaning drift: "the government then being formed" was written as "שהוקמה אז" (already formed). | Changed to "שבנימין נתניהו ובני גנץ הקימו אז". |
| leadership | Naturalness: "cost him consideration for chief of staff" was written as "עלתה לו בשקילתו", which is awkward. | Changed to "בגלל האמירה הזאת הוא לא נשקל לתפקיד הרמטכ״ל". |
| leadership | Meaning drift: "an Arab coexistence advocate" was written as "פעילה לדו-קיום עם החברה הערבית", which implies a non-Arab activist. | Changed to "פעילה ערבייה למען דו-קיום". |
| issue-cost-of-living | Naturalness (2 fixes): "להחזיר את המחירים כלפי מטה" for fares, and the ambiguous "ובעצמה" for "on her own". | Changed to "להוריד בחזרה את מחירי הנסיעה" and "ולבדה". |
| issue-gaza | Naturalness: "חמאס מוחלף" in the summary line. | Changed to "החלפת שלטון חמאס". |
| issue-gaza | Loaded wording: "ההתנגדות", which is on the avoid list for Hamas as "resistance", was used for opposition within the coalition, outside any quotation. | Changed to "התנגדות מתוך הקואליציה". |
| issue-haredi-enlistment | Meaning drift: the platform quote "We will introduce equal service" was written as "נחוקק" ("we will legislate"), which is stronger. | Changed to "ננהיג". |
| issue-haredi-enlistment | Glossary (orchestrator rule): an article inside a law's name ("חוק שירות הביטחון"). | Changed to "חוק שירות ביטחון". |
| issue-haredi-enlistment | Naturalness: a gender-agreement error ("עמותות שמעודדים"). | Changed to "שמעודדות". |
| issue-judea-samaria | Naturalness: "וימנה מימון לאכיפה" for "fund enforcement". | Changed to "ויממן את האכיפה". |
| issue-judea-samaria | Meaning drift: the closest-option line added hedging ("לפי הדיווח") to "Kariv's stated support". | Changed to "והתמיכה שהביע קריב", and smoothed "המטרה של גולן, שתי מדינות". |
| issue-judicial-system | Meaning drift: "government legal advisers" was written as "היועצים המשפטיים לממשלה" (reads as attorneys general). | Changed to "היועצים המשפטיים במשרדי הממשלה". |
| issue-judicial-system | Glossary (orchestrator rule), 2 occurrences: an article in a law's name ("חוק יסוד: החקיקה"). | Changed to "חוק יסוד: חקיקה" in both. |
| issue-october-7-inquiry | Glossary: "commission picked through the Knesset" was written as "ועדה שתיבחר באמצעות הכנסת". | Changed to the glossary term "ועדה שתמונה באמצעות הכנסת". |
| issue-october-7-inquiry, track-record, information-availability | Naturalness (3 fixes): a wrong verb form for "boycotted" ("חרמה"). | Changed to "החרימה" in all three. |
| other-environment | Glossary (orchestrator rule): an article in a law's name ("חוק יסוד: הסביבה"). | Changed to "חוק יסוד: סביבה". |
| other-governance | Meaning drift: "under indictment" was incomplete ("בזמן שהוגש כתב אישום", with no "against him"). | Added "נגדו". |
| other-arab-citizens | Naturalness: "קרא לרע"ם שותפה לגיטימית" is ambiguous ("called to Ra'am"). | Changed to "הגדיר את רע"ם שותפה לגיטימית". |
| track-record | Glossary (orchestrator rule): "its final readings" was written as "לקריאות האחרונות". | Changed to "לקריאה השנייה והשלישית". |

- Kinds: meaning drift 6 · loaded wording 1 · glossary/terminology rules 7 · naturalness 10 · dropped/added claim 0 · citation/tag 0. No English questioned.
- Avoid-list terms that remain appear only inside attributed quotations that match the English: "השתמטות" ("draft evasion", Golan, twice), "ועדת טיוח" ("whitewash commission", Golan), "כפייה דתית" ("religious coercion", Lazimi), "הדתה" ("religionization", platform).
- Validation: no error names the file ✔
