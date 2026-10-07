# Fact-check: raam

- Document checked: content/research/en/raam.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 172 · Corrected: 44 · Removed: 4 · Sources replaced: 1 ([19], dead link). Source URLs for [25] and [48]–[55] rewritten to complete Knesset queries (same dataset). Sources removed: old [73]–[75], cited only in removed legal items. Source added: [78]. The list is renumbered, has no gaps, and every source is cited.
- Limited-information flag: false. Ra'am has a long Knesset record (votes, bills, about 40 no-confidence motions from 2023 to 2026), a 2021–2022 coalition record with a signed agreement, and heavy Hebrew and English coverage. The gaps are a missing published 2026 platform and no stated position on Iran and Hezbollah. The #information-availability section does not start with "Limited information."

I opened every cited URL. Pages that served to curl were text-extracted and read in full: Israel Hayom [9], N12/Mako [27, 28, 58, 61], Walla [17, 37], Maariv, Kipa, Srugim, Emess, INN, JPost, Ynet/Ynetnews, Haaretz [12, 63] (only the lead was readable), and the CEC PDF [1]. The Reshumot PDF [56] was text-extracted. Times of Israel, Zman Yisrael [40, 65], Davar [69] and The New Arab [80→77] blocked curl, so I read them with WebFetch and asked for exact quotes. [19] (ToI) returns 404 and web.archive.org is unreachable, so I replaced it with Israel National News, which carries the same quote.

**Knesset vote re-verification (orchestrator's pagination check).** The original vote sources [48]–[54] used `KNS_PlenumVote?$expand=VoteResults`. That expansion stops at 100 rows, so any vote with more than 100 MKs recorded was undercounted and could have left out Ra'am MKs. I re-queried every quoted vote (44 vote IDs) through `KNS_PlenumVoteResult` and read every page. Several tallies were wrong, and some per-MK records changed. All are corrected below. The source URLs now point to `KNS_PlenumVoteResult` and say the results are paged. [25] (`KNS_PersonToPosition`) was also cut off at 100 rows. Its 25th-Knesset committee claims (Abbas on Constitution and wiretap/spyware panels; Alhwashla on National Security, State Control, Negev and Galilee; Khatib-Yassin on Finance and Status of Women) are confirmed by per-person queries.

Spot-check requested by the orchestrator: Security Service Law (Amendment 28 – temporary provision), vote 46670 on 14 July 2026. It passed 58–54, and all five Ra'am MKs (Abbas, Taha, Alhwashla, Khatib-Yassin, Hujirat) voted against. This is confirmed, and Reshumot [56] confirms the law's content, dates and "in recognition of the importance of Torah study".

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview | Ballot letters עם cited to [1] | The CEC page [1] lists candidates but not ballot letters | Added Ynet's report of the CEC's 27.09.2026 letter allocation | [78] (new) |
| #overview, #issue-religion-and-state | "Abbas said … the party will not support legislation that conflicts with Islamic law" (Formal commitment) | [13] attributes this to Yahya Dahamsha, head of the political department, and [13] is an analysis piece | Re-attributed to Dahamsha and downgraded to Statement | [13] |
| #overview | "Unlike other Arab-majority parties, Ra'am has said … willing to join with either side" | Comparison with other parties (Stage 2 rule), and not the source's wording | Reworded to [76]'s wording: does not rule out partners on the left or right | [76] |
| #overview | 2021: "running alone for the first time in that cycle" | Unclear. [31] says it ran independently after leaving the Joint List | Reworded and added [26] | [31], [26] |
| #overview | Choosing Life Forum: "organization of bereaved families" | ToI: "organization representing terror victims" | Corrected. The three 7A grounds are now cited to [6], and [2] is added: the CEC barred Ra'am on all three | [5], [6], [2] |
| #overview | AG "said the evidence was insufficient" | Paraphrase | Quoted the AG's actual words ("demonstrate that…", "very thin") | [5] |
| #leadership | "CEC list, submitted on 7–8 September" | 7.9 and 8.9 are the CEC page's publication and update dates. Submission was 7 Sept | Corrected | [6], [1] |
| #leadership | "first-ever primary … in which about 1,050 members voted" | [15]: 1,050 members attended. [11]: Abbas says Ra'am held internal elections before | Reworded and attributed "first-ever primary" to the party | [15], [14], [11] |
| #leadership | Segalovitz deputy minister "June 2021 to November 2022" | Knesset records run to 29 Dec 2022 | Corrected to December 2022 | [25] |
| #leadership | Segalovitz "keeps freedom of action", cited to [19, 21] | [19] is dead. [21] and [17] support faction membership without party membership. "Go my own way" comes from [22] | Re-cited | [21], [17], [22] |
| #leadership | Alhwashla "from the Negev" (no source) | Uncited | Cited [13] (Bedouin community in southern Israel) | [13] |
| #issue-crime-in-arab-society | Abbas argued the Shin Bet "might as well 'protect Arabs as well'" | This argument is lawyer Shakib Ali's in [41], not Abbas's | Removed the misattributed quote. Kept what [41] says about Abbas | [41] |
| #issue-crime-in-arab-society | June 2023: demanded a cabinet decision "with resources and personnel" | "Personnel" is not in the source | Quoted the source | [42] |
| #issue-crime-in-arab-society | Sept 2023: Abbas "said Arab citizens trust the IDF and the Shin Bet more than the police" | This was a survey released at the conference, not Abbas's words (and it is survey data) | Removed. Added what Abbas did say (national enforcement should take responsibility) | [43] |
| #issue-crime-in-arab-society | July 2026 Shin Bet budget transfer tagged "Statement" | A government decision, not a Ra'am statement | Retagged as "Context" | [44], [45] |
| #issue-crime-in-arab-society | Segalovitz "proposes mandatory civilian service for young Arab men" | Source: he hopes "a transition year and two years of civilian service" help with youth crime. [21]: it should not be imposed | Corrected and quoted. "Focus areas" changed to his phrase "focus places" | [22], [21] |
| #issue-crime-in-arab-society | 2022 killings 108 (Zman) | Other sources give 116 (Abraham Initiatives, cited by JTA) | Added the alternative figure, attributed | [40], [23] |
| #issue-crime-in-arab-society | **Contradiction:** Shin Bet 2021 vs 2023 | Both sides are statements, made two years apart in different roles (coalition vs opposition). This is a change of stated position, not an action contradicting a statement | Relabelled "Change of stated position". It states plainly that both are statements and that no related vote or action was found | [41], [42] |
| #issue-gaza | Abbas explained that the terror label "could be read as endorsing harm to civilians" | The Davar quote concerns saying Hamas "must be destroyed" | Quoted the actual explanation | [69] |
| #issue-haredi-enlistment | 17 Jan 2022 bill "defeated 49–51" | Full paged results: 54–54 tie (first page showed only 100 rows) | Corrected | [49] |
| #issue-haredi-enlistment | (added) | Ynet [57] reports that Ra'am opposes any enlistment law requiring Arab youth to serve in the IDF or do civilian service | Added to the existing Statement | [57] |
| #issue-housing, #track-record | Government undertook "to amend the Kaminitz Law within 120 days" [34] | [34] has no Kaminitz/120-day clause. [34] gives the enforcement freeze and the review of fines. ToI [33] says the deal covered amending Kaminitz | Reworded and re-cited | [34], [33] |
| #issue-judea-samaria | "Formal commitment: Ra'am supports a Palestinian state" [79→76] | A news outlet's description, not a platform or official decision | Downgraded to Statement | [76] |
| #issue-judicial-system | Feb 2023 judicial selection first reading "passed 61–39" | Paged results: 63–47 | Corrected | [48] |
| #issue-judicial-system | July 2023 reasonableness first reading "passed 56–44" | Paged results: 64–56 | Corrected | [48] |
| #issue-judicial-system | 27 Mar 2025 "law changing the judicial selection committee … Abbas present, passed 64–0" | 64–0 is the accompanying Courts Law (Amendment 105). The Basic Law: The Judiciary amendment that changed the committee passed 67–1, with Alhwashla present not voting | Gave both votes correctly | [48] |
| #issue-judicial-system | AG split preliminary reading "59–41" | Paged results: 61–46 | Corrected | [48] |
| #issue-october-7-inquiry | 24 Dec 2025 coalition commission bill "53–46" | Paged results: 53–48 | Corrected | [50] |
| #issue-october-7-inquiry, #track-record | "voted for every state commission of inquiry bill" | On one of the 12 Nov 2025 bills two Ra'am MKs were present without voting | Added the nuance. Track record now reads "the opposition's … bills" | [50] |
| #issue-religion-and-state | Basic Law: Torah Study "passed 55–45", Ra'am "three of five" | Paged results: 63–52. Four Ra'am MKs voted against (Hujirat was missed on page 1) | Corrected | [53] |
| #issue-cost-of-living | "All Ra'am MKs voted against the state budgets for 2025 and 2026" | 2025 budget (24 Mar 2025): four against, Khatib-Yassin not recorded | Corrected | [54] |
| #other-death-penalty | Passed "58–41" | Paged results: 62–48. All five Ra'am MKs against (confirmed) | Corrected | [52] |
| #other-women | "bills protecting pregnant workers and women facing dismissal" | Bill names and summaries in [72] don't support this description | Described the two enacted laws by what [72] shows | [72] |
| #other-jewish-arab-partnership | Abbas quote "We need to create partnerships and see the other as a human being…" [19] | [19] is dead. The exact wording in INN is "To create change, you need to see the other person as a human being, not as an enemy" | Replaced the source and quoted exactly, dated 31 Aug 2026 | [19] (replaced) |
| #other-jewish-arab-partnership | Otzma's "request cited an August 2026 statement" | [7]: Otzma's statement says it earlier called for disqualification over that remark | Reworded. Added Abbas's August 2026 clarification that he accepts Israel is a Jewish state as a matter of reality | [7], [13] |
| #coalition | May 2022 messages "contradicting Likud's denials" | One-sided. [78→75] also gives Kish's response | Named Kish and added his denial | [75] |
| #coalition | **Contradiction:** Sakhnin (Jan 2026) vs "off the table" (Aug 2026) | Verified: Ra'am signed [27] and runs alone [1, 30]. But Abbas framed the list as "completely technical" and conditional from Feb 2026 [28], and the other parties moved ahead after talks failed [30] | Kept the Contradiction (signed commitment vs separate list) and added the full sequence for fairness | [27], [28], [29], [30], [11], [1] |
| #track-record | Promised posts | [34] also lists a deputy minister post in the PMO. Abbas was a member, not chair, of the Arab Society committee | Corrected the row | [34], [25] |
| #issue-iran-and-regional-security | Search description | I searched again (Hebrew and English, including the Tamra strike). Still no statement found | Noted the second search | [77] |
| #sources [25], [48]–[55] | OData URLs | [25] and [48]–[54] were cut off at 100 rows. [55] left out motions cited in the text (30 Jun 2025 shelters, 25 May 2026 public-sector representation) | URLs now query `KNS_PlenumVoteResult` and are marked paged. [55] lists all 44 Ra'am motion votes found for 2023–2026 | [25], [48]–[55] |

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #legal | Police "examining" Abbas's 2018 Turkey conference attendance after MK Tzvi Fogel's complaint (July 2026) [old 75] | Consistency standard: a rival's complaint plus a police "examination", with no investigation opened, is not an official act. The police said explicitly that no position was implied. Nothing further was found |
| #legal | Registrar of Associations proceedings against Ra'am-linked nonprofits (2024–2025) [old 73, 74] | The proceedings concern associations, not leaders. No leader is personally named in an official finding. The section is about leaders |
| #issue-crime-in-arab-society | Abbas said Arab citizens trust the IDF and the Shin Bet more than the police [43] | These were survey results, not Abbas's words |
| #issue-crime-in-arab-society | "protect Arabs as well" attributed to Abbas [41] | It was Shakib Ali's argument (the claim was replaced with what the source says about Abbas) |

## Legal section verification
- Abbas / Turkey (July 2026): removed (see above). Emess [old 75] reports only "the matter is under examination". The police did not confirm an investigation, and no further step was found.
- Ra'am-linked nonprofits: removed (see above). JPost [6] notes the material was raised in the disqualification case. Ra'am says no officeholder was investigated.
- Disqualification case: kept. The CEC vote of 23 Sept 2026 (18–5) is in ToI [5]. The Supreme Court ruling of 2 Oct 2026 is in Ynet [2], JPost [3] and ToI [4]: unanimous, nine justices, list may run. Consistent with research/ground-truth.md. It is labelled as concerning the list, not criminal proceedings.
- The section now opens with the standard "No indictments, convictions or official inquiries…" line and lists what was checked.

## Joint-list and split-history verification
- Ra'am runs alone: memberPartyIds = [raam]. The CEC page [1] says the list was submitted by רשימת האיחוד הערבי alone. Ballot letters עם match the registry, ground-truth and Ynet [78]. The candidate order (Abbas, Segalovitz, Taha, Alhwashla, Khatib-Yassin, Hujirat 6, al-Turi 7, Masri 8, Azzam 9) matches [1] and lists.json.
- Split history checked against Knesset faction records [25] (paged): Ra'am–Balad faction 30.4.2019 to 2.6.2019. Joint List faction 3.10.2019 to 30.12.2019. Joint List 16.3.2020 to 28.1.2021. ToI [26]: House Committee approved the breakup on 28.1.2021, and Joint List leaders tied it to Abbas's moves toward Netanyahu. 2015 four-party list: [29], [6]. Ran alone in 2021 [31] and 2022 [29].
- 2026: Sakhnin signing on 22.1.2026 [27], Feb 2026 "completely technical" framing [28], May "technical" list [29], 10.6.2026 three parties proceed [30], 2.8.2026 "off the table" [11]. All verified.

## Notes for the consistency review
- The Shin Bet item was not kept as a Contradiction, because both sides are statements. A "Change of stated position" label is used instead. Other parties' documents may need the same treatment for consistency.
- Haaretz [12] is paywalled. Only the lead was readable, but it supports the cited claim (separation finalized, own political decisions and candidate selection).
- [13] (Milshtein, Ynetnews) is an analysis piece. It is used only for directly quoted statements by Abbas and Dahamsha.
- [38] is Labour Friends of Israel reporting a Ra'am statement. It is the only source for the May 2022 70 m² arrangement and is attributed as Ra'am's announcement.
- Killings data differ between sources (108 vs 116 in 2022). Both are now attributed.
- No published 2026 platform was found. Positions rest on votes, the 2021 agreement and statements.
