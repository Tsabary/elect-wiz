# Fact-check: degel-hatorah

- Document checked: content/research/en/degel-hatorah.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 172 · Corrected: 38 · Removed: 7 · Sources replaced: 0 (4 sources added: [72]–[75], all Knesset OData)
- Limited-information flag: false (the party has a full Knesset voting record in the Knesset database, a signed 2022 coalition agreement, sponsored legislation and heavy Hebrew and English coverage; the gaps are no published platform, no position on Iran/Hezbollah, and thin evidence on crime in Arab society and current Gaza questions). The orchestrator should set `limitedInfo: false` and `researchedAsOf: 2026-10-07` in the registry. #information-availability does not start with "**Limited information.**".

Method: every cited URL was opened. Hebrew pages (INN, Ynet, Kikar, JDN, Maariv, Channel 14, Mako, Walla, Srugim, Haaretz, Wikipedia, IDI, Knesset MK biographies) were downloaded with curl and read in full (Ynet bodies from the page's JSON-LD). PDFs (CEC list copy [1], coalition agreement [19], Reshumot bill [35]) were converted with pdftotext and the cited clauses read. Times of Israel (blocked to curl) was read with WebFetch, with follow-up verbatim-quote checks where the summary was ambiguous. Every Knesset vote cited was re-queried in KNS_PlenumVoteResult and KNS_PlenumVote, both filtered by MK and in full (all MKs, paging past the 100-row limit).

**Key finding on vote tallies.** The OData service returns at most 100 rows per page. The Stage 2 tallies that differed from the press (death penalty 58–41, October 7 commission 53–46) were first-page counts only. Full counts: Basic Law: Torah Study 63–52 (matches Ynet and Walla); arrest freeze 58–54 (matches Channel 14); death penalty final reading 62–48–1; state-national commission preliminary reading 53–48–1; attorney general law 65–51; rabbinical-courts arbitration law 65–41. The Torah Study and arrest-freeze figures in the document were therefore correct and now agree with the database; the other two were corrected. A new source [75] gives the full-MK results for every tally quoted.

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | Lando and Hirsch leading figures [7, 28] | [7] does not mention Hirsch | Re-cited to [12, 23, 28] (Hirsch co-signed the July 2025 letter in [23]; named in [28]) | [12], [23], [28] |
| #overview | "The party describes its role as protecting…" [12, 15] | Sources are Wikipedia and IDI, not the party | Reworded to "Reference works describe…" | [12], [15] |
| #overview | Separate faction "since 16–17 July 2026" | House Committee session was 16 July 2026, 21:55 | Changed to 16 July 2026; added Knesset session source | [18], [73] |
| #overview | Chomat Torat Yisrael "set up in September 2026" | English Wikipedia says it is a shelf party used in 2026; no founding month in any source | Reworded to a registered party Belz/Shlomei Emunim candidates used in 2026 | [3], [14] |
| #overview split history | "January 2005" (Hebrew Wikipedia) vs "January 2004" (English Wikipedia) | Conflict; English Wikipedia's date is wrong | Resolved with Knesset faction records: split on 12 January 2005; noted that English Wikipedia's 2004 date does not match | [72] |
| #overview split history | 17 July 2026 House Committee approval | Committee met 16 July 2026 (JDN published the morning of 17 July) | Date corrected to 16 July 2026 | [18], [73] |
| #overview split history | Splits listed: 2005, 2008, 2020, 2026 only | Knesset records also show separate Degel HaTorah factions in 1996, 1999, Jan/Jul/Dec 2019 and Aug 2022 | Added bullets; 2008 and 2020 dates confirmed (18 Dec 2008; 28 Dec 2020) | [72] |
| #overview split history | 2008: "The parties then ran together again [16]" | [16] predates the reunion | Re-cited to [13] | [13] |
| #leadership | Shlav B "a short service for older men [10]" | Explanation is in Ynet, not the Knesset bio | Added [6] | [6], [10] |
| #leadership | Asher resigned Interior Committee post July 2025 [6] | [6] gives no month | Added [22] | [22] |
| #leadership | Pindrus bridges "Haredi and Religious Zionist communities" | Bio says "the Haredi-national (חרדי-לאומי) public" | Reworded to the Haredi-nationalist (Hardal) public | [11] |
| #leadership | Pindrus: "permissiveness" more dangerous than ISIS etc. | Quote is "permissiveness regarding *arayot*"; Channel 12 interview | Quoted exactly with gloss | [66] |
| #leadership | "a committee member asked…including his own list's chair" | Asker was Yesh Atid MK Adi Azuz; the chair was Goldknopf, who had led a road-blocking protest | Reworded per source | [67] |
| #leadership | No background found on Rosenthal | Ynet named a "Rabbi Moshe Rosenthal", head of Bnei Brak education administration, among candidates under consideration | Added with an explicit caveat that identity is not confirmed | [5] |
| #issue-cost-of-living | Agreement bullets | Clause 10 (≥NIS 1 billion/year food cards in budget base) omitted; agricultural-reform quote paraphrased | Added clause 10; agricultural clause quoted as worded | [19] |
| #issue-cost-of-living | "The budget raised VAT from 17% to 18%" | ToI: VAT rise took effect 1 Jan 2025, before the March budget vote; the NIS 1 billion+ for yeshivas was in a cabinet coalition-funds allocation | Reworded; added 66–52 tally from source | [58] |
| #issue-cost-of-living | Gafni: milk reform "would have caused thousands to lose their jobs" | Source: "thousands of people to go bankrupt" (לפשוט את הרגל) | Quote corrected | [9] |
| #issue-cost-of-living | Assessment and closest-option wording on "market-opening"/"import-based" reforms | Unsupported characterisation (see removed) | Reworded to what the sources say | [9], [19] |
| #issue-haredi-enlistment | Torah Study 63–52 | Supported by press; now also by full DB count | Added [42], [75] | [36], [37], [42], [75] |
| #issue-haredi-enlistment | Arrest freeze passed "13–14 July 2026" | Final vote was 14 July 2026, 58–54 | Date fixed, tally added | [38], [42] |
| #issue-haredi-enlistment | "Defense Ministry-approved yeshiva for 40–45 hours a week" | Law: ≥45 hours in a yeshiva, ≥40 in a kollel, on a list set by the defense minister | Reworded | [38], [39] |
| #issue-haredi-enlistment | "a Degel HaTorah representative said: 'the era of arrests ends…'" | Speaker was party chair Moshe Gafni | Attribution fixed | [2] |
| #issue-haredi-enlistment | "the Knesset's legal adviser warned…" | Warning came from the Foreign Affairs and Defense Committee's legal advisers | Reworded, quote completed | [39] |
| #issue-haredi-enlistment | Gafni told "party representatives" to halt police cooperation | He addressed the party's local council representatives; quote began "immediately halt" | Reworded | [31] |
| #issue-housing | "a NIS 50 million-a-year fund for long-term rental housing" | Clause 99: low-interest loan fund for developers, with an extra NIS 50 million a year to subsidise interest | Reworded | [19] |
| #issue-judea-samaria | "voted against every bill to apply sovereignty that came to a vote" | DH MKs did not vote on the Ma'ale Adumim bill (22 Oct 2025, 31–9) or the July 2025 motion (71–13) | Reworded to "in every vote … in which they took part"; added the two votes | [43], [75] |
| #issue-judea-samaria | "His party colleagues distanced themselves" [56] | Not in [56]; [55] reports criticism by Likud's Haredi campaign staff | Reworded | [55] |
| #issue-judicial-system | 2 June 2026 AG bill votes not specified | DB: Asher, Maklev, Pindrus voted for; 15 July law passed 65–51 | Added | [41], [75] |
| #issue-october-7-inquiry | Preliminary reading passed 53–46 | Full DB count 53–48, 1 abstention (53–46 was a first-page count) | Corrected | [45], [75] |
| #issue-october-7-inquiry | First reading "on 6 July 2026"; families "serve as observers" | Not in the Knesset DB; ToI dated 7 July; ToI: "four supervisory members representing bereaved families" | Date given as July 2026; composition reworded | [47] |
| #issue-october-7-inquiry | "ToI reported UTJ backed the bill as part of an arrangement… Shas and UTJ had denied in June 2026" | Order and content compressed; the denial also said they would resume voting for coalition bills once their laws advanced | Rewritten: Ynet report → joint denial quoted in full → ToI July report | [47], [49] |
| #issue-religion-and-state | Rabbinical courts law passed 65–39 | ToI and DB: 65–41; Asher, Maklev, Pindrus voted for | Corrected; added DB source | [62], [74] |
| #other-death-penalty | Final reading passed 58–41 | Full DB count 62–48, 1 abstention | Corrected | [44], [75] |
| #other-gender-separation | Gender-separated events cited to [20] only | Clause 36 of [19] is the primary text | Reworded to the clause; added [19] | [19], [20] |
| #coalition | Agreement "signed on 21 December 2022 [19, 20]" | PDF is dated 21 Dec 2022; ToI reports final signing 28 Dec 2022 | Both dates stated | [19], [20] |
| #coalition | Lando quote "From this point forward, we will do only what is best for Haredi Judaism" | Only "what is best for Haredi Judaism" is a quote in ToI | Paraphrase separated from quote | [32] |
| #coalition | Contradiction paragraph | Listed the party's own Torah Study law and the Dec 2025 commission vote (before the May 2026 statements) as contradicting actions; "exchange" stated as ToI fact without the denial's content | Rewritten (see Notes): limited to the June/July 2026 AG-bill votes; added the party's "we are in the opposition" statement; quotes the joint denial and its "resume voting" line; ToI report attributed | [32], [33], [41], [47], [48], [49] |
| #track-record | Edelstein/Bismuth bills "did not reach a final vote before the Knesset dissolved" [23, 28, 29] | Cited sources do not cover the dissolution | Reworded: law not passed in the 25th Knesset; Ynet links the leadership change to that failure | [5], [28], [29] |
| #track-record, #other-haredi-education | "further sums followed in 2026, some after court challenges" | The NIS 800 million allocation was frozen by the AG immediately | Corrected | [60], [61] |
| #track-record | Daycare bill "advanced to first reading" | Finance Committee approved it for first reading | Reworded | [51] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #legal | "For context only: in June 2026 an opposition MK filed a police complaint over a remark by Pindrus… No official action on that complaint was found." | A complaint by a political rival is not an official act. ToI [67] reports only the complaint and an opposition MK's call on the AG to investigate; Hebrew and English searches found no police, AG or Ethics Committee action. Removed from the legal section. |
| #leadership | "Lazimi filed a police complaint [67]" | Same reason; kept the remark itself (a statement), dropped the complaint so it is not presented as a legal matter. |
| #issue-cost-of-living | Agricultural reforms "(which aimed to increase imports)" | Not in the coalition agreement or any cited source. |
| #issue-cost-of-living | "The milk reform was a Finance Ministry plan to open the dairy market to competition [9]" | Not in [9]. |
| #issue-judea-samaria | "with the coalition, which then included UTJ, voting it down" | The cited database records individual votes, not coalition positions; no other source cited. |
| #issue-judea-samaria | "Some of these votes were opposition bills that the whole coalition voted down…" | Unsupported by the cited source; replaced with a neutral note that the database does not record reasons. |
| #issue-gaza | "before the October 2025 ceasefire and before the last hostage's remains were returned in January 2026" | Uncited; replaced with "date from 2025 or earlier". |

## Legal section verification
- After removing the police-complaint item, the section states "No indictments, convictions or official inquiries involving the party's leaders were found." with what was checked: Knesset biographies [10, 11], Times of Israel coverage of Degel HaTorah, Gafni, Asher and Pindrus, the leadership-change coverage [4, 5, 6], and searches (Hebrew and English) for police, Attorney General or Knesset Ethics Committee action.
- The Pindrus–Lazimi item (ToI, 29 June 2026 [67]): Lazimi filed a police complaint; MK Gilad Kariv asked the AG to open a criminal investigation. No report of a police investigation being opened or any AG or Ethics Committee decision was found, so there is no official act to report. The remark remains in #leadership as a statement.

## Joint-list and split-history verification
- List name, letter and partners: CEC list page (IDI copy, published 09.09.2026) [1] shows "יהדות התורה והשבת אגודת ישראל – דגל התורה" submitted by אגודת החרדים – דגל התורה, הסתדרות אגודת ישראל בארץ ישראל and חומת תורת ישראל, matching `lists.json` and `research/ground-truth.md` (letter ג; requested per Kikar [3]). Top six (Asher, Goldknopf, Pindrus, Porush, Rosenthal, Stark) match [1] and Kikar [3]; party affiliations of #4 and #6 (Chomat Torat Yisrael) follow the registry's PDF-layout parsing.
- Rotation and Asher heading the list: Ynet [5].
- Split history, verified against the Knesset's KNS_Faction records [72]: Degel HaTorah factions 1988–1992 (12th Knesset, ran alone); separate factions 8 Apr–17 Jun 1996; 23 Feb–7 Jun 1999; 12 Jan 2005–17 Apr 2006; 18 Dec 2008–24 Feb 2009; 9 Jan–30 Apr 2019; 10 Jul–3 Oct 2019; 30 Dec 2019–16 Mar 2020; 28 Dec 2020–6 Apr 2021; 15 Aug–15 Nov 2022. The 2005 date settles the 2004/2005 conflict in favour of 12 January 2005 (Hebrew Wikipedia's date). The 2008 date matches Ynet [16]; 2020 matches Maariv [17].
- July 2026 split: KNS_CommitteeSession/KNS_CmtSessionItem [73] show the House Committee session of 16 July 2026, 21:55, with the agenda item "בקשת סיעת יהדות התורה להתפלג לפי סעיף 59(2)". The 25th-Knesset faction table has not yet been updated with the new factions. Maklev quote verified in JDN [18].
- Reunion for the 2026 election: list submitted 8 September 2026 (Kikar [3]).

## Notes for the consistency review
- **Contradiction wording (the "exchange" claim).** ToI 7 July 2026 [47] states as reporting that the coalition agreed to advance the Torah Study and arrest-freeze laws "in exchange for their support for the coalition's own legislative agenda". Shas and UTJ had earlier (23 June 2026 [49]) denied a "deal" reported by Ynet, while saying their demands were "not contingent on anything" and that "to the extent that we see these laws are being practically advanced, we will be able to resume voting in favor of coalition legislation". Both are now stated, with the ToI claim attributed. The contradiction now rests on the strongest pair: the "no trust"/"no bloc"/"we are in the opposition" statements (May–June 2026) against the June and July 2026 votes for the coalition's attorney general bill. The Torah Study law (the party's own bill) and the December 2025 commission vote (before the statements) were removed from the contradiction. It remains contestable: the rabbi's statements are about post-election bloc loyalty, not about individual votes. A reviewer may judge it a tension rather than a contradiction.
- **Vote tallies.** Future agents using Knesset OData should page past 100 rows (`$skip=100`). Several tallies in other parties' documents may have the same first-page undercount.
- The October 7 commission first reading (July 2026) is not in the Knesset vote database yet, so per-MK votes for it could not be checked; the document does not claim any.
- "Closest option" lines were re-checked after the corrections. Cost of living now rests on the coalition-agreement subsidies and food-card clauses; the open-market option wording was softened. The others still match.
- Sources [7], [47], [48] and [69] had publication dates one day off from what the pages show (Times of Israel time zone); corrected.
