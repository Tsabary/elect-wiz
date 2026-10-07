# Fact-check: taal

- Document checked: content/research/en/taal.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 192 · Corrected: 27 · Removed: 6 · Sources replaced: 0 (1 source removed, 3 added; now 106)
- Limited-information flag: false (Tibi has sat in the Knesset continuously since 1999, with an official biography, a full per-MK 25th-Knesset voting record and frequent interviews in Hebrew, Arabic and English; the Joint List publishes economic and crime plans on its website. Gaps — no separate Ta'al platform, almost nothing on the other Ta'al candidates — are stated in #information-availability, which does not start with "Limited information.")

Method: all 104 cited URLs were opened in this session (curl into the scratchpad, or WebFetch where curl got HTTP 403: Times of Israel, The New Arab, +972, Calcalist). Maariv articles were read from the article JSON in the page (the visible HTML is truncated). All 24 cited Knesset votes were re-fetched from `GetVoteDetails/{id}` (www host, one request every 2.5 s); this endpoint returns every member row in one response, and for each vote the number of rows equals the sum of the vote counters (e.g. 46121: 99 rows = 56+43; 46248: 115 rows), so no tally is an undercount. Per-MK positions were matched by name. Tibi's and Bin Said's current positions were read from Knesset OData `KNS_PersonToPosition` (www host). Source numbers below are the **new** numbering unless marked "old".

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | Bin Said "came from the Bedouin town of Segev Shalom" | Knesset record gives no residence; says he taught at Segev Shalom high school and headed the council's education department | Reworded to what the record says | [8] |
| #overview | Ta'al MK count / Bin Said resignation: "submitted and then withdrew a resignation" cited to Kan Arabic and Kikar HaShabbat together | The two reports conflict (Kikar, 14 July: resignation takes effect next day; Kan, 15 July: withdrawn within the legal window, joined Hadash) | Resolved: both reports given with dates; Knesset OData shows Bin Said still a current MK in the Hadash–Ta'al faction (from 20 June 2025, no end date). Kan's account stands | [11, 12, 104] |
| #overview, #leadership | "which Tibi chairs [7]" / "He currently chairs the Hadash–Ta'al Knesset faction [7]" | Knesset biography does not say this | Re-cited to Knesset OData (PositionID 48 "faction chair", Hadash–Ta'al, from 15 Nov 2022, current; Finance Committee member) | [104] |
| #overview | Bin Said entered "June 2025" | Exact date available | 20 June 2025 | [10, 104] |
| #overview | April 2019: "Ra'am and Balad ran separately" | JTA: Ra'am and Balad ran together (Ra'am–Balad, 4 seats) | Corrected | [18] |
| #overview | "Tibi is to chair the faction" | JPost: "is expected to" | Reworded as expected | [24] |
| #overview | CEC disqualification "on a petition by Likud" | Ground not stated | Added the Basic Law ground (support for armed struggle), per ToI | [5] |
| #leadership | Zahalka "filed at No. 12" | Moves to No. 11 after Abu Shehadeh's withdrawal | Added | [1, 3] |
| #leadership | Saadi "Tibi's long-time associate" cited to Al-Quds only | Al-Quds does not say this | Attributed to JPost ("close associate") | [24, 25] |
| #issue-cost-of-living | Joint List plan known only via Zo Haderech | The plan is published on the Joint List's own website (linked from the Zo Haderech article) | Added the primary source; made details exact (minimum wage "at least" 70%; basic allowance 25% of average wage; tax exemption covers self-employed; benefits for "financial corporations and large companies") | [105, 86] |
| #issue-cost-of-living | "as did the rest of the opposition" (Dec 2024 votes) | Not checked against any source; Odeh was absent from vote 42577 | Removed; tallies added (55-52, 59-58, 62-55) | [69, 70, 76] |
| #issue-cost-of-living | "Tibi initiated the Aviation Services Law" | Source says only that it is "known as the Tibi law" | Reworded | [96] |
| #issue-cost-of-living | El Al asked "the government" ... "war with Iran" | Calcalist: asked the Transport Ministry, over Operation Rising Lion | Made exact | [97] |
| #issue-crime-in-arab-society | No Joint List crime programme cited | The Joint List publishes a "plan to eradicate organised crime" | Added as Formal commitment; closest-option line adjusted to cite it (option unchanged) | [106] |
| #issue-crime-in-arab-society | Gap-closing programmes cited to Zo Haderech as plain text | Primary source available | Tagged Formal commitment, cited the Joint List page | [105] |
| #issue-gaza | Zo Haderech review presented without partisan context; "a deal releasing all hostages" as a Joint List demand | Zo Haderech is the Communist Party's weekly; it says the member parties "demanded" the deal | Attributed and dated (7 Oct 2026); wording made exact | [85] |
| #issue-haredi-enlistment | "Haredi parties backed it as a way to protect yeshiva students' exemptions [47]" | ToI wording is its own description of the bill's purpose | Attributed to ToI; added Ynet that the explicit equivalence clause was removed | [46, 47] |
| #issue-haredi-enlistment | "Several outlets reported that Arab MKs stayed away as part of an understanding" | Ynet attributes it to opposition sources; ToI to "Hebrew media reports"; Walla to "claims" | Attributed; both Walla denial reports kept | [46–49] |
| #issue-haredi-enlistment | "might not have passed without their absence" (used in the Contradiction) | ToI says so; Ynet says it would still have passed. Official tally 56-43 with all 10 Hadash–Ta'al and Ra'am MKs absent (no Arab MK among 99 rows): 43+10 = 53 < 56 | Both reports given; official arithmetic stated | [46, 47, 71] |
| #issue-haredi-enlistment | First reading: "Hadash MKs voted against" | Vote 46181 (116 rows): Bin Said (then Ta'al) also voted against; Tibi did not vote | Corrected, tally 63-53 added | [72] |
| #issue-haredi-enlistment | **Contradiction:** Dec 2025 statement vs June 2026 absence | Judged not warranted (see Notes) | Replaced with an untagged "Note on consistency" giving critics' accusation (Haskel, Ynet), the Hadash–Ta'al source's Dec 2025 remark that abstention was "certainly possible", and why the record does not show a direct contradiction | [44, 45, 47, 71–73] |
| #issue-housing | Kaminitz Law "a 2017 amendment that toughened..."; quote "one of the most racist laws" | Year not in source; quote inexact | Described as Tibi describes it; quote corrected to "the most terrible racist laws" | [30] |
| #issue-judea-samaria, #other-international-pressure | "ban on trade in goods from settlements" | Srugim: trade ban on goods from Judea and Samaria; quote "better late than never" | Made exact | [83] |
| #issue-october-7-inquiry | "Tibi and Samir Bin Said voted for private bills" | Bin Said voted only on 44669 (absent from 44661) | Corrected | [60, 61] |
| #other-arab-citizens-equality | "He opposes the Nation-State Law (2018)" | No cited source has Tibi stating this; Shomrim has him criticising the Supreme Court for not intervening against it | Reworded to what the source says | [89, 80] |
| #other-security-prisoners | Petition filed "in April 2024"; Barghouti "five life sentences" cited to [93] (old) | Petition date not in source; sentence is in the Shin Bet article | Date removed; sentence cited to the Shin Bet article | [92, 93] |
| #other-wartime-speech | Hadash–Ta'al and Ra'am "boycotted" the opposition meeting | JPost: "announced they would boycott" | Reworded | [103] |
| #other-holy-places | "Gafni called Tibi to tell him..." | Israel Hayom's own report; Gafni's office declined to comment | Attributed; response added | [50] |
| #legal | Ethics Committee: "complaint by a Yisrael Beytenu MK" | Haaretz: the complaint was by Michaeli herself | Corrected; status added | [91] |
| #legal | AG item: police "asked to open" | Police asked the Deputy State Attorney for approval to investigate; AG followed the State Attorney's and deputy's recommendation | Made exact; status "no investigation opened" | [90] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #coalition | "In April 2025 Tibi said he had told Lapid and Bennett that his party would avoid bringing down their government, and that they refused" (old [44], Haaretz podcast) | Source is an audio podcast; only the headline is readable, and it says "we would **prevent** the toppling of their government", not "avoid bringing it down". Cannot be verified beyond an ambiguous headline. Source removed and numbering closed up |
| #issue-cost-of-living | "as did the rest of the opposition" | Unsourced |
| #issue-housing | Kaminitz Law "a 2017 amendment" | Year not in the cited source |
| #other-security-prisoners | Petition "in April 2024" | Not in source |
| #other-arab-citizens-equality, #track-record | Tibi "opposes the Nation-State Law"; "repealing ... Nation-State laws" as a stated goal | No source in the document quotes this position; replaced with the sourced criticism of the Supreme Court |
| #issue-haredi-enlistment | `**Contradiction:**` label | See Notes |

## Legal section verification
- **2003 CEC disqualification, overturned:** Tibi's official Knesset biography (Knesset website data service, mkId 208) states the CEC disqualified him before the 16th-Knesset election and the Supreme Court cancelled the disqualification; he was elected. Official source; concluded.
- **2012 Ethics Committee suspension:** Haaretz, 17 Jan 2012 — Knesset Ethics Committee barred him from plenum debates and committee sessions for one week (could still vote), on a complaint by MK Anastasia Michaeli. Reputable report of an official Knesset decision; long concluded.
- **AG declined police request (Feb 2026):** Ynet, 19 Feb 2026 — police approached the Deputy State Attorney on 6 Jan 2026 seeking approval to open an investigation for insulting a public servant (remarks to police spokesman Aryeh Doron); AG Baharav-Miara, on the State Attorney's and deputy's recommendation, declined on substantive-immunity grounds. Reputable report of an official AG decision; no investigation opened.
- **2026 Joint List disqualification reversed:** CEC vote 18-5 on 23 Sept 2026 on a Likud request under the Basic Law armed-struggle ground (ToI live blog); Supreme Court unanimously overturned it on 2 Oct 2026 (JPost; Ynet). Cassif allowed 7-2; Abu Shehadeh withdrew. Consistent with research/ground-truth.md and with the Joint List items in hadash.md (18–5, one abstention, Likud request) and balad.md. No Ta'al candidate was individually targeted.
- Nothing found in the cited sources indicating any indictment, conviction, State Comptroller finding or open investigation concerning Tibi, Darawshe or Zahalka; the statement "No indictments, convictions…" is kept as worded.

## Joint-list and split-history verification
- Registry: `joint-list`, "הרשימה המשותפת / The Joint List", letters ודם, members hadash, taal, balad — matches the doc, research/ground-truth.md and the CEC letter list reported by Ynet (27 Sept 2026, "ודם – הרשימה המשותפת").
- CEC filing (IDI-hosted copy, published 09.09.2026) text-extracted: submitted by the Israeli Communist Party, Balad and Ta'al; Ta'al candidates at 2 (Tibi), 9 (Ahmad Darawshe), 12 (Haitham Zahalka), 14 (Ghassan Abdallah), 17 (Itimad Qaadan). Order matches the Ta'al central-committee list reported by Al-Quds Al-Arabi (Darawshe described as a lawyer). Abu Shehadeh's withdrawal (2 Oct) moves Darawshe to 8 and Zahalka to 11 (Ynet).
- Darawshe rotation: Al-Quds Al-Arabi (unnamed source) — rotation between slots 2 and 9 "after 20 months of the election, not two years". Attributed as such in the doc; no official document found.
- Splits checked: 8 Jan 2019 Tibi's split request to the Knesset Committee (Ynet); April 2019 Hadash–Ta'al 6 seats, Ra'am–Balad 4 (JTA — corrected); July 2019 reunion (JTA); 4 Feb 2021 Ra'am filed separately, Tibi offered his No. 2 slot (Israel Hayom); 15 Sept 2022 Balad split over rotation an hour before the deadline (ToI) and the PM-recommendation commitment (Al-Quds, 14 Sept 2022); 22–23 Jan 2026 Sakhnin document (The New Arab; +972); 9 Aug 2026 Tibi froze talks over slot 9 (Ynet, JPost); 19 Aug 2026 signing (JPost, Al-Quds, Kul al-Arab). 2022 result: Hadash–Ta'al 5 seats, Balad below threshold (JPost Dec 2025).

## Notes for the consistency review
- **Contradiction judged not warranted (Torah-study Basic Law).** Tibi's December 2025 statement was about the enlistment law ("we will not vote for"); the June 2026 bill was a separate Basic Law. Hadash–Ta'al MKs were absent, not voting for, and the Dec 2025 report itself quoted a Hadash–Ta'al source saying abstention was possible. Tibi's May 2024 pledge ("if the law's failure depends on us, we will vote against") was not tested on the official tally: 56-43 with all 10 Arab MKs absent, so their votes would not have changed the result (Ynet's point), although ToI wrote it "might not have advanced". At the final reading Tibi voted against. The "deal" with UTJ rests on opposition sources and a Malinovsky tweet; those involved denied it (Walla), and UTJ did stay away from the muezzin-bill preliminary vote (Ynet). The facts and the critics' view are kept, attributed; the reviewer may wish to compare how other parties' documents handle similar tactical-absence cases.
- Gaza and Palestinian-state "Formal commitment" items rest on Zo Haderech (the Communist Party weekly), a partisan source; now labelled as such. The economic and crime plans are now cited to the Joint List's own website.
- Several entries rely on single-outlet reports of unnamed sources (Al-Quds on rotation terms and Balad/Hadash concessions; Israel Hayom on the Gafni call); attributed in the text.
- The JPost [13] (Dec 2025), [21] (Aug 2025), [24] (Aug 2026) and [28] (Sept 2026) articles contain poll figures; none is reproduced in the document. No poll figures found in the text.
- The Knesset vote endpoint used was `GetVoteDetails` (complete in one response); OData pagination was not needed for these votes. Main.knesset.gov.il member pages were not used.
