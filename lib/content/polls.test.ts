import { describe, expect, it } from "vitest";
import {
  ELECTORAL_THRESHOLD_PERCENT,
  isBelowThreshold,
  isNotPolled,
  pollingLineFor,
  pollNoteFor,
} from "./polls";
import type { PollSnapshot } from "./schemas";

const source = { title: "Average", url: "https://example.org/avg" };
const polled = (percent: number): PollSnapshot => ({
  status: "polled",
  percent,
  source,
  asOf: "2026-10-01",
});
const notPolled: PollSnapshot = { status: "not_polled", source, asOf: "2026-10-01" };

describe("threshold helpers", () => {
  it("uses 3.25% as the threshold", () => {
    expect(ELECTORAL_THRESHOLD_PERCENT).toBe(3.25);
  });

  it("is below threshold strictly under 3.25", () => {
    expect(isBelowThreshold(3.24)).toBe(true);
    expect(isBelowThreshold(0)).toBe(true);
    expect(isBelowThreshold(3.25)).toBe(false);
    expect(isBelowThreshold(12)).toBe(false);
  });

  it("produces a below-threshold note with the poll date", () => {
    expect(pollNoteFor(polled(2.1), { blackout: false })).toEqual({
      kind: "below-threshold",
      percent: 2.1,
      asOf: "2026-10-01",
      sourceTitle: "Average",
      sourceUrl: "https://example.org/avg",
    });
  });

  it("produces no note at or above the threshold", () => {
    expect(pollNoteFor(polled(3.25), { blackout: false })).toBeNull();
    expect(pollNoteFor(polled(20), { blackout: false })).toBeNull();
  });

  it("produces a not-polled note", () => {
    expect(pollNoteFor(notPolled, { blackout: false })).toEqual({
      kind: "not-polled",
      asOf: "2026-10-01",
    });
    expect(isNotPolled({ poll: notPolled })).toBe(true);
    expect(isNotPolled({ poll: polled(5) })).toBe(false);
  });

  it("produces no note while the snapshot is pending", () => {
    expect(pollNoteFor({ status: "pending" }, { blackout: false })).toBeNull();
  });

  it("suppresses every note and the polling line during blackout", () => {
    expect(pollNoteFor(polled(2.1), { blackout: true })).toBeNull();
    expect(pollNoteFor(notPolled, { blackout: true })).toBeNull();
    expect(pollingLineFor(polled(9), { blackout: true })).toBeNull();
    expect(pollingLineFor(polled(9), { blackout: false })).toMatchObject({ percent: 9 });
    expect(pollingLineFor(notPolled, { blackout: false })).toBeNull();
  });
});
