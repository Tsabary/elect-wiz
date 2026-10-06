# Handoff: where the project stands and how to continue

Last updated 2026-10-06. Nothing is running. The working tree is clean on branch `build/party-matcher`.

This note is for the next orchestrating agent. Read it fully before starting. The previous orchestrator ran the project through a long session with the owner, and this note records what that session decided that isn't obvious from the repository.

## 1. Where things stand

| Phase (from `tasks-israeli-election-party-matcher.md`) | Status |
|---|---|
| Phase 1: foundations and ground truth (1.1–1.7) | Done, audited, committed. The Vercel preview deploy is deliberately set aside by the owner ("don't worry about deployment"). |
| Phase 2: website pages and flows (2.1–2.10) | Done, audited, committed. Site copy (2.9) approved by the owner. |
| Task 1.5: the 10 survey issues | Approved by the owner issue by issue, locked and committed (`824284b`). `surveyContentVersion` = `2026-10-06.1`. |
| **Phase 3: party research (3.1–3.5)** | **Not started. This is next.** The owner has said to start it. |
| Phase 4: load the real corpus and run the owner review (4.1) | Waits on Phase 3. Owner-gated. |
| Phase 5: D1 decision gate (5.1–5.2) | Waits on Phase 4. Owner-gated, and it spends API money, so agree a budget first. |

Key files:
- **Issues (locked):** `content/issues/*.json` (EN and HE), `content/glossary.json`. The record of approval is `research/review/issues-final-approved-en.md`, plus the top section of `research/review/issues-review.md`, plus `research/review/issues-fact-check.md`.
- **Registry:** `content/registry/lists.json` (38 lists) and `content/registry/parties.json` (52 parties) from the CEC. Recheck it against the CEC's final publication of 18 Oct (Task 4.1). `research/ground-truth.md` has the sources.
- **Research pipeline instructions:** `research/pipeline/README.md` plus one file per stage (Stages 2–6). Phase 3 follows these.
- **Legal:** `research/legal-findings.md`. Poll blackout from 2026-10-23T12:00+03:00. Never put poll figures in share images, and never publish result tallies.
- **Corpora:** the site uses the fictional placeholder corpus in `content/placeholder/` by default (`CONTENT_CORPUS` env var). Real research goes to `content/research/{en,he}/<party-id>.md`. The switch-over and placeholder deletion happen in Task 4.1, not Phase 3.

## 2. How to run Phase 3

Use the `autopilot-tasks` skill on Phase 3 only, with fresh implementer and auditor agents, all with `model: opus`. Respect these points:

- **Order and parallelism.** 3.5 (poll snapshot) can run right away, in parallel. 3.1 (Stage 2 research) comes first for the rest, then 3.2 (fact-check, which can start per party as each 3.1 document lands), then 3.3 (cross-party consistency review), then 3.4 (Hebrew edition plus parity check).
- **One independent research agent per party.** That's 52 parties, with joint-list members researched separately. A single implementer cannot hold 52 deep research jobs in its own context, so the Phase 3 implementer should fan out sub-agents in batches (for example 6–10 at a time). It verifies each output against the Stage 2 instructions and content validation before moving on.
- **Start with the lists likely to pass the threshold**, so the owner can begin reviewing early (plan Risks §3).
- **The agent that wrote a document never checks it.** The Stage 3 fact-checker for a party must be a different agent from its Stage 2 author, and the same goes for the Stage 4 and Stage 5 parity reviewers.
- **Quality bar (owner's words and decisions):**
  - Research is the most important part of the product. **Don't shorten it for efficiency.**
  - **Facts over pre-election propaganda.** Rank evidence as: actions (votes, government record, legislation) above the formal platform, above statements. State contradictions explicitly.
  - Every substantive claim is cited with a source that was actually opened, not a search snippet.
  - Legal matters about leaders: court or official sources only, facts only.
  - **No poll figures in research text.** Polls live only in the registry snapshot (3.5), and they are never estimated. Lists not tracked by polls are marked "not polled".
  - Use Israeli-neutral terms per `content/glossary.json` (e.g., "Judea and Samaria", "settlements", Hezbollah = "terror organization"). The Hebrew is an equivalent, not a literal translation.
  - Plain language: don't assume the reader follows politics, and explain terms.
  - State scope plainly. Example from issue 9: say what applies only to Arab communities and what applies to everyone.
  - Each party document has one section-3 sub-section per **locked** issue ID in `content/issues/`. Gaza has 5 options and Judea and Samaria has 6.
- **Commit** each audited task, or the whole phase, with a message that names the phase. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Never push**, and never change git config. The repo-local identity is deliberately non-identifying (see the operator rules in §3).
- **Phase 3 ends here.** Don't start Phase 4. Tell the owner the research is ready for their review.

## 3. How the owner wants to work (from this session)

- **Talk in chat, one decision at a time, with a recommendation.** The owner reviews here and doesn't want to edit docs for you. If they need something written out to read comfortably, make a readable doc, but discuss and decide in chat.
- **Never start long jobs on your own.** If the owner says they're going offline, don't start anything new. If they ask to pause, stop agents at a safe point, commit the work as a WIP commit, and update this note.
- **Restate what you need.** The owner may not see earlier messages. When you need an answer, ask it again in your current message.
- **Keep it short.** Don't ask them to read long documents. Summarise, and point only to the parts that matter.
- **The operator stays anonymous.** No owner name anywhere: not on the site, in metadata, in commits or in content. There is no contact channel or email by owner decision.
- **The working name** "Party Matcher" / "התאמת מפלגות" stays for now.
- **The matching backend is deliberately undecided until D1** (Phase 5). That covers storage, AI provider and model, and architecture. Don't build it. A recorded owner requirement for any option: an **answer-normalization step** before matching turns raw answers like "all of the above" into explicit positions (see the plan, Decisions §1).

## 4. Operational quirks seen in this session

- **Sub-agent results sometimes reach the orchestrator instead of the agent that spawned them.** This happens when a sub-agent spawns its own sub-agents, such as neutrality or parity reviewers. If you get a result notification for an agent you didn't launch, forward its full content with `SendMessage` to the agent that launched it. An implementer may also stop and say it is "waiting for agent results". In that case, check for and forward any results, then nudge it to continue.
- **Kill test servers before stopping or pausing.** Playwright and `next start` processes can be left running.
- **The e2e suite takes several minutes.** `npm run test:e2e` rebuilds with `APP_ENV=test`, which turns on the clock override and forced mock results. Rebuild normally before using `next start` for anything else.
- **The owner's review doc for the issues** (read-only for them) is at https://claude.ai/code/artifact/0ff5e90b-06f8-4588-a06b-da66c547334f. It is no longer needed now that the issues are locked.
