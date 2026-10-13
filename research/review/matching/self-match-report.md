# Self-match report (real corpus)

Written by the self-match test (`lib/matching/self-match.ts`). For each researched party, a voter answers the issues where the party has a recorded position, picks the party's highest-level option on each, and every party is scored on those issues with equal weights.

- Parties tested: 28
- Blocking failures (outscored on a `main` issue): 0
- Reported for review (another party finishes ahead overall): 6

## Blocking failures

None.

## Reported for review

Expected by design when the tested party's own rows are `either` or `secondary`; each case can also point at a row that deserves a second look.

- `israel-first` (0.781) finishes behind `amcha-yisrael` (0.807). Outscored on: `judea-samaria` (own level either, other scores 1.000); `judicial-system` (own level secondary, other scores 1.000).
- `israel-first` (0.781) finishes behind `likud-party` (0.850). Outscored on: `gaza` (own level secondary, other scores 1.000); `iran-and-regional-security` (own level secondary, other scores 1.000); `judicial-system` (own level secondary, other scores 1.000); `religion-and-state` (own level secondary, other scores 1.000).
- `the-reservists` (0.920) finishes behind `byachad-bennett` (0.945). Outscored on: `housing` (own level secondary, other scores 0.850); `religion-and-state` (own level secondary, other scores 1.000).
- `new-economic-party` (0.840) finishes behind `byachad-bennett` (0.845). Outscored on: `housing` (own level secondary, other scores 0.850); `iran-and-regional-security` (own level secondary, other scores 1.000); `religion-and-state` (own level secondary, other scores 1.000).
- `meretz` (0.840) finishes behind `the-democrats-party` (0.920). Outscored on: `gaza` (own level secondary, other scores 1.000); `iran-and-regional-security` (own level secondary, other scores 1.000); `october-7-inquiry` (own level secondary, other scores 1.000).
- `chomat-torat-yisrael` (0.900) finishes behind `shas` (0.925). Outscored on: `iran-and-regional-security` (own level secondary, other scores 1.000); `october-7-inquiry` (own level secondary, other scores 1.000).

## Parties

| Party | Known issues | Score | Tied with |
| --- | --- | --- | --- |
| `byachad-bennett` | 10 | 0.985 | – |
| `yesh-atid` | 10 | 0.970 | – |
| `yashar-leyisrael` | 10 | 1.000 | – |
| `yesodot-yisrael` | 8 | 0.981 | – |
| `amcha-yisrael` | 10 | 0.880 | – |
| `israel-first` | 8 | 0.781 | – |
| `yisrael-beytenu` | 10 | 1.000 | – |
| `jewish-national-front` | 9 | 0.911 | `eretz-yisrael-shelanu`, `national-union-tkuma` |
| `eretz-yisrael-shelanu` | 9 | 0.956 | `national-union-tkuma` |
| `the-reservists` | 10 | 0.920 | – |
| `new-economic-party` | 10 | 0.840 | – |
| `the-democrats-party` | 10 | 1.000 | – |
| `meretz` | 10 | 0.840 | – |
| `raam` | 9 | 0.850 | – |
| `shas` | 10 | 0.960 | – |
| `haredi-public` | 3 | 1.000 | – |
| `likud-party` | 10 | 1.000 | – |
| `new-hope` | 10 | 0.880 | – |
| `blue-and-white` | 10 | 0.920 | – |
| `national-union-tkuma` | 10 | 1.000 | – |
| `zehut` | 10 | 0.985 | – |
| `atid-echad` | 8 | 0.950 | – |
| `hadash` | 10 | 0.960 | – |
| `taal` | 10 | 0.920 | – |
| `balad` | 8 | 0.950 | – |
| `degel-hatorah` | 9 | 0.911 | – |
| `agudat-yisrael` | 9 | 0.867 | – |
| `chomat-torat-yisrael` | 8 | 0.900 | – |

## Notes

None.
