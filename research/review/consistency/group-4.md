# Consistency review: group 4

- Reviewed on 2026-10-12 by a Stage 4 group reviewer (not an author or fact-checker of these documents)
- Documents reviewed: the-democrats-party, meretz, raam, hadash, taal, balad, amcha-yisrael

Method: read each document, its fact-check log, the glossary, the issues and the registry entries. Knesset votes were read from the official vote-details service (`https://www.knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/{voteId}`, all MKs in one response, one request every 2.5 seconds); vote IDs were found through the OData service. About 95 vote records were read. Every added claim cites a source opened in this session. `CONTENT_CORPUS=real pnpm validate:content` leaves only the 76 `research-missing` errors.

Depth after the review (words / sources / Action tags / Contradiction / Change over time / no position):

| Party | Before | After |
| ----- | ------ | ----- |
| the-democrats-party | 9,384 / 78 / 21 / 1 / 0 / 0 | 10,169 / 89 / 23 / 1 / 1 / 0 |
| meretz | 10,544 / 59 / 26 / 3 / 1 / 0 | 10,730 / 61 / 26 / 4 / 1 / 0 |
| raam | 8,288 / 78 / 44 / 1 / 0 / 1 | 8,895 / 88 / 44 / 1 / 2 / 1 |
| hadash | 7,753 / 107 / 11 / 1 / 0 / 0 | 9,525 / 133 / 14 / 1 / 0 / 0 |
| taal | 8,967 / 106 / 13 / 0 / 0 / 1 | 9,372 / 115 / 16 / 0 / 0 / 0 |
| balad | 7,594 / 81 / 27 / 0 / 1 / 1 | 8,316 / 94 / 25 / 0 / 1 / 2 |
| amcha-yisrael | 9,638 / 75 / 0 / 0 / 1 / 0 | 9,366 / 70 / 0 / 0 / 1 / 0 |

## Findings and changes

| Party | Anchor | Finding (imbalance / tone / evidence / recency / tally / shared fact / legal / poll figure) | Change made or justification |
| ----- | ------ | ------------------------------------------------------------------------------------------- | ---------------------------- |
| the-democrats-party | #issue-judea-samaria, #issue-haredi-enlistment, #issue-judicial-system, #issue-october-7-inquiry | Tally: votes rested on press reports of "the opposition". Official record: 44413 (71–13, all four MKs against); 44580 (25–24; Lazimi, Kariv, Rayten against, Michaeli not recorded); 46248 (63–52, four against); 46670 (58–54, four against); 44669/44661 (45–53, 44–52; Kariv, Rayten, Michaeli for); 44946 (53–48, four against) | Per-MK votes added with sources. The 22 October 2025 item was "Context" saying the vote was unknown; it is now an Action |
| the-democrats-party | #issue-judicial-system, #track-record | Tally: "walked out of the final vote, 67 to 1" was incomplete. The four MKs voted against at second reading (43643, 65–47); at third reading (43884, 67–1) only Michaeli is recorded, as present not voting | Reworded with both votes |
| the-democrats-party | #issue-october-7-inquiry | Tally: the 7 July 2026 first reading (59–0) has no per-MK record in either Knesset service | Left as press-sourced; said so in #information-availability |
| the-democrats-party | #issue-october-7-inquiry | Evidence: the 8 September 2026 joint pledge by four party leaders was tagged Formal commitment | Retagged Statement (it is a leaders' declaration, not a platform or party decision) |
| the-democrats-party | #track-record | Imbalance (coalition-line votes): Meretz lists its 2021–22 coalition votes; Labor's were absent. Official record: Lazimi, Kariv and Rayten voted against the public-housing and child-allowance bills (36094, 36100), Kariv against the disability-allowance bill (36118), all three against the weapons minimum-sentence bill (37100) and the disability transport bill (37316) | Added as **Change over time**, not Contradiction: no Labor platform from before the votes could be opened, so the comparison is with the 2026 platform and the MKs' later bills (rule 2, second bullet) |
| the-democrats-party | #overview | Shared fact: the union terms were stated only as announced in June 2024; the 20 February 2026 update (places 6, 8, 14) was missing; "dissolve the merger so that Labor could join the government" differed from the Meretz wording of the April 2020 split | Added the February 2026 update (Ynet, opened); reworded the 2020 split to match meretz.md; "approved the merger" changed to "approved the agreement" |
| the-democrats-party | #legal | Legal: three items were not official proceedings against a leader: police saying no investigation was opened (May 2024), Likud's CEC complaint with no decision, and Golan's own court cases (Shin Bet protection petition, defamation suit) | Removed under rule 3 (4 sources dropped). Kept: the Kariv investigation (status rechecked 12 October: pending), the State Attorney's Office decision on the 2023 remark ("closed without an investigation"), the CEC ruling on the list, and Katz's order, relabelled as an administrative order |
| the-democrats-party | #coalition | Recency: the 2020 Peretz/Shmuli Contradiction predates the current leadership | Kept (the pledge was standing when the action happened) with a sentence saying it predates the current leadership |
| meretz | #other-citizenship-law | Tally: the 10 March 2022 reservation votes were unchecked. All 39 (IDs 36949–37004) were read: every one defeated; six Meretz MKs for in the first 27, five in the last 12 | Count and sources added |
| meretz | #other-citizenship-law | Evidence (rule 2): Horowitz's 1 July 2021 statement that Meretz would not back the extension, followed by the 5 July 2021 vote for it, was labelled Change over time | Relabelled **Contradiction** with the compromise as the explanation on record; the 2021-for / 2022-against sequence stays Change over time. See the lead-reviewer question |
| meretz | #issue-gaza, #issue-haredi-enlistment, #issue-iran-and-regional-security, #issue-october-7-inquiry | Rule 4: closest options resting on indirect or pre-ceasefire evidence did not say "tentative" | Each line now says it is tentative and why |
| meretz | #overview | Tone: "Golan had sought to change the agreement so that Meretz representatives would not receive realistic places" stated a reported motive as fact | Reworded to a reported dispute over the guaranteed places |
| meretz | #legal | Legal: 56-word section. Hebrew and English searches repeated on 12 October for Lasky, Rozin, Reznik and Meretz | Nothing found; the section now lists what was checked and the recheck date. Short length is justified |
| raam | #issue-crime-in-arab-society | Evidence: non-standard label "Change of stated position" | Changed to **Change over time** |
| raam | #track-record | Imbalance (coalition-line votes): none listed. Official record: Ra'am MKs voted with the coalition on 36094, 36100, 36118, 37100, 37316; on 37279 only Ghanaim voted (against) | Added as Actions with coalition context; not Contradictions because no Ra'am pledge on these measures was found |
| raam | #track-record | Evidence: Citizenship Law. Abbas and Taha voted for the July 2021 extension (35027), two abstained; all four voted against the 2022 law (37006) | Added as **Change over time** with the compromise reported by the Times of Israel |
| raam | #issue-religion-and-state | Imbalance: the 10 June 2026 Torah-study preliminary reading (46121, 56–43, no Ra'am or Hadash–Ta'al MK recorded) and the reports about it appeared only in taal.md | Added the same facts, with the denial, to raam.md and hadash.md |
| raam | #issue-judicial-system, #other-jewish-arab-partnership | Evidence standard: a Channel 12 report from unnamed sources that both sides denied; a rival party's account of an Abbas remark | Both removed (2 sources dropped) |
| raam | #issue-haredi-enlistment, #issue-religion-and-state | Rule 4 wording | Lines now say "Tentative" and why |
| raam | whole document | Depth: 44 Action tags against Hadash's 11 | Justified: Ra'am's document tags each bullet (many are no-confidence motions); Hadash's groups several votes under one tag. Hadash's per-MK record was nevertheless thinner, and was filled (next rows) |
| hadash | #legal | Legal: **Ofer Cassif (No. 5) was convicted on 8 October 2026** by the Jerusalem Magistrate's Court of assaulting a police officer in aggravated circumstances (indicted 29 February 2024). The document had neither the indictment nor the conviction | Added with Ynet (indictment), Srugim (conviction) and the party weekly (his response). Status: convicted at first instance, no sentence reported |
| hadash | #legal | Legal scope: the 2025 expulsion motion against Ayman Odeh, who is not on the 2026 list | Removed under rule 3 (1 source dropped); the section says such matters are not listed |
| hadash | #issues (most sections) | Recency: seven closest-option lines leaned on the 2013 platform | The Joint List's 2026 economic and crime plans (its website) and its 2026 positions on Gaza and a Palestinian state (as reported by Zo Haderech) were added; the 2013 platform is now labelled "Dated background" throughout, and each affected closest-option line names the 2021+ evidence it rests on |
| hadash | #issue-cost-of-living, #issue-gaza, #issue-judea-samaria, #issue-october-7-inquiry, #issue-religion-and-state, #other-arab-equality, #other-women-lgbt | Depth: per-MK votes available in the official record were missing | Added: budgets 2025 and 2026 (43638, 45675), UNRWA laws (41904, 41919), Palestinian-state resolution and Basic Law (41304, 41954), state-commission bills (41283, 43382, 46366, 46368), civil marriage December 2025 (44959), Torah-study first reading (46181), Nation-State Law repeal (42379), conversion-therapy bills (45062) |
| hadash | #issue-religion-and-state | Tally: "Touma-Sliman voted against the Basic Law: Torah Study". Record 46248: Odeh, Cassif and Touma-Sliman against | Corrected |
| hadash | #issue-religion-and-state | Evidence: Contradiction (2013 platform against Atauna's 2023 vote) | Kept: the 2013 platform is still the latest the party publishes, and Atauna is a 2026 candidate. Both points are now stated |
| hadash | #issue-haredi-enlistment | Rule 4 | Kept as tentative; now rests on the April 2026 statement, with the 2013 platform as background |
| hadash | #overview | Shared fact: Samir Bin Said's move from Ta'al to Hadash (15 July 2026) was missing, so the seat count disagreed with taal.md | Added (Makan, opened): three MKs elected as Hadash candidates, plus Bin Said |
| hadash | #leadership | Evidence: Faten Ghattas was called "she". The Joint List's own candidates page uses masculine forms for Ghattas and feminine forms for women candidates | Changed to "he"; added Dr. Nahaya Wishahi (No. 10, filed for Hadash) |
| hadash | #overview | Tone: "Hadash sources said Abbas was prolonging the negotiations" | Removed; the reason given now matches raam.md and balad.md |
| hadash, taal, balad | #overview, #legal | Shared fact: CEC vote on barring the Joint List. Srugim, quoting the CEC's announcement, gives 18 for, 5 against, 1 abstention; the Times of Israel gives 18–5; only the Jewish Chronicle gives 15–8 | All three now say 18–5 with one abstention. balad.md, which cites the Jewish Chronicle for other facts, notes its differing figure |
| hadash, taal, balad | #overview | Shared fact: 2019 reunion dated June (balad) and July (taal); September 2022 described as "Balad split" (hadash, taal) and "the deal collapsed" (balad) | All three: announced June 2019, finalised end of July 2019; in 2022 "the agreement collapsed: Hadash and Ta'al filed a list without Balad, and Balad ran alone" |
| hadash, taal, balad | #overview | Shared fact: rotation. Times of Israel and Maariv: places 6 and 9. Al-Quds Al-Arabi (one unnamed source): places 2 and 9 after 20 months | hadash and balad say 6 and 9; taal gives 6 and 9 first and the Al-Quds account as a differing report. "Tibi chairs the faction" (balad) changed to "is expected to chair" |
| hadash, balad | #issue-cost-of-living, #issue-crime-in-arab-society, #issue-housing | Imbalance: taal.md cited the Joint List's published plans; hadash.md and balad.md said no joint programme was found | Plans added to both as Formal commitments of the joint list |
| taal | #issue-religion-and-state | Evidence: "No documented position found", but the record has Tibi against the June 2023 civil marriage bill (39317, 37–56) and for the November 2025 Shabbat transport bill (44754, 43–58) | Votes added; the section now has a tentative, mixed closest-option line |
| taal | #other-arab-citizens-equality, #other-lgbt-rights, #issue-october-7-inquiry, #issue-cost-of-living | Depth: Tibi's votes on Nation-State Law repeal (42379, for), conversion-therapy bills (45062, against), state-commission bills (41283, 43382, for) and the 2025 and 2026 budgets (against) were missing | Added |
| taal | #other-death-penalty | Tally: "62-47" (Times of Israel). Official record 45858: 62–48, one abstention; Tibi against | Corrected, press figure noted |
| taal | #issue-religion-and-state, #other-holy-places, #coalition | Evidence standard: an unnamed "source in the Arab parties"; an Israel Hayom report of a Gafni phone call; a January 2023 report Tibi denied; "coalition sources" on what Haredi leaders told Ben-Gvir | Removed (3 sources dropped). The Torah-study absence stays, with the named criticism (Haskel), the reports and the denials |
| taal | #issue-gaza, #issue-judea-samaria | Evidence: an IDI description and a party weekly's review were tagged Formal commitment | Retagged Background and Statement (Joint List, 2026) |
| taal | #issue-haredi-enlistment | Rule 4; "Note on consistency" label | Tentative wording; label changed to "Context" |
| taal | #legal | Legal parity: the 2026 Attorney General decision | Kept (an Attorney General decision), worded like Golan's item: "closed without an investigation" |
| balad | #issue-religion-and-state | Recency: all evidence was from 2018 and 2020 or an undated profile. Abu Shehadeh's 2021–22 bills and the 24th Knesset's marriage and Shabbat votes were checked; nothing found | Now "No documented position found." with the older material as dated background; closest-option line removed |
| balad | #issue-judea-samaria, #issue-haredi-enlistment, #issue-judicial-system, #issue-crime-in-arab-society, #other-citizenship-law | Recency and depth: the mapping leaned on 2020 bills; only two votes had been checked | Added from the official record: against sovereignty bills (34961, 37375), against the Judea and Samaria regulations (37279), against the January 2022 enlistment bill (36544), against an override bill (35062), against the weapons minimum-sentence bill (37100), against the 2022 Citizenship Law (37006). 2020 bills labelled dated background |
| balad | #overview | Tone: "claimed, without giving evidence" | "said …; the Times of Israel reported that he gave no evidence for this" |
| balad | #legal | Legal parity: detention (2023), party-funding case, 2026 ban | All kept as official acts. Added status lines ("released the same day; no investigation file or indictment found", "closed without charges") and that Zoabi is not a candidate |
| balad | #issue-haredi-enlistment | Rule 4 | Tentative wording |
| amcha-yisrael | #issue-gaza | Evidence standard: Channel 12 report resting on one unnamed former official, plus a rival's claim | Does not meet the standard. Kept only Winter's and the party's own on-record accounts of his October 2023 advice; the report's details and the rival's claim were removed |
| amcha-yisrael | #leadership, #coalition, #issue-religion-and-state | Evidence standard: Channel 14 report of candidates considering leaving (denied); an unnamed Likud official; a news site's comment on a candidate posting on Shabbat | Removed |
| amcha-yisrael | #legal | Legal: the 2024 Military Advocate's letter (a notice of rules, not a proceeding) and threats against Haddad (he is the victim) | Removed under rule 3. Kept: the 2018 Military Advocate General decision, the 2021 reprimand (official disciplinary act) and Haddad's indictment. Haddad's status rechecked 12 October: no report of the early-October hearing or of any outcome; still pending |
| amcha-yisrael | #issue-crime-in-arab-society, #issue-iran-and-regional-security, #issue-religion-and-state | Rule 4 | Tentative wording |
| amcha-yisrael, taal, balad | several | Tone: "claimed" used for these parties' own statements | Changed to "said"; one glossary slip in a paraphrase ("the occupation") attributed |

## Needs re-run

None. One limit to note: balad's chair's full 2019–2022 voting record was not reviewed; the votes on the ten issues that were checked are now cited.

## Unresolved or justified imbalances

- **the-democrats-party, signed union text.** meretz.md quotes the signed agreement (Meretz places in the top 4, 7, 12 and 16). meretz.org.il was unreachable on 12 October, so the signed text was not added to the-democrats-party.md, which gives the terms as announced (4, 8, 12, 16) and the February 2026 update. The two documents do not contradict each other, but they are not identical.
- **the-democrats-party and meretz, end of the 2021–22 government.** The Democrats' track record says ministers served "until the 25th Knesset began on November 15, 2022"; Meretz says "June 2021 to December 2022". Not changed; no source for the exact end date was opened.
- **raam and the-democrats-party versus meretz on coalition-line votes.** The same votes are a Contradiction for Meretz (its 2019 platform had the pledges), a Change over time for the Democrats (no earlier Labor platform opened) and plain Actions for Ra'am (no pledge found). The difference follows the evidence, as rule 2 requires.
- **amcha-yisrael has no Action claims.** Justified: the party was founded in August 2026 and has no Knesset or government record.
- **Hadash, Ta'al and Balad rely on a party weekly (Zo Haderech) for the Joint List's 2026 positions on Gaza and a Palestinian state.** Acceptable as the list's own statement, and labelled as such; no full joint platform has been published.
- **hadash still cites maki.org.il about 30 times.** Checked: each use is for a statement by the party or its MKs; votes and laws rest on Knesset records. Two items take surrounding event context from the party site (the Umm al-Hiran demolition and the dates of the 2026 Iran ceasefire and agreement).
- **Party-affiliated sources in balad** (Arab48, Al-Araby Al-Jadeed): used only for Balad's own statements.

## For the lead reviewer (cross-group questions)

1. **Unnamed-source reports.** This group's rule: such a report may be mentioned only as the trigger for an on-record response, with no detail taken from it as fact; otherwise it is removed. Please confirm one rule for all groups.
2. **Coalition-line votes of 2021–22.** The votes Meretz is marked on also bind the other coalition parties of that government (in other groups: yesh-atid, blue-and-white, new-hope, yisrael-beytenu, byachad-bennett). Vote IDs: 36094 (public housing), 36100 (child allowances), 36118 (disability allowance), 37100 (weapons minimum sentences), 37316 (disability transport), 37279 (Judea and Samaria regulations), 35027 (Citizenship Law extension).
3. **Meretz, July 2021 Citizenship Law.** Relabelled Contradiction (leader's reported statement on 1 July, vote on 5 July, compromise as explanation). If the lead prefers Change over time for a statement reported from a closed conversation, it is a one-word change.
4. **Legal scope decisions to apply everywhere:** court cases a leader filed himself are not listed; a ministerial order against a leader (Katz barring Golan from reserve duty) is listed as an administrative order; a Knesset expulsion motion is listed only for a current candidate; a detention without charges is listed with its status.
5. **Joint leaders' pledges** (for example the 8 September 2026 state-commission pledge by Golan, Eisenkot, Bennett and Liberman) are tagged Statement here. The partners' documents in other groups should use the same tier.
6. **Official tallies that differ from press figures** and may appear in other documents: death-penalty law final reading 62–48 with one abstention (45858; the Times of Israel has 62–47); Judicial Selection Committee law 65–47 at second reading (43643) and 67–1 at third (43884).
7. **Developments after the documents' research dates.** Cassif's conviction came on 8 October, one day after hadash.md was fact-checked. Other groups may need the same late check for their candidates. `research/ground-truth.md` and the registry are unaffected.
8. **CEC tally for Ra'am** (18–5, one abstention) is the same as the Joint List's; both are sourced, and raam.md was left as it was.
9. **Still pending before publication:** the Kariv file; Haddad's case; Cassif's sentence and any appeal; the 7 July 2026 first-reading vote, which has no per-MK record.

## Neutrality pass and poll-figure pass

A word-list pass (claims/claimed, loaded adjectives, glossary avoid-terms, poll and survey wording) was run over all seven documents after the edits, and each hit was read in context.

- **the-democrats-party:** remaining hits are attributed quotes ("draft evasion", "settler terror", "annexation") or the platform's own words. No poll figures.
- **meretz:** one unattributed motive reworded. "West Bank" appears only in quotes. No poll figures.
- **raam:** two unsourced-allegation items removed. "in the polls" appears once, in Abbas's own condition for joining a list, with no figure. No poll figures.
- **hadash:** one blame-assigning sentence from unnamed party sources removed; "far left" and "far-right" are attributed (IDI, Jabareen). No poll figures.
- **taal:** four unnamed-source items removed; "claimed" replaced. Quoted terms ("regime overhaul", "ethnic cleansing", "Palestinian citizens of Israel") are attributed to Tibi. No poll figures.
- **balad:** "claimed, without giving evidence" reworded; "the occupation" attributed. No poll figures.
- **amcha-yisrael:** three unnamed-source or gossip items removed; "claimed" replaced with "said". No poll figures.
