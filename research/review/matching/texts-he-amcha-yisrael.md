# Hebrew texts parity check: amcha-yisrael

- Checked on 13 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author agent, Sonnet · Parity check by: Stage 7d parity checker agent, Opus (different)
- Structure, agreement values and anchors: identical ✔
- Texts compared: 41 option texts + 0 unclear + 3 points · must-fix: 0 · should-fix: 3 (3 fixed) · notes: 9
- Result: pass after fixes (all three should-fix items fixed and confirmed on 13 October 2026; no open findings)

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| 1 | gaza / defeat-hamas-then-security-control | should-fix (meaning drift; naturalness) | "and Winter has backed Jewish settlement in Gaza afterwards" ("afterwards" = settlement after Hamas is destroyed) | "ווינטר תמך בהתיישבות יהודית ברצועה לאחר מכן" (at the end of the sentence, "לאחר מכן" reads as when Winter gave his backing, not when the settlement would happen) | Replace "ווינטר תמך בהתיישבות יהודית ברצועה לאחר מכן." with "ווינטר תמך בכך שלאחר מכן תקום ברצועה התיישבות יהודית." | fixed (confirmed 13 October 2026: suggested Hebrew applied verbatim) |
| 2 | judea-samaria / partial-sovereignty-area-c | should-fix (naturalness) | "promised stronger governance and enforcement in Area C" | "הבטיחה שלטון ואכיפה חזקים יותר בשטח C" ("שלטון" means rule or regime; "governance" in Hebrew political usage is "משילות") | Replace "הבטיחה שלטון ואכיפה חזקים יותר בשטח C" with "הבטיחה לחזק את המשילות והאכיפה בשטח C" | fixed (confirmed 13 October 2026: suggested Hebrew applied verbatim) |
| 3 | october-7-inquiry / state-commission-under-existing-law | should-fix (naturalness) | "rather than the President of the Supreme Court picking members" | "ולא נשיא בית המשפט העליון יבחר את החברים" (reads as translated) | Replace ", ולא נשיא בית המשפט העליון יבחר את החברים." with ", במקום שנשיא בית המשפט העליון יבחר את החברים." | fixed (confirmed 13 October 2026: suggested Hebrew applied verbatim) |
| 4 | crime-in-arab-society / emergency-powers-shin-bet, more-police-resources-normal-law | note (glossary) | "Shin Bet involvement" (no gloss) | "שילוב השב״כ (שירות הביטחון הפנימי של ישראל)" | No change. The parenthesis is the glossary's mandatory Hebrew form of the term (the glossary's English entry carries the same explanation, "Israel's internal security service"), and the glossary note asks for it on first use; each text is shown on its own. It defines the term and says nothing about the party, so it is not an added claim. Same ruling as in the other parties' logs. | n/a |
| 5 | gaza (all five texts) | note (glossary) | "voluntary emigration"; "facilitate voluntary emigration" | "הגירה מרצון"; "לסייע להגירה מרצון" | No change. Matches the English: the glossary form "עידוד הגירה מרצון" is for "encouraging voluntary emigration", and the English here never says "encouraging"; adding "עידוד" would change the party's wording. No critics' term (טרנספר and so on) appears. | n/a |
| 6 | haredi-enlistment / voluntary-service-for-all | note (glossary) | "Basic Law: Service" (quoted) | "חוק יסוד: שירות" (quoted) | No change. Quotation kept, no article inside the law's name, and named Basic Laws carry no "(חוק במעמד חוקתי)" gloss, as in the English and the other parties' Hebrew files. | n/a |
| 7 | haredi-enlistment / anchor-torah-study-exemption | note (names) | "Agudat Yisrael leader Yitzhak Goldknopf" | "ראש אגודת ישראל יצחק גולדקנופ" | No change. "יצחק גולדקנופ" is the registry's Hebrew form (parties.json, agudat-yisrael leader); the role is supported by the registry. | n/a |
| 8 | crime (2), iran (1), religion (2): "tentatively"; crime (1), iran (1), religion (2): "The tentative indication" | note (hedging) | "places the party tentatively"; "The tentative indication" | "ממקם את המפלגה, בהסתייגות"; "הסימן הלא ודאי" | No change. The hedge is kept, describes the research's inference rather than the party, and never uses "זמני/זמנית". | n/a |
| 9 | cost-of-living / cut-taxes-and-government-spending | note (loaded wording) | "competition and import reform" | "רפורמה בתחרות וביבוא" | No change. The glossary avoids "רפורמה" only as a neutral description of the judicial changes; here it translates "reform" in an economic sense. | n/a |
| 10 | judea-samaria / partial-sovereignty-area-c | note (glossary) | "Area C" (no explanation) | "שטח C" (no explanation) | No change. The English gives no explanation either, and the user's own option text, which this text answers, already explains Area C. | n/a |
| 11 | haredi-enlistment / universal-service-with-sanctions | note (glossary) | "military or national service" | "שירות צבאי או שירות לאומי" | No change. The English says "national service", not the glossary's "civilian national service", so "שירות לאומי" is the faithful rendering. | n/a |
| 12 | judea-samaria / maintain-current-situation; judicial-system / continue-judicial-changes | note (naturalness) | "it would expand settlements"; "the changes passed since 2023" | "היא תרחיב את היישובים"; "השינויים שהועברו מאז 2023" | No change. Both are ordinary Hebrew political usage and keep the meaning ("יישובים" is the glossary term). | n/a |

## English names completed

None. The English file is unchanged (git shows no edit to `content/matching/texts/en/amcha-yisrael.json` since commit 08574b9; the author's commit 8ee88cb touches only the Hebrew file). Every text in both languages already names each person in full with a role at first mention: "party leader Ofer Winter" / "ראש המפלגה עופר וינטר" (registry leader; research: No. 1, party chair), "Agudat Yisrael leader Yitzhak Goldknopf" / "ראש אגודת ישראל יצחק גולדקנופ" (registry), "Yoseph Haddad, its second candidate, … its candidate for public diplomacy minister" / "יוסף חדאד, המועמד השני ברשימתה, הוא מועמדה לתפקיד שר ההסברה" (lists.json and research: No. 2, presented as candidate for public diplomacy minister). Later mentions by surname only ("Winter" / "וינטר") come after the full name in the same text.

## English texts questioned

None.

## What was verified

1. Structure: done by script. partyId the same, `lang` is `he`, the same 10 issues, the same option IDs in the same order, `options` everywhere (no `unclear`), 3 points in the same order, no extra keys.
2. Agreement values: done by script; all 41 identical and in English.
3. Anchors: done by script; all 10 issue anchors and 3 point anchors identical.
4. Meaning: done, all 44 texts read side by side with the English. Facts, dates (25 August, 27 August, 2 September, 7 September, 28 September, 29 September, 5 October, 6 October 2026), numbers (ten first steps, 120 members, three family representatives, 2023, 2025), names and quotations all match. Nothing added or dropped; the Shin Bet gloss is the glossary's form (#4). One ambiguity in #1.
5. Strength and hedging: done. "tentatively" / "tentative indication" kept as "בהסתייגות" / "הסימן הלא ודאי"; "closest" kept as "הכי קרוב"; "secondary element" kept as "מרכיב משני"; no "ככל הנראה" or other added hedge, no "זמני".
6. Fits the label: done, each Hebrew text read alone. "זו עמדת המפלגה" texts read as agrees; "כמו תשובתך … היא שונה" and "וזה חופף לתשובתך … זה מרכיב משני" as partly; "גישת המפלגה, כפי שהיא מתועדת, שונה" as disagrees; the four unclear texts state no stance.
7. Glossary: done by script and by reading. No `avoid.he` term appears. Glossary forms used: השב״כ (with its gloss), מעצר בלי משפט, היישובים הערביים, חמאס, הגירה מרצון (#5), חרדים, תלמידי ישיבות, צה״ל, חוק יסוד, יהודה ושומרון, יישובים / התיישבות (never התנחלויות), החלת ריבונות, הרשות הפלסטינית, מדינה פלסטינית, שטח C, בג״ץ, היועץ המשפטי לממשלה, ועדת חקירה ממלכתית, ההלכה (החוק הדתי היהודי), הרבנות הראשית, נישואים אזרחיים, שבת, יוקר המחיה.
8. Neutral: done. No loaded word found; "רפורמה" is economic (#9); nothing reads as acting against the law; the Hebrew never says the party "נחקרה" or "שנחקרו".
9. Natural Hebrew: done. Three wording fixes (#1–#3). The user is addressed with the gender-neutral "תשובתך"; "every citizen" is "כל אזרח ואזרחית".
10. Form: done by script. Every text has 1–2 sentences (points one each); no poll figures, option IDs, citation numbers, links or Markdown; dates day first; every English quotation stays quoted; names in registry forms; "party leader" is "ראש המפלגה" and "chair" is "יו״ר"; no article inside a law's name; references to the user's choice use the Hebrew option words (תוספת משאבים למשטרה, סמכויות מיוחדות, שמירת ההסדרים הנוכחיים, בחירה מקומית, מי ששירתו, שילוב השב״כ).

Validation: `CONTENT_CORPUS=real pnpm validate:content` passed (content, self-match and profile tests). The Hebrew file raises no error or warning; amcha-yisrael appears only in an existing self-match "for review" line about israel-first, which concerns the matching, not the texts.

Re-check after fixes (13 October 2026): the Hebrew file was re-read; the only changes are the three suggested replacements (#1–#3), structure, agreement values and anchors are still identical, and the English file is unchanged. `CONTENT_CORPUS=real pnpm validate:content` was re-run: passed (content, self-match and profile tests), with no error or warning from this file.
