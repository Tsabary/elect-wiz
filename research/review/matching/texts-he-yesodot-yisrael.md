# Hebrew texts parity check: yesodot-yisrael

- Checked on 14 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author, Sonnet · Parity check by: Stage 7d parity checker, Opus (different)
- Structure, agreement values and anchors: identical ✔
- Texts compared: 33 option texts + 2 unclear + 3 points · must-fix: 1 · should-fix: 11 · notes: 3
- Fix round confirmed on 14 October 2026 (from `git diff HEAD` of the Hebrew file): must-fix 1 of 1 fixed; should-fix 10 of 11 fixed, 1 partly applied (finding 7)
- Result: pass after fixes (all must-fix fixed; one small should-fix residue in finding 7). The English role question is not a Hebrew finding; it is logged for the owner in `research/review/hebrew-english-questioned.md`

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| 1 | cost-of-living / direct-support-for-households | must-fix (meaning drift) | "the joint list's economic plan gives reservists and working families priority" | "התוכנית הכלכלית של הרשימה המשותפת נותנת" | Bare "הרשימה המשותפת" reads in Hebrew as the Arab Joint List. Full text: "זה מרכיב משני בעמדת המפלגה. תוכנית מגן דוד כוללת עזרה ממוקדת להורים עובדים ולמשרתי מילואים, והתוכנית הכלכלית של רשימת ישר נותנת למשרתי מילואים ולמשפחות עובדות עדיפות בסיוע המדינה ובסבסוד מעונות יום, אבל שתיהן מציבות במקום הראשון את פתיחת השווקים לתחרות וליבוא." | fixed: confirmed (suggested Hebrew applied exactly) |
| 2 | cost-of-living / open-market-competition-imports | should-fix (glossary / naturalness) | "the Yashar joint list's economic plan" | "התוכנית הכלכלית של הרשימה המשותפת ישר" | "הרשימה המשותפת" invites confusion with the Arab Joint List; use "רשימת ישר". Full text: "זו העמדה המתועדת העיקרית של המפלגה. תוכנית מגן דוד, שראש המפלגה חילי טרופר הציג במשותף ב-5 באוגוסט 2026, מתחייבת להוריד מחירים באמצעות "עידוד תחרות, פירוק מונופולים והפחתת הריכוזיות בשוק" ולפתוח את המשק ליבוא, והתוכנית הכלכלית של רשימת ישר מבטיחה לפתוח את השוק ליבוא מקביל." | fixed: confirmed (suggested Hebrew applied exactly) |
| 3 | crime-in-arab-society / more-police-resources-normal-law | should-fix (glossary / naturalness) | "the Yashar joint list's plan builds up the police" | "ותוכנית הרשימה המשותפת ישר מחזקת את המשטרה" | Replace that phrase with "והתוכנית של רשימת ישר מחזקת את המשטרה". Full text: "חלק מהתיעוד של המפלגה מצביע לכאן: ב-10 בדצמבר 2025 הצביע ראש המפלגה חילי טרופר נגד הצעת חוק שתאפשר להכריז על ארגוני פשיעה כארגוני טרור, והתוכנית של רשימת ישר מחזקת את המשטרה בתקציב חירום לארבע שנים. לפי המחקר, הממצאים מצביעים לכיוונים שונים: תוכנית מגן דוד שהוא הציג במשותף ב-5 באוגוסט 2026 מציעה אגף ייעודי של השב״כ." | fixed: confirmed (suggested Hebrew applied exactly) |
| 4 | crime-in-arab-society / invest-in-arab-communities-first | should-fix (glossary / naturalness) | "the Yashar joint list's plan builds up the police" | "ותוכנית הרשימה המשותפת ישר מחזקת את המשטרה" | Full text: "הגישה המתועדת של המפלגה היא אכיפה: תוכנית מגן דוד מ-5 באוגוסט 2026 מציעה אגף ייעודי של השב״כ, רשות ממשל במשרד לביטחון לאומי ועונשים כבדים יותר, והתוכנית של רשימת ישר מחזקת את המשטרה. המחקר לא מצא עמדה של ראש המפלגה, חילי טרופר, בעניין השקעה ביישובים הערביים כדרך להילחם בפשיעה." | fixed: confirmed (suggested Hebrew applied exactly) |
| 5 | gaza / hold-positions-disarmament-first | should-fix (glossary / structure: quote boundary) | "the Yashar joint list's leader, Gadi Eisenkot, said Israel "must not accept a reality in which Hamas survives, rearms"" | "אמר גדי איזנקוט, ראש הרשימה המשותפת ישר, שאסור לישראל "לקבל מציאות שבה חמאס שורד, מתחמש מחדש"" | "must not accept" is inside the English quotation but outside the Hebrew one; also "רשימת ישר". Full text: "חלק מהתיעוד עולה בקנה אחד עם תשובתך: ב-1 באוגוסט 2026 אמר גדי איזנקוט, ראש רשימת ישר, שישראל "אסור לה לקבל מציאות שבה חמאס שורד, מתחמש מחדש". עמדתה המתועדת העיקרית של המפלגה, מפי ראש המפלגה חילי טרופר בינואר 2024, היא שליטה ביטחונית ישראלית עם מנהלה מקומית בלי חמאס, ולפי המחקר הממצאים מצביעים לכיוונים שונים." | fixed: confirmed (suggested Hebrew applied exactly) |
| 6 | gaza / advance-international-arrangement | should-fix (glossary / naturalness) | "Yashar joint list leader Gadi Eisenkot" | "גדי איזנקוט, ראש הרשימה המשותפת ישר" | Full text: "הגישה המתועדת של המפלגה שונה: בינואר 2024 אמר ראש המפלגה חילי טרופר ש"כוח מקומי שאינו חמאס" צריך לנהל את העניינים האזרחיים בפיקוח ביטחוני ישראלי, וב-1 באוגוסט 2026 מתח גדי איזנקוט, ראש רשימת ישר, ביקורת על מסגרת מועצת השלום שנועדה ליישם את התוכנית האמריקאית. לא נמצאה אמירה של המפלגה על עזה אחרי הפסקת האש באוקטובר 2025." | fixed: confirmed (suggested Hebrew applied exactly) |
| 7 | gaza / end-war-full-withdrawal | should-fix (structure: quote boundary) | that "stopping the war is not a price Israel can pay" (whole clause quoted) | ושהפסקת המלחמה היא "לא מחיר שישראל יכולה לשלם" ("stopping the war" moved outside the quotation) | Full text: "הגישה המתועדת של המפלגה שונה. בינואר 2024 אמר ראש המפלגה חילי טרופר, אז שר בממשלת החירום, שעל ישראל לשמור על חופש פעולה ביטחוני בעזה, וש"הפסקת המלחמה היא לא מחיר שישראל יכולה לשלם"." | partly applied: the quote boundary is fixed ("הפסקת המלחמה היא" is now inside the quote), but the text has ", ש"הפסקת…" where the suggestion had ", וש"הפסקת…"; without the ו the clause reads as an apposition. Restore "וש"הפסקת המלחמה היא לא מחיר שישראל יכולה לשלם"". Should-fix, naturalness |
| 8 | haredi-enlistment / anchor-torah-study-exemption | should-fix (glossary: project convention) | "against the final readings of the Security Service Law (Amendment No. 28 – temporary provision)" | "נגד הקריאות האחרונות של חוק שירות הביטחון (תיקון מס' 28 – הוראת שעה)" | Project convention: "final reading" is "הקריאה השלישית"; for the plural "final readings" of one law the standard Hebrew is "בקריאה השנייה והשלישית". Full text: "עמדתה המתועדת של המפלגה שונה. ראש המפלגה חילי טרופר הצביע ב-14 ביולי 2026 נגד חוק שירות הביטחון (תיקון מס' 28 – הוראת שעה) בקריאה השנייה והשלישית, ואמר ביולי 2026: "אם בחרתם לא לשרת, המדינה לא צריכה לממן אתכם."" | fixed: confirmed (suggested Hebrew applied exactly) |
| 9 | haredi-enlistment / gradual-targets-by-agreement | should-fix (naturalness) | "The party shares the idea of benefits for those who serve and of service tracks suited to different populations, in the Magen David Plan of 5 August 2026." | "המפלגה מסכימה עם הרעיון של הטבות ... לאוכלוסיות שונות, בתוכנית מגן דוד מ-5 באוגוסט 2026." (trailing "בתוכנית" reads as translated) | Full text: "המפלגה שותפה לרעיון של הטבות למי שמשרתים ושל מסלולי שירות המתאימים לאוכלוסיות שונות, כפי שעולה מתוכנית מגן דוד מ-5 באוגוסט 2026. ההבדל הוא שהתוכנית מטילה סנקציות על מי שאינם משרתים, והמחקר ממקם את המפלגה קרוב יותר לשירות לכל אזרח ואזרחית עם סנקציות מאשר ליעדים שנתיים." | fixed: confirmed (suggested Hebrew applied exactly) |
| 10 | october-7-inquiry / state-commission-under-existing-law | should-fix (glossary / naturalness) | "the Yashar joint list's leader, Gadi Eisenkot" | "גדי איזנקוט, ראש הרשימה המשותפת ישר" | Full text: "זו העמדה המתועדת של המפלגה. ראש המפלגה חילי טרופר הצביע בעד הצעות חוק של האופוזיציה להקמת ועדת חקירה ממלכתית ב-17 ביולי 2024, ב-12 בנובמבר 2025 וב-1 ביולי 2026, וב-5 באוגוסט 2026 התחייב גדי איזנקוט, ראש רשימת ישר, שנשיא בית המשפט העליון ימנה את חבריה." | fixed: confirmed (suggested Hebrew applied exactly) |
| 11 | october-7-inquiry / commission-chosen-by-neutral-mechanism | should-fix (glossary / naturalness) | "the Yashar joint list's leader, Gadi Eisenkot" | "גדי איזנקוט, ראש הרשימה המשותפת ישר" | Full text: "עמדתה המתועדת של המפלגה שונה: ב-5 באוגוסט 2026 התחייב גדי איזנקוט, ראש רשימת ישר, לוועדת חקירה ממלכתית שחבריה ימונו בידי נשיא בית המשפט העליון "בהתייעצות עם שופטים אחרים". ראש המפלגה חילי טרופר הצביע בעד הצעות חוק לוועדת חקירה ממלכתית ב-17 ביולי 2024, ב-12 בנובמבר 2025 וב-1 ביולי 2026." | fixed: confirmed (suggested Hebrew applied exactly) |
| 12 | religion-and-state / more-choice-local-decisions | should-fix (structure: 3 sentences) | 2 sentences | 3 sentences (the English first sentence split in two) | Full text: "זו העמדה המתועדת הקרובה ביותר של המפלגה, והיא נשענת בעיקר על הצבעותיו של ראש המפלגה חילי טרופר, שהמחקר יכול היה לבדוק ברובן רק לפי שם הצעת החוק; לפי המחקר, הממצאים מצביעים בחלקם לכיוונים שונים. הוא הצביע בעד שתי הצעות חוק בשם "הפעלת תחבורה ציבורית בשבת" ב-19 בנובמבר 2025 ובעד הצעת החוק "נישואין וגירושין" ב-7 ביוני 2023." | fixed: confirmed (suggested Hebrew applied exactly) |
| 13 | all texts naming Tropper | note | "party leader Chili Tropper" | "ראש המפלגה חילי טרופר" | No change in Hebrew: matches the English and the convention ("party leader" → "ראש המפלגה"); the short name form matches the registry's English "Chili Tropper" (registry Hebrew has the full "חילי (יחיאל משה) טרופר"). If Stage 7c changes the role wording for pre-July-2026 dates (see "English texts questioned"), the Hebrew must follow. | n/a |
| 14 | cost-of-living / direct-support-for-households | note (naturalness) | "targeted help" | "עזרה ממוקדת" | Optional: "סיוע ממוקד" reads slightly more natural, and matches "סיוע המדינה" later in the sentence. | n/a |
| 15 | point 2 (other-terror-supporters-elections) | note | "a party inside a joint list" | "מפלגה בתוך רשימה משותפת" | Generic, indefinite use; correct and not confusable with the Arab Joint List. No change. | n/a |

## English names completed

None. `git diff HEAD -- content/matching/texts/en/yesodot-yisrael.json` is empty: the author made no change to the English file, as reported. The names and roles in the English (Chili Tropper, Gadi Eisenkot, Yoaz Hendel) come from Stage 7c. Names match `content/registry/` (Hebrew: חילי טרופר, גדי איזנקוט, יועז הנדל, המילואימניקים, ישר).

## English texts questioned

Role "party leader" applied to Chili Tropper for dates when he did not hold it. The research ("Leadership and key candidates"; "Overview") supports "party founder and leader" of Yesodot Yisrael only from its founding in July 2026 (registration reported 7 July 2026). Until 3 May 2026 he was a Blue and White / National Unity MK (minister in the emergency government 12 October 2023 – 13 June 2024), and between May and July 2026 he had no party. Each text below puts the role "party leader" on its first mention of Tropper in a sentence about an event before July 2026 (no text change in the Hebrew is asked for: the Hebrew "ראש המפלגה" mirrors the English and should be redone after Stage 7c). A possible wording for Stage 7c: "Chili Tropper, who now leads the party," (or "the party's founder, Chili Tropper,"), and keep "then a minister in the emergency government" where it appears.

1. crime-in-arab-society / more-police-resources-normal-law: vote of 10 December 2025.
2. gaza / resume-fighting-full-control: statement of January 2024 (the text adds "then a minister in the emergency government").
3. gaza / hold-positions-disarmament-first: "from party leader Chili Tropper in January 2024".
4. gaza / advance-international-arrangement: statement of January 2024.
5. gaza / end-war-full-withdrawal: statement of January 2024 (adds "then a minister").
6. gaza / defeat-hamas-then-security-control: statement of January 2024 (adds "then a minister").
7. haredi-enlistment / universal-service-with-sanctions: votes of 17 May 2023 and 22 October 2025.
8. haredi-enlistment / voluntary-service-for-all: vote of 17 May 2023.
9. judea-samaria / full-sovereignty: votes of 22 January, 22 October and 31 December 2025.
10. judea-samaria / partial-sovereignty-area-c: votes of 15 March 2023 and 2025.
11. judea-samaria / maintain-current-situation: undated votes for sovereignty bills (in the research, 2023–2025).
12. judea-samaria / one-equal-state: votes of 22 January and 22 October 2025.
13. judicial-system / continue-judicial-changes: votes in 2023 and on 27 March 2025 (the 15 July 2026 vote is after founding).
14. judicial-system / repeal-changes-protect-independence: votes in 2023 and 27 March 2025; bill of December 2024.
15. judicial-system / keep-current-system-stability: vote of 27 March 2025.
16. october-7-inquiry / state-commission-under-existing-law: votes of 17 July 2024 and 12 November 2025 (and 1 July 2026, also before founding).
17. october-7-inquiry / commission-appointed-by-knesset-balance: vote of 24 December 2025.
18. october-7-inquiry / commission-chosen-by-neutral-mechanism: votes of 17 July 2024, 12 November 2025, 1 July 2026.
19. religion-and-state / strengthen-jewish-character: vote of 28 June 2023.
20. religion-and-state / keep-status-quo: statement of November 2022.
21. religion-and-state / more-choice-local-decisions: votes of 19 November 2025 and 7 June 2023.
22. religion-and-state / separate-religion-and-state: vote of 19 November 2025.
23. Point 1 (other-governance-term-limits): bill of December 2024.
24. Point 2 (other-terror-supporters-elections): bill of November 2024.
25. Point 3 (other-death-penalty): vote of 30 March 2026 (he was still in Blue and White).

Not questioned (role holds for the date): cost-of-living / open-market-competition-imports and crime-in-arab-society / emergency-powers-shin-bet (5 August 2026); crime-in-arab-society / invest-in-arab-communities-first (present tense); haredi-enlistment / anchor-torah-study-exemption (14 July 2026); judea-samaria / separation-two-states (30 September 2026) and two-states-pre-1967-border (July 2026); judicial-system / broad-agreed-constitutional-framework (Srugim report on the August 2026 plan).

No `agreement` label is questioned: no positions-row problem was found in this check.

## What was verified

1. Structure: done by script; partyId, lang "he", the same 10 issues, the same option IDs in the same order, `unclear` for housing and iran-and-regional-security in both, 3 points in the same order, no extra keys.
2. Agreement values: done by script; all 33 identical and in English.
3. Anchors: done by script; all 10 issue anchors and 3 point anchors identical.
4. Meaning: done, every text read side by side; facts, dates, numbers (68–9, 62–48, 60 days, four-year budget), names and vote directions match. One drift (finding 1, list identity).
5. Strength and hedging: done; "may share" kept as "ייתכן ש", "the research calls the evidence mixed / partly mixed" kept as "לפי המחקר, הממצאים מצביעים (בחלקם) לכיוונים שונים", definite statements stay definite.
6. Label fit in Hebrew: done; every Hebrew text read alone reads as its label; the two unclear texts imply no stance.
7. Glossary: done; השב״כ (שירות הביטחון הפנימי של ישראל), ועדת חקירה ממלכתית, שינויים במערכת המשפט, החלת ריבונות ישראלית, יהודה ושומרון, התיישבות, חוק יסוד, תלמידי ישיבות, נישואים אזרחיים, היישובים הערביים, החברה הערבית used; nothing from `avoid.he` found; "final reading" convention checked (finding 8; "הקריאה השלישית" correct elsewhere).
8. Neutral: done; no loaded verbs found ("מתנגדים בתוקף" renders "firmly oppose"); no "נחקרה"/"שנחקרו"; no "זמני/זמנית".
9. Natural Hebrew: done; findings 9, 12, 14; the user is addressed as "תשובתך"/"איתך", which reads the same for men and women.
10. Form: done; sentence counts checked by script (finding 12 the only text over limit); no poll figures, option IDs, citations, links or Markdown; dates day first; no Latin acronyms in prose; English quotation marks kept as straight quotes in Hebrew (quote boundaries: findings 5, 7); names in registry Hebrew forms.

Fix round: no "הרשימה המשותפת" or "הקריאות האחרונות" remains; only the 12 texts named in findings 1–12 changed; agreement values and anchors untouched. Re-validation after the fix round: `CONTENT_CORPUS=real pnpm validate:content` passed (content, self-match 0 blocking, profiles 16/16); no error from the Hebrew file; self-match report not left modified.

First-round validation: `CONTENT_CORPUS=real pnpm validate:content` passed (content validation, self-match 28 parties with 0 blocking, profile test 16/16); the Hebrew file raises no error. `research/review/matching/self-match-report.md` was not left modified.

## Orchestrator note (14 October 2026)
Finding 7's leftover (the missing "ו" before "ש\"הפסקת המלחמה…" in gaza / end-war-full-withdrawal) was added by the author and verified by the orchestrator against the checker's exact suggested text: the file now reads `וש"הפסקת המלחמה היא לא מחיר שישראל יכולה לשלם"`, and that one character is the only change since the checker's confirmation. Finding 7 is fully fixed; nothing is open.
