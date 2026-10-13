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
| 7a. Party positions per issue | [`stage-7-matching-content.md`](stage-7-matching-content.md) | `content/matching/positions/<issue-id>.json`, `research/review/matching/positions-<issue-id>.md` |
| 7b. Option-distance grids | same file | `content/matching/distances/<issue-id>.json`, `research/review/matching/grids-<issue-id>.md` |
| 7c. English result texts and "also worth knowing" points | same file | `content/matching/texts/en/<party-id>.json`, `research/review/matching/texts-en-<party-id>.md` |
| 7d. Hebrew result texts and points, with parity check (run by the owner in a separate cloud session) | same file | `content/matching/texts/he/<party-id>.json`, `research/review/matching/texts-he-<party-id>.md` |
| 7e. Platform links for listed parties | same file | `platform` field of listed parties in `content/registry/parties.json`, `research/review/matching/platform-links.md` and `platform-links-check.md` |

Stages 2–5 cover the 28 researched parties only. The other 24 parties are listed only: they are not researched or matched, and Stage 7e finds their platform links (`prd-deterministic-matching.md`). Each Stage 7 sub-stage has an author brief and a separate checker brief in [`agent-briefs/`](agent-briefs/).

## Ground rules for every stage

1. **Separate agents.** Writing, checking and reviewing are done by different agents. No agent fact-checks, reviews or parity-checks a document it wrote. The orchestrator records which agent did what in each stage's log.
2. **Nothing from memory.** Every fact comes from a source the agent fetched in that session, and is cited. In Stage 7 the source is the frozen research document (or, for grids, the option texts) the agent read in that session; only 7e uses the web.
3. **Neutrality.** Use the terms in `content/glossary.json` and avoid the terms it lists under `avoid`. Describe positions the way their own supporters would recognise as fair. Don't use value judgments or loaded adjectives.
4. **No poll figures in research documents.** A poll figure is polling or survey wording next to a number, seat count or percentage. Current Knesset seats and past election results are allowed. The site renders the polling line from the registry snapshot so the legal poll blackout can hide it (see `research/legal-findings.md`). Content validation flags suspected poll figures and blocks the build.
5. **Validation.** After any change, run `pnpm validate:content`. It must pass. Research for the real corpus lives in `content/research/` and is validated while it's still incomplete: existing documents are fully checked, and missing ones are allowed until the real corpus becomes active in Task 4.1.
6. **Don't commit.** The orchestrator owns commits.
7. **Research documents are fixed once compiled** (PRD FR14). They change only through the re-run procedure below, on the owner's request.

## Inputs every stage may read

- `content/issues/*.json`: the approved issues (IDs, texts, options). Never hard-code the issue list. Always read it from here.
- `content/glossary.json`: approved bilingual terms.
- `content/registry/parties.json` and `content/registry/lists.json`: the registry (party IDs, list IDs, joint-list membership, ballot letters, leaders).
- `research/ground-truth.md`: election date, CEC sources, lists still under appeal.
- `research/legal-findings.md`: poll-publication rules.
- `prd-israeli-election-party-matcher.md` (FR8–FR14) and `plan-israeli-election-party-matcher.md` ("Research pipeline").
- For Stage 7: `prd-deterministic-matching.md` (requirements 29–35 and 42) and `plan-deterministic-matching.md` ("Data model", "Rollout"). The Stage 7b grid agents read only `content/issues/*.json` and the glossary.

## Full run order

1. **Preconditions.** Stage 0 is complete. Stage 1 is **approved by the owner**, with the approval recorded at the top of `research/review/issues-review.md`. `content/versions.json` has the frozen `surveyContentVersion`. Don't start Stage 2 before then.
2. **Stage 6 (polls)** can run any time after Stage 0, in parallel with everything else.
3. **Stage 2.** Run one research agent per party in the registry, with joint-list members researched separately. Start with the lists most likely to pass the threshold, so owner review can begin early. Agents run in parallel.
4. **Stage 3.** For each party, as soon as its Stage 2 document lands, run a **different** agent on it.
5. **Stage 4.** Once every party has passed Stage 3, one review covers all English documents together.
6. **Stage 5.** Run one Hebrew-edition agent per party, then a **separate** parity-check agent per party (or one parity agent covering a batch it didn't translate).
7. **Bump the research version** in `content/versions.json`, e.g. `"researchVersion": "2026-10-12.1"`. Leave `surveyContentVersion` unchanged. A research change never invalidates in-progress surveys.
8. Run `pnpm validate:content` and `pnpm test`.
9. **Stage 7 (matching content)** starts from the frozen English research; it doesn't wait for Stage 5. Run `CONTENT_CORPUS=real pnpm validate:content` after each step.
   1. **7a and 7b, in parallel.** 7a: one positions author per issue places all 28 researched parties, then a **different** agent checks each issue. 7b: one grids author covers the 10 issues without seeing positions or research, then a **different** agent checks.
   2. **Scoring constants.** Voter profiles, the self-match test and the profile test settle the constants (Task 3.3 in `tasks-deterministic-matching.md`). This isn't a pipeline stage, but 7c needs its result.
   3. **7c.** One texts author per party, given the labels computed for that party, then a **different** checker. Run one party first, report its token cost to the owner, and start the rest only on the owner's go-ahead.
   4. **7d.** Hebrew texts and parity check, per party, after that party's 7c check. **The owner runs this in a separate cloud session**, starting with one trial party.
   5. **7e (platform links)** can run any time: a finder, then a **different** verifier, then the orchestrator writes the confirmed links into the registry.
   6. **Bump `matchingVersion`** in `content/versions.json`. Leave `surveyContentVersion` unchanged.

## Per-party re-run procedure

Use this for owner corrections (PRD FR14), registry changes (e.g. a list disqualified or added after a CEC update), and a newly added party.

1. **Record the request.** Add an entry to `research/review/corpus-review.md` with the date, the party, what the owner asked for, and who re-runs it. For a registry change, update `content/registry/` first and record it in `research/ground-truth.md`.
2. **Stage 2 (targeted).** A research agent revises `content/research/en/<party-id>.md`. For a correction it changes only the affected claims and sections, and updates `researchedAsOf` to today. A new party gets a full document.
3. **Stage 3.** A **different** agent fact-checks the changed claims, or the whole document for a new party. It appends to `research/fact-check/<party-id>.md` and re-evaluates `limitedInfo`.
4. **Per-party consistency check (Stage 4, scoped).** A reviewer agent compares the revised document with two or three comparable parties' documents for depth, tone and evidence standards. It also runs the neutrality and poll-figure pass, and appends to `research/review/consistency-review.md`.
5. **Stage 5.** The Hebrew edition is regenerated, or the changed sections are updated, by an agent other than the English author. Then a **separate** agent re-runs the parity check and appends to `research/review/parity-check.md`. **Any change to the English document requires this step.**
6. **Stage 7, for a researched party.** Re-run, in this order, each with its separate check: the party's positions rows on the affected issues (7a), its English result texts for those issues (7c), its Hebrew result texts (7d). A newly added list is a listed-only party: it gets no research, and only Stage 7e applies.
7. **Bump `researchVersion`** in `content/versions.json`, and `matchingVersion` if Stage 7 content changed. **Never** change `surveyContentVersion` for research or poll changes.
8. `pnpm validate:content` passes. The orchestrator commits.

### Poll refresh (owner request only, PRD FR21)

1. Re-run Stage 6 for the requested lists (or all lists). Polls are **never** refreshed automatically.
2. **Never record or change a poll after the poll-blackout start** in `research/legal-findings.md`. The website hides poll content from then on, and publishing new poll results is prohibited.
3. Bump `researchVersion`. Research documents aren't touched, because they contain no poll figures.

### Issue changes

The issues are frozen at owner approval. Changing them is out of scope for this pipeline. It would mean bumping `surveyContentVersion` (which invalidates in-progress surveys) and adding or removing a section-3 sub-section in **every** research document, both languages, through the full Stages 2–5. Only do it with an explicit owner decision.
