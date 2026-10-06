# Legal findings: poll blackout, election propaganda and privacy (26th Knesset election)

> **DISCLAIMER: THIS IS NOT LEGAL ADVICE.** This is desk research by an AI research agent, not a lawyer. Statutes were read from Hebrew Wikisource (which mirrors the Knesset legislation database) and cross-checked against Nevo where possible. CEC practice and case law were only partly reviewed. Before launch, and especially before relying on the blackout timing and the anonymity analysis, the owner may want an Israeli election-law lawyer to confirm these findings. The Central Elections Committee (ועדת הבחירות המרכזית) legal department also answers questions from the public.

Research date: 2026-10-06. All times are Asia/Jerusalem unless marked otherwise.

---

## 1. Summary table

| # | Topic | Finding | Recommendation | Confidence |
|---|---|---|---|---|
| 1 | Poll-publication ban | Elections (Modes of Propaganda) Law s.16ה(ח): from **the end of the Friday before the polls open** until **the polls close**, nobody may broadcast or publish in writing to the public (this **includes the internet**) the results of an election poll that was not published before the period began. Poll results that *were* published earlier may be republished during the period only with a prominent "not current" notice. | Hide **all** poll-derived content during the blackout: polling-average lines, the below-threshold note and the "doesn't appear in published polls" note. Freeze the polling snapshot before the blackout too. | High (statute text read in two sources) |
| 2 | Election date and ban start | Election day is **Tuesday 2026-10-27**. The Friday before it is 2026-10-23. Statutory ban start: **2026-10-24T00:00:00+03:00** (midnight between Oct 23 and 24). The CEC timetable gives the same time. | **Recommended blackout start: `2026-10-23T12:00:00+03:00`** (= 2026-10-23T09:00:00Z), a 12-hour margin. | High for the date. Medium-high for midnight as the legal start (see §3.3). |
| 3 | Poll close / election-over | Polling stations are open 07:00–22:00 (Knesset Elections Law s.72(a)). Israel DST ends 2026-10-25, so election day is on IST (+02:00). | **Poll-close instant: `2026-10-27T22:00:00+02:00`** (= 2026-10-27T20:00:00Z). Keep poll figures hidden until at least that moment; preferably keep them hidden permanently in archive mode. | High |
| 4 | Disclosure when publishing poll results | s.16ה(ב)–(ג): the first publisher of a poll's results, and anyone publishing within 24 hours of first release, must give the commissioner, the pollster, fieldwork dates, the population sampled, the number approached vs. the number who responded, the margin of error, and (for written publication) the questions asked. | **PRODUCT IMPACT.** Attribute every poll in the average, and include polls only once 24h have passed since their first publication. | Medium (it is unclear whether a polling *average* triggers this) |
| 5 | Non-scientific "polls" | s.16ה(ד): publishing results not based on recognised statistical methods requires a prominent disclaimer plus the commissioner and conductor. | **PRODUCT IMPACT.** Never publish the anonymous result tallies. Keep the current design. | Medium-high |
| 6 | Is the tool "election propaganda"? | There is no statutory definition. CEC rulings apply a "dominant purpose" test and presume informational content is not propaganda. Major media run similar quizzes in 2026. | A neutral, method-transparent tool is probably not propaganda. Keep it strictly neutral and document the methodology. | Medium |
| 7 | Anonymity / identification | s.2א1 requires an "election ad" (מודעת בחירות) to carry the name and contact details of whoever ordered it. "Election ad" means propaganda by a contestant, a body linked to a faction or a registered "body active in elections", **or paid** propaganda content. | **PRODUCT IMPACT.** An unpaid, non-partisan tool is outside s.2א1. Do **not** buy promotion that names or favours parties while staying anonymous. Publish methodology and an (anonymous) contact channel. | Medium |
| 8 | Election-eve / election-day propaganda limits | Knesset Elections Law s.129: from 19:00 on the day before election day and all through election day, no propaganda by assemblies, processions, loudspeakers or radio/TV broadcasts. Propaganda Law s.5: no radio/TV propaganda in the final 60 days. s.126(5): no propaganda at or near a polling station on election day. | No statutory ban on a website operating on election day. The poll blackout (row 1) is the binding constraint. | Medium-high |
| 9 | Ballot letters, state resources, gifts, deepfakes | s.7: ballot letters may be used in propaganda only during the final 42 days. s.2א: no public-body resources for propaganda. s.8: no gifts or entertainment tied to propaganda. s.2א2 (temporary, from 2026-07-23): AI deepfake propaganda must carry a disclosure. | Mostly not triggered by a neutral tool. Don't host on public-body resources. Don't use AI-generated imagery of candidates. | Medium |
| 10 | Party Financing Law, "election activity" | Spending over 120,400 NIS (2026) on "election activity" (e.g. ads meant to get people to vote for or against a *specific* list) requires registering with the State Comptroller. | Not triggered by a neutral tool. | Medium-high |
| 11 | Privacy (Amendment 13, in force 2025-08-14) | Political opinions are "information of special sensitivity". Personal data includes online identifiers such as IP addresses and cookie IDs. | **PRODUCT IMPACT (verify).** Make sure answers are never stored or logged together with an IP, cookie or user ID, including hosting logs, analytics and AI-provider logs. | Medium |

---

## 2. Key timestamps (Asia/Jerusalem)

| Event | ISO-8601 | UTC | Basis |
|---|---|---|---|
| **Recommended poll-blackout start (product)** | **`2026-10-23T12:00:00+03:00`** | 2026-10-23T09:00:00Z | Statutory start minus 12h margin (§3.3) |
| Statutory poll-ban start | `2026-10-24T00:00:00+03:00` | 2026-10-23T21:00:00Z | s.16ה(ח) "בתום יום שישי שלפני פתיחת הקלפיות"; CEC timetable "מחצות בלילה שבין 23 ל־24 באוקטובר" [S1][S2][S6] |
| DST ends (IDT→IST) | 2026-10-25T02:00:00+03:00 → 01:00+02:00 | 2026-10-24T23:00:00Z | Time Determination Law (חוק קביעת הזמן) s.3: DST ends on the last Sunday of October at 02:00 [S10]; confirmed with the IANA tz database (`zdump Asia/Jerusalem`) |
| Polls open | `2026-10-27T07:00:00+02:00` | 2026-10-27T05:00:00Z | Knesset Elections Law s.72(a) [S3] |
| **Poll close / election-over mode / end of statutory ban** | **`2026-10-27T22:00:00+02:00`** | 2026-10-27T20:00:00Z | s.72(a): "מ־7 בבוקר עד 10 בלילה". Small localities (≤350 voters) close at 20:00, so 22:00 is the latest regular close [S3][S6] |

**Offset warning:** the blackout start falls on **+03:00** (IDT) and poll close falls on **+02:00** (IST). Use absolute UTC instants in code. Do not use naive local times.

---

## 3. Rule-by-rule analysis

### 3.1 Poll-publication ban — Elections (Modes of Propaganda) Law 5719-1959, s.16ה(ח)

**Text (s.16ה(ח), verbatim):**
> "בתקופה שתחילתה בתום יום שישי שלפני פתיחת הקלפיות והמסתיימת במועד סגירת הקלפיות, לא ישדר ולא יפרסם אדם בכתב לציבור על תוצאותיו של סקר בחירות שלא שודרו או פורסמו בכתב לציבור לפני תחילתה של התקופה האמורה. המשדר או המפרסם בתקופה האמורה על תוצאותיו של סקר בחירות ששודרו או פורסמו לפני תחילתה של אותה תקופה, יציין בהבלטה שהסקר אינו עדכני ואין ללמוד ממנו על דפוסי הצבעה או עמדות של הציבור ביום השידור או הפרסום."

Paraphrase: from the end of the Friday before the polls open until the polls close, no one may broadcast, or publish in writing to the public, the results of an election poll that were not broadcast or published before the period began. Someone who republishes, during the period, results that were published earlier must state prominently that the poll is not current and tells nothing about voting patterns or public opinion on the day of publication.

**Definitions (s.16ה(א)):**
- "סקר בחירות" (election poll): a poll conducted during the election period that examines voters' voting patterns, or examines issues directly related to a contestant in the elections.
- "מפרסם בכתב לציבור" (publishes in writing to the public): "לרבות בעיתון **או באינטרנט**" (including in a newspaper **or on the internet**). Websites are expressly covered.
- "ציבור" (the public) excludes people running the election campaign.
- "תקופת בחירות" (election period) for the Knesset is the 90 days before election day (s.10ב(א)).

**Does it cover a polling average, the "below threshold" label, or "doesn't appear in polls"?** The statute doesn't address aggregates or derived labels, and no CEC ruling on aggregators was found. Reasoning:
- A polling average is computed directly from poll results, and publishing it communicates "the results of" those polls. It is very likely covered.
- "Below the 3.25% threshold, as of [date]" states a poll result in qualitative form. It is likely covered.
- "This list doesn't appear in published polls" is information derived from polls, implying negligible support. It is arguably covered. Its legal risk is lower but not zero, and hiding it costs nothing.
- The "previously published" carve-out (second sentence) could in theory let the tool keep showing a pre-ban snapshot with a prominent "not current" notice. However: (a) whether an average or a per-user label counts as "the same results already published" is uncertain; (b) the notice must be prominent on every display, including share previews; (c) the purpose of the law is to keep poll information from influencing voters in the final days. **Recommendation: hide all three elements; don't rely on the carve-out.**

**Penalty (s.17):** violating any provision of the Law is punishable by 6 months' imprisonment or the fine under Penal Law s.61(a)(2), currently up to **29,200 NIS** [S1][S9]. Under s.17ב, the CEC chair may also issue an injunction (צו מניעה) to stop an offence, enforceable as contempt of court.

**Application to the tool:** this rule applies directly. It covers the polling-average line on research pages, the below-threshold note and the "not polled" note in results, and anything in social-preview images.

**Confidence:** High for the text and the start/end of the ban. Medium-high that the derived labels are covered (conservative reading).

**PRODUCT IMPACT:**
1. From the blackout instant until poll close, the server-rendered pages **and** client-side code must hide (a) polling-average numbers, (b) the below-threshold note, and (c) the "doesn't appear in published polls" note. Do not swap in a replacement that leaks the same signal, such as showing the note only for some parties. Hide it for every party, or show one neutral sentence for all: "Poll information is not shown from Friday before election day until polls close, as required by law."
2. **Client-side guard:** a page cached or opened before the switch must also hide poll content once the instant passes. Embed the absolute UTC instant in the client and check it, so ISR, CDN and browser caches can't leak it.
3. **Social preview images:** Facebook, WhatsApp, X and Telegram cache OG images outside the operator's control, possibly for days. **Never put poll figures or the threshold note in share images at any time**, not even before the blackout.
4. **Freeze the snapshot:** don't publish any new or updated polling snapshot after the blackout starts. Ideally freeze it at least a day earlier so no newly computed average is published close to the ban.
5. **AI matcher prompts:** if the research documents fed to the AI contain poll numbers, the AI could mention them in free text during the blackout. Strip poll data from the AI's inputs or outputs during the blackout, or remove it from the AI's context entirely.

### 3.2 Disclosure duties for published polls — s.16ה(ב)–(ה)

**Text, paraphrased with section numbers:**
- (ב) **The first** to broadcast a poll's results, **and anyone who broadcasts them within 24 hours** of first release, must state alongside the results: (1) the commissioning body; (2) the pollster; (3) the date or period of fieldwork; (4) the population sampled; (5) the number of people asked and the number who actually took part; (6) the margin of error.
- (ג) Someone who **publishes in writing** (which includes the internet) the results of a poll "as stated in subsection (ב)" must also list **the questions asked**.
- (ד) Someone who publishes results **not based on recognised statistical methods** must state prominently that the poll is not scientific and that no conclusions can be drawn from it, and must give items (1) and (2).
- (ה)–(ז) Duties of the *pollster* (sending results to the CEC, reporting to the State Comptroller within 20 days after the election, keeping data for 3 years). These don't apply to a re-publisher or aggregator.

**Application:** read literally, (ב)–(ג) bind the first publisher and anyone publishing within 24h of first release. A polling *average* drawn from older polls is arguably outside that, but this is not settled.

**PRODUCT IMPACT:**
- On each research page's polling line, or on a linked "polling sources" page, list for **every poll in the average**: the pollster, the commissioning outlet, the fieldwork dates, the sample size (n), the margin of error, and a link to the original publication or the CEC poll repository. The CEC publishes submitted Knesset polls on gov.il [S11].
- **Include a poll in the snapshot only after 24 hours have passed since its first publication.** That keeps the tool outside the literal scope of (ב)–(ג).
- Always show the snapshot date (already planned) and the poll date shown in results.
- **Anonymous tallies (s.16ה(ד)):** a tally of top matches is arguably not an "election poll", but publishing it could be presented as one. If it ever were published, it would need the prominent non-scientific disclaimer, and it would be banned during the blackout. **Keep the current design: never show tallies publicly.**

**Confidence:** Medium.

### 3.3 Election date and computing the ban start

- **Election day: Tuesday 27 October 2026** (15 Cheshvan 5787). In April 2023 the CEC chair set the date for the 26th Knesset election (reported by ynet and Maariv). On 2026-07-12 Haaretz reported the coalition's confirmation that the election "will be held on its date fixed by law – 27 October" [S4][S5]. The CEC timetable published 2026-07-31 (reported by Zman Yisrael) lists election day as 27 October, with voting from 07:00 to 22:00 [S6].
- **Friday before the polls open:** Friday 2026-10-23.
- **"End of Friday" (בתום יום שישי):** the CEC timetable says: "23 באוקטובר – המועד האחרון שבו מותר לפרסם סקר בחירות עדכני. מחצות בלילה שבין 23 ל־24 באוקטובר ועד סגירת הקלפיות חל איסור על פרסום סקרי בחירות חדשים." So the statutory start is **2026-10-24T00:00:00+03:00**, and DST is still in effect (it ends 2026-10-25) [S6][S10].

**Recommended product blackout start: `2026-10-23T12:00:00+03:00` (12 hours before the statutory start).** Reasoning:
1. The ~5-minute ISR revalidation is only one cache layer. CDN edges, stale-while-revalidate, failed or slow builds, deploy rollbacks and open browser tabs can all lag by more. A margin of hours, not minutes, absorbs all of these.
2. Some might read "בתום יום שישי" as the start of Shabbat at Friday sunset, not civil midnight. Starting at noon on Friday is earlier than any Friday-evening reading, so both readings are covered.
3. The cost is trivial: hiding poll data for 12 extra hours has little product cost and avoids criminal exposure.
4. Noon is also within normal hours, so the owner can check that the switch actually happened before Shabbat and the night.

(If a longer buffer is preferred, `2026-10-23T00:00:00+03:00` (24h) is also defensible. Do not go later than 12:00 on Friday.)

### 3.4 Poll-closing instant — Knesset Elections Law [Consolidated Version] 5729-1969, s.72

**Text (s.72(a)):** "הקלפי תהיה פתוחה להצבעה ביום הבחירות ללא הפסקה מ־7 בבוקר עד 10 בלילה, אך בישוב שמספר הזכאים להצביע בו אינו עולה על 350 תהיה הקלפי פתוחה מ־8 בבוקר עד 8 בלילה". s.72(b): anyone who reaches the polling station during voting hours may still vote after they end.

**Caveat:** under s.70א, the CEC chair and deputies may extend voting at particular polling stations in special circumstances (up to 24 hours after the s.72 closing time). The poll ban ends "at the closing of the polling stations". If extensions are announced, the end of the ban becomes unclear.

**Recommendation:** election-over mode at **`2026-10-27T22:00:00+02:00`**. Keep poll figures, the threshold note and the not-polled note **hidden after the election as well** (the archive gains nothing from them). If they must come back, wait until at least the next morning and check the CEC for any extensions. Disabling the survey at 22:00 is a product choice. No statute requires the survey itself to close earlier.

**Confidence:** High.

### 3.5 Is a non-partisan matching tool "election propaganda" (תעמולת בחירות)?

- The Propaganda Law has **no statutory definition** of "תעמולת בחירות" (s.1א defines only other terms).
- CEC chairs use a **"dominant purpose / dominance" test** (מבחן הדומיננטיות). In TBK 16/20 (Ben Meir v. Netanyahu, Likud and "Israel Hayom", CEC chair Justice Joubran, 2015), the chair said the Law deliberately avoids restricting news and informational content, that restrictions target content that is really a party's election ad, and that the starting presumption is that content is informational, not an election ad, with the burden on the petitioner [S7].
- **Market practice:** mainstream media openly run vote-matching quizzes for this election. Mako's "מצפן הבחירות", built with a policy institute, gives each party a match score and shows the top 3 [S12].
- **Assessment:** a tool that matches users to *all* parties by a published, uniform method, with no editorial push toward or away from any list, is **probably not election propaganda**. The risk rises if the method or content looks skewed, if party descriptions are one-sided, or if the operator has links to a party. No CEC ruling specifically on vote-advice or "compass" tools was found (searches in Hebrew and English found none).

**Confidence:** Medium.

**PRODUCT IMPACT (recommended, not strictly required):** publish the methodology and research sources, treat all lists the same way (same fields, same tone), add a non-partisan / no-affiliation statement, and provide a contact channel so parties can report factual errors. These steps strengthen the "informational" characterisation if a party petitions the CEC chair.

> **Owner decision (2026-10-06):** the site will have no contact channel. The other steps above (methodology, sources, uniform treatment, neutrality statement) are implemented.

### 3.6 Anonymity and identification — Propaganda Law s.2א1 (transparency in election propaganda, added 2022)

**Text, paraphrased:** (א) No person may publish an "election ad" (מודעת בחירות) unless it carries the name and contact details of the person responsible for ordering it (plus the printer, for print). If that person acted on behalf of a contestant or another body, the ad must also carry the contestant's or body's name and the list's letter or name. (ב) "מודעת בחירות" means **(1)** election propaganda by a contestant, a body linked to a faction, or a "body active in elections" (גוף פעיל בבחירות), or someone acting for them; **or (2) election propaganda content published for payment**.

Background: in February 2019 CEC chair Justice Melcer banned anonymous online election ads on all platforms, mainly to counter foreign interference [S8]. That policy was later put into statute as s.2א1.

**Application:** the operator is anonymous, unpaid, and not a contestant or a body linked to one. Even if the tool were treated as propaganda, s.2א1 reaches it only if it is **paid** propaganda content or comes from a contestant, a linked body or a registered active body. **So anonymity is very likely lawful for the tool itself.** The risks:
- **Paid promotion** (Meta or Google ads, sponsored posts) of content that could be seen as propaganda, for example "Find out why X is your party" or ads naming parties, would require identifying who ordered it.
- In any CEC proceeding (s.17ב injunction), anonymity makes it harder to answer claims of bias or foreign influence. An injunction can be directed at the anonymous site in any case.

**PRODUCT IMPACT:**
- Don't run paid promotion that names, shows or favours any party unless the owner is willing to add an identifying name and contact. Promotion that stays generic ("a neutral tool to compare party positions") is lower risk. If paid ads are planned, get legal confirmation first.
- Provide at least an anonymous contact address and a neutrality statement on the site.
  - *Owner decision (2026-10-06): no contact channel, ever. The neutrality statement is published; no contact address will be added.*

**Confidence:** Medium.

### 3.7 Election-eve and election-day restrictions

- **Knesset Elections Law s.129:** "משעה 7 בערב ביום שלפני יום הבחירות ובכל יום הבחירות לא תהיה תעמולת בחירות על־ידי אסיפות, תהלוכות, רמקולים או שידורים ברדיו ובטלוויזיה." That covers assemblies, processions, loudspeakers and radio/TV broadcasts, not websites. A neutral tool is in any case probably not propaganda.
- **Propaganda Law s.5(a)(1):** no election propaganda in radio or TV broadcasts during the 60 days before the election (except the statutory party slots).
- **Knesset Elections Law s.126(5):** no propaganda on election day at a polling station or within 5 m of its entrance (10 m from the walls where there is no yard or fence). This is physical and doesn't apply to the tool.
- **Assessment:** no statute was found that bars a website or online quiz from operating on election day. The binding election-day constraint is the poll blackout (§3.1).
- **Sharing on election day:** a user sharing their *own* top match is the user's own expression, not a poll result. It is fine as long as the share page and preview carry no poll data (see §3.1, impact 3).

**Confidence:** Medium-high.

### 3.8 Other propaganda-law provisions checked

| Provision | Rule | Relevance |
|---|---|---|
| s.7 ballot letters (אות רשימה) | Propaganda using a list's ballot letter is allowed only in the 42 days before election day. | Applies only to propaganda. We are already inside the 42 days (from 2026-09-15). Low relevance for a neutral tool. Showing letters factually to help users find the ballot is informational. |
| s.2א public resources | No use of funds or assets of state-audited public bodies, or government/municipal-owned corporations, in connection with election propaganda. | Don't host on, or fund from, public-body resources (e.g. government or municipal infrastructure). |
| s.8 entertainment/gifts | Election propaganda may not be tied to entertainment shows or gifts. | Don't offer prizes or giveaways tied to the quiz. |
| s.2א2 deepfakes (temporary, 2026-07-23 to 2027-10-26) | Election propaganda that is AI-generated or materially edited audio/visual content ("נחזות עמוקה") must carry a clear and prominent disclosure. The CEC chair issued format rules [S1][S13]. | Avoid AI-generated imagery of candidates or leaders in OG images. Low relevance otherwise. |
| s.2ב / s.2ג | Limits on using injured or fallen security personnel, the IDF, or children under 15 in propaganda. | Not relevant. |

### 3.9 Party Financing Law 5733-1973, "election activity" (פעילות בחירות)

"Election activity" (s.1) means activity by a non-party, including: (1) building a database of *identified* voters with their voting intentions; (3) direct targeting of voters with particular views to vote for or against **a specific list**; (4) propaganda via ads aimed at getting voters to vote for or against **a specific list**. Under s.10ג(a), anyone carrying out election activity worth over 100,000 NIS indexed (**120,400 NIS in 2026**) must first register with the State Comptroller as a "body active in elections" [S14].

**Application:** a neutral tool is not aimed at a specific list. Its anonymous tallies hold no identifying details, so item (1) doesn't apply. **Not triggered**, unless the tool started to steer users toward specific lists.

**Confidence:** Medium-high.

### 3.10 Privacy Protection Law 5741-1981 (Amendment 13, in force 2025-08-14)

- "מידע אישי" (personal data) means data about an identified or **identifiable** person, including via an **online identifier** ("מזהה מקוון") or location data (s.3).
- "מידע בעל רגישות מיוחדת" (information of special sensitivity) includes, in para. (7), information about a person's **political opinions**, religious beliefs or worldview (s.3) [S15].
- A "מאגר מידע" (database) is any digitally processed collection of personal data. Amendment 13 broadened this, and enforcement powers were increased [S15][S16].

**Application:** if nothing linked to an identifiable person is stored, the core duties largely don't apply. The weak points are *incidental* identifiers: hosting or CDN request logs, analytics, error tracking, rate limiting, and the AI provider's request logs. Any of these could tie IPs or cookies to answers that reveal political opinions.

**PRODUCT IMPACT (verify):**
- Keep answers out of URLs and query strings, since those end up in logs. Share links should carry only the top-match party ID.
- Don't persist IPs, user agents or cookie IDs alongside answers. Check the default log retention of the hosting platform and the AI API.
- Keep tallies as bare counters (party, count), with no timestamps fine-grained enough to re-identify anyone.
- Publish a short privacy notice explaining that nothing personal is stored. Analytics cookies may need a consent notice.

**Confidence:** Medium (brief review only).

---

## 4. Consolidated PRODUCT IMPACT checklist

1. **Poll blackout** from `2026-10-23T12:00:00+03:00` until at least `2026-10-27T22:00:00+02:00`. Hide polling-average numbers, the below-threshold note **and** the "doesn't appear in published polls" note everywhere (research pages, results, share pages). Use one neutral explanatory sentence for all parties. Enforce it both in server rendering and with a client-side check of the absolute UTC instant (`2026-10-23T09:00:00Z`).
2. **Never** put poll figures or threshold notes in OG/share images, because social platforms cache them beyond the operator's control.
3. **Freeze the polling snapshot** before the blackout. Publish no new averages during it.
4. **Make sure the AI cannot emit poll data** during the blackout: strip poll data from its context or post-filter its output.
5. **Attribute polls:** for every poll in the average, give the pollster, commissioner, fieldwork dates, n and margin of error, with links. Include polls only after 24h have passed since their first publication.
6. **Never publish the anonymous result tallies.** If they were ever published, s.16ה(ד) would require a prominent non-scientific disclaimer, and the blackout would apply.
7. **Anonymity:** fine for an unpaid, neutral tool. **No paid promotion** that names or favours parties without identifying who ordered it. Add an anonymous contact address and a neutrality and methodology statement. *(Owner decision, 2026-10-06: no contact channel; the neutrality and methodology statement is published.)*
8. **Ballot letters and party marks:** use them factually only. (Party logos raise trademark and copyright questions outside election law. Plain text names are safest.)
9. **Election-over mode** at `2026-10-27T22:00:00+02:00`. Preferably never restore poll figures in the archive.
10. **Privacy:** make sure answers are never logged together with IPs or cookie IDs (hosting, analytics, AI provider). Add a privacy notice.

---

## 5. Open questions for a lawyer

1. Is a polling *average*, or a qualitative label derived from it, "the results of an election poll" under s.16ה? Do the s.16ה(ב)–(ג) disclosure duties apply to an aggregator?
2. Could the s.16ה(ח) "previously published + not current" carve-out ever cover a frozen snapshot? (This research recommends not relying on it.)
3. Is there any CEC chair ruling on vote-advice applications or aggregators? None was found.
4. Does paid promotion of a neutral quiz count as "election propaganda content published for payment" under s.2א1(ב)(2)?

---

## 6. Sources

All accessed 2026-10-06.

1. **[S1]** חוק הבחירות (דרכי תעמולה), התשי"ט-1959 — full text incl. s.1א, 2, 2א, 2א1, 2א2, 5, 7, 8, 16ה, 17, 17ב. Hebrew Wikisource (mirrors the Knesset legislation database; lists amendments through the 26th Knesset special-provisions law, 5786-2026). https://he.wikisource.org/wiki/חוק_הבחירות_(דרכי_תעמולה) — *Primary (statute text, unofficial consolidation).*
2. **[S2]** חוק הבחירות (דרכי תעמולה), התשי"ט-1959 — Nevo (s.16ה, 17, 17ב, cross-check). https://www.nevo.co.il/law_html/law00/90696.htm — *Primary (statute text, commercial consolidation).*
3. **[S3]** חוק הבחירות לכנסת [נוסח משולב], התשכ"ט-1969 — s.70א, 72, 126(5), 129. Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_הבחירות_לכנסת (also on Nevo: https://www.nevo.co.il/law_html/law01/190_026.htm, not fetched) — *Primary (statute text).*
4. **[S4]** "הקואליציה הודיעה כי הבחירות יתקיימו במועדן", Haaretz, 2026-07-12. https://www.haaretz.co.il/news/elections/2026-07-12/ty-article/0000019f-56a6-d38b-afbf-5fb6abe40000 — *Secondary (news).*
5. **[S5]** Reports of the CEC chair's 2023 decision setting 27 Oct 2026, e.g. Maariv "עכשיו זה סופי: נקבע תאריך הבחירות לכנסת ה-26" https://www.maariv.co.il/news/politics/article-996918 and ynet https://www.ynet.co.il/news/article/bkrqddcf3 (seen in search results; the date was confirmed by S4 and S6) — *Secondary (news).*
6. **[S6]** "ועדת הבחירות המרכזית פרסמה את לוח הזמנים לפעילותה", Zman Yisrael, 2026-07-31 (reports the CEC timetable, including the poll-ban start "מחצות בלילה שבין 23 ל־24 באוקטובר" and voting 07:00–22:00 on 27 Oct). https://www.zman.co.il/live/709108/ — *Secondary (news report of an official timetable).*
7. **[S7]** תב"כ 16/20 בן מאיר נ' נתניהו ואח', החלטת יו"ר ועדת הבחירות המרכזית לכנסת ה-20 השופט ס' ג'ובראן (2015), PDF hosted by The Seventh Eye. https://cdn.the7eye.org.il/uploads/2015/02/TBK-16-20.pdf — *Primary (CEC chair decision).*
8. **[S8]** "Election judge bars anonymous internet ads despite Likud objection", Times of Israel (Feb 2019). https://www.timesofisrael.com/election-judge-bars-anonymous-internet-adds-despite-likud-objection/ — *Secondary (news).*
9. **[S9]** חוק העונשין, התשל"ז-1977, s.61 (fine levels; 61(a)(2) = up to 29,200 NIS). Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_העונשין — *Primary (statute text).*
10. **[S10]** חוק קביעת הזמן, התשנ"ב-1992, s.3 (DST runs from the Friday before the last Sunday in March at 02:00 until the last Sunday in October at 02:00). Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_קביעת_הזמן — *Primary (statute text).* Cross-checked with the IANA tz database (`zdump -v Asia/Jerusalem`: transition 2026-10-25 02:00 IDT → 01:00 IST).
11. **[S11]** "סקרי בחירות לכנסת" — CEC poll repository on gov.il. https://www.gov.il/he/Departments/DynamicCollectors/knesset_election_polls_26 — *Primary (official). The page returned HTTP 403 to the fetch tool; its existence and description were seen only in search results.*
12. **[S12]** "מצפן הבחירות" 2026 — Mako. https://electionsvote.mako.co.il/ — *Secondary (example of market practice).*
13. **[S13]** "סקירת חוק הבחירות לכנסת העשרים ושש (הוראות מיוחדות ותיקוני חקיקה), התשפ"ו-2026 וכללי יו״ר ועדת הבחירות בעניין נחזות עמוקה", Israel Internet Association (ISOC-IL), 2026-07-27. https://www.isoc.org.il/regulation-digital-services/deep-fake-election-law — *Secondary (expert NGO analysis).*
14. **[S14]** חוק מימון מפלגות, התשל"ג-1973 — s.1 definitions ("פעילות בחירות", "גוף פעיל בבחירות") and s.10ג (2026 indexed threshold 120,400 NIS). Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_מימון_מפלגות — *Primary (statute text).*
15. **[S15]** חוק הגנת הפרטיות, התשמ"א-1981 (as amended by Amendment 13) — s.3 definitions ("מידע אישי", "מידע בעל רגישות מיוחדת" (7), "מאגר מידע"). Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_הגנת_הפרטיות — *Primary (statute text).*
16. **[S16]** "הרשות להגנת הפרטיות מעדכנת את הנחיותיה לאחר כניסת תיקון 13 לתוקף", law.co.il, 2025-08-14. https://www.law.co.il/news/2025/08/14/ppa-is-updating-its-guidelines-following-amendment-13/ (seen in search results; the in-force date was corroborated by several law-firm updates in the same search) — *Secondary.*
17. **[S17]** "הגבלות על פרסום סקרים סמוך לבחירות", Israel Democracy Institute. https://www.idi.org.il/parliaments/7129/9017 — *Secondary. Describes an **older** version of the ban (the 2003-era rule); used for background only and superseded by the current s.16ה(ח) text.*
