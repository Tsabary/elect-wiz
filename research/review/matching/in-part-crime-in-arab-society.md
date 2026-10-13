# `inPart` on `emergency-powers-shin-bet` (crime-in-arab-society)

Date: 2026-10-13. Scope: the 13 rows in `content/matching/positions/crime-in-arab-society.json` whose `held` includes `emergency-powers-shin-bet`. For each, only the party's `{#issue-crime-in-arab-society}` sub-section in `content/research/en/<partyId>.md` was read. Nothing from memory, other sections, other parties' documents or the web.

The option proposes two separable measures: (a) extraordinary measures that bring in the Shin Bet against the crime organisations, and (b) a new power to hold suspected crime bosses without trial. By owner decision (2026-10-13) the `inPart` flag is used for this option only.

## The rule, applied identically to every party

- `inPart: true` when the research documents the party backing the Shin Bet / emergency element but not holding suspects without trial, whether because the research found nothing on detention without trial or because the party opposes it.
- No `inPart` when the research documents the party (its platform, its MKs or ministers acting for it, its leader, or, for a party whose evidence is its candidates' record, those candidates) backing both elements, from 2021 onwards.
- `inPart: true` also when the research documents the detention element but not the Shin Bet element. No row fell under this case.

Only `inPart` was added and a clause appended to `basis`. No `level`, `ruledOut`, `unclear` or `anchor` changed, and no other row or option was touched.

## Result: 10 rows held in part, 3 rows held in full

| Party | Level | `inPart` | Shin Bet / emergency element | Detention without trial | Deciding words in the research |
|---|---|---|---|---|---|
| amcha-yisrael | secondary | yes | not documented | not documented | "No statement was found on the July 2026 government plan to involve the Shin Bet in fighting crime organizations, on holding suspects without trial…" Closest line: "does not say whether the party supports Shin Bet involvement or special detention powers". (Borderline, see below.) |
| byachad-bennett | main | yes | backed | nothing found | "we will define crime as a security threat... and bring the Shin Bet into the campaign"; "The plan does not mention holding suspects without trial". Closest line: "no position was found on the new power to hold suspects without trial that this option also includes." |
| eretz-yisrael-shelanu | main | no | backed | backed | "In June 2023 Kroizer … backed an Otzma bill to give the National Security Minister and the police commissioner the power to hold people in administrative detention (holding someone without trial)"; he called it "one of the aggressive tools we demanded to fight an all-out war against crime organizations, both Jewish and Arab". "On 15 July 2026 the government, in which Wasserlauf serves, approved a national plan … that for the first time brings the Shin Bet … into joint operations with the police". Closest line: "including the Shin Bet and detention without trial for crime bosses". (See below.) |
| jewish-national-front | main | no | backed | backed | "On 15 July 2026 the government approved a plan, led by Netanyahu, … May Golan and Ben Gvir, to bring the Shin Bet into the fight"; "In June 2023 Otzma Yehudit published a bill that would let the National Security Minister approve renewable six-month administrative detentions for people considered a danger to the public". Closest line: "bring in the Shin Bet and give the police a power to hold suspected crime bosses without trial". (See below.) |
| likud-party | main | yes | backed | nothing found | "a plan, proposed by Prime Minister Netanyahu, … that brings the Shin Bet … into the fight against organized crime in Arab communities". Closest line: "No Likud position specifically on holding crime bosses without trial was found in the sources reviewed." |
| national-union-tkuma | main | yes | backed | nothing in the sub-section | "Smotrich called for involving the Shin Bet in combating illegal weapons in the Negev and northern Israel, and proposed that 'possession of illegal weapons' be defined as terrorism by a temporary order, with prison terms of 10 years". Closest line: "including the Shin Bet and terrorism-style powers". The sub-section never mentions detention without trial or administrative detention. |
| new-hope | secondary | yes | backed by one vote | nothing found | "They voted **for** the Special Powers to Combat Crime Organizations (Temporary Provisions) bill … Maariv described Fogel's bill as resting on declaring crime organizations to be terror organizations, after which the police and the Shin Bet could use technological and investigative tools that only the Shin Bet now has". "No current New Hope platform or leadership statement was found on the Shin Bet plan, on holding crime suspects without trial…"; "none of the sources opened shows him proposing a role for the Shin Bet or detention without trial." |
| the-democrats-party | main | yes | backed | nothing found | "declare a 'national state of emergency' and set up a national task force" drawn from "the police, the Shin Bet, the IDF and the Prison Service"; "**Not found:** The platform does not mention holding suspects without trial". Closest line: "no support for holding suspects without trial was found." |
| the-reservists | main | yes | backed | nothing found | "a new Shin Bet division to fight crime in Arab society"; "The party's published plans do not mention holding suspects without trial". Closest line: "it has not addressed detention without trial." |
| yesh-atid | either | yes | backed | nothing found | "'bring the Shin Bet into the picture'"; "The plans reviewed do not mention detention without trial". Closest line: "part of `emergency-powers-shin-bet`, but without the detention-without-trial power that option includes". |
| yesodot-yisrael | either | yes | backed | nothing in the sub-section | "setting up a dedicated division in the Shin Bet … to fight crime in Arab society". Closest line: "The Magen David Plan's dedicated Shin Bet division points toward `emergency-powers-shin-bet`." The sub-section never mentions detention without trial or administrative detention. |
| yisrael-beytenu | main | no | backed | backed | Platform: "dedicated legislation that will allow administrative detention [detention without trial] of heads of crime organizations and the use of spyware"; "In September 2025, visiting the Galilee, Liberman proposed … involvement of the Shin Bet"; in September 2026 "a comprehensive apparatus that also includes the Shin Bet". Closest line: "including the Shin Bet and detention without trial for crime bosses". |
| zehut | main | yes | backed | opposed | "transfer the handling of them to the Shin Bet"; "The same platform says 'the use of administrative detention will be abolished'… So while Zehut supports bringing in the Shin Bet, it opposes the detention-without-trial power included in the most far-reaching option." Closest line: "The evidence therefore fits the first option only in part." |

## Borderline rows

- **amcha-yisrael (flagged; the rule does not cover the case cleanly).** The research documents neither element: no statement on Shin Bet involvement and none on holding suspects without trial. What it does document is "a national coordinating body for the fight against crime that will combine intelligence, enforcement and economic sanctions" and "the legislative package against crime organizations, after which a national enforcement operation will begin". The rule's `inPart` case assumes the Shin Bet element is documented; its no-`inPart` case requires both elements documented. Neither holds. The row was flagged because the condition for holding the option in full is not met. The other reading, that an option held on a tentative line with neither element documented is not "held in part" but simply weakly held (already expressed by `secondary`), would leave it unflagged. This matters for the result text: with the flag, the computed label for a voter who chose this option moves from "partially" to "disagrees". The owner should confirm.
- **new-hope (flagged).** The rule fits: the December 2025 vote is for a bill about Shin Bet counter-terrorism tools, and nothing was found on detention without trial. But the option is `secondary` on a tentative line and "no party statement explains that vote", and the flag moves the computed label from "partially" to "disagrees", the same effect as for amcha-yisrael.
- **eretz-yisrael-shelanu (not flagged).** Detention without trial is documented directly (Kroizer's June 2023 statement, a candidate's record, after 2021). The Shin Bet element rests on the July 2026 government decision "in which Wasserlauf serves", and "The report does not give a minister-by-minister vote". It was counted because the Closest line states both elements for the party's candidates and the brief treats this party's evidence as its candidates' record.
- **jewish-national-front (not flagged).** Both elements are documented. One limit: "At the time he opposed using administrative detention against Jewish suspects", while the option covers "Arab or Jewish" suspects; the research adds that "his 2023 bill did not limit its scope by community". The row's existing `basis` already carries this caveat. The rule asks whether the party backs detention without trial for crime suspects, which it does, so no flag.
- **national-union-tkuma and yesodot-yisrael (flagged).** Their sub-sections do not say "not found" about detention without trial; they are silent on it. Silence is "the research found nothing on detention without trial" under the rule. For national-union-tkuma, "terrorism-style powers" and defining weapons possession "as terrorism" were not read as detention without trial: the measures named are a terrorism definition and 10-year prison terms.
- **yisrael-beytenu (not flagged).** The platform quoted for administrative detention is undated in the sub-section; it is treated as the current platform, as the sub-section does.

## Effect on the computed labels

`pnpm validate:content` (real corpus) reports 11 `texts-agreement` errors after the change, all on issue `crime-in-arab-society`, option `emergency-powers-shin-bet`. The texts are not changed here; they go back through 7c (and 7d for the Hebrew file).

| Text file | Written for | Score now gives |
|---|---|---|
| `texts/en/byachad-bennett.json` | agrees | partially |
| `texts/en/likud-party.json` | agrees | partially |
| `texts/en/national-union-tkuma.json` | agrees | partially |
| `texts/en/the-democrats-party.json` | agrees | partially |
| `texts/en/the-reservists.json` | agrees | partially |
| `texts/he/the-reservists.json` | agrees | partially |
| `texts/en/yesh-atid.json` | agrees | partially |
| `texts/en/yesodot-yisrael.json` | agrees | partially |
| `texts/en/zehut.json` | agrees | partially |
| `texts/en/amcha-yisrael.json` | partially | disagrees |
| `texts/en/new-hope.json` | partially | disagrees |

No error was reported for eretz-yisrael-shelanu, jewish-national-front or yisrael-beytenu (unchanged rows).

## Orchestrator decision (2026-10-13)

The flag was removed from the two `secondary` rows, amcha-yisrael and new-hope. A `secondary` level already expresses a weak or tentative hold, and adding the flag would have counted that twice and turned "partly agrees" into "disagrees" for them. `inPart` therefore stands on 8 rows: byachad-bennett, likud-party, national-union-tkuma, the-democrats-party, the-reservists, zehut (all `main`), and yesh-atid and yesodot-yisrael (`either`).
