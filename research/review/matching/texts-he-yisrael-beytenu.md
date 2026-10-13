# Hebrew texts parity check: yisrael-beytenu

- Checked on 13 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author (Sonnet) · Parity check by: Stage 7d parity checker (Opus) (different)
- Structure, agreement values and anchors: identical ✔ (checked by script: same `partyId`, `lang` is `he`, same issues, option IDs, `agreement` values, anchors and point order; every option entry has only `agreement` and `text`)
- Texts compared: 41 option texts + 0 unclear + 3 points · must-fix: 2 · should-fix: 5 · notes: 8
- Result: not passed (2 must-fix open)

## English names completed

The author's English edits were checked by script against `HEAD`: 25 `text` values changed, and every change is only the addition of a first name and/or role. No `agreement` value, anchor or other wording changed. One edit has a capitalization error (F1).

| Text | Edit | Verified against | Status |
|---|---|---|---|
| cost-of-living / open-market-competition-imports | "Liberman" → "Avigdor Liberman" (the role "as finance minister" was already there) | Registry `leader`; research Leadership ("finance minister (2021–2022)") and Cost of living section (November 2021) | ok |
| cost-of-living / cut-taxes-and-government-spending | "including Liberman" → "including party leader Avigdor Liberman" (11 March 2024) | See ruling below | ok |
| cost-of-living / direct-support-for-households | "Liberman's" → "party leader Avigdor Liberman's" (January 2026); "Bennett" → "Naftali Bennett" (name only, February 2022) | Registry (`lists.json`, `parties.json`: "Naftali Bennett"); research Cost of living section ("In February 2022 Liberman and Bennett presented…"). Neither source gives Bennett's role on that date in words, so name only is correct (N2) | ok |
| crime-in-arab-society / emergency-powers-shin-bet | → "party leader Avigdor Liberman" (September 2025, September 2026) | Registry; research Leadership ("party chair"); Overview ("founded in 1999 by Avigdor Liberman, who still leads it") | ok |
| crime-in-arab-society / invest-in-arab-communities-first | same | same | ok |
| gaza / resume-fighting-full-control, hold-positions-disarmament-first, advance-international-arrangement, end-war-full-withdrawal, defeat-hamas-then-security-control (5 texts) | → "party leader Avigdor Liberman" (October 2025 to October 2026) | same | ok |
| haredi-enlistment / anchor-torah-study-exemption | → "party leader Avigdor Liberman" (July 2026) | same | ok |
| haredi-enlistment / universal-service-with-sanctions | → "party leader Avigdor Liberman's" (January 2026) | same | role ok; **capitalization must-fix (F1)** |
| housing / direct-help-for-buyers | → "Party leader Avigdor Liberman's" (January 2026) | same | ok |
| iran-and-regional-security / all 4 texts | → "party leader Avigdor Liberman" (March to June 2026) | same | ok |
| judea-samaria / all 6 texts | → "party leader Avigdor Liberman" (October 2025 to October 2026) | same; the Ma'ale Adumim bill sponsorship is in the Judea and Samaria section | ok |
| religion-and-state / more-choice-local-decisions | → "promoted by party leader Avigdor Liberman" (2021 Arrangements Law) | Research Leadership (finance minister 2021–2022, passed the 2021 Arrangements Law) and Overview (led the party continuously since 1999) | ok |
| point other-death-penalty | "Liberman, Forer, Malinovsky and Sova" → "party leader Avigdor Liberman and MKs Oded Forer, Yulia Malinovsky and Evgeny Sova" (30 March 2026) | Registry `lists.json` (Avigdor Liberman, Oded Forer, Yulia Malinovsky, Evgeny Sova); research Overview ("Current Knesset seats": all four are MKs in the 25th Knesset) and Leadership (Malinovsky MK since April 2019; Sova MK since April 2019); Death penalty section (the four voted for the law on 30 March 2026) | ok |

**Ruling on "party leader" for 11 March 2024 (cut-taxes-and-government-spending).** Supported. The research's Leadership section lists "Avigdor Liberman (No. 1), party chair" without a date range, and its Overview states the party "was founded in 1999 by Avigdor Liberman, who still leads it", i.e. continuous leadership from 1999 to the present, which covers 11 March 2024. Nothing in the research names any other leader at any time. The same reasoning covers the 2021 and February 2022 texts. "party leader" is rendered "ראש המפלגה" in Hebrew throughout, as the convention requires.

**"Trump" (iran-and-regional-security / force-plus-us-backed-agreements).** Left as surname only in both languages. Neither `content/registry/` nor the research gives a full name or role for him (the research quotes Liberman: "tell Trump 'no'"). No change possible under the rule; recorded as N1.

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| F1 | haredi-enlistment / universal-service-with-sanctions (**English** file) | must-fix (English edit; structure) | "…on 13 July 2026. party leader Avigdor Liberman's January 2026 letter…" — the added role starts a sentence in lower case | (Hebrew is correct: "המכתב של ראש המפלגה אביגדור ליברמן…") | English only: replace ". party leader Avigdor Liberman's January 2026 letter" with ". Party leader Avigdor Liberman's January 2026 letter". No Hebrew change. | open |
| F2 | point other-death-penalty | must-fix (meaning drift: the "although" contrast is garbled) | "…voted for the law the Knesset passed on 30 March 2026, although six of its MKs voted against an opposition bill on the subject on 13 October 2021 while the party was in the coalition." | "…אף שישה מחברי הכנסת שלה הצביעו…" — "אף שישה" reads as "even six" / "not even six", not "although six" (the ש of "אף ש" is swallowed by "שישה") | Whole text (also applies F4): "המפלגה תומכת בעונש מוות למחבלים: לדבריה היא הגישה הצעת חוק כזו לראשונה במרץ 2015, וראש המפלגה אביגדור ליברמן וחברי הכנסת עודד פורר, יוליה מלינובסקי ויבגני סובה הצביעו בעד החוק שהכנסת אישרה ב-30 במרץ 2026, אף שב-13 באוקטובר 2021 הצביעו שישה מחברי הכנסת שלה נגד הצעת חוק של האופוזיציה בנושא, בזמן שהמפלגה הייתה בקואליציה." | open |
| F3 | october-7-inquiry / state-commission-under-existing-law and commission-chosen-by-neutral-mechanism (2 texts) | should-fix (glossary: name form consistency) | "Ynet questionnaire" | "לשאלון של ווינט" (both texts) | In both texts replace "לשאלון של ווינט" with "לשאלון של ynet". Ruling: the other Hebrew texts files (shas, raam, atid-echad, amcha-yisrael, jewish-national-front) write the outlet as "ynet" in Latin letters, 15 times; this file is the only one with "ווינט". | open |
| F4 | point other-death-penalty | should-fix (glossary: name form) | "Yulia Malinovsky" | "יוליה מלינובסקי קונין" | "יוליה מלינובסקי" (included in the F2 text). Ruling: the English (canonical) and the registry's own `en` form say "Yulia Malinovsky", with no second surname; this party's Hebrew research edition (`content/research/he/yisrael-beytenu.md`, lines 15, 29, 31 and elsewhere) writes "יוליה מלינובסקי" throughout. The registry's `he` form "יוליה מלינובסקי קונין" adds a name the English does not carry, so the Hebrew text follows the English and the research edition. The registry `he` form itself is not changed by this ruling. | open |
| F5 | gaza / hold-positions-disarmament-first | should-fix (naturalness; consistency of the key verb) | "to renew the war until Hamas is eliminated" | "לחדש את המלחמה עד שחמאס יושמד" — "destroyed", whereas every other text in the file renders "eliminate/elimination" with ח-ס-ל | Replace "עד שחמאס יושמד" with "עד שחמאס יחוסל" | open |
| F6 | religion-and-state / keep-status-quo | should-fix (naturalness: ungrammatical object) | "…and private kosher certification, whose repeal all six MKs voted against on 15 July 2026." | "…ותעודות כשרות פרטיות, ואת ביטולן הצביעו נגד כל ששת חברי הכנסת ב-15 ביולי 2026." ("הצביעו נגד" does not take "את") | Replace "ואת ביטולן הצביעו נגד כל ששת חברי הכנסת ב-15 ביולי 2026." with "ונגד ביטולן הצביעו כל ששת חברי הכנסת ב-15 ביולי 2026." | open |
| F7 | housing / develop-periphery-and-transport | should-fix (naturalness: ambiguous, can read as "support for the platform") | "the platform's support for settlement in the Negev and Galilee is part of its broader Zionist settlement vision" | "התמיכה במצע בהתיישבות בנגב ובגליל היא חלק מחזונה הרחב יותר של התיישבות ציונית." | Replace with "תמיכת המצע בהתיישבות בנגב ובגליל היא חלק מחזונה הרחב יותר של התיישבות ציונית." | open |
| N1 | iran-and-regional-security / force-plus-us-backed-agreements | note | "Israel can tell Trump no" | "שישראל יכולה לומר לטראמפ לא" | No change: no source in the registry or research gives Trump's full name or role; parity is correct. | — |
| N2 | cost-of-living / direct-support-for-households | note | "he and Naftali Bennett" (name only) | "הוא ונפתלי בנט" | No change: neither source states Bennett's role in February 2022 in words, so name only follows the rule. Hebrew form matches the registry. | — |
| N3 | cost-of-living / cut-taxes-and-government-spending | note | "party leader Avigdor Liberman" on 11 March 2024 | "ראש המפלגה אביגדור ליברמן" | Supported; see ruling above. | — |
| N4 | crime-in-arab-society (2 texts), haredi-enlistment (3 texts) | note | "the Shin Bet", "Basic Law: Torah Study" without the glossary's explanatory parentheses | "השב״כ", "חוק יסוד: לימוד תורה", likewise without them | No change: the English texts carry no gloss either, so adding one in Hebrew would be an addition. | — |
| N5 | point other-welfare | note | "the Haredi sector" | "המגזר החרדי" | Parity with the English; the glossary's "sector" avoidance applies to Arab society only. | — |
| N6 | judicial-system (3 texts) | note | "the attorney general's legal opinions" (the law on the office) | "היועץ המשפטי לממשלה" | Masculine generic for the office, as the glossary note allows. | — |
| N7 | cost-of-living / open-market-competition-imports | note | "…the November 2021 Arrangements Law, which let products…in" | "…בחוק ההסדרים של נובמבר 2021, שאפשרה…" — the feminine verb attaches to "the reform" rather than "the law" | Same practical meaning (the reform was part of that law); no change needed. "כשר האוצר קידם אביגדור ליברמן" is acceptable formal word order. | — |
| N8 | whole file | note | — | Dates written "ב-11 במרץ 2024" with a hyphen; some other parties' files use the maqaf "ב־" | Consistent within this file and day first throughout; corpus-wide hyphen/maqaf choice is outside this check. | — |

## English texts questioned

None. (F1 is a capitalization error in the author's names edit, not a content question.)

## What was verified

1. Structure: done, by script (partyId, `lang: he`, issue list and order, option IDs, `options`/`unclear`, 3 points in the same order) — identical.
2. `agreement` values: done, by script — identical for all 41 options, in English.
3. Anchors: done, by script — identical for all 10 issues and 3 points.
4. Meaning: done, all 44 texts read side by side; facts, dates, numbers (17%→18%, NIS 4.4 billion, 3,000 officers, $160 million, 90%/40 years/NIS 2.5 million, 80 of 120 MKs), names and vote directions match. One garbled concessive (F2).
5. Strength and hedging: done — no added "ככל הנראה"/"כנראה", "about $160 million" kept as "בערך", "an account the IDF disputed in part" kept as "בחלקו"; no "זמני/זמנית" as a hedge (the only hit is "זמני הבנייה", building times).
6. Fits the label: done — each Hebrew text read alone matches its `agreement`; the "shares one element" disagrees texts keep the English framing.
7. Glossary: done, by script over all terms the English uses — Hebrew terms used (חרדים, שירות לאומי-אזרחי, צה״ל, יהודה ושומרון, התיישבות, החלת ריבונות, הרשות הפלסטינית, ועדת חקירה ממלכתית, בית המשפט העליון, היועץ המשפטי לממשלה, היישובים הערביים, שבת, הרבנות הראשית, נישואים אזרחיים, חמאס, חיזבאללה, שטח C, חוק יסוד, השב״כ); no `avoid.he` term found.
8. Neutral: done — no loaded wording found; "היפרדות" not needed; "התיישבות/יישובים" used, not "התנחלויות".
9. Natural Hebrew: done — three awkward spots (F5–F7); the user is addressed as "תשובתך/בחירתך", gender-neutral; "every citizen" given as "לכל אזרח ואזרחית".
10. Form: done — 1–2 sentences each, one sentence per point; no poll figures, option IDs, citations, links or Markdown; dates day first; no quotation marks in the English to preserve; no article inside a law's name ("חוק יסוד: לימוד תורה", "חוק ההסדרים"); "differs" rendered "שונה"; no "נחקרה/שנחקרו"; names in registry Hebrew forms except the Malinovsky ruling (F4); references to the user's choice match the Hebrew option texts ("להישאר במקומות", "בלי… שב״כ", "שיטה ניטרלית").

Validation: `CONTENT_CORPUS=real pnpm validate:content` passed (content validation, self-match and profile tests); the Hebrew file raises no error.
