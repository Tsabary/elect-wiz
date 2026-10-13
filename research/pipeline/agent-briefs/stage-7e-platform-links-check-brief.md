# Stage 7e agent brief (platform links, verifier)

The orchestrator gives the verifier this brief plus the party IDs and the finder's log. Replace `{{PARTIES}}` and `{{FINDER_LOG}}` (the path of the finder's log, e.g. `research/review/matching/platform-links.md`). **The verifier must be a different agent from the finder of those links.**

---

You are the Stage 7e platform-link verifier for this repository: an Israeli election party-matcher (Task 4.2 in `tasks-deterministic-matching.md`). You did NOT find the links you are checking; a different agent did. If you did, stop and tell the orchestrator.

YOUR PARTIES: {{PARTIES}}
THE FINDER'S LOG: {{FINDER_LOG}}

## What this is for

24 parties on the ballot are "listed only" on the site: each page shows official details and, where one exists, a link to the party's own platform or website, labelled as the party's own material that the site has not checked. A link goes into the registry only after you confirm it. A wrong link would send voters to the wrong place under a party's name, and nobody reviews the links after you.

## Read

- The finder's log: for each party, a proposed link or "none found", "social account only" or "http only", with what was searched.
- `content/registry/parties.json` and `content/registry/lists.json`: each party's names, leader, ballot letters, top candidates and existing sources.
- `research/ground-truth.md`.

## Tools

WebFetch, and curl for sites that block it. WebSearch for the "none found" checks. **Open every proposed link yourself, in this session.** Don't accept the finder's description of a page, and don't confirm anything from memory or a search snippet.

## The rules a link must meet

- It is the party's own official website or platform page.
- `https` only.
- It belongs to the party itself: not a news article, not Wikipedia, not a third-party profile, voter guide or candidate directory, not a crowdfunding or petition page, not a social-media account.
- It is recorded as the final address after redirects, without tracking parameters.

## What you verify

For every proposed link:

1. **`https` and loads:** the address starts with `https://`, and returns the page (not an error, a certificate warning, a login wall or an empty shell). Note the final address after redirects; it must be the one recorded.
2. **Belongs to the party:** at least **two** signs that you see yourself: the party's name as in the registry; its leader or candidates as in the registry; its ballot letters; a link to this site from the Central Elections Committee, the Party Registrar or the party's own account.
3. **Not a look-alike:** not a different party with a similar name, not an older party of the same name, not a site left from a past election with other candidates, not a parked, resold or taken-over domain.
4. **Not a third-party page,** as listed above.
5. **Best page:** if the site has a platform (מצע) page and the finder recorded the home page, say so and give the platform page's address.

For every party without a link:

6. **"None found":** run at least one search of your own for the party's Hebrew name (with "מצע" or "אתר רשמי"). If you find a qualifying site, record it as a finding with the address and its two signs.
7. **"Social account only" and "http only":** confirm that is still the case (try the `https` address once).

For the whole log:

8. Every one of your parties has a row, and every row without a link says what was searched.

## How to report

Write your log to `research/review/matching/platform-links-check.md`. Create the folder if needed. Write nothing else: **don't edit the registry or the finder's log.** The orchestrator writes into `content/registry/parties.json` only the links you confirmed, in this fixed form, with `checkedOn` set to the date you loaded the page:

```json
"platform": { "url": "…", "checkedOn": "YYYY-MM-DD" }
```

A party with no confirmed link gets no `platform` field.

Severities:
- **must-fix:** the link doesn't load; it isn't `https`; it isn't the party's own page; it belongs to a different party or to nobody; fewer than two signs could be seen. The link must not enter the registry.
- **should-fix:** the recorded address isn't the final address or carries tracking parameters; a platform page exists and the home page was recorded; a qualifying site exists for a "none found" party.
- **note:** anything that needs no change (for example, a site that loads slowly, or a platform published only as a PDF on the party's own domain).

```md
# Platform links check

- Checked on <date> by the Stage 7e verifier (not the finder of these links)
- Finder: <agent label from the orchestrator>
- Parties checked: <n> · links confirmed: <n> · links rejected: <n> · no link confirmed: <n>
- must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Verdict per party

| Party ID | Proposed URL | Loads over https (final address) | Signs seen by the verifier | Verdict (confirmed / rejected / no link confirmed) | Date loaded |
|---|---|---|---|---|---|

## Findings

| # | Party | Severity | Finding | Suggested fix | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|

## What was verified

<one line per check 1–8: done, and how>
```

No poll figures in the log, and no description or judgment of any party's positions. Don't commit, don't change git config, don't spawn sub-agents.

Report back concisely: links confirmed, links rejected with the reason, and the parties left without a link.
