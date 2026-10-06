# Research pipeline

This folder holds the instructions for the offline research pipeline. AI agents run it from Claude Code. The output is the content corpus the website displays. The pipeline isn't deployed and doesn't run at runtime.

| Stage | File | Output |
|---|---|---|
| 0. Ground truth | (done in Task 1.4) | `content/registry/{lists,parties}.json`, `research/ground-truth.md` |
| 1. Issues and answers (owner-gated) | (done in Task 1.5) | `content/issues/*.json`, `content/glossary.json`, `research/review/issues-review.md` |
| 2. Party research | [`stage-2-party-research.md`](stage-2-party-research.md) | `content/research/en/<party-id>.md` |
| 3. Fact-check | [`stage-3-fact-check.md`](stage-3-fact-check.md) | corrected EN doc, `research/fact-check/<party-id>.md`, `limitedInfo` in `content/registry/parties.json` |
| 4. Cross-party consistency and neutrality | [`stage-4-consistency-review.md`](stage-4-consistency-review.md) | corrected EN docs, `research/review/consistency-review.md` |
| 5. Hebrew edition and parity check | [`stage-5-hebrew-edition.md`](stage-5-hebrew-edition.md) | `content/research/he/<party-id>.md`, `research/review/parity-check.md` |
| 6. Poll snapshot | [`stage-6-poll-snapshot.md`](stage-6-poll-snapshot.md) | `poll` field of each list in `content/registry/lists.json` |

## Ground rules for every stage

1. **Separate agents.** Writing, checking and reviewing are done by different agents. No agent fact-checks, reviews or parity-checks a document it wrote. The orchestrator records which agent did what in each stage's log.
2. **Nothing from memory.** Every fact comes from a source the agent fetched in that session, and is cited.
3. **Neutrality.** Use the terms in `content/glossary.json` and avoid the terms it lists under `avoid`. Describe positions the way their own supporters would recognise as fair. Don't use value judgments or loaded adjectives.
4. **No poll figures in research documents.** A poll figure is polling or survey wording next to a number, seat count or percentage. Current Knesset seats and past election results are allowed. The site renders the polling line from the registry snapshot so the legal poll blackout can hide it (see `research/legal-findings.md`). Content validation flags suspected poll figures and blocks the build.
5. **Validation.** After any change, run `npm run validate:content`. It must pass. Research for the real corpus lives in `content/research/` and is validated while it's still incomplete: existing documents are fully checked, and missing ones are allowed until the real corpus becomes active in Task 4.1.
6. **Don't commit.** The orchestrator owns commits.
7. **Research documents are fixed once compiled** (PRD FR14). They change only through the re-run procedure below, on the owner's request.

## Inputs every stage may read

- `content/issues/*.json`: the approved issues (IDs, texts, options). Never hard-code the issue list. Always read it from here.
- `content/glossary.json`: approved bilingual terms.
- `content/registry/parties.json` and `content/registry/lists.json`: the registry (party IDs, list IDs, joint-list membership, ballot letters, leaders).
- `research/ground-truth.md`: election date, CEC sources, lists still under appeal.
- `research/legal-findings.md`: poll-publication rules.
- `prd-israeli-election-party-matcher.md` (FR8–FR14) and `plan-israeli-election-party-matcher.md` ("Research pipeline").

## Full run order

1. **Preconditions.** Stage 0 is complete. Stage 1 is **approved by the owner**, with the approval recorded at the top of `research/review/issues-review.md`. `content/versions.json` has the frozen `surveyContentVersion`. Don't start Stage 2 before then.
2. **Stage 6 (polls)** can run any time after Stage 0, in parallel with everything else.
3. **Stage 2.** Run one research agent per party in the registry, with joint-list members researched separately. Start with the lists most likely to pass the threshold, so owner review can begin early. Agents run in parallel.
4. **Stage 3.** For each party, as soon as its Stage 2 document lands, run a **different** agent on it.
5. **Stage 4.** Once every party has passed Stage 3, one review covers all English documents together.
6. **Stage 5.** Run one Hebrew-edition agent per party, then a **separate** parity-check agent per party (or one parity agent covering a batch it didn't translate).
7. **Bump the research version** in `content/versions.json`, e.g. `"researchVersion": "2026-10-12.1"`. Leave `surveyContentVersion` unchanged. A research change never invalidates in-progress surveys.
8. Run `npm run validate:content` and `npm run test`.

## Per-party re-run procedure

Use this for owner corrections (PRD FR14), registry changes (e.g. a list disqualified or added after a CEC update), and a newly added party.

1. **Record the request.** Add an entry to `research/review/corpus-review.md` with the date, the party, what the owner asked for, and who re-runs it. For a registry change, update `content/registry/` first and record it in `research/ground-truth.md`.
2. **Stage 2 (targeted).** A research agent revises `content/research/en/<party-id>.md`. For a correction it changes only the affected claims and sections, and updates `researchedAsOf` to today. A new party gets a full document.
3. **Stage 3.** A **different** agent fact-checks the changed claims, or the whole document for a new party. It appends to `research/fact-check/<party-id>.md` and re-evaluates `limitedInfo`.
4. **Per-party consistency check (Stage 4, scoped).** A reviewer agent compares the revised document with two or three comparable parties' documents for depth, tone and evidence standards. It also runs the neutrality and poll-figure pass, and appends to `research/review/consistency-review.md`.
5. **Stage 5.** The Hebrew edition is regenerated, or the changed sections are updated, by an agent other than the English author. Then a **separate** agent re-runs the parity check and appends to `research/review/parity-check.md`. **Any change to the English document requires this step.**
6. **Bump `researchVersion`** in `content/versions.json`. **Never** change `surveyContentVersion` for research or poll changes.
7. `npm run validate:content` passes. The orchestrator commits.

### Poll refresh (owner request only, PRD FR21)

1. Re-run Stage 6 for the requested lists (or all lists). Polls are **never** refreshed automatically.
2. **Never record or change a poll after the poll-blackout start** in `research/legal-findings.md`. The website hides poll content from then on, and publishing new poll results is prohibited.
3. Bump `researchVersion`. Research documents aren't touched, because they contain no poll figures.

### Issue changes

The issues are frozen at owner approval. Changing them is out of scope for this pipeline. It would mean bumping `surveyContentVersion` (which invalidates in-progress surveys) and adding or removing a section-3 sub-section in **every** research document, both languages, through the full Stages 2–5. Only do it with an explicit owner decision.
