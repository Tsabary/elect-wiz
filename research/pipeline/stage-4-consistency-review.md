# Stage 4: Cross-party consistency and neutrality review

You are the **consistency reviewer**. You must not have written or fact-checked any of the documents you review. If you did, tell the orchestrator. You review **all** English research documents together, **before** the Hebrew edition exists.

Your goal: no party is visibly treated more harshly, more generously or more thinly than another. Depth, tone and evidence standards are comparable across the corpus (plan, Stage 4).

## Inputs

- `content/research/en/*.md`: every party's fact-checked document.
- `research/fact-check/*.md`: the Stage 3 logs. Read their "Notes for the consistency review".
- `content/registry/*.json`, `content/issues/*.json`, `content/glossary.json`.
- `research/pipeline/stage-2-party-research.md`: the required format and rules.

## Tools

Use WebSearch and WebFetch when you need to fill a gap or check a balancing fact. Every addition needs a fetched source.

## Procedure

1. **Depth parity.**
   - For each party, measure the words per section, the number of sources, the issue sub-sections with "No documented position found", and the number of Action-tier claims.
   - Write these into a table and flag outliers. Look especially for parties of similar size and record that are covered very differently.
   - A short document is acceptable only when the cause is genuinely little public information, which should show as the limited-information flag. It's never acceptable because the research was less thorough.
2. **Evidence standards.**
   - Contradiction callouts, legal sections and track-record comparisons apply the same bar to everyone. If one party's broken pledges are listed, comparable parties' broken pledges must be looked for too.
   - Legal sections use official sources only, and comparable matters are described in comparable terms (e.g. "indicted on" versus "accused of").
3. **Tone and neutrality.**
   - Look for loaded adjectives, unattributed characterisations, scare quotes, and asymmetric verbs (one party "claims" while another "states").
   - Check glossary compliance, including the `avoid` lists.
   - Positions should be described so that each party's own supporters would recognise them as fair.
4. **Issue coverage.** Each issue's "Closest option(s)" mapping should rest on comparable evidence across parties. Flag mappings that rest only on Statement-tier evidence when an Action exists, or the reverse.
5. **Poll figures.** Do a final pass for polling or survey wording next to a number, seat count or percentage. Current seats and past results are allowed.
6. **Fix.** Apply the fixes directly to the documents. For factual additions, cite the new sources and keep the numbering valid. If a fix needs new research beyond a few claims, send that party back for a targeted Stage 2 and Stage 3 re-run (see `README.md`) and record it.
7. Run `pnpm validate:content`. No errors are allowed in any existing research document.

## Output

1. Corrected `content/research/en/*.md`.
2. **`research/review/consistency-review.md`**, covering **every party**:

```md
# Cross-party consistency and neutrality review

- Reviewed on <date> by the Stage 4 reviewer (not an author or fact-checker of these documents)
- Documents reviewed: <n> (list)

## Depth metrics
| Party | Words | Sources | Action claims | Issues without documented position | Limited info |
|---|---|---|---|---|---|

## Findings and changes
| Party | Anchor | Finding (imbalance / tone / evidence / poll figure) | Change made or justification |
|---|---|---|---|

## Sent back for re-run
<party: reason>

## Unresolved or justified imbalances
<each with justification>

## Neutrality pass and poll-figure pass
<confirmation and summary>
```

Every flagged imbalance must end up either **resolved** or **justified** in the log. Report a summary to the orchestrator.

## Scoped use (per-party re-run)

When the orchestrator runs this stage for a single revised party, compare that party with two or three comparable parties' documents, run steps 2–5 for it, and **append** a dated section to `research/review/consistency-review.md`.
