# Handoff: where the project stands and how to continue

Last updated 2026-10-07 (evening). Nothing is running. The 6 larger parties below were done in a cloud session on branch `claude/zealous-shannon-0bjyem` (pushed to `origin`); the owner merges it to `main`. Everything before that is on `main`.

This note is for the next orchestrating agent, which may be a Claude Code cloud session. Read it fully before starting. It records what earlier sessions decided that isn't obvious from the repository.

## 1. Where things stand

| Phase (from `tasks-israeli-election-party-matcher.md`) | Status |
|---|---|
| Phase 1: foundations and ground truth (1.1–1.7) | Done, audited, committed. The Vercel preview deploy is deliberately set aside by the owner. |
| Phase 2: website pages and flows (2.1–2.10) | Done, audited, committed. Site copy (2.9) approved by the owner. |
| Task 1.5: the 10 survey issues | Approved by the owner, locked (`824284b`). `surveyContentVersion` = `2026-10-06.1`. |
| **Phase 3: party research (3.1–3.5)** | **In progress.** See below. |
| Phase 4: load the real corpus and run the owner review (4.1) | Waits on Phase 3. Owner-gated. |
| Phase 5: D1 decision gate (5.1–5.2) | Waits on Phase 4. Owner-gated, and it spends API money, so agree a budget first. |

### Phase 3 progress

- **3.5 poll snapshot:** done, audited, committed (`4da942a`). All 38 lists recorded from CEC-filed polls. Log: `research/poll-snapshot.md`.
- **3.1 research and 3.2 fact-check:** done for **28 of 52 parties**, committed as WIP snapshots (`decb3f2` for the first 22; branch `claude/zealous-shannon-0bjyem` for the next 6), **not yet audited**. Each document was fact-checked by a different agent from its author. `limitedInfo` and `researchedAsOf` are set in the registry for these 28 (only `haredi-public` is `limitedInfo: true`).
  - Done: likud-party, new-hope, byachad-bennett, yesh-atid, yashar-leyisrael, yesodot-yisrael, yisrael-beytenu, shas, degel-hatorah, agudat-yisrael, the-democrats-party, raam, hadash, taal, balad, blue-and-white, jewish-national-front, national-union-tkuma, the-reservists, amcha-yisrael, haredi-public, israel-first.
  - Done 2026-10-07 (cloud session, Opus authors and Opus fact-checkers): meretz, eretz-yisrael-shelanu, zehut, atid-echad, chomat-torat-yisrael, new-economic-party. About 8,200–10,200 words and 53–81 sources each; all `limitedInfo: false`. **knesset.gov.il was geo-blocked from the cloud container**, so their 25th-Knesset votes rest on press reports; see §2a for the re-check list.
  - **Next: 24 small parties** (lists polled under 1%), researched with **Sonnet** by owner decision, fact-checked with **Opus**: lazuz, national-responsibility, ahi-movement, color-black, beit-yemini, tzomet, hakahal, together-we-will-succeed, tekuma, sharshar, ihud-bnei-habrit, pirates, gan-eden, womens-voice, just-law, shema, new-order, you-and-me, brit-olam, hatikun, bible-bloc, betach, orot-hashachar, demokratura.
- **3.3 consistency review, 3.4 Hebrew editions and parity check, and the Phase 3 audits:** not started.

Key files:
- **Agent briefs:** `research/pipeline/agent-briefs/stage-2-brief.md` (research) and `stage-3-brief.md` (fact-check). These hold the owner's quality bar and everything learned so far. Give each agent the brief plus its party ID.
- **Pipeline instructions:** `research/pipeline/README.md` plus one file per stage (Stages 2–6).
- **Issues (locked):** `content/issues/*.json`, `content/glossary.json`.
- **Registry:** `content/registry/lists.json` (38 lists) and `content/registry/parties.json` (52 parties). Recheck against the CEC's final publication of 18 Oct (Task 4.1). Sources in `research/ground-truth.md`.
- **Legal:** `research/legal-findings.md`. Poll blackout from 2026-10-23T12:00+03:00.
- **Corpora:** the site uses the placeholder corpus by default (`CONTENT_CORPUS`). Real research is in `content/research/{en,he}/`. Validate the real corpus with `CONTENT_CORPUS=real pnpm validate:content`; until Phase 3 is complete, the only expected errors are `research-missing`.

## 2. How to run the next step (6 larger parties)

1. For each of the 6 parties, spawn **one Stage 2 research agent** (`model: opus`) with `research/pipeline/agent-briefs/stage-2-brief.md` and the party ID. Run about 3–6 agents at a time.
2. When a document lands, read the author's report. If the document is thin for the party's size (the 22 done so far are about 6,000–11,000 words with 45–110 sources) or missed available Knesset votes, send it back to the **same** author to deepen it.
3. Then spawn a **different** agent (`model: opus`) as the Stage 3 fact-checker, with `research/pipeline/agent-briefs/stage-3-brief.md`, the party ID, and the author's open points (unverified claims, weak sources, doubtful contradictions or legal items).
4. When the fact-check is done, set `limitedInfo` (from the log header) and `researchedAsOf` (from the document frontmatter) for that party in `content/registry/parties.json`. Change nothing else in that file.
5. Run `CONTENT_CORPUS=real pnpm validate:content`. Only `research-missing` errors may remain.
6. Commit with a message naming the phase (e.g. "WIP Phase 3: research and fact-check for 6 more parties"), ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never change git config; the repo-local identity is deliberately non-identifying. In a cloud session, work on the session's own branch; the owner merges to `main`.
7. Stop there and report to the owner. Don't start the small parties, the consistency review or the Hebrew editions without the owner's go-ahead.

Rules that always apply:
- **The agent that wrote a document never checks it.** Fact-check, consistency review and parity check are each done by different agents.
- **Quality bar:** research is the most important part of the product; don't shorten it for efficiency. Facts and actions over campaign messaging. Every claim cited to a source actually opened. No poll figures in research text. Israeli-neutral glossary terms. Plain language. Full details are in the briefs.

## 2a. Re-check against Knesset records (from the 6-party cloud run)

**Done on 2026-10-07** from a local machine, by a separate agent, for eretz-yisrael-shelanu, atid-echad, chomat-torat-yisrael and meretz. Each fact-check log ends with a "Knesset record check (2026-10-07)" table. Almost everything matched; the corrections are in the documents. Left for Stage 4: (1) atid-echad calls the 10 May 2021 votes preliminary-stage votes, but the official record says "to committee for preparation for second and third reading"; (2) the 6 July 2026 first reading of the Kallner October 7 bill (59–0) has no per-MK record in either Knesset service, so re-check later; (3) the 10 March 2022 Meretz reservation votes were not checked one by one. The original list follows for reference.

knesset.gov.il (main site, OData and the Votes API) returned a geo-block page ("temporarily inaccessible from your location") to both curl and WebFetch from the cloud container. Agents used:
- **Votes up to 2021:** the Open Knesset mirror of the Knesset's own tables (`https://production.oknesset.org/pipelines/data/votes/` — `view_vote_rslts_hdr_approved` headers and `vote_rslts_kmmbr_shadow` per-MK rows; codes 1 = for, 2 = against, 3 = abstain, confirmed against header tallies). These were counted from raw rows and need no re-check, but the official page can be spot-checked. Known header-vs-rows gap: the 12 March 2014 Haredi draft law final reading shows 63–1 in the header and 65 for in the rows (noted in zehut and atid-echad).
- **25th Knesset (2023–2026) and government votes:** reputable press reports only. **These need a per-MK check from a machine that can reach knesset.gov.il** (with `www`, via `Votes/GetVoteDetails/{voteId}` or OData), then a wording fix where the record differs. Government (cabinet) votes have no Knesset record; leave them as press-sourced.

Lists per party:
- **eretz-yisrael-shelanu** (Wasserlauf, Kroizer): table "Votes checked only against press reports" in `research/fact-check/eretz-yisrael-shelanu.md` (17 items). Also cross-check against `research/fact-check/jewish-national-front.md`, which cites per-MK records for votes 44580 (sovereignty preliminary reading), 45858 (death-penalty law) and 42370 (2025 budget first reading, December 2024) that this document leaves out; the two documents should agree. The reasonableness-amendment vote (24 July 2023) is tagged "Action (inferred)".
- **atid-echad** (Strock): table "Votes checked only against press reports" in `research/fact-check/atid-echad.md`. Key item: Basic Law: Torah Study (June/July 2026), where Strock's vote for it rests on a Jerusalem Post report that six of seven Religious Zionism MKs backed it.
- **chomat-torat-yisrael** (Porush): Basic Law: Torah Study final reading (13 July 2026, 63–52); law suspending arrests of yeshiva students (mid-July 2026, 58–54); attorney-general law final reading (15 July 2026, 61–51); Kallner October 7 inquiry bill first reading (6 July 2026, 59–0); daycare subsidies preliminary reading (27 May 2026, 44–37); Maoz sovereignty bill preliminary reading (22 October 2025, 25–24); Agudat Yisrael's announced vote against the Arrangements Law (9 February 2026). The document says Porush's personal vote was not checked for each, and lists them in `#information-availability`.
- **new-economic-party** (no MKs): the 31 January 2023 Constitution Committee transcript (Zelekha's remarks; now backed by an Arutz Sheva interview), his September 2007 State Control Committee appearance, and whether any of its candidates has been an MK since 2021.
- **zehut** and **meretz:** no 25th-Knesset votes are relied on (Zehut had no MKs; Meretz has had none since November 2022). All their votes are from the Open Knesset mirror. **Meretz exception:** its MKs served until November 2022, and the mirror may not cover its votes from mid-2021 to 2022; check any Meretz vote in that period against the official record too.

## 3. Notes for the consistency review (Stage 4) and for the owner

Collected from the Stage 2 and 3 reports so far.

**Stage 4 must:**
- **Apply the recency rule (owner decision, 2026-10-07)** to all documents: each "Closest option(s)" line rests on evidence from 2021 onwards and the current leadership; older history is dated background only (see `research/pipeline/stage-2-party-research.md`, section 3). The 28 documents written so far predate the rule and must be checked against it.
- **Re-verify vote tallies** in the documents fact-checked before the pagination pitfall was found: byachad-bennett, new-hope, agudat-yisrael, the-democrats-party, likud-party, yesh-atid, shas.
- **Keep shared facts identical** across partner documents:
  - likud-party and new-hope: the merger was dropped on 14 July 2026 in favour of a joint run; the High Court rejected Haskel's petition on 9 August 2026.
  - byachad-bennett and yesh-atid: the "Together" list plans.
  - the-reservists and yesodot-yisrael: the "Magen David" plan, co-authored before their September 2026 split.
  - hadash, taal and balad: Dr. Nahaya Wishahi (No. 10) is filed for Hadash; the CEC tally on barring the Joint List is reported as 15–8 (Jewish Chronicle) and as 18–5–1 (Srugim).
  - agudat-yisrael and chomat-torat-yisrael: Porush and Eichler evidence must not be double-counted without a caveat. chomat-torat-yisrael labels all Agudat Yisrael/UTJ-era evidence as such; it cites a Zman Yisrael profile (which says it used AI tools) for parts of Porush's biography.
  - zehut, atid-echad and national-union-tkuma: the 1 September 2026 joint-list deal ("technical", split expected after the election).
  - eretz-yisrael-shelanu and jewish-national-front: see §2a on the three per-MK votes.
  - new-economic-party and the-reservists: the 6 September 2026 joint run and Hendel's split from Tropper.
  - meretz and the-democrats-party: the 2024 union agreement (signed text: Meretz guaranteed places in the top 4, 7, 12 and 16; the 20 February 2026 update, reported by Ynet as places 6, 8 and 14, wasn't found in text).
- **Coalition-line votes:** meretz keeps three **Contradiction:** items for 2021–22 coalition-line votes against opposition bills that matched its 2019 platform; check other former coalition parties' coalition-line votes are labelled the same way.
- **"Shelf" parties** (eretz-yisrael-shelanu, atid-echad, chomat-torat-yisrael): all set `limitedInfo: false` because their candidates have substantial records; each document says the evidence is the candidates', taken in other parties. Check the wording is consistent across the three and with haredi-public (`true`).
- **Glossary:** zehut quotes the party's own "expulsion"/emigration slogan, attributed; check against the glossary's avoided "transfer" and other documents' handling.
- **Apply one rule across parties** for "Contradiction" versus "Change over time", including past actions against current positions years apart, and for tentative "Closest option" lines resting on indirect evidence.
- **Check legal-section parity:** for example the Goldknopf labour-court settlement (agudat-yisrael), foreign sanctions on Smotrich (national-union-tkuma) and the ICC warrant (likud-party).
- **Decide whether the Gaza contradiction in likud-party stays**; the fact-checker found it the weakest of the four.
- **Re-run live Knesset queries** for yesodot-yisrael sources [35]–[37], [52], [53] and [72], which were checked from saved copies while the Knesset service was blocked.
- **Recheck pending statuses before publication:** the Kariv file (the-democrats-party) and the outcome of Haddad's early-October hearing (amcha-yisrael).

**For the owner (decisions):**
- 15 small lists are recorded as "polled 0.0%" because a single Channel 16 poll named every list individually. The owner may prefer "not polled" for these, which would be a change to the Stage 6 rule.
- The locked Haredi-enlistment issue text doesn't mention Security Service Law Amendment 28 (14 July 2026), which froze arrests of yeshiva students until 30 November 2026. Changing it would be an issue change, which only the owner can decide.

**For Task 4.1 (registry recheck):**
- The Shas list name in `lists.json` differs from the CEC PDF ("שומרי תורה … מרן הרב").
- Recheck the appeal over Dror Amos (Shas).
- Ta'al's candidates: Ahmad Darawshe, and Samir Bin Said's move to Hadash.

## 4. How the owner wants to work

- **Talk in chat, one decision at a time, with a recommendation.** The owner reviews in chat and doesn't want to edit docs.
- **Never start long jobs on your own.** If the owner says they're going offline, don't start anything new. If they ask to pause, stop agents at a safe point, commit the work as a WIP commit, and update this note.
- **Restate what you need.** The owner may not see earlier messages, so ask again in your current message.
- **Keep it short.** Summarise, and point only to the parts that matter.
- **The operator stays anonymous.** No owner name anywhere: not on the site, in metadata, in commits or in content. There is no contact channel by owner decision.
- **The working name** "Party Matcher" / "התאמת מפלגות" stays for now.
- **The matching backend is deliberately undecided until D1** (Phase 5). Don't build it. Recorded owner requirements for any option: an answer-normalization step before matching, and recency (parties are judged on current positions and leadership; evidence from 2021 onwards outweighs older evidence). See the plan, Decisions §1.

## 5. Operational quirks

- **Usage limits:** running many Opus agents at once used up the account's session limit three times. When that happens every running agent stops. Resume each one with `SendMessage` to its ID; it continues from where it stopped, with its context intact. Running fewer agents at once (3–6) costs less per limit hit.
- **Knesset data:** use `https://www.knesset.gov.il/...` **with `www`**; without it the service returns HTTP 474. Throttle requests. See the briefs. **From cloud containers knesset.gov.il is geo-blocked** (redirect to `maintenance-page-geo`), for curl and WebFetch alike; use the Open Knesset mirror (up to 2021) and press reports, and record what needs a re-check (§2a). Run Knesset-heavy work locally if possible.
- **Shared scratchpad:** parallel agents overwrote each other's downloads once. Tell each agent to use a scratchpad subfolder named after its party.
- **Network (cloud sessions):** the research needs `knesset.gov.il`, `gov.il`, `bechirot.gov.il` and Hebrew and English news sites. Set the cloud environment's network access to Unrestricted, or allow those domains.
- **Sub-agent results sometimes reach the orchestrator instead of the agent that spawned them.** Forward them with `SendMessage`.
- **Kill test servers before stopping or pausing.** Playwright and `next start` processes can be left running. `pnpm test:e2e` takes several minutes and rebuilds with `APP_ENV=test`.
