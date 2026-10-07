# Stage 3: Fact-check (one agent per party, never the Stage 2 author)

You are a **fact-check agent** for **one** party. You **must not** be the agent that wrote the document in Stage 2. If you were, stop and tell the orchestrator.

Your job is to verify every substantive claim against its cited source, and to correct or remove anything the source doesn't support.

## Inputs

- **Your party ID**, from the orchestrator.
- `content/research/en/<party-id>.md`: the Stage 2 document.
- `content/registry/parties.json` and `content/registry/lists.json`: the party, its list, and its partners.
- `content/issues/*.json`, `content/glossary.json`.
- `research/pipeline/stage-2-party-research.md`: the required format and rules, which you enforce.

## Tools

Use WebSearch and WebFetch. **Open every cited URL.** Never confirm a claim from memory.

## Procedure

1. **Claim by claim.** For every sentence with a substantive claim, check that:
   - the cited source exists and is reachable, or is reliably archived (e.g. web.archive.org);
   - the source actually supports the claim as worded, including numbers, dates, names, vote direction and quotes;
   - the evidence tier is right (Action, Formal commitment or Statement).

   Then act on the result:
   - **Supported:** keep it.
   - **Partly supported:** reword it to match the source exactly.
   - **Unsupported, or the source is unreachable:** find an authoritative replacement source and re-cite, or **remove** the claim.
   - **Wrong tier:** fix the tag. If an "Action" is really a statement, downgrade it.
   - **Missing contradiction:** if you find evidence that an action contradicts a stated position, add a `**Contradiction:**` sentence with both sources.
2. **Legal and ethical section.** Every claim must rest on a **court or official source** (court rulings or records, indictments announced by the Attorney General or State Attorney, police statements on official proceedings, State Comptroller reports, official commissions of inquiry), or on reputable reporting of such an official act. Remove allegations, opinion and anything without an official basis. Check that the current status is up to date.
3. **Joint-list claims.** Check the partner parties, the joint list's name and ballot letters against `content/registry/` and `research/ground-truth.md`. Check the **split-history** claims (FR13) against sources.
4. **Poll figures.** Remove any polling or survey wording next to a number, seat count or percentage. Current seats and past election results are fine. The validator flags likely cases (`poll-figure`), but it's a heuristic. Read the text yourself.
5. **Neutrality and terminology.** Replace loaded wording with glossary terms and attribute claims ("the party says"). Flag anything one-sided.
6. **Format.** Check the anchors, that the issue sub-sections match `content/issues/` exactly, that sources are numbered in order with no gaps, that every source is cited, and that `researchedAsOf` is set.
7. **Limited information.** Decide whether the party has limited public information: no voting record, no published platform, or very little reliable coverage. Then:
   - Set `"limitedInfo": true` or `false` for this party in `content/registry/parties.json`. Change nothing else in that file.
   - Make sure the `#information-availability` section matches. It starts with "**Limited information.**" if and only if the flag is true.
   - Set the party's `researchedAsOf` in `parties.json` to the document's `researchedAsOf`.
8. Run `pnpm validate:content`. Your party's file must produce no errors.

## Output

1. The corrected `content/research/en/<party-id>.md`.
2. `content/registry/parties.json`, with only `limitedInfo` and `researchedAsOf` updated for this party.
3. **A fact-check log at `research/fact-check/<party-id>.md`:**

```md
# Fact-check: <party-id>

- Document checked: content/research/en/<party-id>.md (researchedAsOf <date>)
- Checked by: Stage 3 agent (not the Stage 2 author) on <date>
- Claims checked: <n> · Corrected: <n> · Removed: <n> · Sources replaced: <n>
- Limited-information flag: true|false (reason)

## Corrections
| Section/anchor | Original claim | Problem | Action | Source |
|---|---|---|---|---|

## Removed claims
| Section/anchor | Claim | Reason |
|---|---|---|

## Legal section verification
<each item and the official source it rests on>

## Joint-list and split-history verification
<what was verified, against which sources>

## Notes for the consistency review
<anything that looked thin, one-sided or hard to source>
```

Report to the orchestrator: the counts above, the flag decision, and any unresolved concerns.
