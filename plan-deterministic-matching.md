# Technical Plan: Deterministic matching and two party tiers

> Source PRD: `prd-deterministic-matching.md` (changes `prd-israeli-election-party-matcher.md`)

This plan replaces the "Phase 2" candidate designs, decision gate D1, Phase 4's owner review and Phase 5 in `plan-israeli-election-party-matcher.md`. Phase 1 of that plan (content formats, research pipeline, website, time modes) stays in force except where this plan says otherwise.

Dates that constrain the work: poll blackout starts 2026-10-23 12:00 (+03:00), election day is 2026-10-27, and the Central Elections Committee (CEC) publishes the final lists on 2026-10-18.

## Approach summary

Matching moves out of the server and into the browser as a pure scoring function over a small, pre-built, build-validated data set. The survey loses free text, so an answer is just an option ID. The score for a party on an issue is derived from two pieces of prepared content: which option(s) the party holds, and how close each option is to each other option on that issue. Results reuse the existing result view and its response shape, fed by the local function instead of `POST /api/match`, which is deleted together with the mock implementation. The only server call left is a tiny anonymous tally endpoint.

The party registry gains a tier marker. The 28 researched parties are matched; the 24 others get a short listed-only page with registry facts and a labelled link to the party's own platform.

The matching content (positions, option-distance grids, explanation texts, "also worth knowing" points) is produced offline by agents from the frozen English research, each piece checked by a different agent, and lands as JSON under `content/`. Build-blocking validation, a self-match test and a voter-profile test replace human content review. Hebrew research editions (Stage 5) are still required and run in parallel; they don't block the scoring work.

## Affected systems & components

### Survey (extending existing)
- **`lib/survey/state.ts`**: `AnswerDraft` shrinks to the selected option ID. `OWN_ANSWER`, `optionTexts`, `ownText`, `editOption`, `editOwn`, `optionText`, the `anything-else` step kind and all `anythingElse` state and helpers are removed. `finalAnswer`/`buildMatchRequest` become a builder for the new local matching input (see APIs). `SURVEY_SCHEMA_VERSION` goes from 1 to 2.
- **`lib/survey/storage.ts`**: `looksLikeState` drops the `anythingElse` check. A saved schema-1 state is already discarded on load by the existing version check, so in-progress surveys restart cleanly.
- **`components/survey/answers/answer-step.tsx`**: options become plain, non-editable radio cards. The textareas, the edited badge, the undo button and the write-your-own card are removed. The last answer screen's primary button submits ("see my result") instead of going to "anything else".
- **`components/survey/anything-else/`**: deleted.
- **`components/survey/survey-app.tsx`**: the phase machine keeps `survey → result`, with a short `loading` phase only if the matching data hasn't arrived yet and an `error` phase only for a failed data load or a version mismatch. `submitMatch` is replaced by the local matcher. The `?mockScenario=` affordance is removed.

### Matching (mostly new, replaces existing)
- **New `lib/matching/score.ts`** (name indicative): the pure scoring function. No Node-only APIs and no `server-only` import, because it runs in the browser and in Vitest and in the validation script.
- **New `lib/matching/data.ts`**: the typed shape of the matching bundle and the loader the browser uses to fetch it.
- **`lib/matching/contract.ts`**: request validation (`matchRequestSchema`, `validateMatchRequest`, body-size and timeout constants, `ANYTHING_ELSE_IMPORTANCE`) is removed. The response types stay and are trimmed (see APIs). `ERROR_CODES` shrinks to the two failures that can still happen.
- **Deleted:** `app/api/match/route.ts`, `lib/matching/handler.ts`, `lib/matching/client.ts`, `lib/matching/mock.ts`, `lib/matching/registry.ts`, `lib/matching/types.ts`, their tests, and the `MATCHING_IMPL` and `MOCK_DELAY_MS` settings.
- **Moved, because other files depend on them:** `partyMetadata` moves out of `handler.ts` into `lib/content/party-view.ts` (server side), since the survey page now builds it, and takes the parties and lists directly instead of the deleted `CorpusView` type. `errorInfo` and `errorMessageKey`, which `components/result/error-state.tsx` imports from `client.ts`, move into `contract.ts`.
- **`components/layout/preview-banner.tsx`**: it calls `selectImplementation()` to warn that results are simulated. With no mock left, that half of the banner and the `Preview.simulated` and `Preview.both` messages are removed; the "fictional corpus" warning stays.

### Result view (extending existing)
- **`components/result/result-entry.tsx`**: the `anythingElseNote` block is removed. A new "also worth knowing" block shows 2–3 points per recommended party, each linking to its `other-…` anchor on the research page. For runners-up it sits inside the existing collapsed details.
- **`components/result/result-view.tsx`**: the top five entries are shown as cards; a "show all" control reveals the remaining researched parties in order as compact rows, each expandable to its breakdown and points, with a line saying that parties close together are about equally near. `MAX_ENTRIES` in `contract.ts` no longer caps the result; share links and the tally still use the top four. Also a new one-line note that some lists on the ballot were not included in the matching, linking to the Parties page. It mentions no polls, so it stays up during the blackout.
- **`components/result/loading-state.tsx`** and **`error-state.tsx`**: kept, with reduced copy and codes.
- **Blackout flag:** `ResultEntryCard` takes `serverBlackout` from `result.meta.blackout`, and `PollContent` requires it. With that field gone from the result, the survey page passes the server's blackout state to the survey app together with the party metadata.

### Parties section (extending existing)
- **`lib/content/schemas.ts`** `partySchema`: new tier field and optional platform link (see Data model).
- **`app/[locale]/parties/[partyId]/page.tsx`**: today it returns 404 when a party has no research document. It gains a listed-only branch: name, list, ballot letters, leader, the list's top candidates (already in `lists.json`), joint-list label, the standard note, and the labelled platform link when one exists. No `PollInfo` and no research document on this branch.
- **`app/[locale]/parties/page.tsx`** and **`lib/content/party-view.ts`**: each entry shows which tier it is in; the intro and count copy are updated. Order stays alphabetical with both tiers mixed.
- **`app/[locale]/share/[parties]/page.tsx`**, its OG image and **`lib/share/params.ts`** callers: the set of accepted party IDs becomes the matched tier only, so a hand-made share link can't present a listed-only party as someone's match.

### Content validation (extending existing)
- **`lib/content/validate.ts`**, **`read-raw.ts`**, **`config.ts`**, **`loaders.ts`**, **`scripts/validate-content.ts`**: tier-aware research rules and the new matching-content rules (see Testing). `CORPUS_DIRS` gains a matching directory per corpus.
- **`content/placeholder/`**: the placeholder corpus gets its own small matching content and at least one listed-only party, so the site, unit tests and e2e suite keep working before the real corpus is switched on.

### Site copy (extending existing)
- **`messages/en.json`, `messages/he.json`**: `Answers` trimmed, `AnythingElse` removed, `Result` gains the new blocks, `Parties` and `Research` gain tier copy, `MatchErrors` trimmed, `Home.steps` reworded, `HowItWorks.sections.matching` rewritten (its post-D1 placeholder goes away) and `research` updated for the two tiers, `Privacy.sections.ai` and `abuse` removed, `answers`, `device` and `summary` reworded for on-device matching, `Preview` trimmed. `Privacy.sections.counts` is reworded to add the daily count of surveys started next to the result counts.
- **Rule for the copy pass:** every statement, in either language, that all parties are researched, that every party has a research page, or that a result takes time, must be corrected. So must any statement about who reviewed the content: `HowItWorks.sections.research` ends with "the final set was reviewed before publication", written for the owner review that is now dropped, and must describe the independent checks instead. Known instances beyond the keys above: `Home.neutralBody`, `HowItWorks.description`, `HowItWorks.sections.neutrality`, `HowItWorks.sections.polls` (a listed-only page shows no polling average), `Parties.description` and `Result.loadingBody`.
- **`app/[locale]/page.tsx`**: it hardcodes the four step keys including `anythingElse`; the list changes with the `Home.steps` messages.
- **`components/layout/prose-page.tsx`** and **`app/[locale]/how-it-works/page.tsx`**: unchanged in behaviour. The copy does not state how the researched lists were chosen (owner decision 2026-10-13, see Security), so the page needs no blackout handling.

### Research pipeline (new stages, offline)
- **`research/pipeline/`**: new stage instructions and agent briefs for the matching content (positions, grids, texts, points, Hebrew texts), following the existing rule that no agent checks its own work. Not deployed.

### Tally endpoint (new)
- **New `app/api/tally/route.ts`** and a small counter module: see APIs and Integrations.

### Project documents
- `research/NEXT-STEPS.md`, `tasks-israeli-election-party-matcher.md` and the original plan are updated to say what this plan cancels: research of the 24 small parties, the owner review in Task 4.1, and Phase 5.

## Data model & schema changes

All content is version-controlled JSON under `content/`. Nothing is stored per user.

1. **Party registry (`parties.json`, both corpora).** Each party gets a required tier, `researched` or `listed`. A `listed` party may carry one platform link (URL plus the date it was checked). `researchedAsOf` must be null for `listed` parties and set for `researched` ones; `limitedInfo` is meaningful only for `researched`. In the real corpus the 28 parties that have research documents become `researched` and the other 24 `listed`.
2. **Party positions, one file per issue** (`content/matching/positions/<issueId>.json`). One row per researched party. A row is either "unclear" or a list of held options, each with a level from a fixed vocabulary:
   - `main`: the party's position;
   - `either`: used for two or more options when the research says the evidence can't tell them apart (for example "`full-sovereignty` or `partial-sovereignty-area-c`; the evidence does not specify the scope");
   - `secondary`: an option the party also partly holds ("with elements of…", "evidence is mixed").
   Each row also records the research anchor it rests on and a one-line basis note for the reviewer. One file per issue matches PRD requirement 32: all parties are placed on an issue together.
3. **Option-distance grids, one per issue** (`content/matching/distances/<issueId>.json`). A closeness value from 0 to 1 for every unordered pair of that issue's options, symmetric, with 1 on the diagonal. Across the 10 issues there are 41 options and 67 pairs.
4. **Result texts, per language and party** (`content/matching/texts/{en,he}/<partyId>.json`). For each issue and each of that issue's options: one text of 1–2 neutral sentences written for a user who chose that option, saying how the party's documented position compares with it and citing its strongest evidence, with the anchor (`issue-<issueId>`). That is 41 texts per party, 1,148 per language. Where the party's position is unclear, one "position unclear" text serves all of that issue's options. Plus 2–3 "also worth knowing" points, each with text and an `other-…` anchor. The label shown to the user is always computed from the score. Each text also records the agreement level its author wrote it for, used only by validation to catch a text that no longer matches the computed label (see Testing).
5. **Scoring constants** (`content/matching/config.json`): the level values, the unclear value, the agreement-label cut-offs and the weak-match level. Kept as content so the profile test can tune them without a code change.
6. **Voter profiles** (`content/matching/profiles.json`): the invented voters for PRD requirement 40, each with ranking, answers and the expected outcome, written before scores are seen.
7. **`content/versions.json`**: new `matchingVersion`. It names the matching bundle for caching and is shown nowhere. `researchVersion` is finally set to a real value when the real corpus goes live.
8. **Browser storage:** schema version 2 of the saved survey (see Survey above). No migration; old saves are dropped.
9. **Tally counters** (external key-value store): per day, the number of surveys started, the number of results shown, and per party a top-match count and a runner-up count. "Surveys started" is the visitor figure the owner asked for (owner decision 2026-10-13); it counts starts, not unique people, because telling people apart would mean identifying them. No timestamps finer than the day, no identifiers, no answers.

## APIs & interfaces

1. **Removed: `POST /api/match`.** Breaking, but it has no consumer other than the site's own survey.
2. **Local matching function.** Input: the ranked issue IDs in order, and one option ID per ranked issue. "Doesn't matter" issues are simply absent. Output: the existing response shape, trimmed:
   - kept: the ordered entries, now all researched parties in score order (owner decision 2026-10-13: the result shows the top five in full and the rest behind a "show all" control), each with party ID, per-issue breakdown (`issueId`, `rank`, `weight`, `agreement`, `explanation`, `anchor`) and registry metadata; `weakMatch`; `meta`;
   - added per entry: the "also worth knowing" points;
   - removed: `anythingElseNote`, `noUsableAnswers`, and `meta.blackout` as a server-decided flag (the client already tracks the blackout through `PollContent`).
   - The numeric score stays internal and isn't shown, as today.
3. **Scoring rule.**
   - Issue score: for the user's option, take the best of the party's held options, each as (level value × closeness between that option and the user's option). An unclear row scores the fixed unclear value.
   - Weights: linear by rank (the top-ranked issue of n gets n, the last gets 1). The breakdown's `weight` field stays (n − rank + 1) / n, which is what the importance bar in `result-entry.tsx` draws today (top issue = full bar); dividing by the sum of weights happens only inside the score.
   - Rejected options (owner decision 2026-10-13): where the research records that a party explicitly rejected an option (it voted against it, or the research says it rules it out), the positions row lists that option as ruled out. The option then always carries the label `disagrees`, and its issue score is capped at a configured maximum (0.4, the top of the range that reads as disagreement), however close it is to the option the party holds. It is not set to zero, because the party still shares real ground with a voter who chose a neighbouring option.
   - Options held only in part (owner decision 2026-10-13): a held option can be marked as held in part, when the research shows the party backs one of the option's measures and not another. It then counts for a configured share of its level (0.7), so choosing it reads as partial agreement. It is used for one option only, the Shin Bet option on crime in Arab society, which bundles two separable measures; eight parties back the Shin Bet element but not holding suspects without trial.
   - Party score: weighted average of issue scores over the ranked issues.
   - Agreement label: from the issue score by two cut-offs (`agrees`, `partially`, `disagrees`); unclear rows get `party-position-unclear`. So does an option the party isn't linked to when every option the row holds is `secondary`, that is, when the party's position rests only on tentative evidence (owner decision 2026-10-13). This changes the label only, not the score.
   - Weak match: the top score is below the configured level.
4. **Tie-break (PRD requirement 37).** Equal scores are ordered by a hash of the user's answers combined with the party ID. The same answers always give the same order, and no party is systematically favoured, which a plain alphabetical rule would do for every tie.
5. **Matching bundle.** One JSON per language holding positions, grids, constants, and that language's texts and points for the researched parties, stamped with its `matchingVersion` and `surveyContentVersion`. It contains no poll data and no registry facts. The address always serves the current bundle; `matchingVersion` is only a cache-busting parameter, so a tab opened before a redeploy never asks for a file that no longer exists. Cached per version. The survey page starts fetching it when the user reaches the first answer screen, so the result normally appears with no wait.
6. **Party facts for results.** `app/[locale]/survey/page.tsx` (already revalidated every 5 minutes) passes the per-party metadata for researched parties to the survey app, built by the existing `partyMetadata` logic with the blackout already applied on the server. The client-side `PollContent` wrapper keeps hiding poll notes at the blackout instant for tabs opened earlier.
7. **Error codes.** `MatchErrorCode` shrinks to two: the bundle could not be loaded (network failure; action: retry), and the bundle's survey-content version differs from the survey's (action: restart). A newer `matchingVersion` than the page expected is not an error: the newer bundle is simply used. The election-over case is already handled by `useOnElectionOver`.
8. **New: `POST /api/tally`.** Two kinds of call, both fire-and-forget, where a failure is invisible to the user. "Survey started" has no other content and is sent once when a user begins a new survey (not when they resume a saved one). "Result" carries the result's party IDs in order; it accepts 3–4 distinct IDs that are all researched-tier parties and is sent once per result. Each increments the day's counters and returns no content. It rejects everything after the election closes.
9. **Share URLs:** shape unchanged; only the accepted ID set changes (see Affected systems).

## Integrations & external dependencies

- **New: a managed key-value store for tallies.** Upstash Redis through the Vercel Marketplace, the candidate already named in the original plan. Needs the owner to create the store and connect it; its credentials become deployment secrets. The owner reads the counters in the provider's console. No admin screen.
- **Dropped:** any AI provider, Cloudflare Turnstile, spending caps and the kill switch.
- **Config removed:** `MATCHING_IMPL`, `MOCK_DELAY_MS`. **Config kept:** `CONTENT_CORPUS`, the time-mode settings, `APP_ENV`.
- **Hosting:** handled by the owner and outside this plan. The plan only assumes the host runs the Next.js build and one small server route (the tally endpoint).
- **Next.js:** `AGENTS.md` requires reading the relevant guide in `node_modules/next/dist/docs/` before writing code against this Next.js version (16.3.8). This applies to the new route handler, the static bundle route and its cache headers.

## Security, privacy & compliance

- **Answers stay on the device.** No request ever carries them. The tally call carries only the result's party IDs. Privacy & Terms is rewritten to say exactly this, and the "AI provider" and "abuse protection" sections are removed.
- **Tally endpoint.** It is public and unauthenticated, so the counts can be inflated by a script. The counts are owner-only and approximate by nature, so the protection is light: strict body validation, a small body-size cap and no request logging. There is no per-IP rate limit, because it would mean keeping something derived from the visitor's address, which the privacy text (only anonymous daily counts are kept) rules out. Nothing about the visitor is stored.
- **Everything about scoring is public.** The bundle exposes every party's recorded position and every grid value to anyone who opens the browser tools. That is acceptable and consistent with the product's transparency; it also means the data must be defensible.
- **Poll blackout (research/legal-findings.md §3.1).**
  - The matching bundle and all result texts must contain no poll figures. The existing `poll-figure` validation rule is extended to the matching texts.
  - The listed-only note and the result's "not every list is matched" note mention no polls.
  - The site never states that the researched lists were those polling at 1% or more (owner decision 2026-10-13). That sentence is a poll result in qualitative form, and once published it would let the "official details only" label on a party be read as "polled below 1%" during the blackout. How this works says only that not every list was researched in depth and that the choice was made when the research was done. A unit test guards against the wording returning.
  - Share images already carry no poll data; unchanged.
- **External links on listed-only pages** open the party's own site. They are marked as external and unchecked, use `rel="noopener noreferrer"`, and must be `https` URLs taken from an official source.
- **Election propaganda (legal findings §3.5).** A listed-only page shows registry facts and a link, and reproduces no platform text, which keeps the "informational, neutral" footing.
- **Operator anonymity:** unchanged. The tally store must not expose the owner's identity publicly.

## Performance & scalability

- **Load:** the site becomes static pages plus one tiny counter call per result. A viral day costs nothing beyond hosting and counter increments.
- **Bundle size:** per language about 1,150 issue texts and 56–84 points, plus positions and grids. Estimated 400–600 KB raw for Hebrew, roughly 100–150 KB compressed. Loaded once in the background while the user answers, cached by version.
- **Scoring cost:** 28 parties × at most 10 issues per result. Instant.
- **Counters:** two to five increments per result, pipelined in one round trip. A counter failure never affects the user.

## Observability & error handling

- **Client:** a failed bundle load shows the existing error state with retry; a version mismatch shows it with restart. No other runtime failure paths exist in matching.
- **Server:** the tally route never logs bodies. Failures of the store are swallowed and counted in platform function logs by status only.
- **Build:** every content problem surfaces as a named validation rule that fails `pnpm build`, as today.
- **Idempotence:** a result is tallied once per completed survey. Refreshing starts a new survey by design, so a second result is a second tally. The counts are approximate and labelled as such for the owner.

## Testing strategy (high-level)

- **Unit (Vitest, run with `pnpm test`; not part of the build):** scoring for each level and the unclear value, the best-of-held-options rule, linear weights, agreement cut-offs, weak-match rule, tie-break determinism and absence of a fixed favourite, input rejection for unknown IDs; survey state after the removals, storage discarding schema-1 saves; tier-aware party views; share-ID filtering; tally body validation.
- **Content validation (build-blocking, PRD requirement 41), new rules:**
  - every researched party has a row in every issue's positions file, and no listed party does;
  - every option ID exists in that issue; levels come from the fixed vocabulary; `either` appears on at least two options of a row; a row has at most one `main`;
  - every grid covers every pair, is symmetric, within 0–1, with 1 on the diagonal;
  - every researched party has, in both languages, a text for every option of every issue (identical keys in both languages) and 2–3 points;
  - each text carries the agreement level its author intended, and that level must equal the one the scoring rule computes for that party, issue and option; a mismatch means either the text or the party's row is wrong;
  - every anchor exists in that party's research document in that language, and point anchors are `other-…` anchors;
  - an issue marked unclear in positions matches "No documented position found" in the research, and the reverse;
  - no poll figures in any matching text;
  - tier rules: `researched` parties need both research documents, `listed` parties must have none.
- **Where the gates run.** The repo has no CI; the gate is `pnpm build`, which runs `scripts/validate-content.ts` before `next build`. The new rules follow the existing split in `validate.ts`: rules about a single file (schema, known option IDs, grid shape, anchors, no poll figures) run on both corpora, so real content is checked as it lands; rules about completeness (every party has a row, both languages present, self-match) run only on the active corpus, so the build doesn't break while the real content is half-finished. On the inactive corpus an anchor is checked only when that language's research document already exists, as the existing rules do for research that lands incrementally; so Hebrew result texts can land before the Hebrew research editions. Before the corpus switch, the full set is run on the real corpus with `CONTENT_CORPUS=real`.
- **Self-match test (requirement 39), inside the validation script:**
  - The voter for a party answers the issues where the party has a recorded position and picks, on each, the party's highest-level held option (`main`, else `either`, else `secondary`; ties by option ID). All issues get equal weight in this test, so the outcome doesn't depend on an invented ranking order.
  - The test scores every party on those issues only. It doesn't apply the survey's "at least 5 ranked" rule, because a party with fewer than 5 known positions could not be tested otherwise.
  - **What blocks the build:** another party scoring higher than the tested party on an issue where the tested party's own level is `main`. On such an issue the tested party scores the maximum, so this can only mean the scoring code or the data shape is broken.
  - **A tie for the top score passes** and never blocks. Parties with identical rows will tie, and so will `haredi-public` on its 3 known issues.
  - **What is reported, not blocked:** another party finishing ahead overall because the tested party's own rows are `either` or `secondary` on some issues. This is expected by design: a party with a firmer record on the same or a neighbouring option should score higher there (22 of the 258 "Closest option(s)" lines are tentative or indirect). Each such case is written to a report that a separate agent reviews as part of the positions check, since it can also point at a row that deserves a second look.
- **Profile test (requirement 40):** a named command that runs the profiles file against the chosen corpus. During content work a mismatch is a review item for a separate agent. Once the constants are settled it is run on the real corpus as a required step before the switch, and joins the validation script.
- **End-to-end (Playwright, against the placeholder corpus):** the survey spec loses editing, write-your-own and "anything else" and gains the direct submit; the result spec is rebuilt on placeholder matching content designed to produce each case (joint list, below threshold, limited information, weak match, unclear position), replacing the mock scenarios; the pages spec covers a listed-only page and the tier labels; the time-modes spec covers the blackout swap on How this works; the accessibility spec is re-run on the changed screens; the smoke spec's direct `POST /api/match` checks are replaced.
- **Test and example config:** `playwright.config.ts` sets `MOCK_DELAY_MS` and `.env.example` documents `MATCHING_IMPL` and `MOCK_DELAY_MS`; both are cleaned up.
- **Fixtures:** `tests/fixtures/matching.ts` and `content.ts` are rewritten for the new shapes.

## Rollout & migration strategy

Three tracks run in parallel; nothing ships until all three meet.

1. **Code track** (against the placeholder corpus): survey simplification, local matcher, result view changes, tiers and listed-only pages, tally endpoint, validation rules, copy keys, tests.
2. **Matching content track** (from the frozen English research), in this order because each step feeds the next:
   1. positions per issue, then a separate reviewer per issue;
   2. option-distance grids, then a separate reviewer;
   3. constants tuned with the self-match and profile tests;
   4. English result texts (one per party, issue and option) and points, written per party so the author has that party's research in view, then a separate checker for grounding, neutrality and agreement with the computed label;
   5. Hebrew result texts and points, then a parity check by a different agent. **Done by the owner in a separate cloud session (owner decision 2026-10-13), not by this workstream.**
3. **Research track:** Stage 5 Hebrew editions and parity check for the 28 researched parties (about 281,000 English words), which the owner also runs in a separate cloud session; and, in this workstream, the Phase 3 audits, platform links for the 24 listed parties (found and then verified by a different agent), and the registry recheck against the CEC's final publication of 18 October.

Then:
- site copy in both languages goes through the existing neutrality review and parity check and to the owner for approval;
- the active corpus is switched to `real`, `researchVersion` and `matchingVersion` are set, and the placeholder corpus is kept only for tests;
- owner action: create the tally store (see Integrations), which the owner has confirmed they want;
- deploy before the blackout starts on 23 October, so the blackout swap can be verified live with the clock override on a preview.

**Rollback:** the site is static; reverting the deployment restores the previous version. There is no data to migrate back. Tally counters are additive and unaffected.

**After the election:** unchanged. The survey closes automatically, the tally route rejects calls, pages stay as an archive.

## Risks & technical decisions made

### Decisions
1. **One explanation text per party, issue and chosen option (owner decision 2026-10-13).** The text is written for the user's actual answer ("you chose X; the party voted against X in 2024"). This is about 1,150 texts per language instead of 280, so it is the largest content job after the Hebrew research editions. Because each text states a comparison, it can contradict the computed agreement label if a party's row or a constant changes later; the validation rule that compares the two exists to catch exactly that, and any change to a row or to the constants re-runs it.
2. **Scores are derived at run time** from positions and grids, never stored per cell, which is what PRD requirement 31 asks for.
3. **Level vocabulary `main` / `either` / `secondary` / unclear**, because about 258 "Closest option(s)" lines name about 417 option IDs: many rows name more than one option, and some say the evidence can't choose between two. Starting values: `main` 1.0, `either` 0.85, `secondary` 0.6, unclear 0.25; agreement cut-offs 0.75 and 0.35; weak match below 0.6. All tunable in the profile test.
4. **Linear rank weights**, matching the bar the result view already shows.
5. **Answer-seeded tie-break** instead of alphabetical, so no party wins every tie.
6. **Self-match test is scored on the party's known issues only, with equal weights. It blocks the build only when a party is outscored on an issue where its own level is `main`; being outscored because its own rows are weaker is reported for review instead** (see Testing). PRD requirement 39 says the party "must" come first; read literally that can't hold for a party with fewer than 5 known positions or with only tentative positions, so this is the nearest workable form.
7. **Matching runs from a version-stamped bundle; party facts and poll notes come from the server-rendered survey page.** This keeps blackout-sensitive data out of a long-cached file.
8. **`/api/match`, the mock and the implementation registry are deleted**, not kept behind a switch. The placeholder corpus gets real (fictional) matching content so tests exercise the real code path.
9. **Explicit tier field in the registry** instead of inferring the tier from a missing research file, so validation can tell "listed on purpose" from "research missing".
10. **Listed-only pages show no poll information.** The PRD limits them to registry facts and the link, and this keeps them identical before and during the blackout.
11. **Share links accept researched parties only.**
12. **Tallies in Upstash Redis with daily counters**, as the original plan proposed, with no rate limiting (see Security).
13. **`matchingVersion` added** to `versions.json`; `surveyContentVersion` is unchanged because the issues and options don't change. The local-storage schema version bump handles saved drafts.
14. **English first, Hebrew after, for result texts.** English research is canonical (original plan, Decisions §7). Positions and grids are language-independent. The Hebrew result texts are written from the checked English texts using the glossary, not from the Hebrew research editions, so the two Hebrew jobs don't block each other.
15. **The original Task 4.1 owner review of the corpus is dropped** (PRD requirement 35); the registry recheck and corpus switch in that task remain.
16. **Hebrew content is the owner's job, in a cloud session (owner decision 2026-10-13).** This workstream writes the instructions for it and the Hebrew interface strings in `messages/he.json`, nothing more. The corpus switch waits for the Hebrew research editions and Hebrew result texts to land. Suggested models for that session: Sonnet writes the Hebrew (research editions and result texts); Opus does the parity checks. Translation with a fixed glossary is easier than research, and the check is the safeguard, so the stronger model goes there. One party is run first as a trial and its parity report read before the rest are started; if the report shows meaning drift or loaded wording, the writing moves to Opus.

### Risks
1. **Time.** Thirteen days to election day and nine to the blackout, with the Hebrew research editions as the largest job. If they slip, the site can't launch in Hebrew, which is its default language. This track should start first.
2. **Sister parties crowding a result.** Parties on one list (the three United Torah Judaism members, the Joint List members) may have near-identical rows, so one list could take two or three of the four result slots. The original PRD allows partners to appear on their own merits, so the default is no special handling. The profile test should measure how often it happens; if it is common, it becomes a product question for the owner.
3. **Grids for issues that aren't a line.** Gaza (5 options) and Judea and Samaria (6) are not one-dimensional. The grid is per pair precisely for this, but these two need the most careful review.
4. **Indirect or tentative "Closest option(s)" lines.** Stage 4 allows them when marked tentative. The positions stage needs a rule for them (default: `secondary`-strength, never `main`), applied the same way to every party.
5. **A single limited-information party** (`haredi-public`: 3 recorded positions, 7 issues with no documented position). A real user must rank at least 5 issues, so against this party at least 2 of them score the unclear value and it tops out at about 0.85 with the starting constants. That is the intended effect of the unclear value. Its self-match test runs on its 3 known issues, where it will usually tie with several parties, since its options are common ones.
6. **Frozen research.** The owner froze the research pages on 12 October. Any later correction to a researched party must re-run that party's row, texts and Hebrew, in that order.
7. **CEC final lists on 18 October** may add, drop or rename a list. A change to a researched party's list affects labels only; a brand-new list becomes a `listed` party.
8. **Platform links.** Some of the 24 parties may have no website; the page then shows registry facts and the note only (PRD requirement 42).
9. **Tally inflation.** Accepted, see Security.
10. **Open research items** in `research/NEXT-STEPS.md` (for example raam's 2021 platform) don't block this plan; they stay as recorded.

## Out of scope (technical)

- Researching, fact-checking or matching the 24 listed parties.
- Any AI call at run time, abuse protection for matching, spending caps.
- An admin screen for tallies.
- Showing a numeric match percentage (the result view doesn't show one today, and the PRD doesn't add it).
- Special handling of same-list parties in results, unless the owner asks after the profile test.
- Changing the issues, their options or `surveyContentVersion`.
- Deepening or re-opening the frozen research documents.
- Offline support or installing the site as an app.

## Open technical questions

None that block the task breakdown. One owner action is listed under Rollout: creating the tally store.
