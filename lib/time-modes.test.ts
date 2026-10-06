import { describe, expect, it } from "vitest";
import { isElectionOver, isPollBlackout, timeConfig } from "./time-modes";

describe("time modes (Phase 1 minimal)", () => {
  const cfg = timeConfig({});

  it("defaults to the researched instants", () => {
    expect(new Date(cfg.pollBlackoutStart).toISOString()).toBe("2026-10-23T09:00:00.000Z");
    expect(new Date(cfg.electionClose).toISOString()).toBe("2026-10-27T20:00:00.000Z");
  });

  it("switches blackout on at the configured instant", () => {
    expect(isPollBlackout(new Date("2026-10-23T08:59:59.999Z"), cfg)).toBe(false);
    expect(isPollBlackout(new Date("2026-10-23T09:00:00Z"), cfg)).toBe(true);
    expect(isPollBlackout(new Date("2026-11-30T00:00:00Z"), cfg)).toBe(true);
  });

  it("switches election-over on at poll close", () => {
    expect(isElectionOver(new Date("2026-10-27T19:59:59.999Z"), cfg)).toBe(false);
    expect(isElectionOver(new Date("2026-10-27T20:00:00Z"), cfg)).toBe(true);
  });

  it("reads overrides from the environment and ignores invalid values", () => {
    const c = timeConfig({
      POLL_BLACKOUT_START: "2026-10-01T00:00:00+03:00",
      ELECTION_CLOSE: "nonsense",
    });
    expect(new Date(c.pollBlackoutStart).toISOString()).toBe("2026-09-30T21:00:00.000Z");
    expect(new Date(c.electionClose).toISOString()).toBe("2026-10-27T20:00:00.000Z");
  });
});
