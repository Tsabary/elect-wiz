# Poll snapshot log (Stage 6, Task 3.5)

- **Snapshot taken:** 2026-10-06, about 20:30 Asia/Jerusalem (IDT). This is before the poll-blackout start (`2026-10-23T12:00:00+03:00`).
- **Agent:** Stage 6 poll-snapshot agent (single run). Only the `poll` field of each list in `content/registry/lists.json` was changed. No research documents were touched. `researchVersion` was not bumped; the orchestrator will do that.
- **Window:** polls **first published from 2026-09-15** (21 days before the snapshot) **to 2026-10-05 20:30 IDT** (at least 24 hours before the snapshot).
- **Result:** 38 of 38 lists are `polled` and 0 are `not_polled`. Every list is named, with a published percentage, by at least one poll in the window. Maagar Mochot's 2026-09-15–16 poll for Channel 16 lists every one of the 38 lists separately.

## Sources and method

**Primary source:** the Central Elections Committee's poll repository, "סקרי בחירות לכנסת" (https://www.gov.il/he/Departments/DynamicCollectors/knesset_election_polls_26). Each pollster files its report there, with the disclosure details required by s.16ה (commissioner, pollster, fieldwork dates and times, population, number approached and number who took part, margin of error) and the vote-intention table with **percentages for every list asked about**. The gov.il pages block direct fetching. The listing was read through a reader proxy (r.jina.ai), and the report PDFs were downloaded directly from `gov.il/BlobFolder/...` and read with `pdftotext`. Where the text layout was unclear (Maagar Mochot), the page was also rendered as an image and read.

The English Wikipedia page "Opinion polling for the 2026 Israeli legislative election" was used **as an index only**. Every figure below comes from a report or article that was opened. The index was wrong at least once: it gives the Reservists 2.5% in Channel 13's 2026-09-30 poll, but Channel 13's own article says 2.8%. **2.8% is used.**

**Which figure is averaged:** the percentage the poll itself publishes for the list. This is the raw (gross) vote-intention share in the CEC report, or a national percentage stated in the publisher's own article. Seats are never converted to percentages. No seat-based approximation was needed, because every list has published percentages.
- **Maagar Mochot** publishes two columns: a raw share that includes "don't know", and the share among respondents who named a party ("בעלי הדעה"). The second is used for its main table. Its page listing the smaller lists gives only the raw share, so that share is used for those lists.
- **Channel 13's** CEC reports give only separate, unweighted sub-sample shares (Jewish adults, young people, Haredim, Arabs). Channel 13 states that these "do not represent the national vote distribution", so they are not used. A Channel 13 poll counts only where Channel 13's article states a national percentage. That happens once in the window: the 2026-09-30 poll gives the Reservists 2.8%, the Haredi Public 1.3% and Blue and White 0.9%.
- **Selection:** for each list, the 5 most recent polls in the window that publish a percentage for that list, or all of them if there are fewer than 5. Polls that only give seats, or that name a list only as "below 1%" or "below the threshold", are recorded below but not averaged.
- **Average:** the arithmetic mean, rounded **half-up** to one decimal using exact decimal arithmetic.
- **`asOf`:** the publication date of the most recent poll included.
- **`publishedOn`:** the date the publisher first released the poll, verified where the page could be opened (see the table). For DRI's independent poll, the only publication found is the CEC posting.

## Polls in the window (opened)

| Key | Pollster | Commissioner / media | Fieldwork | First published | n | MoE | Source opened | Used for |
|---|---|---|---|---|---|---|---|---|
| C | Lazar Research | Maariv | 2026-09-30–10-01 | 2026-10-02 (JPost report 2026-10-02 07:48 UTC; the CEC report is dated 02.10) | 602 | ±4.0% | CEC Survey_4177 | all lists it names |
| A | Next Data | Channel 14 | 2026-10-01 | 2026-10-01 (date of Channel 14's report) | 2,145 | ±2.1% | CEC Survey_4176 | all lists it names |
| B | Direct Polls | i24NEWS | 2026-10-01 | 2026-10-01 16:53 (i24NEWS) | 504 | ±4.3% | CEC Survey_4178 + i24NEWS | lists with a figure. Names Color Black, Blue and White, Noam, Haredi Public, Ahi and Israel First only as "below 1%" (not averaged) |
| E | Yossi Tatika (Adgenda panel) | Zman Yisrael | 2026-09-30–10-01 | 2026-10-01 | 500 | ±4.4% | zman.co.il/729422 | Blue and White 1.40%. Every other list is seats only |
| D | Shmuel Rosner / Midgam Project / Stat-Net / Askaria | Channel 13 | 2026-09-29–30 | 2026-09-30 21:05 | 1,013 | ±3.1% | 13tv article + CEC Survey_4182 (disclosure) | Reservists 2.8%, Haredi Public 1.3%, Blue and White 0.9%. Every other list is seats only |
| F | Maagar Mochot | Channel 16 | 2026-09-29 | 2026-09-29 | 550 | ±4.2% | CEC Survey_4173 | all lists it names |
| G | Next Data | Channel 14 | 2026-09-28 | 2026-09-28 (c14.co.il) | 573 | ±4.1% | CEC Survey_4175 | Amcha Yisrael, Haredi Public, Noam, and the main lists |
| H | Kantar | Kan 11 | 2026-09-27 | 2026-09-27 | 552 | ±4.2% | CEC Survey_4179 | Noam, Color Black |
| I | Direct Polls | i24NEWS | 2026-09-24 | 2026-09-24 | 537 | ±4.2% | CEC Survey_4165 | not used (older than the 5 most recent). Small lists only "below 1%" |
| J | Lazar Research | Maariv | 2026-09-23–24 | 2026-09-25 (JPost) | 610 | ±4.4% | CEC Survey_4164 | Noam, Tzomet–Beit Yisrael |
| K | Next Data | Channel 14 | 2026-09-23 | 2026-09-23 | 535 | ±4.2% | CEC Survey_4171 | not needed |
| L | Channel 13 group | Channel 13 | 2026-09-22–23 | 2026-09-23 | 1,698 | ±2.4% | CEC Survey_4169 + article | not used (no national percentages) |
| M | Midgam (Mano Geva) | Channel 12 News | 2026-09-22 | 2026-09-22 | 501 | ±4.4% | CEC Survey_4162 | Tzomet–Beit Yisrael 0.0%, Israel First 0.0% |
| N | DRI Institute | independent (no commissioner) | 2026-09-15 | 2026-09-18 (posted on the CEC repository) | 1,891 | ±3.5% | CEC Survey_4154 | Israel First 0.37% |
| O | Kantar | Israel Hayom | 2026-09-16–17 | 2026-09-17 | 551 | ±4.2% | CEC Survey_4160 | Color Black 0.5% |
| P | Lazar Research | Maariv | 2026-09-16–17 | 2026-09-18 06:00 | 600 | ±4.4% | CEC Survey_4158 | Ahi 0.8%, Tzomet–Beit Yisrael 0.4% |
| Q | Direct Polls | i24NEWS | 2026-09-17 | 2026-09-17 | 525 | ±4.2% | CEC Survey_4161 | not averaged. Names Color Black, Haredi Public, Ahi, Blue and White, Noam, HaKahal and Israel First only as "below 1%" |
| R | Next Data | Channel 14 | 2026-09-17 | 2026-09-17 | 817 | ±3.4% | CEC Survey_4159 | not needed |
| S | Yossi Tatika | Zman Yisrael | 2026-09-16–17 | 2026-09-17 | 500 | ±4.4% | zman.co.il/725468 | not needed (Amcha Yisrael 3.00%, Reservists 2.20%, Blue and White 2.00%, all older than the 5 most recent) |
| T | Maagar Mochot | Channel 16 | 2026-09-15–16 | 2026-09-16 | 535 | ±4.2% | CEC Survey_4151 (pp. 3–4) | **every list**. p.4 gives raw shares for all the smaller lists |
| U | Channel 13 group | Channel 13 | 2026-09-15–16 | 2026-09-16 | 1,023 | ±3.1% | CEC Survey_4153 + article | not used (no national percentages) |
| V | Next Data | Channel 14 | 2026-09-15 | 2026-09-15 | 433 | ±4.7% | CEC Survey_4150 | not needed |

CEC report URLs follow the pattern `https://www.gov.il/BlobFolder/dynamiccollectorresultitem/knesset_electionNN/he/Survey_XXXX.pdf`. The exact URL of each poll used is stored in that list's `constituentPolls`.

**Excluded:**
- **Channel 12 / Midgam, 2026-10-05.** First published 2026-10-05 21:10, less than 24 hours before the snapshot.
- **Kan 11 / Kantar, 2026-10-04.** Published 2026-10-04 20:30, so it is in the window. Its article text gives seats only and says Amcha Yisrael is below the threshold. The results graphic could not be fetched (HTTP 403), and the poll is not yet in the CEC repository. With no percentage opened, it is not averaged.
- **Channel 12 / Midgam, 2026-09-14** (CEC Survey_4147) and **Kan 11 / Kantar, 2026-09-14** (CEC Survey_4146). Both were first published on 2026-09-14 (mako's follow-up article of 15.09 13:19 refers to the poll released "last night"), which is before the window.
- **Segment surveys, not national:** aChord (Survey_4183: non-Haredi Jews aged 22–34) and Dialog for Yedioth/ynet (Survey_4166: self-described liberals). DRI's 2026-09-18–20 survey (Survey_4186) has no vote-intention question.
- **Maagar Mochot / Channel 16, 2026-09-24.** Listed in the index, but no report or article could be opened (the source is a video broadcast). Not used.
- **Yossi Tatika, 2026-09-23–24.** Seats only.

## Per list

Percent = the mean stored in `lists.json`. The polls are listed by key from the table above. Unless noted otherwise, the 13 main lists use **C, A, B, F, G**: polls published 2026-09-28 to 2026-10-02, from 4 pollsters, with `asOf` 2026-10-02.

| List | Status | % | Polls averaged (published %) | Notes |
|---|---|---|---|---|
| likud | polled | 20.3 | C 14.8, A 24.9, B 22.0, F 16, G 24.0 | |
| yashar | polled | 16.4 | C 15.4, A 16.4, B 17.1, F 17, G 16.3 | |
| together | polled | 8.7 | C 11.3, A 6.1, B 7.4, F 12, G 6.9 | |
| the-democrats | polled | 7.6 | C 8.6, A 7.1, B 7.1, F 8, G 7.1 | |
| otzma-yehudit | polled | 6.3 | C 7.6, A 5.5, B 6.4, F 7, G 5.1 | |
| shas | polled | 6.5 | C 5.7, A 7.7, B 5.5, F 6, G 7.5 | |
| united-torah-judaism | polled | 6.0 | C 5.5, A 6.1, B 6.1, F 6, G 6.4 | |
| joint-list | polled | 5.8 | C 6.0, A 5.1, B 6.5, F 6, G 5.2 | joint list, polled as the list |
| yisrael-beytenu | polled | 5.5 | C 7.4, A 4.7, B 5.6, F 5, G 4.8 | |
| religious-zionism-zehut | polled | 4.7 | C 3.9, A 5.2, B 4.3, F 5, G 5.3 | |
| raam | polled | 4.1 | C 4.7, A 3.6, B 4.2, F 4, G 3.8 | |
| amcha-yisrael | polled | **2.8** (below 3.25) | C 3.5, A 1.7, B 3.3, F 4, G 1.6 | Polls in the window disagree on whether it passes the threshold. Kan (10-04) says below the threshold, without a percentage. Channel 13 (09-30) and Tatika (10-01) give seats only (5 and 4). None of these three is averaged. |
| reservists-and-economic-party | polled | **2.5** (below) | C 3.6, A 1.2, B 1.8, D 2.8, F 3.3 | 5 pollsters. Kan (10-04, 4 seats) and Tatika (10-01, 5 seats) give seats only. |
| blue-and-white | polled | **0.8** | C 0.7, A 0.4, E 1.40, D 0.9, F 0.4 | asOf 2026-10-02. Direct Polls (10-01) gives only "below 1%". |
| haredi-public | polled | **0.6** | C 0.6, A 0.2, D 1.3, F 0.6, G 0.2 | asOf 2026-10-02 |
| noam | polled | **0.4** | C 0.4, A 0.1, G 0.2, H 0.4, J 0.7 | asOf 2026-10-02. Direct Polls gives only "below 1%". |
| tzomet-beit-yisrael | polled | **0.2** | C 0.3, J 0.2, M 0.0, P 0.4, T 0 | asOf 2026-10-02 |
| ahi-movement | polled | **0.4** | A 0.1, P 0.8, T 0.3 | Only 3 polls give a percentage. Direct Polls (10-01, 09-17) gives only "below 1%". asOf 2026-10-01. |
| color-black | polled | **0.4** | H 0.6, O 0.5, T 0.2 | Only 3 polls give a percentage. Direct Polls (10-01, 09-24, 09-17) gives only "below 1%". Channel 13 shows it only in sub-sample tables. asOf 2026-09-27. |
| israel-first | polled | **0.2** | M 0.0, N 0.37, T 0.2 | Only 3 polls give a percentage. Direct Polls gives only "below 1%". asOf 2026-09-22. |
| hakahal | polled | **0.3** | T 0.3 | Single poll. Direct Polls (09-17) gives only "below 1%". Channel 13 shows it only in sub-sample tables. asOf 2026-09-16. |
| together-we-will-succeed | polled | 0.3 | T 0.3 | single poll, asOf 2026-09-16 |
| tekuma | polled | 0.1 | T 0.1 | single poll, asOf 2026-09-16 |
| sharshar, partnership-for-all, pirates, gan-eden, womens-voice, just-law, shema, new-order, you-and-me, brit-olam, hatikun, bible-bloc, betach, orot-hashachar, personal-security | polled | 0.0 | T 0% each | Single poll. Maagar Mochot's p.4 names each list separately at 0%, so none of them is "not polled". asOf 2026-09-16. |

## Judgement calls (for the orchestrator and owner)

1. **No list is `not_polled`.** Maagar Mochot's 2026-09-16 report for Channel 16 names all 38 lists individually, so under rule 3 every list counts as "polled". 15 lists show 0.0% and two show 0.1–0.3%, each from that one poll. The site will show "below threshold, 0.0%", dated 2026-09-16, for those lists rather than "doesn't appear in published polls". If the owner would rather treat lists that only one poll names at 0% as `not_polled`, that is a policy change to Stage 6, not something this run can decide.
2. **Vote-share basis.** Pollsters publish shares on slightly different bases. Channel 14's raw share includes 1–3% undecided in the base. Lazar, Kantar and Midgam give raw shares (Midgam's note says they don't "crack" undecided voters). For Maagar Mochot, the share among respondents who named a party is used. The figures are averaged as published, without any re-basing, because re-basing would be an estimate.
3. **Channel 13** is excluded except where its article gives a national percentage. Its CEC tables are sub-sample shares that Channel 13 itself says are not national.
4. **"Below 1%" mentions** (Direct Polls) are recorded here but not averaged and not turned into numbers. Every such list has at least one poll that publishes a percentage, so the "highest published below-threshold percentage" fallback was never needed.
5. **Kan 11 (2026-10-04)** is in the window but not averaged: its percentages were in a graphic that returned HTTP 403, and the poll is not yet in the CEC repository. A re-run after the CEC posts it, or with access to Kan, may change Amcha Yisrael's and the Reservists' averages.
6. **24-hour rule.** Channel 12's 2026-10-05 poll (published 21:10) was less than 24 hours old at snapshot time and is excluded.
7. **`publishedOn`** dates for Channel 14 (10-01, 09-23), Channel 12 (09-22) and Kan (09-27) come from the publishers' report dates and the Wikipedia index citations, because c14.co.il and mako.co.il block automated fetching. All of them are well inside the window, so the window and the 24-hour rule are not affected.

## Helper spot-check (`lib/content/polls.ts`)

The check ran against the real `content/registry/lists.json` with `tsx`:
- `amcha-yisrael` (2.8) → `{kind: "below-threshold", percent: 2.8, asOf: "2026-10-02"}`. During the blackout → `null`.
- `reservists-and-economic-party` (2.5) → `below-threshold`, 2.5, asOf 2026-10-02. During the blackout → `null`.
- `likud` (20.3) → no note. `pollingLineFor` gives 20.3 / 2026-10-02.
- `raam` (4.1) → no note. `pollingLineFor` gives 4.1.
- `pirates` (0.0) → `below-threshold`, 0, asOf 2026-09-16.
- Counts: 38 polled, 0 not_polled, 0 pending. With no `not_polled` list in the real data, the not-polled note was checked on a `not_polled` snapshot of the same schema → `{kind: "not-polled", asOf: "2026-10-06"}`. `lib/content/polls.test.ts` passes (7 tests).

`npm run validate:content` passes. With `CONTENT_CORPUS=real`, the only errors are the expected `research-missing` ones (the research isn't written yet). There are no registry or poll errors.
