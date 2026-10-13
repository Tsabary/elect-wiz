# Handoff: where the project stands and how to continue

Last updated 2026-10-13. Nothing is running. The 28 larger parties are researched, fact-checked and consistency-reviewed; the 24 small parties will not be researched (cancelled); the Hebrew content is for the owner's cloud session (see section 0). `main` is pushed to the private GitHub repo `origin`; the current work is on the branch `deterministic-matching` (see section 0).

This note is for the next orchestrating agent, which may be a Claude Code cloud session. Read it fully before starting. It records what earlier sessions decided that isn't obvious from the repository.

## 0. Change of direction (2026-10-13): deterministic matching

Read this first. The sections below were written for the old direction and have been trimmed to match; where they still say anything different, this section wins.

- **The plan in force** is `plan-deterministic-matching.md` (PRD: `prd-deterministic-matching.md`), and the active task list is `tasks-deterministic-matching.md`. The work was done on the branch `deterministic-matching`.
- **Decided by the owner:** matching uses fixed rules with no AI at run time; users pick one preset option per issue (no free text, no "anything else"); only the 28 researched parties are matched, and the other 24 are listed with official details and a link to their own platform, not researched; the owner reviews no content (separate checking agents do), so the old decision gate D1 (which AI design to use) and Phase 5 are dropped; the result shows the top five with the rest behind "show all"; anonymous daily counts of surveys started and results are kept.
- **Done (everything in `tasks-deterministic-matching.md` except the Hebrew content and the final check):** registry tiers and platform links for the listed parties; matching content formats, validation, the scoring function, the self-match test and the voter-profile test, all running in the build; party positions and option-distance grids for all 10 issues; 16 voter profiles (all pass); English result texts and "also worth knowing" points for all 28 parties, each checked by a separate agent; the website (pick-one survey, matching in the browser, result page with the top five and "show all", listed-only party pages, ballot slips, "start over", the anonymous tally endpoint, rewritten site copy approved by the owner on 2026-10-13); rebuilt end-to-end and accessibility suites; and the switch to the real corpus. Logs are in `research/review/matching/` and `research/review/`.
- **The site runs on the real corpus and works in English.** `content/versions.json` has `"hebrewContent": "pending"`, so the Hebrew site shows the party content in English under a notice until the Hebrew content lands.
- **Next: the Hebrew content, in the owner's cloud session.** `research/HEBREW-SESSION.md` is the runbook: the two jobs (Hebrew research editions and Hebrew result texts for the 28 parties), the rules, and how to finish.
  - **Progress (2026-10-13):** 14 parties have both Hebrew files written and parity-checked: the-reservists, haredi-public, taal, balad, degel-hatorah, agudat-yisrael, national-union-tkuma, amcha-yisrael, raam, shas, eretz-yisrael-shelanu, blue-and-white, yesh-atid and jewish-national-front. 4 more have a checked Hebrew research edition but no Hebrew result texts yet: yisrael-beytenu, hadash, israel-first and new-economic-party. 2 have an unchecked research draft parked in `research/pending-he/` (atid-echad, byachad-bennett; see its README). Not started: chomat-torat-yisrael, likud-party, yashar-leyisrael, zehut, the-democrats-party, yesodot-yisrael, meretz, new-hope (the session paused for token budget). Sonnet writes and Opus checks. Logs: `research/review/parity-check.md` and `research/review/matching/texts-he-<partyId>.md`; English questioned: `research/review/hebrew-english-questioned.md`; agent instructions used: see the session's briefs summarised in those logs. `hebrewContent` stays `"pending"` until all 28 are done.
- **After that:** Task 5.2, the pre-launch check of the whole site in both languages. The owner also creates the counter store (below) and publishes the site; hosting is the owner's own area.
- **Registry recheck (Task 4.3):** see `research/review/registry-recheck-2026-10-13.md` for the early recheck; the election committee's final publication was expected on 18 October 2026.
- **Rules settled while writing the texts** (all in code, config or the logs): the "partly agrees" cut-off is 0.45; an option a party isn't linked to reads "position unclear" when the party's own position is only tentative; an option the research says a party rejected is recorded as `ruledOut` on its positions row, always reads "disagrees" and scores at most 0.4 (see `research/review/matching/ruled-out-options.md`); result texts write dates day first and give each person's name and role at first mention.

### Counter store (for the anonymous counts)

The site counts, per day, surveys started and results shown, and per party how often it was the top match and a runner-up (task 2.6; `lib/tally/`, `POST /api/tally`). Until a store is connected the route accepts the calls and counts nothing, so this is needed only before launch (task 5.2).

- **What to create:** one Upstash Redis database (the free tier is enough), for example through the Vercel Marketplace.
- **The two settings the site reads** (server side only; set them as deployment secrets): `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, with the REST URL and the standard (read-write) REST token from the database's page. Connecting the database through Vercel may add them under these same names.
- **Reading the counts:** in the Upstash console's data browser. Each day is one hash named `tally:<YYYY-MM-DD>` (the date in Israel), with the fields `started`, `results`, `top:<partyId>` and `runner-up:<partyId>`. The counts are approximate: the endpoint is public and each count is of calls, not of people.

## 1. Where things stand

| Phase (from `tasks-israeli-election-party-matcher.md`) | Status |
|---|---|
| Phase 1: foundations and ground truth (1.1–1.7) | Done, audited, committed. The Vercel preview deploy is deliberately set aside by the owner. |
| Phase 2: website pages and flows (2.1–2.10) | Done, audited, committed. Site copy (2.9) approved by the owner. |
| Task 1.5: the 10 survey issues | Approved by the owner, locked (`824284b`). `surveyContentVersion` = `2026-10-06.1`. |
| Phase 3: party research (3.1–3.5) | Done for the 28 researched parties (3.4, the Hebrew editions, is for the owner's cloud session). Cancelled for the other 24. |
| Phase 4: real corpus and owner review (4.1) | Owner review dropped. Registry recheck and corpus switch continue as Tasks 4.3 and 5.1 of `tasks-deterministic-matching.md`. |
| Phase 5: D1 decision gate (5.1–5.2) | Cancelled. Matching is deterministic; there is no D1. |

The active task list is `tasks-deterministic-matching.md`. The old list and plan carry notes pointing to it.

### Phase 3 progress (28 parties)

- **3.5 poll snapshot:** done, audited, committed (`4da942a`). All 38 lists recorded from CEC-filed polls. Log: `research/poll-snapshot.md`.
- **3.1 research and 3.2 fact-check:** done for **28 of 52 parties**, committed as WIP snapshots (`decb3f2` for the first 22; `3fd584d` for the next 6, done in a cloud session), **not yet audited**. Each document was fact-checked by a different agent from its author. `limitedInfo` and `researchedAsOf` are set in the registry for these 28 (only `haredi-public` is `limitedInfo: true`).
  - Done: likud-party, new-hope, byachad-bennett, yesh-atid, yashar-leyisrael, yesodot-yisrael, yisrael-beytenu, shas, degel-hatorah, agudat-yisrael, the-democrats-party, raam, hadash, taal, balad, blue-and-white, jewish-national-front, national-union-tkuma, the-reservists, amcha-yisrael, haredi-public, israel-first.
  - Done 2026-10-07 (cloud session, Opus authors and Opus fact-checkers): meretz, eretz-yisrael-shelanu, zehut, atid-echad, chomat-torat-yisrael, new-economic-party. About 8,200–10,200 words and 53–81 sources each; all `limitedInfo: false`. **knesset.gov.il was geo-blocked from the cloud container**, so their 25th-Knesset votes rest on press reports; see §2a for the re-check list.
  - **Cancelled (2026-10-13): the other 24 parties are not researched.** They are listed with official details and a link to their own platform (`tasks-deterministic-matching.md` Task 4.2). They are: lazuz, national-responsibility, ahi-movement, color-black, beit-yemini, tzomet, hakahal, together-we-will-succeed, tekuma, sharshar, ihud-bnei-habrit, pirates, gan-eden, womens-voice, just-law, shema, new-order, you-and-me, brit-olam, hatikun, bible-bloc, betach, orot-hashachar, demokratura. Do not start Stage 2 or Stage 3 for them.
- **3.3 consistency review (Stage 4), for the 28 done parties: done and audited** (2026-10-12). Four group reviewers and a lead reviewer, none an author or fact-checker; three fix rounds; the final audit passed with one note. Log and rules: `research/review/consistency-review.md` (see "Rules decided"). Rulebook for reviewers: `research/pipeline/agent-briefs/stage-4-brief.md`. Group logs, metrics and digest: `research/review/consistency/`. With the 24 small parties cancelled, the review of the 28 is the whole of 3.3.
  - **Follow-ups done on 2026-10-12** (see "Follow-ups (2026-10-12)" in `research/review/consistency-review.md`): new-hope's targeted re-run for its 2021–22 term in government, fact-checked by a different agent; the signed December 2022 Likud–Religious Zionist Party agreement (clause 118) now cited directly; the signed Likud–Otzma Yehudit agreement read in full (no sovereignty clause, so the March 2023 vote stays Change over time for jewish-national-front and eretz-yisrael-shelanu); the Knesset Ethics Committee decisions of 12 May 2026 applied from the official texts to every sanctioned leader or named candidate; one-time status recheck of pending legal items, each dated "as of 12 October 2026". By owner decision the pages are then frozen: no further rechecks unless the owner asks.
  - **Still open:** (1) raam's 2021 platform was not found online, so its five 2021–22 coalition-line votes stay unlabelled; the remaining routes are the party itself or a library copy. (2) Pending in real life as of 12 October 2026: the Kariv file (the-democrats-party), Haddad's case (amcha-yisrael), Cassif's sentencing set for January 2027 (hadash). (3) Ethics Committee decisions published on dates other than 12 May 2026 were not searched. (4) new-hope is now the longest document (about 15,000 words) because its government record was researched more deeply than its peers'; deepening blue-and-white and yisrael-beytenu to match is the owner's call. (5) Owner to confirm: the new-hope Contradiction resting on Sa'ar's December 2020 statement that he would not sit under Lapid as prime minister.
- **3.4 Hebrew editions and parity check:** not started here; the owner does it in a cloud session (section 0). The owner does not review content, so separate checking agents do.

Key files:
- **Agent briefs:** `research/pipeline/agent-briefs/stage-2-brief.md` (research) and `stage-3-brief.md` (fact-check). These hold the owner's quality bar and everything learned so far. Give each agent the brief plus its party ID.
- **Pipeline instructions:** `research/pipeline/README.md` plus one file per stage (Stages 2–6).
- **Issues (locked):** `content/issues/*.json`, `content/glossary.json`.
- **Registry:** `content/registry/lists.json` (38 lists) and `content/registry/parties.json` (52 parties). Recheck against the CEC's final publication of 18 Oct (Task 4.3 of `tasks-deterministic-matching.md`). Sources in `research/ground-truth.md`.
- **Legal:** `research/legal-findings.md`. Poll blackout from 2026-10-23T12:00+03:00.
- **Corpora:** the site uses the **real** corpus by default since 2026-10-13 (`DEFAULT_ACTIVE_CORPUS` in `lib/content/config.ts`); unit and end-to-end tests select the placeholder corpus explicitly. `content/versions.json` carries `"hebrewContent": "pending"`: while it is set, missing Hebrew research documents and Hebrew result texts are not validation errors, and the Hebrew site shows the English party content under a short notice. **When the Hebrew content lands, set it to `"ready"` (or delete the field) and bump `researchVersion` and `matchingVersion`; no code change is needed.** Validate with `pnpm validate:content`.

## 2. The 24 small parties: cancelled

**Cancelled on 2026-10-13. Do not run this step.** The 24 small parties are not researched or fact-checked; they are listed with a link to their own platform. The Stage 2 and Stage 3 process that was used for the 28 parties stays in `research/pipeline/` for the Hebrew editions and any later audit.

Operational notes from that process that still apply to any research, fact-check or Hebrew work:
- **Knesset votes:** knesset.gov.il is geo-blocked from cloud containers. If the run is in the cloud, list any 2023–2026 Knesset votes for a local re-check (as in §2a).
- **Registry:** `limitedInfo` and `researchedAsOf` are set in `content/registry/parties.json` from the fact-check log header and the document frontmatter. Change nothing else in that file.
- **Commits:** name the phase in the message (e.g. "WIP Phase 3: ..."), ending with the `Co-Authored-By` line the session was given. Never change git config; the repo-local identity is deliberately non-identifying. In a cloud session, work on the session's own branch; the owner merges to `main`.

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

Collected from the Stage 2 and 3 reports. The Stage 4 review of the 28 documents is done (§1); these notes remain as the record, and apply to any later audit or to the Hebrew parity check.

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

**For the registry recheck (Task 4.3 of `tasks-deterministic-matching.md`):**
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
- **The matching backend is decided: fixed rules, no AI at run time** (section 0). The old D1 gate and its answer-normalization requirement are gone, because users pick preset options. Recency still holds: parties are judged on current positions and leadership, and evidence from 2021 onwards outweighs older evidence.

## 5. Operational quirks

- **Usage limits:** running many Opus agents at once used up the account's session limit three times. When that happens every running agent stops. Resume each one with `SendMessage` to its ID; it continues from where it stopped, with its context intact. Running fewer agents at once (3–6) costs less per limit hit.
- **Knesset data:** use `https://www.knesset.gov.il/...` **with `www`**; without it the service returns HTTP 474. Throttle requests. See the briefs. **From cloud containers knesset.gov.il is geo-blocked** (redirect to `maintenance-page-geo`), for curl and WebFetch alike; use the Open Knesset mirror (up to 2021) and press reports, and record what needs a re-check (§2a). Run Knesset-heavy work locally if possible.
- **Shared scratchpad:** parallel agents overwrote each other's downloads once. Tell each agent to use a scratchpad subfolder named after its party.
- **Network (cloud sessions):** the research needs `knesset.gov.il`, `gov.il`, `bechirot.gov.il` and Hebrew and English news sites. Set the cloud environment's network access to Unrestricted, or allow those domains.
- **Sub-agent results sometimes reach the orchestrator instead of the agent that spawned them.** Forward them with `SendMessage`.
- **Kill test servers before stopping or pausing.** Playwright and `next start` processes can be left running. `pnpm test:e2e` takes several minutes and rebuilds with `APP_ENV=test`.
