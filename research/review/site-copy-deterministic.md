# Site copy for deterministic matching (Task 2.7 of `tasks-deterministic-matching.md`)

> **STATUS: Draft, 2026-10-13. Neutrality review and Hebrew/English parity check done and applied (see Reviews below). Not yet approved by the owner** (a product approval, not a content review). One finding is an open decision for the owner: point 7 below.

This file sits beside `site-copy-review.md` (the copy approved on 2026-10-06) and records only what changed for the move to matching by fixed rules on the user's device, and to two kinds of party page. Copy not listed here is unchanged from the approved version.

## For the owner

The wording decisions that matter. Everything else is in the tables below.

1. **Privacy promise.** The site now says "your answers never leave your device" and "we can't see, store or log them", in place of "we don't save your answers".
2. **What we do receive.** Two anonymous counts: that a survey was started, and which party came out closest together with the three next closest. The text says they are kept only as daily totals in a database service the site uses, are for the operator only, are never published, and that the first counts surveys, not people.
3. **AI.** Privacy & Terms no longer has an AI-provider section or an abuse-protection section. It says "No AI system processes your answers, and no outside company receives them." How this works says "No AI runs when you use the site."
4. **How matching is explained.** Picking the party's main position is full agreement, a close one counts partly, a far one counts for little or nothing. A second position, or one resting on weaker evidence, counts for less. No numbers or weights are given.
5. **Unclear and rejected positions are both explained.** An undocumented position "adds only a little to the party's match" and is shown as unclear, as is a weakly evidenced position when you picked a different one. A position the party rejected, for example by voting against it, is shown as "disagrees" even when the party's own position is close.
6. **Not every list is researched, said openly.** The research section is now titled "Which parties were researched, and how" and opens with that fact. It is repeated on the intro page, the Parties page and under Limitations ("can't appear in your result, whatever its positions are").
7. **The sentence that depends on polls.** Until the blackout: "Every list that was polling at 1% or more when the research was done was researched, along with three smaller lists." **Open decision for you (neutrality review, S1):** once this rule has been published, the "official details only" label on each of the other parties can be read as "polled below 1%" through the blackout, whatever the replacement sentence says. The conservative option is never to publish this sentence and to show the one in point 8 from launch.
8. **Its replacement from the blackout onward.** "Which lists to research was decided when the research was done." It gives no criterion at all. The earlier draft ("a measurable public presence") was dropped because it still pointed at polls and belittled the other lists.
9. **Who checked the content.** "The final set was reviewed before publication" is gone. The text now says each check was a separate AI step that had not written what it checked, that "no one's personal view decides what a party's position is", and that "the site's operator did not review or edit the content about the parties".
10. **No party counts in the copy.** The text says "the parties that were researched" and "the other parties", not 28 and 24, so it stays right if the final lists change on 18 October. Say if you want the numbers.
11. **Cookies.** Added "no outside service sets cookies on it", now that there is no bot-check service.
12. **Closeness line on the result.** Now "Parties next to each other in this list are often almost equally near to your answers, so a small difference in order means little", because neighbours are not always close. Also left as it was: "Takes about 5–10 minutes", although the survey is one step shorter now.

## What changed, in short

- **Rewritten:** How this works (research, matching, polls, limitations and neutrality sections), Privacy & Terms (summary, answers, device, counts, cookies, hosting), the intro page's privacy note, steps 2 and 3 and neutrality paragraph, the Parties page description and intro, and the result's loading text.
- **Removed:** `Privacy.sections.ai` and `Privacy.sections.abuse` (title, paragraph and placeholder each) and `HowItWorks.sections.matching.placeholder`. No bracketed "to be completed" placeholder is left anywhere, and the dashed placeholder box is gone from the page component.
- **Poll blackout:** one paragraph is stored in the message files as a pair, `pollDerived` and `neutral` (`HowItWorks.sections.research.paragraphs[0]`). Before the blackout the page shows the first; from the blackout onward it shows the second, and the first is not in the page at all. A tab opened before the blackout swaps at the instant, through the same mechanism that hides poll notes elsewhere.
- **Checked and left as they were:** `Ranking.stepLabel` ("Step 1 of 3" is right for ranking, answers, result), `Answers`, `MatchErrors`, `Preview`, `Research`, `Polls`, `Share`, `Metadata`, `Footer`, `TimeModes`, and the How this works "Corrections" section.
- **Automated guards:** `messages/messages.test.ts` now also fails if the AI-provider or abuse sections, a placeholder, or the old wording (write your own, anything else, "can take a little while", "every party on the ballot is researched") comes back. `lib/prose.test.ts` checks that exactly one paragraph is marked as poll-derived, that its neutral replacement mentions no polls, and that no unmarked paragraph states a polling level.

## The copy changed or added in Task 2.7

Keys are the message IDs in the code, without the namespace named in each heading. `paragraphs[n]` is the paragraph's position in its section, counted from 0, in the new text. Paragraphs of a section that are not listed are unchanged. Hebrew is the default language.

### Intro page (`Home`)

| Key | English | עברית |
|---|---|---|
| `privacyNote` | Your answers stay on your device and are never sent anywhere. We keep only anonymous counts. | התשובות שלך נשארות במכשיר שלך ואף פעם לא נשלחות לשום מקום. אנחנו שומרים רק ספירות אנונימיות. |
| `steps.answer.body` | For each issue you ranked, pick the one position closest to yours from a short list. | בכל נושא שדירגת בוחרים מתוך רשימה קצרה עמדה אחת, הקרובה ביותר לשלך. |
| `steps.result.body` | The five parties closest to your answers, with an issue-by-issue explanation linked to the research. You can also open the rest of the researched parties, in order. | חמש המפלגות הקרובות ביותר לתשובות שלך, עם הסבר לפי נושא שמקושר למחקר. אפשר לפתוח גם את שאר המפלגות שנחקרו, לפי הסדר. |
| `neutralBody` | This tool has no party affiliation and no ads, and no party pays for it or has any say in its content. Every party included in the matching was researched in the same way, and every research page is open to read. Parties that were not researched in depth are shown with their official details only and are not included in the matching. | לכלי הזה אין זיקה מפלגתית ואין בו פרסומות, ואף מפלגה לא משלמת עליו ולא משפיעה על התוכן שלו. כל המפלגות שנכללות בהתאמה נחקרו באותה דרך, וכל דפי המחקר פתוחים לקריאה. מפלגות שלא נחקרו לעומק מוצגות עם הפרטים הרשמיים שלהן בלבד ואינן נכללות בהתאמה. |
| `howItWorksLink` | Read how the issues were chosen, how the parties were researched and how matching works | איך נבחרו הנושאים, איך נחקרו המפלגות ואיך פועלת ההתאמה |

### How this works page (`HowItWorks`)

| Key | English | עברית |
|---|---|---|
| `description` | How the issues were chosen, which parties were researched and how, how matching works, and the tool’s limitations. | איך נבחרו הנושאים, אילו מפלגות נחקרו ואיך, איך פועלת ההתאמה ומהן המגבלות של הכלי. |
| `intro` | This page explains how the issues were chosen, which parties were researched and how, how your answers are compared with the parties’ positions, and what the tool can’t do. | בעמוד הזה מוסבר איך נבחרו הנושאים, אילו מפלגות נחקרו ואיך, איך התשובות שלך מושוות לעמדות של המפלגות ומה הכלי לא יכול לעשות. |
| `sections.issues.paragraphs[1]` | For each issue we wrote a short neutral description, a question, and the most common real-world positions on it (3 to 6, depending on the issue). In the survey, you pick one of these positions for each issue. Each position describes a policy approach and its stated reasons, worded so that its own supporters would recognise it as fair. The Hebrew and English versions say the same thing, each written to read naturally and neutrally in its language. | לכל נושא כתבנו תיאור קצר וניטרלי, שאלה, ואת העמדות הנפוצות ביותר בפועל (בין 3 ל־6, לפי הנושא). בשאלון בוחרים בכל נושא אחת מהעמדות האלה. כל עמדה מתארת גישה למדיניות ואת הנימוקים שלה, בניסוח שגם תומכיה יראו בו הוגן. הגרסה העברית והגרסה האנגלית אומרות אותו דבר, וכל אחת מהן נכתבה כך שתישמע טבעית וניטרלית בשפתה. |
| `sections.research.title` | Which parties were researched, and how | אילו מפלגות נחקרו, ואיך |
| `sections.research.paragraphs[0].pollDerived` | Not every list on the ballot was researched in depth. Every list that was polling at 1% or more when the research was done was researched, along with three smaller lists. The other lists are shown with their official details only. | לא כל הרשימות שבפתק נחקרו לעומק. נחקרו כל הרשימות שקיבלו בסקרים 1% או יותר בזמן עריכת המחקר, ועוד שלוש רשימות קטנות יותר. שאר הרשימות מוצגות עם הפרטים הרשמיים שלהן בלבד. |
| `sections.research.paragraphs[0].neutral` | Not every list on the ballot was researched in depth. Which lists to research was decided when the research was done. The other lists are shown with their official details only. | לא כל הרשימות שבפתק נחקרו לעומק. ההחלטה אילו רשימות לחקור התקבלה בזמן עריכת המחקר. שאר הרשימות מוצגות עם הפרטים הרשמיים שלהן בלבד. |
| `sections.research.paragraphs[1]` | The parties that were researched in depth are included in the matching, and each has its own research page. Parties running together on a joint list were researched separately, each with its own page. | המפלגות שנחקרו לעומק נכללות בהתאמה, ולכל אחת מהן יש דף מחקר משלה. מפלגות שרצות יחד ברשימה משותפת נחקרו כל אחת בנפרד, ולכל אחת יש דף משלה. |
| `sections.research.paragraphs[2]` | For the other parties, the site shows only official details: the party’s name, its list, its ballot letters, its leader and the top candidates on the list. Where the party has a platform of its own, there is also a link to it. We have not checked that platform. These parties are not included in the matching, and the site says nothing about their positions. | על שאר המפלגות האתר מציג רק פרטים רשמיים: שם המפלגה, הרשימה, אותיות הפתק, היו״ר והמועמדים המובילים ברשימה. אם למפלגה יש מצע משלה, מופיע גם קישור אליו. את המצע הזה לא בדקנו. המפלגות האלה אינן נכללות בהתאמה, והאתר לא אומר דבר על העמדות שלהן. |
| `sections.research.paragraphs[3]` | Each research page follows the same structure: overview, leadership, the party’s position on each of the 10 issues, other notable positions, coalition stance, track record, legal matters involving its leaders, and sources. | כל דף מחקר בנוי באותו מבנה: סקירה כללית, הנהגה, עמדת המפלגה בכל אחד מ־10 הנושאים, עמדות בולטות נוספות, עמדה קואליציונית, רקורד, הליכים משפטיים הנוגעים למנהיגיה, ומקורות. |
| `sections.research.paragraphs[5]` | The research was compiled with AI research tools, working from public sources. Each document was then checked against its sources by a separate AI step, and all the documents were reviewed together for consistent depth and tone. Every substantive claim cites its source, and each page shows the date it was researched. | המחקר נערך בעזרת כלי מחקר מבוססי בינה מלאכותית, על סמך מקורות פומביים. כל מסמך נבדק אחר כך מול המקורות שלו בשלב נפרד, גם הוא בעזרת בינה מלאכותית, וכל המסמכים נבדקו יחד כדי לוודא עומק וטון אחידים. כל טענה מהותית מלווה במקור, ובכל דף מופיע התאריך שבו נחקר. |
| `sections.research.paragraphs[6]` | No one’s personal view decides what a party’s position is. The site’s operator did not review or edit the content about the parties. Each check was done by a separate AI step that had not written the content it checked. | דעה אישית של אף אחד לא קובעת מהי העמדה של מפלגה. מפעיל האתר לא בדק ולא ערך את התוכן על המפלגות. כל בדיקה נעשתה בשלב נפרד של בינה מלאכותית, שלב שלא כתב את התוכן שבדק. |
| `sections.matching.paragraphs[0]` | Matching follows fixed rules and uses content prepared in advance from the research. No AI runs when you use the site, and the same answers always give the same result. Everything in a result comes from the published research pages, so you can check it on this site. | ההתאמה פועלת לפי כללים קבועים ומשתמשת בתוכן שהוכן מראש מתוך המחקר. שום בינה מלאכותית לא פועלת בזמן השימוש באתר, ואותן תשובות נותנות תמיד אותה תוצאה. כל מה שמופיע בתוצאה מבוסס על דפי המחקר שמפורסמים באתר, כך שאפשר לבדוק אותו כאן. |
| `sections.matching.paragraphs[1]` | For each issue, the research was used to record which of the survey’s positions each party holds. Some parties are recorded with a main position and a second one, and a position that rests on weaker evidence is recorded as such and counts for less. The site compares the position you picked with what is recorded for the party. If you picked the party’s main position, that is full agreement. If the party’s position is close to yours, it counts partly. If it is far from yours, it counts for little or nothing. How close any two positions are was set once for each issue, and is the same for every party. | בכל נושא נרשם, על סמך המחקר, איזו מהעמדות שבשאלון היא העמדה של כל מפלגה. לחלק מהמפלגות נרשמו עמדה עיקרית ועמדה נוספת, ועמדה שנשענת על ראיות חלשות יותר נרשמת ככזו ונחשבת פחות. האתר משווה את העמדה שבחרת למה שנרשם למפלגה. אם בחרת בעמדה העיקרית של המפלגה, זו הסכמה מלאה. אם העמדה של המפלגה קרובה לשלך, היא נחשבת חלקית. אם היא רחוקה משלך, היא כמעט לא נחשבת, או לא נחשבת בכלל. מידת הקרבה בין כל שתי עמדות נקבעה פעם אחת לכל נושא, והיא זהה לכל המפלגות. |
| `sections.matching.paragraphs[2]` | Issues you rank higher count for more. Issues you mark as “doesn’t matter to me” count for nothing. | לנושאים שדירגת גבוה יותר יש משקל גדול יותר. לנושאים שסימנת כ״לא משנה לי״ אין משקל בכלל. |
| `sections.matching.paragraphs[3]` | Where the research found no documented position for a party on an issue, that issue adds only a little to the party’s match, and the result says that the party’s position is unclear. The result also says “unclear” where the research has only weak evidence of the party’s position and you picked a different position. Where the research shows that a party rejected a position, for example by voting against it, the result says the party disagrees with it, even if the party’s own position is close to it. | כשהמחקר לא מצא עמדה מתועדת של מפלגה בנושא מסוים, הנושא הזה מוסיף רק מעט להתאמה של אותה מפלגה, והתוצאה מציינת שעמדת המפלגה לא ברורה. התוצאה מציינת ״לא ברורה״ גם כשיש במחקר רק ראיות חלשות לעמדת המפלגה, והעמדה שבחרת שונה ממנה. כשהמחקר מראה שמפלגה דחתה עמדה מסוימת, למשל בהצבעה נגדה, התוצאה מציינת שהמפלגה לא מסכימה איתה, גם אם העמדה של המפלגה עצמה קרובה אליה. |
| `sections.matching.paragraphs[4]` | A party’s actions count for more than its statements. This is applied when the party’s positions are recorded from the research. The recorded positions and the explanations shown in a result were each checked against the research by a separate AI step. | למעשים של מפלגה יש משקל גדול יותר מאשר להצהרות שלה. הכלל הזה מיושם בשלב שבו עמדות המפלגה נרשמות מתוך המחקר. העמדות שנרשמו וההסברים שמופיעים בתוצאה נבדקו כל אחד מול המחקר, בשלב נפרד של בינה מלאכותית. |
| `sections.matching.paragraphs[6]` | All of this is worked out on your own device. Your answers are never sent anywhere. | כל החישוב הזה נעשה במכשיר שלך. התשובות שלך אף פעם לא נשלחות לשום מקום. |
| `sections.matching.paragraphs[7]` | The result shows the five closest parties in full, and you can open the rest of the researched parties below them, in order. Parties next to each other in that order are often almost equally near to your answers, so a small difference in position means little. For each party you can see, issue by issue, whether it agrees, partly agrees or disagrees with the position you picked, or that its position is unclear, with a short explanation that links to the relevant part of its research page. Each party also comes with a few “also worth knowing” points about notable positions outside the 10 issues. These points don’t affect the match. | התוצאה מציגה במלואן את חמש המפלגות הקרובות ביותר, ומתחתיהן אפשר לפתוח את שאר המפלגות שנחקרו, לפי הסדר. מפלגות שסמוכות זו לזו בסדר הזה קרובות פעמים רבות לתשובות שלך כמעט באותה מידה, ולכן להבדל קטן במיקום אין משמעות רבה. לכל מפלגה אפשר לראות, נושא אחרי נושא, אם היא מסכימה, מסכימה חלקית או לא מסכימה עם העמדה שבחרת, או שעמדתה לא ברורה, עם הסבר קצר שמקושר לחלק המתאים בדף המחקר שלה. לכל מפלגה מופיעות גם כמה נקודות תחת ״כדאי לדעת גם״, על עמדות בולטות שלה מחוץ ל־10 הנושאים. הנקודות האלה לא משפיעות על ההתאמה. |
| `sections.polls.paragraphs[0]` | A researched party’s page shows its list’s polling average from a fixed snapshot, with its source and date. Pages of parties that were not researched show no poll information. If the list of a party in your result is polling below the electoral threshold (3.25%), the result notes that, with the date. Lists that don’t appear in published polls are noted as such. These notes are factual only; they are not advice about how to vote. | בדף של מפלגה שנחקרה מוצג ממוצע הסקרים של הרשימה שלה, מתוך תמונת מצב קבועה, עם המקור והתאריך. בדפים של מפלגות שלא נחקרו לא מוצג מידע על סקרים. אם הרשימה של מפלגה שמופיעה בתוצאה שלך נמצאת בסקרים מתחת לאחוז החסימה (3.25%), התוצאה מציינת זאת, יחד עם התאריך. רשימות שלא מופיעות בסקרים שפורסמו מסומנות ככאלה. ההערות האלה עובדתיות בלבד; הן לא עצה למי להצביע. |
| `sections.limitations.paragraphs[0]` | No tool can capture everything that matters to you. 10 issues and a few fixed positions on each simplify a complicated reality, and your own view may not be exactly any of the positions offered. | שום כלי לא יכול לתפוס את כל מה שחשוב לך. 10 נושאים וכמה עמדות קבועות בכל אחד מהם הם פישוט של מציאות מורכבת, וייתכן שהעמדה שלך לא זהה בדיוק לאף אחת מהעמדות המוצעות. |
| `sections.limitations.paragraphs[1]` | Not every list on the ballot is included in the matching. A party that was not researched in depth can’t appear in your result, whatever its positions are. | לא כל הרשימות שבפתק נכללות בהתאמה. מפלגה שלא נחקרה לעומק לא יכולה להופיע בתוצאה שלך, בלי קשר לעמדות שלה. |
| `sections.limitations.paragraphs[3]` | Some of the researched parties, especially new or small ones, have little public record. Their pages say so, and so does the result if one of them is among your matches. | על חלק מהמפלגות שנחקרו, בעיקר חדשות או קטנות, יש מעט מידע פומבי. הדפים שלהן מציינים זאת, וכך גם התוצאה אם אחת מהן מופיעה בין ההתאמות שלך. |
| `sections.neutrality.paragraphs[0]` | This tool has no party affiliation and no ads. No party funds it, influences it, or reviews or approves its content. Every party that was researched was researched with the same structure and the same evidence standards. All the parties, researched or not, are listed together in alphabetical order, never by size or polls. | לכלי הזה אין זיקה מפלגתית ואין בו פרסומות. אף מפלגה לא מממנת אותו, לא משפיעה עליו ולא בודקת או מאשרת את התוכן שלו. כל המפלגות שנחקרו נחקרו באותו מבנה ולפי אותם סטנדרטים של ראיות. כל המפלגות, בין שנחקרו ובין שלא, מוצגות יחד לפי סדר האלף־בית, אף פעם לא לפי גודל או סקרים. |

### Privacy & Terms page (`Privacy`)

| Key | English | עברית |
|---|---|---|
| `description` | Your answers stay on your device and are never sent anywhere. We keep only anonymous counts. Here is exactly what happens to your information. | התשובות שלך נשארות במכשיר שלך ואף פעם לא נשלחות לשום מקום. אנחנו שומרים רק ספירות אנונימיות. כאן מוסבר בדיוק מה קורה למידע שלך. |
| `intro` | In short: no accounts, no personal details, and your answers never leave your device. | בקצרה: אין חשבונות, אין פרטים אישיים, והתשובות שלך אף פעם לא יוצאות מהמכשיר שלך. |
| `sections.summary.paragraphs[0]` | Your answers stay on your device. Your result is worked out there, and your answers are never sent to us or to anyone else. | התשובות שלך נשארות במכשיר שלך. התוצאה מחושבת בו, והתשובות שלך אף פעם לא נשלחות אלינו או לאף אחד אחר. |
| `sections.summary.paragraphs[1]` | The only things the site receives are two anonymous counts: that a survey was started, and which parties came out as the closest match and the three next closest. | הדברים היחידים שהאתר מקבל הם שתי ספירות אנונימיות: שהתחילו למלא שאלון, ואילו מפלגות יצאו בתוצאה כהתאמה הקרובה ביותר וכשלוש הקרובות הבאות. |
| `sections.answers.paragraphs[0]` | Your result is worked out in your own browser. The site sends your browser the positions recorded for each party and the explanation texts, and the comparison with your answers happens there. Your ranking and the positions you pick are never sent to the site, so we can’t see, store or log them. | התוצאה שלך מחושבת בדפדפן שלך. האתר שולח לדפדפן את העמדות שנרשמו לכל מפלגה ואת נוסחי ההסברים, וההשוואה לתשובות שלך נעשית שם. הדירוג שלך והעמדות שבחרת לא נשלחים לאתר אף פעם, ולכן אנחנו לא יכולים לראות, לשמור או לתעד אותם. |
| `sections.answers.paragraphs[1]` | No AI system processes your answers, and no outside company receives them. | שום מערכת בינה מלאכותית לא מעבדת את התשובות שלך, ושום חברה חיצונית לא מקבלת אותן. |
| `sections.device.paragraphs[0]` | While you take the survey, your progress is saved only in your own browser, so you can close the page and come back to it. Once your result is shown, the saved progress is deleted from your browser. | בזמן מילוי השאלון, ההתקדמות שלך נשמרת רק בדפדפן שלך, כדי שאפשר יהיה לסגור את הדף ולחזור אליו. אחרי שהתוצאה מוצגת, ההתקדמות השמורה נמחקת מהדפדפן. |
| `sections.counts.title` | Anonymous counts | ספירות אנונימיות |
| `sections.counts.paragraphs[0]` | The site receives two anonymous counts. One is sent when a new survey is started. The other is sent when a result is shown, and names only the party that came out as the closest match and the three next closest. Neither contains your answers or anything that identifies you. | האתר מקבל שתי ספירות אנונימיות. האחת נשלחת כשמתחילים למלא שאלון חדש. השנייה נשלחת כשמוצגת תוצאה, וכוללת רק את המפלגה שיצאה כהתאמה הקרובה ביותר ואת שלוש המפלגות הקרובות הבאות. אף אחת מהן לא כוללת את התשובות שלך או משהו שמזהה אותך. |
| `sections.counts.paragraphs[1]` | The counts are kept only as daily totals, in a database service the site uses. They are for the site’s operator only and are never published. The first one counts surveys started, not people. | הספירות נשמרות רק כמספרים כוללים לכל יום, בשירות מסד נתונים שהאתר משתמש בו. הן מיועדות למפעיל האתר בלבד, ולא מתפרסמות אף פעם. הספירה הראשונה סופרת כמה פעמים התחילו למלא שאלון, לא כמה אנשים. |
| `sections.cookies.paragraphs[0]` | The site uses one cookie, to remember your choice of language. It doesn’t use advertising or tracking cookies, and no outside service sets cookies on it. | האתר משתמש בעוגייה אחת, כדי לזכור את השפה שבחרת. הוא לא משתמש בעוגיות פרסום או מעקב, ושום שירות חיצוני לא שומר בו עוגיות. |
| `sections.hosting.paragraphs[0]` | Like any website, our hosting provider may keep standard technical logs, such as IP addresses, for security and operation. Your answers are never sent, so they are never in these logs. | כמו בכל אתר, ספק האחסון שלנו עשוי לשמור יומנים טכניים רגילים, כמו כתובות IP, לצורכי אבטחה ותפעול. התשובות שלך לא נשלחות, ולכן הן אף פעם לא נמצאות ביומנים האלה. |

### Parties index (`Parties`)

| Key | English | עברית |
|---|---|---|
| `description` | Every party on the ballot, in alphabetical order. Parties that were researched have a research page; the others are shown with their official details. | כל המפלגות שבפתק, לפי סדר האלף־בית. למפלגות שנחקרו יש דף מחקר; שאר המפלגות מוצגות עם הפרטים הרשמיים שלהן. |
| `intro` | Every party on the ballot, in alphabetical order. A party marked as researched has a research page covering its positions on the 10 issues, its track record and its sources, and is included in the matching. The other parties are shown with their official details only and are not included in the matching. You don’t need to take the survey to read these pages. | כל המפלגות שבפתק, לפי סדר האלף־בית. למפלגה שמסומנת כ״נחקרה״ יש דף מחקר עם העמדות שלה ב־10 הנושאים, הרקורד שלה והמקורות, והיא נכללת בהתאמה. שאר המפלגות מוצגות עם הפרטים הרשמיים שלהן בלבד ואינן נכללות בהתאמה. לא צריך למלא את השאלון כדי לקרוא את הדפים. |

### Result (`Result`)

| Key | English | עברית |
|---|---|---|
| `loadingBody` | Loading the data needed to work out your result on this device. | טוענים את הנתונים שדרושים לחישוב התוצאה במכשיר הזה. |
| `weakMatch` | Even the closest party is not a close match for your positions. | אפילו המפלגה הקרובה ביותר אינה קרובה במיוחד לעמדות שלך. |
| `allPartiesNote` | Parties next to each other in this list are often almost equally near to your answers, so a small difference in order means little. | מפלגות שסמוכות זו לזו בסדר הזה קרובות פעמים רבות לתשובות שלך כמעט באותה מידה, ולכן להבדל קטן במיקום אין משמעות רבה. |
| `notAllLists` | Some lists on the ballot were not researched in depth and are not included in the matching. <link>See all the parties</link>. | חלק מהרשימות שבפתק לא נחקרו לעומק ואינן נכללות בהתאמה. <link>לכל המפלגות</link>. |

## Copy added in Tasks 2.2 to 2.6, checked here and kept as it is

These strings were written as working wording when the survey, result and party pages were rebuilt. They were read again for this task against the product description and kept unchanged, so they are new since the approval of 2026-10-06 and belong to the same review.

### Parties index (`Parties`)

| Key | English | עברית |
|---|---|---|
| `tier.researched` | Researched · included in the matching | נחקרה · נכללת בהתאמה |
| `tier.listed` | Official details only · not in the matching | פרטים רשמיים בלבד · לא נכללת בהתאמה |

### Party pages (`Research`)

| Key | English | עברית |
|---|---|---|
| `listedDescription` | Official details for {name}: list, ballot letters, leader and top candidates. This party was not researched in depth. | פרטים רשמיים על {name}: רשימה, אותיות הפתק, יו״ר ומועמדים מובילים. המפלגה לא נחקרה לעומק. |
| `topCandidates` | Top candidates on the list | המועמדים המובילים ברשימה |
| `listedNote` | This party was not researched in depth and is not included in the matching. This page shows only its official details. | המפלגה הזו לא נחקרה לעומק ואינה נכללת בהתאמה. בדף הזה מופיעים רק הפרטים הרשמיים שלה. |
| `platformHeading` | The party’s own platform | המצע של המפלגה עצמה |
| `platformLink` | Open the party’s platform (external site) | למצע המפלגה (אתר חיצוני) |
| `platformNote` | This is the party’s own material. We have not checked it. | זה חומר של המפלגה עצמה. לא בדקנו אותו. |

### Step 2: answers (`Answers`)

| Key | English | עברית |
|---|---|---|
| `instructions` | Choose the position closest to yours. | בוחרים את העמדה הקרובה ביותר לשלך. |
| `needAnswer` | Choose a position to continue. | כדי להמשיך, בוחרים עמדה. |
| `submit` | See my result | לתוצאה שלי |

### Result (`Result`)

| Key | English | עברית |
|---|---|---|
| `position` | #{n} | מקום {n} |
| `showAll` | {count, plural, one {Show the one other party} other {Show the other # parties}} | {count, plural, one {להצגת המפלגה הנוספת} other {להצגת # המפלגות הנוספות}} |
| `pointsHeading` | Also worth knowing | כדאי לדעת גם |
| `pointLinkAria` | See point {n} in the research on {name} | לקריאת נקודה {n} במחקר על {name} |

### Error messages (`MatchErrors`)

| Key | English | עברית |
|---|---|---|
| `bundle_load_failed` | We couldn’t load the data needed to work out your result. Your answers are still saved on this device. Check your connection and try again. | לא הצלחנו לטעון את הנתונים שדרושים לחישוב התוצאה. התשובות שלך עדיין שמורות במכשיר הזה. כדאי לבדוק את החיבור לרשת ולנסות שוב. |

## Reviews

Both reviews were done on 2026-10-13 by agents that did not write the copy. The tables above show the text after their findings were applied.

- **Neutrality and accuracy review** (`site-copy-deterministic-neutrality.md`): 1 must-fix, 6 should-fix. Applied: M1 (the blackout replacement sentence now gives no criterion), S2 (the counts are kept in a database service the site uses), S3 (an unclear position "adds only a little to the party's match"; the weak-evidence case of "unclear" is explained), S4 (main and second positions, weaker evidence counts for less), S5 (the closeness line is no longer stated as always true), S6 ("the three next closest" instead of "runners-up"). **Not applied, waiting for the owner: S1**, whether to publish the poll-derived sentence at all.
- **Hebrew/English parity check** (`site-copy-deterministic-parity.md`): no must-fix, 2 should-fix, 6 notes. Applied: S1 ("אף פעם" in the four Hebrew privacy promises), S2 and N1 (the closeness line points at "this order" / "בסדר הזה" in Hebrew so it can't be read as an electoral list), N2 ("בהצבעה נגדה"; the rest was replaced by the neutrality rewrite), N3, N4 (through neutrality S6), N5 ("מספרים כוללים לכל יום"), N6 ("אפילו").
- **Owner approval:** not yet given.

## Owner decision on the list-selection sentence (2026-10-13)

The owner chose not to publish the polling criterion at all. `HowItWorks.sections.research.paragraphs[0]` is now a plain paragraph in both languages, shown from launch:

- EN: Not every list on the ballot was researched in depth. Which lists to research was decided when the research was done. The other lists are shown with their official details only.
- HE: לא כל הרשימות שבפתק נחקרו לעומק. ההחלטה אילו רשימות לחקור התקבלה בזמן עריכת המחקר. שאר הרשימות מוצגות עם הפרטים הרשמיים שלהן בלבד.

The poll-derived wording ("polling at 1% or more") and the blackout swap on the How-this-works page were removed, so the "official details only" label can never be read as a poll result. A unit test guards against that wording returning. This supersedes points 7 and 8 of the "For the owner" list above and closes finding S1 of the neutrality review.
