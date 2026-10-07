# Fact-check: yashar-leyisrael

- Document checked: content/research/en/yashar-leyisrael.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 236 · Corrected: 34 · Removed: 4 · Sources replaced: 3 (4 sources added: 108–111)
- Limited-information flag: false (the party has a detailed published platform across 12 programme pages, long leader interviews, and four top candidates with full 25th-Knesset voting, bill and office records; coverage is extensive)

Orchestrator note: per the brief, `content/registry/parties.json` was not edited. Please set `limitedInfo: false` and `researchedAsOf: 2026-10-07` for `yashar-leyisrael`. The doc's #information-availability section does not start with "**Limited information.**", which matches.

## Method

- All 22 Knesset plenum votes cited in the document (sources 54, 55, 58, 59, 61, 63–65, 67–69, 91, 93, 94, 99, 101–107) were re-fetched in full from `www.knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/{id}` (complete per-MK lists, not paginated OData). Every tally and every per-MK vote for Eisenkot, Kahana, Farkash-Hacohen and Tropper matched the document: 63–57 enlistment continuity (June 11, 2024; all four against); 68–9 Palestinian-state resolution (July 18, 2024; Farkash-Hacohen and Tropper for, Eisenkot and Kahana absent from the list); Ma'ale Adumim 31–9 with 1 abstention (Oct 22, 2025; Farkash-Hacohen and Tropper for); Judea and Samaria sovereignty 25–24 (none of the four); death penalty final 62–48 with 1 abstention (Mar 30, 2026; Farkash-Hacohen and Tropper against) and first reading 39–16 (none of the four); UNRWA 92–10 (all four for); judicial votes 63–47 and 64–56 (all four against); Judicial Selection final 67–1 (none of the four); budgets 2023 (64–55 ×2), 2025 first reading (59–57) and final (66–52), 2026 final (62–55); supplementary 2023 budget first reading 62–53 (all four against); AG split 61–46; AG law 65–47; Oct 7 inquiry bill 53–48; Basic Law: Torah Study 63–52; kashrut amendment first reading 49–34; ministries bill rejected 44–30 (Farkash-Hacohen for). One additional vote was fetched and added: 46355, kashrut Amendment No. 5 final reading, July 15, 2026, 46–41, Farkash-Hacohen and Tropper against.
- "Not recorded as voting" wording was checked throughout. No absence is described as abstention or boycott; the two boycott statements are about the opposition as a whole and are sourced to Globes [56, 57].
- Knesset ParliamentInfo OData (www) was used for PersonToPosition (4, 41, 42, 49), BillInitiator (48, 84–86), KNS_Bill (5, 97, 98) and KNS_Status. All bill PDFs (70–83, 96) were downloaded from fs.knesset.gov.il and read in full for initiators, tabling dates and content.
- Every news and party URL was opened (curl or WebFetch). ToI pages (3, 9, 60, 66), Davar (29) and jweekly (100) block curl and were read via WebFetch.

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | Harush-Giti "a former NGO director and Defense Ministry policy official" | Vague; Ynet gives specific roles | Reworded: former director of "Acharai!", former head of the Defense Ministry's national-service outline directorate | [2] |
| #overview | "Yashar says the list is half women and includes secular, religious and traditional Jews, Druze, immigrants and residents of the periphery [46]" | Not in i24 article (checked by curl and WebFetch) | Replaced with i24's description (security focus, members from different sectors) and Eisenkot's statement that the list reflects commitment to gender equality | [46], new [111] Kipa |
| #leadership | "Master Sergeant Gal Eisenkot" | Rank not in source; ToI says soldier in Maglan unit | Reworded | [9] |
| #leadership | Farkash-Hacohen "has been a Deputy Speaker since October 2023" | Knesset record: Deputy Speaker 2023-10-23 to 2025-10-22 | Corrected to Oct 2023–Oct 2025 | [41] |
| #leadership | Farkash-Hacohen switch date unresolved | Found: on July 24, 2025 she told Gantz she wanted to leave the faction to join Eisenkot and would not resign her seat; Knesset record still lists her in Blue and White – National Unity with no end date | Added | new [110] Mako, [41] |
| #leadership | Shaul Meridor "an economist [37]" | Kikar article [37] does not mention Meridor | Re-cited to Ice (May 5, 2026: "senior economist") | new [109] |
| #issue-cost-of-living | "the party told The Media Line it would cut spending…" | The Media Line quotes Farkash-Hacohen, not "the party" | Attributed to Farkash-Hacohen (No. 3) | [14] |
| #issue-gaza | "Action (as a minister, 2023): … Eisenkot was in the minority…" | Source is Eisenkot's own account ("I was the lone voice"), not a record of an action | Retagged Statement and attributed | [9] |
| #issue-gaza | Dec 2023 supplementary budget vote | Correct, but imprecise | Added date, tally 62–53, and ToI detail on the final vote (MKs outside the hall, opposition recorded in protocol) | [59, 60] |
| #issue-haredi-enlistment | "May 2026 … repeated his call for Haredim and Arab citizens to do national service" | Maariv: draft Haredim into the IDF, Arabs into national service | Corrected | [36] |
| #issue-haredi-enlistment | 2023 bill sanctions "were fines and a ban on state employment and state tenders" | Bill s.55 also sets up to 2 years' prison (breach of court order, false information) | Added criminal penalties; added "no numerical cap" (verified) | [70] |
| #issue-haredi-enlistment | "Action (2024, as a minister): Gantz and Eisenkot presented an enlistment outline" | Presenting an unadopted proposal is a statement of position | Retagged Statement | [8] |
| #issue-haredi-enlistment | "**Contradiction:** … 2026 platform caps … and adds criminal penalties" | Both the 2023 bill and the 2026 platform require universal service and both carry criminal penalties, so "adds criminal penalties" is wrong. The 2023 co-sponsorship (action) is three years earlier than the 2026 platform (formal commitment) and points the same way, but less strictly | Recast as "Change over time (not a contradiction)": uncapped combined study and service track (2023) vs ≤3% one-year deferrals with basic training (2026) | [16, 70] |
| #issue-housing | Media Line: housing via transport "rather than construction alone" (quoted) | Not a verbatim quote; speaker was Farkash-Hacohen; it sat under a Formal commitment tag | Moved to a Statement attributed to Farkash-Hacohen, paraphrased with her actual quote ("magic solutions") | [14] |
| #issue-iran-and-regional-security | "Its platform speaks of expanding peace agreements 'from a position of strength' [9, 28]" | "From a position of strength" refers to the Trump Gaza plan in [9]; the home page says "expand the circle of peace" | Corrected; split the Formal commitment and Statement tags | [9, 28] |
| #issue-judea-samaria | "No statement … supporting or opposing applying sovereignty" | JC [15] reports Eisenkot opposes formal annexation of the West Bank (Jewish-majority argument) | Added a reported Statement; narrowed "what wasn't found" to direct statements and platform | [15] |
| #issue-judicial-system | "According to Yashar's summary of its seven main issues … constitution … [14, 28]"; ten-point plan "constitutional reform, professional civil service and term limits" | No "seven issues" text in [14] or [28]; the home page says Basic Law: Legislation, independent judiciary, two-term PM limit, end of political appointments | Replaced with home-page content | [28] |
| #issue-judicial-system | "matches the platform's call to reverse them [9]" | [9] is an interview, not the platform | "Eisenkot's stated plan" | [9] |
| #issue-judicial-system | Closest-option note on "stated goal of a constitution" | Basis was the removed sentence | Re-based on JC report of support for a written constitution plus the planned Basic Law: Legislation | [15, 28] |
| #issue-religion-and-state | Kashrut reform "largely held up by court orders"; F-H and Tropper voted against "at an earlier stage" | Maariv: held up by ministers' interim orders, not court orders. The June 2 vote was the first reading of government bill 1046237 | Corrected; added the final-reading vote 46355 (July 15, 2026, 46–41, both against) | [88, 104], new [108] |
| #other-reservists-and-soldiers | Eisenkot "also sponsored" the reserve-pay tax bill | BillInitiator ordinal 2 (co-sponsor) | "co-sponsored"; the Mimadim bill marked as lead sponsor (ordinal 1) | [48] |
| #other-national-security-strategy | Notes "argue that Israel has never had a formal security doctrine" | Notes say the doctrine has been informal since Ben-Gurion | Reworded | [80] |
| #other-north-recovery | "homes 1–5 km…, city housing…" | Plan specifies detached homes (צמודי קרקע) | Reworded | [22] |
| #other-womens-representation | Eisenkot "sponsored" the board-quota bill; "list is half women [46]" | Ordinal 6 (co-sponsor); half-women claim unsupported | "co-sponsored"; replaced with Eisenkot's equality statement | [48], [111] |
| #other-culture-sport-science | Tagged "Action (in government)" | Tropper's figures are his own interview claims; Farkash-Hacohen was presented with an ISA plan | Retagged as Statements, wording aligned to sources | [89, 90] |
| #other-governance | "Kahana had sponsored an earlier version in 2023" | Bill text: identical bill P/315/25, removed from agenda March 15, 2023 (tabled earlier) | Reworded | [71, 84, 98] |
| #coalition | "open to Bennett's party if its candidates 'accept Israel as a Jewish democratic state' [10]" | Misreading: JPost quote is a general partner test, not about Bennett | Reworded with the full quote | [10] |
| #coalition | Haredi parties "…but 'they are saying the exact opposite' [9]" | ToI "He always does the exact opposite" refers to Netanyahu | Removed the clause; full quote given | [9] |
| #coalition | MKs voted against Dec 2023 budget "over coalition funds" | Correct but needed the stage | "at first reading" | [59, 60] |
| #track-record | Hostage deal "argued, in the minority" | Self-reported | Attributed ("he says") | [9] |
| #track-record | "Kept": his votes and bills on "the October 7 inquiry" | The inquiry bills were Farkash-Hacohen's, not Eisenkot's | Removed from his list; added note | [73, 74, 96] |
| #track-record | National Security Concept bill listed as "co-sponsored" | Sole initiator | Listed separately as his own bill | [80, 98] |
| #track-record | Farkash-Hacohen "oversaw the May 2022 launch" of space programme | Overstated; ISA presented it to her | Reworded | [90] |
| #legal | "government dismissed Farkash-Hacohen … [41]" | [41] (Knesset positions) doesn't support this | Re-cited to Al-Monitor and reworded ("a session was convened to remove her") | [50] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #issue-haredi-enlistment | "In August 2026 the party told The Media Line that full Haredi enlistment 'cannot happen immediately' [14]" | This was political scientist Jack Drassinower's description of Eisenkot's position, not a party statement |
| #coalition | "but 'they are saying the exact opposite' [9]" | The quote is about Netanyahu, not the Haredi parties |
| #issue-judicial-system | "Yashar's summary of its seven main issues … constitution that balances the Declaration of Independence with the Basic Laws…" | Not found in [14] or [28] |
| #overview / #other-womens-representation | "list is half women and includes secular, religious and traditional Jews, Druze, immigrants and residents of the periphery" | Not in [46] (also checked the Kipa list article) |

## Legal section verification
- No indictments, convictions, State Comptroller findings, Ethics Committee decisions or official inquiries were found for Eisenkot, Cohen, Farkash-Hacohen, Kahana or Tropper (English and Hebrew searches; Tropper added to the "what was checked" list).
- The only item in the section, the 2015 move to remove Farkash-Hacohen from the Electricity Authority, now rests on the Al-Monitor report [50] (it previously cited a Knesset positions record that does not mention it). It is explicitly framed as not a legal or disciplinary finding. Status: no proceedings.

## Joint-list and split-history verification
- CEC candidate-list page (IDI copy) [1] read in full. List name "ישר! עם איזנקוט לראשות הממשלה מאחדים את ישראל", submitted by ישר לישראל עם איזנקוט and יסודות ישראל. Order: 1 Eisenkot, 2 Cohen, 3 Farkash-Hacohen, 4 Altschuler, 5 Kahana, 6 Tropper (Yesodot Yisrael), 7 Meridor, 10 Shapira (Yesodot Yisrael), 11 Harush-Giti, 12 Stern, 13 Abu Rokan, 20 Peretz (Yesodot Yisrael). Ballot letters דרך match `content/registry/lists.json` and `research/ground-truth.md`.
- Split history: this is the parties' first joint run, so there is no post-election split history. The Ynetnews report [44] that the arrangement is not a technical bloc, so Tropper could not split after the election, is verified. Tropper's own faction history comes from Knesset records [49]: Blue and White, then National Unity, then Blue and White – National Unity, still an MK. Gantz announced on May 5, 2026 that Tropper had left the party but would keep his seat [40].
- Tropper is a Yesodot Yisrael candidate. Every vote of his in the document is attributed to him by name, never to "Yashar" or "the party". His track-record bullet now names his party.

## Notes for the consistency review
- The ToI article on the Ma'ale Adumim vote [66] gives 32–9. The official Knesset record [65] gives 31–9 with 1 abstention, and the document uses the official figure.
- Positions on Gaza, Iran, Lebanon and Judea and Samaria rest almost entirely on Eisenkot's interviews and JPost "the Post has learned" reporting [9–12]. They are tagged as Statements, and the JPost material is reported rather than quoted.
- The JC [15] is a general explainer. Its claims (same-sex marriage, opposition to formal annexation, written constitution) are tagged as reported statements because no party text was found for them.
- Kahana's Knesset BillInitiator record in OData omits some bills that the tabled PDFs show he co-sponsored (e.g. the Israeli Service bill, the VAT bill, the terror-supporter disqualification bill). The PDFs were treated as authoritative.
- The 2024 law on aid to student reservists (2208658) is a government bill, but Knesset BillInitiator lists Kahana and Farkash-Hacohen as initiators (probably a merged private bill). The "co-sponsored" wording was kept.
- Party programme pages carry leftover placeholder (lorem ipsum) text in places, and several pages (housing, constitution) are announced but not published. The document already notes this.
- `CONTENT_CORPUS=real pnpm validate:content` reports only `research-missing … he/yashar-leyisrael.md` for this party. That is expected before translation; the EN file has no errors.
