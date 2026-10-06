# Independent neutrality review — reviewer is a different agent from the drafter

Date: 2026-10-06. Covers PRD FR7 for the draft in `content/issues/*.json` (10 issues), `content/glossary.json`, and the drafter's notes (`research/review/issues-draft-notes.md`).

Method: I read every field of every issue in both languages against PRD FR2–FR5. I checked contested facts and party positions against these sources:
- ynetnews party questionnaires (West Bank, October 7 inquiry, Haredi draft)
- Times of Israel and CBS coverage (housing prices, the October 7 bill, the High Court postponement, the Shin Bet plan)
- Abraham Initiatives figures, the Library of Congress legal monitor (judicial selection law), and coverage of the September 2025 Palestinian-state recognitions

Sources are at the end. The originals are backed up in the session scratchpad. All edited JSON files parse (`node -e`).

**Totals: 40 findings. 27 applied, 13 not changed (with reasons).**

---

## 1. Summary verdict per issue

| Issue | Verdict | Main changes |
|---|---|---|
| `haredi-enlistment` | Good. Minor fixes to rationales. | Added the manpower argument to universal service. Made the "no compulsory service" option signable by Arab parties ("rights not conditional on service"). |
| `cost-of-living` | Good. One loaded contrast and one overlap. | "government control" became "government intervention". Options 1 and 3 no longer both claim "break up monopolies". |
| `housing` | Factual error fixed. | "Home prices have kept rising" was false for 2026 (CBS: prices fell about 1.5% year on year while rents rose). |
| `judicial-system` | moreInfo tilted slightly (only the government's moves were listed). Fixed. | Added the January 2024 strike-down of the reasonableness amendment and one sentence on how each side sees the changes. Added that the selection law takes effect with the next Knesset. |
| `october-7-inquiry` | Option 3 was not held by any party. Replaced. | New option `commission-chosen-by-neutral-mechanism` (Zehut, Amcha Yisrael). moreInfo made more precise. |
| `gaza` | Good. moreInfo left out one camp. | moreInfo now names all four positions. Hebrew "יקבע" became "יעגן". Emigration clause kept but scoped. |
| `judea-samaria` | The two-state option was not signable by Arab parties. Fixed. Added fairness aids within the PRD terminology. | Option 4 rationale now covers self-determination as well as a Jewish majority. moreInfo adds "also known as the West Bank" and "also referred to as annexation", plus the 2025 recognitions. Option 3 uses "strengthening the settlements", the centre-right opposition's own wording. |
| `religion-and-state` | moreInfo cited a majority-opinion survey (bandwagon effect). Fixed. | Replaced with neutral facts on marriage and Shabbat transport. Option 1 sharpened against the status quo. Fixed an ambiguous Hebrew word. |
| `crime-in-arab-society` | Figure not supported by sources. A key fact was missing. | Removed "about 15%". Added that the Shin Bet plan was funded by moving about NIS 500m from the five-year plan for Arab society. |
| `iran-and-regional-security` | Neutral. Matchability is weak. Facts move fast. | No text change. Re-verify before locking. |

---

## 2. Findings table

Abbreviations: EN = English, HE = Hebrew, opt = option.

| # | Issue / field | Lang | Original text (abridged) | Problem | Change applied / reason not changed |
|---|---|---|---|---|---|
| 1 | haredi / opt `universal-service-with-sanctions` | both | "…The burden of service should be shared equally." | Imbalance. The supporters' main 2024–26 argument (the IDF's manpower shortage) is missing, so the option reads as resentment only. | **Applied:** "…The IDF needs the manpower, and the burden should be shared equally." / "צה״ל זקוק לכוח האדם, והנטל צריך להתחלק באופן שווה." Trimmed elsewhere to keep it under about 285 characters. |
| 2 | haredi / opt `no-compulsory-service-for-objecting-communities` | both | "…equality should be built through investment and integration rather than sanctions." | Not fully signable by its main holders. The Joint List and Ra'am reject making rights conditional on service (ynetnews). | **Applied:** "…Forced enlistment would deepen divisions, and equal rights should not be conditional on service or enforced through sanctions." / "…וזכויות שוות אינן צריכות להיות מותנות בשירות או להיאכף באמצעות סנקציות." |
| 3 | haredi / opt `anchor-torah-study-exemption` | both | "Torah study is a core value that sustained the Jewish people" | Minor. The Haredi claim is that Torah study protects (including the security sense), not only that it sustains. | **Applied:** "…a core value that has protected the Jewish people…" / "…ששמר על העם היהודי והגן עליו…" |
| 4 | haredi / moreInfo | both | "but only a few thousand have enlisted" / "רק אלפים בודדים" | Possible tilt from "only". | **Not changed.** The gap is factual (79,000+ orders against about 2,100 enlistments), and Shas also acknowledges it. |
| 5 | haredi / missing positions | — | — | Checked for a professional or volunteer army option and for Shas's "the army must adapt" stance. | **Not changed.** ynetnews finds no party proposing a volunteer army. Shas's stance falls between opts 1 and 2, and users can edit options. |
| 6 | cost-of-living / opt `open-market-competition-imports` | both | "Competition, not government control, is what brings prices down" / "ולא שליטה ממשלתית" | Loaded contrast. It labels the regulation option "control". | **Applied:** "Competition, rather than government intervention, …" / "ולא מעורבות ממשלתית". This mirrors opt 3's own word. |
| 7 | cost-of-living / opt `active-state-regulation` | both | "price supervision on basic goods, tougher action against monopolies and large business groups…" | Overlap. Opt 1 already claims "break up concentration". | **Applied:** "price supervision on basic goods and essential services, stronger enforcement against excessive pricing by dominant companies, and higher taxes on excess profits…" (HE equivalent). |
| 8 | cost-of-living / missing position | — | — | The opposition's argument "cut sectoral and coalition funds" is not a separate option. | **Not changed.** It is partly covered by opt 2 (cut spending), it is a fiscal-priority argument rather than a cost-of-living mechanism, and options are capped at 4. |
| 9 | housing / moreInfo | both | "Home prices and rents in Israel have kept rising" | **Factual error.** CBS: home prices fell year on year in every 2026 reading (about −1.5%); rents rose. | **Applied:** "Home prices and rents in Israel are high relative to incomes; in 2026 rents kept rising while home prices dipped slightly." (HE equivalent.) |
| 10 | judicial / moreInfo | both | Listed the government's changes, the protests and the AG dismissal annulled by the Court | Tilt by fact selection. Only government actions were described as moves, and the right's main grievance was missing. No statement of how each side sees the changes. | **Applied:** added "Supporters say the changes restore the balance between the branches; opponents say they weaken the checks on government power." and "In January 2024 the Supreme Court struck down an amendment to a Basic Law that limited the reasonableness standard." (HE equivalent.) |
| 11 | judicial / moreInfo | both | "The Knesset passed a law changing the makeup of the Judicial Selection Committee" | Missing fact that matters to voters. The law takes effect when the next Knesset convenes (LoC, Aug 2026). | **Applied:** "…which takes effect when the next Knesset convenes". The year (2025) was also added. |
| 12 | judicial / options | — | 3 options | Possible missing 4th option ("keep the system, with targeted tweaks", e.g. Amcha Yisrael on reasonableness). | **Not changed.** The field does cluster into three, and Beyachad and Yashar! straddle opts 2 and 3. Left as an open question for the owner. |
| 13 | oct-7 / opt `broad-inquiry-after-fighting-ends` | both | "Investigate fully once the fighting on all fronts has ended… An inquiry in the middle of a war would harm the war effort." | **Missing / invented position.** ynetnews: "No party mentions… timing contingencies like 'after war ends'." The government's current line is "not before the election". | **Replaced** with new id `commission-chosen-by-neutral-mechanism`: "Establish a commission with full powers whose members are chosen in a way neither camp controls, such as retired judges elected by secret ballot in the Knesset, and examine the government, the security services and the legal system alike. Only such a body can win trust across the divide." (HE equivalent.) Held by Zehut ("neutral commission… investigating government, security agencies, judiciary") and Amcha Yisrael (secret ballot for retired judges). It is close to Religious Zionism's "national, independent" framing. |
| 14 | oct-7 / moreInfo | both | "Israeli law provides for a state commission…"; "the government asked the High Court not to rule before the election" | Imprecise. Under the law the government decides whether to establish the commission. The government said it would not set one up before the election and urged the Court not to intervene (ToI). | **Applied:** "Under Israeli law, the government decides whether to establish a state commission of inquiry, and its members are appointed by the President of the Supreme Court… the government told the High Court it would not set one up before the election, and the Court postponed its decision until after the election." (HE equivalent.) |
| 15 | oct-7 / opt `state-commission-under-existing-law` | EN | "Only a fully independent body…" | Uses the supporters' label "independent". | **Not changed.** It appears inside the option's own rationale, which the glossary and FR4 allow. The neutral text does not use it. |
| 16 | oct-7 / opt `commission-appointed-by-knesset-balance` | both | "with bereaved families involved" | Checked whether this is accurate. | **Not changed.** Verified: the Kallner bill provides for four overseers from bereaved families (ToI). |
| 17 | gaza / moreInfo | both | "Israelis are divided between resuming the fighting, keeping up military pressure and moving ahead with an international arrangement." / "הציבור בישראל חלוק בין…" | Omission. Names only 3 of the 4 options, leaving out the end-war and withdrawal position held by Arab citizens and the left (who are also "Israelis"). | **Applied:** "Positions range from resuming the fighting, through keeping up military pressure or moving ahead with an international arrangement, to ending the war and fully withdrawing." (HE equivalent.) |
| 18 | gaza / opt `advance-international-arrangement` | HE | "הסדר מדיני יקבע את ההישגים" | Equivalence. "יקבע" reads as "will determine", not "will lock in" (EN "secure"). | **Applied:** "יעגן". |
| 19 | gaza / opt `resume-fighting-full-control` | both | "while encouraging voluntary emigration" / "תוך עידוד הגירה מרצון" | Drafter's Q6. This is the most contested term, which critics call "transfer". | **Applied (scoping only):** "…the voluntary emigration of Gaza residents" / "…של תושבי הרצועה". The supporters' wording is kept because FR4 requires an option its holders would sign. It is also the official name of the Defense Ministry directorate approved in March 2025. It never appears in neutral text. Final call left to the owner. |
| 20 | gaza / missing position | — | — | Renewed Jewish settlement in Gaza (Otzma, Religious Zionism) is not mentioned. | **Not changed.** It is a subset of opt-1 holders, and adding it would push away opt-1 supporters who don't share it. Users can add it in free text. |
| 21 | judea-samaria / opt `separation-two-states` | both | "…Separation is needed to keep Israel Jewish and democratic and to end the conflict." | **Imbalance / not signable.** The only rationale was the Zionist left's. Ra'am and the Joint List, who also hold this option (two states), would not sign "keep Israel Jewish" as the sole reason. Borders and settlements were also not mentioned. | **Applied:** "Separate from the Palestinians through a negotiated two-state agreement that settles borders and settlements, within a regional arrangement with the US and Arab states. This will end the conflict, keep Israel democratic with a Jewish majority and give Palestinians self-determination." (HE equivalent.) Id kept because it is the same position. |
| 22 | judea-samaria / opt `maintain-current-situation` | both | "continue supporting the settlements" / "להמשיך לתמוך בהתיישבות" | Recognisability. Yashar!, Blue and White and Beyachad (no sovereignty now, no Palestinian state) say "strengthening settlement" (ynetnews). | **Applied:** "keep strengthening the settlements" / "להמשיך לחזק את ההתיישבות". |
| 23 | judea-samaria / moreInfo | both | No alternative names given | Fairness within the owner-required terms. Users who know the area as "the West Bank", or the policy as "annexation", should recognise the issue. Both terms are mainstream in Israeli media, especially in English. | **Applied:** "(an area also known as the West Bank)" / "(אזור המכונה גם הגדה המערבית)", and "(also referred to as annexation)" / "(המכונה גם סיפוח)". Each appears once, in moreInfo only. "Judea and Samaria", "settlements" and "applying sovereignty" stay the main terms everywhere. |
| 24 | judea-samaria / moreInfo | both | Facts: housing units, sovereignty bills, settlement-goods bans | Fact selection. Only one kind of international pressure was listed. The 2025 recognitions of a Palestinian state are context both camps cite. | **Applied:** "In September 2025 several Western countries, including the UK, France and Canada, recognized a Palestinian state." (HE equivalent.) |
| 25 | judea-samaria / title | EN | "Judea and Samaria and the Palestinians" | Equivalence. The HE says "the Palestinian issue". | **Applied:** "Judea and Samaria and the Palestinian issue". |
| 26 | judea-samaria / missing position | — | — | The Joint List: "evacuate all settlements immediately", framed as ending occupation. | **Not changed** beyond #21. Opt 4 now mentions "settles borders and settlements". The "occupation" framing stays out of the text (glossary), and users can edit options. |
| 27 | religion-state / moreInfo | both | "A July 2026 survey found that most non-Haredi Jews support some form of public transport on Shabbat, while most religious respondents oppose it." | Tilt (bandwagon). It is the only moreInfo in the set that cites which side has a majority. | **Applied:** "Marriages within Israel are conducted only through religious institutions, though marriages performed abroad are registered, and public transport largely does not run on Shabbat, with some local exceptions." (HE equivalent.) |
| 28 | religion-state / opt `strengthen-jewish-character` | both | "preserve Shabbat in the public sphere, keep marriage… under the Chief Rabbinate" | Overlap. "Preserve" and "keep" are status-quo verbs, so the option was hard to tell apart from opt 2. | **Applied:** "strengthen Shabbat observance in the public sphere" / "לחזק את שמירת השבת במרחב הציבורי". |
| 29 | religion-state / opt `separate-religion-and-state` | HE | "בחירות אישיות ודתיות צריכות להיות בידי כל אזרח" | Unnatural Hebrew. "בחירות" also reads as "elections". | **Applied:** "ההחלטות בענייני אישות ודת צריכות להיות בידי כל אזרח, לא בידי המדינה." |
| 30 | crime / moreInfo | both | "the toll in the first half of 2026 was about 15% higher" | Factual. Sources conflict: the Abraham Initiatives mid-year figure is 127 victims (+19%), while the draft relied on 144–147 (+15%). | **Applied:** "was higher than in the same period of 2025". The percentage was removed. |
| 31 | crime / moreInfo | both | "In July 2026 the government approved a plan to involve the Shin Bet…" | Missing a key fact. About NIS 497m was moved from the five-year plan (Res. 550). This is the core of the Arab parties' objection (opt 3) and the government's own funding choice. | **Applied:** "…funded largely by moving about NIS 500 million from the five-year plan for Arab society." (HE: "הממומנת ברובה בהעברת כ-500 מיליון ש״ח מתוכנית החומש לחברה הערבית".) |
| 32 | crime / title | both | "Crime in Arab society" / "הפשיעה בחברה הערבית" | Drafter's Q7: could the title stigmatise? | **Not changed.** It is the standard term used by Arab MKs, Arab civil society (Abraham Initiatives), government and media. The data is accurate. |
| 33 | crime / options | — | 3 options | Checked whether opts 2 and 3 can be told apart and whether a 4th is missing. | **Not changed.** They are distinct: opt 2 is policing plus civil plans with no stance on emergency tools; opt 3 is restored budgets under regular law. No 4th policy cluster found. |
| 34 | iran / whole issue | — | — | Drafter's Q1: weak matchability. Opts 1–3 differ in emphasis. | **Not changed.** The text is neutral, and security and foreign affairs is the top consideration. Raised for the owner (§5). |
| 35 | iran / moreInfo | both | "…US-Iran fighting continued into September 2026" | Fast-moving facts. Wikipedia: Iran ceasefire 8 Apr – 8 Jul 2026, then renewed fighting; Lebanon ceasefire 16 Apr, renewed 19 Jun. | **Not changed.** Consistent with sources as of today. Re-verify both this and the Gaza moreInfo immediately before locking. |
| 36 | glossary / `haredi` note | EN | "'Ultra-Orthodox'… seen by many Haredim as implying extremism" | Overstated. It sat in the same "avoid" list as slurs. | **Applied:** the note now says it is not a slur and is used by mainstream outlets, avoided for consistency only. |
| 37 | glossary / `judea-and-samaria` note | — | "Some Arab and left-wing parties reject the term; this is noted for the reviewer." | Needed a rule for the fairness aid in #23. | **Applied:** documents the one-time "also known as the West Bank" in moreInfo. |
| 38 | glossary / `sovereignty` note | — | "'annexation' is the term preferred by critics and international media" | Incomplete. "Annexation" is also mainstream in Israeli media. | **Applied:** note updated and documents #23. |
| 39 | glossary / `voluntary-emigration` note | — | "…the reviewer should check this choice." | Needed a resolution and justification. | **Applied:** notes that it is the official directorate name (March 2025), that it is scoped to Gaza residents, and that it is never used in neutral text. |
| 40 | glossary / `settlements` (HE) | HE | "יישובים / התיישבות", avoid "התנחלויות" | "יישובים" is slightly preferred by the right, and "התנחלויות" is common in mainstream media. | **Not changed.** "התיישבות" is used across the spectrum (including by Yashar! and the Democrats), and "יישובים ביהודה ושומרון" is standard in ynet and Kan. Acceptable under FR3. |

---

## 3. Missing-position analysis per issue

- **Haredi enlistment.** The four options cover all clusters in the ynetnews questionnaire:
  - Haredi parties: opt 1
  - Likud and the Bismuth outline: opt 2
  - Yashar!, Beyachad, Yisrael Beytenu, the Democrats and the Reservists: opt 3
  - Joint List and Ra'am: opt 4

  Otzma's "dedicated police and Border Police tracks" fits opt 2 or 3. No party proposes a volunteer army. Shas now says drafting is unavoidable but the army must adapt, which falls between opts 1 and 2. That is acceptable.
- **Cost of living.** Competition, tax cuts, regulation and direct support span the economic axis. Not separately covered: "redirect sectoral and coalition funds" (see #8). It is acceptable to leave it to free text.
- **Housing.** Supply, state rental, buyer support, and periphery with urban renewal map onto Likud and Yesh Atid, the Democrats, Beyachad, Yisrael Beytenu and Degel HaTorah, and Yesh Atid respectively. Not covered: taxing investors and additional apartments. This is a minor lever and partly overlaps opt 3.
- **Judicial system.** Three clusters: continue (Religious Zionism, and Likud by its actions), agreed framework (Yisrael Beytenu, partly Beyachad and Yashar!), repeal and entrench (the Democrats, Yesh Atid). A "targeted tweaks" 4th option is possible (#12).
- **October 7 inquiry.** The real field is: the state commission (nearly all the opposition, plus the Joint List with an expanded mandate), the government's Knesset bill (80 MKs or 3+3, with bereaved-family overseers), and a "neutral or national" commission (Zehut, Amcha Yisrael, Religious Zionism's rhetoric). The old opt 3 matched no party and has been replaced. The Joint List's call to widen the mandate to "occupation, blockade and rejection of peace" is not an option. It is a niche variant of opt 1, best left to free text.
- **Gaza.** The four options follow the Mitvim categories and the party clusters. Not covered: renewed settlement in Gaza (#20).
- **Judea and Samaria.** Clusters:
  - full sovereignty: Religious Zionism and Otzma
  - Area C or partial sovereignty: Yisrael Beytenu, and Beyachad as a future goal
  - no sovereignty and no state now, with settlement strengthened: Likud by its actions, Yashar!, Blue and White
  - separation and two states: the Democrats, Ra'am, the Joint List

  After #21 and #22, every cluster has an option its holders can sign. Not covered: one state with equal rights (fringe, not a major list position).
- **Religion and state.** The spectrum is strengthen, status quo, choice and local decisions, separation. Not covered: Muslim, Christian and Druze religious-court questions, which are not salient in campaign coverage.
- **Crime in Arab society.** Emergency tools (the government and the National Security Minister), policing plus civil plans (centre parties), and budgets with regular law (Arab parties). No further cluster found.
- **Iran and the region.** Hawkish to dovish, four steps. Among Jewish parties the real differences are in emphasis. Opt 4 is essentially the Arab parties' position. No major position is missing.

---

## 4. Comments on the set of 10 and on the glossary

**The set** is defensible. It tracks the IDI (Sep 2026), JPPI, i24 and youth surveys closely. Observations, not changes:
- **Weighting.** Four issues are security or war-related (Gaza, Iran, Judea and Samaria, October 7). This matches security being the top consideration, but it does weight the tool toward that axis. Users can mark up to 5 issues "doesn't matter", which mitigates this.
- **Arab voters.** One issue is specific to Arab voters (crime). Their second concern, the economy, is covered by `cost-of-living`. Equality, the Nation-State Law, and Arab–Jewish partnership in a coalition (important to Arab and Druze voters) are not issues. The drafter's reason (coalition stance belongs in the research pages) is reasonable. The owner may still want to consider it.
- **Iran.** `iran-and-regional-security` is the weakest at telling parties apart. If the owner wants a replacement, candidates are "Israel's international standing and relations with the US" or "Arab–Jewish equality and partnership". I do **not** recommend changing it without the owner, because it is the highest-ranked consideration.
- **No issue is clearly wrong**, so the set was not changed.

**The glossary** is careful and well balanced. Its choices are appropriate under FR3:
- Haredi
- applying sovereignty
- the October 7 attack and failures (rather than "massacre" and "the debacle")
- state commission of inquiry
- changes to the judicial system (rather than "reform", "overhaul" or "coup")
- Arab society

I adjusted four notes (#36–39) and documented the two "also known as" aids in the Judea and Samaria moreInfo.

---

## 5. Open questions for the owner (value calls)

1. **"Encouraging voluntary emigration" in Gaza opt 1.** I kept it, scoped to Gaza residents. Reasons: it is the holders' own wording, the official government directorate name, and only inside the option. Alternatives: drop the clause, so opt 1 is military only and holders add it in free text; or keep it as is. Dropping it makes opt 1 easier for Likud-leaning hawks to accept, but less faithful to Otzma and Religious Zionism.
2. **The "also known as the West Bank" and "also referred to as annexation" asides** in the Judea and Samaria moreInfo. They keep the PRD terms primary while making the issue recognisable to Arab, left and English-media users. Do you accept them, or should moreInfo use only PRD terms?
3. **October 7, new opt 3** (`commission-chosen-by-neutral-mechanism`). It is real (Zehut, Amcha Yisrael) but held by smaller lists. The alternative is a Joint List-style "state commission with a mandate widened to policy towards the Palestinians". Both are niche. The draft's "after the fighting" option had no holder at all.
4. **Judea and Samaria opt 4 rationale** now combines "democratic with a Jewish majority" with "Palestinian self-determination". Some Hadash and Ta'al voters may still object to the first clause, and some Zionist-left voters to the second. The options are editable. Is one combined option acceptable, or would you prefer to drop the rationale clauses?
5. **Judicial system: a 4th option?** ("Keep the current system with targeted tweaks.")
6. **Iran issue: keep or replace?** See §4.
7. **Housing and cost of living as two issues.** Merge them to free a slot (for example for Arab–Jewish equality)? The youth data supports keeping them separate.
8. **Before locking:** re-verify the Gaza and Iran moreInfo facts (finding #35, drafter's Q3).

---

## Sources checked by the reviewer

- ynetnews, "Annexation, settlements or separation: where Israel's parties stand on the West Bank": https://www.ynetnews.com/article/h1dpvu9cgl
- ynetnews, "State inquiry or 'national' panel? How Israel's parties want Oct. 7 investigated": https://www.ynetnews.com/article/r1sz8wyimx
- ynetnews, "Who should serve Israel? How parties propose solving the Haredi draft crisis": https://www.ynetnews.com/article/sjph72wyzx
- Times of Israel, housing snapshots Apr/Aug/Sep 2026: https://www.timesofisrael.com/housing-snapshot-april-2026-home-prices-continue-slide-bringing-yearly-drop-to-1-7/ , https://www.timesofisrael.com/housing-snapshot-august-2026-home-prices-fall-1-largest-drop-in-eight-years/ , https://www.timesofisrael.com/housing-snapshot-september-2026-prices-inch-upward-after-sharp-decline/
- Times of Israel, "Knesset advances controversial bill for politically appointed Oct. 7 probe in 1st reading": https://www.timesofisrael.com/knesset-passes-controversial-politically-appointed-oct-7-probe-in-1st-reading/
- Times of Israel, "High Court delays decision on October 7 state commission until after election": https://www.timesofisrael.com/high-court-delays-decision-on-october-7-state-commission-until-after-election/
- Times of Israel, "Security cabinet approves new directorate to enable 'voluntary' departure of Palestinians from Gaza": https://www.timesofisrael.com/liveblog_entry/security-cabinet-approves-new-directorate-to-enable-voluntary-departure-of-palestinians-from-gaza/
- Times of Israel, "Government okays Shin Bet to fight crime in Arab society": https://www.timesofisrael.com/government-okays-shin-bet-to-fight-crime-in-arab-society-sparking-rights-concerns/ ; ynetnews: https://www.ynetnews.com/article/skjwiylnfl
- Times of Israel, "Arab society marks deadliest year on record, with 252 murder victims in 2025": https://www.timesofisrael.com/arab-society-marks-deadliest-year-on-record-with-252-murder-victims-in-2025/
- ynetnews, "In historic 1st, Supreme Court strikes down Basic Law amendment": https://www.ynetnews.com/article/hkpqmkg00a
- Library of Congress, "Israel: Changes for Selection of Judges and Justices to Be Implemented in Next Knesset" (Aug 2026): https://www.loc.gov/item/global-legal-monitor/2026-08-14/israel-changes-for-selection-of-judges-and-justices-to-be-implemented-in-next-knesset
- NBC News, "U.K., Canada and Australia formally recognize a Palestinian state": https://www.nbcnews.com/world/middle-east/uk-canada-australia-formally-recognize-palestine-state-rcna232588
- Wikipedia, "2026 Iran war" / "2026 Lebanon war" (secondary, orientation only): https://en.wikipedia.org/wiki/2026_Iran_war , https://en.wikipedia.org/wiki/2026_Lebanon_war
