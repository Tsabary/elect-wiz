# Technical Plan: Israeli Election Party Matcher

> Source PRD: `prd-israeli-election-party-matcher.md`

## Approach summary
Greenfield project: the working directory contains only the PRD and this plan. There is no existing code, convention or infrastructure to reuse.

The work is split into **two phases** with a decision gate between them:

- **Phase 1, run in parallel:**
  - **(a) Website as a functional mock.** A complete bilingual (Hebrew RTL default, English) Next.js + TypeScript front end covering every page and flow in the PRD. It runs against a **mock matching adapter** that returns realistic canned results, and isn't connected to any real AI or storage backend. It is built against a fixed **request/response contract**, so Phase 2 plugs in without UI changes.
  - **(b) Research pipeline.** AI agents run from Claude Code. They establish the official ballot lists, draft the 10 issues and answer options (**reviewed and approved by the owner before anything is locked**), then research, fact-check, cross-review and translate one document per party.
- **Decision gate D1, after research.** With the real corpus in hand, the owner decides **how the research is stored and served to matching, which AI provider and model run the matching, and the matching architecture**. The server-side infrastructure that follows from those choices (matching endpoint, abuse protection, stats store) is confirmed at the same point.
- **Phase 2, make it functional.** Build the chosen matching backend, swap the mock adapter for it, evaluate, and launch.

This plan fully specifies Phase 1. For Phase 2 it records the **candidate designs and current recommendations** as input to D1, explicitly marked as not yet decided.

## Affected systems & components
All components are new.

### Phase 1

1. **Content corpus (new).** Version-controlled files that are the single source of truth for everything users read:
   - the 10 issues (descriptions, more-info text, question framing, 3–6 options, in Hebrew and English);
   - the party and list registry;
   - the poll snapshot;
   - the research documents.

   Validated by an automated schema and completeness check that blocks the build when content is incomplete or inconsistent (see Testing). During Phase 1, sample or placeholder content stands in until each research stage delivers. This is the research's *output format* and what the site displays. How matching consumes it is a D1 question.

2. **Research pipeline (new, offline, not deployed).** An orchestrated set of AI agents run from Claude Code. Using Claude Code as the research tool is independent of which AI the live site uses (decided at D1). Each stage is done by separate agents, so no agent reviews its own work:
   - **Stage 0, ground truth.** Verify the official election date and poll-closing time, and the **official list of approved ballot lists** from the Central Elections Committee (CEC): list names, ballot letters, member parties of joint lists, top of each candidate list. This list defines the registry. Nothing is researched from memory.
   - **Stage 1, issues and answers (owner-gated).**
     - Research what the 10 most pressing issues in Israeli society are right now.
     - For each issue, draft the description, more-info text, question framing and the most common real-world positions (3–6 options; most issues have 3–4), in Hebrew and English as equivalents, using Israeli-neutral terminology.
     - Produce a **bilingual terminology glossary** of approved Israeli-neutral terms.
     - An **independent neutrality review agent** checks for loaded terms and missing major positions.
     - The result goes to the owner as a **readable review document**: each issue with why it made the list and the sources behind that, its options in both languages, the glossary, and the issues considered but left out, with reasons. The owner iterates on it with the agents until approving it.
     - **Nothing downstream is locked until then.** Party research (Stage 2) doesn't start until the issue list is approved, because each research document has one section per issue. The mock website uses the draft issues in the meantime.
   - **Stage 2, party research.** One independent agent per party (joint-list members researched separately), with web search and fetch. Each writes the PRD's 9-section document, with one sub-section per approved issue, evidence tagged by tier (action / formal commitment / statement), action-vs-statement contradictions stated explicitly, and inline source citations. For joint-list members, the Overview names the partner party or parties and any history of the parties splitting after past elections (FR13). Written in English, with Hebrew sources read directly.
   - **Stage 3, fact-check.** A different agent per party verifies every substantive claim against its cited source. It removes or corrects anything unsupported, checks the legal/ethical section against court or official sources only, checks that no poll figures appear in the text, verifies joint-list partner and split-history claims, and sets the limited-information flag where warranted.
   - **Stage 4, cross-party consistency review.** Checks for similar depth, tone and evidence standards across parties, so no party is visibly treated more harshly or thinly than another. Includes a final neutrality pass and a poll-figure check. Runs on the English documents, **before** the Hebrew edition.
   - **Stage 5, Hebrew edition.** The Hebrew equivalent of every research document: an equivalent, not a literal translation, using glossary terms. A parity-check agent confirms that no claims, sources or sections differ between languages. Any later change to a party's English document triggers that party's Hebrew re-run and parity check.
   - **Stage 6, poll snapshot.**
     - The current polling average for each list, with source and date, recorded on the list entity.
     - Lists that public polls don't track are recorded as **"not polled"**. Agents must never estimate a figure.
     - **Research documents must contain no poll figures.** The Overview's polling line is rendered from the snapshot through the blackout logic, so the blackout can hide it. A "poll figure" means polling or survey wording next to a number, seat count or percentage. Current Knesset seats and past election results are allowed.

   The pipeline must be **re-runnable per party** (research → fact-check → per-party consistency check → Hebrew), so the owner can request corrections (PRD FR14) or a poll refresh (FR21) without redoing everything. The owner reviews the final corpus before launch.

3. **Web app (new).** Next.js App Router, TypeScript, Tailwind. It's static-first and deployed to Vercel preview for owner review:
   - **Static pages, both languages:**
     - intro, with the short privacy note linking to Privacy & Terms;
     - How-this-works;
     - **Privacy & Terms**: explains that answers aren't stored, that only anonymous result counts are kept, and that answers are processed by a third-party AI provider, with the provider's name filled in after D1;
     - Parties index, alphabetical by current-language name;
     - per-party research pages, rendered from the research documents with per-issue anchors, sources and the researched-as-of date.
   - **Language:** Hebrew is the default. English is auto-selected from the browser's language preference on first visit, with a manual switch on every page that is remembered.
   - **Site copy:** all non-corpus text (intro, How-this-works, Privacy & Terms, disclaimer, weak-match, threshold and not-polled wording, UI strings) is drafted in both languages, goes through the same neutrality review and Hebrew/English parity check as the issues, and is approved by the owner. The matching section of How-this-works and the provider name on Privacy & Terms are finalized after D1.
   - **Survey (client-side):** ranking (random pool → ranked list, up to 5 "doesn't matter"), per-issue answering (preset options shown as editable text areas, plus a write-your-own field, shuffled options, progress, back), "anything else" with an importance choice, a loading state.
   - **Result view:** top match plus 2–3 runners-up, per-issue breakdown with an importance marker per issue, joint-list labelling with the partner shown, threshold note, limited-info flag, weak-match message, disclaimer, links to research anchors, share. **No edit or re-run affordances.** An error state may offer "try again", which isn't a re-run of a successful result.
   - **Share:** a URL encoding only the top match party IDs and language, never answers. It leads to a landing page with an invitation to take the survey and a generated social preview image. Native share sheet on mobile, copy-link on desktop.
   - **Time-based modes:** poll blackout (poll numbers and threshold labels hidden everywhere from a configured instant) and election over (survey disabled, "election is over" banner, research kept as an archive).
   - **Mock matching adapter:** sits **behind the real matching route** (a Next.js route handler), not in the browser, so the UI exercises the real network, timeout and error path from day one. It implements the matching contract (see APIs) with canned, realistic results covering every result-view case: joint list, below-threshold, not-polled note, limited info, weak match, error types. It's selected by configuration, so Phase 2 swaps it out without touching the UI.
   - **Operator anonymity:** no operator name anywhere on the site, in page metadata or in the social preview images. The domain uses WHOIS privacy. If the repository is ever public, commits use a non-identifying git identity.

### Phase 2 (candidate design, confirmed at D1)

4. **Matching backend:** the real implementation of the matching contract. Its architecture, provider, model and corpus storage are decided at D1 (see Decisions). Whatever is chosen, it validates submissions, enforces abuse protection, runs matching, attaches factual metadata deterministically (never AI-generated), increments anonymous counters, and never logs request bodies.
5. **Abuse and cost protection.** Candidate: Cloudflare Turnstile (invisible/managed) as the main per-user gate. A fresh token is obtained at submission and on every "try again", since tokens are single-use and expire after about 5 minutes. A per-IP rate limit as a NAT-tolerant backstop. A global daily request cap plus a kill switch held in a runtime store, so changes are instant. A spend limit on the AI provider account.
6. **Anonymous statistics.** Candidate: daily counters in a managed key-value store (e.g., Upstash Redis via the Vercel Marketplace), read in the provider console. No admin UI.

## Data model & schema changes
No database of user data at any phase.

### Phase 1
1. **Issue definition (corpus):** stable issue ID. In each language: title, one-line description, more-info text, question framing. Plus 3–6 options, each with a stable option ID and text in each language.
2. **Registry (corpus):**
   - **Party:** stable party ID, names in each language, list ID, short leader name, limited-information flag, research-document reference, researched-as-of date.
   - **List:** list ID, names, ballot letters, member party IDs, poll snapshot. The threshold applies at list level.
   - **Poll snapshot:** only on the list. Either a polling-average percent of the vote with source and as-of date, or "not polled".
   - **Below-threshold rule:** polling average under 3.25%. Deterministic and unit-tested. **"Not polled" lists** get a separate factual note ("This list doesn't appear in published polls"), also hidden during the poll blackout.
3. **Research document (corpus):** one markdown document per party per language, in a **fixed section skeleton** matching the PRD's 9 sections. Section 3 has exactly one sub-section per issue ID, and section 4 has per-topic sub-sections. All have stable, machine-readable anchors, identical across languages. Sources are a numbered list referenced inline.
4. **Content versioning:** two independent versions.
   - The **survey-content version** covers issues and options. Changing it invalidates in-progress surveys, which is rare because these are frozen at Stage 1 approval.
   - The **research version** covers research documents and poll snapshots. Research corrections and poll refreshes never invalidate surveys.
5. **Survey progress (browser local storage only):** schema version, survey-content version, shuffle seeds for issue order and per-issue option order (option order is kept on resume; the unranked pool is reshuffled on every page load), ranking state, "doesn't matter" set, per-issue answers, the "anything else" text and importance. Cleared once a result is shown, so a refresh starts over (PRD). Discarded on load if the survey-content version doesn't match.

### Phase 2 (candidates, confirmed at D1)
6. **Matching artifacts:** whatever derived form of the research the chosen matching needs. Candidates:
   - condensed per-party, per-issue position summaries, evidence-tiered and anchored, plus an other-notable-positions summary per party;
   - and, for architecture B, a party × option alignment table.

   Whatever is chosen must keep evidence tiers (so FR17 survives into matching) and must be generated from the final English research, verified against its anchors by a separate agent, included in a per-party consistency check, and regenerated whenever a party is re-run.
7. **Anonymous counters:** per day, a total and, per party, top-match and runner-up counts. No finer timestamps, identifiers, answers or IP. Results with no usable answers aren't counted. A separate per-day request counter is incremented before each AI call (including retries), and the daily cap is checked against it.
8. **Rate-limit keys:** a salted hash of the client IP with a TTL of hours. Never associated with submission content.
9. **Runtime switches:** the kill switch and daily cap value, in the runtime store so they take effect instantly. If the store is unreachable, matching fails closed with the "at capacity" message. The static site is unaffected.

## APIs & interfaces

### Phase 1 (fixed now; the mock implements it, Phase 2 replaces the implementation)
1. **Matching contract:**
   - **Input:**
     - UI language and survey-content version.
     - The ordered list of ranked issue IDs (5–10), and the "doesn't matter" issue IDs (up to 5, disjoint from the ranked list, together covering all 10).
     - For each ranked issue: the final answer text, the preset option ID it started from (if any), and whether it was edited.
     - Optional "anything else" text plus its importance (one of three values).
     - An abuse-protection token field. The submit and "try again" paths call a **token-provider hook** that does nothing under the mock. Phase 2 fills it in (e.g., fetching a fresh Turnstile token each time).
   - **Validation:** known IDs; the set rules above; per-answer length cap (about 1,000 characters) and total size cap; survey-content version must match (otherwise "content updated, please restart").
   - **Output:**
     - **Result entries:** 1 top plus 2–3 runners-up, in order. Each has:
       - a party ID;
       - a per-issue breakdown: issue ID, the user's rank for that issue (plus a computed weight if the chosen architecture produces one), agreement level (agrees / partially / disagrees / party-position-unclear), explanation text in the UI language, and the cited research anchor;
       - an optional "anything else" note, citing a section 3 or section 4 anchor.
     - **Weak-match flag.**
     - **Unusable answers:** zero weight and omitted from the shown breakdown, since users get no feedback on their answers. "Party-position-unclear" refers only to the party. If no answer is usable, the result is the closest matches with the weak-match message.
     - **Metadata, attached deterministically from the registry:** names, list name, ballot letters, partner names and IDs, limited-info flag, threshold note or not-polled note (both omitted during blackout).
   - **Transport:** a single POST to a fixed route, JSON in and out. Client timeout of 60 s, showing the loading state throughout.
   - **Errors:** a typed error code in the JSON body plus an HTTP status:
     - `validation` (400);
     - `content_version_mismatch` (409, "content updated, please restart");
     - `abuse_check_failed` (403);
     - `rate_limited` (429);
     - `at_capacity` (503);
     - `election_over` (410);
     - `upstream_failure` (502).

     Each maps to a localized UI message. The client timeout shows as `upstream_failure`. The mock can simulate every code.
2. **Share landing page:** party IDs and language in the URL. It validates the IDs against the registry and ignores anything else. It renders the matches and a call to action, plus the social preview image.
3. **Configuration:** election-close instant (Asia/Jerusalem), poll-blackout-start instant, and matching implementation selector (mock or real). Phase 2 adds provider credentials and the remaining secrets.

## Integrations & external dependencies

### Phase 1
1. **Vercel:** hosting (preview for review, production later), static generation with time-based revalidation for time-sensitive pages, social preview image generation.
2. **Frontend libraries:**
   - **shadcn/ui on Base UI primitives** as the component layer: accessible, RTL-capable, with code owned in the repo. Falls back to shadcn's Radix variant if the Base UI option isn't available in the CLI at scaffold time.
   - dnd-kit (accessible drag-and-drop with keyboard and touch).
   - next-intl (locale routing, RTL).
   - A markdown renderer.
   - A Hebrew-capable web font.
3. **Claude Code agents with web search and fetch:** research pipeline only.
4. **CEC publications and public polling aggregates:** research inputs only, not used at runtime.

### Phase 2 (decided at D1)
5. **AI provider and model for matching.** Undecided. Considerations recorded for D1:
   - **Claude** (`claude-opus-5-5` at $4/$20 per MTok, or `claude-sonnet-5-5` at $2/$10, cache reads $0.20/MTok). Offers structured outputs, prompt caching of the static corpus, and server-side refusal fallback (`fallbacks: "default"` with the `server-side-fallback-2026-07-01` beta header).
   - Other providers are compared on quality on the Hebrew-language eval set, cost per result, structured-output reliability and caching support.
   - Whichever is chosen, the Stage 1 terminology glossary goes into the explanation prompt.
6. **Abuse protection and stats store:** candidates Cloudflare Turnstile and Upstash Redis (see Affected systems).

**Checked and rejected: user-paid AI through "Sign in with ChatGPT" plan usage** (launched at OpenAI DevDay, 2026-09-29):
- Only ChatGPT Plus and Pro subscribers can grant usage. Free users can't.
- Hosted, closed-source apps must submit an interest form and wait for approval.
- Plan-funded requests prohibit system instructions and sampling parameters, and require streaming.
- Per-app weekly caps are set by the user, and apps get no notice when access is revoked.

It's incompatible with the timeline and the audience, and unworkable for the matching design. Default stands: the owner pays.

## Security, privacy & compliance
1. **No personal data at rest**, in either phase. The Phase 2 backend must never log request or response bodies, including in error paths.
2. **AI provider disclosure:** the Privacy & Terms page states that answers are processed by a third-party AI provider and are subject to its data-retention terms. The provider's name is filled in after D1. The intro note stays short and links there.
3. **Operator anonymity:** no operator details on the site, in metadata, preview images or WHOIS. Non-identifying git identity if the repository is ever public.
4. **Prompt injection (Phase 2):**
   - Free text is untrusted. It's delimited as data and declared non-instructional.
   - Output is schema-constrained, then re-validated by the server: party IDs exist, cited anchors exist for that party, entry count is 3–4, text length is capped.
   - Invalid output gets one retry, then an error.
5. **Grounding (FR16):** matching uses only corpus content. Every explanation item cites an anchor, which the UI links to.
6. **Abuse (Phase 2):** Turnstile as the main gate; a NAT-tolerant per-IP backstop (starting about 60 per hour); a daily cap; a kill switch; a provider spend limit.
7. **Share URLs** accept only registry party IDs.
8. **Legal:** poll-publication restrictions and election-period rules are open items. The configurable blackout is built in Phase 1 regardless. Israeli Privacy Protection Law is covered by the no-storage design.
9. **Secrets:** server-side environment variables only (Phase 2).

## Performance & scalability
1. **Static pages are served from CDN.** Pages affected by time switches (party pages for blackout; intro, survey and share pages for election-over) use about 5-minute revalidation plus a client-side check of the configured instants. The blackout instant has a safety margin larger than the revalidation window.
2. **Client:** lean bundle for low-end phones. The survey runs fully client-side once loaded.
3. **Phase 2 latency and cost:** target under about 20 s at p95 with a meaningful loading state. Indicative cost per result from the earlier analysis: about $0.03–0.17 depending on architecture and model, so a viral 100k results would cost about $3k–17k. Hence the cap and kill switch. Confirm the provider's rate-limit tier covers peak load. If the provider supports caching, keep the static corpus prefix byte-identical across requests.

## Observability & error handling
1. **Phase 1:** the mock adapter can simulate every error type, so all error states can be exercised in the UI.
2. **Phase 2:**
   - **Metrics (no PII):** request count, failures by type, latency, token usage per request, abuse rejections, cap hits.
   - **Alerts:** spend threshold, error-rate spike, cap reached.
   - **Errors:** AI failures (timeout, rate limit, refusal, invalid or ungrounded output) show a localized error with "try again". Survey state survives in local storage.
   - **Counters:** a counter failure never fails the user's request.
3. **Content errors** are caught at build time by validation.

## Testing strategy (high-level)
1. **Content validation (build-blocking):**
   - Issues: every issue has all fields in both languages and 3–6 options.
   - Research documents: every registry party has documents in both languages with all 9 sections and all issue sub-sections; anchors are identical across languages; sources are present; the researched-as-of date is present.
   - Registry: joint-list references are symmetric; every list has a poll snapshot or "not polled".
   - Poll figures: no poll figures in research text (heuristic check).
   - Phase 2 adds matching-artifact completeness and anchor checks.
2. **Unit:** contract validation rules, threshold-note logic and blackout suppression, joint-list labelling, share-URL parsing, shuffle and resume determinism. Phase 2 adds scoring and weighting (rank weights, zero weight for "doesn't matter", importance mapping for "anything else", weak-match rule).
3. **End-to-end (Playwright), against the mock in Phase 1 and the real backend in Phase 2:**
   - full flow in Hebrew (RTL) and English, at mobile and desktop sizes;
   - ranking by touch, mouse and keyboard;
   - resume after reload;
   - every error state, including content-version mismatch;
   - share link;
   - election-over and blackout modes via clock overrides.

   Phase 2 adds submitting after more than 5 minutes on the page, and retrying after an error, each with a fresh token.
4. **Accessibility:** automated checks, plus a manual keyboard-only and screen-reader pass of ranking and answering.
5. **Matching evaluation set (built at D1):**
   - about 30 synthetic personas across the spectrum;
   - edge cases: all preset answers, heavily edited answers, pure free text, gibberish, injection attempts, the minimum of 5 answered issues, a dominant "anything else", a party whose statements contradict its actions (FR17);
   - consistency: repeated submissions;
   - grounding: cited anchors exist, and a sample of explanations is checked against the cited section.

   Used to choose the provider, model and architecture at D1, and as a regression check.

## Rollout & migration strategy
1. **Order:**
   1. Stage 0 (ground truth) and website development (against the mock and draft content) start immediately.
   2. Stage 1 issues and answers are drafted and **reviewed with the owner until approved**. Then the survey content is frozen.
   3. Stages 2–6 run per party in parallel, while the website continues.
   4. **D1:** with the finished corpus, measure its size, build the eval set, prototype the candidate architectures and providers, and decide storage, AI provider, model, architecture and server infrastructure.
   5. Phase 2: build the backend, swap the mock out, evaluate.
   6. Owner review of the full corpus and a sample of real results.
   7. Production launch.
2. **Environments:** Vercel preview for owner review throughout, then production. Single deploy, no data migrations.
3. **Corpus updates after launch:** re-run the affected per-party stages (and, in Phase 2, regenerate that party's matching artifacts), pass validation, redeploy. Only the research version changes.
4. **Time-based switches:** verified on preview with clock overrides before launch.
5. **Rollback:** Vercel instant rollback. The kill switch (Phase 2) disables matching while the content site stays up.
6. **Post-election:** survey and matching disabled automatically. Content stays as an archive. Counters are retained for the owner.

## Risks & technical decisions made

### Decisions
1. **D1 is DEFERRED until research is complete (owner's call).** It covers four things:
   - how research is stored and fed to matching;
   - the AI provider and model for matching;
   - the matching architecture;
   - the server-side infrastructure that follows from those.

   **Inputs:** corpus size (full and condensed), how well the options capture parties' real positions, and eval-set results, cost per result and latency for each candidate.

   **Current recommendations, offered as input and not decided:**
   - **No embeddings or vector store.** The corpus is small, fixed and fully enumerable, so retrieval adds recall errors.
   - **Architecture B (hybrid).** A precomputed party × option alignment table, per-request AI mapping of edited or free-text answers onto it, direct scoring for answers resembling no option, deterministic weighted aggregation, and an AI explanation for the top 3–4 only. Chosen for consistency, exact ranking weights, auditability and cost that doesn't depend on research size.
   - **The alternative, A:** a single holistic AI call.
   - **Owner requirement for any architecture: an answer-normalization step before matching.** A separate, earlier AI step turns each raw answer into a clear, self-contained statement of what the user wants, resolved against that issue's options. For example, free text "all of the above" on cost of living becomes the explicit list of the four approaches. The party-matching step never receives raw shorthand such as "all of the above" or "option 2 but cheaper". It receives only the normalized positions, plus the importance weights.
   - **Owner requirement for any architecture: recency.** Matching judges each party on its current positions and leadership. Evidence from 2021 onwards outweighs older evidence, and older evidence never decides a party's position on its own (owner decision, 2026-10-07; the research follows the same rule).
2. **Two phases, with a mock behind a fixed contract.** The UI is complete and reviewable before backend decisions, and Phase 2 is a drop-in.
3. **Issues and answers are owner-approved before locking, and party research waits on that approval.** Research documents are structured per issue, so changing issues later would mean redoing research.
4. **Research output is version-controlled markdown with a fixed skeleton.** Needed for owner review, for site display and for any D1 option.
5. **Next.js on Vercel, TypeScript, Tailwind, shadcn/ui (Base UI).** Server-rendered HTML makes the research pages discoverable by search engines and AI crawlers. It's also required for share previews (social crawlers don't run JS) and gives native timed revalidation for the time switches. Chosen over Vite + React for those reasons. shadcn/ui on Base UI gives accessible primitives (a PRD requirement) without a heavy dependency.
6. **Claude Code agents run the research pipeline.** This is the research tooling only. The live site's AI is decided at D1.
7. **English is canonical for research; Hebrew is a parity-checked equivalent.** Issue texts are written in both languages from Stage 1.
8. **Separate agents for writing, fact-checking and reviewing.**
9. **The CEC list is the registry's source.**
10. **Factual metadata comes from the registry, never from AI.**
11. **Survey progress is cleared after a result.** A refresh starts over.
12. **Share encodes party IDs only.**
13. **"Sign in with ChatGPT" user-paid AI was checked and rejected** (see Integrations).
14. **Unpolled lists get a factual "doesn't appear in published polls" note** (owner decision), treated like the threshold note: deterministic, from the registry, hidden during blackout.

### Risks
1. **Research accuracy and hallucination.** The core liability. Mitigated by citations, separate fact-checking, official-only sources for legal matters, and owner review.
2. **Perceived bias.** Mitigated by Stage 1 neutrality review, owner approval of issues, and Stage 4 cross-party review.
3. **Timeline.** Owner review (issues first, then the corpus) is the bottleneck. Stage 1 approval gates all party research, so it should happen early.
4. **Ballot list volatility.** Re-check the registry against CEC before launch.
5. **Phase 2 is compressed.** All backend work happens after research. Keeping the contract fixed and the mock faithful minimizes integration risk.
6. **Cost spikes (Phase 2).** Cap, kill switch, spend limit, alerts.
7. **Legal exposure.** Poll ban and election-period rules (open questions). Blackout built in.
8. **Prompt injection and model refusals (Phase 2).** Schema plus re-validation; fallback and eval coverage.

## Out of scope (technical)
- Any database of users, answers or sessions; analytics beyond anonymous counters.
- Admin dashboard or CMS.
- Automated scheduled research or poll refresh.
- Multi-election support.
- User-paid AI (checked and rejected).
- Native apps, PWA install, offline-first.
- Languages other than Hebrew and English.

## Open technical questions
1. **D1: storage, AI provider and model, matching architecture, server infrastructure.** Blocks Phase 2 only. Decided after research.
2. **Poll-publication restrictions and election-period rules.** Research the exact rule and set the blackout instant. Confirm whether election-day rules affect the tool. Blocks launch configuration, not building.
3. **Election date and poll-closing time.** Verified in Stage 0.
