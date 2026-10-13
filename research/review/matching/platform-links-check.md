# Platform links check

- Checked on 2026-10-13 by the Stage 7e verifier (not the finder of these links)
- Finder: the agent behind platform-links-batch-1.md and platform-links-batch-2.md
- Parties checked: 7 (plus a one-line check of bible-bloc) · links confirmed: 7 · links rejected: 0 · no link confirmed: 0
- must-fix: 0 · should-fix: 0 · notes: 6
- Result: pass

## Verdict per party

| Party ID | Proposed URL | Loads over https (final address) | Signs seen by the verifier | Verdict (confirmed / rejected / no link confirmed) | Date loaded |
|---|---|---|---|---|---|
| pirates | https://www.piratim.org/ | Yes, 200, no redirect: https://www.piratim.org/ | Page titled "מפלגת הפיראטים"; its /elections/ page headed "הבחירות לכנסת ה-26 / רשימת המועמדים" lists 1 אוהד שם טוב (registry leader); the home page links to the party's own platform on its wiki (wiki/matza/) | confirmed | 2026-10-13 |
| gan-eden | https://www.ganeden.org.il/platform | Yes, 200, no redirect: https://www.ganeden.org.il/platform | "מפלגת גן עדן" platform page referencing the 26th Knesset elections; /team lists ישוע ישראל בן דוד (chair, PM candidate), טליה דה רוטשילד, יעקוב בן יששכר, יעקוב ליאור כהן, all in the registry list | confirmed | 2026-10-13 |
| you-and-me | https://www.aniveata.org.il/ | Yes, 200, no redirect: https://www.aniveata.org.il/ | Title is the exact registry name "אני ואתה - מפלגת העם הישראלית"; text says founded 2017 "בהובלת ד״ר אלון גלעדי" (registry leader); copyright line in the party's name; party contact address and charter documents hosted on the site | confirmed (weakest of the set, see note 1) | 2026-10-13 |
| hatikun | https://hatikun.org.il/ | Yes, 200, no redirect: https://hatikun.org.il/ | "מפלגה חברתית שיתופית חדשה לתיקון שיטת הבחירות" with a 2026 donation-limit statement and a page last modified 2026-10-08; page code carries a ballot image labelled נקי (registry letters) | confirmed (see note 2 on the leader spelling) | 2026-10-13 |
| hakahal | https://hakahal.co.il/ | Yes, 200, no redirect: https://hakahal.co.il/ | Title "מפלגת הקהל"; the site's script file names "הרב שלמה אלבוים, יו"ר מפלגת הקהל" and "ברוך אדלר, מס' 2 ברשימה", both in the registry list (page itself is a JavaScript shell) | confirmed (see note 3) | 2026-10-13 |
| lazuz | https://www.noamlisrael.org.il/ | Yes, 200, final address https://www.noamlisrael.org.il/ | Title "נעם לישראל – בראשות אבי מעוז" matches the registry list name and leader אבי מעוז; team section lists Eliyahu Libman, Shimon Tubul and Liora Alon, all in the registry's top candidates for the list | confirmed (see note 4) | 2026-10-13 |
| national-responsibility | https://www.noamlisrael.org.il/ | Same as lazuz | Same page presents Eliyahu Libman (this party's registry leader) and Liora Alon, with the Noam list name and leader Maoz | confirmed (see note 4) | 2026-10-13 |

## Findings

| # | Party | Severity | Finding | Suggested fix | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|
| 1 | you-and-me | note | The site is clearly the party's own and not a past-election leftover (the party is the registered one, led by the registry leader). It shows no 2026 list, ballot letters or candidate names, so the tie to this election rests on the party name and leader. | Record the link; the orchestrator may drop it if it wants a 2026 sign. | open |
| 2 | hatikun | note | The leader's surname does not appear in the rendered home page text I read; the finder saw a differently spelled "סלמוביץ" in a song credit. Signs relied on: party name, ballot letters נקי, 2026 content. | None | open |
| 3 | hakahal | note | The page renders as a JavaScript shell with only the party name. Leader and candidates are read from the site's own script, not rendered text. No separate platform page. | None | open |
| 4 | lazuz, national-responsibility | note | One site is shared by two registered parties. The page never names "לזוז" or "אחריות לאומית"; the tie is via the Noam list, leader and candidates. | Record the same address for both, or neither, as one decision. | open |
| 5 | pirates | note | The home page links to a full platform on the party's own wiki (wiki/matza/). I did not load the wiki page; the home page is the confirmed address. | Optionally record the wiki platform page after checking it. | open |
| 6 | bible-bloc | note | Rejection by the orchestrator is upheld: https://www.ght.org.il/ loads and is the party's own site, but its footer reads 2019, it says "בחירות ב1 בנובמבר" (2022), its candidate list has Avi Daniis Lipkin and Rachel Lipkin and not the registry leader Moshe Lipkin. No link. | None | open |

## What was verified

1. https and loads: all seven addresses and ght.org.il fetched today with WebFetch and curl; all returned 200 with a valid certificate; no address changed through redirects.
2. Belongs to the party: at least two signs seen per party, listed above. No Central Elections Committee link to any of the sites was found.
3. Not a look-alike: no site is another party, a parked domain or a clear leftover from a past election (except bible-bloc, set aside).
4. Not third-party: none is news, Wikipedia, a directory or a social account.
5. Best page: gan-eden recorded as the platform page; other sites have no separate platform page, pirates has a wiki platform (finding 5).
6. "None found": no party in my set was without a link, so no searches were needed.
7. "Social account only" / "http only": none in my set.
8. Every one of my parties has a row.

## Recorded in the registry (orchestrator, 2026-10-13)

Seven links were written to `content/registry/parties.json` with `checkedOn` 2026-10-13: pirates, gan-eden, you-and-me, hatikun, hakahal, lazuz and national-responsibility (the last two share the Noam list's site). `bible-bloc` gets no link: its site is left over from the 2022 election. The other 16 listed parties have no link; the finders' logs record what was searched.
