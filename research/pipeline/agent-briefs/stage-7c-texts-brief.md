# Stage 7c agent brief (English result texts and points, one party)

The orchestrator gives each texts author this brief plus one party ID and that party's computed labels. Replace `{{PARTY}}` and `{{COMPUTED_LABELS}}`. Run it only after the positions and grids are checked and the scoring constants are settled. Use Sonnet unless the trial party or the owner says otherwise.

`{{COMPUTED_LABELS}}` is produced by the scoring code from the positions, grids and constants. Give one block per issue, in this form:

```
gaza (held: hold-positions-disarmament-first main, resume-fighting-full-control secondary)
  resume-fighting-full-control: partially
  hold-positions-disarmament-first: agrees
  advance-international-arrangement: disagrees
  end-war-full-withdrawal: disagrees
  defeat-hamas-then-security-control: partially
housing: unclear
```

---

You are a Stage 7c texts author for this repository: an Israeli election party-matcher (Tasks 3.4 and 3.5 in `tasks-deterministic-matching.md`).

YOUR PARTY ID: {{PARTY}}

THE COMPUTED LABELS FOR YOUR PARTY:
{{COMPUTED_LABELS}}

## What this is for

The site matches a voter to parties by fixed rules, with no AI at run time. When a party appears in a voter's result, the site shows, for each issue the voter ranked, a label (agrees, partly agrees, disagrees, or position unclear) and a short text explaining it, with a link to the party's research page. The label is computed. The text is prepared in advance: one for each option the voter could have chosen. You write those texts for one party, plus 2–3 "also worth knowing" points about the party's most notable positions outside the 10 issues.

Every voter who chose a given option sees the same text for this party. So each text must be true, neutral and fair to the party for every such voter. A different agent will check your file against the research. The owner does not review it.

## Read

- `content/research/en/{{PARTY}}.md`. For an issue's texts, use **only** that issue's sub-section, headed `{#issue-<issueId>}`. For the points, use **only** the section `{#other-positions}` and its `{#other-…}` sub-sections.
- `content/issues/*.json`: every issue, its option IDs and English option texts.
- `content/glossary.json`: required terms (`en`) and terms to avoid (`avoid.en`).

Nothing from memory, the web, other sections of the document, or other parties' documents. If the sub-section doesn't say it, the text can't say it.

## Write: `content/matching/texts/en/{{PARTY}}.json`

The format is fixed. Code is written against it. Don't add, rename or drop a field.

```json
{ "partyId": "likud-party", "lang": "en",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "1–2 sentences" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

- All 10 issues are present, keyed by issue ID. `anchor` is `issue-<issueId>`.
- An issue the labels mark as unclear has `unclear` with one text, and no `options`. Every other issue has `options` with one entry for **every** option of that issue, and no `unclear`.
- `points` has 2 or 3 items.

## Rules for the issue texts

- **1–2 neutral sentences, addressed to a user who chose that option.** Say how the party's documented position compares with that option, and cite the party's strongest evidence. "You chose …" is fine, but keep it short: the user already sees their answer on screen, so don't repeat the option in full.
- **Strongest evidence first:** an Action (a vote, a government act, a signed agreement) before a Formal commitment (platform, party decision), before a Statement. Give the date. Use evidence from 2021 onwards and the current leadership only; "Dated background" items don't carry a text.
- **The `agreement` value is not your choice.** Copy the computed label for that issue and option, and write the text so it fits that label. If you believe a computed label is wrong given the research, **write the text to the label anyway** and flag it in your report. Never change a label.
- **`agrees`:** the party holds this option. Say so and give the evidence. If the party is recorded as holding either of two options that the evidence can't tell apart, say that.
- **`partially`** has two causes; make clear which applies. Either the party holds a neighbouring option: say what it shares with the user's option and where it differs. Or the party holds this option only weakly: say that the research's placement is tentative or rests on indirect evidence, or that this is a secondary element of the party's position, in the research's own terms.
- **`disagrees`:** say what the party holds instead, with its evidence. State it plainly, without softening or sharpening.
- **`party-position-unclear`** (on an option, not a whole issue): the scoring gives this label when the party's position on the issue rests only on tentative evidence and the voter chose an option the party isn't linked to. Say what the research found and didn't find: that it found no documented party position on what this option proposes, and where the tentative indication points. Never assert opposition the research doesn't show.

**Lessons from the first six parties' checks** (each of these was a real finding):
- A `disagrees` text may name real, documented common ground ("though it shares X"), but it leads with the difference and never stretches for common ground. `disagrees` doesn't require the party to have opposed the option explicitly: "the party's documented approach is different, and the research found no position on this" is a fair `disagrees` text.
- The common ground you name must be part of the option's own text, not something every option of the issue shares.
- Check the direction of every fact: don't describe a party's reform proposal as keeping a current arrangement, or the reverse; don't call a law that has already passed a "further" change.
- Attribute exactly as the research does: "the party's MKs voted" only when the research says so (not when one MK did, or when "the opposition" or "the coalition" did, or when the people were in another party then). Give a person's role as it was on the date ("then the party's leader", "then an MK").
- Attach each date to the event the research dates, not to a neighbouring one.
- "The research found no…" is allowed only where the sub-section says so; don't infer it from silence, and don't make it wider than the research's own wording.
- Use only facts from the sub-section for that issue, even if another section of the document has a related one.
- Check every term against `avoid` in the glossary, including terms the research quotes a party as using.
- A point must not restate a coalition condition or a legal matter; a platform proposal on eligibility for office is neither.
- Write dates as the research does, day first: "22 October 2025", never "October 22, 2025".
- Say whose act it was: "the government Bennett led", not "the party's government", when the party did not exist or was not in government then; "X said" or "X proposed", not "the party proposes", when the research attributes it to a person's statement.
- Put quotation marks around a label or phrase the research itself quotes (a bill's own name, a leader's words), especially when the glossary lists that wording under `avoid` for neutral use (for example "monopoly" for the Chief Rabbinate's exclusive control, "reform" for the judicial changes).
- A `disagrees` text must show a difference; don't end it on a long sentence of common ground.
- Each text is shown to a voter on its own. Give every person their full name and role at first mention in each text ("party leader Ahmad Tibi", "Orit Strock, the party's only candidate", "Bennett, the joint list's leader"), name a joint list and say the party runs on it, and spell out abbreviations. Where the evidence is one candidate's record made in another party, say so, as the research does.
- Date an event by the date the research gives for the event itself, not the date of the report about it ("reported on 9 June 2026").
- Keep each text to two sentences and under about 400 characters. Before reporting, count your option texts and compare every `agreement` with the script output programmatically.
- **Unclear issue:** the single `unclear` text says the research found no documented position of the party on this issue. It must not imply agreement or disagreement, and must not guess.
- **Neutral.** No value judgments, no loaded adjectives, no scare quotes, no verbs that take a side ("admits", "claims", "merely", "only", "unfortunately"). Describe the position so the party's own supporters would recognise it as fair. Don't compare with other parties.
- **Glossary terms**, and nothing from the `avoid` list.
- **No poll figures:** no polling or survey wording next to a number, seat count or percentage.
- No option IDs, citation numbers (`[4]`), links or Markdown in a text. Dates are absolute ("in March 2025"), never "recently". Say "the party", not its full name.

Invented examples, to show the form only (the party and facts are fictional):

- agrees: "You chose gradual enlistment targets. That is the party's recorded position: its MKs voted for a bill setting such targets in March 2024, and its platform repeats the commitment."
- partially: "The party also wants more homes built faster and voted for the 2023 planning law, but its platform puts direct grants to buyers first, which your answer does not include."
- partially (weak hold): "The research places the party closest to your answer, but only tentatively: it rests on one 2024 statement by the leader, and no vote or platform clause on the question was found."
- disagrees: "You chose a state commission under the existing law. The party's MKs voted against that in November 2025, and its platform calls for a commission appointed through the Knesset."
- unclear: "The research found no documented position of the party on this issue, so it can't be compared with your answer."

## Rules for the "also worth knowing" points

- **2–3 items, each from the "Other notable positions" section.** Choose the positions the party is **most distinctively known for** outside the 10 issues: what a voter would most want to know about this party beyond the survey. The owner's example of a good point: a party that strongly advocates legalising cannabis.
- **Apply the same selection rule as every other party's author:** most distinctive first; among those, prefer a position backed by actions, then by a formal commitment, then by statements; evidence from 2021 onwards.
- **Never legal matters or coalition statements:** nothing about indictments, investigations or rulings involving leaders, and nothing about who the party will or won't sit with in government, even if an `other-…` sub-section mentions them.
- Don't repeat one of the 10 issues.
- **Each point is one neutral sentence** stating the position and, where there is room, its strongest evidence. Same writing rules as the issue texts.
- **`anchor`** is the `other-…` anchor of the sub-section the point comes from, exactly as in the document's heading (`{#other-…}`). Prefer a different sub-section for each point. If the section has only one sub-section, two points may share its anchor.

## Before you finish

1. Check every issue against the labels: the same option IDs, each `agreement` equal to its computed label, unclear issues exactly where the labels say unclear.
2. Re-read each text beside its sub-section: every fact, date and name is there.
3. Run `CONTENT_CORPUS=real pnpm validate:content`. Your file must raise no error. Errors about files that don't exist yet are expected.

## Limits

- Write only `content/matching/texts/en/{{PARTY}}.json`.
- The research is frozen. Don't edit it. Don't edit positions, grids or constants.
- Don't commit, don't change git config, don't spawn sub-agents.

## Report back (concise)

- The file path, the number of option texts, the number of unclear issues, the number of points.
- **Every computed label you believe is wrong given the research:** issue, option, the label, what you would expect, and the research words that make you think so. You wrote the text to the label anyway.
- Any issue where the sub-section gave too little to write a fair text.
- The points you chose and, in a few words each, why they are the most distinctive.
