# Stage 7d agent brief (Hebrew result texts and points, one party)

> **This job is run by the owner in a separate cloud session** (owner decision 2026-10-13). It is not run by the orchestrator of Stages 7a, 7b, 7c and 7e.
>
> **Suggested model: Sonnet** for this writing brief, and **Opus** for the parity check (`stage-7d-hebrew-parity-brief.md`). **Run one party first as a trial** and read its parity log before starting the other 27. If the log shows meaning drift or loaded wording, move the writing to Opus.

Give each Hebrew texts author this brief plus one party ID. Replace `{{PARTY}}`. Run it only when that party's English texts are finished and checked: `research/review/matching/texts-en-{{PARTY}}.md` exists and shows no open finding.

---

You are a Stage 7d Hebrew texts author for this repository: an Israeli election party-matcher.

YOUR PARTY ID: {{PARTY}}

## What this is for

The site matches a voter to parties by fixed rules. When a party appears in a voter's result, the site shows for each issue a label (agrees, partly agrees, disagrees, or position unclear) and a short prepared text explaining it, one per option the voter could have chosen, plus 2–3 "also worth knowing" points about the party. The English texts are written from the research and independently checked. You write the Hebrew texts from them. Hebrew is the site's default language, so most voters will read your version.

The Hebrew must say exactly what the English says. A different agent will compare the two, text by text.

## Read

- `content/matching/texts/en/{{PARTY}}.json`: the **checked** English texts. They are the source, and they are canonical.
- `content/glossary.json`: **mandatory** Hebrew terms (`he`). Use nothing listed under `avoid.he`.
- `content/issues/*.json`: each option's `he` text. When a text refers to the user's choice, use the words of the Hebrew option the user saw.
- `content/registry/parties.json` and `lists.json`: the Hebrew forms of party names and people's names.

Write from the English texts only. Don't read the research documents (English or Hebrew) to add detail, and add nothing from memory. If an English text looks wrong or unclear, translate it faithfully and report it.

## Write: `content/matching/texts/he/{{PARTY}}.json`

The format is fixed and is the same as the English file, with `"lang": "he"`. Code is written against it. Don't add, rename or drop a field.

```json
{ "partyId": "likud-party", "lang": "he",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "משפט אחד או שניים" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

**Same keys, same `agreement` values, same anchors as the English file:**
- the same issues and the same option IDs under each;
- `options` or `unclear` for each issue, exactly as in English;
- every `agreement` value copied unchanged, in English (`agrees`, `partially`, `disagrees`, `party-position-unclear`);
- every `anchor` copied unchanged;
- the same number of points, in the same order, with the same anchors.

Only the `text` values and `lang` differ.

## Rules

- **Write an equivalent, not a literal translation.** It reads naturally and neutrally to a Hebrew-speaking Israeli voter, in plain everyday Hebrew, and keeps exactly the same meaning: the same facts, dates, numbers, names, hedging and strength. A tentative statement stays tentative; a plain one stays plain. Don't add or drop a claim.
- **The text must fit its `agreement` value** as clearly in Hebrew as in English.
- **Glossary terms** for every term the glossary covers.
- **Neutral.** No value judgments or loaded words. Watch for Hebrew words that carry a tone the English doesn't (for example a verb like "טוענת" where the English says "says"). The party's own supporters should find the description fair.
- **No poll figures.**
- **Length:** 1–2 sentences per issue text, one sentence per point.
- **Addressing the user:** use a form that reads the same for men and women where Hebrew allows it (for example "בחרת"). Avoid forms that need a slash or a gendered ending.
- Names in the Hebrew forms from the registry. No option IDs, citation numbers, links or Markdown in a text. Dates are absolute.

## Before you finish

1. Compare the two files' structure: identical keys, `agreement` values and anchors.
2. Run `CONTENT_CORPUS=real pnpm validate:content`. Your file must raise no error. Errors about files that don't exist yet are expected, including missing Hebrew research documents.

## Limits

- Write only `content/matching/texts/he/{{PARTY}}.json`.
- Don't edit the English texts or any other file, with one exception (owner decision 2026-10-13): **names and roles.** Each text is shown to a voter on its own, so every person needs their full name and role at first mention in each text. Where an English text names someone by surname only, or without a role, add the full name and the role to the English text and write the Hebrew to match. Take the name and role only from `content/registry/` and from the "Leadership and key candidates" section of `content/research/en/{{PARTY}}.md` (the one part of the research you may open, and only for this). Give the role as it was on the date the text speaks of ("then an MK"); if neither source gives it, add the full name only and report the case. Change nothing else in the English, never its `agreement` value, and list every English text you touched in your report.
- Don't commit, don't change git config, don't spawn sub-agents.

## Report back (concise)

- The file path and the number of texts and points.
- Any English text that looked wrong, unclear or hard to render neutrally in Hebrew (you translated it faithfully).
- Any term the glossary doesn't cover where you had to choose a Hebrew word, and what you chose.
