import { describe, expect, it } from "vitest";
import {
  clientTimeConfig,
  isElectionOver,
  isPollBlackout,
  parseClockOverride,
  readCookie,
  requestClockOverride,
  resolveNow,
  timeConfig,
  timeModes,
} from "./time-modes";

describe("time modes", () => {
  const cfg = timeConfig({});

  it("defaults to the researched instants", () => {
    expect(new Date(cfg.pollBlackoutStart).toISOString()).toBe("2026-10-23T09:00:00.000Z");
    expect(new Date(cfg.electionClose).toISOString()).toBe("2026-10-27T20:00:00.000Z");
  });

  it("switches blackout on at the configured instant and keeps it on afterwards", () => {
    expect(isPollBlackout(new Date("2026-10-23T08:59:59.999Z"), cfg)).toBe(false);
    expect(isPollBlackout(new Date("2026-10-23T09:00:00Z"), cfg)).toBe(true);
    // Still hidden after the election (archive): legal-findings §3.4.
    expect(isPollBlackout(new Date("2026-11-30T00:00:00Z"), cfg)).toBe(true);
  });

  it("switches election-over on at poll close", () => {
    expect(isElectionOver(new Date("2026-10-27T19:59:59.999Z"), cfg)).toBe(false);
    expect(isElectionOver(new Date("2026-10-27T20:00:00Z"), cfg)).toBe(true);
  });

  it("combines both modes around each boundary", () => {
    expect(timeModes(new Date("2026-10-20T00:00:00Z"), cfg)).toEqual({
      blackout: false,
      electionOver: false,
    });
    expect(timeModes(new Date("2026-10-25T00:00:00Z"), cfg)).toEqual({
      blackout: true,
      electionOver: false,
    });
    expect(timeModes(new Date("2026-10-28T00:00:00Z"), cfg)).toEqual({
      blackout: true,
      electionOver: true,
    });
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

describe("clock override", () => {
  const real = new Date("2026-10-06T12:00:00Z");

  it("parses ISO instants, URL-encoded or not", () => {
    expect(parseClockOverride("2026-10-24T00:00:00Z")?.toISOString()).toBe(
      "2026-10-24T00:00:00.000Z",
    );
    expect(parseClockOverride(encodeURIComponent("2026-10-24T00:00:00+03:00"))?.toISOString()).toBe(
      "2026-10-23T21:00:00.000Z",
    );
    expect(parseClockOverride("tomorrow")).toBeNull();
    expect(parseClockOverride(null)).toBeNull();
  });

  it("applies the cookie/header override, then the env override, outside production", () => {
    const env = { APP_ENV: "test", CLOCK_OVERRIDE: "2026-10-25T00:00:00Z" };
    expect(resolveNow({ env, realNow: real }).toISOString()).toBe("2026-10-25T00:00:00.000Z");
    expect(resolveNow({ env, override: "2026-10-28T00:00:00Z", realNow: real }).toISOString()).toBe(
      "2026-10-28T00:00:00.000Z",
    );
    expect(resolveNow({ env: { APP_ENV: "test" }, realNow: real })).toBe(real);
  });

  it("ignores every override in production", () => {
    const env = { VERCEL_ENV: "production", CLOCK_OVERRIDE: "2026-10-25T00:00:00Z" };
    expect(resolveNow({ env, override: "2026-10-28T00:00:00Z", realNow: real })).toBe(real);
    expect(clientTimeConfig(env).overrideAllowed).toBe(false);
    expect(clientTimeConfig(env).serverOverride).toBeNull();
  });

  it("reads the override from a request header or cookie", () => {
    expect(readCookie("a=1; clock-override=2026-10-28T00%3A00%3A00Z; b=2", "clock-override")).toBe(
      "2026-10-28T00%3A00%3A00Z",
    );
    const withCookie = new Request("http://x/", {
      headers: { cookie: "clock-override=2026-10-28T00:00:00Z" },
    });
    expect(requestClockOverride(withCookie)).toBe("2026-10-28T00:00:00Z");
    const withHeader = new Request("http://x/", {
      headers: { "x-clock-override": "2026-10-24T00:00:00Z", cookie: "clock-override=x" },
    });
    expect(requestClockOverride(withHeader)).toBe("2026-10-24T00:00:00Z");
  });
});
