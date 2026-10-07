# Fact-check: yesodot-yisrael

- Document checked: content/research/en/yesodot-yisrael.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 196 · Corrected: 49 · Removed: 7 · Sources replaced: 0 (8 sources added: [65]–[72]; source [5] date filled in; source [51] description corrected; the vote-ID lists in [52]/[53] extended by 4 IDs)
- Limited-information flag: false (The party is new and has no platform of its own, but it is built around one leader with a long, documented record: seven years in the Knesset, minister in three governments, 53 bills initiated, and 4,315 recorded plenum votes in the 25th Knesset alone. There is also a jointly presented 2026 plan, the joint list's published plans, and many 2026 interviews. Eight of the ten issues have Action-tier evidence. The #information-availability section does not start with "Limited information.")

**Method.** I opened every cited web source myself. Pages that serve to curl were downloaded and read in full as extracted text (Maariv, Srugim, Walla, Mako, JDN, ICE, Kikar, INN, Kipa, Ynet/Ynetnews via JSON-LD, JPost, IDI, Anadolu, CBN, ConstitutionNet, Globes, Jakarta Post). The CEC list copy [1] and the four bill PDFs [38]–[41] were converted with pdftotext. Zman Israel [7], the Times of Israel (English [50], [59], [62] and French [24]) and JWeekly [57] block curl, so I read them with WebFetch and asked for verbatim quotes.

**Knesset open data (OData).** During my session the Knesset OData service (V3 and V4) returned HTTP 474 "access denied" to this machine's IP for every request, both with curl and with WebFetch, on repeated retries. I therefore could not re-run the live queries in [35]–[37] and [52]/[53]. Instead I used raw OData responses saved earlier on 2026-10-07 in the shared session scratchpad by other Stage 2/3 agents. These are unmodified JSON pages from the same endpoints:
- Tropper's complete `KNS_PlenumVoteResult` record (MkId 30683), 4,315 rows. This matches the document's count.
- `KNS_PlenumVote` metadata (titles, dates, reading type) for every vote he cast.
- Full, two-page `KNS_PlenumVoteResult` dumps (all MKs, page 1 = 100 rows plus page 2) for 30 votes.
- KNS_Bill / KNS_BillInitiator exports, and the Knesset-derived MK positions dataset.

The orchestrator should re-run the live queries once the block lifts. The underlying data could not have been altered by the agents that saved it, but I did not fetch it myself.

**Vote spot-check (all 60 vote IDs cited, plus pagination).** Every one of the 56 originally cited vote IDs appears in Tropper's own record with the date and direction the document gives. The 2 IDs with no Tropper row (39785, 43884, the final readings boycotted by the opposition) are correctly described as "no vote recorded". The reading type was checked from each vote's `ForOptionDesc`. Tallies were re-counted across both pages of the all-MK results:

| Vote | Bill | Tally (all pages) | Tropper | Document |
|---|---|---|---|---|
| 46670 | Amendment 28 (temp.), final | 58–54 | against | 58–54 ✓ (Anadolu agrees) |
| 45858 | Death penalty, final | 62–48–1 abstain | against | 62–48 ✓ (JTA agrees) |
| 42820 | Jordan Valley sovereignty, prelim. | 32–56 | for | 32–56 ✓ (ToI agrees) |
| 38405 | Jordan Valley sovereignty, prelim. 2023 | 14–66 | for | no tally; added |
| 44575 | Ma'ale Adumim sovereignty, prelim. | 31–9–1 abstain | for | said 32–9 (Maariv); corrected to the record, press figure noted |
| 44992 | Beitar Illit sovereignty, prelim. | 8–45 (+3 present) | for | no tally; added that it **failed** |
| 44580 | J&S sovereignty (Maoz), prelim. | 25–24 | no vote | added "no vote" |
| 44413 | Adopted sovereignty motion, 23 Jul 2025 | 71–13 | no vote | doc said "could not be confirmed"; now stated |
| 44946 | "State-national" commission, prelim. | 53–48–1 abstain | against | tally added |
| 39785 | Reasonableness law, final | 64–0 | no vote | 64–0 ✓ |
| 41283/41284, 44660/1/9, 46366/7/8 | State commission bills | all failed | for | ✓ |

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | Gantz said Tropper would not resign "so that the coalition would not gain an extra vote" | Source dated 5 May 2026; Gantz said "we agreed" | Dated and reworded | [5] |
| #overview | "Four of the candidates on the list's first 41 places" were Yesodot Yisrael | The CEC list has 120 places and only these four are Yesodot Yisrael | Changed to "four of the list's 120 candidates" (also in #information-availability) | [1] |
| #overview | Ballot letters דרך given without a citation | Missing citation | Added Ynet report of the CEC ballot-letter announcement (27 Sep 2026) | [65] (new) |
| #overview | Ynetnews: arrangement "would not constitute a technical bloc" | Paraphrase in quotation marks | Exact quote, dated, framed as "emerging agreement" | [22] |
| #overview | CEC "still lists two separate submitting parties" | Fine, but the conflict was left hanging | Said plainly that the sources don't reconcile the two descriptions | [1], [22], [24] |
| #overview | JPost described target voters as "liberal religious Zionists, reservists, right-leaning voters dissatisfied with the coalition" [18, 19] | Neither source says this ([47] uses "liberal religious Right" for Hendel's base only) | Replaced with JPost's actual description ("has not identified itself as Left or Right but has aligned itself with center-right-leaning policies") | [19] |
| #leadership | He "led Acharai" | JPost: "second-in-command at Acharai" | Corrected | [47] |
| #leadership | Science minister "May–June 2021, briefly" | Positions data: 3 May – 13 June 2021 | Exact dates | [35] |
| #leadership | Promised "first choice" of a portfolio [22], "or a 'senior ministerial role'" [25] | [25] doesn't contain the second phrase; [22] describes an emerging, unsigned deal | Removed [25] claim; reworded as Ynetnews report of the emerging deal | [22] |
| #leadership | Shira Shapira: mother of "Staff Sgt." Aner Shapira, killed "in a roadside shelter" | Rank not in sources; ToI-FR: aged 22, defending people in a bomb shelter | Corrected; joining-together claim re-cited to [21], [24] | [21], [24], [25] |
| #leadership | Peretz "opposed governments that depend on the support of Arab parties" | Ynetnews: wouldn't join with non-Zionist parties such as Ra'am, or a government depending on Ra'am abstaining | Reworded to the source | [22] |
| #issues (evidence note) | "IDI's 2026 platform archive lists no platform for the Yashar list" | **False.** The IDI table links Yashar's platform page (yasharwitheisenkot.com/principles) | Corrected; added the list's plans as list-level evidence; stated that the Magen David Plan was co-authored with Hendel before the split | [51], [67] (new) |
| #issue-haredi-enlistment | Screening centre [15, 19]; sanctions [16, 18, 19] | [19] doesn't mention the screening centre | Re-cited to [15], [17] | [15], [17] |
| #issue-haredi-enlistment | 30 Sep 2026 "a values wound" (quoted) | Reported speech from a house meeting, not a direct quote | Reworded as Maariv's report; added his "service for all" plan | [26] |
| #issue-haredi-enlistment | (missing) | Joint list's published service plan: 3% Torah deferral quota, loss of benefits **and criminal law** for evaders, which differs from Tropper's "against criminal sanctions" | Added as list-level Formal commitment, noting the difference | [68] (new), [12] |
| #issue-haredi-enlistment | (missing) | 17 May 2023 vote for the "Mandatory Service for All" bill (vote 38722) | Added | [52], [53] |
| #issue-haredi-enlistment | 24 June 2024 vote | Reading not stated; it was a first reading | Added | [53] |
| #issue-haredi-enlistment | Amendment 28: "July 2026", "third reading", halts proceedings "against yeshiva students" | 14 July 2026, second and third readings; Anadolu says "Haredi draft evaders" | Corrected; tally confirmed by paginated data | [56], [72] |
| #issue-judicial-system | AG split is "a proposal advanced by the current coalition" | Unsourced | Removed | — |
| #issue-judicial-system | Plan calls for "limits on how long senior officials can serve" | Sources: "elected officials" ([15], [16], [17]); JPost: PM term limit | Corrected | [15]–[18] |
| #issue-judicial-system | (partial) | [12] also has him calling for Basic Laws on Legislation and the Judiciary; [16] says changes should come by broad agreement | Added | [12], [16] |
| #issue-judicial-system | Eisenkot "raising a hand against Israeli democracy" [29] | Not in [29] | Re-sourced to Ynetnews (5 Jul 2026, Second Authority ruling) | [66] (new) |
| #issue-religion-and-state | Integrated-education bill: definition, initiators | Initiators unnamed; definition paraphrased | Named Kroizer and Tur-Paz; definition from the explanatory notes | [38] |
| #issue-religion-and-state | Bill descriptions went beyond titles ("would let city rabbis conduct conversions"; "expanding Rabbinate powers") | Only titles checked | Bills now given by exact title. Chief Rabbis vote correctly labelled as a **first** reading (19 Jun 2023). Rabbis-election bill characterised from an IDI analysis I opened (strengthens the Chief Rabbinate Council and the minister over local government) | [52], [53], [71] (new) |
| #issue-religion-and-state | Closest option rested on "against expanding Rabbinate and rabbinical-court powers" | Over-claimed from titles | Reworded so the reasoning rests on titles plus [71]; kept `more-choice-local-decisions` as partly mixed | [71] |
| #issue-october-7-inquiry | "In August 2026 he said 'everyone who was there…'" | Said in the 29 July 2026 103FM interview | Date corrected | [14], [20] |
| #issue-october-7-inquiry | Eisenkot pledge tagged list-level **Formal commitment** | A campaign-event pledge | Downgraded to Statement; the list's published inquiry plan noted separately | [29], [67] |
| #issue-october-7-inquiry | Number of bills per date; 24 Dec 2025 tally; IDI description | Incomplete | Two bills (17 Jul 2024), three (1 Jul 2026); 53–48–1; IDI's full appointment mechanism; first reading 59–0 on 6 Jul 2026 | [48], [49], [72] |
| #issue-gaza | Eisenkot "called for Hamas to be fully disarmed before any IDF withdrawal" | That was a diplomatic source quoted by JPost, not Eisenkot | Removed; added his actual description of the framework | [30] |
| #issue-gaza | Closest line relied on the "disarmament before withdrawal" demand | No longer supported | Reworded | [30] |
| #issue-judea-samaria | Radio interview: "would keep all legal settlements" | Source: "every legal farm" set up in coordination with the army would remain | Corrected and dated | [14] |
| #issue-judea-samaria | "JPost reported that both Tropper and Hendel ruled out a Palestinian state" | [19] quotes only Hendel | Corrected | [19] |
| #issue-judea-samaria | 30 Sep remarks | Omitted Maariv's report that the party doesn't intend significant change beyond "shrinking the conflict", supports legal settlement on state land, and the Abraham Accords | Added | [26] |
| #issue-judea-samaria | Sovereignty votes listed without outcomes/context | 2023 vote failed 14–66; Beitar Illit failed 8–45; Ma'ale Adumim was Liberman's bill, 31–9–1 on the record; ToI: opposition bill, called "trolling" by the coalition | Added | [59], [60], [72] |
| #issue-judea-samaria | Could not confirm his vote on the adopted 23 Jul 2025 motion | His complete record shows no vote on 44413 (71–13); he voted against the Abbas and Tibi motions | Stated; added votes 44410/44411 | [52], [53], [61], [72] |
| #issue-judea-samaria | Closest: `partial-sovereignty-area-c` (with a list-level aside); list leader "not evacuating settlements" | Leader said legal **farms in Area C**. Tropper's own Sept 2026 remarks point to `maintain-current-situation` | Rewritten as explicitly mixed, both options named (see Notes) | [26], [28] |
| #issue-cost-of-living | Plan items cited to [15, 16, 18] | "Targeted help" is in [18]; imports and trade barriers are in [15], [17] | Re-cited and completed; added the list's economic plan (imports, parallel import, kashrut reform) | [15]–[18], [70] (new) |
| #issue-crime-in-arab-society | Plan items cited to [18] | JPost [18] doesn't mention the Shin Bet unit or sentencing | Re-cited to [15], [16], [17]; "security authority" → "governance authority"; added prisons and weapons/finance offences | [15]–[17] |
| #issue-crime-in-arab-society | Launch quote "After years of discussion on security…" | INN: "talk about governance" | Corrected; split between [17] and [18] | [17], [18] |
| #issue-crime-in-arab-society | Contradiction | Didn't say the plan was co-authored with Hendel, or that the list's current plan omits the Shin Bet | Added both caveats (see Notes) | [15]–[17], [58], [69] (new) |
| #other-death-penalty | Law description | Paraphrased JTA | Attributed to JTA, exact terms; added that he voted for the reservations | [57], [52] |
| #other-disability-accessibility | "passed with no votes against" | Walla: 6 for, 0 against, on 8 June 2026; co-initiator Boaron | Added detail | [42] |
| #other-culture-sport, #track-record | Culture aid package "about NIS 156 million" | No total in the source; "NIS 6 million more" was really a fund raised **to** NIS 6m | Total removed; components listed as the source gives them | [43] |
| #other-culture-sport, #religion | "allocated … to install lighting so that more matches could move" | Kipa: approved; lighting and grass; "according to local decision" | Attributed to Kipa | [44] |
| #other-periphery-north, #issue-iran | 90-day plans | Wording didn't match the sources | Aligned to [15], [17] | [15]–[18] |
| #coalition | 6 Sep 2026: JPost "reported Tropper as saying 'I, as part of such a coalition, cannot be'" | That was JPost recalling the **July** interview | Rewritten: JPost recap plus Hendel's quote that he would join a broad unity government including Netanyahu | [21] |
| #coalition | 27 Jul 2026 | Left out "not right at this stage to rule out" partners | Added | [12] |
| #coalition | 30 Sep: "as long as they accept the foundational principles" in quotation marks | Reported speech | Quotation marks removed; house meeting noted | [26] |
| #information-availability | "The fact-checker should weigh these…"; "no platform listed for Yashar"; OData-block sentence | Process note; factual error | Removed or corrected | [51], [67] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #overview | JPost description of target voters (liberal religious Zionists, reservists, dissatisfied right-leaning voters) | Not in [18] or [19] |
| #leadership | Tropper promised a "senior ministerial role" [25] | Not in [25] |
| #issue-judicial-system | Eisenkot pledged that his first laws would restore the previous judicial selection system [29] | Not in [29]; a search found no source |
| #issue-judicial-system | "Splitting this role is a proposal advanced by the current coalition" | Unsourced |
| #issue-gaza | Eisenkot "called for Hamas to be fully disarmed before any IDF withdrawal" [30] | The source attributes this to an anonymous diplomatic source |
| #other-culture-sport, #track-record | "about NIS 156 million" total for the culture aid package | Not in [43] |
| #issue-haredi-enlistment | "Staff Sgt." rank for Aner Shapira | Not in any cited source |

## Legal section verification
- No official proceedings against Tropper, Shira Shapira, Elyasaf Peretz or Shlomi Yechiav were found. I ran an additional Hebrew search (investigation / indictment / Ethics Committee / State Comptroller) and found nothing relevant. The "no indictments, convictions or official inquiries" statement stands.
- The civil defamation ruling (Tropper as plaintiff, 21 Sep 2025, NIS 160,000 plus NIS 12,000 costs) rests on Kipa's report of the court judgment [46]. Kipa quotes the ruling ("האשמות שקריות, חמורות מאין כמותן"). This is reputable reporting of an official act. The amounts and the quote are verified, and the case is described correctly as one where Tropper was the plaintiff.

## Joint-list and split-history verification
- **List name, letters, partners:** The CEC page copy [1] gives the list name and says it was submitted by "ישר לישראל עם איזנקוט" and "יסודות ישראל". The letters דרך are confirmed by Ynet's report of the CEC ballot announcement [65]. Both match `content/registry/lists.json` (yashar: memberPartyIds yashar-leyisrael, yesodot-yisrael) and research/ground-truth.md row 2.
- **Yesodot Yisrael candidates:** I read all 120 places in [1]. Only #6 Tropper, #10 Shapira, #20 Peretz and #35 Yechiav are filed for Yesodot Yisrael. Ground-truth's provisional "leader = top-ranked candidate (Tropper, #6)" is confirmed as the party's founder and leader by [7], [8], [9] and [10].
- **Earlier alliance with Hendel's Reservists:** It ran from 7 July 2026 (joint announcement; Maariv/Kan said Tropper called it a trial [11]) to the 6 September 2026 split ([22], [23]). It ended before any election. Hendel then joined Zelekha's New Economic Party [23].
- **Merger terms (conflict kept, not resolved):** ToI French [24] says "une fusion complète et non un accord technique", so Tropper cannot split off after the election. Ynetnews [22] reported the same for the emerging deal. The CEC filing [1] names two submitting parties. The document states all three and says plainly that they are not reconciled. I agree with the registry's modelling as a joint list (CEC-based).
- **Split history after past elections:** There is none. Both parties are new in 2026, and neither has run before.

## Notes for the consistency review
- **Information availability: not limited (flag false).** The document's own "on balance not limited" analysis holds, and the list's published plans [67]–[70] (missed by the author) strengthen it.
- **Closest-option changes the orchestrator asked about:**
  - *Judea and Samaria → `partial-sovereignty-area-c`.* The votes are real (all four verified, direction "for"). But they were preliminary readings of opposition bills, two of which failed (2023: 14–66; Beitar Illit: 8–45). ToI reports that the coalition called the 2025 Jordan Valley bill "trolling". Tropper's latest remarks (Maariv, 30 Sep 2026) describe no significant change beyond "shrinking the conflict". I kept `partial-sovereignty-area-c` named first, because Action outranks Statement, but rewrote the line as explicitly **mixed**, with `maintain-current-situation` named as the reading of his 2026 statements and the list leader's position. The consistency reviewer may reasonably prefer either.
  - *Religion and state → `more-choice-local-decisions`.* All votes are verified by ID, date, direction and reading type. Except for the rabbis-election bill (IDI analysis [71]), the bill texts could not be opened (bill-document lookups need the blocked OData service). The wording now claims no more than the titles support. The option is plausible but rests on titles and is marked partly mixed.
- **The single Contradiction (Shin Bet).** It is verified: vote 44855 (10 Dec 2025, preliminary, against) and the plan's Shin Bet division ([15], [16], [17]). It is a genuine but soft tension. The plan was co-authored with Hendel eight months after the vote and a month before the two split. The two mechanisms differ. The joint list's own crime plan [69] has no Shin Bet role. All of this is now stated in the text.
- **Tropper vs his list on enlistment penalties.** Tropper says he is "against criminal sanctions" [12]. The Yashar service plan [68] adds criminal law for evaders. This is noted in the text as a difference, not a Contradiction, since it is the list's platform rather than an action of his.
- The Magen David Plan was a joint Tropper–Hendel document, and no source says whether Yesodot Yisrael still holds it inside Yashar. Readers should weigh the "Formal commitment" items drawn from it accordingly. The document says so in the evidence note and in #information-availability.
- **OData live re-verification is still owed** (see Method). Sources [35]–[37], [52], [53] and [72] were checked against raw OData pages saved earlier today in the session scratchpad, not fetched by me live.
