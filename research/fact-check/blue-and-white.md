# Fact-check: blue-and-white

- Document checked: content/research/en/blue-and-white.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 172 · Corrected: 44 · Removed: 5 · Sources replaced: 0 (6 sources added: [74]–[79]; source URLs [42], [44], [45] adjusted, and source titles [48], [49], [72] annotated for pagination)
- Limited-information flag: false (Blue and White has a long Knesset voting record, served in three governments, and its leader gets heavy media coverage, including several long 2026 interviews. It has no dedicated 2026 manifesto, and the document says so in #information-availability.)

I opened all 73 original source URLs myself. The Times of Israel and Calcalist pages block curl, so I read them with WebFetch. Everything else I downloaded with curl and read as extracted text. That covers Ynet, Maariv, Srugim, Walla, Mako, Channel 14, INN, Haaretz, JPost, JDN, TPS, IDI and israel2026.co.il. I text-extracted the Knesset bill PDFs ([52]–[58], [60]) and the CEC PDF [1] with pdftotext, and converted the two plenum protocols ([39], [40]) with textutil. I ran every Knesset OData query directly. Every cited page exists and was reachable.

**Vote pagination (orchestrator's extra check).** The KNS_PlenumVoteResult service returns 100 rows per page. I re-counted every tally and every per-MK vote quoted in the document with a script that follows `@odata.nextLink` through all pages, and matched MKs by MkId, not by surname. There are several MKs named Biton. Results:

| Vote | Tally (all pages) | Pages | Faction members who voted |
|---|---|---|---|
| 41304 | 68–9 | 1 | Gantz, Tamano-Shata, Tropper, Farkash-Hacohen, M. Biton |
| 42820 | 32–56 | 1 | Gantz, Tamano-Shata, Tropper, Farkash-Hacohen, M. Biton, Eisenkot, Kahana |
| 41074 | 63–57 | 2 | all against, including Eisenkot and Kahana |
| 46670 | 58–54 | 2 | all 8 against |
| 45858 | 62–48–1 | 2 | 7 against (Tamano-Shata did not vote) |
| 46462 | 65–51 | 2 | all 8 against |
| 44855 | 54–41 | 1 | all voters against |
| 44753 / 44754 | 39–58 / 43–58 | 1 / 2 | all faction voters for |
| 44409 | 9–66 | 1 | all 8 for |
| 44413 | 71–13 | 1 | none (no Gantz vote) |
| 44575 | 31–9–1 | 1 | Gantz and 4 others for (ToI reports 32–9; no tally given in the doc) |
| 44580 | 25–24 | 1 | none (no Gantz vote) |

The stated tallies were right. The descriptions of how the faction voted were not always right, and I corrected them (see below). Gantz's own votes come from sources [41]–[44], which filter by MkId. They return one page each, so pagination doesn't affect them. All 51 of his votes match the document's direction and date.

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | "the Knesset approved the split" | It was approved by a Knesset panel, the Arrangements Committee | Reworded. Also noted that the faction was originally called Israel Resilience | [4] |
| #overview | "Eisenkot and Kahana left in July 2025" | ToI (7 July 2025) says they announced their departure "last week" | Reworded to "in the week before 7 July 2025" | [6] |
| #overview | Tropper was "the fourth lawmaker to leave in a year" | The source says "fourth faction lawmaker" and names the other three | Named Eisenkot, Kahana and Farkash-Hacohen | [7] |
| #overview | "shrunk from eight MKs to three", "one joining … B'Yachad" | Wording paraphrased | Quoted ToI exactly and named Eitan Ginzburg | [8] |
| #overview (Current seats) | 8 MKs in the records vs. 3 remaining, with Tamano-Shata holding "a second position" | Unclear which number means what. OData PositionID 48 means "faction chair" | Rewrote as two labelled numbers: formal faction size (8, per Knesset OData) and MKs still with the party (3, per ToI). Explained the gap and named Tamano-Shata as faction chair | [5], [7], [8] |
| #overview | "a center person with a right-wing security agenda" | Srugim: "אג'נדה מדינית ביטחונית ימנית" (diplomatic and security) | Corrected and dated (Oct 2022) | [34] |
| #overview | "Its main stated priorities are 'security, service for all…'" | JPost: these are the "key decisions" a broad government should unite around | Reworded and attributed to Gantz | [19] |
| #leadership | Tamano-Shata "holds a second faction position" | Position 48 means faction chair | Corrected | [5] |
| #leadership | Schuster was "Deputy Defense Minister" | OData: "סגן שר במשרד הביטחון" | Changed to "a deputy minister in the Defense Ministry" | [15] |
| #issue-gaza | "said Netanyahu was preventing 'real victory'" | Paraphrased | Quoted exactly. Added "elections by the fall" | [13] |
| #issue-gaza | 14 June 2024: hostages first "even if that meant pulling back" | "Pulling back" isn't in the source | Replaced with his actual quote | [33] |
| #issue-gaza | 2 Aug 2026 quote came "after a US-backed plan for Hamas's gradual disarmament was announced" | INN only says it was a social-media post on "the current deal with Hamas" | Removed the unsupported context | [30] |
| #issue-gaza | "Palestinians govern daily life" | Walla: "הפלסטינים יצטרכו לנהל את עצמם" | Changed to "will have to run their own affairs" | [23] |
| #issue-gaza | Quote "is securing its own future by working to defeat Hamas" | This is ToI's paraphrase, not Gantz's words | Removed the quotation marks and attributed it to ToI | [21] |
| #issue-haredi-enlistment | 2022 bill "gradually lowered the exemption age"; "20% cut that grew" | The bill sets exemption age 21 (2 years), then 22 (1 year), then 23. Funding drops to 80% of the base, falling to 20% after 7 consecutive years | Gave the exact terms | [60] |
| #issue-haredi-enlistment | June 2024: "Gantz and the faction MKs present voted against" | Paginated data: all faction voters, including Eisenkot and Kahana | Clarified | [41], [48] |
| #issue-haredi-enlistment | 1 Dec 2025: "an interim compromise" | His words: "we submitted it as a bridging law, until we can regulate the service framework" | Quoted exactly | [62] |
| #issue-haredi-enlistment | 27 Oct 2025 pledge tagged **Formal commitment** | Said at a faction meeting, so a Statement | Downgraded to Statement. Gave the full quote and added his "as in the change government" remark | [63] |
| #issue-haredi-enlistment | Amendment 28 summary | Leaves out the "no other occupation" condition. Also, Knesset marks the law as a continuation of the same 2022 bill (booklet 1502) | Added both | [59], [60] |
| #issue-haredi-enlistment | **Contradiction:** "He says it was meant only as an interim step" | Paraphrase | Gave his explanation in his words | [62] |
| #issue-iran-and-regional-security | Feb 2019: "evil", "appeasement" | Quotes trimmed | Gave the exact quotes and the venue | [71] |
| #issue-iran-and-regional-security | "On 3 and 5 February 2025 … US … Lebanon ceasefire" [31, 32] | [31] has no Lebanon content. The Lebanon line is in [32] | Split the claim by source | [31], [32] |
| #issue-iran-and-regional-security | He was "fairly optimistic" (quoted) | This is ToI's description | Attributed to ToI, without quotation marks | [21] |
| #issue-judea-samaria | Jan 2019: "Jordan Valley would remain…, strengthen blocs" | In the speech this is conditional ("if it turns out there is no way to reach peace at this time") | Added the condition | [37] |
| #issue-judea-samaria | "limit the conflict" | "נצמצם את הסכסוך" | Changed to "shrink the conflict". Added Jordan Valley and security superiority | [34] |
| #issue-judea-samaria | 18 July 2024: "Gantz and his faction voted for" | Five faction MKs voted. The rest did not vote | Named the five who voted | [42], [50] |
| #issue-judea-samaria | 22 Jan 2025: "he and all his faction MKs voted for" | Schuster, Ginzburg and Ron Ben-Moshe did not vote | Changed to "all the faction MKs who voted, including Eisenkot and Kahana" | [51] |
| #issue-judea-samaria | No Gantz vote on the adopted 23 July 2025 motion [40, 45] | Neither source shows the absence | Added an all-MK result for vote 44413 (71–13, no Gantz vote). Added the 9–66 tally of the faction's motion | [78] (new), [42], [45] |
| #issue-judea-samaria | No Gantz vote on the J&S sovereignty bill, 22 Oct 2025 [38] | ToI doesn't say this | Found vote 44580 (25–24) and confirmed with paginated data that Gantz did not vote | [77] (new) |
| #issue-judicial-system | "zero tolerance for corruption" | Trimmed | Gave the full quote | [17] |
| #issue-judicial-system | "No explicit Gantz pledge to repeal the selection law was found" | Srugim, 27 Mar 2025: Gantz said "we will fix it. The politicization of the Judicial Selection Committee will be cancelled" | Added his statement, removed the "not found" sentence and updated the Closest option(s) reasoning (option IDs unchanged) | [76] (new) |
| #issue-judicial-system | "private bills to split the AG's role" cited only to vote 44614 | Two bills were voted on that day (44614, 44615). Gantz voted against both | Added 44615 to sources [42] and [45]. Wrote "two private bills" | [42], [45] |
| #issue-judicial-system | "Formal commitment: Gantz lists 'a constitution' among his core 2026 priorities" | From an interview, so a Statement | Split it: the interview line is now a Statement, and the 2022 IDI principles stay a Formal commitment | [19], [9] |
| #issue-october-7-inquiry | 19 March 2025 vote described as a bill "to set up a state commission" | Vote 43382 is a Commissions of Inquiry Law amendment that makes a state commission mandatory after certain events | Described it correctly. Added that Tamano-Shata filed an identical bill | [45], [58] |
| #issue-october-7-inquiry | Sept 2026: he "said a state commission should examine the 20 years…, including the years he held senior security posts" | Mako: he would have to explain "seven years out of the 20" there | Reworded and split the claim between [22] and [21] | [21], [22] |
| #issue-religion-and-state | 19 Nov 2025: "Gantz and most of his faction voted for… Both failed" | Paginated data: every faction member who voted was in favour. The bills failed 39–58 and 43–58 | Corrected and added the tallies | [79] (new) |
| #issue-religion-and-state | Platform "frozen plan" for a pluralistic Western Wall area | ToI: expand the egalitarian prayer area with a joint oversight council. "Frozen" isn't in the source | Reworded | [35] |
| #other-nation-state-law | 2019 platform tagged **Statement** | A platform is a Formal commitment. Also, the platform protects equality through Basic Law amendments without repealing the Nation-State Law | Re-tagged and reworded | [35] |
| #other-education | "Formal commitment: Gantz lists 'public education'…" | Interview, so a Statement. "Core curriculum" is JPost's gloss | Re-tagged and attributed the gloss | [19] |
| #other-north-and-south | "Rebuilding the north and the western Negev" | The condition was to return northern residents home by 1 September and rehabilitate the western Negev | Corrected | [14] |
| #other-arab-parties / #coalition | Slogan "a national unity government – without Ben Gvir, and without Ra'am" | INN: "ממשלת הסכמות לאומית" means national-consensus government | Corrected in both places | [25] |
| #other-arab-parties | "respects Arab citizens as loyal citizens" | Paraphrase | Gave his words. Added his 2026 statement that he had previously agreed to a government with Mansour Abbas and that October 7 changed this | [22], [24] |
| #coalition | 20 Aug 2026 Haredi line | Trimmed | Quoted in full | [19] |
| #coalition | 3 Sept 2026 entry | Leaves out his explicit statement in the same interview: "the Haredim can be in the coalition. Mansour Abbas cannot", if they accept a service framework | Added | [22] |
| #coalition | 20 Sept party statement: "prevent a narrow government that relies on the Haredi parties…" | The statement says "relies on the draft dodgers" | Quoted exactly | [20] |
| #coalition | Indicted-PM **Contradiction** | No explanation given | Added his April 2020 explanation (coronavirus and threats to democracy) and his 2026 one ("corona once, war the second time") | [18], [22] |
| #coalition | Track record leaves out the 2021–22 Ra'am-backed government | A gap in parity | Added it: Blue and White in the Bennett–Lapid coalition that included Ra'am, Gantz as Defense Minister and Deputy PM, plus his later explanation and criticism | [74] (new), [15], [23], [24] |
| #coalition | Joined the emergency government "four days after October 7, saying it was…" | IDI says "several days after". ToI shows Knesset approval on 12 Oct | Changed to "on 12 October 2023 as an emergency wartime government" | [9], [12] |
| #track-record | "in government twice: 2020–2022 … and 2023–24" | Hides the separate 36th (Ra'am-backed) government | Listed all three governments with dates. Added the "change government" remark under Haredi integration | [15], [74], [63] |
| #legal | Fifth Dimension status ends at Feb 2020 | Out of date | Added the 4 April 2023 closure of the case against all suspects by State Attorney Amit Aisman (Gantz was not a suspect) and the March 2019 State Comptroller report | [75] (new) |
| #overview (2026 list) | Ballot letters cited to [1, 2] | The CEC PDF [1] doesn't show the letters. Maariv [2] says the party asked to keep כן | Reworded to match the sources | [1], [2] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #leadership | Gantz "was born in 1959" [21] | Not in the cited ToI article |
| #legal | Gantz chaired Fifth Dimension "from 2015 until it closed in 2018" [68] | Not in Calcalist or Walla. I kept only "formerly chairman of the board" |
| #issue-crime-in-arab-society | "MK Zvika Fogel (Otzma Yehudit)" | The party label isn't in the bill PDF [52] and isn't needed. I removed the label and kept the name |
| #issue-judicial-system | "No explicit Gantz pledge to repeal the selection law was found." | Contradicted by Srugim [76] |
| #issue-religion-and-state | "frozen" (Western Wall plan) | Not in [35] |

## Legal section verification
- **Fifth Dimension, 2020:** Calcalist, 20 Feb 2020 [68] (WebFetch). Acting State Attorney Dan Eldad ordered a police criminal investigation into the company's dealings with the Israel Police. "בשלב זה, הבדיקה בפרקליטות לא העלתה חשדות נגד גנץ".
- **Fifth Dimension, current status:** Walla, 4 Apr 2023 [75] (curl, full text read). The State Attorney's Office announced that State Attorney Amit Aisman adopted the Jerusalem District Attorney's recommendation and closed the case against all suspects. Fifteen company employees had been questioned under caution, and Gantz was not a suspect. The same article reports that State Comptroller Yosef Shapira's March 2019 report on police procurement described failures in the police's contract with the company. That report is about the police, not Gantz. Status as of today: **closed**.
- I found no indictments, convictions or official findings against Gantz, Tamano-Shata, Bloch, Konkol, Avidar Tzalik or Schuster.

## Joint-list and split-history verification
- The 2026 list runs alone. The CEC page [1] shows it was submitted only by "כחול לבן חוסן לישראל". This matches `content/registry/lists.json` (`memberPartyIds: ["blue-and-white"]`, letters כן) and research/ground-truth.md row 30. The ground truth takes the letters and the approved name from the CEC announcement as reproduced by Ynet and Maariv.
- Past splits all check out: Blue and White's 2020 breakup [4], New Hope's split on 12 March 2024 [11], the departures of Eisenkot and Kahana and the July 2025 rename [6], and the later departures [7, 8]. The 2022 National Unity result (12 seats, 432,482 votes) matches IDI [9].

## Notes for the consistency review
- **Current seats:** the formal Knesset faction (8, OData [5]) and the MKs still with the party (3, ToI [8]) are different numbers. If the site shows a "current seats" figure from the registry, it should say which one it uses.
- **Votes after the departures:** Several MKs who left the party (Tropper, Farkash-Hacohen, Ginzburg) still vote with the faction in the records, for example on 46670 and 46462. The document attributes votes to Gantz personally, which is right.
- **Thin issues:** cost of living, housing and crime in Arab society rest on votes and 2019 material. The party has no 2026 manifesto [29]. The doc says so.
- **Mixed coalition messages in 2026:** In August Gantz said the Haredi parties "can't be part of the next government" [19]. In September he said "the Haredim can be in the coalition" if they accept a service framework [22]. Both are now in the document, dated.
- **Source [79]** combines four votes in one paginated query. A future check should read all its pages.
- **OData behaviour:** vote 44753 returned exactly 100 rows with no `nextLink`. I treated it as complete (39+58+3=100).
