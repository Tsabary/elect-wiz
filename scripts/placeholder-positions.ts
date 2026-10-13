/**
 * Where each FICTIONAL placeholder party stands on each issue. The one source
 * for both placeholder generators, so the research documents
 * (`generate-placeholder-research.ts`) and the matching content
 * (`generate-placeholder-matching.ts`) always agree.
 *
 * Options are named by their index in the issue's option list, so the table
 * survives a rewording of the options. An index past the end wraps around.
 */
import type { Issue, PositionLevel } from "../lib/content/schemas";

/** One party's stand on one issue; null when no position is documented. */
export type Stand = null | { index: number; level: PositionLevel }[];

const main = (index: number): Stand => [{ index, level: "main" }];
const mainWith = (index: number, secondary: number): Stand => [
  { index, level: "main" },
  { index: secondary, level: "secondary" },
];
const either = (a: number, b: number): Stand => [
  { index: a, level: "either" },
  { index: b, level: "either" },
];
const secondary = (index: number): Stand => [{ index, level: "secondary" }];
/** The issue's last option, whatever their number. */
const LAST = -1;

/**
 * Issue ID → the party's stand. The rows are designed so that some set of
 * answers produces each result case (see `PLACEHOLDER_PROFILES` below):
 * - `blue-horizon` holds the first option everywhere and `cedar-tradition` the last;
 * - `olive-branch` and `green-valley`, the joint list, sit next to each other in between;
 * - `lighthouse` (a list polling below the threshold) holds a mix nobody else does;
 * - `pebble-citizens` (limited information) has a position on three issues only.
 */
export const PLACEHOLDER_STANDS: Record<string, Record<string, Stand>> = {
  "blue-horizon": {
    "cost-of-living": main(0),
    "crime-in-arab-society": main(0),
    gaza: main(0),
    "haredi-enlistment": main(0),
    housing: main(0),
    "iran-and-regional-security": main(0),
    "judea-samaria": mainWith(0, 1),
    "judicial-system": main(0),
    "october-7-inquiry": main(0),
    "religion-and-state": main(0),
  },
  "olive-branch": {
    "cost-of-living": main(1),
    "crime-in-arab-society": main(1),
    gaza: main(1),
    "haredi-enlistment": main(1),
    housing: either(1, 2),
    "iran-and-regional-security": main(1),
    "judea-samaria": main(2),
    "judicial-system": main(1),
    "october-7-inquiry": main(1),
    "religion-and-state": main(1),
  },
  "green-valley": {
    "cost-of-living": mainWith(2, 1),
    "crime-in-arab-society": main(1),
    gaza: main(2),
    "haredi-enlistment": main(2),
    housing: main(2),
    "iran-and-regional-security": main(2),
    "judea-samaria": main(3),
    "judicial-system": main(2),
    "october-7-inquiry": main(1),
    "religion-and-state": main(2),
  },
  "cedar-tradition": {
    "cost-of-living": main(LAST),
    "crime-in-arab-society": main(LAST),
    gaza: main(LAST),
    "haredi-enlistment": main(LAST),
    housing: main(LAST),
    "iran-and-regional-security": main(LAST),
    "judea-samaria": main(LAST),
    "judicial-system": main(LAST),
    "october-7-inquiry": null,
    "religion-and-state": main(LAST),
  },
  lighthouse: {
    "cost-of-living": main(0),
    "crime-in-arab-society": main(2),
    gaza: main(4),
    "haredi-enlistment": main(1),
    housing: main(3),
    "iran-and-regional-security": secondary(1),
    "judea-samaria": main(4),
    "judicial-system": main(0),
    "october-7-inquiry": main(2),
    "religion-and-state": main(1),
  },
  "pebble-citizens": {
    "cost-of-living": main(1),
    "crime-in-arab-society": main(0),
    gaza: null,
    "haredi-enlistment": null,
    housing: main(2),
    "iran-and-regional-security": null,
    "judea-samaria": null,
    "judicial-system": null,
    "october-7-inquiry": null,
    "religion-and-state": null,
  },
};

/** A party's stand on an issue with the indices resolved to that issue's options. */
export function standOn(partyId: string, issue: Issue) {
  const stand = PLACEHOLDER_STANDS[partyId]?.[issue.id];
  if (stand === undefined) {
    throw new Error(`placeholder-positions.ts has no stand for "${partyId}" on "${issue.id}"`);
  }
  const n = issue.options.length;
  return (
    stand &&
    stand.map(({ index, level }) => ({ option: issue.options[((index % n) + n) % n], level }))
  );
}
