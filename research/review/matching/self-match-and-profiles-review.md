# Self-match and profile test review (Task 3.3, real corpus)

Independent review, 2026-10-13. The reviewer did not write the positions, the grids or the profiles. No content or code was changed.

Commands run:

- `CONTENT_CORPUS=real pnpm -s check:self-match`: 28 parties tested, 0 blocking, 6 for review.
- `CONTENT_CORPUS=real pnpm -s check:profiles`: 15 of 16 pass; `libertarian-right` fails.

Scores were recomputed independently from `content/matching/positions/`, `content/matching/distances/` and `content/matching/config.json` and agree with both commands' output.

## Summary

- All 6 self-match cases are the expected effect of tentative, thin or "either" rows. No row or grid value is wrong.
- The profile failure is a wrong expectation: `yashar-leyisrael` should be removed from `notInTop4` of `libertarian-right`.
- No content correction is proposed. No constant needs to change.
- Same-list crowding: 12 of 16 profiles; 10 with two parties of one list, 2 with three, none with four.

## Part A: the six self-match cases

In all six, on every issue the report names, the other party holds the same option as the tested party at a higher level. So no grid value decides any of these cases; only the levels do.

| # | Tested party, behind | Issue | Tested party's row | Deciding research words | Verdict |
|---|---|---|---|---|---|
| 1 | `israel-first` behind `amcha-yisrael` | judea-samaria | `full-sovereignty` either, `partial-sovereignty-area-c` either | "over part of the area … or over all of it"; statements and vote support sovereignty "without saying how far" | Rule 4. Correct. |
| | | judicial-system | `continue-judicial-changes` secondary | "cast as a coalition member. Israel First has not stated a position"; "does not settle how far she supports further changes" | Rule 2 by substance, see note 1. Defensible; not clearly wrong. |
| 2 | `israel-first` behind `likud-party` | gaza | `hold-positions-disarmament-first` secondary | "The evidence is only partial." | Rule 2. Correct. |
| | | iran-and-regional-security | `force-plus-us-backed-agreements` secondary, `military-pressure-until-threats-removed` secondary | "The evidence is partial." | Rule 2. Correct. |
| | | judicial-system | as above | as above | as above |
| | | religion-and-state | `more-choice-local-decisions` secondary, `keep-status-quo` secondary | "The evidence is partial and mixed." | Rule 2. Correct. |
| 3 | `the-reservists` behind `byachad-bennett` | housing | `direct-help-for-buyers` secondary, `develop-periphery-and-transport` secondary | "The evidence is limited" | Rule 2. Correct. |
| | | religion-and-state | `more-choice-local-decisions` secondary | "based on Hendel's 2021 statements; the party has no current formal position" | Rule 2 (indirect). Correct. |
| 4 | `new-economic-party` behind `byachad-bennett` | housing | `develop-periphery-and-transport` secondary, `state-led-affordable-rental` secondary | main argument "does not match any option closely"; "The evidence is mixed" | No first option; closest placed secondary, as the brief says. Correct. |
| | | iran-and-regional-security | `military-pressure-until-threats-removed` secondary | "Tentatively" | Rule 2. Correct. |
| | | religion-and-state | `more-choice-local-decisions` secondary | "lean toward"; "The evidence is limited" | Rule 2. Correct. |
| 5 | `meretz` behind `the-democrats-party` | gaza | `advance-international-arrangement` secondary, `end-war-full-withdrawal` secondary | "Tentative"; "The mapping is tentative" | Rule 2. Correct. |
| | | iran-and-regional-security | `force-plus-us-backed-agreements` secondary, `prioritize-ending-multifront-war` secondary | "Tentative, because the evidence predates the 2025–2026 wars and is mixed" | Rule 2. Correct. |
| | | october-7-inquiry | `state-commission-under-existing-law` secondary | "Tentative"; "rests on indirect evidence" | Rule 2. Correct. |
| 6 | `chomat-torat-yisrael` behind `shas` | iran-and-regional-security | `military-pressure-until-threats-removed` secondary, `force-plus-us-backed-agreements` secondary | "The only evidence is a statement"; "it is not enough to choose between them" | Rule 2 before rule 4, see note 2. Defensible; not clearly wrong. |
| | | october-7-inquiry | `commission-appointed-by-knesset-balance` secondary | "The evidence is thin and mixed"; "This line is tentative." | Rule 2. Correct. |

Case verdicts:

1. `israel-first` behind `amcha-yisrael` (0.781 vs 0.807): expected. Amcha Yisrael's lines state the same two options plainly.
2. `israel-first` behind `likud-party` (0.781 vs 0.850): expected. Four of Israel First's eight known rows are partial-evidence lines on options Likud holds as `main`. Its leader's record was made inside the outgoing coalition, so a firmer coalition party on the same options outscoring it is what the design intends.
3. `the-reservists` behind `byachad-bennett` (0.920 vs 0.945): expected.
4. `new-economic-party` behind `byachad-bennett` (0.840 vs 0.845): expected, by a margin of 0.005.
5. `meretz` behind `the-democrats-party` (0.840 vs 0.920): expected. Meretz's own lines on these three issues are all marked tentative because they predate the October 2025 ceasefire or rest on the joint list leader.
6. `chomat-torat-yisrael` behind `shas` (0.900 vs 0.925): expected.

Notes on the two rows that needed a closer look:

1. **`israel-first`, judicial-system.** The line uses none of the words "tentative", "indirect" or "thin", and its evidence is votes, which rank highest. Read literally, rule 3 (`main`) is possible. But the line says the party "has not stated a position" and that the votes were cast "as a coalition member" in another party's seat, which is indirect evidence in substance. The positions reviewer reached the same view (`positions-judicial-system.md`, finding 3). The line's prose ("Keep the changes the government has passed") also fits a different option than the ID it names. The research line does not clearly support `main`, so I don't call the row wrong. For the record: if it were `main`, Israel First would score 0.831 and pass Amcha Yisrael (0.807) but stay behind Likud (0.850).
2. **`chomat-torat-yisrael`, iran-and-regional-security.** "Fits X or Y; it is not enough to choose between them" is rule 4 wording, but "The only evidence is a statement" is the line calling its evidence thin, and the brief says to check rule 2 first. The positions reviewer changed this row from `either` to `secondary` for that reason, to match `atid-echad`. If it were `either`, the party would score 0.931 and pass Shas (0.925). The current row follows the brief's order of rules, so no change.

One row of the other party matters in cases 3 and 4: `byachad-bennett` on housing is `either` on all four options ("It does not give one option priority over the others"). No rule covers "several options, none first"; the positions reviewer noted this and `yesh-atid` is placed the same way. It is consistent, and at 0.85 it outscores a `secondary` row on the same option, which is reasonable for a party whose plan does include that option.

## Part B: the `libertarian-right` failure

Result: `zehut` 0.886, `yisrael-beytenu` 0.629, `yashar-leyisrael` 0.621, `national-union-tkuma` 0.614, then `byachad-bennett` 0.598, `yesh-atid` 0.590, `degel-hatorah` 0.586. The other excluded parties are far down: `shas` 13th (0.510), `the-democrats-party` 27th (0.284), `meretz` 28th (0.282).

**Resolution: (1) a wrong expectation.** Remove `yashar-leyisrael` from `notInTop4`; keep `meretz`, `the-democrats-party` and `shas`.

Why:

- Yashar's six rows on the ranked issues all follow from its research lines, and all its scores come from `main` rows except the last.

| Issue (rank) | Voter's answer | Yashar's row | Research words | Score |
|---|---|---|---|---|
| cost-of-living (1) | cut-taxes-and-government-spending | `open-market-competition-imports` main, `direct-support-for-households` secondary | "Open the market to more competition and imports" | 0.60 |
| haredi-enlistment (2) | voluntary-service-for-all | `universal-service-with-sanctions` main | "Require everyone, including Haredim, to serve" | 0.20 |
| religion-and-state (3) | more-choice-local-decisions | `more-choice-local-decisions` main | "Keep the Rabbinate but allow alternatives: civil unions and local decisions on Shabbat" | 1.00 |
| housing (4) | speed-up-planning-and-construction | `speed-up-planning-and-construction` main (plus three secondary) | "Build much more, faster" | 1.00 |
| judea-samaria (5) | full-sovereignty | `partial-sovereignty-area-c` main, `maintain-current-situation` secondary | votes "to apply sovereignty to the Jordan Valley" | 0.60 |
| judicial-system (6) | continue-judicial-changes | `repeal-changes-protect-independence` main, `broad-agreed-constitutional-framework` secondary | "Reverse the recent changes" | 0.24 |

- The profile's stated reason for the exclusions is "mapped to state regulation or direct support and to sanctions or the exemption law on enlistment". That is true of Meretz, The Democrats and Shas on cost of living. It is not true of Yashar, whose first cost-of-living option is the open market, the nearest neighbour of the voter's answer.
- Yashar holds the voter's exact option on two of the six issues (religion, housing) and a neighbouring option on two more. It is plainly opposite on enlistment and the courts, which is why it is 0.265 behind Zehut.
- `yisrael-beytenu`, second, has nearly the same rows on these issues (same on cost of living, enlistment, housing; partial sovereignty; more choice on religion) and the profile does not exclude it. Excluding one and not the other is inconsistent.
- A result always lists four parties. Only Zehut is a real match here; places 2 to 7 are within 0.043 of each other (0.586 to 0.629), so which three fill the list is close to arbitrary. `notInTop4` is only safe for parties far from that band, which the other three exclusions are.

Not a content error: no row or grid value on these six issues contradicts its research line. Grid values used (voter option to party option): open market 0.6, sanctions 0.2, partial sovereignty 0.6, broad framework 0.4, repeal 0; none looks wrong.

Not a constants problem: Yashar's score here depends on `main` rows and grid values. No setting of `either`, `secondary` or `unclear` moves it out of the 2-to-7 band without also moving its neighbours.

### The 15 passing profiles

No real problems found. In the 13 non-mixed passing profiles, no party in a top 4 is plainly opposite on the profile's top two ranked issues. In `mixed-hawk-social-democrat`, `the-democrats-party` is third (0.629) while scoring 0.20 on both top issues (Gaza, Judea and Samaria) and 1.00 on the other five; the profile is built to split this way and itself lists that party as an acceptable top match, so this is the intended behaviour. Two fourth places that look odd at first sight, both correct under the rows:

- `arab-pragmatic-conservative`: `degel-hatorah` fourth (0.714). It matches the voter exactly on direct household support and faster building (ranks 2 and 3) and has a thin-evidence `secondary` on more police (rank 1); it scores 0.20 on two states (rank 4).
- `right-wing-reform-and-service`: `degel-hatorah` fourth (0.704). It matches exactly on the courts and the inquiry (ranks 1 and 2) and on Judea and Samaria; it is low on enlistment (0.36) and religion (0.30), ranks 3 and 4.

Both are fourth places some way behind the top, with no expectation against them in the profile.

## Part C: same-list crowding

Of the 16 profiles' top-4 lists:

| Slots from one list | Profiles |
|---|---|
| none shared | 4 |
| 2 of 4 | 10 |
| 3 of 4 | 2 |
| 4 of 4 | 0 |

- **Three of four:** `haredi-interests` (United Torah Judaism: Agudat Yisrael, Degel HaTorah, Chomat Torat Yisrael); `joint-list-positions` (Joint List: Hadash, Ta'al, Balad).
- **Two of four, two lists at once** (all four slots taken by two lists): `security-hawk-full-sovereignty` and `religious-zionist`, each with Religious Zionism–Zehut and Otzma Yehudit.
- **Two of four, one list:** Together (Bennett, Yesh Atid) in `centrist-broad-agreement`, `economy-first-competition`, `five-issues-service-and-security`; The Democrats (Democrats, Meretz) in `centre-left-liberal`, `left-two-state-peace`; Likud (Likud, New Hope) in `likud-mainstream`, `right-wing-reform-and-service`; Religious Zionism–Zehut (Zehut, National Union–Tkuma) in `libertarian-right`.
- **No sharing:** `secular-right-universal-service`, `arab-pragmatic-conservative`, `mixed-hawk-social-democrat`, `mixed-dovish-free-marketeer`.

By list, counting profiles where it holds two or more slots: Together 3, Religious Zionism–Zehut 3, The Democrats 2, Likud 2, Otzma Yehudit 2, United Torah Judaism 1, Joint List 1.

This is a product question for the owner; no change is proposed here.

## Corrections and constants

- Content corrections proposed: none.
- Profile expectation: `content/matching/profiles.json`, `libertarian-right`, `expect.notInTop4`: remove `yashar-leyisrael`. The `reason` text should say the excluded parties are the ones mapped to state regulation or direct support.
- Constants: no reason to change any. The six self-match cases are what `either` 0.85 and `secondary` 0.6 are meant to produce, and the profile failure doesn't depend on them.

## Applied (orchestrator, 2026-10-13)

- `libertarian-right`: removed `yashar-leyisrael` from `expect.notInTop4`, as resolved above (wrong expectation).
- Constants left at the starting values.

## Optional rechecks closed (2026-10-13)

An independent agent rechecked the two optional points raised in the texts checks (`texts-en-jewish-national-front.md`, `texts-en-national-union-tkuma.md`). Both stay as they are.

- **jewish-national-front, haredi-enlistment row** (gradual-targets-by-agreement main, voluntary-service-for-all secondary): stays. "The evidence is mixed" is a rule-5 signal; the line names gradual as closest and never calls itself tentative, indirect or thin. "No source shows the party supporting enlistment targets or funding cuts" is a caveat, not a change of level. The eretz-yisrael-shelanu row has the same shape and also stays.
- **Grid pair anchor-torah-study-exemption / voluntary-service-for-all** (0.5): stays. Both leave yeshiva students unforced and unpenalised and differ on scope, which is the scale's 0.5; 0.4 fits gradual/voluntary, where targets and funding cuts are in play.
