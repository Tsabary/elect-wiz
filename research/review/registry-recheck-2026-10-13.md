# Registry recheck against CEC data — 13 October 2026 (early run of Task 4.3)

**Run:** 2026-10-13, 14:47–15:10 Asia/Jerusalem. **Scope:** read-only comparison of `content/registry/lists.json` (38 lists) and `content/registry/parties.json` (52 parties) with Central Elections Committee (CEC) material fetched during this run. Nothing in `content/` or the code was changed.

**Rule followed:** every comparison rests on a file or page fetched today. Requests were spaced 2–4 seconds apart.

## Headline

- **The lists are not final yet.** The CEC's own timeline still shows the s.65 publication for **18/10/2026**. This recheck must be repeated on or after that date.
- **All 38 registry lists appear on the CEC's poster of approved ballot slips, and no other list does.** All 38 sets of **ballot letters match exactly**.
- **3 list names differ** from the CEC's approved slips (`new-order`, `shas`, `betach`). One of them (`new-order`) changes the meaning and the English name.
- **Top candidates:** order matches the CEC candidate pages for all 38 lists. These pages date from 07–09/09/2026, so they predate the approval and the Supreme Court rulings. **No CEC source for the current candidate order was reachable.**
- **No list has withdrawn, been disqualified or merged** according to anything fetched today. This rests on the CEC poster (file dated 04/10, re-saved 12/10) and on press searches, not on a current CEC list page.

## 1. Sources opened (all on 2026-10-13)

### CEC (official)

| # | Title | URL | Result |
|---|---|---|---|
| C1 | "ציר הזמן לבחירות לכנסת ה-26" (timeline on the CEC home page) | `https://www.bechirot.gov.il/home/`, data via `POST https://www.bechirot.gov.il/umbraco/api/Carousel/GetCarousel` with body `{"id":"176858","CurrentPageId":"22714"}` | 200. 36 timeline entries. (The GET form used on 06/10 now redirects to an error page; the site's own script uses POST.) |
| C2 | **"פלקט דוגמאות פיתקי הצבעה סופי"** — poster headed "ועדת הבחירות לכנסת העשרים ושש — להלן דוגמאות פתקי ההצבעה שאושרו לרשימות המועמדים לכנסת" | `https://www.gov.il/BlobFolder/guide/candidates-lists-26/he/Approved%20Voting%20Slips.pdf` | 200. 1 page. PDF created 30/09/2026, modified 04/10/2026; server `Last-Modified` 12/10/2026 09:44 GMT. SHA-256 `b97f7244…dd8b9834`. Shows 38 slips plus one blank slip. |
| C3 | CEC decision פ"מ 6/26, Likud v. the Joint List (list), 24/09/2026 | `https://www.gov.il/BlobFolder/guide/candidates-lists-26/he/pm6_26_fdList.pdf` | 200 |
| C4 | CEC decision פ"מ 6/26, Likud v. Ofer Cassif, 24/09/2026 | `…/candidates-lists-26/he/pm6_26_fdCassif.cleaned.pdf` | 200 |
| C5 | CEC decision פ"מ 8/26, Otzma Yehudit v. Sami Abu Shehadeh, 24/09/2026 | `…/candidates-lists-26/he/pm8_26_fdAbuShehadeh.cleaned.pdf` | 200 |
| C6 | CEC plenum protocols of 23/09 and 24/09/2026 | `…/candidates-lists-26/he/pm-pr_transcript1.pdf`, `…/pm-pr_transcript2.pdf` | 200. Skimmed only (agenda pages). |
| C7 | Filings in the same folder: `pr1_26.pdf`, `pr_9_26_reply_Redacted.pdf`, `pr_4-6_26_reply_Redacted.pdf`, `pm3_26.pdf` | same folder | 200. Downloaded, not analysed (party submissions, not CEC decisions). |
| C8 | CEC home-page header menu and boxes | `POST https://www.bechirot.gov.il/umbraco/api/Header/getheader`, `…/ContentShow/GetContentItems` | 200. Used only to find the CEC's current gov.il addresses. |

All files in the `candidates-lists-26` folder carry `Last-Modified: 12 Oct 2026 09:44 GMT`, so the CEC re-saved that page's attachments yesterday. No new file names were found beyond those listed (found through web search and the Wayback Machine index; the folder cannot be listed).

### CEC content, hosted copy

| # | Title | URL | Result |
|---|---|---|---|
| I1 | IDI index "בחירות 2026 \| רשימת מפלגות ומועמדים" | `https://www.idi.org.il/policy/parties-and-elections/elections/2026-1` | 200. Still 38 lists, same 38 PDF links as in `ground-truth.md` [5]. |
| I2 | The 38 copies of the CEC candidate-list pages ("רשימת המועמדים הוגשה מטעם…") | the 38 `idi.org.il/media/323NN/…pdf` addresses in `ground-truth.md` [5] | 200 for all 38. CEC publication dates on the pages: 07–09/09/2026. Server `Last-Modified` 09/09/2026 for all, so **IDI has not refreshed them**. |

### Not reachable

| What | Result |
|---|---|
| `https://www.gov.il/he/pages/candidates-lists-26` (the CEC's live candidate-lists page) | **HTTP 403 (Cloudflare block)**, by direct request and by the fetch tool. Same as on 06/10. |
| `https://www.gov.il/he/departments/units/elections-26/govil-landing-page`, `https://www.gov.il/he/pages/26elections-info`, `https://www.gov.il/he/departments/central-elections-committee/govil-landing-page`, the gov.il collectors for CEC decisions and news | 403 |
| Wayback Machine | Index reachable. Only capture of the candidate-lists page is from 08/09/2026 (before approval); page capture returned 429. The index is how the poster's address (C2) was found. |
| `https://votes26.bechirot.gov.il/` | 404 (results site not up yet) |

### Non-CEC (statute and press, for section 2 and section 5 only)

| # | Title | URL |
|---|---|---|
| N1 | חוק הבחירות לכנסת [נוסח משולב], ss.65, 77, 87 (Hebrew Wikisource) | `https://he.wikisource.org/wiki/חוק_הבחירות_לכנסת` |
| N2 | "בני גנץ מודיע רשמית: אני רץ עד הסוף", Arutz Sheva, 10–11/10/2026 | `https://www.inn.co.il/news/708140` |
| N3 | "Israeli Election Watch 2026: Live Archive", Center for Israel Education (latest entry 09/10/2026) | `https://israeled.org/israeli-election-watch-2026-live-archive/` |
| N4 | "הבחירות לכנסת העשרים ושש", Hebrew Wikipedia (pointer only) | `https://he.wikipedia.org/wiki/הבחירות_לכנסת_העשרים_ושש` |
| N5 | Six web searches in Hebrew and English for withdrawals, disqualifications, mergers and CEC or court decisions in October 2026 | — |

## 2. Are the lists final?

**No.** The CEC timeline (C1), fetched today, still reads:

> 16/10/2026 — מועד אחרון להודעה לוועדה המרכזית בדבר התקשרויות (הסכמי עודפים) – לפי סעיף 67 (ב)
> **18/10/2026 — פרסום רשימות המועמדים – לפי סעיף 65**
> 20/10/2026 — פרסום הודעה על מקומות הקלפי – לפי סעיף 68 (ד)

The timeline is unchanged from the one recorded in `ground-truth.md`. Entries already past: 27/09 "הודעה על אישור רשימת מועמדים – לפי סעיף 63", 29/09 appeals, 04/10 "מסירת פסקי הדין בעניני פסילה ואישור רשימה או מועמד". Today's entry (13/10) is the start of broadcast campaigning.

What the statute says (N1, non-CEC text of the law):

- **s.65:** "הועדה המרכזית תפרסם ברשומות, לא יאוחר מהיום ה־9 שלפני יום הבחירות, את רשימות המועמדים כפי שאישרה היא או כפי שהחליט בית המשפט העליון לפי סעיף 64; הפרסום יציין כינוי ואות של כל רשימה." The 9th day before 27/10 is 18/10. The wording is "not later than", so the publication could come earlier; nothing fetched today shows that it has.
- **s.77(א):** the CEC prints ballot slips for the lists published under s.65.
- **s.87:** "מועמד יכול להתפטר בכל עת"; and "התפטר או נפטר מועמד אחרי פרסום רשימות המועמדים ולפני יום הבחירות, תפרסם הועדה המרכזית הודעה על כך ברשומות."

What can still change, and until when:

| Change | Until when | Basis |
|---|---|---|
| Disqualification or approval of a list or candidate by the CEC or the Supreme Court | Closed. Appeals were due 29/09, judgments 04/10. | C1 |
| Surplus-vote agreements between lists | 16/10/2026 | C1. Does not change the registry. |
| An individual candidate resigning (which changes `topCandidates` if in the top five) | **Any time, including after 18/10** | N1 s.87 |
| A whole list dropping out | Not settled by anything fetched. I found no section of the law on a list withdrawing; s.87 covers candidates only. Treat as possible until election day and check again on 18/10 and shortly before 27/10. | N1 (absence of a provision is my reading, not a CEC statement) |
| List mergers | No provision found for merging after submission; not verified with a CEC source. | — |

## 3. Differences found

### 3a. Differences that matter

| List id | Field | Registry value | CEC value | Source |
|---|---|---|---|---|
| `new-order` | `name.he` | סדר חדש לכינון חוקה, להפרדת רשויות ולבחירות **ישירות** | סדר-חדש לכינון חוקה, להפרדת רשויות ולבחירות **אישיות** | C2, slip קך (checked at 400 dpi) |
| `new-order` | `name.en` | "…and **Direct** Elections" | follows from the Hebrew: "…and **Personal** Elections" | C2 |
| `shas` | `name.he` | התאחדות הספרדים שומרי **התורה** תנועתו של מרן עובדיה יוסף זצ״ל | התאחדות הספרדים שומרי **תורה** תנועתו של מרן **הרב** עובדיה יוסף זצ"ל | C2, slip שס (checked at 400 dpi). The CEC candidate page title (I2) agrees with the slip. |
| `betach` | `name.he` | בטח – **ביטחון** חברתי בראשות סמיון גרפמן | בטח - **בטחון** חברתי בראשות סמיון גרפמן | C2, slip ז (checked at 400 dpi). The registered party name in `parties.json` already uses "בטחון". |

`shas` is a researched party; `new-order` and `betach` are listed-tier. The registry took these three names from press reproductions of the 27/09 announcement; the slips are the CEC's own approved text.

### 3b. Spelling differences in candidate names (registry v. CEC candidate pages of 07–09/09)

Order is identical in every case; only the spelling or the number of given names differs. Most look like deliberate use of the familiar name. Listed so the owner can decide.

| List id | # | Registry | CEC page (given as first name(s) + surname) | Already noted in the registry? |
|---|---|---|---|---|
| `yashar` | 1 | גדי איזנקוט | גדי **אינזקוט** (the slip C2 spells איזנקוט) | yes |
| `amcha-yisrael` | 1 | עופר וינטר | עופר **ווינטר** (the slip C2 spells וינטר) | yes |
| `raam` | 3 | וליד טאהא | **ווליד** טאהא | no |
| `haredi-public` | 1 | פנחס מרדכי (מוטי) ליטנר | פנחס מרדכי ליטנר | "(מוטי)" added by us |
| `color-black` | 2 | דרור דגני | דרור **אליהו** דגני | no |
| `color-black` | 4 | יצחק חי הכהן רבין חיימוב | יצחק חי **רפאל** הכהן רבין חיימוב | no |
| `likud` | 2 | אלי (אליהו) כהן | אליהו כהן | "אלי" added by us |
| `likud` | 4 | יריב לוין | יריב **גדעון** לוין | no |
| `likud` | 5 | מירי רגב | **מרים** רגב | no |
| `blue-and-white` | 1 | בני גנץ | **בנימין** גנץ | no |
| `blue-and-white` | 2 | פנינה תמנו | פנינה **(פנחש)** תמנו | no |
| `blue-and-white` | 3 | עליזה בלוך | **גאולה** עליזה בלוך | no |
| `religious-zionism-zehut` | 1–4 | בצלאל סמוטריץ', משה פייגלין, אורית סטרוק, שמחה רוטמן | בצלאל **יואל** סמוטריץ, משה **זלמן** פייגלין, אורית **מלכה** סטרוק, שמחה **דן** רוטמן | no |
| `tzomet-beit-yisrael` | 1 | גדי (דסטה) יברקן | דסטה יברקן | yes |
| `tekuma` | 5 | ליאנה פרץ חיימוביץ' | ליאנה **מירלה** פרץ חיימוביץ' | no |
| `joint-list` | 1 | יוסף ג'בארין | יוסף **גבארין** (no geresh on the CEC page; the CEC's own decision C3 writes ג'בארין) | no |
| `united-torah-judaism` | 2 | יצחק גולדקנופ | יצחק **יששכר** גולדקנופ | no |
| `noam` | 1 | אבי (אביגדור) מעוז | אביגדור מעוז | "אבי" added by us |

### 3c. Expected difference, not confirmed by a current CEC source

| List id | Field | Registry value | CEC value | Source |
|---|---|---|---|---|
| `joint-list` | `topCandidates` #3–#5 | פאתן ג'טאס, בכר עואודה, עופר כסיף | #3 סאמי אבו שחאדה, #4 פאתן ג'טאס, #5 בכר עואודה, #6 עופר כסיף | I2, page dated 09/09/2026 |

The registry reflects Abu Shehadeh's withdrawal of 02/10 (press, `ground-truth.md` [10]). The CEC page copy predates it. The CEC's decision C5 confirms he was the candidate "במקום ה-3" and C4 that Cassif was "במקום השישי", which is consistent with the registry's order after one removal. **No CEC document fetched today shows the list after the withdrawal.** Confirm on 18/10.

### 3d. Punctuation only (no action suggested)

`shema`: registry "שמע – בראשות נפתלי גולדמן", slip "שמע בראשות נפתלי גולדמן" (no dash). `raam`, `ahi-movement`, `hakahal`, `bible-bloc`, `pirates`, `together-we-will-succeed`: dashes, commas and line breaks only; wording identical.

### 3e. Coverage — what was and was not compared

| Field | Lists compared | Against | Gaps |
|---|---|---|---|
| Present among approved lists | 38 of 38 | C2 (file of 04/10, re-saved 12/10) | Not checked against a live CEC list page (403). |
| Hebrew list name | 38 of 38 | C2, read from the rendered image. The PDF has no usable text layer, so every name was read by eye at 200 dpi, and the three differing names again at 400 dpi. | A one-letter slip in my reading of a name that I judged identical is possible; the 18/10 recheck should repeat this. |
| Ballot letters | 38 of 38, exact | C2 | none |
| Top candidates: order | 38 of 38 (all candidates stored: 5 each, except `shema` 1, `bible-bloc` 4, `betach` 3, which are those lists' full length) | I2, pages of 07–09/09/2026 | **Stale source.** Any change after 09/09 other than Abu Shehadeh's is invisible here. |
| Top candidates: Hebrew spelling | 38 of 38 | I2 | Same caveat. |
| Member parties: number and registered names | 38 of 38 | I2 ("הוגשה מטעם מפלגת…") | All match. The CEC page header for `joint-list` misspells the Communist Party's name ("הקומוניסטית השיראלית") and that for `tzomet-beit-yisrael` reads "לכלל **עם** ישראל" while the per-candidate lines on the same page read "לכלל ישראל" as the registry does. |
| Party leaders (`parties.json`) | 52 of 52 located in their list's candidate page, at the rank the registry notes give (e.g. Sa'ar #7, Tropper #6, Lasky #6, Porush #4) | I2 | **`balad`**: leader Sami Abu Shehadeh is on the 09/09 page at #3 but, per press, is no longer a candidate (already noted in the registry). Whether each "leader" is the party's actual chair was not checked; not a CEC matter. |
| `status` | 38 of 38 "approved" consistent with C2 | C2 | No CEC statement dated after 04/10 was reachable. |
| English names, polls, platform links | not checked | — | Out of scope, apart from the `new-order` English name that follows from its Hebrew. |

## 4. Lists missing on either side

- **In the CEC data but not in the registry:** none. The poster has 38 named slips plus one blank slip (the blank is the write-in slip of s.76(ג), not a list).
- **In the registry but not in the CEC data:** none. Both Ra'am (עם) and the Joint List (ודם) are on the poster, which is dated after the Supreme Court's 02/10 rulings.

Letter-to-list mapping read from the poster: אמת the-democrats · ב otzma-yehudit · בד together-we-will-succeed · בי tzomet-beit-yisrael · בקר orot-hashachar · ג united-torah-judaism · ד partnership-for-all · די reservists-and-economic-party · דרך yashar · ה gan-eden · ודם joint-list · ז betach · זך haredi-public · זץ brit-olam · ט religious-zionism-zehut · י israel-first · יק bible-bloc · ך amcha-yisrael · כן blue-and-white · ל yisrael-beytenu · מחל likud · ני noam · נף shema · נץ personal-security · נקי hatikun · נר color-black · עם raam · פה you-and-me · צבי ahi-movement · צדק sharshar · צף pirates · ק tekuma · קה womens-voice · קך new-order · קץ just-law · רץ hakahal · רק together · שס shas.

## 5. Official announcements since 8 October 2026

- **CEC:** no announcement, decision or court ruling dated after 04/10/2026 was found in anything reachable. The only sign of CEC activity is that the attachments of the candidate-lists page were re-saved on 12/10/2026; their contents date from September and 04/10. The CEC's news and decisions pages on gov.il could not be opened, so **a CEC notice from the last five days cannot be ruled out**.
- **Courts:** nothing found after the 02/10 Supreme Court rulings and the 04/10 rejection already in `ground-truth.md`.
- **Press (non-CEC):** searches found no report of any list withdrawing, merging or being struck since 08/10. One item bears on a registry list: Benny Gantz stated on 10/10 that Blue and White will not withdraw ("אני רץ עד הסוף") (N2). The Center for Israel Education's election log (latest entry 09/10) and Hebrew Wikipedia record no change to the 38 lists after 02/10.

## For the 18 October recheck

1. Repeat everything against the s.65 publication in Reshumot. For the 25th Knesset the CEC posted that publication as a PDF under `gov.il/BlobFolder/guide/election-committee-history/…`; `BlobFolder` files are reachable even though gov.il pages are not.
2. Decide on the three names in 3a (the s.65 publication states each list's כינוי and will settle them).
3. Confirm the Joint List order after Abu Shehadeh, from a CEC source.
4. Candidate order for all lists comes only from the September pages; the s.65 publication is the first CEC source that can confirm it.
5. Add the poster (C2) to `ground-truth.md` as the CEC source for ballot letters, replacing the Ynet/Maariv basis.

## Applied (orchestrator, 2026-10-13)

The three list names were corrected in `content/registry/lists.json` to match the approved ballot slips: `new-order` (Hebrew and English: "personal elections", not "direct elections"), `shas` (Hebrew: "שומרי תורה … מרן הרב עובדיה יוסף") and `betach` (Hebrew: "בטחון"). Candidate-name spellings were left as they are: the differences are familiar names against filed names. The Joint List order after Abu Shehadeh's withdrawal could not be confirmed from a CEC document and stays as recorded.

**To repeat on or after 18 October 2026**, against the publication under section 65: the three names above, the Joint List order, and any list or candidate change. The committee's live news and decisions pages were not reachable for this check.
