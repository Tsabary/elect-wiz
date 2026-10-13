# Neutrality and accuracy review of the deterministic-matching site copy

Reviewed 2026-10-13 by an agent that did not write the copy. Covers every key listed in `site-copy-deterministic.md` (the Task 2.7 keys and the 18 working-wording keys from Tasks 2.2 to 2.6), read from `messages/en.json` and `messages/he.json`. Nothing in the message files or the code was changed.

**Checked against:** `prd-deterministic-matching.md`, `research/legal-findings.md` §3.1 and §3.5, `content/glossary.json`, and the code that the copy describes (`lib/tally/`, `lib/matching/score.ts`, `lib/survey/storage.ts`, `components/survey/survey-app.tsx`, `components/result/`, `lib/prose.ts`, the party and How this works pages, `content/matching/config.json` and `content/matching/positions/`).

**Verdict:** 1 must-fix, 6 should-fix, 9 notes. No glossary `avoid` term appears in either language. Nothing nudges toward or away from a party or camp, and nothing reads as voting advice. The Hebrew keeps the site's convention (impersonal plural verbs such as "בוחרים", and "שלך", "שבחרת", "שדירגת", which are spelled the same for both genders).

## Must-fix

### M1. The blackout replacement sentence conveys poll information and belittles the other lists

- **Key:** `HowItWorks.sections.research.paragraphs[0].neutral` (English and Hebrew)
- **Problem:** "The lists that had a measurable public presence … were researched" tells the reader that every list marked "Official details only" had no measurable public presence. That is the same signal as "doesn't appear in published polls", which legal-findings §3.1 treats as arguably covered and says to hide ("implying negligible support"). "Measurable" (Hebrew "שאפשר למדוד") points at polls as the measure. The sentence is shown only during the blackout, which is exactly when it must carry no such signal. It is also a neutrality problem on its own: it describes a named group of lists as having no public presence.
- **Fix:** say nothing about the criterion during the blackout.

| | Replacement |
|---|---|
| English | Not every list on the ballot was researched in depth. Which lists to research was decided when the research was done. The other lists are shown with their official details only. |
| עברית | לא כל הרשימות שבפתק נחקרו לעומק. ההחלטה אילו רשימות לחקור התקבלה בזמן עריכת המחקר. שאר הרשימות מוצגות עם הפרטים הרשמיים שלהן בלבד. |

Both pass the guard in `lib/prose.test.ts` (no "poll", "סקר", "1%").

## Should-fix

### S1. The tier label itself becomes a poll-derived label during the blackout (owner decision, and a question for a lawyer)

- **Keys:** `HowItWorks.sections.research.paragraphs[0].pollDerived` together with `Parties.tier.listed`, `Research.listedNote`, `Result.notAllLists` (both languages)
- **Problem:** until the blackout the site publishes the rule "every list polling at 1% or more was researched". The labels "Official details only · not in the matching" then stay on 24 named parties through the blackout. Anyone who read the rule earlier, or sees a cached or archived copy, can read each label as "this list polled below 1%". Legal-findings §3.1 warns against a replacement "that leaks the same signal, such as showing the note only for some parties". Swapping one sentence does not remove this, whatever the replacement says.
- **Options:** (a) the conservative one: never publish the poll-derived sentence, and show the M1 wording from launch. This costs transparency about how the lists were chosen, and it contradicts the PRD line that How this works explains the 1% rule, so it needs the owner. (b) Keep the design and accept the residual risk, ideally after asking a lawyer. The copy cannot solve this by wording.

### S2. The counts are stored with an outside provider, but the text says only the operator sees them

- **Key:** `Privacy.sections.counts.paragraphs[1]` (both)
- **Problem:** the counts are kept in an Upstash Redis database (`lib/tally/counter.ts`, `.env.example`). "Seen only by the site's operator" is stronger than what is true, and the page elsewhere says "no outside company receives them" about the answers, which makes a reader assume the same for the counts.

| | Replacement |
|---|---|
| English | The counts are kept only as daily totals, in a database service the site uses. They are for the site’s operator only and are never published. The first one counts surveys started, not people. |
| עברית | הספירות נשמרות רק כסיכומים יומיים, בשירות מסד נתונים שהאתר משתמש בו. הן מיועדות למפעיל האתר בלבד, ולא מתפרסמות אף פעם. הספירה הראשונה סופרת כמה פעמים התחילו למלא שאלון, לא כמה אנשים. |

### S3. "That issue counts only a little" can be read as the issue being given less weight, and one "unclear" case is not explained

- **Key:** `HowItWorks.sections.matching.paragraphs[3]` (both)
- **Problem:** the issue keeps its full weight; the party gets a small fixed share on it (0.25). The PRD chose this over skipping the issue, and the current wording reads like skipping. Also, the result shows "position unclear" in a second case the page does not mention: the research has only tentative evidence for the party's position and the user picked a different one (`issueAgreement` in `lib/matching/score.ts`; PRD "Result"). The Hebrew "נחשב רק מעט עבור אותה מפלגה" is also translated-sounding.

| | Replacement |
|---|---|
| English | Where the research found no documented position for a party on an issue, that issue adds only a little to the party’s match, and the result says that the party’s position is unclear. The result also says “unclear” where the research has only weak evidence of the party’s position and you picked a different position. Where the research shows that a party rejected a position, for example by voting against it, the result says the party disagrees with it, even if the party’s own position is close to it. |
| עברית | כשהמחקר לא מצא עמדה מתועדת של מפלגה בנושא מסוים, הנושא הזה מוסיף רק מעט להתאמה של אותה מפלגה, והתוצאה מציינת שעמדת המפלגה לא ברורה. התוצאה מציינת ״לא ברורה״ גם כשיש במחקר רק ראיות חלשות לעמדת המפלגה, והעמדה שבחרת שונה ממנה. כשהמחקר מראה שמפלגה דחתה עמדה מסוימת, למשל הצביעה נגדה, התוצאה מציינת שהמפלגה לא מסכימה איתה, גם אם העמדה של המפלגה עצמה קרובה אליה. |

### S4. "If they are the same, that is full agreement" is not always true

- **Key:** `HowItWorks.sections.matching.paragraphs[1]` (both)
- **Problem:** the text describes one recorded position per party. In the content, 170 of 398 recorded positions are second or weakly evidenced positions, which count for less (0.6), so a user who picks one of them sees "partly agrees", not full agreement. The Hebrew also has three stiff phrases: "באיזו מהעמדות … מחזיקה", "נחשבת באופן חלקי", "נחשבת מעט או בכלל לא".

| | Replacement |
|---|---|
| English | For each issue, the research was used to record which of the survey’s positions each party holds. Some parties are recorded with a main position and a second one, and a position that rests on weaker evidence is recorded as such and counts for less. The site compares the position you picked with what is recorded for the party. If you picked the party’s main position, that is full agreement. If the party’s position is close to yours, it counts partly. If it is far from yours, it counts for little or nothing. How close any two positions are was set once for each issue, and is the same for every party. |
| עברית | בכל נושא נרשם, על סמך המחקר, איזו מהעמדות שבשאלון היא העמדה של כל מפלגה. לחלק מהמפלגות נרשמו עמדה עיקרית ועמדה נוספת, ועמדה שנשענת על ראיות חלשות יותר נרשמת ככזו ונחשבת פחות. האתר משווה את העמדה שבחרת למה שנרשם למפלגה. אם בחרת בעמדה העיקרית של המפלגה, זו הסכמה מלאה. אם העמדה של המפלגה קרובה לשלך, היא נחשבת חלקית. אם היא רחוקה משלך, היא כמעט לא נחשבת, או לא נחשבת בכלל. מידת הקרבה בין כל שתי עמדות נקבעה פעם אחת לכל נושא, והיא זהה לכל המפלגות. |

### S5. "Parties close together in this list are about equally near" is stated as always true

- **Keys:** `Result.allPartiesNote`, and the same sentence inside `HowItWorks.sections.matching.paragraphs[7]` (both)
- **Problem:** neighbours in the list can be far apart in score (for example the top match and the second). The PRD asks for this line, but as written it is an unconditional claim that is sometimes false.

| Key | English | עברית |
|---|---|---|
| `Result.allPartiesNote` | Parties next to each other in this list are often almost equally near to your answers, so a small difference in order means little. | מפלגות שסמוכות זו לזו ברשימה קרובות פעמים רבות לתשובות שלך כמעט באותה מידה, ולכן להבדל קטן בסדר אין משמעות רבה. |
| `matching.paragraphs[7]`, second sentence only | Parties next to each other in the list are often almost equally near to your answers, so a small difference in order means little. | מפלגות שסמוכות זו לזו ברשימה קרובות פעמים רבות לתשובות שלך כמעט באותה מידה, ולכן להבדל קטן בסדר אין משמעות רבה. |

### S6. The description of the two counts: awkward Hebrew, and "runners-up" is vague and off-register

- **Keys:** `Privacy.sections.summary.paragraphs[1]`, `Privacy.sections.counts.paragraphs[0]` (both)
- **Problem:** Hebrew "שהתחיל שאלון" and "אילו מפלגות יצאו ההתאמה הקרובה ביותר והבאות אחריה" are not natural Hebrew. In English, "runners-up" is contest language and the result page itself says "Next closest". The call sends the top match and the next three (`TOP_ENTRIES = 4`), while the result shows five in full, so "the runners-up" does not tell the reader which parties are sent. If the owner prefers not to state a number, use "the next closest" / "הקרובות הבאות" without "three" / "שלוש".

| Key | English | עברית |
|---|---|---|
| `summary.paragraphs[1]` | The only things the site receives are two anonymous counts: that a survey was started, and which parties came out as the closest match and the three next closest. | הדברים היחידים שהאתר מקבל הם שתי ספירות אנונימיות: שהתחילו למלא שאלון, ואילו מפלגות יצאו בתוצאה כהתאמה הקרובה ביותר וכשלוש הקרובות הבאות. |
| `counts.paragraphs[0]` | The site receives two anonymous counts. One is sent when a new survey is started. The other is sent when a result is shown, and names only the party that came out as the closest match and the three next closest. Neither contains your answers or anything that identifies you. | האתר מקבל שתי ספירות אנונימיות. האחת נשלחת כשמתחילים למלא שאלון חדש. השנייה נשלחת כשמוצגת תוצאה, וכוללת רק את המפלגה שיצאה כהתאמה הקרובה ביותר ואת שלוש המפלגות הקרובות הבאות. אף אחת מהן לא כוללת את התשובות שלך או משהו שמזהה אותך. |

## Notes (no change required)

1. **`Privacy.sections.hosting.paragraphs[0]`.** Accurate. The provider's logs can still show that a device contacted the site, including the address the counts are sent to, though not what a count contained (the tally route logs no bodies). Optional added sentence: "They can show that your device contacted the site, not what you answered." / "הם יכולים להראות שהמכשיר שלך פנה לאתר, לא מה ענית."
2. **`Home.privacyNote`, `Privacy.description`, `Privacy.intro`, `summary.paragraphs[0]`, `answers.paragraphs[0]` and `[1]`.** Fine. Verified in code: answers are never sent, the matching data is fetched without them, and "we can't see, store or log them" holds. The counts are mentioned next to each short promise.
3. **`Privacy.sections.device.paragraphs[0]`, `MatchErrors.bundle_load_failed`, `cookies.paragraphs[0]`.** Fine. Saved progress is cleared when a result is shown and kept on a load error. One cookie in production (`NEXT_LOCALE`); the font is served by the site itself, so no outside service sets cookies.
4. **`HowItWorks.sections.polls.paragraphs[0]`.** No poll information. It describes poll notes in the present tense, which is not true during the blackout, but the next paragraph says so. "Pages of parties that were not researched show no poll information" leaks nothing.
5. **`limitations.paragraphs[3]`.** "Especially new or small ones" is about public record, not polls. Only one researched party (`haredi-public`) carries the limited-information flag today, so "some" is slightly generous. Fine to keep.
6. **`research.paragraphs[5]` and `[6]`, `matching.paragraphs[4]`.** Accurate against the PRD and the handoff note (separate fact-check, consistency review done, operator reviews no content). "No one's personal view decides what a party's position is" is a strong sentence but true as a description of the process, and Limitations already says mistakes are possible. In `[5]`, "were reviewed together" does not say by whom; `[6]` answers it.
7. **"Not researched in depth"** (`Research.listedNote`, `listedDescription`, `Result.notAllLists`, `Home.neutralBody`, `limitations.paragraphs[1]`). These parties were not researched at all, so "in depth" is slightly soft, but it is the PRD's wording, it is not belittling, and it makes no claim about the parties. `platformNote` ("We have not checked it") and `tier.listed` are plain and neutral. Fine.
8. **`Home.howItWorksLink`.** English starts with "Read"; Hebrew has no verb. Natural in each language. For the parity check.
9. **Hebrew, optional polish.** `Privacy.sections.answers.paragraphs[0]`: "נוסחי ההסברים" is a little formal; "הטקסטים של ההסברים" is plainer.

## Strings that are fine as they are

Everything not named above: `Home.steps.answer.body`, `Home.steps.result.body`, `Home.neutralBody`; `HowItWorks.description`, `intro`, `issues.paragraphs[1]`, `research.title`, `research.paragraphs[0].pollDerived` (accurate to the PRD, shown only before the blackout), `research.paragraphs[1]` to `[3]`, `matching.paragraphs[0]`, `[2]`, `[6]`, the rest of `[7]`, `limitations.paragraphs[0]` and `[1]`, `neutrality.paragraphs[0]` (the Parties list is sorted by name with both tiers together); `Privacy.sections.counts.title`; `Parties.description`, `intro`, `tier.researched`, `tier.listed`; `Research.topCandidates`, `platformHeading`, `platformLink`; `Answers.instructions`, `needAnswer`, `submit`; `Result.loadingBody`, `weakMatch`, `position`, `showAll`, `pointsHeading`, `pointLinkAria`. The agreement labels match the four the product uses. Compact rows behind "show all" do open to the same breakdown, points, poll note and limited-information flag as the full cards, as the copy says.
