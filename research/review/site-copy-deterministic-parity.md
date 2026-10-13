# Hebrew/English parity check of the deterministic-matching site copy

Checked 2026-10-13 by an agent that did not write the copy. Scope: every key listed in `site-copy-deterministic.md` (44 changed or added keys, plus the 18 working-wording keys from Tasks 2.2 to 2.6), read from `messages/en.json` and `messages/he.json`. No message file or code was changed.

## Verdict

- **Must-fix: 0**
- **Should-fix: 2** (one covers four keys)
- **Notes: 6** (optional)
- All other pairs are fine: same meaning, same placeholders, same terms.

## Programmatic checks

| Check | Result |
|---|---|
| Key sets of `en.json` and `he.json` | Identical: 320 paths in each, none only in one file |
| Shapes (object / array / string) and array lengths | Identical at every path |
| `HowItWorks.sections.research.paragraphs[0]` | An object in both files, with `pollDerived` and `neutral` in both |
| ICU variables, plural forms and tags | Identical in every string. `Result.showAll` has `one` and `other` in both; `Result.notAllLists` has `<link>` in both |
| The 62 rows of `site-copy-deterministic.md` against the JSON files | All 62 match the JSON exactly in both languages |
| Hebrew punctuation | Only gershayim (״) and maqaf (־) are used; no straight quotes, apostrophes or hyphens between Hebrew letters |
| Glossary `avoid` terms | None in either file |

## Should-fix

### S1. "Never sent" is plain "not sent" in four Hebrew privacy statements

- **Keys:** `Home.privacyNote`, `Privacy.description`, `Privacy.sections.summary.paragraphs[0]`, `HowItWorks.sections.matching.paragraphs[6]`
- **Language off:** Hebrew
- **Problem:** English says "never sent"; Hebrew says "לא נשלחות". Elsewhere the Hebrew does say "אף פעם" where English says "never" (`Privacy.intro`, `answers.paragraphs[0]`, `counts.paragraphs[1]`, `sharing`), so the promise reads slightly weaker in exactly these four places. "לשום מקום" already makes it categorical, so this is a small gap, but it is the site's main privacy promise.
- **Replacements (Hebrew):**
  - `Home.privacyNote`: `התשובות שלך נשארות במכשיר שלך ואף פעם לא נשלחות לשום מקום. אנחנו שומרים רק ספירות אנונימיות.`
  - `Privacy.description`: `התשובות שלך נשארות במכשיר שלך ואף פעם לא נשלחות לשום מקום. אנחנו שומרים רק ספירות אנונימיות. כאן מוסבר בדיוק מה קורה למידע שלך.`
  - `Privacy.sections.summary.paragraphs[0]`: `התשובות שלך נשארות במכשיר שלך. התוצאה מחושבת בו, והתשובות שלך אף פעם לא נשלחות אלינו או לאף אחד אחר.`
  - `HowItWorks.sections.matching.paragraphs[6]`: `כל החישוב הזה נעשה במכשיר שלך. התשובות שלך אף פעם לא נשלחות לשום מקום.`
- `Privacy.sections.hosting.paragraphs[0]` has the same pattern in its first clause ("לא נשלחות, ולכן הן אף פעם לא נמצאות"), but "אף פעם" already appears in that sentence and repeating it would read badly. Left as it is.

### S2. `Result.allPartiesNote`: Hebrew drops "this", and "רשימה" also means an electoral list

- **Language off:** Hebrew
- **Problem:** English says "in this list"; Hebrew says "ברשימה". The site uses "רשימה" for electoral lists, so "מפלגות שסמוכות זו לזו ברשימה" can be read as parties that share a joint list.
- **Replacement (Hebrew):** `מפלגות שסמוכות זו לזו ברשימה הזו קרובות לתשובות שלך במידה דומה.`

## Notes (optional)

### N1. `HowItWorks.sections.matching.paragraphs[7]`: the same "list" ambiguity, in both languages

Both languages say "in the list" / "ברשימה", so parity holds. Pointing at the result's order would remove the ambiguity in both. Only the second sentence changes:

- English: `The result shows the five closest parties in full, and you can open the rest of the researched parties below them, in order. Parties next to each other in that order are about equally near to your answers. For each party you can see, issue by issue, whether it agrees, partly agrees or disagrees with the position you picked, or that its position is unclear, with a short explanation that links to the relevant part of its research page. Each party also comes with a few “also worth knowing” points about notable positions outside the 10 issues. These points don’t affect the match.`
- Hebrew: `התוצאה מציגה במלואן את חמש המפלגות הקרובות ביותר, ומתחתיהן אפשר לפתוח את שאר המפלגות שנחקרו, לפי הסדר. מפלגות שסמוכות זו לזו בסדר הזה קרובות לתשובות שלך במידה דומה. לכל מפלגה אפשר לראות, נושא אחרי נושא, אם היא מסכימה, מסכימה חלקית או לא מסכימה עם העמדה שבחרת, או שעמדתה לא ברורה, עם הסבר קצר שמקושר לחלק המתאים בדף המחקר שלה. לכל מפלגה מופיעות גם כמה נקודות תחת ״כדאי לדעת גם״, על עמדות בולטות שלה מחוץ ל־10 הנושאים. הנקודות האלה לא משפיעות על ההתאמה.`

### N2. `matching.paragraphs[1]` and `[3]`: "נחשבת" for "counts"

The meaning is the same and it is understandable, but "נחשבת באופן חלקי" and "נחשב רק מעט" read less naturally than "יש משקל", which paragraphs `[2]` and `[4]` use for the same English verb. In `[3]`, "למשל הצביעה נגדה" is also slightly clipped. Optional Hebrew replacements:

- `[1]`: `בכל נושא נרשם, על סמך המחקר, באיזו מהעמדות שבשאלון כל מפלגה מחזיקה. האתר משווה את העמדה שבחרת לעמדה שנרשמה למפלגה. אם זו אותה עמדה, זו הסכמה מלאה. אם העמדה של המפלגה קרובה לשלך, היא מקבלת משקל חלקי. אם היא רחוקה משלך, היא מקבלת משקל קטן או לא מקבלת משקל בכלל. מידת הקרבה בין כל שתי עמדות נקבעה פעם אחת לכל נושא, והיא זהה לכל המפלגות.`
- `[3]`: `כשהמחקר לא מצא עמדה מתועדת של מפלגה בנושא מסוים, לנושא הזה יש רק משקל קטן אצל אותה מפלגה, והתוצאה מציינת שעמדת המפלגה לא ברורה. כשהמחקר מראה שמפלגה דחתה עמדה מסוימת, למשל בהצבעה נגדה, התוצאה מציינת שהמפלגה לא מסכימה איתה, גם אם העמדה של המפלגה עצמה קרובה אליה.`

### N3. `research.paragraphs[6]`: "שלא כתב את התוכן שהוא בדק"

The masculine verb refers to "שלב" but follows the feminine "בינה מלאכותית", so the reader stumbles. The meaning matches the English. Optional Hebrew replacement:

`דעה אישית של אף אחד לא קובעת מהי העמדה של מפלגה. מפעיל האתר לא בדק ולא ערך את התוכן על המפלגות. כל בדיקה נעשתה בשלב נפרד של בינה מלאכותית, שלב שלא כתב את התוכן שבדק.`

### N4. "שהתחיל שאלון" / "כשמתחיל שאלון חדש" / "שאלונים שהתחילו"

Correct and equivalent, but the rest of the Hebrew uses the impersonal plural ("מדרגים", "בוחרים"). Optional Hebrew replacements:

- `Privacy.sections.summary.paragraphs[1]`: `הדברים היחידים שהאתר מקבל הם שתי ספירות אנונימיות: שהתחילו למלא שאלון, ואילו מפלגות יצאו ההתאמה הקרובה ביותר והבאות אחריה.`
- `Privacy.sections.counts.paragraphs[0]`: `האתר מקבל שתי ספירות אנונימיות. האחת נשלחת כשמתחילים שאלון חדש. השנייה נשלחת כשמוצגת תוצאה, וכוללת רק את המפלגות שיצאו ההתאמה הקרובה ביותר והבאות אחריה. אף אחת מהן לא כוללת את התשובות שלך או משהו שמזהה אותך.`

### N5. `Privacy.sections.counts.paragraphs[1]`: "daily totals" as "סיכומים יומיים"

"סיכומים" can also mean "summaries", which is a little looser than "totals". Optional Hebrew replacement:

`הספירות נשמרות רק כמספרים כוללים לכל יום. רק מפעיל האתר רואה אותן, והן לא מתפרסמות אף פעם. הספירה הראשונה סופרת שאלונים שהתחילו, לא אנשים.`

### N6. `Result.weakMatch`: "Even" as "גם"

"גם" works; "אפילו" is the closer word. Optional Hebrew replacement: `אפילו המפלגה הקרובה ביותר אינה קרובה במיוחד לעמדות שלך.`

## Checked and fine

**Statements the brief singled out**

| Statement | English | Hebrew | Result |
|---|---|---|---|
| Can't appear in your result (`limitations[1]`) | "can’t appear in your result, whatever its positions are" | "לא יכולה להופיע בתוצאה שלך, בלי קשר לעמדות שלה" | Same |
| The site has not checked (`research[2]`, `Research.platformNote`) | "We have not checked that platform" / "We have not checked it" | "את המצע הזה לא בדקנו" / "לא בדקנו אותו" | Same |
| Counts only a little (`matching[3]`) | "counts only a little for that party" | "נחשב רק מעט עבור אותה מפלגה" | Same (see N2 for style) |
| Disagrees even when close (`matching[3]`) | "disagrees with it, even if the party’s own position is close to it" | "לא מסכימה איתה, גם אם העמדה של המפלגה עצמה קרובה אליה" | Same |
| What the site receives (`summary[1]`, `counts[0]`, `counts[1]`) | two anonymous counts; daily totals; operator only; never published; surveys, not people | the same five points | Same (see N4, N5 for style) |
| Can't see, store or log (`answers[0]`) | "never sent to the site, so we can’t see, store or log them" | "לא נשלחים לאתר אף פעם, ולכן אנחנו לא יכולים לראות, לשמור או לתעד אותם" | Same |
| No AI, no outside company (`answers[1]`, `matching[0]`) | as written | as written | Same |
| Operator did not review (`research[6]`) | "did not review or edit" | "לא בדק ולא ערך" | Same |

**Label names.** The How-this-works text uses the result page's label strings in both languages: Agrees / Partly agrees / Disagrees / Party’s position unclear, and מסכימה / מסכימה חלקית / לא מסכימה / עמדת המפלגה לא ברורה. "Also worth knowing" / "כדאי לדעת גם" matches `Result.pointsHeading`. "נחקרה" in `Parties.intro` matches `Parties.tier.researched`.

**Numbers.** 1%, three smaller lists, 3 to 6 positions, five parties, 10 issues and 3.25% appear in both languages with the same value.

**The poll-blackout pair.** `pollDerived` and `neutral` say the same thing in both languages, and neither language's `neutral` mentions polls.

**Form of address.** The new Hebrew keeps the impersonal plural and the gender-neutral "שלך", "שדירגת", "שבחרת", in line with the unchanged strings.

**All remaining keys** in the document, including the other working-wording keys (`tier.*`, `listedDescription`, `topCandidates`, `listedNote`, `platformHeading`, `platformLink`, `Answers.*`, `position`, `showAll`, `pointsHeading`, `pointLinkAria`, `bundle_load_failed`), were compared and need no change.
