# Fact-check: balad

- Document checked: content/research/en/balad.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 164 · Corrected: 38 · Removed: 4 · Sources replaced: 1 (plus 11 sources added, now 81)
- Limited-information flag: false (Knesset presence 1996–2022 with a verifiable bill and vote record in Knesset open data, IDI and ECFR profiles, and wide Hebrew, English and Arabic coverage of the 2022 and 2026 disqualification proceedings. The gaps (no seats since 2022, no 2026 platform, a chair who is not a candidate) are stated in #information-availability. Orchestrator: set `limitedInfo: false` and `researchedAsOf: 2026-10-07` for balad in parties.json.)

Method: every cited URL was opened (curl, with r.jina.ai or WebFetch where Cloudflare blocked curl: Times of Israel, Al Jazeera Centre, Al-Araby, Kan). The 26 Knesset bill .docx files were text-extracted and checked for initiators, dates and the quoted explanatory notes. Bill counts were rebuilt from the official Knesset OData service (`www.knesset.gov.il/OdataV4`): KNS_BillInitiator for PersonID 30751, paginated (100 + 62 rows), then KNS_Bill for type and status of each of the 162 bill IDs. Votes 35027 and 35004 were read in full (120 and 119 member rows, paginated).

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | "Balad describes itself as a secular Arab nationalist party [6, 4]" | ECFR describes it as secular; Al Jazeera Centre says it defines itself as an Arab national party | Reworded to separate description from self-definition | [6, 4] |
| #overview, #issue-judea-samaria | IDI platform summary: "all the territories taken in 1967"; "refugees and their descendants" | IDI says "all of the contested territories" and does not mention descendants | Reworded to IDI's words; "descendants" removed | [5] |
| #overview | 3.25% threshold cited to [8, 6] | Neither gives the figure | Added ToI 2022, which does | [9] |
| #overview | "three MKs in the 23rd Knesset … one in the 24th [6, 18]" | Neither source states this | Named the three 23rd-Knesset MKs (ECFR + their joint 2020 bill); 24th: "headed Balad's sub-faction within the six-member Joint List" (Ynetnews 2021, Open Knesset) | [6, 34, 64, 18] |
| #overview | Ballot letters cited to [56, 21] | JC article [21] does not give letters | Citation narrowed to Ynet (CEC announcement) | [56] |
| #overview | "Hadash chair Yousef Jabareen" | Maariv does not call him chair | Added N12, which does | [16] |
| #overview | Ra'am talks: "the other three would not commit to that" | Maariv: Ra'am sought a commitment that partners would not block a coalition move | Reworded; named Abbas as announcing the solo run | [3, 4] |
| #overview, #leadership | Withdrew "on 1 October 2026" | Hearing 1 Oct; Balad's decision announced around midnight (Ynet 21:14 UTC 1 Oct = 00:14 2 Oct Israel time); ruling 2 Oct | "on the night of 1–2 October 2026" | [2, 20, 23, 24] |
| #overview | 2015 Joint List partners cited to [5, 9] | Fine, but ECFR names all four | Added [6] | [5, 6, 9] |
| #overview | 2022 split "over who would get the sixth place, which had been reserved for Balad" [9] | Not in ToI [9] | Replaced with Ynet 15 Sept 2022: Balad's demand to cancel the 6th-place rotation and its demand that the list recommend no PM candidate | [71, 9] |
| #leadership | "initiator or co-initiator of 162 private bills" | Knesset OData: 162 bill records = 161 private (160 initiator, 1 joined later) + 1 government bill (his arnona bill was merged into it) | Reworded precisely | [59] |
| #leadership | Balad candidates: Wishahi listed as Balad's (now 9th) [2] | CEC filing lists #10 Nahaya Wishahi as nominated by the Israeli Communist Party (Hadash); Ynet's framing was ambiguous | Removed from Balad's list; added note on the discrepancy; added Balad's 11 (Nassasra) and 15 (Noy) from the CEC filing, with new places | [1, 2, 7] |
| #issue-haredi-enlistment, #other-civil-service | Arab48 Balad statement tagged **Formal commitment** | A party press statement, not a platform or formal decision | Downgraded to **Statement** | [31] |
| #issue-housing | "With all Joint List MKs" fair-rent bill | Bill has 14 initiators; Walid Taha not among them | "With 13 other Joint List MKs" | [45] |
| #issue-judea-samaria | Golan Heights Law repeal "in 2021" | Knesset records: bills in 2020 and 2021 | "In 2020 and again in 2021" | [59] |
| #other-citizenship-law | "the Joint List, including Abu Shehadeh, voted against" (press only) | Verified in Knesset vote 35027: Abu Shehadeh against; 59–59, 2 abstentions (120 rows) | Added vote record; exact date and tally | [72, 60, 61] |
| #other-citizenship-law | Repeal bills "2019 and again in June 2022" | Records show 2019, 2020 and June 2022; the 2022 bill repeals the new 2022 law | Reworded | [58, 59] |
| #other-workers-and-welfare, #track-record | "In March 2022 a law he co-initiated was passed" (arnona) | His bill (sole initiator) was merged into a government bill (Senior Citizens Law amendment 17) passed 1 March 2022 | Reworded; added bill text | [81, 59] |
| #other-environment-and-health, #track-record | Tobacco law passed "June 2022"; "bans tobacco advertising in the printed press" | Third reading 31 May 2022 (published 1 June); bill text: ends the printed-press exemption | "May 2022"; wording matched bill; added bill text | [80, 59] |
| #coalition | "never joined or supported an Israeli government from inside a coalition" — uncited | Needed a source | Cited Al Jazeera Centre (Ra'am in 2021 was the first Arab list in a coalition) | [4] |
| #coalition | "Its stated position is not to recommend any Zionist candidate" — uncited, undated | Source is ToI 2022 | Dated and cited | [9] |
| #coalition | Eisenkot condition "for any partner" | Ynetnews: condition "for joining a future government" | Reworded | [22] |
| #coalition | Sept 2019 reasons | ToI also cites Gantz's military record | Added | [62] |
| #coalition | March 2020 marked **Contradiction** | Balad had not pledged never to recommend; its Sept 2019 refusal was about Gantz then, and Odeh's March 2020 account is a third party's description of an internal position that Balad then set aside for list unity. A change of action over time, not action vs a stated pledge (corpus rule) | Relabelled **Change over time** | [62, 63] |
| #coalition | "April–May 2021 … Abu Shehadeh, Balad's only MK, did not recommend anyone" | Article 5 May 2021 says he "is not expected to recommend anyone"; "only MK" not in source | Dated May 2021; attributed and reworded | [64] |
| #coalition | June 2021 opposition illustrated only by Citizenship Law | Added the investiture vote: Abu Shehadeh against, 60–59 (vote 35004, 119 rows) | Added | [73, 72] |
| #track-record | Legislation paragraph (162 private bills; "three laws he co-initiated") | See bill-count correction; arnona law is a government bill with his bill merged | Rewritten from Knesset OData counts (127 still at preliminary stage, a few advanced to committee) | [59, 80, 81] |
| #track-record | "Votes … could not be checked … press reports" | OData was reachable (www); two key votes verified | Rewritten; full record noted as not reviewed | [72, 73] |
| #track-record | 2003 and 2009 disqualifications cited to IDI profile only | Needed court/official or reputable record | Added Adalah case records (EA 131/03, 11-justice panel, Jan 2003) and the 21 Jan 2009 ruling (8–1) | [5, 77, 78] |
| #track-record | 2019: "each time the Supreme Court overturned", cited to [13, 9] | Neither reports the court outcome | Added VOA report of the 17 March 2019 ruling | [13, 79] |
| #legal | "The article … described the Hamas attack as 'an important historic event militarily, politically and strategically' and wrote that others could learn…" [22, 66] | Quote comes from Yashar!'s statement and a ToI liveblog, not an official act; brief requires the official description | Rewritten: Reuters' description of the article plus the Attorney General's representative's description before the Supreme Court | [23, 20] |
| #legal | Status: "On 1 October 2026 … suggested he consider withdrawing … no final ruling" | Correct in substance; ruling date (2 Oct) and "moot" wording missing; judge's words were "consider whether he maintains his candidacy" | Reworded with both dates | [20, 2, 23, 24] |
| #legal | Detention 9 Nov 2023 cited to a 2026 Ynetnews article that gives no date; no outcome | Needed contemporaneous report and outcome | Added ToI 9 Nov 2023 (date, police statement) and Adalah (release same day, Nazareth entry ban up to 14 days, attributed) | [75, 68, 76] |
| #legal | Funding probe | Added the 2016 start (ToI) | Added | [67, 74] |
| #legal | "in October 2021 the AG decided to indict 13 … sentenced to community service and fines" | ToI: charges announced April 2021; conviction 4 Oct 2021, Nazareth Magistrate's Court, plea deal; fines, suspended terms, service work | Corrected dates, court and sentences; wording "convicted in a plea agreement" | [74, 67] |
| #legal | Party case "closed" | ToI adds that Mandelblit said the evidence pointed to the party's guilt but declined to indict to avoid harming uninvolved members | Added for completeness | [74] |
| #legal | "Other leaders … Nahaya Wishahi" | Not a Balad candidate per CEC filing | Removed her name | [1] |
| #information-availability | "Per-MK voting records … could not be checked" | No longer accurate | Rewritten | [72, 73] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #overview | 2022 split "over who would get the sixth place, which had been reserved for Balad" | Not in the cited source; replaced with Ynet 2022's account |
| #leadership | Dr. Nahaya Wishahi as a Balad candidate | CEC filing lists her as Hadash's candidate (kept only as a noted discrepancy) |
| #coalition | "Balad's only MK" | Not in source |
| #legal | Quote "an important historic event militarily, politically and strategically" and "others could learn…" as the description of the article | Source was a rival party's statement / liveblog, not an official act; replaced by Reuters and the AG's description (the quote remains in source 22, used elsewhere only for Eisenkot's condition and Abu Shehadeh's response) |

## Legal section verification
- **CEC disqualification (Sept 2026):** Otzma Yehudit petition; accepted on both s.7A grounds (negating Israel as Jewish and democratic; supporting armed struggle of a terror organization), 30–4 on each ground (Maariv [20]); 30–4 also in The Jewish Chronicle [21], which reports that CEC chair Sohlberg and AG Baharav-Miara opposed barring the Joint List but supported barring Abu Shehadeh. Reputable reporting of an official decision.
- **AG position before the Supreme Court:** representative Yonatan Berman, quoted in Maariv [20] ("unfortunately shows support for an armed struggle against the state"; intelligence-failure passage).
- **Supreme Court (1–2 Oct 2026):** hearing 1 Oct; President Amit recommended he consider whether to maintain his candidacy (Ynet [2]); Balad's central committee and political bureau decided that night (Maariv [20], Ynet [24]); ruling 2 Oct: majority had been likely to uphold, question moot after withdrawal, judges unanimously called the statements "painful, disturbing and revolting" (Reuters via Al-Monitor [23]). **Status today: not a candidate; no final ruling; remains Balad chair** — matches research/ground-truth.md.
- **Detention, 9 Nov 2023:** ToI [75] (date, police said protest not approved and could harm public order), Ynetnews [68], Adalah [76] (release the same day, conditions incl. Nazareth ban up to 14 days — attributed to Adalah as counsel). No indictment found.
- **Party-funding case:** State Comptroller referral, AG-ordered investigation (Israel Hayom [67]; ToI [74], from 2016); AG announced charges April 2021; 4 Oct 2021 Nazareth Magistrate's Court convicted Zoabi and 12 others in a plea agreement (ToI [74]); cases against Zahalka, Ghattas, Abu Shehadeh (questioned c. end of 2017 as a 2015 district manager) and the party closed (Israel Hayom [67]; Abu Shehadeh's own response confirms closure). Balad's response attributed.
- No proceedings found for Anabtawi, Awawdeh or Karkabi-Sabah.

## Joint-list and split-history verification
- Registry: `joint-list`, "הרשימה המשותפת / The Joint List", letters ודם, members hadash, taal, balad — matches doc, ground-truth.md, the CEC filing [1] (submitted by the Israeli Communist Party, Balad and Ta'al; places 1–24 read from the PDF) and the CEC ballot announcement reported by Ynet [56].
- Agreement of 19 Aug 2026 (Maariv [3]): places 1 Hadash, 2 Ta'al, 3 Balad, 4 Hadash, 5 Balad, 6–7 Hadash, 8 Balad, 9 Ta'al; rotation 6/9; clause letting Hadash and Ta'al run on if Balad were disqualified; early-2026 four-party understandings; Ra'am's July solo announcement. Consistent with hadash.md (read only for these facts).
- Split history: 1996 with Hadash, 1999 with Ta'al, 2003–2013 alone, 3 seats each (IDI [5]); 2015 four-party Joint List (IDI, ECFR, ToI [5, 6, 9]); April 2019 Ra'am–Balad / Hadash–Ta'al, Ra'am–Balad 4 seats near the threshold (Ynetnews, ToI [11, 12]); reunion announced 19–20 June 2019 [11, 12]; 2021 Ra'am out, Hadash–Ta'al–Balad 6 seats (Al Jazeera Centre table from CEC results [4]); 14 Sept 2022 deal with Abu Shehadeh 3rd (JDN [10]); 15 Sept 2022 split (Ynet [71], ToI [9]); 2022 Balad alone 138,617 votes, 2.91%, no seats (CEC [8]); Aug 2026 reunion [3, 16].

## Notes for the consistency review
- Arab48 [25, 31] and Al-Araby Al-Jadeed [30] (both linked to the party's milieu) are used only for Balad's own statements. All event facts (detention, legal cases, votes, disqualifications) now rest on independent outlets, court records or Knesset data.
- Al Jazeera Centre for Studies [4] (Qatar) is used for the Joint List's joint statement, Ra'am being the first Arab coalition party, and 2021 results it attributes to the CEC. ice.co.il [7] is the only source for the Bishara background sentence; a stronger source would be better.
- Adalah [76, 77, 78] was counsel in the 2003/2009 cases and the 2023 detention; used only for court outcomes with case numbers and an attributed release condition.
- The JC [21] gives the CEC vote on barring the Joint List as 15–8 on a Likud petition, while the hadash fact-check cites Srugim's 18–5–1. The balad doc does not give that tally; reviewers should align any figure used across joint-list docs.
- Ynet [2] listed Wishahi among the post-withdrawal moves "for Balad", but the CEC filing assigns her to Hadash. The hadash/taal docs should be checked for consistency.
- The Haredi-enlistment closest option rests on a Balad statement about Arab youth, not Haredim; it is labelled as such.
