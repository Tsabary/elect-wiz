# Stage 7a agent brief (positions check, one issue)

The orchestrator gives each positions checker this brief plus one issue ID and the author's report. Replace `{{ISSUE}}` and `{{AUTHOR_NOTES}}`. **The checker must be a different agent from the author of that issue's positions file.** Use Opus.

---

You are a Stage 7a positions checker for this repository: an Israeli election party-matcher (Task 3.1 in `tasks-deterministic-matching.md`). You did NOT write the file you are checking; a different agent did. If you did write it, stop and tell the orchestrator.

YOUR ISSUE ID: {{ISSUE}}

THE AUTHOR'S NOTES (rows it was unsure of, research lines it questioned):
{{AUTHOR_NOTES}}

## What this is for

The site matches voters to parties by fixed rules from prepared content. The file you check records which option each of the 28 researched parties holds on one issue. These rows decide who gets recommended. The owner does not review them: your check is the review. A row is right when it follows from the party's research by the rules below, applied the same way to every party.

## Read

- `content/matching/positions/{{ISSUE}}.json`: the file under check.
- `content/issues/{{ISSUE}}.json`: the option IDs and texts.
- `ls content/research/en/`: the 28 researched parties.
- In each of the 28 documents: only the sub-section headed `{#issue-{{ISSUE}}}` and its "**Closest option(s):**" line.

Judge only from those sub-sections. **Nothing from memory or outside knowledge.** Don't read `content/matching/distances/`.

## The format the file must have

```json
{ "issueId": "gaza",
  "rows": [
    { "partyId": "likud-party", "unclear": false,
      "held": [ { "optionId": "<option id of that issue>", "level": "main" | "either" | "secondary" } ],
      "anchor": "issue-gaza", "basis": "one-line reason for the reviewer" },
    { "partyId": "some-party", "unclear": true, "held": [], "anchor": "issue-gaza", "basis": "No documented position found." }
  ] }
```

One row for each of the 28 researched parties, sorted by `partyId`; `anchor` is `issue-{{ISSUE}}`. At most one `main` in a row; `either` only on two or more options; never `main` together with `either`; `unclear: true` exactly when `held` is empty.

## The rules the author had to apply

| # | What the research says | Placement |
|---|---|---|
| 1 | "**No documented position found.**" and no "Closest option(s)" line | `unclear: true`, `held: []` |
| 2 | The line calls itself tentative, or says it rests on indirect evidence, or calls its own evidence thin | every option the line points to as closest is `secondary`. Never `main`, never `either` |
| 3 | One option, stated clearly, and nothing else held | `main` |
| 4 | "X or Y", and the line says the evidence can't tell which | `either` on both. No `main` |
| 5 | A clearly stated first option plus a named second option ("with elements of…", "together with…", "also matches…", "leans towards…", "partly like…", "the evidence is mixed") | first `main`, second `secondary`; a third is also `secondary` |
| 6 | A clearly stated first option, then "X or Y" as the second element | first `main`, X and Y both `secondary` |
| 7 | An option named only to rule it out | not held |
| 8 | A held option with a caveat | level unchanged; caveat in `basis` |

Also: rule 2 comes first, so a tentative line is `secondary` even with one option. Only rule 1 gives an unclear row. Every "Closest option(s)" line gives at least one held option. Evidence ranks actions > formal commitments > statements, so an option backed by actions comes before one backed only by statements. A position rests on evidence from 2021 onwards and the current leadership; older material never decides a placement.

## What you verify

Do the placement yourself first: for each party, read its line and write down the row the rules give, **before** you look at the author's row. Then compare.

1. **Coverage:** exactly 28 rows, one per file in `content/research/en/`, sorted by `partyId`, no other party.
2. **Format rules,** as above, and every `optionId` belongs to this issue.
3. **Each row against the rules:** your placement and the author's agree. Where they differ, re-read the line and decide which follows the rule.
4. **The unclear set:** the unclear rows are exactly the parties whose sub-section says "No documented position found", no more and no fewer.
5. **No tentative or indirect line is `main`.**
6. **No ruled-out option is held.**
7. **Consistency across parties:** read all 28 rows together. Lines worded the same way have the same levels.
8. **`basis`:** one line, traceable to the research line's words, with nothing from outside the sub-section.
9. **The author's notes:** give your own view on each row the author was unsure of.

## How to report

Write your log to `research/review/matching/positions-{{ISSUE}}.md`. Create the folder if needed. Write nothing else: **don't edit the positions file or any research document.** The orchestrator has the findings fixed by an agent other than you, then asks you to confirm each fix and fill in Status.

Severities:
- **must-fix:** a row that doesn't follow the rules, a wrong unclear set, a format break, a `main` on a tentative line, a held option the line rules out, a basis from outside the research.
- **should-fix:** two parties with the same wording placed differently; a basis that doesn't show which rule was applied; a defensible row where another reading follows the rules more closely.
- **note:** anything that needs no change, including research lines that look questionable (the research is frozen; the orchestrator passes these to the owner).

```md
# Positions check: {{ISSUE}}

- Checked on <date> by a Stage 7a checker (not the author of this file)
- Author: <agent label from the orchestrator>
- Rows checked: 28 · must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Findings

| # | Party | Severity | Finding (the line's deciding words, the rule, what the row has) | Suggested row | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|

## What was verified

<one line per check 1–9: done, and how>
```

Don't commit, don't change git config, don't spawn sub-agents.

Report back concisely: counts by severity, the must-fix rows, and anything for the owner.
