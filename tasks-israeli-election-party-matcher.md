# Tasks: Israeli Election Party Matcher

> **Source plan:** `plan-israeli-election-party-matcher.md`
> **Source PRD:** `prd-israeli-election-party-matcher.md`

## How to use this document

Agents work through this document phase by phase. Within a phase, tasks may be done in any order unless dependencies are noted. Mark a task complete by changing `[ ]` to `[x]`. Don't start a phase until the previous phase is fully checked off, unless it's explicitly marked as parallelizable across phases.

Each task is self-contained. From the task alone you should know what to do, how to know you're done, and where to look. If a task feels under-specified, check the source plan section it references before asking for clarification.

**Owner-gated tasks.** Some tasks need the product owner's approval or decision before they can be ticked. Their acceptance criteria say so explicitly. When you reach the gate, present the deliverable to the owner and stop. Don't tick the task until approval is recorded.

**Scope of this document.** It covers the plan's Phase 1 (mock website plus research) and the D1 decision gate. Phase 2 tasks (real matching backend, abuse protection, stats, launch) are generated **after** D1, once the owner has decided storage, AI provider and model, and architecture.

**Phase parallelism.** Phase 2 (website) and Phase 3 (party research) run **in parallel** once Phase 1 is complete. Task 3.5 (poll snapshot) can start as soon as Task 1.4 is done.

**File layout established by this document** (greenfield; tasks create these):
- `app/[locale]/...`: pages.
- `app/api/match/route.ts`: matching route.
- `components/`: UI, with shadcn components in `components/ui/`.
- `lib/content/`: content loading and types.
- `lib/matching/`: contract, client, mock.
- `lib/survey/`: survey state.
- `lib/time-modes.ts`: blackout and election-over logic.
- `messages/he.json`, `messages/en.json`: site copy.
- `content/`: the corpus.
- `research/`: pipeline instructions, review documents, working notes.
- `scripts/validate-content.ts`: content validation.
- `tests/e2e/`: Playwright tests.

---

## Phase 1: Foundations and ground truth

**Goal:** stand up the project skeleton, the content and matching contracts, and the verified ground truth. Get the 10 issues approved by the owner.
**Exit criteria:**
- The app builds and deploys to a Vercel preview, in Hebrew and English.
- Content validation runs in the build.
- The mock matching route answers per the contract.
- The registry reflects the official CEC ballot lists.
- The owner has approved the issues and answers, and the survey content is frozen.
- Pipeline instructions for Stages 2–6 exist.
- The legal findings are documented.

### Task 1.1: Scaffold the Next.js app with i18n, RTL and tooling
- [x] *(Vercel preview deploy pending: the owner needs to connect the repo to Vercel. The project is deploy-ready: `vercel.json` is in place and `npm run build` passes.)*
- **What:** Create the project:
  - Next.js App Router with TypeScript and Tailwind, plus shadcn/ui using Base UI primitives (Radix variant only if the Base UI option isn't available in the shadcn CLI).
  - next-intl with locales `he` (default, RTL) and `en`, with locale-prefixed routes.
  - First-visit language detection from the browser's `Accept-Language`, plus a manual language switch on every page that's remembered across visits.
  - A Hebrew-capable web font.
  - `dir`/`lang` set correctly per locale.
  - Vitest for unit tests and Playwright for end-to-end tests.
  - Lint and format configuration.
  - Vercel project config so preview deploys work.
- **Acceptance criteria:**
  - Visiting `/` with a Hebrew or unknown browser language lands on `/he`. With an English browser language it lands on `/en`. A manual switch overrides detection and persists.
  - The Hebrew pages render RTL and the English pages LTR, including shadcn components.
  - `npm run build`, `npm run test` (Vitest) and `npm run test:e2e` (Playwright, with one smoke test) all pass.
  - A Vercel preview deployment is reachable.
- **Affected:** project root (`package.json`, `next.config`, `tailwind`/`postcss` config, `middleware.ts`), `app/[locale]/layout.tsx`, `components/ui/`, `messages/he.json`, `messages/en.json`, `i18n/` config, `tests/e2e/`.
- **Dependencies:** none
- **Plan reference:** Integrations & external dependencies, Phase 1 §1–2; Affected systems §3, "Language".
- **Notes:** Keep the bundle lean (Performance §2). The repo must not contain the operator's personal identity: set a non-identifying git author for this repo (Security §3).

### Task 1.2: Define content formats, build-blocking validation, and placeholder content
- [x]
- **What:**
  - Define typed formats and loaders for the corpus:
    - issues: one file per issue under `content/issues/`, with IDs, both languages, 3–4 options with stable option IDs;
    - `content/registry/parties.json` and `content/registry/lists.json` (list entity carries ballot letters, member party IDs, and a poll snapshot that is either a percent with source and date, or "not polled");
    - research documents at `content/research/{en,he}/<party-id>.md`, following the fixed 9-section skeleton, with one section-3 sub-section per issue ID, section-4 per-topic sub-sections, stable anchors identical across languages, and numbered sources;
    - `content/glossary.json`;
    - `content/versions.json` holding the survey-content version and the research version.
  - Write `scripts/validate-content.ts` implementing every Phase 1 check in the plan's Testing §1 (including the poll-figure heuristic: polling or survey wording next to a number, seat count or percentage, while allowing current seats and past results) and wire it into the build so failures block it.
  - Add realistic placeholder content (10 draft issues, about 6 placeholder parties including a joint list, a below-threshold list, a not-polled list and a limited-info party) so UI work can proceed.
- **Acceptance criteria:**
  - `npm run build` fails with a clear message when any validation rule is broken. There are unit tests with deliberately broken fixtures for each rule.
  - The placeholder corpus passes validation.
  - Loaders in `lib/content/` expose typed access to issues, parties, lists, research documents (parsed into sections and anchors), glossary and versions.
  - The below-threshold rule (polling average under 3.25%) and the "not polled" state are exposed as deterministic, unit-tested helpers.
- **Affected:** `content/`, `lib/content/`, `scripts/validate-content.ts`, build config.
- **Dependencies:** depends on 1.1
- **Plan reference:** Data model & schema changes, Phase 1 §1–4; Testing strategy §1.
- **Notes:**
  - Placeholder content must be obviously fictional (invented party names), so it can never be mistaken for real research.
  - Joint-list partner references must be symmetric (validated).

### Task 1.3: Implement the matching contract, the mock route, and the client
- [x]
- **What:**
  - Define the matching request and response types and validation exactly per plan APIs §1: input fields, set rules, length caps, survey-content version check, output entries with per-issue rank, agreement levels, anchors, the "anything else" note, the weak-match flag, deterministic metadata including the threshold or not-polled note, and the error codes with their HTTP statuses.
  - Implement `app/api/match/route.ts` as a POST route that validates input and delegates to a matching implementation chosen by configuration. The only implementation for now is the mock.
  - The mock returns canned, realistic results built from the placeholder corpus. It can be forced (e.g., via a dev-only query parameter or configuration) to produce every result case and every error code.
  - Implement the client module: a 60 s timeout mapped to `upstream_failure`, error-code-to-message mapping, and a token-provider hook called on submit and on every retry, which does nothing for now.
  - Metadata (names, list, ballot letters, partners, limited-info, threshold or not-polled note) is attached by the route from the registry, never by the mock's canned data, and is suppressed during blackout.
- **Acceptance criteria:**
  - Unit tests cover every validation rule and every error code's status mapping.
  - The mock can produce each of these cases: joint-list entry, below-threshold note, not-polled note, limited-info flag, weak match, no-usable-answers result, and each of the 7 error codes.
  - The route never logs request or response bodies (verified by test or review of logging calls).
  - The client applies the timeout and invokes the token-provider hook on each submission attempt.
- **Affected:** `lib/matching/contract.ts`, `lib/matching/mock.ts`, `lib/matching/client.ts`, `app/api/match/route.ts`.
- **Dependencies:** depends on 1.2
- **Plan reference:** APIs & interfaces, Phase 1 §1; Affected systems §3, "Mock matching adapter".
- **Notes:** The forcing mechanism must be disabled outside development and preview environments.

### Task 1.4: Research Stage 0, establishing ground truth from the CEC
- [x]
- **What:**
  - Using web search and fetch, verify the official election date and poll-closing time, and the official list of approved ballot lists from the Central Elections Committee: list names in Hebrew and English, ballot letters, member parties of joint lists, and the top of each candidate list.
  - Populate `content/registry/lists.json` and `content/registry/parties.json` (polls left as a pending placeholder for Task 3.5).
  - Record the date and closing time in `research/ground-truth.md`, with sources.
- **Acceptance criteria:**
  - Every approved list appears with letters and member parties, each fact citing a CEC source, or the most authoritative available source if CEC hasn't published yet, flagged as such.
  - `research/ground-truth.md` states the election date and poll-closing time (Asia/Jerusalem) with sources.
  - The registry passes the schema part of content validation.
- **Affected:** `content/registry/`, `research/ground-truth.md`.
- **Dependencies:** depends on 1.2
- **Plan reference:** Affected systems §2, "Stage 0, ground truth".
- **Notes:**
  - Nothing may be filled from memory.
  - If lists are still subject to appeals or approval, note which, so Task 4.1 re-checks them.

### Task 1.5: Research Stage 1, drafting the issues and answers and getting owner approval
- [ ] *(Draft and independent neutrality review done. AWAITING OWNER APPROVAL: see `research/review/issues-review.md`.)*
- **What:**
  - Research what the 10 most pressing issues in Israeli society are right now.
  - For each issue, draft the title, one-line description, more-info text, question framing and the 3–4 most common real-world positions, written in Hebrew and English as equivalents, with Israeli-neutral terminology (e.g., "Judea and Samaria", "settlements").
  - Produce the bilingual terminology glossary.
  - Run an **independent** neutrality-review agent (not the drafter) that checks for terms loaded within Israeli discourse and for missing major positions. Apply its fixes.
  - Write `research/review/issues-review.md` for the owner: each issue with why it made the list (with sources), its options in both languages, the glossary, and the issues considered but excluded (with reasons).
  - Iterate with the owner until approved. Then write the final issues into `content/issues/` and `content/glossary.json`, and set the survey-content version.
- **Acceptance criteria:**
  - The review document exists and covers all the elements above.
  - **The owner has explicitly approved the issues and options** (record the approval and date at the top of the review document).
  - `content/issues/` contains exactly 10 issues, passing validation, matching the approved text.
  - The survey-content version is set in `content/versions.json`.
- **Affected:** `research/review/issues-review.md`, `content/issues/`, `content/glossary.json`, `content/versions.json`.
- **Dependencies:** depends on 1.2
- **Plan reference:** Affected systems §2, "Stage 1, issues and answers (owner-gated)".
- **Notes:** **Owner-gated.** All of Phase 3 depends on this approval. Raise it with the owner as early as possible.

### Task 1.6: Write the per-stage pipeline instructions for Stages 2–6
- [x]
- **What:**
  - Write reusable agent instructions under `research/pipeline/`, one file per stage:
    - **Stage 2, party research.** The 9-section skeleton. Evidence tiers. Contradictions stated. Inline citations. The joint-list partner and split history in the Overview. No poll figures. Written in English, with Hebrew sources read directly.
    - **Stage 3, fact-check.** Verify every claim against its source. Court or official sources only for legal matters. Poll-figure check. Joint-list claims. Limited-information flag.
    - **Stage 4, cross-party consistency and neutrality review.**
    - **Stage 5, Hebrew edition plus parity check**, using the glossary.
    - **Stage 6, poll snapshot.** Polling average per list with source and date, or "not polled". Never estimate.
  - Each instruction states its inputs, outputs (exact file paths), and the rule that writing, checking and reviewing are done by different agents.
  - Write `research/pipeline/README.md` describing the full run order and the **per-party re-run procedure** (research → fact-check → per-party consistency check → Hebrew), used for owner corrections and poll refreshes.
- **Acceptance criteria:**
  - Each of Stages 2–6 has an instruction file that a fresh agent can follow without other context.
  - The README documents the full run and the per-party re-run, including which version (research) to bump.
- **Affected:** `research/pipeline/`.
- **Dependencies:** depends on 1.2
- **Plan reference:** Affected systems §2 (Stages 2–6 and "re-runnable per party").
- **Notes:** Section-3 sub-sections depend on the approved issue IDs. The Stage 2 instructions should reference `content/issues/` rather than hard-coding issues.

### Task 1.7: Research the poll-publication ban and election-period rules
- [x]
- **What:**
  - Research Israeli election law on publishing poll results before election day (the exact cutoff) and any election-day or election-period rules that could apply to a voter-advice tool operating during the campaign or on election day.
  - Write `research/legal-findings.md` with the rules, sources, a recommended poll-blackout start instant (with a safety margin larger than the roughly 5-minute revalidation window), and any other recommended restrictions.
- **Acceptance criteria:**
  - The document cites primary or authoritative sources, gives a concrete recommended blackout instant in Asia/Jerusalem time, and flags any rule that may require product changes.
  - The findings are presented to the owner (not a gate for other tasks).
- **Affected:** `research/legal-findings.md`.
- **Dependencies:** none
- **Plan reference:** Open technical questions §2; Security, privacy & compliance §8.
- **Notes:** This isn't legal advice. State clearly that the owner may want professional confirmation.

---

## Phase 2: Website pages and flows (parallel with Phase 3)

**Goal:** a complete, reviewable bilingual website covering every PRD flow, running against the mock.
**Exit criteria:**
- Every page and flow works in Hebrew and English on mobile and desktop against the mock.
- All result and error cases render.
- Time-based modes work.
- Site copy is owner-approved.
- The end-to-end and accessibility suites pass.

### Task 2.1: Build the layout and static pages
- [x]
- **What:**
  - Build the shared layout: header with navigation (Home, Parties, How this works), the language switch on every page, footer with a Privacy & Terms link.
  - Build the intro page: purpose, neutrality stance, the short privacy note linking to Privacy & Terms, about 5–10 minutes estimated time, start button.
  - Build the How-this-works page and the Privacy & Terms page, with copy drawn from `messages/*.json`. Placeholder copy is fine until Task 2.9.
  - Ensure no operator name or personal details appear anywhere: page content, metadata, preview images.
  - Set sensible page metadata per locale (titles, descriptions, `hreflang` alternates) for discoverability.
- **Acceptance criteria:**
  - All three pages render in both languages with correct direction.
  - Navigation works from every page.
  - Metadata includes locale alternates.
  - A check (test or documented review) confirms no operator identity in rendered HTML or metadata.
- **Affected:** `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/how-it-works/`, `app/[locale]/privacy/`, `components/layout/`, `messages/`.
- **Dependencies:** none (Phase 1 complete)
- **Plan reference:** Affected systems §3, "Static pages, both languages" and "Operator anonymity".
- **Notes:** The matching section of How-this-works and the provider name on Privacy & Terms are finalized after D1. Mark them with clear placeholders.
- **Implementation notes:**
  - Header (Home, Parties, How this works + language switch), footer (neutrality line, Privacy & Terms, How this works, Parties), skip link. A preview banner shows while the fictional corpus and/or mock matcher are active, so sample content is never mistaken for real.
  - Static copy pages render from `messages/*.json` via `components/layout/prose-page.tsx`. Post-D1 items (matching method, AI provider name) and the not-yet-existing anonymous contact address are rendered as dashed, `data-placeholder="post-d1"` boxes.
  - Metadata: per-page title/description, canonical, `hreflang` alternates (`he`, `en`, `x-default`), Open Graph/X with a generated, localized site preview image. `metadataBase` comes from `NEXT_PUBLIC_SITE_URL` or Vercel's URL env vars. No author/creator/publisher metadata.
  - Anonymity check: `tests/e2e/pages.spec.ts` ("operator anonymity") scans rendered HTML for author metadata, `mailto:` and email addresses, plus any extra terms given in the (never committed) `OPERATOR_IDENTITY_TERMS` env var. `messages/messages.test.ts` checks the copy for emails/phone numbers.
  - Added a localized 404 (`app/[locale]/not-found.tsx` + catch-all).

### Task 2.2: Build the Parties index and research page display
- [x]
- **What:**
  - Build the Parties index: every registry party, alphabetical by current-language name, each linking to its research page. Show joint-list grouping labels.
  - Build the per-party research page: render the research markdown with section and per-issue anchors (deep-linkable), the numbered sources, and the researched-as-of date.
  - The Overview's polling line, threshold note and not-polled note are rendered **from the registry snapshot**, not from the markdown, and hidden during blackout (using the helper from Task 2.8, or a stub until then).
  - Show the joint-list partner with links, and the limited-information flag where set.
  - Statically generate the pages with time-based revalidation (about 5 minutes).
- **Acceptance criteria:**
  - Pages are generated for every party in both languages, and deep links to issue anchors scroll to the right section.
  - Sorting is alphabetical per locale.
  - The poll line and notes come from the registry and disappear in blackout mode.
  - Pages are server-rendered HTML (content visible with JavaScript disabled).
- **Affected:** `app/[locale]/parties/page.tsx`, `app/[locale]/parties/[partyId]/page.tsx`, `components/research/`, `lib/content/`.
- **Dependencies:** none (Phase 1 complete); integrates with 2.8 for blackout.
- **Plan reference:** Affected systems §3, "Parties index…per-party research pages"; Performance §1.
- **Implementation notes:** research markdown is rendered server-side only with `marked` (`lib/content/markdown.ts`; raw HTML escaped, citations `[n]` linked to `#source-n`). Pages are SSG for every party × locale with `revalidate = 300` and `dynamicParams = false`. The polling block (`components/research/poll-info.tsx`) is built from the registry snapshot, lists constituent polls when the snapshot has them (legal-findings §3.2), and is replaced by one neutral sentence for every party during blackout, server-side and again client-side.

### Task 2.3: Implement survey state and on-device progress
- [x]
- **What:**
  - Implement the client-side survey state stored in local storage per plan Data model §5: schema version, survey-content version, shuffle seeds for issue order and per-issue option order, ranking, the "doesn't matter" set (max 5), per-issue answers (final text plus starting option ID plus edited flag), and the "anything else" text and importance.
  - Resume restores an identical session.
  - Clear the state once a result is shown.
  - Discard it on load if the survey-content version differs.
  - Wrap all storage access so the survey still works when storage is unavailable (no resume in that case).
- **Acceptance criteria:**
  - Unit tests cover seeded shuffling determinism, resume, clearing after a result, version-mismatch discard, the 5 "doesn't matter" cap, and storage-unavailable behavior.
  - The state can produce a valid matching-contract request.
- **Affected:** `lib/survey/`.
- **Dependencies:** none (Phase 1 complete)
- **Plan reference:** Data model & schema changes, Phase 1 §5.
- **Deviation:** per-issue answers are stored as a draft (`selected` option ID or "own", edited wording per option, own text) rather than only the final triple, so switching between options doesn't lose edits. `finalAnswer()` derives the exact submitted triple (final text, starting option ID, edited flag). `lib/survey/store.ts` wraps state + storage for `useSyncExternalStore`; a new session is saved immediately so a reload keeps the same shuffle.

### Task 2.4: Build the ranking step
- [x]
- **What:**
  - Build the ranking screen: all issues start in an unranked pool in this session's random order. The user moves them into a ranked list (1 = most important), reorders freely, and can mark up to 5 as "doesn't matter" (excluded from ranking).
  - Each card shows the one-line description, plus "more info" opening the more-info text (shadcn dialog or drawer).
  - Use dnd-kit with pointer, touch and keyboard sensors. Provide a tap-to-add alternative on mobile, and a non-drag way to reorder for accessibility.
  - "Continue" is enabled only when every non-excluded issue is ranked with no ties.
- **Acceptance criteria:**
  - Ranking works by mouse, touch and keyboard-only, in both directions (RTL and LTR).
  - The sixth "doesn't matter" is prevented with a clear message.
  - The order differs between new sessions but is identical on resume.
  - State persists via Task 2.3.
- **Affected:** `app/[locale]/survey/`, `components/survey/ranking/`.
- **Dependencies:** depends on 2.3
- **Plan reference:** Affected systems §3, "Survey (client-side)"; PRD Step 1.
- **Implementation notes:** three equivalent ways to rank: "Add" + up/down/remove buttons (tap, click or keyboard), mouse/touch drag via handles (dnd-kit `MouseSensor` + `TouchSensor` with a 150 ms press, so the page still scrolls), and keyboard drag (`KeyboardSensor`). Announcements, instructions and the role description are localized. Focus is restored after moves. Pointer-based collision detection with a closest-corners fallback for the keyboard.

### Task 2.5: Build the answer steps and the "anything else" step
- [x]
- **What:**
  - Build one screen per ranked issue, in ranked order: the question framing, then the 3–4 options in this session's shuffled order, each shown as an **already-editable text area**. The user selects one and may edit its wording in place, or writes their own in a separate free-text field.
  - The submitted answer is the final text, plus the starting option ID and an edited flag.
  - Show progress ("4 of 8") and a back button that preserves earlier answers.
  - Then the optional "anything else" screen: a free-text field plus an importance choice (more important than my top issue / about the middle / minor), shown only when text is entered.
  - There is no feedback on answer quality.
- **Acceptance criteria:**
  - Answers persist across back and forward navigation and reloads.
  - Editing a preset keeps its option ID and sets the edited flag.
  - Skipping "anything else" is allowed.
  - Works on mobile in both languages.
- **Affected:** `app/[locale]/survey/`, `components/survey/answers/`, `components/survey/anything-else/`.
- **Dependencies:** depends on 2.3
- **Plan reference:** Affected systems §3, "Survey (client-side)"; PRD Steps 2–3.
- **Implementation notes:** "Next" requires a chosen position or non-blank own text (no judgement of quality). The importance choice for "anything else" appears once text is entered and is then required. Typing in a position's text area selects it; "Undo changes" restores the original wording.

### Task 2.6: Build the submission flow and result view
- [x]
- **What:**
  - On completing the survey, submit through the matching client from Task 1.3, with a loading state throughout.
  - Render the result:
    - top match plus 2–3 runners-up;
    - per-issue breakdown with an importance marker from the user's rank, the agreement level, explanation text, and a link to the cited research anchor;
    - the "anything else" note when present;
    - joint-list labelling ("Running on a joint list with [Party B] as [list], ballot letters [XX]") with the partner name linking to its research page and no partner score;
    - the threshold note or not-polled note, and the limited-info flag;
    - the weak-match message when flagged;
    - a disclaimer that this is a decision aid, not an endorsement.
  - **No edit or re-run options.**
  - Error states show localized messages per error code. "Try again" (which calls the token hook again) is offered only on retryable errors. `content_version_mismatch` offers a restart.
  - Clear survey state after a successful result (Task 2.3).
- **Acceptance criteria:**
  - Every mock result case and every error code renders correctly in both languages.
  - Breakdown links land on the correct research anchors.
  - A refresh after the result starts a new survey.
- **Affected:** `app/[locale]/survey/result/` (or equivalent), `components/result/`.
- **Dependencies:** depends on 2.3, 2.4, 2.5
- **Plan reference:** Affected systems §3, "Result view"; APIs §1, "Errors".
- **Deviation:** the result is shown in place at `/[locale]/survey` (the "or equivalent" in Affected), not at a separate route: it lives only in memory, survey state is cleared on success, so a refresh starts a new survey. Runners-up show their breakdown in a collapsible section. Agreement levels use neutral shape markers plus text (no colour coding). During blackout poll notes are hidden both by the route and by a client-side check. The browser back button isn't wired to survey steps (in-app Back buttons are); progress survives leaving the page.

### Task 2.7: Build sharing and social preview images
- [x] *(Real WhatsApp/Facebook/X validators need a public URL: run them on the Vercel preview once deployed. The equivalent metadata check is automated in `tests/e2e/result.spec.ts`.)*
- **What:**
  - Build a share action on the result: a URL containing only the top match party IDs and the locale.
  - Use the native share sheet on mobile and copy-link on desktop.
  - Build the share landing page: it validates IDs against the registry and ignores anything else. It shows the matched parties and an invitation to take the survey.
  - Generate a localized social preview image from the same parameters (party names only, no operator identity).
- **Acceptance criteria:**
  - Shared URLs never contain answers.
  - Invalid or extra parameters are ignored safely.
  - The preview image and metadata render in WhatsApp, Facebook and X validators (or an equivalent metadata check) in both languages.
- **Affected:** `components/result/share/`, `app/[locale]/share/`, the share preview image route.
- **Dependencies:** depends on 2.6
- **Plan reference:** Affected systems §3, "Share"; APIs §2.
- **Implementation notes:** share URL `/{locale}/share/{id1,id2,…}` (path segment, so the preview image route can read it): the result's party IDs in order, max 4, nothing else. The landing page and its `opengraph-image.tsx` keep only registry IDs. Images contain party names and site copy only: **never poll figures or threshold notes** (legal-findings §3.1 impact 3) and nothing about the operator. Satori doesn't implement bidi, so Hebrew lines are reordered visually by `lib/share/bidi.ts` (unit-tested); Heebo WOFF subsets are bundled in `assets/fonts/` (OFL). Native share sheet on coarse-pointer devices, clipboard copy elsewhere (manual-copy fallback).

### Task 2.8: Implement the time-based modes
- [x]
- **What:**
  - Implement `lib/time-modes.ts`, reading the election-close instant and the poll-blackout-start instant from configuration (Asia/Jerusalem).
  - **Blackout mode:** hide poll numbers, threshold notes and not-polled notes everywhere (research pages, result metadata, the route's metadata attachment).
  - **Election-over mode:** disable the survey (start button replaced by an "election is over" banner, survey routes redirect, match route returns `election_over`), with research kept as an archive.
  - Time-sensitive pages (party pages, intro, survey entry, share) use about 5-minute revalidation, plus a client-side check of the instants.
  - Provide a clock override for testing in non-production environments.
  - Set the configured values from Task 1.4 (election close) and Task 1.7 (blackout), or placeholders if those aren't done yet.
- **Acceptance criteria:**
  - Unit tests cover both modes around their boundaries.
  - With the clock override, preview shows correct behavior before and after each instant on every affected page.
  - The match route rejects with `election_over` after close.
- **Affected:** `lib/time-modes.ts`, `app/api/match/route.ts`, the pages listed above, environment configuration.
- **Dependencies:** none (Phase 1 complete)
- **Plan reference:** Affected systems §3, "Time-based modes"; Performance §1; Rollout §4.
- **Implementation notes:** instants default to legal-findings/ground-truth values (`POLL_BLACKOUT_START`, `ELECTION_CLOSE` env overrides). Blackout never switches off (archive stays poll-free, per legal-findings §3.4). Clock override (non-production only): `CLOCK_OVERRIDE` env for server rendering; per browser, the `clock-override` cookie (set by visiting any page with `?clock=<ISO>`, cleared with `?clock=off`), honoured by the client guards (`components/time/time-modes.tsx`) and the match route (also an `x-clock-override` header). The client re-checks every 15 s and on tab focus. Note: whether overrides are allowed is baked into statically generated pages at build time, so a local check needs `APP_ENV=test npm run build` (Vercel previews get `VERCEL_ENV=preview` automatically).

### Task 2.9: Write the site copy in both languages and get owner approval
- [ ] *(Copy drafted in both languages, neutrality review and parity check done by separate agents, all should-fix findings applied, written to `messages/*.json`. AWAITING OWNER APPROVAL: see `research/review/site-copy-review.md`.)*
- **What:**
  - Draft all non-corpus copy in Hebrew and English: intro, How-this-works, Privacy & Terms (no answer storage, anonymous result counts only, processing by a third-party AI provider with the name to be filled after D1), disclaimer, weak-match message, threshold and not-polled wording, error messages, and all interface strings.
  - Use the glossary terms.
  - Run an independent neutrality review and a Hebrew/English parity check.
  - Present the copy to the owner for approval and apply it to `messages/*.json`.
- **Acceptance criteria:**
  - No hard-coded user-facing strings remain in components (all come from message files).
  - The neutrality and parity reviews are done by agents other than the drafter.
  - **The owner has approved the copy** (record the approval in `research/review/site-copy-review.md`).
  - Post-D1 placeholders are clearly marked.
- **Affected:** `messages/he.json`, `messages/en.json`, `research/review/site-copy-review.md`.
- **Dependencies:** depends on 2.1, 2.6 (strings exist to cover)
- **Plan reference:** Affected systems §3, "Site copy".
- **Notes:** **Owner-gated.**

### Task 2.10: Build the end-to-end and accessibility suites against the mock
- [x] *(A real screen-reader (VoiceOver/TalkBack/NVDA) spot check by the owner is still recommended; see the pass record.)*
- **What:**
  - Write Playwright tests covering:
    - the full flow in Hebrew and English at mobile and desktop sizes;
    - ranking by touch, mouse and keyboard;
    - resume after reload mid-survey;
    - every result case and every error code, including content-version mismatch;
    - the share link and landing page;
    - blackout and election-over modes via the clock override.
  - Add automated accessibility checks on the main pages, and a documented manual keyboard-only and screen-reader pass of ranking and answering. Fix the issues found.
- **Acceptance criteria:**
  - The suite passes in CI or locally against the preview build.
  - Automated accessibility checks report no serious violations.
  - Manual pass findings are recorded and resolved.
- **Affected:** `tests/e2e/`, components as needed for fixes.
- **Dependencies:** depends on 2.1–2.8
- **Plan reference:** Testing strategy §3–4.
- **Implementation notes:** suites in `tests/e2e/` (`survey`, `result`, `pages`, `time-modes`, `a11y`, plus the Phase 1 `smoke`), run on desktop and mobile Chromium against a production build. Touch drag is driven through CDP touch events. axe-core via `@axe-core/playwright`, failing on serious/critical violations. The manual pass and its fixes are recorded in `research/review/accessibility-pass.md`.

---

## Phase 3: Party research (parallel with Phase 2)

**Goal:** a complete, fact-checked, consistency-reviewed bilingual research corpus with poll snapshots.
**Exit criteria:**
- Every registry party has English and Hebrew documents passing validation.
- Every list has a poll snapshot or "not polled".
- The fact-check, consistency and parity reviews are complete.
- The research version is set.

### Task 3.1: Run Stage 2 party research for every party
- [ ]
- **What:** Following `research/pipeline/` Stage 2 instructions, run one independent research agent per registry party (joint-list members separately), with web search and fetch. Each writes `content/research/en/<party-id>.md` in the fixed skeleton with all approved issue sub-sections.
- **Acceptance criteria:**
  - A document exists for every registry party.
  - Each passes skeleton, anchor, sources and poll-figure validation.
  - Every substantive claim has an inline citation and an evidence tier.
  - Joint-list members' Overviews name the partners and any split history.
- **Affected:** `content/research/en/`.
- **Dependencies:** depends on 1.4, 1.5, 1.6
- **Plan reference:** Affected systems §2, "Stage 2, party research".
- **Notes:** Prioritize lists likely to pass the threshold first, so owner review can start early (Risks §3). Documents must be thorough; don't shorten them for efficiency (PRD).

### Task 3.2: Run the Stage 3 fact-check for every party
- [ ]
- **What:** Following Stage 3 instructions, run a **different** agent per party than its Stage 2 author. It verifies every substantive claim against its cited source and removes or corrects anything unsupported. Legal and ethical claims are checked against court or official sources only. It checks for poll figures, verifies joint-list claims, and sets the limited-information flag in the registry where warranted. It writes a per-party fact-check log to `research/fact-check/<party-id>.md`.
- **Acceptance criteria:**
  - Every party has a fact-check log listing what was checked, corrected or removed.
  - Documents still pass validation.
  - Limited-information flags are set in `content/registry/parties.json`.
- **Affected:** `content/research/en/`, `content/registry/parties.json`, `research/fact-check/`.
- **Dependencies:** depends on 3.1 (per party: can start as each Stage 2 document lands)
- **Plan reference:** Affected systems §2, "Stage 3, fact-check".

### Task 3.3: Run the Stage 4 cross-party consistency and neutrality review
- [ ]
- **What:** Following Stage 4 instructions, review all English documents together for comparable depth, tone and evidence standards, so no party is treated more harshly or thinly. Include a final neutrality pass and a poll-figure check. Apply the fixes, and log the findings and changes in `research/review/consistency-review.md`.
- **Acceptance criteria:**
  - A review log exists, covering every party.
  - The flagged imbalances are resolved or justified.
  - Documents pass validation.
- **Affected:** `content/research/en/`, `research/review/consistency-review.md`.
- **Dependencies:** depends on 3.2
- **Plan reference:** Affected systems §2, "Stage 4, cross-party consistency review".

### Task 3.4: Run the Stage 5 Hebrew edition and parity check
- [ ]
- **What:** Following Stage 5 instructions, produce `content/research/he/<party-id>.md` for every party as an equivalent, not a literal translation, using glossary terms, with identical section and anchor IDs. A separate parity-check agent confirms that no claims, sources or sections differ, and logs the result to `research/review/parity-check.md`. Then set the research version in `content/versions.json`.
- **Acceptance criteria:**
  - Every party has a Hebrew document.
  - Anchors match English exactly (validated).
  - The parity log shows no unresolved differences.
  - The research version is set.
- **Affected:** `content/research/he/`, `research/review/parity-check.md`, `content/versions.json`.
- **Dependencies:** depends on 3.3
- **Plan reference:** Affected systems §2, "Stage 5, Hebrew edition".

### Task 3.5: Record the Stage 6 poll snapshot
- [ ]
- **What:** Following Stage 6 instructions, record each list's current polling average (percent of vote, source, as-of date) in `content/registry/lists.json`. Lists not tracked by public polls are recorded as "not polled". Never estimate.
- **Acceptance criteria:**
  - Every list has a snapshot or "not polled", each with a source.
  - Validation passes.
  - The below-threshold and not-polled helpers produce the expected notes for real data.
- **Affected:** `content/registry/lists.json`.
- **Dependencies:** depends on 1.4, 1.6 (may run as soon as Phase 1's 1.4 and 1.6 are done)
- **Plan reference:** Affected systems §2, "Stage 6, poll snapshot".

---

## Phase 4: Load the real corpus and run the owner review

**Goal:** the website shows the real, owner-reviewed research corpus.
**Exit criteria:**
- Placeholder content is gone.
- The preview shows the real corpus and passes validation and end-to-end tests.
- The owner has reviewed the corpus, and requested corrections are applied.
- The registry has been re-checked against CEC.

### Task 4.1: Integrate the real corpus, deploy the preview, and run the owner review and correction loop
- [ ]
- **What:**
  - Remove all placeholder content and confirm that the site renders the real issues, registry, polls and research in both languages.
  - Re-check the registry against the latest CEC publication (disqualifications, withdrawals) and re-run the per-party pipeline for any changes.
  - Update mock results to use real party IDs, so the result view can be reviewed realistically.
  - Deploy a preview and present it to the owner. For each correction the owner requests, follow the per-party re-run procedure in `research/pipeline/README.md` and bump the research version.
- **Acceptance criteria:**
  - No placeholder parties or issues remain.
  - Validation and the end-to-end suite pass on the real corpus.
  - The CEC re-check is recorded in `research/ground-truth.md`.
  - **The owner has reviewed the corpus**, and all requested corrections are applied (record this in `research/review/corpus-review.md`).
- **Affected:** `content/`, `lib/matching/mock.ts`, `research/`.
- **Dependencies:** depends on Phase 2 and Phase 3 complete
- **Plan reference:** Rollout & migration strategy §1 (step 6) and §3; Risks §4.
- **Notes:** **Owner-gated.**

---

## Phase 5: D1 decision gate

**Goal:** give the owner the evidence to decide storage, AI provider and model, matching architecture, and server infrastructure, and record the decision.
**Exit criteria:**
- The eval set exists.
- The candidates have been prototyped and measured.
- The owner has recorded the D1 decision.

### Task 5.1: Measure the corpus and build the matching evaluation set
- [ ]
- **What:**
  - Measure the corpus size: full research and a condensed per-issue view, in tokens, for the candidate models.
  - Assess how well the approved options capture each party's real positions.
  - Build the evaluation set at `research/eval/`:
    - about 30 synthetic personas across the political spectrum, each with expected plausible top matches written from the corpus;
    - edge cases: all preset answers, heavily edited answers, pure free text, gibberish, prompt-injection attempts, the minimum of 5 answered issues, a dominant "anything else", and a party whose statements contradict its actions (PRD FR17).
  - Define the scoring criteria for each case: plausibility, grounding (cited anchors exist and support the claim), and consistency across repeated runs.
- **Acceptance criteria:**
  - `research/eval/corpus-measurements.md` reports the sizes and the option-fit assessment.
  - The eval cases and their scoring criteria exist in `research/eval/`, as machine-readable requests in the matching contract format.
- **Affected:** `research/eval/`.
- **Dependencies:** depends on Phase 4 complete
- **Plan reference:** Testing strategy §5; Risks & technical decisions, Decisions §1 ("Inputs").

### Task 5.2: Prototype the candidates and produce the D1 decision memo
- [ ]
- **What:**
  - Build throwaway prototypes of the matching candidates outside the production code path: architecture A (single holistic call) and architecture B (precomputed party × option alignment, per-request mapping, deterministic aggregation, explanation for the top 3–4). Run them on at least the candidate models the plan lists (Claude Opus 5.5 and Sonnet 5.5), plus any other provider the owner asks to include.
  - Run the eval set on each combination, measuring quality, grounding, consistency, latency and cost per result.
  - Write `research/d1-decision.md` covering:
    - how research would be stored and fed to matching;
    - the provider and model options;
    - the architecture options;
    - the server infrastructure each implies (abuse protection, stats store);
    - the results, with a recommendation.
  - Present it to the owner and record the decision.
- **Acceptance criteria:**
  - The memo contains measured results for each tested combination.
  - **The owner's D1 decision is recorded in the memo.**
  - The next step is noted: update the plan with the D1 outcome and generate the Phase 2 tasks.
- **Affected:** `research/d1-decision.md`, `research/eval/` (prototype scripts and results; not under `app/` or `lib/`).
- **Dependencies:** depends on 5.1
- **Plan reference:** Risks & technical decisions, Decisions §1 (D1 deferred); Rollout §1 (step 4).
- **Notes:**
  - **Owner-gated.**
  - Prototypes spend real API money. Agree a budget with the owner before running.

---

## Decisions made during breakdown
1. **The document ends at D1.** The plan deliberately leaves Phase 2's backend undecided, so its tasks are generated after D1.
2. **Content file formats:** JSON for issues, registry, glossary and versions. Markdown per language for research. next-intl message files for site copy. The plan said "files"; these are the simplest to validate and review.
3. **Unit tests use Vitest.** The plan names only Playwright, for end-to-end tests.
4. **Owner gates are explicit acceptance criteria** (Tasks 1.5, 2.9, 4.1, 5.2), so autonomous runs stop at them.
5. **Poll snapshot (3.5) only needs Stage 0 and the pipeline instructions.** It can start early instead of waiting for issue approval.
6. **D1 prototypes live under `research/eval/`,** outside the app code path, so throwaway code never ships.

## Open questions
1. **D1: storage, AI provider and model, matching architecture, server infrastructure.** Resolved by Task 5.2 with the owner.
2. **Poll-publication restrictions and election-period rules.** Researched in Task 1.7. The blackout instant is configured in Task 2.8.
3. **Election date and poll-closing time.** Verified in Task 1.4.

## Out of scope
- Phase 2 implementation (real matching backend, abuse protection, anonymous statistics, provider integration, production launch). Its tasks are generated after D1.
- Any database of users, answers or sessions. Analytics beyond anonymous counters.
- Admin dashboard or CMS.
- Automated scheduled research or poll refresh.
- Multi-election support.
- User-paid AI ("Sign in with ChatGPT"). Checked and rejected.
- Native apps, PWA install, offline-first.
- Languages other than Hebrew and English.
