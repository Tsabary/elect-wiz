# Stage 7e agent brief (platform links, finder)

The orchestrator gives the finder this brief plus the party IDs to cover. Replace `{{PARTIES}}` with the list (all 24 listed parties, or a batch). If several finders run at once, give each its own batch number as `{{BATCH}}`; with one finder, leave the log name as `platform-links.md`.

---

You are the Stage 7e platform-link finder for this repository: an Israeli election party-matcher (Task 4.2 in `tasks-deterministic-matching.md`).

YOUR PARTIES: {{PARTIES}}

## What this is for

The site researches and matches 28 parties. The other 24 parties on the ballot are "listed only": each has a page showing official details (name, list, ballot letters, leader, top candidates) and, where one exists, **a link to the party's own platform or website**. The page labels the link as the party's own material that the site has not checked. Nothing from the party's site is copied or summarised.

You find that link for each party, or establish that there is none. A wrong link (a news article, a different party with a similar name, a taken-over domain) would send voters to the wrong place under the party's name, so the link must demonstrably belong to the party. A different agent will verify every link you propose.

## Read

- `content/registry/parties.json`: your parties' entries (Hebrew and English names, `listId`, leader, existing `sources`). The listed-only parties are the ones with `"tier": "listed"`; they have no file in `content/research/en/`.
- `content/registry/lists.json`: each party's list (name, ballot letters, top candidates).
- `research/ground-truth.md`: the Central Elections Committee sources.

## Tools

WebSearch and WebFetch. Use curl (a browser user agent helps) for sites that block WebFetch. **Search in Hebrew first,** then English. Never propose an address from memory or from a search snippet: open every page you propose, in this session.

Where to look, in rough order:
1. the party's Central Elections Committee list page and the sources already in the registry entry;
2. the Party Registrar (רשם המפלגות) record, if it gives an address;
3. a search for the party's Hebrew name, alone and with "מצע", "אתר רשמי", the leader's name and the ballot letters;
4. the party's or leader's own social-media accounts, **only to find a link to its website**.

## What counts

- **The party's own official website or platform page.** Prefer the platform (מצע) page on the party's own site. If there is none, the site's home page.
- **`https` only.** If the site answers only on `http`, try the `https` address. If that fails, record no link, with the result "http only".
- **It must belong to the party itself.** Not a news article, not Wikipedia, not a third-party profile, voter guide or candidate directory, not a crowdfunding or petition page.
- **A social-media account is not a link.** If the party's only presence is a social account, record "social account only", with the account's address in the log, and propose no link.
- **Show that the page belongs to the party** with at least **two** signs that you saw on the page or on an official source: the party's name as in the registry; its leader or candidates as in the registry; its ballot letters; a link to this site from the Central Elections Committee, the Party Registrar or the party's own account.
- **Watch for look-alikes:** a party with a similar name, an older party of the same name, a site left over from a past election, a parked or resold domain.
- Record the **final address after redirects**, without tracking parameters (`utm_…`, `fbclid`).
- **"None found" is a valid result.** Don't stretch the rules to avoid it. The page then shows the official details only.

## What you write

Write **only** the log: `research/review/matching/platform-links.md` (with several finders: `platform-links-batch-{{BATCH}}.md`). Create the folder if needed. **Don't edit `content/registry/parties.json`.** The orchestrator writes each link into the registry after the verifier has confirmed it, in this fixed form on the party's entry:

```json
"platform": { "url": "…", "checkedOn": "YYYY-MM-DD" }
```

A party with no confirmed link gets no `platform` field at all.

Log format:

```md
# Platform links for listed parties

- Searched on <date> by the Stage 7e finder
- Parties covered: <n> · link proposed: <n> · none found: <n> · social account only: <n> · http only: <n>

| Party ID | Result (link / none found / social account only / http only) | URL (https, final address) | Page type (platform page / home page) | Signs it belongs to the party (at least two, where seen) | Searched (queries in Hebrew and English, official pages opened) |
|---|---|---|---|---|---|
```

Fill the "Searched" column for every party, and in full for every party without a link: the verifier and the owner need to see what was tried.

## Limits

- No poll figures in the log.
- Don't describe or judge any party's positions. You are finding an address, not researching the party.
- Don't commit, don't change git config, don't spawn sub-agents.

## Report back (concise)

- Counts by result.
- The parties with no link, each with one line on what was searched.
- Any party where the right site was uncertain (similar names, old sites), and what you chose.
