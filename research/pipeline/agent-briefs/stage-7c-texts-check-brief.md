# Stage 7c agent brief (English result texts and points, checker, one party)

The orchestrator gives each texts checker this brief plus one party ID, that party's computed labels (the same block the author got) and the author's flags. Replace `{{PARTY}}`, `{{COMPUTED_LABELS}}` and `{{AUTHOR_FLAGS}}`. **The checker must be a different agent from the author of that party's texts.** Use Opus.

---

You are a Stage 7c texts checker for this repository: an Israeli election party-matcher (Tasks 3.4 and 3.5 in `tasks-deterministic-matching.md`). You did NOT write the file you are checking; a different agent did. If you did write it, stop and tell the orchestrator.

YOUR PARTY ID: {{PARTY}}

THE COMPUTED LABELS FOR THIS PARTY:
{{COMPUTED_LABELS}}

LABELS THE AUTHOR FLAGGED AS POSSIBLY WRONG, AND ITS OTHER NOTES:
{{AUTHOR_FLAGS}}

## What this is for

When a party appears in a voter's result, the site shows for each issue a computed label (agrees, partly agrees, disagrees, or position unclear) and a prepared text explaining it: one text per option the voter could have chosen. It also shows 2–3 "also worth knowing" points about the party. Every voter who chose a given option reads the same text. The owner does not review these texts: your check is the review. A text passes when it is true to the research, fits its label, and is neutral and fair to the party.

An option can also carry `party-position-unclear`: the scoring gives it when the party's position on the issue rests only on tentative evidence and the voter chose an option the party isn't linked to. Such a text must say what the research found and didn't find and where the tentative indication points, and must not assert opposition. A `disagrees` label doesn't require explicit opposition either: it means the party's documented position is a different, distant option. Labels are the orchestrator's to change (through the positions row or the grid); report one as must-fix only when the research plainly contradicts it, and name the row or grid pair to recheck.

## Read

- `content/matching/texts/en/{{PARTY}}.json`: the file under check.
- `content/research/en/{{PARTY}}.md`: for an issue's texts, its `{#issue-<issueId>}` sub-section; for the points, the `{#other-positions}` section. Also glance at `{#coalition}` and `{#legal}`, only to recognise a point that is really a coalition statement or a legal matter.
- `content/issues/*.json` and `content/glossary.json`.

Check only against the research document. **Nothing from memory or the web.** If you know a fact that the research doesn't state, it can't support a text.

## The format the file must have

```json
{ "partyId": "likud-party", "lang": "en",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "1–2 sentences" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

All 10 issues present; `anchor` is `issue-<issueId>`; an issue has `options` (every option of the issue) or `unclear`, never both; 2 or 3 points.

## What you verify

For every issue text:

1. **Complete:** all 10 issues; every option of each issue; unclear issues exactly where the computed labels say unclear.
2. **Label recorded correctly:** each `agreement` equals the computed label.
3. **The text fits the label:** read the text without the label and decide what a reader would take it to say (agrees, partly, disagrees). It must match. A `partially` text makes clear whether the party holds a neighbouring option or holds this one only weakly.
4. **Grounded:** every fact, date, name and vote direction is in that party's sub-section for that issue. Nothing from another section, another party or outside.
5. **Strongest evidence:** where the sub-section has an Action, the text doesn't rest on a Statement instead. Evidence is from 2021 onwards and the current leadership; no "Dated background" item carries a text.
6. **Fair and neutral:** no value judgments, loaded adjectives, scare quotes or side-taking verbs; no comparison with other parties; the hedging matches the research (a tentative placement reads as tentative, a clear one as clear); a party supporter would recognise the description as fair.
7. **Glossary:** glossary terms used, nothing from `avoid`.
8. **No poll figures.**
9. **Form:** 1–2 sentences, addressed to a user who chose that option, short; no option IDs, citation numbers, links or Markdown; absolute dates.
10. **Unclear texts:** say only that no documented position was found. No hint of agreement or disagreement, no guess.

For the points:

11. **Count and source:** 2–3 points; each traces to a statement in the `other-…` sub-section its anchor names; the anchor exists in the document.
12. **Selection rule:** they are the positions the party is most distinctively known for in that section, preferring ones backed by actions, then formal commitments, then statements. If a clearly more distinctive, action-backed position was passed over, say which.
13. **Not allowed:** no legal matter, no coalition statement, no repeat of one of the 10 issues.
14. **Form and neutrality:** one neutral sentence each, same rules as above.

For the author's flags:

15. **Each flagged label:** read the research sub-section and give your own view: is the computed label defensible from the research, or does it look wrong? **Never change a label, and never ask for a text to be rewritten against its label.** If you agree a label looks wrong, record it as must-fix addressed to the orchestrator: the positions row or the grid goes back through Stage 7a or 7b, and this party's affected texts are then rewritten and rechecked. Also flag any label the author did not flag but which the research seems to contradict.

## How to report

Write your log to `research/review/matching/texts-en-{{PARTY}}.md`. Create the folder if needed. Write nothing else: **don't edit the texts file or the research.** The orchestrator has the findings fixed by an agent other than you, then asks you to confirm each fix and fill in Status.

Severities:
- **must-fix:** a fact not in the sub-section or stated wrongly; a text that reads as a different label from its own; an `agreement` that differs from the computed label; a computed label the research contradicts; a value judgment or loaded term; an `avoid` term; a poll figure; an unclear text that implies a stance; a point from a legal matter or coalition statement, or with a wrong anchor; a missing option.
- **should-fix:** a text resting on weaker evidence than the sub-section offers; hedging stronger or weaker than the research; a text that is too long or repeats the option in full; a more distinctive point passed over; wording a supporter might find slightly unfair.
- **note:** anything that needs no change.

```md
# English texts check: {{PARTY}}

- Checked on <date> by a Stage 7c checker (not the author of this file)
- Author: <agent label from the orchestrator>
- Texts checked: <n option texts> + <n unclear> + <n points> · must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Findings

| # | Issue / option, or point | Severity | Finding (quote the words at fault and the research words they should match) | Suggested fix | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|

## Computed labels questioned

| Issue | Option | Computed label | Flagged by (author / checker) | Checker's view, with the research words | For the orchestrator (recheck positions row / recheck grid pair / label stands) |
|---|---|---|---|---|---|

## What was verified

<one line per check 1–15: done, and how>
```

Don't commit, don't change git config, don't spawn sub-agents.

Report back concisely: counts by severity, the must-fix items, and every label you think the orchestrator should send back to Stage 7a or 7b.
