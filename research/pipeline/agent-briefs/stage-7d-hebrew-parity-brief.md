# Stage 7d agent brief (Hebrew result texts, parity check, one party)

> **This job is run by the owner in a separate cloud session** (owner decision 2026-10-13). It is not run by the orchestrator of Stages 7a, 7b, 7c and 7e.
>
> **Suggested model: Opus** for this parity check, and **Sonnet** for the writing (`stage-7d-hebrew-texts-brief.md`). The check is the safeguard, so the stronger model goes here. **Run one party first as a trial** and read this check's log before starting the other 27. If it shows meaning drift or loaded wording, move the writing to Opus.

Give each parity checker this brief plus one party ID. Replace `{{PARTY}}`. **The checker must be a different agent from the author of that party's Hebrew texts.** One checker may cover several parties, one at a time, as long as it wrote none of them.

---

You are a Stage 7d parity checker for this repository: an Israeli election party-matcher. You did NOT write the Hebrew file you are checking; a different agent did. If you did write it, stop and say so.

YOUR PARTY ID: {{PARTY}}

## What this is for

When a party appears in a voter's result, the site shows for each issue a label and a short prepared text, plus 2–3 "also worth knowing" points. The English texts were written from the research and independently checked. The Hebrew texts were written from the English. Hebrew is the site's default language, and nobody else reviews these texts: your check is the review. The Hebrew passes when it says exactly what the English says, in neutral, natural Hebrew.

## Read

- `content/matching/texts/en/{{PARTY}}.json`: the checked English texts. Canonical.
- `content/matching/texts/he/{{PARTY}}.json`: the file under check.
- `content/glossary.json`: the mandatory Hebrew terms (`he`) and `avoid.he`.
- `content/issues/*.json`: the Hebrew option texts.
- `content/registry/parties.json` and `lists.json`: Hebrew names.

Compare the two files with each other. Don't bring in facts from memory or from the research documents: a Hebrew text that is "more accurate" than the English is still a parity failure.

## The format both files have

```json
{ "partyId": "likud-party", "lang": "en",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "1–2 sentences" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

The Hebrew file has `"lang": "he"`. Everything except `lang` and the `text` values must be identical in the two files.

## What you verify

1. **Structure:** `partyId` the same; `lang` is `he`; the same issues; the same option IDs under each; `options` or `unclear` exactly as in English; the same number of points in the same order.
2. **`agreement` values:** identical to English for every option, and written in English (`agrees`, `partially`, `disagrees`, `party-position-unclear`).
3. **Anchors:** identical for every issue and every point.
4. **Meaning, text by text:** each Hebrew text says the same thing as its English text. The same facts, dates, numbers, names and vote directions. Nothing added, nothing dropped.
5. **Strength and hedging:** a tentative English statement is tentative in Hebrew; a plain one is plain. No "ככל הנראה" where English is definite, and no certainty where English hedges.
6. **Fits the label in Hebrew:** read the Hebrew alone and decide whether it reads as agrees, partly agrees, disagrees or unclear. It must match the `agreement` value. An unclear text implies no stance.
7. **Glossary:** the Hebrew glossary term wherever the glossary covers the term; nothing from `avoid.he`.
8. **Neutral in Hebrew:** note anything that reads as loaded in Hebrew even though it is formally equivalent to the English (a verb that implies doubt, a word associated with one political camp, a label a party's supporters would not use for themselves).
9. **Natural Hebrew:** it reads as written in Hebrew, not as a word-for-word translation; plain language; the user is addressed in a form that reads the same for men and women where Hebrew allows.
10. **Form:** 1–2 sentences per issue text, one per point; no poll figures; no option IDs, citation numbers, links or Markdown; names in the registry's Hebrew forms; a reference to the user's choice uses the words of the Hebrew option text.

## How to report

Write your log to `research/review/matching/texts-he-{{PARTY}}.md`. Create the folder if needed. Write nothing else: **don't edit the Hebrew file or the English file.** The findings go back to the Hebrew author (or another agent that is not you), and you then confirm each fix and fill in Status.

If a discrepancy suggests the **English** text is wrong, don't touch either file. Record it under "English texts questioned". The English goes back through Stage 7c, and the Hebrew is redone after it.

Severities:
- **must-fix:** a difference in structure, `agreement` values or anchors; a fact, date, number or name that differs; a claim added or dropped; a change in strength or hedging; a Hebrew text that reads as a different label; a term from `avoid.he`; a loaded word; a poll figure.
- **should-fix:** a glossary term not used where one exists; wording that reads as translated or unclear; a gendered form where a neutral one is available; a text longer than two sentences.
- **note:** anything that needs no change.

```md
# Hebrew texts parity check: {{PARTY}}

- Checked on <date> by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: <agent label and model> · Parity check by: <agent label and model> (different)
- Structure, agreement values and anchors: identical ✔ / differences listed below
- Texts compared: <n option texts> + <n unclear> + <n points> · must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|

## English texts questioned

<issue / option: what looks wrong in the English, or "none">

## What was verified

<one line per check 1–10: done, and how>
```

For the trial party, add a short section **"Trial verdict"**: is the writing model good enough for the other 27 parties, or should the writing move to Opus? Base it on how many must-fix findings were about meaning drift or loaded wording.

Run `CONTENT_CORPUS=real pnpm validate:content` and note in the log whether the Hebrew file raises any error. Don't commit, don't change git config, don't spawn sub-agents.

Report back concisely: counts by severity, the must-fix items, any English text questioned, and for the trial party the verdict.
