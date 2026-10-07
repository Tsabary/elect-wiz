# Fact-check: zehut

- Document checked: content/research/en/zehut.md (researchedAsOf 2026-10-07)
- Checked by: Stage 3 agent (not the Stage 2 author) on 2026-10-07
- Claims checked: 205 · Corrected: 32 · Removed: 2 · Sources replaced: 0 (1 source added: [69] IDI explainer on the 2014 Government Law amendment)
- Limited-information flag: false (Zehut publishes a detailed 2026 platform: online overview, summary page, summary PDF and topic pages; its leader has a 19th-Knesset voting record of 1,072 plenum votes in open data, a documented 2019 campaign and extensive 2025–2026 Hebrew coverage. Gaps: the party itself never held seats, the full 188-page platform needs registration, and some 2019 positions survive only in press quotations). The orchestrator should set `limitedInfo: false` and `researchedAsOf: 2026-10-07` in the registry. #information-availability does not start with "**Limited information.**".

Method: all 68 cited URLs were downloaded with curl (browser user agent) into a scratch directory and read as text; PDFs (CEC list copy [1], platform summary [30]) were converted with pdftotext. Every quotation from the Zehut site ([26]–[39]) was matched against the Hebrew page text. Votes [64, 65]: both Open Knesset CSVs were downloaded in full (header file 6.1 MB; per-MK file 85 MB, 1,275,825 rows per its datapackage.json) and every vote in the document was re-counted from the raw rows with a script. knesset.gov.il, gov.il CEC archive pages and web.archive.org were not reachable from this environment.

**Vote data checks (orchestrator point 1).**
- Feiglin's Open Knesset `kmmbr_id` is 000023556 (name in data: משה זלמן פייגלין, Knesset 19). Confirmed.
- Result codes: datapackage.json defines `vote_result` only as an integer. Counting codes 1/2/3 per vote reproduces the header's `total_for`/`total_against`/`total_abstain` exactly for 2,520 of the 2,556 19th-Knesset votes that have per-MK rows, so 1 = for, 2 = against, 3 = abstain is confirmed. One Feiglin row has code 4 (vote 21101, Municipalities Ordinance amendment), as the document says.
- Totals: the header holds 2,557 19th-Knesset votes (2,556 with per-MK rows); Feiglin has 1,072 rows: 713 for, 351 against, 7 abstain, 1 other. Confirmed. He is recorded on 114 of the 159 no-confidence votes and voted against all 114. Confirmed.
- Faction: 880 of his rows are under "הליכוד ביתנו" and 192 under "הליכוד". The document's "all were cast as a member of the Likud–Yisrael Beytenu faction" was wrong and was corrected.
- Item by item (vote id: header tally / per-MK rows / Feiglin):
  - Abolish conscription, 12.6.2013 (18973): 13–60 / 13–60 / for; only Likud Beytenu MK for; others for: Shas 3, UTJ 5, Hadash 3, Ra'am–Ta'al 1. Confirmed.
  - Security Service Law Amendment 19, 12.3.2014: second reading (20591) 66–1 / 66–1 / for; final reading (20592) header 63–1 but rows 65–1 / for. JTA [66] reports 65–1. Document wording adjusted to cite JTA.
  - Concentration Law final, 9.12.2013 (19913): 72–0–1 / same / for. Confirmed.
  - Zero VAT on basic food, 8.5.2013 (18762): 24–40 / same / for; only Likud Beytenu MK for (added).
  - Zero VAT first-time buyers, 7.7.2014 (21071, government bill, first reading): 31–18–1 / same / for. Confirmed; matches Globes [68].
  - Security-prisoner reciprocity, 10.7.2013 (19172): 9–53 / same / for; only Likud Beytenu MK for; other for votes all Shas (8). Confirmed.
  - Government Law Amendment 9 first reading, 28.7.2014 (21244): 27–10–1 / same / for (faction recorded as Likud). Final reading 29.7.2014 (21320) 35–8–1, no Feiglin row. Confirmed.
  - Sovereignty motion, 28.5.2014 (20838): 7–1 / same / for. Confirmed.
  - Women on Judicial Selection Committee, 17.12.2013 (20002): 10–1 / same / the only vote against. Confirmed.
  - Basic Law: Preserving the Status Quo, 19.6.2013 (19001): 9–48 / same / against. Confirmed.
  - City-rabbi conversions, 6.11.2013 (19732): 45–16 / same / for. Confirmed.
  - Medical cannabis (Dangerous Drugs Ordinance), 19.6.2013 (18999): 19–48–2 / same / for; only Likud Beytenu MK for; other for votes from Shas, Meretz, Balad, Labor, Hadash and UTJ (so "with Haredi or Arab parties" was inaccurate for this vote; corrected).
  - Basic Law: Equality of the Arab Population, 26.6.2013 (19048): 34–58 / same / against. Confirmed.
  - Bedouin settlement (Prawer) bill first reading, 24.6.2013 (19025): 43–40 / same / against. Confirmed.
  - Budget 2013–2014 first reading, 18.6.2013 (18986): 58–44 / same / for. Confirmed.
  - The mirror has no plenum votes dated 11 or 13 March 2014, confirming the gap on the Governance Law and the referendum law.

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|
| #overview (founding) | "Feiglin's political activity began in 1993, when he and Shmuel Sackett founded Zo Artzeinu" | Sources say his public activity began in the 1990s; 1993 is the founding of Zo Artzeinu | Reworded; added [38] | [38], [41] |
| #overview (founding) | "The party's own materials date the founding of Zehut to 2015 [38, 41]" | [41] is a press report (ice), not party material | Reworded to "party's own materials, and later press reports" | [38], [41] |
| #overview (April 2019) | "did not pass the 3.25% electoral threshold [10]" | CEC results page [10] does not state the threshold | Re-cited: failure to pass from [10, 18]; 3.25% from JTA [66] | [10], [18], [66] |
| #overview (Sept 2019) | Likud promised "to cover the party's debt of about NIS 3 million" | JNS reports this; Srugim [17] reports the agreement had no commitment on debts | Attributed to JNS and added Srugim's contrary report | [16], [17] |
| #overview (Sept 2019) | Alper, Molad and Mines "left after the deal and backed a rival list" | Srugim says Molad had already quit before the lists closed; the rival list was Yamina (Bennett and Shaked) | Reworded | [17] |
| #overview (2020–2022) | "In July 2022 Feiglin announced that he would run in the Likud primary and called on his supporters to join the Likud" | Maariv says he joined the Likud and called on supporters to join after the 2019 failure; the July 2022 news was the primary run | Reworded | [18] |
| #overview (2026) | "On September 1, 2026 Zehut signed a joint-run agreement" | Ynetnews says the parties "reached an agreement" | "reached" | [4] |
| #overview (current seats) | "No current Zehut candidate appears among the members of the 25th Knesset [1, 63]" | Rests on Wikipedia; scope unclear | Reworded to say what was checked (CEC list names against a published Wikipedia member list, Knesset site unreachable); seat claim now cites CEC results [10–14]. Checked: no Zehut candidate's name appears in [63] (the only "Hasson" is Akram Hasson) | [1], [10]–[14], [63] |
| #overview (Zehut candidates) | "Places below 11 come from the party slots beyond those named in the agreement and are reported as unlikely to be elected [4]" | Ynetnews says places 8, 10 and 11 were "considered unlikely to win seats"; it says nothing about places below 11 | Replaced with what Ynet reported | [4] |
| #overview (splitting) | "Zehut and National Union–Tkuma have not run together before" | Uncited | Added CEC results and the 2019 withdrawal as sources | [10]–[15] |
| #leadership (conviction) | "six months' imprisonment converted to community service" | Sources say "עבודות שירות" (community service work); no court document found | Reworded, marked as press reports | [41], [42] |
| #leadership, #other-temple-mount | "initiated the first Knesset plenary debate on Israeli sovereignty on the Temple Mount" | "First" is Feiglin's own description in the source | Attributed to Feiglin | [50] |
| #leadership | "rejoined the Likud in 2022" | See [18] | "then joined the Likud and ran in its 2022 primary" | [18] |
| #leadership | Grandson "killed in the Gaza Strip in 2024" | Supported; [52] adds "in Rafah" | Added "in Rafah" | [44], [52] |
| #leadership (other candidates) | Sima Hasson / "Hasson Simon" | Srugim lists Zehut's first eight in order, with Sima Hasson sixth; Zehut's sixth slot on the CEC list is place 15, filed as "חסון סימון" | Reworded to state the order correspondence while not asserting identity | [1], [36], [54] |
| #issue-cost-of-living | "while not obstructing businesses that grow by competing" | Summary says the state "will not hinder entrepreneurs from advancing" | Reworded | [29] |
| #issue-cost-of-living | Zero-VAT food vote | Data also show he was the only Likud Beytenu MK voting for | Added | [64], [65] |
| #issue-gaza | "The full platform says…" | [28] is the online overview, not the 188-page platform | "The party's online overview of the platform says" | [28] |
| #issue-gaza | Feiglin "criticised what he called handing security to the Americans under the US-led arrangement" | "under the US-led arrangement" is not in the source | Replaced with his words, placing security "in American hands" | [25] |
| #issue-gaza | Government Law Amendment 9 "restricts the release of prisoners for diplomatic or security reasons [64, 65]" | Vote data do not describe the law's content | Described from an IDI explainer (added as [69]) | [69] |
| #issue-haredi-enlistment | Final-reading discrepancy note (header 63–1, rows 65 for) | JTA gives 65–1 | Note now cites JTA alongside the mirror figures | [64]–[66] |
| #issue-religion-and-state | 2019 Rabbinate/marriage platform "according to a 2019 report quoting the platform"; minimarkets law inside the same Formal-commitment bullet | Single secondary source (Hidabroot, a Haredi outlet critical of Feiglin); minimarkets item is a Facebook statement, not platform | Attributed to Hidabroot with quotes matched to its text; minimarkets item split into a Statement bullet | [47] |
| #issue-religion-and-state (closest) | "plan to end the Rabbinate's monopoly" | Glossary avoids "rabbinic monopoly" as a neutral description; 2019 plan not restated in 2026 | Attributed ("what it called"); noted not restated in 2026 summary | [29], [47] |
| #other-lgbt-and-family | "Formal commitment (2019): Abolishing state marriage registration would, in Feiglin's words at the time, also allow LGBT couples to marry" | The LGBT inference is Hidabroot's; Feiglin's quoted words were "This voice too has a place in Zehut"; it is not platform text | Retiered to Statement and reworded | [47] |
| #other-cannabis | 2019 "full, regulated legalisation" | Sources say legalisation; "regulated" not supported | Removed "regulated" | [41], [46] |
| #other-idf | Generals "who denied the idea of victory" should leave the system | Source: no trust in generals who denied victory; "anyone who smelled Wexner needs to leave the system" | Quoted accurately | [25] |
| #track-record | "All were cast as a member of the Likud–Yisrael Beytenu faction" | 192 of 1,072 rows are under faction "Likud" | Corrected with counts; added how result codes were confirmed | [64], [65] |
| #track-record | "the only member of his faction to vote with Haredi or Arab parties (conscription, cannabis, prisoner reciprocity)" | Cannabis "for" votes also came from Labor and Meretz; zero-VAT food was a fourth case | Rewritten with the actual factions for each vote | [64], [65] |
| #track-record (Temple Mount) | "the debate was declarative only" | Source framing | Attributed to Ynetnews | [50] |
| #coalition | "September 6, 2026: After the joint-run agreement Feiglin said…" | Interview with Makor Rishon on the evening before, reported by Srugim on September 6 | Reworded | [7] |
| #legal (emblem ruling) | "On September 7, 2026 … the official state emblem, which the Elections (Propaganda Methods) Law treats as a public asset" | Date is the report date; the law bars use of public assets, and case law treats the emblem as one | Reworded; added petitioner and section 2A | [53] |
| #legal (disqualification) | "Status: rejected; no further proceedings against the list were reported [3]" | [3] only says the request was rejected; individual-candidate part not covered | Reworded to state what the sources show (list approved 27.9) and what they do not | [2], [3], [55], [57] |

Also adjusted: the Gaza "every child in Gaza is the enemy" quote is now attributed as The Yeshiva World's English rendering; legal wording "reversed"/"moral turpitude" aligned with the INN text ("changed that decision", "moral stain").

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|
| #issue-housing | "The bill did not complete its passage in that Knesset [68]." | The cited Globes article (8 July 2014) reports only the first reading; nothing about the bill's later fate |
| #legal | "A September 2026 indictment of a Bar-Ilan University lecturer, reported in the press, names Feiglin only as someone the accused allegedly tried to recruit and pressure…" | No citation; a substantive claim about a criminal case with no source in the document |

Moved (not removed): the 2008 UK exclusion was taken out of the Legal section and placed under Leadership, still citing [43]. Decision: a foreign government's immigration exclusion is not an official proceeding in the rule's sense (no investigation, indictment, conviction, court ruling, Israeli AG/State Attorney decision, Comptroller finding or Ethics Committee decision). It is a verifiable official act reported by Ynetnews, so it stays as background, labelled as an immigration decision of a foreign government.

## Legal section verification
- **1997 sedition conviction.** Conviction for sedition and publishing seditious statements: INN 2005 [42] (reporting the High Court hearing) and ice 2026 [41]. Sentence (six months served as community service work) rests on press reports only; no court record was reachable (the gov.il archive of 2003 CEC announcements returned 403 / Cloudflare block). Wording now says so. Status "sentence served" rests on [42] ("seven years since he completed his sentence").
- **2003 CEC disqualification and 2005 High Court hearing.** Cheshin's disqualification, Turkel's reversal, the AG's petition, the five-justice panel under President Barak and the deferral: all in INN [42], reputable reporting of official acts. Current status: moot (the seven-year period ended in 2005), as stated.
- **CEC chair's emblem ruling (2026).** Srugim [53]: Deputy President Sohlberg, as CEC chair, accepted the petition of Adv. Yaron Meiri, ordered the TikTok image removed in its current form and NIS 5,000 costs to the petitioner, under section 2A of the Elections (Propaganda Methods) Law. This is a quasi-judicial ruling by the CEC chair (a Supreme Court justice), so it is kept as an official ruling.
- **Disqualification request (2026).** Filing (15.9, Zulat with Ya'alon, German, Bar-Lev, Raday, Ben Zeev, section 7A): Srugim [55]. Hearing dates 23–24.9: Srugim reporting the CEC announcement [57]. Rejection of the request against the Religious Zionism–Zehut list: Ynet [3]; matches `research/ground-truth.md` (refs [21], [8]). The approved list name containing Feiglin's name: Ynet [2], [3]. The JPost report on the 4.10 High Court ruling (ground-truth ref [11]) was opened; it concerns only Otzma Yehudit and does not mention this list.
- **Nothing else found.** The "what was checked" paragraph is kept; the uncited Bar-Ilan sentence was removed.

## Joint-list and split-history verification
- List name "הציונות הדתית בראשות בצלאל סמוטריץ׳ וזהות בראשות משה פייגלין", ballot letter ט, CEC approval on 27.9.2026: Ynet [2], [3]; matches `content/registry/lists.json` (`religious-zionism-zehut`, `ballotLetters: "ט"`) and `research/ground-truth.md` row 31.
- Submitting parties National Union–Tkuma, Zehut – Israeli Jewish Movement, Atid Echad – A Good Future for Israel: CEC page copy (IDI) [1], publication date 08.09.2026; matches registry `memberPartyIds`.
- Top five (Smotrich, Feiglin, Strock, Rothman, Mor) and every candidate's sponsoring party, read from the [1] layout row by row: Zehut places 2, 8, 10, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 32, 33, 34. Confirmed. Place 15 is "חסון סימון"; the Zehut site [36] and Srugim [54] give "סימה חסון" as Zehut's sixth candidate, which corresponds to place 15 in CEC order. Identity is not asserted (see Corrections).
- Agreement reached 1.9.2026, Feiglin's places 2, 8, 10, 11, "strictly technical", split after the election and separate coalition negotiations: Ynetnews [4]; Srugim [7] repeats places 8, 10, 11. Feiglin's own "technical bloc … after the elections each one goes his own way": Maariv [6].
- Religious Zionism central committee approval on Sunday 6.9.2026: INN [5] (published 7.9 03:46, "Sunday evening").
- Ben-Ari alliance announced 6.5.2026: Ynet [20]; dissolved per Channel 14 report via JFeed 31.8.2026 [22]. Confirmed.
- Split history: Zehut never ran with National Union–Tkuma (CEC results [10]–[14]); June 2019 refusal to join Peretz/Smotrich: Srugim [23]. Confirmed.

## Notes for the consistency review
- **"Change over time" labels (point 6).** Netanyahu ("must go" Jan 2025 → will recommend Sept 2026) is statement versus statement, with Feiglin's explanation: correctly labelled. Smotrich (2019 refusal → 2026 technical joint run) is a 2019 statement and a 2026 action seven years apart, which the party explains as a temporary technical bloc. This is better read as a change over time than as an action contradicting a current position, so the label is kept. Army service (2019 volunteer army → 2026 one-month compulsory training) and cannabis (2019 legalisation → 2026 "sensible regulation") are platform versus platform: correctly labelled; no explanation found. The Haredi-enlistment "mixed record" (2013 vote to abolish conscription, 2014 vote for the law with sanctions) involves two actions that predate Zehut's platforms, so it is not a `**Contradiction:**`; the plain-language "Mixed record" note is kept. No new contradiction was found.
- **Weak sources (point 4).** The 2019 Rabbinate and marriage items still rest only on Hidabroot [47]; the 2019 English platform could not be retrieved (web.archive.org rate-limited or blocked). The May 2025 Gaza quote still rests on The Yeshiva World [52]; searches in Hebrew and English found no mainstream Israeli outlet with the full quote (only foreign aggregators). The wording now matches YWN exactly and is attributed to it.
- **Platform scope (point 5).** Every Formal-commitment quotation was matched to the overview [28], summary [29]/PDF [30] or topic pages [27], [31]–[35]; none relies on the unread 188-page document. The document's own caveat about this is accurate.
- **Gaza wording.** The party's own slogan "כיבוש, גירוש, התיישבות" is translated as "conquest, expulsion, settlement". The glossary lists "transfer" (not "expulsion") under `avoid`. Here "expulsion" is the party's own word, quoted and attributed, so it was kept; the reviewer may want to check consistency with other parties' documents.
- **Hasson/Simon.** It is worth rechecking against the CEC's official list publication on 18.10.2026.
