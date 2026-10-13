# Tasks: Deterministic matching and two party tiers

> **Source plan:** `plan-deterministic-matching.md`
> **Source PRD:** `prd-deterministic-matching.md` (changes `prd-israeli-election-party-matcher.md`)

## How to use this document

Agents work through this document phase by phase. Within a phase, tasks may be done in any order unless dependencies are noted. Mark a task complete by changing `[ ]` to `[x]`.

**Phase order:** finish Phase 1 first. Phases 2, 3 and 4 are parallelizable across phases: each can start as soon as the Phase 1 tasks it depends on are done. Phase 5 starts only when Phases 2, 3 and 4 are fully checked off and the owner's Hebrew content has landed (see "Owner's work outside this document").

Each task is self-contained: read the task and you should know what to do, how to know you're done, and where to look. If a task feels under-specified, check the plan section it references before asking.

Rules that apply to every task:

- **Read before coding.** `AGENTS.md` requires reading the relevant guide in `node_modules/next/dist/docs/` before writing code against this Next.js version (16.3.8).
- **No agent checks its own work.** Every content task names an author step and a separate checker step; they must be different agents.
- **The owner reviews no content** (party positions, grids, result texts, points). Bring the owner only product and user-experience decisions. Hosting is the owner's own area; don't plan or instruct it.
- **Start no long job without the owner's go-ahead.** Tasks 3.4 and 3.5 have explicit stops.
- **Commits:** never change git config. End commit messages with the attribution line in `research/NEXT-STEPS.md` §2 step 7.
- **Checks to run after any code task:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` (which runs `pnpm validate:content`). Report the actual results.

### Owner's work outside this document

The owner does all Hebrew content in a separate cloud session (owner decision 2026-10-13). It is not a task here, but Phase 5 waits for it:

- **Hebrew research editions** for the 28 researched parties, with parity checks, following the existing `research/pipeline/stage-5-hebrew-edition.md`. Output: `content/research/he/<partyId>.md`.
- **Hebrew result texts and "also worth knowing" points** for the 28 researched parties, with parity checks, following the instructions written in Task 1.4. Output: `content/matching/texts/he/<partyId>.json`. This can start only after Task 3.5.

The Hebrew interface strings in `messages/he.json` are the exception: they are small, the site doesn't build without them, and they are part of Task 2.7.

The owner also creates the small counter database for the anonymous counts before launch (Task 2.6 says what it needs).

## Phase 1: Foundations

**Goal:** put in place the data shapes, the scoring function and the content instructions that everything else builds on.
**Exit criteria:** the registry knows which parties are researched and which are listed only; the matching content formats exist and are validated; the scoring function passes its unit tests; the content instructions are written; the project documents say what is cancelled.

### Task 1.1: Add the researched / listed-only tier to the party registry
- [x]
- **What:** Add a required tier to every party (`researched` or `listed`) and an optional platform link for listed parties (URL plus the date it was checked). Mark the 28 parties that have a document in `content/research/en/` as `researched` and the other 24 as `listed`. Add one listed-only party, on its own list, to the placeholder corpus. Make the research validation rules tier-aware.
- **Acceptance criteria:**
  - `partySchema` in `lib/content/schemas.ts` requires the tier and accepts the platform link only as an `https` URL with a check date.
  - Validation fails when: a `listed` party has `researchedAsOf` set or has a research document; a `researched` party has no `researchedAsOf`; a platform link sits on a `researched` party.
  - `research-missing` is raised only for `researched` parties of the active corpus.
  - `content/registry/parties.json` has exactly 28 `researched` and 24 `listed` parties; the placeholder registry has at least one `listed` party.
  - `CONTENT_CORPUS=real pnpm validate:content` reports `research-missing` only for the Hebrew documents of the 28 researched parties.
  - Unit tests in `lib/content/validate.test.ts` cover each new rule.
- **Affected:** `lib/content/schemas.ts`, `lib/content/validate.ts`, `lib/content/validate.test.ts`, `content/registry/parties.json`, `content/placeholder/registry/parties.json`, `content/placeholder/registry/lists.json`, `tests/fixtures/content.ts`.
- **Dependencies:** none
- **Plan reference:** Data model §1; Decision 9 ("Explicit tier field in the registry").
- **Notes:** Pages still 404 for listed parties after this task; Task 2.5 fixes that. `generateStaticParams` in `app/[locale]/parties/[partyId]/page.tsx` already lists every party, so check `pnpm build` still passes with the placeholder's new listed party (the page calls `notFound()` when there is no document; if the build fails on it, restrict the static params to researched parties until Task 2.5).

### Task 1.2: Define the matching content formats and their single-file validation
- [x]
- **What:** Define the schemas for the matching content and wire them into the content reader and validator, for both corpora. The formats: one positions file per issue, one option-distance grid per issue, one result-texts file per party and language, the scoring-constants file, and the voter-profiles file. Add `matchingVersion` to `content/versions.json`. This task adds only the rules that judge one file on its own; completeness rules come in Task 2.1.
- **Acceptance criteria:**
  - `CORPUS_DIRS` in `lib/content/config.ts` has a matching directory for each corpus (`content/matching/` for real, `content/placeholder/matching/` for placeholder), and `lib/content/read-raw.ts` reads it.
  - A positions row is either "unclear" or a list of held options with a level of `main`, `either` or `secondary`, plus the research anchor and a one-line basis note. Validation rejects: unknown party or option IDs, a level outside the vocabulary, more than one `main`, `either` on fewer than two options, a row for a `listed` party.
  - A grid covers closeness values from 0 to 1 for pairs of that issue's options. Validation rejects unknown option IDs, values outside 0–1 and asymmetric or conflicting entries.
  - A texts file holds, per issue and per option, a text, the agreement level the author wrote it for, and the anchor `issue-<issueId>`; an unclear issue holds one text serving all options. It also holds 2–3 "also worth knowing" points, each with a text and an `other-…` anchor.
  - Anchors are checked against that party's research document in that language when the document exists; on the active corpus the document must exist.
  - The existing `poll-figure` rule (`lib/content/poll-figures.ts`) runs on every result text and point.
  - The constants file holds the level values, the unclear value, the two agreement cut-offs and the weak-match level, each validated as 0–1, with the starting values from the plan.
  - `versionsSchema` requires `matchingVersion`.
  - With no matching files present for the real corpus, `pnpm build` still passes on the placeholder corpus.
  - Unit tests cover each rule.
- **Affected:** `lib/content/schemas.ts`, `lib/content/config.ts`, `lib/content/read-raw.ts`, `lib/content/validate.ts`, `lib/content/validate.test.ts`, `content/versions.json`, `content/matching/config.json` (new), `tests/fixtures/content.ts`.
- **Dependencies:** depends on 1.1
- **Plan reference:** Data model §2–§7; Testing strategy → "Content validation" and "Where the gates run".
- **Notes:** The schema types must be importable by browser code, so keep them free of Node-only and `server-only` imports. Starting constants: `main` 1.0, `either` 0.85, `secondary` 0.6, unclear 0.25, cut-offs 0.75 and 0.35, weak match below 0.6.

### Task 1.3: Build the scoring function
- [x]
- **What:** Write the pure function that turns a user's ranking and answers into a result, working only from the matching content shapes of Task 1.2. It must run in the browser, in Vitest and in the validation script.
- **Acceptance criteria:**
  - Input is the ranked issue IDs in order and one option ID per ranked issue; unknown IDs are rejected.
  - Issue score: the best of the party's held options, each as level value times closeness to the user's option; an unclear row scores the unclear value.
  - Party score: average of issue scores weighted linearly by rank (top of n gets n, last gets 1).
  - Each breakdown item carries the rank, the display weight (n − rank + 1) / n, the agreement label from the two cut-offs (or `party-position-unclear`), and the text and anchor for the user's chosen option.
  - The output lists the 4 highest-scoring researched parties in order, each with its "also worth knowing" points, and sets the weak-match flag when the top score is below the configured level.
  - Equal scores are ordered by a hash of the user's answers combined with the party ID: the same input always gives the same order, and across many different inputs no party is always first among tied parties.
  - The module has no Node-only APIs and no `server-only` import.
  - Unit tests cover every level, the unclear value, the best-of-held-options rule, weights, both cut-offs, the weak-match rule, tie-break determinism and absence of a fixed favourite, and rejected input.
- **Affected:** `lib/matching/score.ts` (new), its test file, `lib/matching/contract.ts` (result types only: add the points, keep the rest for now).
- **Dependencies:** depends on 1.2
- **Plan reference:** APIs §2–§4; Decisions 2–5.
- **Notes:** Don't delete the old route, mock or request validation here; Task 2.3 does that. `lib/survey/shuffle.ts` already has `hashString`, which can serve the tie-break.

### Task 1.4: Write the instructions for the matching content jobs
- [x]
- **What:** Write the stage instructions and agent briefs for producing the matching content from the frozen English research, in the style of the existing files in `research/pipeline/`. Five jobs: party positions per issue, option-distance grids, English result texts and points per party, Hebrew result texts and points, and platform links for listed parties. Each job has an author brief and a separate checker brief.
- **Acceptance criteria:**
  - **Positions:** one agent places all 28 parties on one issue in a single pass, from each party's issue section and its "Closest option(s)" line. The brief gives one rule per case, applied to every party: a single clear option is `main`; "X or Y, the evidence can't tell" is `either` on both; "with elements of" or "evidence is mixed" is `secondary`; a tentative or indirect line is `secondary`, never `main`; "No documented position found" is unclear. The recency rule (evidence from 2021 onwards, current leadership) is restated.
  - **Grids:** the brief says closeness is judged per pair from the option texts in `content/issues/<issueId>.json`, that options are not assumed to lie on a line, and that Gaza and Judea and Samaria need particular care.
  - **English texts:** one agent per party writes, for every issue and every option, 1–2 neutral sentences for a user who chose that option, saying how the party's documented position compares and citing its strongest evidence, using only that party's research section, glossary terms and no poll figures. It records the agreement level each text was written for, which must match the computed label. It writes 2–3 "also worth knowing" points from the "Other notable positions" section: the positions the party is most distinctively known for, preferring ones backed by actions, never legal matters or coalition statements.
  - **Hebrew texts:** written from the checked English texts with the glossary, as equivalents not literal translations, with a parity check by a different agent. The brief says this job is run by the owner in a cloud session and suggests Sonnet for writing and Opus for the parity check, with one party as a trial.
  - **Platform links:** find the party's own official site or platform page, `https` only, from an official source; record the URL and check date, or "none found" with what was searched.
  - Every checker brief says what it verifies and that the checker must not be the author.
  - `research/pipeline/README.md` lists the new stages.
- **Affected:** `research/pipeline/` (new stage files), `research/pipeline/agent-briefs/` (new briefs), `research/pipeline/README.md`.
- **Dependencies:** depends on 1.2 (for the file formats)
- **Plan reference:** Affected systems → "Research pipeline"; Rollout → track 2; Risk 4; PRD requirements 29–34.
- **Notes:** Existing rules to carry over are in `research/pipeline/agent-briefs/stage-4-brief.md` ("Rules decided") and `research/review/consistency-review.md`.

### Task 1.5: Update the project documents for what is cancelled
- [ ]
- **What:** Bring the handoff note, the original task list and the original plan in line with the new direction, so a fresh agent doesn't start cancelled work.
- **Acceptance criteria:**
  - `research/NEXT-STEPS.md` says: the 24 small parties are not researched; the owner review of content is dropped; decision gate D1 and Phase 5 are dropped; all Hebrew content is done by the owner in a cloud session; this document is the active task list.
  - `tasks-israeli-election-party-matcher.md` marks Tasks 3.1 and 3.2 as complete for the 28 researched parties and cancelled for the rest, the owner review in Task 4.1 as dropped, and Tasks 5.1 and 5.2 as cancelled, each pointing here.
  - `plan-israeli-election-party-matcher.md` carries a note at the top pointing to `plan-deterministic-matching.md` for everything it replaces.
  - `lib/content/config.ts`'s header comment no longer says Task 4.1 deletes the placeholder corpus (it is kept for tests).
- **Affected:** `research/NEXT-STEPS.md`, `tasks-israeli-election-party-matcher.md`, `plan-israeli-election-party-matcher.md`, `lib/content/config.ts` (comment only).
- **Dependencies:** none
- **Plan reference:** Affected systems → "Project documents"; Decision 15.

## Phase 2: The website

**Goal:** make the site work end to end with deterministic matching, on the placeholder corpus.
**Exit criteria:** on the placeholder corpus, a user can rank, pick answers and get a result computed in the browser; listed-only pages work; the counts are sent; the copy is approved; lint, typecheck, unit tests, build and the end-to-end and accessibility suites all pass.

### Task 2.1: Add placeholder matching content and the completeness checks
- [x]
- **What:** Give the placeholder corpus a full set of matching content, designed so the result cases can each be produced by some set of answers. Add the validation rules that judge the set as a whole, the self-match test, and a command that runs voter profiles.
- **Acceptance criteria:**
  - `content/placeholder/matching/` has positions and grids for all 10 issues, texts in both languages for every researched placeholder party, constants and a small profiles file.
  - Documented answer sets exist that produce: a joint-list party on top, a below-threshold party, the limited-information party (`pebble-citizens`), a weak match, and an unclear-position item. They are recorded where the end-to-end tests can use them.
  - On the active corpus, validation fails when: a researched party lacks a row in any issue; a grid misses a pair; a researched party lacks a text for any issue option in either language, or the two languages' keys differ; a party has fewer than 2 or more than 3 points; an issue is unclear in positions but has a "Closest option(s)" line in the research, or the reverse; a text's recorded agreement level differs from the label the scoring function computes for that party, issue and option.
  - These completeness rules don't run on the inactive corpus.
  - The self-match test runs inside `scripts/validate-content.ts` for the active corpus as the plan defines it: per party, on its known issues only, equal weights, picking its highest-level option per issue. It fails the build only if another party scores higher on an issue where the tested party's level is `main`. A tie passes. A party finishing behind because its own rows are `either` or `secondary` is written to a report, not failed.
  - A named package script runs the profiles file against the chosen corpus and prints each profile's expected and actual outcome.
  - Unit tests cover the new rules and the self-match logic.
- **Affected:** `content/placeholder/matching/` (new), `lib/content/validate.ts`, `lib/content/validate.test.ts`, `scripts/validate-content.ts`, a new profile script under `scripts/`, `package.json`, `scripts/generate-placeholder-research.ts` (if the placeholder research needs "Closest option(s)" lines to match), `tests/fixtures/matching.ts`.
- **Dependencies:** depends on 1.2, 1.3
- **Plan reference:** Testing strategy → "Content validation", "Self-match test", "Profile test"; Affected systems → "Content validation"; Decisions 6 and 8.
- **Notes:** The placeholder parties are `blue-horizon`, `olive-branch`, `green-valley` (joint list `olive-and-valley`), `cedar-tradition`, `lighthouse`, `pebble-citizens`, plus the listed party from Task 1.1.

### Task 2.2: Simplify the survey to pick-one answers
- [ ]
- **What:** Remove option editing, the write-your-own field and the "Anything else?" step from the survey state, storage and screens. The last answer screen submits directly.
- **Acceptance criteria:**
  - An answer draft holds only the selected option ID. `OWN_ANSWER`, edited texts, own text, `editOption`, `editOwn`, `optionText`, the `anything-else` step and all `anythingElse` state and helpers are gone from `lib/survey/state.ts`.
  - `SURVEY_SCHEMA_VERSION` is 2, and a saved schema-1 survey is discarded on load.
  - The answer screen shows each option as a non-editable radio card; there are no textareas, no edited badge, no undo button and no own-answer card.
  - The next button on the last answer screen reads as the submit action and submits.
  - `components/survey/anything-else/` is deleted.
  - `app/[locale]/page.tsx` no longer lists the `anythingElse` step.
  - The answer screen stays operable by keyboard and passes the existing accessibility checks.
  - Unit tests in `lib/survey/state.test.ts` are updated.
- **Affected:** `lib/survey/state.ts`, `lib/survey/state.test.ts`, `lib/survey/storage.ts`, `components/survey/answers/answer-step.tsx`, `components/survey/survey-app.tsx`, `components/survey/anything-else/` (deleted), `app/[locale]/page.tsx`, `messages/en.json` and `messages/he.json` (remove only the keys this deletes; wording is Task 2.7).
- **Dependencies:** none within Phase 2 (can run alongside 2.1)
- **Plan reference:** Affected systems → "Survey"; Data model §8.
- **Notes:** Until Task 2.3 lands, submission still goes to the old route; keep the request it builds valid (every answer is an unedited preset with a starting option) so the app keeps working between the two tasks.

### Task 2.3: Run matching in the browser and remove the server route
- [ ]
- **What:** Serve the matching bundle, load it in the survey, compute the result locally, and delete the old route, handler, client, mock and implementation registry.
- **Acceptance criteria:**
  - A route serves one bundle per language for the active corpus: positions, grids, constants, that language's texts and points, stamped with `matchingVersion` and `surveyContentVersion`. It holds no poll data and no registry facts. The address always serves the current bundle; `matchingVersion` is only a cache-busting parameter.
  - `app/[locale]/survey/page.tsx` passes to the survey app the per-party metadata for researched parties (name, list, ballot letters, joint-list partners, limited-information flag, poll note with the blackout applied on the server) and the server's blackout state.
  - The survey starts fetching the bundle when the user reaches the first answer screen. On submit the result appears from the local scoring function; the loading state shows only if the bundle hasn't arrived.
  - The error state appears only for a failed bundle load (offers retry) or a bundle whose survey-content version differs from the survey's (offers restart). A newer `matchingVersion` is used without error.
  - `MatchErrorCode` has exactly those two codes; `errorInfo` and `errorMessageKey` live in `lib/matching/contract.ts`.
  - Deleted: `app/api/match/route.ts`, `lib/matching/handler.ts`, `client.ts`, `mock.ts`, `registry.ts`, `types.ts`, their tests, the request schema and validation in `contract.ts`, the `?mockScenario=` affordance, and the `MATCHING_IMPL` and `MOCK_DELAY_MS` settings (including `playwright.config.ts` and `.env.example`).
  - `partyMetadata` lives in `lib/content/party-view.ts` and takes parties and lists directly.
  - `components/layout/preview-banner.tsx` no longer warns about simulated results; the fictional-corpus warning stays.
  - Poll notes on a result are still hidden at the blackout instant for a tab opened earlier.
  - Unit tests cover the bundle builder and loader.
- **Affected:** `lib/matching/data.ts` (new), `lib/matching/contract.ts`, the deleted files above, `lib/content/loaders.ts`, `lib/content/party-view.ts`, `app/[locale]/survey/page.tsx`, a new bundle route under `app/`, `components/survey/survey-app.tsx`, `components/result/result-view.tsx`, `components/result/result-entry.tsx` (blackout prop source), `components/result/error-state.tsx`, `components/result/loading-state.tsx`, `components/layout/preview-banner.tsx`, `playwright.config.ts`, `.env.example`, `next.config.ts` if file tracing needs it.
- **Dependencies:** depends on 1.3, 2.1, 2.2
- **Plan reference:** APIs §1, §5–§7; Affected systems → "Matching"; Decisions 7 and 8.
- **Notes:** End-to-end tests that rely on mock scenarios will fail after this task until Task 2.8; run the unit tests and build here and say so in the report.

### Task 2.4: Update the result page
- [ ]
- **What:** Show the top five parties in full and the rest behind a "show all" control (owner decision 2026-10-13); show the "also worth knowing" points for each party and the note that not every list is matched; remove the "anything else" block.
- **Acceptance criteria:**
  - The result shows the five highest-scoring parties as full cards (top match first). A "show all" control reveals the remaining researched parties in score order as compact rows; each row opens to the same per-issue breakdown and points. The scoring function returns all researched parties in order, not only four.
  - A short line by the expanded list says that parties close together are about equally near. The weak-match message refers to the top result only.
  - Share links and the tally still use the top four.
  - Each result entry shows its 2–3 points, each linking to its `other-…` anchor on the party's research page. For runners-up they sit inside the existing collapsed details.
  - The result shows one line saying some lists on the ballot were not included in the matching, linking to the Parties page. It mentions no polls and is shown during the blackout too.
  - The `anythingElseNote` block and its messages are gone.
  - The new elements have stable test IDs and pass the accessibility checks.
- **Affected:** `components/result/result-entry.tsx`, `components/result/result-view.tsx`, `messages/en.json`, `messages/he.json` (new keys with working wording; final wording is Task 2.7).
- **Dependencies:** depends on 2.3
- **Plan reference:** Affected systems → "Result view"; PRD "Result" section.

### Task 2.5: Build listed-only party pages and tier labels
- [ ]
- **What:** Give listed parties a page, show each party's tier in the Parties list, and restrict share links to researched parties.
- **Acceptance criteria:**
  - A listed party's page shows its name, list, ballot letters, leader, the list's top candidates, the joint-list label where relevant, the standard note that the party was not researched in depth and is not in the matching, and the platform link when one exists. It shows no research document and no poll information.
  - The platform link is labelled as the party's own material that the site has not checked, opens as an external link with `rel="noopener noreferrer"`, and is absent when there is no link.
  - The standard note mentions no polls or threshold.
  - The Parties list stays alphabetical with both tiers mixed, and each entry shows its tier.
  - A share URL keeps only researched party IDs; a listed party's ID is ignored, in the share page and its preview image.
  - Unit tests cover the tier-aware party views and the share filtering.
- **Affected:** `app/[locale]/parties/[partyId]/page.tsx`, `app/[locale]/parties/page.tsx`, `lib/content/party-view.ts`, `lib/content/party-view.test.ts`, `app/[locale]/share/[parties]/page.tsx`, `app/[locale]/share/[parties]/opengraph-image.tsx`, `lib/share/share.test.ts`, `messages/en.json`, `messages/he.json`.
- **Dependencies:** depends on 1.1
- **Plan reference:** Affected systems → "Parties section"; Security → "External links on listed-only pages"; Decisions 10 and 11.

### Task 2.6: Add the anonymous counts
- [ ]
- **What:** Add the endpoint and counter module that record, per day, surveys started, results shown, and per party how often it was top match and runner-up; and send the two calls from the survey.
- **Acceptance criteria:**
  - `POST /api/tally` accepts two kinds of call. "Survey started" carries nothing else. "Result" carries 3–4 distinct party IDs in order, all researched parties. Anything else is rejected, as is any body over a small size cap, and everything after the election closes.
  - A valid call increments the day's counters in one round trip and returns no content.
  - The route never logs request bodies, stores nothing about the visitor, and has no per-IP rate limit.
  - The survey sends "survey started" once when a new survey begins (not on resuming a saved one) and "result" once per result shown. Both are fire-and-forget: a failed call changes nothing the user sees.
  - With no store configured (local development, tests), the route accepts calls and does nothing.
  - The counter module is written against a small interface with an in-memory version for tests; unit tests cover body validation, the day keys and the per-party counts.
  - A short note in `research/NEXT-STEPS.md` tells the owner what the store needs: an Upstash Redis database and the names of the two settings the site reads for it.
- **Affected:** `app/api/tally/route.ts` (new), a new counter module under `lib/`, its tests, `components/survey/survey-app.tsx`, `lib/survey/store.ts` (to know when a survey is new), `package.json` (the store's client library), `.env.example`, `research/NEXT-STEPS.md`.
- **Dependencies:** depends on 2.3
- **Plan reference:** APIs §8; Data model §9; Integrations → "a managed key-value store"; Security → "Tally endpoint"; Decision 12.
- **Notes:** Day boundaries: use Israel time, so a day in the counts matches a day for the owner. The election-close check already exists in `lib/time-modes.ts`.

### Task 2.7: Rewrite the site copy in both languages and get the owner's approval
- [ ]
- **What:** Bring every piece of interface and page copy in line with the new product, in English and Hebrew, add the blackout swap on How this works, and take the result through the existing neutrality review and parity check to the owner.
- **Acceptance criteria:**
  - `Answers` has no editing or write-your-own wording; `AnythingElse` is gone; `Home.steps` describes three steps; `MatchErrors` has only the two remaining messages; `Preview` has no simulated-results wording.
  - `HowItWorks.sections.matching` explains in plain language how matching works now (pick an option, closeness between options, ranking as weights, unclear positions count a little, all worked out on the user's device) and has no placeholder. `HowItWorks.sections.research` explains the two tiers and describes the independent checks instead of "reviewed before publication".
  - `Privacy` has no AI-provider or abuse-protection section; it says answers never leave the device, and that the only things kept are daily counts of surveys started and of which parties came out as top match and runners-up.
  - No copy in either language says that all parties are researched, that every party has a research page, or that a result takes time. Known instances: `Home.neutralBody`, `HowItWorks.description`, `HowItWorks.sections.neutrality`, `HowItWorks.sections.polls`, `Parties.description`, `Result.loadingBody`.
  - The sentence saying which lists were researched by polling level is marked as poll-derived. `app/[locale]/how-it-works/page.tsx` revalidates every 5 minutes and passes the server's blackout state; `ProsePage` wraps the marked paragraph in `PollContent` with a neutral replacement. During the blackout the sentence is not in the page.
  - English and Hebrew have identical key sets, and Hebrew uses the glossary terms.
  - A separate agent has done a neutrality review of the changed copy, and another a Hebrew/English parity check; their should-fix findings are applied.
  - The owner has approved the copy. This is a product approval, not a content review.
- **Affected:** `messages/en.json`, `messages/he.json`, `components/layout/prose-page.tsx`, `app/[locale]/how-it-works/page.tsx`, `app/[locale]/privacy/page.tsx` (section keys).
- **Dependencies:** depends on 2.2, 2.4, 2.5, 2.6
- **Plan reference:** Affected systems → "Site copy"; Security → "Poll blackout".
- **Notes:** Present the copy to the owner in chat, short, changed passages only; the owner won't edit documents. This is the only Hebrew writing in this document.

### Task 2.8: Rebuild the end-to-end and accessibility suites
- [ ]
- **What:** Update the Playwright suites for the new flow, on the placeholder corpus.
- **Acceptance criteria:**
  - The survey spec covers ranking, picking one option per issue, back navigation, resume after reload, and direct submission; it has no editing, write-your-own or "anything else" steps.
  - The result spec produces each result case from the placeholder answer sets of Task 2.1 (joint list, below threshold, limited information, weak match, unclear position) and checks the points and the "not every list is matched" note.
  - The error cases cover a failed bundle load with retry and a version mismatch with restart.
  - The pages spec covers a listed-only party page and the tier labels in the Parties list.
  - The time-modes spec covers the blackout swap on How this works and poll notes hidden on results.
  - The smoke spec no longer calls `/api/match`; it checks the bundle route and the tally route.
  - The accessibility spec passes on the answer screen, the result page and a listed-only page.
  - `pnpm test:e2e` passes in full.
- **Affected:** `tests/e2e/survey.spec.ts`, `result.spec.ts`, `pages.spec.ts`, `time-modes.spec.ts`, `smoke.spec.ts`, `a11y.spec.ts`, `helpers.ts`, `tests/fixtures/matching.ts`, `playwright.config.ts`.
- **Dependencies:** depends on 2.3, 2.4, 2.5, 2.6, 2.7
- **Plan reference:** Testing strategy → "End-to-end", "Test and example config", "Fixtures".

## Phase 3: Matching content

**Goal:** produce and check the real matching content in English for the 28 researched parties.
**Exit criteria:** positions and grids exist and are checked for all 10 issues; the constants are settled against the profiles; English result texts and points exist and are checked for all 28 parties; single-file validation passes on all of it.

### Task 3.1: Place the 28 parties on each of the 10 issues
- [x]
- **What:** Run the positions job from Task 1.4: one author agent per issue places all 28 researched parties on that issue; a different agent checks each issue's file against the research.
- **Acceptance criteria:**
  - `content/matching/positions/<issueId>.json` exists for all 10 issues, each with 28 rows.
  - Every row follows the rules in the positions brief; every non-unclear row names the research anchor and a basis note.
  - The 22 party-issue pairs where the research says "No documented position found" are unclear, and no others are.
  - Each issue's file has a checker's log from a different agent, and its should-fix findings are applied.
  - `CONTENT_CORPUS=real pnpm validate:content` raises no single-file error for these files.
- **Affected:** `content/matching/positions/` (new), a review log under `research/review/`.
- **Dependencies:** depends on 1.2, 1.4
- **Plan reference:** Rollout → track 2 step 1; Data model §2; Risk 4; PRD requirements 29 and 32.
- **Notes:** Use Opus for authors and checkers; these rows decide who gets recommended. The 10 authors can run in parallel.

### Task 3.2: Fill the option-distance grids
- [x]
- **What:** Run the grids job from Task 1.4 for the 10 issues, with a separate checker.
- **Acceptance criteria:**
  - `content/matching/distances/<issueId>.json` exists for all 10 issues, covering all 67 pairs.
  - Each value has a one-line reason recorded for the checker.
  - A different agent has checked every grid, with particular attention to Gaza and Judea and Samaria, and its should-fix findings are applied.
  - `CONTENT_CORPUS=real pnpm validate:content` raises no single-file error for these files.
- **Affected:** `content/matching/distances/` (new), a review log under `research/review/`.
- **Dependencies:** depends on 1.2, 1.4
- **Plan reference:** Rollout → track 2 step 2; Data model §3; Risk 3; PRD requirement 30.
- **Notes:** The author must not see the positions files, so closeness is judged from the option texts alone and not bent toward any party.

### Task 3.3: Write the voter profiles and settle the scoring constants
- [x]
- **What:** Write a set of typical voter profiles with the outcome the research says each should get, before any scores are computed. Then run the self-match test and the profile command on the real positions and grids, and tune the constants.
- **Acceptance criteria:**
  - `content/matching/profiles.json` holds the profiles (ranking, answers, expected outcome and a one-line reason from the research). The author did not run the scoring before writing them, and says so.
  - The self-match test on the real corpus has no blocking failure. Its report of parties outscored on their own positions has been reviewed by an agent that authored neither the positions nor the grids; any row or grid value it found wrong is corrected through the Task 3.1 or 3.2 process.
  - Every profile mismatch has been reviewed by a separate agent and resolved as a constant change, a content correction, or a wrong expectation, with the reason recorded.
  - The final constants are in `content/matching/config.json`.
  - A short report states how often several parties from one list appear together in a result across the profiles.
- **Affected:** `content/matching/profiles.json` (new), `content/matching/config.json`, a report under `research/review/`.
- **Dependencies:** depends on 2.1, 3.1, 3.2
- **Plan reference:** Rollout → track 2 step 3; Testing strategy → "Self-match test", "Profile test"; Risks 2 and 5; PRD requirements 38–40.
- **Notes:** If same-list parties crowd results often, stop and bring it to the owner as a product question before continuing.

### Task 3.4: Write and check the result texts for one party, and report the token cost
- [x]
- **What:** Run the English texts job from Task 1.4 for a single party, author then checker, and report to the owner how many tokens it used.
- **Acceptance criteria:**
  - `content/matching/texts/en/<partyId>.json` exists for the trial party with a text for every option of every issue (41 in all, fewer where an issue is unclear) and 2–3 points.
  - Each text's recorded agreement level equals the label computed from the settled positions, grids and constants.
  - A different agent has checked every text against the party's research section for grounding and neutrality, and its should-fix findings are applied.
  - The owner has been given the token count of the author run and of the checker run, each taken from the agent's reported usage, and the total multiplied by 28.
  - **Stop here.** Task 3.5 starts only when the owner says so.
- **Affected:** `content/matching/texts/en/` (new), a review log under `research/review/`.
- **Dependencies:** depends on 3.3
- **Plan reference:** Rollout → track 2 step 4; Data model §4; Decision 1.
- **Notes:** Pick a party of typical length, not `new-hope` (the longest) and not `haredi-public` (mostly unclear). Run the author on Sonnet and the checker on Opus unless the owner says otherwise, and say which were used in the report.

### Task 3.5: Write and check the result texts for the other 27 parties
- [x]
- **What:** After the owner's go-ahead, run the same job for the remaining 27 researched parties, on the models the owner chose after Task 3.4.
- **Acceptance criteria:**
  - `content/matching/texts/en/<partyId>.json` exists for all 28 researched parties, complete for every issue and option, each with 2–3 points.
  - Every text's recorded agreement level equals the computed label.
  - Every party's texts have a checker's log from a different agent, with should-fix findings applied.
  - No text contains a poll figure or a term the glossary lists under `avoid`.
  - `CONTENT_CORPUS=real pnpm validate:content` raises no single-file error for these files.
  - `research/NEXT-STEPS.md` tells the owner the English texts are ready for the Hebrew job.
- **Affected:** `content/matching/texts/en/`, review logs under `research/review/`, `research/NEXT-STEPS.md`.
- **Dependencies:** depends on 3.4 and the owner's go-ahead
- **Plan reference:** Rollout → track 2 step 4; PRD requirements 33 and 34.
- **Notes:** Run a few parties at a time. If a positions row is corrected after its texts were written, that party's affected texts are rewritten and rechecked.

## Phase 4: Research and registry

**Goal:** finish the remaining research-side work that doesn't involve Hebrew.
**Exit criteria:** the research audits are done; every listed party has a verified platform link or a recorded "none found"; the registry matches the Central Elections Committee's final lists.

### Task 4.1: Run the outstanding audits of the research for the 28 parties
- [ ]
- **What:** Run the Phase 3 audits that `research/NEXT-STEPS.md` lists as not started, for the research and fact-check of the 28 researched parties, as defined in `tasks-israeli-election-party-matcher.md` (Tasks 3.1 and 3.2).
- **Acceptance criteria:**
  - Each audit named in those tasks has been run by an agent that was neither an author nor a fact-checker of the documents it audits.
  - The audit findings are recorded under `research/review/`.
  - No research document is changed without the owner's say-so, because the pages are frozen since 12 October; any finding that would change a document is listed for the owner as a product-level decision (change or leave).
- **Affected:** `research/review/`, `research/NEXT-STEPS.md`.
- **Dependencies:** depends on 1.5
- **Plan reference:** Rollout → track 3 ("the Phase 3 audits"); Risk 6.
- **Notes:** If the owner approves a correction to a party, that party's positions rows, English texts and Hebrew must be re-run in that order.

### Task 4.2: Find and verify platform links for the 24 listed parties
- [ ]
- **What:** Run the platform-links job from Task 1.4: one agent finds each listed party's own official site or platform page; a different agent verifies each link.
- **Acceptance criteria:**
  - Each of the 24 listed parties in `content/registry/parties.json` has either a platform link with its check date or no link, with "none found" and what was searched recorded in a log.
  - Every link is `https`, loads, and belongs to the party itself (not a news article or a third-party profile).
  - The verifying agent is different from the finding agent.
  - Validation passes.
- **Affected:** `content/registry/parties.json`, a log under `research/`.
- **Dependencies:** depends on 1.1, 1.4
- **Plan reference:** Rollout → track 3; Risk 8; PRD requirement 42.

### Task 4.3: Recheck the registry against the final lists of 18 October
- [ ]
- **What:** Compare `content/registry/lists.json` and `parties.json` with the Central Elections Committee's final publication of 18 October 2026 and apply any differences.
- **Acceptance criteria:**
  - Every list's name, ballot letters, member parties, top candidates and status match the final publication, with the source recorded as the existing entries do.
  - A list that was added becomes a `listed` party; a withdrawn or disqualified list is marked by its status.
  - Any change that touches a researched party (for example a changed joint list) is reported to the owner.
  - `research/ground-truth.md` records the recheck and its date.
  - Validation passes.
- **Affected:** `content/registry/lists.json`, `content/registry/parties.json`, `research/ground-truth.md`.
- **Dependencies:** depends on 1.1. Cannot start before 18 October 2026.
- **Plan reference:** Rollout → track 3; Risk 7.

## Phase 5: Launch

**Goal:** switch the site to the real content and confirm it is ready before the poll blackout.
**Exit criteria:** the site builds and passes every check on the real corpus, and the blackout and election-over modes are verified. Starts only when Phases 2–4 are checked off and the owner's Hebrew research editions and Hebrew result texts have landed.

### Task 5.1: Switch the site to the real corpus
- [ ]
- **What:** Make `real` the active corpus, set the versions, and get every check passing on it.
- **Acceptance criteria:**
  - The default active corpus is `real`; the placeholder corpus remains in the repo for tests only, and the test runs select it explicitly.
  - `researchVersion` and `matchingVersion` in `content/versions.json` are set to real values.
  - `pnpm build` passes: full validation, completeness rules and the self-match test on the real corpus, with no `research-missing` errors.
  - The profile command passes on the real corpus and now runs as part of the validation script.
  - The Hebrew result texts' recorded agreement levels match the computed labels, and Hebrew and English keys are identical for all 28 parties.
- **Affected:** `lib/content/config.ts`, `content/versions.json`, `scripts/validate-content.ts`, `playwright.config.ts`, `vitest.config.mts` or test setup (to select the placeholder corpus), `research/NEXT-STEPS.md`.
- **Dependencies:** depends on all of Phases 2, 3 and 4, and on the owner's Hebrew content
- **Plan reference:** Rollout → "the active corpus is switched to `real`"; Testing strategy → "Where the gates run", "Profile test"; Data model §7.
- **Notes:** If a check fails on Hebrew content, report it to the owner; fixing Hebrew content is the owner's cloud session's job.

### Task 5.2: Run the full pre-launch check on the real corpus
- [ ]
- **What:** Verify the real site end to end, including the time-based modes, and record the result for the owner.
- **Acceptance criteria:**
  - A full survey completes in Hebrew and in English on the real corpus, and the result shows a top match, three runners-up, tailored texts with working research links, the points, and the "not every list is matched" note.
  - A researched party's page, a listed-only page with a link and one without, and the Parties list render correctly in both languages.
  - With the clock override set past the blackout start: poll notes are gone from results and party pages, and the poll-derived sentence on How this works is replaced. With it set past the election close: the survey is closed and the tally route rejects calls.
  - With the counter store configured, a started survey and a shown result each increase the day's counters as specified.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm test:e2e` pass.
  - `research/NEXT-STEPS.md` records the state, anything left open, and that the site is ready for the owner to publish.
- **Affected:** `research/NEXT-STEPS.md`; fixes wherever a check fails.
- **Dependencies:** depends on 5.1; the counter check needs the owner's store
- **Plan reference:** Rollout → "deploy before the blackout starts on 23 October"; Security → "Poll blackout".
- **Notes:** The poll blackout starts 2026-10-23 12:00 (+03:00). Publishing the site is the owner's step.

## Decisions made during breakdown

- **Hebrew content is not in this task list.** The owner runs the Hebrew research editions and the Hebrew result texts in a separate cloud session (owner decision 2026-10-13). This document only writes the instructions for it (Task 1.4) and the Hebrew interface strings (Task 2.7), and waits for it before Phase 5.
- **A one-party trial comes before the bulk of the result texts** (Task 3.4), with a stop for the owner, so the real token cost is known first. It is possible because the texts are written per party after the positions, which are done per issue for all parties.
- **Positions and grids are done before any text**, so each text can be checked against the label the scoring computes.
- **The grid author doesn't see the positions**, so closeness values aren't bent toward any party.
- **Phases 2, 3 and 4 run in parallel**; only Phase 5 needs all three.
- **The counter store is needed only at Task 5.2.** The counts are built against a stand-in, and the route does nothing when no store is configured.
- **Counts use Israel-time days.**
- **Models:** Opus for positions, grids and all checkers; Sonnet for writing result texts unless the trial or the owner says otherwise.
- **The placeholder corpus is kept for tests** after the switch, as the plan says, so the old instruction to delete it is removed.

## Open questions

None.

## Out of scope

- Researching, fact-checking or matching the 24 listed parties.
- All Hebrew content except the interface strings: Hebrew research editions and Hebrew result texts are the owner's cloud session.
- Hosting and publishing the site.
- Any AI call when a user takes the survey; abuse protection for matching; spending caps.
- An admin screen for the counts.
- Showing a numeric match percentage.
- Special handling of same-list parties in results, unless the owner asks after Task 3.3.
- Changing the issues, their options or `surveyContentVersion`.
- Changing the frozen research documents without the owner's say-so.
- Owner review of any content.
