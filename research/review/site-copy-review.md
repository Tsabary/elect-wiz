# Site copy review (Task 2.9)

> **STATUS: Approved by the owner on 2026-10-06. The owner did not review every string; they will report anything they see while browsing.**
>
> Decisions recorded with the approval (2026-10-06):
> - **No contact channel.** The owner decided the site will have no contact email or other contact channel, ever. The Privacy & Terms "Contact" section and both contact-address placeholders were removed, and the How this works "Corrections" section no longer invites users to report errors (it keeps only the statement about how research pages are corrected). This resolves the contact-address item below.
> - **Working name kept for now.** "Party Matcher" / "התאמת מפלגות" stays as the site name for now.

Prepared 2026-10-06. Covers all non-corpus copy: intro, How this works, Privacy & Terms, disclaimers, weak-match message, threshold and not-polled wording, poll-blackout wording, error messages and every interface string (including screen-reader-only labels). The issues, options and research text are corpus content, reviewed separately (Task 1.5 and Phase 3).

## What to check

1. **Placeholders (bracketed, shown on the site in dashed boxes)** that need decisions or input later:
   - How this works → Matching: the matching system description, after D1.
   - Privacy & Terms → AI provider: provider name, retention terms link, after D1.
   - Privacy & Terms → Abuse protection: which service, what it processes, cookies, after D1. The "one cookie" sentence must be re-checked then.
   - ~~How this works → Corrections and Privacy & Terms → Contact: an anonymous contact address is needed from the owner before launch~~ **Resolved 2026-10-06: no contact channel.** The placeholders and the Contact section were removed.
2. **Site name** "Party Matcher" / "התאמת מפלגות" is a working name. **Kept for now (owner, 2026-10-06).**
3. **Hebrew address form:** the Hebrew uses impersonal/infinitive forms ("מדרגים", "לוחצים") and gender-ambiguous "שלך" to stay gender-neutral.
4. **Honesty statements** worth confirming: the research is described as compiled with AI research tools, checked by a separate AI step, and reviewed before publication; "we never store your answers" (with the AI provider's own retention terms disclosed separately).

## Reviews done (by agents other than the drafter)

**Neutrality review.** Verdict: no must-fix issues. No glossary-avoided terms, nothing favouring a party or community, nothing identifying the operator. Its 10 should-fix and 4 optional findings were all applied:

- Removed "recommended party" wording (How this works → Polls), which contradicted "not a recommendation".
- "Also close" → "Next closest" (and Hebrew "הקרובות הבאות"), so runner-up labels don't contradict the weak-match message.
- Privacy claims narrowed to what we control: "we never store your answers"; the AI section says we send answers without identifying details and asks users not to type personal details into free text (also added to the write-your-own placeholder).
- Added an Abuse protection section with a post-D1 placeholder.
- How this works now says the fact-check was a separate AI step and that the final set was reviewed before publication.
- Hebrew gendered spelling fixed ("אלייך").
- Neutrality statement: parties don't "review or approve" content (instead of "in advance").
- English "until polls close" → "until voting ends" (avoids ambiguity with opinion polls).
- Contact placeholders now say the address must be anonymous. (Superseded 2026-10-06: the contact placeholders were removed; no contact channel.)
- Optional: Hebrew register smoothed ("של אילו מפלגות העמדות המתועדות…"), "closest to you" → "closest to your positions", "sent once" → "sent only when you ask for your result", and a plural-address slip in the ranking instructions fixed.

**Hebrew/English parity check.** Verdict: no must-fix issues. Its 7 should-fix findings were all applied (English "recommended party" wording; Hebrew gendered spelling; the Hebrew "switch to Hebrew" label made gender-neutral "מעבר לעברית"; the research-link aria label now starts with the visible text in both languages; English "anything else" hint word order; Hebrew share text names the site in quotes; Hebrew "גישה מדינית" → "גישה למדיניות"). Optional findings applied: "המחקר נכון לתאריך", English announcement quotes, "לאחר מכן"; its suggestion for the neutrality paragraph was superseded by the neutrality reviewer's wording.

**Automated parity guard.** `messages/messages.test.ts` fails the build's test run if the two files differ in keys or in ICU arguments/tags, if any message is empty, or if any message contains an email address or phone number. Since 2026-10-06 it also fails if a Privacy & Terms "contact" section or contact-inviting wording comes back.

## The copy

Keys are the message IDs in the code. `{x}` are values filled in at runtime; `<partners></partners>` wraps linked partner-party names. Hebrew is the default language.


### Site name, page titles and search/social descriptions

| Key | English | עברית |
|---|---|---|
| `siteName` | Party Matcher | התאמת מפלגות |
| `title` | Party Matcher: Knesset election 2026 | התאמת מפלגות: הבחירות לכנסת 2026 |
| `description` | A non-partisan tool for Israeli voters. Rank the issues that matter to you, say where you stand, and see which parties’ documented positions are closest to yours. | כלי לא מפלגתי לבוחרים בישראל: מדרגים את הנושאים החשובים לך, מציינים את עמדתך ורואים של אילו מפלגות העמדות המתועדות הכי קרובות לשלך. |
| `ogHeadline` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `ogSecondary` | A non-partisan tool for the 2026 Knesset election | כלי לא מפלגתי לבחירות לכנסת 2026 |

### Navigation

| Key | English | עברית |
|---|---|---|
| `home` | Home | בית |
| `parties` | Parties | מפלגות |
| `howItWorks` | How this works | איך זה עובד |
| `privacy` | Privacy & Terms | פרטיות ותנאי שימוש |
| `skipToContent` | Skip to content | דילוג לתוכן |
| `mainLabel` | Main | ראשי |
| `footerLabel` | Site information | מידע על האתר |

### Footer

| Key | English | עברית |
|---|---|---|
| `neutrality` | Non-partisan and independent. No party funds, influences or advertises on this site. This is a decision aid, not a voting recommendation. | לא מפלגתי ועצמאי. אף מפלגה לא מממנת את האתר, לא משפיעה עליו ולא מפרסמת בו. זהו כלי עזר להחלטה, לא המלצת הצבעה. |

### Preview-only banner (removed once the real corpus and matcher are live)

| Key | English | עברית |
|---|---|---|
| `fictional` | Preview version: the parties shown are fictional samples, not real parties. | גרסת תצוגה מקדימה: המפלגות המוצגות הן דוגמאות בדיוניות, לא מפלגות אמיתיות. |
| `simulated` | Preview version: results are simulated and don’t reflect real matching. | גרסת תצוגה מקדימה: התוצאות מדומות ואינן משקפות התאמה אמיתית. |
| `both` | Preview version: the parties shown are fictional samples and results are simulated. | גרסת תצוגה מקדימה: המפלגות המוצגות הן דוגמאות בדיוניות והתוצאות מדומות. |

### Language switch

| Key | English | עברית |
|---|---|---|
| `label` | Language | שפה |
| `he` | עברית | עברית |
| `en` | English | English |
| `switchTo` | מעבר לעברית | Switch to English |

### Shared strings

| Key | English | עברית |
|---|---|---|
| `startSurvey` | Start | להתחיל |
| `resumeSurvey` | Continue where you left off | להמשיך מהמקום שבו עצרת |
| `jointList` | Running on a joint list with <partners></partners> as {list}, ballot letters {letters}. | רצה ברשימה משותפת עם <partners></partners> בשם {list}, אותיות הפתק {letters}. |
| `jointListNoLetters` | Running on a joint list with <partners></partners> as {list}. | רצה ברשימה משותפת עם <partners></partners> בשם {list}. |

### Intro page

| Key | English | עברית |
|---|---|---|
| `heading` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `lead` | Rank the issues that matter most to you, say where you stand on each, and see which parties’ documented positions are closest to yours. | מדרגים את הנושאים החשובים לך ביותר, מציינים את עמדתך בכל אחד מהם ורואים של אילו מפלגות העמדות המתועדות הכי קרובות לשלך. |
| `duration` | Takes about 5–10 minutes. | לוקח בערך 5–10 דקות. |
| `privacyNote` | We don’t save your answers. We only count anonymous results. | אנחנו לא שומרים את התשובות שלך. אנחנו רק סופרים תוצאות אנונימיות. |
| `privacyLink` | Privacy & Terms | פרטיות ותנאי שימוש |
| `stepsHeading` | How it works | איך זה עובד |
| `steps.rank.title` | Rank the issues | מדרגים את הנושאים |
| `steps.rank.body` | Put 10 current issues in order of importance to you. You can set aside up to 5 that don’t matter to you. | מסדרים 10 נושאים שעל סדר היום לפי מידת החשיבות שלהם בעיניך. אפשר להניח בצד עד 5 נושאים שלא משנים לך. |
| `steps.answer.title` | Say where you stand | מציינים את העמדה שלך |
| `steps.answer.body` | For each issue, pick the position closest to yours, adjust its wording, or write your own. | בכל נושא בוחרים את העמדה הקרובה ביותר לשלך, משנים את הניסוח שלה או כותבים עמדה משלך. |
| `steps.anythingElse.title` | Add anything else | מוסיפים כל דבר אחר |
| `steps.anythingElse.body` | Optionally, tell us about anything important to you that the issues didn’t cover. | אם רוצים, אפשר לספר על משהו חשוב לך שהנושאים לא כיסו. |
| `steps.result.title` | See your closest matches | רואים את ההתאמות הקרובות ביותר |
| `steps.result.body` | Your closest party and the next closest ones, with an issue-by-issue explanation linked to the research. | המפלגה הקרובה ביותר אליך והמפלגות הבאות אחריה, עם הסבר לפי נושא שמקושר למחקר. |
| `neutralHeading` | Non-partisan and transparent | לא מפלגתי ושקוף |
| `neutralBody` | This tool has no party affiliation and no ads, and no party pays for it or has any say in its content. Every party on the ballot is researched in the same way, and every research page is open to read. | לכלי הזה אין זיקה מפלגתית ואין בו פרסומות, ואף מפלגה לא משלמת עליו ולא משפיעה על התוכן שלו. כל המפלגות שבפתק נחקרו באותה דרך, וכל דפי המחקר פתוחים לקריאה. |
| `decisionAid` | The result shows which parties’ documented positions are closest to the answers you give. It’s a decision aid, not a recommendation of who to vote for. | התוצאה מראה של אילו מפלגות העמדות המתועדות הכי קרובות לתשובות שנתת. זהו כלי עזר להחלטה, לא המלצה למי להצביע. |
| `howItWorksLink` | Read how the issues were chosen and how the parties were researched | איך נבחרו הנושאים ואיך נחקרו המפלגות |

### How this works page

| Key | English | עברית |
|---|---|---|
| `title` | How this works | איך זה עובד |
| `description` | How the issues were chosen, how every party was researched, how matching works, and the tool’s limitations. | איך נבחרו הנושאים, איך נחקרה כל מפלגה, איך פועלת ההתאמה ומהן המגבלות של הכלי. |
| `intro` | This page explains how the issues were chosen, how the parties were researched, how your answers are matched with them, and what the tool can’t do. | בעמוד הזה מוסבר איך נבחרו הנושאים, איך נחקרו המפלגות, איך התשובות שלך מותאמות להן ומה הכלי לא יכול לעשות. |
| `tocLabel` | On this page | בעמוד הזה |
| `sections.issues.title` | How the 10 issues were chosen | איך נבחרו 10 הנושאים |
| `sections.issues.paragraphs[0]` | The issues are the 10 most pressing questions in Israeli society ahead of this election, chosen by their importance in current public debate rather than limited to any one topic area. | הנושאים הם 10 השאלות הבוערות ביותר בחברה הישראלית לקראת הבחירות האלה. הם נבחרו לפי מידת החשיבות שלהם בשיח הציבורי הנוכחי, בלי להגביל אותם לתחום מסוים. |
| `sections.issues.paragraphs[1]` | For each issue we wrote a short neutral description, a question, and the 3–4 most common real-world positions on it. Each position describes a policy approach and its stated reasons, worded so that its own supporters would recognise it as fair. The Hebrew and English versions say the same thing, each written to read naturally and neutrally in its language. | לכל נושא כתבנו תיאור קצר וניטרלי, שאלה, ואת 3–4 העמדות הנפוצות ביותר בפועל. כל עמדה מתארת גישה למדיניות ואת הנימוקים שלה, בניסוח שגם תומכיה יראו בו הוגן. הגרסה העברית והגרסה האנגלית אומרות אותו דבר, וכל אחת מהן נכתבה כך שתישמע טבעית וניטרלית בשפתה. |
| `sections.issues.paragraphs[2]` | Before the issues were finalised, a separate review checked them for loaded language and for major positions that were missing. | לפני שהנושאים נקבעו סופית, בדיקה נפרדת בחנה אותם כדי לאתר ניסוחים טעונים ועמדות מרכזיות שחסרות. |
| `sections.research.title` | How the parties were researched | איך נחקרו המפלגות |
| `sections.research.paragraphs[0]` | Every list on the ballot is included, as published by the Central Elections Committee, including small parties. Parties running together on a joint list are researched separately, each with its own page. | כל הרשימות שבפתק כלולות, כפי שפורסמו על ידי ועדת הבחירות המרכזית, כולל מפלגות קטנות. מפלגות שרצות יחד ברשימה משותפת נחקרו כל אחת בנפרד, ולכל אחת יש דף משלה. |
| `sections.research.paragraphs[1]` | Each party’s research page follows the same structure: overview, leadership, its position on each of the 10 issues, other notable positions, coalition stance, track record, legal matters involving its leaders, and sources. | דף המחקר של כל מפלגה בנוי באותו מבנה: סקירה כללית, הנהגה, העמדה בכל אחד מ־10 הנושאים, עמדות בולטות נוספות, עמדה קואליציונית, רקורד, הליכים משפטיים הנוגעים למנהיגיה, ומקורות. |
| `sections.research.paragraphs[2]` | The research focuses on facts rather than campaign messaging. Evidence is ranked by reliability: actions (votes, actions in government, legislation) come first, then formal commitments (the party platform), then statements. Where a party’s actions contradict its statements, the research says so. Legal matters are reported only from court or official sources. | המחקר מתמקד בעובדות ולא במסרי קמפיין. הראיות מדורגות לפי מידת האמינות שלהן: קודם מעשים (הצבעות, פעולות בממשלה, חקיקה), אחר כך התחייבויות רשמיות (מצע המפלגה), ואחר כך הצהרות. כשמעשים של מפלגה סותרים את ההצהרות שלה, המחקר מציין זאת. הליכים משפטיים מדווחים רק ממקורות של בתי משפט או ממקורות רשמיים. |
| `sections.research.paragraphs[3]` | The research was compiled with AI research tools, working from public sources. Each document was then checked against its sources by a separate AI step, all documents were reviewed together for consistent depth and tone, and the final set was reviewed before publication. Every substantive claim cites its source, and each page shows the date it was researched. | המחקר נערך בעזרת כלי מחקר מבוססי בינה מלאכותית, על סמך מקורות פומביים. כל מסמך נבדק אחר כך מול המקורות שלו בשלב נפרד, גם הוא בעזרת בינה מלאכותית, כל המסמכים נבדקו יחד כדי לוודא עומק וטון אחידים, והמכלול כולו נבדק לפני הפרסום. כל טענה מהותית מלווה במקור, ובכל דף מופיע התאריך שבו נחקר. |
| `sections.matching.title` | How matching works | איך פועלת ההתאמה |
| `sections.matching.paragraphs[0]` | Matching compares your answers only with the published research pages, so everything in your result can be checked on this site. Each point in a result links to the part of the party’s research page it relies on. | ההתאמה משווה את התשובות שלך רק לדפי המחקר שמפורסמים באתר, כך שאת כל מה שמופיע בתוצאה אפשר לבדוק כאן. כל נקודה בתוצאה מקושרת לחלק בדף המחקר של המפלגה שעליו היא מבוססת. |
| `sections.matching.paragraphs[1]` | Issues you rank higher count for more. Issues you mark as “doesn’t matter to me” count for nothing. If you add something under “anything else”, it counts as much as you say it does. A party’s actions count for more than its statements. | לנושאים שדירגת גבוה יותר יש משקל גדול יותר. לנושאים שסימנת כ״לא משנה לי״ אין משקל בכלל. אם הוספת משהו בשאלה ״עוד משהו?״, המשקל שלו הוא המשקל שבחרת. למעשים של מפלגה יש משקל גדול יותר מאשר להצהרות שלה. |
| `sections.matching.paragraphs[2]` | Polls, party size and the electoral threshold play no part in the match. They appear only as factual notes on the result. | לסקרים, לגודל המפלגה ולאחוז החסימה אין שום חלק בהתאמה. הם מופיעים רק כהערות עובדתיות בתוצאה. |
| `sections.matching.paragraphs[3]` | If no party matches your positions closely, the result says so instead of presenting a weak match as a strong one. | אם אף מפלגה לא קרובה במיוחד לעמדות שלך, התוצאה אומרת זאת, במקום להציג התאמה חלשה כאילו הייתה חזקה. |
| `sections.matching.placeholder` | [To be completed after the technical decision on the matching system: which AI system performs the matching and how, in plain language.] | [יושלם אחרי ההחלטה הטכנית על מערכת ההתאמה: איזו מערכת בינה מלאכותית מבצעת את ההתאמה ואיך, בשפה פשוטה.] |
| `sections.polls.title` | Polls and the electoral threshold | סקרים ואחוז החסימה |
| `sections.polls.paragraphs[0]` | A party’s page shows its list’s polling average from a fixed snapshot, with its source and date. If the list of a party in your result is polling below the electoral threshold (3.25%), the result notes that, with the date. Lists that don’t appear in published polls are noted as such. These notes are factual only; they are not advice about how to vote. | בדף של כל מפלגה מוצג ממוצע הסקרים של הרשימה שלה, מתוך תמונת מצב קבועה, עם המקור והתאריך. אם הרשימה של מפלגה שמופיעה בתוצאה שלך נמצאת בסקרים מתחת לאחוז החסימה (3.25%), התוצאה מציינת זאת, יחד עם התאריך. רשימות שלא מופיעות בסקרים שפורסמו מסומנות ככאלה. ההערות האלה עובדתיות בלבד; הן לא עצה למי להצביע. |
| `sections.polls.paragraphs[1]` | Israeli election law restricts publishing poll results in the days before election day. From the Friday before election day, all poll information is removed from the site, and it isn’t shown again afterwards. | חוק הבחירות מגביל פרסום של תוצאות סקרים בימים שלפני יום הבחירות. מיום שישי שלפני יום הבחירות, כל המידע על סקרים מוסר מהאתר, והוא לא מוצג שוב גם אחר כך. |
| `sections.limitations.title` | Limitations | מגבלות |
| `sections.limitations.paragraphs[0]` | No tool can capture everything that matters to you. 10 issues and a few positions on each simplify a complicated reality. | שום כלי לא יכול לתפוס את כל מה שחשוב לך. 10 נושאים וכמה עמדות בכל אחד מהם הם פישוט של מציאות מורכבת. |
| `sections.limitations.paragraphs[1]` | The research is a snapshot as of the date shown on each page. Parties may change their positions after that. | המחקר משקף את המצב נכון לתאריך שמופיע בכל דף. מפלגות עשויות לשנות את עמדותיהן לאחר מכן. |
| `sections.limitations.paragraphs[2]` | Some parties, especially new or small ones, have little public record. Their pages say so, and so does the result if one of them is among your matches. | על חלק מהמפלגות, בעיקר חדשות או קטנות, יש מעט מידע פומבי. הדפים שלהן מציינים זאת, וכך גם התוצאה אם אחת מהן מופיעה בין ההתאמות שלך. |
| `sections.limitations.paragraphs[3]` | Research and matching can contain mistakes, even after checking. Read the research pages, and make your own judgment. | גם אחרי בדיקה, המחקר וההתאמה עלולים להכיל טעויות. כדאי לקרוא את דפי המחקר ולגבש שיקול דעת עצמאי. |
| `sections.limitations.paragraphs[4]` | The result is a decision aid, not a recommendation of who to vote for. | התוצאה היא כלי עזר להחלטה, לא המלצה למי להצביע. |
| `sections.neutrality.title` | Neutrality | ניטרליות |
| `sections.neutrality.paragraphs[0]` | This tool has no party affiliation and no ads. No party funds it, influences it, or reviews or approves its content. All parties are researched with the same structure and the same evidence standards, and they are listed alphabetically, never by size or polls. | לכלי הזה אין זיקה מפלגתית ואין בו פרסומות. אף מפלגה לא מממנת אותו, לא משפיעה עליו ולא בודקת או מאשרת את התוכן שלו. כל המפלגות נחקרו באותו מבנה ולפי אותם סטנדרטים של ראיות, והן מוצגות לפי סדר האלף־בית, אף פעם לא לפי גודל או סקרים. |
| `sections.neutrality.paragraphs[1]` | We never publish how many people matched with which party. | אנחנו לא מפרסמים אף פעם כמה אנשים קיבלו התאמה לכל מפלגה. |
| `sections.corrections.title` | Corrections | תיקונים |
| `sections.corrections.paragraphs[0]` | Research pages are corrected only to fix errors. The date on each page shows when it was last researched. | דפי מחקר מתוקנים רק כדי לתקן טעויות. התאריך בכל דף מראה מתי נחקר לאחרונה. |

### Privacy & Terms page

| Key | English | עברית |
|---|---|---|
| `title` | Privacy & Terms | פרטיות ותנאי שימוש |
| `description` | We don’t save your answers. We only count anonymous results. Here is exactly what happens to your information. | אנחנו לא שומרים את התשובות שלך. אנחנו רק סופרים תוצאות אנונימיות. כאן מוסבר בדיוק מה קורה למידע שלך. |
| `intro` | In short: no accounts, no personal details, and we never store your answers. | בקצרה: אין חשבונות, אין פרטים אישיים, ואנחנו אף פעם לא שומרים את התשובות שלך. |
| `tocLabel` | On this page | בעמוד הזה |
| `sections.summary.title` | Summary | בקצרה |
| `sections.summary.paragraphs[0]` | We don’t save your answers. We only count anonymous results: which parties came out as the closest match and the runners-up. | אנחנו לא שומרים את התשובות שלך. אנחנו רק סופרים תוצאות אנונימיות: אילו מפלגות יצאו ההתאמה הקרובה ביותר ואילו אחריה. |
| `sections.summary.paragraphs[1]` | There are no accounts and no login, and we don’t ask for your name, email, phone number or any other personal detail. | אין חשבונות ואין התחברות, ואנחנו לא מבקשים שם, אימייל, מספר טלפון או כל פרט אישי אחר. |
| `sections.answers.title` | Your answers | התשובות שלך |
| `sections.answers.paragraphs[0]` | Your answers are sent only when you ask for your result, and are used only to prepare it. We don’t store them, and they are not logged in any form that could be linked to you. | התשובות שלך נשלחות רק כשמבקשים את התוצאה, ומשמשות רק להכנתה. אנחנו לא שומרים אותן, והן לא נרשמות ביומנים בשום צורה שאפשר לקשר לזהות שלך. |
| `sections.device.title` | Progress saved on your device | ההתקדמות נשמרת במכשיר שלך |
| `sections.device.paragraphs[0]` | While you take the survey, your progress is saved only in your own browser, so you can close the page and come back to it. Nothing is sent until you ask for your result. Once your result is shown, the saved progress is deleted from your browser. | בזמן מילוי השאלון, ההתקדמות שלך נשמרת רק בדפדפן שלך, כדי שאפשר יהיה לסגור את הדף ולחזור אליו. שום דבר לא נשלח עד שמבקשים את התוצאה. אחרי שהתוצאה מוצגת, ההתקדמות השמורה נמחקת מהדפדפן. |
| `sections.ai.title` | Processing by an AI provider | עיבוד אצל ספק בינה מלאכותית |
| `sections.ai.paragraphs[0]` | To prepare your result, your answers are processed by a third-party AI provider. We send them without your name or any other detail that identifies you, and the provider’s own data-retention terms apply to them. Please don’t include personal details in answers you write yourself. | כדי להכין את התוצאה, התשובות שלך מעובדות אצל ספק בינה מלאכותית חיצוני. אנחנו שולחים אותן בלי שמך ובלי שום פרט אחר שמזהה אותך, וחלים עליהן תנאי שמירת המידע של הספק עצמו. מומלץ לא לכלול פרטים אישיים בתשובות שכותבים בעצמכם. |
| `sections.ai.placeholder` | [The AI provider’s name, a link to its data-retention terms, and whether it keeps requests for a period will be added once the provider is chosen.] | [שם ספק הבינה המלאכותית, קישור לתנאי שמירת המידע שלו, והאם הוא שומר בקשות לתקופה מסוימת, יתווספו אחרי שהספק ייבחר.] |
| `sections.counts.title` | Anonymous result counts | ספירה אנונימית של תוצאות |
| `sections.counts.paragraphs[0]` | The only thing we keep is a daily count of which parties came out as the closest match and as runners-up. These counts contain no answers and nothing that identifies you. They are seen only by the site’s operator and are never published. | הדבר היחיד שאנחנו שומרים הוא ספירה יומית של המפלגות שיצאו ההתאמה הקרובה ביותר ושל אלה שהגיעו אחריה. הספירה לא כוללת תשובות ושום דבר שמזהה אותך. רק מפעיל האתר רואה אותה, והיא לא מתפרסמת אף פעם. |
| `sections.sharing.title` | Sharing | שיתוף |
| `sections.sharing.paragraphs[0]` | If you share your result, the link contains only the names of your matched parties and the site language. It never contains your answers. | אם משתפים את התוצאה, הקישור כולל רק את שמות המפלגות שהותאמו לך ואת שפת האתר. הוא אף פעם לא כולל את התשובות שלך. |
| `sections.cookies.title` | Cookies | עוגיות |
| `sections.cookies.paragraphs[0]` | The site uses one cookie, to remember your choice of language. It doesn’t use advertising or tracking cookies. | האתר משתמש בעוגייה אחת, כדי לזכור את השפה שבחרת. הוא לא משתמש בעוגיות פרסום או מעקב. |
| `sections.abuse.title` | Abuse protection | הגנה מפני שימוש לרעה |
| `sections.abuse.paragraphs[0]` | To keep the service available and its costs under control, requests for results are checked to make sure they come from a real browser and aren’t automated or excessive. | כדי שהשירות יישאר זמין והעלויות שלו יישארו בשליטה, בקשות לתוצאה נבדקות כדי לוודא שהן מגיעות מדפדפן אמיתי ואינן אוטומטיות או מוגזמות. |
| `sections.abuse.placeholder` | [To be completed after the abuse-protection decision: which service performs this check, what it processes, and any cookies it sets. The cookie section above will be re-checked then.] | [יושלם אחרי ההחלטה על מנגנון ההגנה: איזה שירות מבצע את הבדיקה, איזה מידע הוא מעבד ואילו עוגיות הוא מגדיר. סעיף העוגיות שלמעלה ייבדק מחדש אז.] |
| `sections.hosting.title` | Hosting | אחסון |
| `sections.hosting.paragraphs[0]` | Like any website, our hosting provider may keep standard technical logs, such as IP addresses, for security and operation. Your answers are never in these logs. | כמו בכל אתר, ספק האחסון שלנו עשוי לשמור יומנים טכניים רגילים, כמו כתובות IP, לצורכי אבטחה ותפעול. התשובות שלך אף פעם לא נמצאות ביומנים האלה. |
| `sections.terms.title` | Terms of use | תנאי שימוש |
| `sections.terms.paragraphs[0]` | This tool is a decision aid, provided for information only. It is not a recommendation of who to vote for, and it is not affiliated with any party, list or candidate. | הכלי הזה הוא כלי עזר להחלטה, ומוצע לצורכי מידע בלבד. הוא לא המלצה למי להצביע, ואין לו קשר לשום מפלגה, רשימה או מועמד. |
| `sections.terms.paragraphs[1]` | We work to keep the research accurate, but we can’t guarantee it is complete or free of errors. The research reflects public information as of the date shown on each page. | אנחנו משתדלים לשמור על דיוק המחקר, אבל לא יכולים להבטיח שהוא שלם או נקי מטעויות. המחקר משקף מידע פומבי נכון לתאריך שמופיע בכל דף. |
| `sections.terms.paragraphs[2]` | You may share links to the site and its pages freely. | מותר לשתף קישורים לאתר ולדפים שלו באופן חופשי. |

### Parties index

| Key | English | עברית |
|---|---|---|
| `title` | Parties | מפלגות |
| `description` | Every party on the ballot, in alphabetical order, with a research page for each. | כל המפלגות שבפתק, לפי סדר האלף־בית, עם דף מחקר לכל אחת. |
| `intro` | Every party on the ballot, in alphabetical order. Each page covers the party’s positions on the 10 issues, its track record and its sources. You don’t need to take the survey to read them. | כל המפלגות שבפתק, לפי סדר האלף־בית. בכל דף: עמדות המפלגה ב־10 הנושאים, הרקורד שלה והמקורות. לא צריך למלא את השאלון כדי לקרוא אותם. |
| `count` | {count, plural, one {# party} other {# parties}} | {count, plural, one {מפלגה אחת} other {# מפלגות}} |
| `leader` | Led by {name} | בהנהגת {name} |
| `jointGroup` | Joint list: {list}, with {partners} | רשימה משותפת: {list}, יחד עם {partners} |
| `ballotLetters` | Ballot letters: {letters} | אותיות הפתק: {letters} |
| `limitedInfoBadge` | Limited public information | מידע פומבי מועט |

### Party research pages

| Key | English | עברית |
|---|---|---|
| `description` | Research on {name}: positions on the 10 issues, track record, coalition stance and sources. | מחקר על {name}: עמדות ב־10 הנושאים, רקורד, עמדה קואליציונית ומקורות. |
| `breadcrumbLabel` | Breadcrumb | מיקום באתר |
| `backToParties` | All parties | כל המפלגות |
| `leader` | Leader | יו״ר |
| `list` | List | רשימה |
| `ballotLetters` | Ballot letters | אותיות הפתק |
| `researchedAsOf` | Researched as of | המחקר נכון לתאריך |
| `limitedInfoTitle` | Limited information. | מידע מועט. |
| `limitedInfoBody` | Little public information exists about this party (for example, no voting record or no published platform), so this research is less complete than for other parties. | על המפלגה הזו יש מעט מידע פומבי (למשל, אין לה רקורד הצבעות או מצע שפורסם), ולכן המחקר עליה מלא פחות מאשר על מפלגות אחרות. |
| `tocLabel` | Contents | תוכן העניינים |

### Poll, threshold and not-polled wording

| Key | English | עברית |
|---|---|---|
| `heading` | Polling | סקרים |
| `line` | Polling average: {percent} (as of {date}). | ממוצע הסקרים: {percent} (נכון ל־{date}). |
| `source` | Source: {title} | מקור: {title} |
| `belowThreshold` | This list is polling below the electoral threshold ({threshold}): average {percent} as of {date}. | הרשימה הזו נמצאת בסקרים מתחת לאחוז החסימה ({threshold}): ממוצע של {percent} נכון ל־{date}. |
| `notPolled` | This list doesn’t appear in published polls. | הרשימה הזו לא מופיעה בסקרים שפורסמו. |
| `pending` | No polling information has been recorded for this list yet. | עדיין לא נרשם מידע על סקרים לרשימה הזו. |
| `blackout` | Poll information is not shown from the Friday before election day until voting ends, as required by law. | מידע על סקרים לא מוצג מיום שישי שלפני יום הבחירות ועד סגירת הקלפיות, כנדרש בחוק. |
| `archive` | Poll information is no longer shown on this site. | מידע על סקרים כבר לא מוצג באתר. |
| `constituentHeading` | Polls included in the average | הסקרים שנכללו בממוצע |
| `sampleSize` | {n} respondents | {n} משיבים |
| `marginOfError` | margin of error {moe} | טעות דגימה {moe} |
| `published` | published {date} | פורסם ב־{date} |

### Survey (general)

| Key | English | עברית |
|---|---|---|
| `metaTitle` | Survey | השאלון |
| `moreInfo` | More info | מידע נוסף |
| `moreInfoAbout` | More info about {title} | מידע נוסף על {title} |
| `close` | Close | סגירה |
| `closed` | The election is over and the survey is closed. | הבחירות הסתיימו והשאלון סגור. |
| `noStorage` | Your browser isn’t letting this site save progress, so if you close the page you’ll need to start again. | הדפדפן שלך לא מאפשר לאתר לשמור את ההתקדמות, כך שאם הדף ייסגר יהיה צריך להתחיל מחדש. |

### Step 1: ranking (includes screen-reader announcements)

| Key | English | עברית |
|---|---|---|
| `stepLabel` | Step 1 of 3 | שלב 1 מתוך 3 |
| `heading` | Which issues matter most to you? | אילו נושאים הכי חשובים לך? |
| `instructions` | Put the issues in order, from the most important to you down. Tap “Add” to move an issue into your ranking, then reorder it with the arrows or by dragging. You can mark up to {max} issues as “doesn’t matter to me”; you won’t be asked about them. | מסדרים את הנושאים מהחשוב ביותר בעיניך ומטה. לוחצים על ״הוספה״ כדי להעביר נושא לדירוג שלך, ואז משנים את המיקום שלו בחצים או בגרירה. אפשר לסמן עד {max} נושאים כ״לא משנה לי״; השאלון לא ישאל עליהם. |
| `rankedHeading` | Your ranking | הדירוג שלך |
| `rankedEmpty` | Issues you add will appear here, numbered from most important. | נושאים שמוסיפים יופיעו כאן, ממוספרים מהחשוב ביותר. |
| `poolHeading` | Issues to rank | נושאים לדירוג |
| `poolEmpty` | All issues are placed. | כל הנושאים במקומם. |
| `notImportantHeading` | Doesn’t matter to me ({count} of {max}) | לא משנה לי ({count} מתוך {max}) |
| `notImportantEmpty` | None yet. | עדיין אין. |
| `rankLabel` | Rank | מקום |
| `add` | Add | הוספה |
| `addAria` | Add {title} to your ranking | הוספה לדירוג: {title} |
| `notImportant` | Doesn’t matter to me | לא משנה לי |
| `notImportantAria` | Doesn’t matter to me: {title} | לא משנה לי: {title} |
| `moveUp` | Move {title} up | העברת {title} למעלה |
| `moveDown` | Move {title} down | העברת {title} למטה |
| `remove` | Remove | הסרה |
| `removeAria` | Remove {title} from your ranking | הסרה מהדירוג: {title} |
| `restore` | Put back | החזרה |
| `restoreAria` | Put back {title} with the issues to rank | החזרה לנושאים לדירוג: {title} |
| `dragHandle` | Drag {title} | גרירה: {title} |
| `limitReached` | You can mark up to {max} issues as “doesn’t matter to me”. To mark this one, put another one back first. | אפשר לסמן עד {max} נושאים כ״לא משנה לי״. כדי לסמן את הנושא הזה, צריך קודם להחזיר נושא אחר. |
| `statusRemaining` | {count, plural, one {Rank the last remaining issue to continue.} other {Rank the # remaining issues to continue.}} | {count, plural, one {כדי להמשיך, צריך לדרג את הנושא האחרון שנותר.} other {כדי להמשיך, צריך לדרג את # הנושאים שנותרו.}} |
| `statusMin` | Rank at least {min} issues to continue. | כדי להמשיך, צריך לדרג לפחות {min} נושאים. |
| `statusComplete` | All set: {count} issues ranked. | הכול מוכן: {count} נושאים דורגו. |
| `continue` | Continue | המשך |
| `announce.added` | {title} added to your ranking at number {position}. | {title} נוסף לדירוג שלך במקום {position}. |
| `announce.addedLast` | {title} added at number {position}. All issues are placed; you can continue. | {title} נוסף במקום {position}. כל הנושאים במקומם; אפשר להמשיך. |
| `announce.moved` | {title} moved to number {position} of {total}. | {title} הועבר למקום {position} מתוך {total}. |
| `announce.removed` | {title} moved back to the issues to rank. | {title} הוחזר לנושאים לדירוג. |
| `announce.notImportant` | {title} marked as “doesn’t matter to me”. | {title} סומן כ״לא משנה לי״. |
| `announce.restored` | {title} put back with the issues to rank. | {title} הוחזר לנושאים לדירוג. |
| `dnd.roleDescription` | draggable issue | נושא שאפשר לגרור |
| `dnd.instructions` | To pick up an issue, press Space or Enter. Use the arrow keys to move it, then press Space or Enter again to drop it, or Escape to cancel. | כדי להרים נושא, לוחצים על רווח או Enter. מזיזים אותו בעזרת מקשי החצים, ולוחצים שוב על רווח או Enter כדי להניח אותו, או על Escape כדי לבטל. |
| `dnd.pickedUp` | Picked up {title}. | {title} הורם. |
| `dnd.overRanked` | {title} is at number {position} in your ranking. | {title} נמצא במקום {position} בדירוג שלך. |
| `dnd.overPool` | {title} is over the issues to rank. | {title} נמצא מעל הנושאים לדירוג. |
| `dnd.outside` | {title} is not over a list. | {title} לא נמצא מעל רשימה. |
| `dnd.dropped` | Dropped. {text} | הונח. {text} |
| `dnd.cancelled` | Cancelled. {title} was not moved. | בוטל. {title} לא הוזז. |

### Step 2: answers

| Key | English | עברית |
|---|---|---|
| `progress` | Question {current} of {total} | שאלה {current} מתוך {total} |
| `rankBadge` | Your #{rank} issue | מקום {rank} בדירוג שלך |
| `instructions` | Choose the position closest to yours. You can change its wording directly in the box, or write your own answer. | בוחרים את העמדה הקרובה ביותר לשלך. אפשר לשנות את הניסוח שלה ישירות בתיבה, או לכתוב תשובה משלך. |
| `optionLabel` | Position {n} | עמדה {n} |
| `optionTextLabel` | Position {n}, editable wording | עמדה {n}, ניסוח שאפשר לערוך |
| `edited` | edited | נערכה |
| `undoEdit` | Undo changes | ביטול השינויים |
| `ownLabel` | Write my own answer | לכתוב תשובה משלי |
| `ownTextLabel` | Your own answer | התשובה שלך |
| `ownPlaceholder` | In your own words (please don’t include personal details)… | במילים שלך (בלי פרטים אישיים, בבקשה)… |
| `needAnswer` | Choose a position or write your own to continue. | כדי להמשיך, בוחרים עמדה או כותבים תשובה משלך. |
| `back` | Back | חזרה |
| `next` | Next | הבא |
| `nextToAnythingElse` | Next | הבא |

### Step 3: anything else

| Key | English | עברית |
|---|---|---|
| `stepLabel` | Step 3 of 3 | שלב 3 מתוך 3 |
| `heading` | Is there anything else important to you that wasn’t covered here? | יש עוד משהו שחשוב לך ולא נכלל כאן? |
| `optional` | Optional. You can leave this empty. | לא חובה. אפשר להשאיר ריק. |
| `textLabel` | Anything else (optional) | עוד משהו (לא חובה) |
| `placeholder` | For example, an issue or a principle that matters to you | למשל, נושא או עיקרון שחשוב לך |
| `importanceLegend` | Compared with the issues you ranked, how important is this to you? | בהשוואה לנושאים שדירגת, כמה זה חשוב לך? |
| `importance.above-top` | More important than my top issue | חשוב יותר מהנושא הראשון שלי |
| `importance.middle` | About as important as my middle issues | חשוב בערך כמו הנושאים שבאמצע הדירוג שלי |
| `importance.minor` | Minor | שולי |
| `needImportance` | To continue, choose how important this is. | כדי להמשיך, בוחרים כמה זה חשוב. |
| `back` | Back | חזרה |
| `submit` | See my result | לתוצאה שלי |

### Result (disclaimer, weak-match, agreement labels)

| Key | English | עברית |
|---|---|---|
| `loadingTitle` | Preparing your result… | מכינים את התוצאה שלך… |
| `loadingBody` | We’re comparing your answers with each party’s research. This can take a little while. | אנחנו משווים את התשובות שלך למחקר על כל מפלגה. זה עשוי לקחת קצת זמן. |
| `heading` | Your result | התוצאה שלך |
| `intro` | These are the parties whose documented positions are closest to the answers you gave. | אלה המפלגות שהעמדות המתועדות שלהן הכי קרובות לתשובות שנתת. |
| `weakMatch` | No party closely matches your positions. These are the closest. | אף מפלגה לא קרובה במיוחד לעמדות שלך. אלה הקרובות ביותר. |
| `topMatchLabel` | Closest match | ההתאמה הקרובה ביותר |
| `runnerUpLabel` | Next closest · #{n} | הבאה בקרבתה · מקום {n} |
| `runnersUpHeading` | Next closest | הקרובות הבאות |
| `ballotLetters` | Ballot letters: {letters} | אותיות הפתק: {letters} |
| `limitedInfoTitle` | Limited information. | מידע מועט. |
| `limitedInfoBody` | Little public information exists about this party, so this match rests on less evidence than others. | על המפלגה הזו יש מעט מידע פומבי, ולכן ההתאמה אליה נשענת על פחות ראיות מאשר אחרות. |
| `showBreakdown` | Show the issue-by-issue explanation | להצגת ההסבר לפי נושא |
| `importance` | Your #{rank} issue | מקום {rank} בדירוג שלך |
| `agreement.agrees` | Agrees | מסכימה |
| `agreement.partially` | Partly agrees | מסכימה חלקית |
| `agreement.disagrees` | Disagrees | לא מסכימה |
| `agreement.party-position-unclear` | Party’s position unclear | עמדת המפלגה לא ברורה |
| `readInResearch` | See this in the research | לקריאה במחקר |
| `readInResearchAria` | See this in the research: {title} | לקריאה במחקר: {title} |
| `anythingElseHeading` | About what you added | לגבי מה שהוספת |
| `readResearch` | Read the full research on {name} | למחקר המלא על {name} |
| `disclaimerTitle` | A decision aid, not a recommendation | כלי עזר להחלטה, לא המלצה |
| `disclaimer` | This result shows which parties’ documented positions are closest to the answers you gave. It doesn’t tell you who to vote for. Read the research and make your own judgment. | התוצאה מראה של אילו מפלגות העמדות המתועדות הכי קרובות לתשובות שנתת. היא לא אומרת לך למי להצביע. כדאי לקרוא את המחקר ולגבש שיקול דעת עצמאי. |
| `howItWorksLink` | How this works and its limitations | איך זה עובד ומהן המגבלות |

### Sharing and share landing page / preview image

| Key | English | עברית |
|---|---|---|
| `heading` | Share | שיתוף |
| `explainer` | The link shows only your matched parties and invites others to take the survey. It never includes your answers. | הקישור מציג רק את המפלגות שהותאמו לך ומזמין אחרים למלא את השאלון. הוא אף פעם לא כולל את התשובות שלך. |
| `button` | Share my result | לשתף את התוצאה |
| `copied` | Link copied. | הקישור הועתק. |
| `manualCopy` | Copy this link: | אפשר להעתיק את הקישור הזה: |
| `shareTitle` | Party Matcher | התאמת מפלגות |
| `shareText` | My closest match on Party Matcher: {name}. Which party is closest to your positions? | ההתאמה הקרובה ביותר שלי באתר ״התאמת מפלגות״: {name}. איזו מפלגה הכי קרובה לעמדות שלך? |
| `metaTitle` | Closest match: {name} | ההתאמה הקרובה ביותר: {name} |
| `metaTitleGeneric` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `metaDescription` | A non-partisan tool for the 2026 Knesset election. Rank the issues, say where you stand, and see which parties are closest to your positions. | כלי לא מפלגתי לבחירות לכנסת 2026. מדרגים את הנושאים, מציינים את עמדתך ורואים אילו מפלגות הכי קרובות לעמדות שלך. |
| `landingEyebrow` | A shared result. The closest match was: | תוצאה ששותפה. ההתאמה הקרובה ביותר הייתה: |
| `alsoClose` | Next closest: | הקרובות הבאות: |
| `landingNote` | Based on someone else’s answers, which are never shared. | על סמך התשובות של מישהו אחר, שלא משותפות אף פעם. |
| `landingGenericHeading` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `inviteHeading` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `inviteBody` | Rank the issues that matter to you, say where you stand, and see which parties’ documented positions are closest to yours. Takes about 5–10 minutes. | מדרגים את הנושאים החשובים לך, מציינים את עמדתך ורואים של אילו מפלגות העמדות המתועדות הכי קרובות לשלך. לוקח בערך 5–10 דקות. |
| `ogEyebrow` | My closest match: | ההתאמה הקרובה ביותר שלי: |
| `ogAlsoClose` | Next closest: {names} | הקרובות הבאות: {names} |
| `ogGenericHeadline` | Which party is closest to your positions? | איזו מפלגה הכי קרובה לעמדות שלך? |
| `ogCta` | Find your match | למצוא את ההתאמה שלך |

### Election-over banner

| Key | English | עברית |
|---|---|---|
| `electionOverTitle` | The election is over. | הבחירות הסתיימו. |
| `electionOverBody` | Voting has ended and the survey is no longer available. The party research remains available as an archive. | הקלפיות נסגרו והשאלון כבר לא זמין. המחקר על המפלגות נשאר זמין כארכיון. |
| `browseParties` | Browse the parties | לדפי המפלגות |

### Error messages

| Key | English | עברית |
|---|---|---|
| `title` | We couldn’t prepare your result | לא הצלחנו להכין את התוצאה שלך |
| `validation` | Something in the submitted answers couldn’t be read. You can start the survey again. | לא הצלחנו לקרוא חלק מהתשובות שנשלחו. אפשר להתחיל את השאלון מחדש. |
| `content_version_mismatch` | The survey content was updated. Please start again. | תוכן השאלון עודכן. צריך להתחיל מחדש. |
| `abuse_check_failed` | We couldn’t verify the request. Please try again. | לא הצלחנו לאמת את הבקשה. אפשר לנסות שוב. |
| `rate_limited` | Too many requests right now. Please try again in a few minutes. | יש כרגע יותר מדי בקשות. אפשר לנסות שוב בעוד כמה דקות. |
| `at_capacity` | The service is busy right now. Please try again a little later. | השירות עמוס כרגע. אפשר לנסות שוב מעט מאוחר יותר. |
| `election_over` | The election is over and the survey is closed. The party research is still available. | הבחירות הסתיימו והשאלון סגור. המחקר על המפלגות עדיין זמין. |
| `upstream_failure` | Something went wrong while preparing your result. Your answers are still saved on this device. Please try again. | משהו השתבש בזמן הכנת התוצאה. התשובות שלך עדיין שמורות במכשיר הזה. אפשר לנסות שוב. |
| `retry` | Try again | לנסות שוב |
| `restart` | Start again | להתחיל מחדש |
| `browseParties` | Browse the parties | לדפי המפלגות |

### Not-found page

| Key | English | עברית |
|---|---|---|
| `title` | Page not found | הדף לא נמצא |
| `body` | The page you were looking for doesn’t exist. | הדף שחיפשת לא קיים. |
| `home` | Home | בית |
| `parties` | Parties | מפלגות |

## Owner approval

- [ ] Copy approved by the owner (date: ______). Requested changes: ______

