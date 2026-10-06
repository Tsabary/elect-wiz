# Stage 5: Hebrew edition and parity check

This stage has **two different agents** per party:

- **5a, Hebrew edition agent.** Writes the Hebrew document. It must not be the author of the English document.
- **5b, parity-check agent.** Checks that the two languages say the same thing. It must not be the Hebrew edition agent.

Run it only after Stage 4 is complete, or, for a per-party re-run, after the scoped Stage 4.

---

## 5a: Hebrew edition (one agent per party)

### Inputs
- `content/research/en/<party-id>.md`: the canonical English document. English is canonical (plan, Decisions §7).
- `content/glossary.json`: **mandatory** Hebrew terms (`he`). Don't use anything listed under `avoid.he`.
- `content/issues/*.json`: use each issue's `he.title` as the Hebrew heading of its sub-section.

### Output: `content/research/he/<party-id>.md`

- **Write an equivalent, not a literal translation.** It should read naturally and neutrally to Hebrew-speaking Israeli voters while keeping exactly the same meaning, claims, evidence tiers, contradictions and caveats. Don't add or drop any claim.
- **The frontmatter is the same as the English one,** except `lang: he`. `researchedAsOf` is the same date as the English document.
- **Anchors are identical.** Every heading keeps exactly the same `{#anchor}` as in English, in the same order. Only the heading text is translated. Use these Hebrew section headings:

| Anchor | Hebrew heading |
|---|---|
| `overview` | סקירה כללית |
| `leadership` | הנהגה ומועמדים מובילים |
| `issues` | עמדות בנושאים |
| `other-positions` | עמדות בולטות נוספות |
| `coalition` | עמדה לגבי קואליציה |
| `track-record` | רקורד: הבטחות מול ביצוע |
| `legal` | הליכים משפטיים או אתיים הנוגעים להנהגה |
| `sources` | מקורות |
| `information-availability` | זמינות מידע |

- **Use these Hebrew evidence-tier tags:** `**מעשה:**` (Action), `**התחייבות רשמית:**` (Formal commitment), `**הצהרה:**` (Statement), `**סתירה:**` (Contradiction), `**מידע מוגבל.**` (Limited information), `**האפשרות/ות הקרובה/ות:**` (Closest option(s)). Keep the option IDs in backticks unchanged.
- **Citations are identical.** The same `[n]` numbers sit on the equivalent claims. The Sources list has the same entries in the same order. Keep the original titles and URLs. You may add a Hebrew gloss after an English-language source's title in parentheses. Don't change the URLs.
- **Names** follow the Hebrew forms in `content/registry/` (party names, leader names) and in the original Hebrew sources.
- **No poll figures.** Same rule as English.

Run `npm run validate:content`. It checks that the anchors are identical across languages (`research-anchor-parity`). Your file must produce no errors.

---

## 5b: Parity check (a different agent)

### Procedure
For each party, compare `content/research/en/<party-id>.md` and `content/research/he/<party-id>.md` section by section:

1. **Sections and anchors:** the same set, in the same order. The validator checks this too.
2. **Claims:** every claim in one language appears in the other, with the same meaning, strength, hedging, dates, numbers and names. Nothing is added or dropped.
3. **Evidence tiers and contradictions:** the same tags on the same claims.
4. **Citations:** the same `[n]` on the same claims. Identical Sources lists (count, order, URLs).
5. **"Closest option(s)" lines:** the same option IDs.
6. **Terminology:** the Hebrew uses the glossary terms. Note anything that reads as loaded in Hebrew even though it's equivalent to the English.

Fix trivial discrepancies in the Hebrew document directly. For a discrepancy that suggests the English is wrong, **don't** edit the English. Report it to the orchestrator, which triggers the per-party re-run.

### Output: `research/review/parity-check.md`

Append one section per party:

```md
## <party-id> (checked <date>; EN researchedAsOf <date>)
- Hebrew edition by: Stage 5a agent · Parity check by: Stage 5b agent (different)
- Sections/anchors: identical ✔
- Claims compared: <n> · Differences found: <n> · Fixed: <n> · Unresolved: <n>
| Anchor | Difference | Resolution |
|---|---|---|
```

The parity log must show **no unresolved differences** before the research version is set.

After all parties pass, the orchestrator bumps `researchVersion` in `content/versions.json`.
