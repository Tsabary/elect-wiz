# Hebrew texts parity check: jewish-national-front

- Checked on 13 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author, Sonnet · Parity check by: Stage 7d parity checker, Opus (different)
- Structure, agreement values and anchors: identical ✔
- Texts compared: 37 option texts + 1 unclear + 3 points · must-fix: 6 (6 fixed) · should-fix: 4 (3 fixed, 1 not applied) · notes: 6
- Result: pass after fixes (fix round confirmed on 13 October 2026; #7 not applied: depends on the English, logged for the owner in research/review/hebrew-english-questioned.md)

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| 1 | housing / speed-up-planning-and-construction | must-fix (glossary: name and role; naturalness) | "through the ministry of Yitzhak Wasserlauf, Minister for the Negev, Galilee and National Resilience, expanded in February 2023." | "באמצעות המשרד של יצחק שמעון וסרלאוף, השר לפיתוח הנגב, הגליל והחוסן הלאומי, שהורחב בפברואר 2023." Three problems: "לפיתוח" is added to the title (the research Hebrew is "השר לנגב, לגליל ולחוסן הלאומי", and the English has no "Development"); the middle name "שמעון" is not in the English (registry parties.json and the research section give "יצחק וסרלאוף"); and "שהורחב" right after "השר" reads as if the minister was expanded. | "יישובים חדשים בנגב ובגליל באמצעות משרדו של יצחק וסרלאוף, השר לנגב, לגליל ולחוסן הלאומי, משרד שהורחב בפברואר 2023." | fixed |
| 2 | housing / state-led-affordable-rental | must-fix (glossary: name and role; naturalness) | Same as #1. | Same as #1. | Same as #1. | fixed |
| 3 | housing / develop-periphery-and-transport | must-fix (English edit; name and role) | "in February 2023 the government expanded the ministry of Yitzhak Wasserlauf, Minister for the Negev, Galilee and National Resilience, to cover the Negev and Galilee". The text speaks of February 2023, the moment the ministry was widened to cover the Negev and Galilee. The research section gives the title without a date, and says the Negev and Galilee were added in February 2023. So it does not support the title for the time before that widening, and the sentence becomes circular: a "Negev and Galilee" ministry is expanded to cover the Negev and Galilee. | "בפברואר 2023 הרחיבה הממשלה את המשרד של יצחק שמעון וסרלאוף, השר לפיתוח הנגב, הגליל והחוסן הלאומי, כך שיכלול את הנגב והגליל" (the same title and middle-name problems as #1). | Use the full name only, in both languages. English: "in February 2023 the government expanded the ministry of Yitzhak Wasserlauf to cover the Negev and Galilee, and in May 2023 the party obtained an extra NIS 250 million for it." Hebrew: "בפברואר 2023 הרחיבה הממשלה את משרדו של יצחק וסרלאוף כך שיכלול את הנגב והגליל, ובמאי 2023 השיגה המפלגה עבורו 250 מיליון ש״ח נוספים." | fixed |
| 4 | iran-and-regional-security / military-pressure-until-threats-removed | must-fix (meaning drift: strength) | "Israel must not settle for anything less than the dismantling of Hezbollah and must not withdraw from a single inch of territory" | "ישראל לא צריכה להסתפק בפחות מפירוק חיזבאללה ולא תיסוג מאינץ׳ אחד משטח": "לא צריכה" softens "must not", and "לא תיסוג" turns a demand into a prediction. "אינץ׳" also reads as translated. | "ב-15 ביוני 2026 כתב השר לביטחון לאומי איתמר בן גביר שאסור לישראל להסתפק בפחות מפירוק חיזבאללה ואסור לה לסגת אף שעל משטח שצה״ל כבש בלבנון, וב-4 ביוני 2026 הוא כינה את הפסקת האש בלבנון בתיווך אמריקאי טעות חמורה." | fixed |
| 5 | iran-and-regional-security / end-military-operations-regional-peace | must-fix (meaning drift: strength) | "Israel must not withdraw from a single inch of territory the IDF captured in Lebanon" | "ישראל לא תיסוג מאינץ׳ אחד משטח שצה״ל כבש בלבנון" (a prediction, not a demand) | "ב-15 ביוני 2026 כתב השר לביטחון לאומי איתמר בן גביר שאסור לישראל לסגת אף שעל משטח שצה״ל כבש בלבנון, ובאוקטובר 2024 הוא אמר שהמפלגה דורשת ניצחון מוחלט בצפון, ברצועה ומול איראן." | fixed |
| 6 | judea-samaria / partial-sovereignty-area-c | must-fix (loaded wording) | "with a mixed voting record" | "אבל הצבעותיה לא עקביות": "inconsistent" judges the party, while "mixed" only describes the record. | "המפלגה שותפה לחלק מתשובתך, אבל הצבעותיה בנושא לא היו כולן באותו כיוון:" (the rest unchanged) | fixed |
| 7 | crime-in-arab-society / emergency-powers-shin-bet and invest-in-arab-communities-first | should-fix (names and roles; added fact) | "Minister Golan" (surname only, gender not stated) | "השרה גולן" (feminine) | Ruling: Hebrew has to choose a gender, and neither the registry nor the "Leadership and key candidates" section names this minister. The registry's only Golan is Yair Golan of The Democrats, so the masculine form "השר גולן" would be no better supported and could mislead readers. The Hebrew alone cannot fix this. Leave "השרה גולן" for now; the English needs the minister's full name (see "English texts questioned"), and the Hebrew should then follow it. | not applied: depends on the English, logged for the owner |
| 8 | haredi-enlistment / voluntary-service-for-all | should-fix (naturalness; meaning drift) | "He did not apply this to service in general" | "הוא לא יישם זאת על שירות באופן כללי" ("יישם" means "carried out", not "extended the claim to") | "הוא לא אמר זאת על שירות באופן כללי, ואמר שהמפלגה מאמינה בגיוס לצבא." | fixed |
| 9 | religion-and-state / strengthen-jewish-character | should-fix (naturalness) | "bringing Jewish religious law into the legal system" | "הכנסת ההלכה (החוק הדתי היהודי) למערכת המשפט": "הכנסת" can be read as "the Knesset of". | "המכון הישראלי לדמוקרטיה מונה את שילוב ההלכה (החוק הדתי היהודי) במערכת המשפט בין יוזמות המפלגה" | fixed |
| 10 | iran-and-regional-security / force-plus-us-backed-agreements | should-fix (naturalness) | "The party shares your emphasis on military pressure" | "המפלגה שותפה להדגשת הלחץ הצבאי שלך" (reads as "your military pressure") | "המפלגה שותפה לדגש שבתשובתך על לחץ צבאי, אבל היא התנגדה…" (the rest unchanged) | fixed |
| 11 | Ben Gvir's title (about 22 texts and the firearms point) | note | "National Security Minister Itamar Ben Gvir" | "השר לביטחון לאומי איתמר בן גביר" | None needed. The research section says he has been Minister of National Security since late 2022 and resigned on 19 January 2025. He returned "about two months later", which it does not date exactly. Every dated statement given the title falls outside that gap: after 7 October 2023, October 2024, 28 October 2024, 30 September 2025, 16 November 2025, 4, 15 and 22 June 2026, July 2026, and September 2026 (including 6 September). The undated Temple Mount text uses the role the text already gave ("in charge of the police"). The Hebrew role matches the research Hebrew ("כשר לביטחון לאומי"). | n/a |
| 12 | crime-in-arab-society / two texts | note | "Benjamin Netanyahu" (name only) | "בנימין נתניהו" | None needed. The name is the registry form. The research section supports "Prime Minister" only for 5 November 2023, not for the 15 July 2026 decision, so leaving out the role is correct. | n/a |
| 13 | gaza / hold-positions-disarmament-first | note | "which go beyond holding current positions" | "וזה הולך מעבר להישארות במקומות שבהם צה״ל נמצא כעת" | Slightly informal, but it follows the option's Hebrew wording. Acceptable. | n/a |
| 14 | religion-and-state / strengthen-jewish-character and the three unclear texts | note | "only tentatively" / "The tentative indication" | "רק בהסתייגות" / "הסימן הלא ודאי" | No "זמני" or "זמנית". The hedge is kept. | n/a |
| 15 | religion-and-state / three unclear texts | note | "Jewish practice" | "מנהגים יהודיים" | Close enough. An unclear text implies no stance. | n/a |
| 16 | judicial-system / broad-agreed-constitutional-framework | note | "a Basic Law: Legislation" | "חוק יסוד: החקיקה" | The article is part of the bill's own title, not one added inside it. Acceptable. | n/a |

## English names completed

The Hebrew author's English edits were checked against `content/registry/` and the "Leadership and key candidates" section of `content/research/en/jewish-national-front.md`, for the date each text speaks of.

- "National Security Minister Itamar Ben Gvir" at first mention, in 20 option texts (crime ×2, gaza ×5, haredi-enlistment ×4, iran ×4, judea-samaria ×2, october-7-inquiry ×3) and the firearms point ("the ministry of National Security Minister Itamar Ben Gvir"); religion-and-state / strengthen-jewish-character ("as National Security Minister, in charge of the police, Itamar Ben Gvir"). **Confirmed** for every date (see #11). No text speaks of a date between 19 January 2025 and his return.
- "Benjamin Netanyahu" (name only) in crime / emergency-powers-shin-bet and invest-in-arab-communities-first. **Confirmed** (see #12).
- "the ministry of Yitzhak Wasserlauf, Minister for the Negev, Galilee and National Resilience" in housing / speed-up-planning-and-construction and state-led-affordable-rental. **Confirmed**: these speak of the present ministry, and the role matches the research section. The Hebrew form of the title still needs fixing (#1, #2).
- The same edit in housing / develop-periphery-and-transport. **Must-fix** (#3): the role is not supported for the February 2023 moment the text describes. Use the full name only.
- "Minister Golan": no change was made, and the name is still incomplete in both languages (#7).
- No other English changes were found in the diff.

## English texts questioned

- crime-in-arab-society / emergency-powers-shin-bet and invest-in-arab-communities-first: "Minister Golan" gives no first name or gender. The registry and the leadership section don't identify this minister, and the registry's only Golan (Yair Golan, The Democrats) is a different person. The English should give the minister's full name and role through Stage 7c, from the research's crime section. The Hebrew then uses the matching gendered form.

## What was verified

1. Structure: done by script. Removing `lang` and `text` leaves the two files identical. 37 option texts, 1 unclear, 3 points.
2. `agreement` values: done by the same script. All identical and in English.
3. Anchors: done by the same script. Identical.
4. Meaning: every text read side by side with the English. The drift found is in #4, #5 and #8.
5. Strength and hedging: done. "Must not" was weakened in #4 and #5. Elsewhere the hedges ("tentatively", "mixed evidence", "limited evidence") are kept.
6. Fits the label: done. Each Hebrew text read alone matches its value, and the unclear texts imply no stance.
7. Glossary: done against content/glossary.json (חרדים, יהודה ושומרון, החלת ריבונות ישראלית, חטופים, ועדת חקירה ממלכתית, עידוד הגירה מרצון, ההלכה (החוק הדתי היהודי), מתקפת 7 באוקטובר, יישובים, היועץ המשפטי לממשלה). No `avoid.he` terms. "שונה ממך" is used as the convention requires.
8. Neutral: done. One loaded word found (#6). "נחקרים" refers to the legal system, never to a party.
9. Natural Hebrew: done. Should-fixes #8–#10. The user is addressed through gender-neutral forms ("תשובתך", "לתשובתך").
10. Form: done. At most 2 sentences per text, and 1 per point. No poll figures, IDs, links or Markdown. Dates are day first. Majorities come first (25 מול 24, 62 מול 48, 61 מול 41). No article inside "חוק עונש מוות למחבלים". Names follow the registry, except the extra "שמעון" (#1–#3). The option wording is reused ("למי ששירתו", "במקומות שבהם צה״ל נמצא").

Validation: `CONTENT_CORPUS=real pnpm validate:content` passed. The Hebrew file raises no error. Re-run after the fix round: passed, with no error from this file.

Fix round: `git diff HEAD -- content/matching/texts/` shows exactly the suggested text for #1–#6 and #8–#10, both files. The only English change is develop-periphery-and-transport, now the full name alone (#3). No other text changed.
