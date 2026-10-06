import { describe, expect, it } from "vitest";
import { deploymentEnv, devAffordancesEnabled } from "./env";

describe("deploymentEnv", () => {
  it("prefers VERCEL_ENV, then APP_ENV, then NODE_ENV", () => {
    expect(deploymentEnv({ VERCEL_ENV: "preview", APP_ENV: "test", NODE_ENV: "production" })).toBe(
      "preview",
    );
    expect(deploymentEnv({ APP_ENV: "test", NODE_ENV: "production" })).toBe("test");
    expect(deploymentEnv({ NODE_ENV: "production" })).toBe("production");
    expect(deploymentEnv({ NODE_ENV: "development" })).toBe("development");
  });

  it("disables dev affordances only in production", () => {
    expect(devAffordancesEnabled({ VERCEL_ENV: "production" })).toBe(false);
    expect(devAffordancesEnabled({ VERCEL_ENV: "preview" })).toBe(true);
    expect(devAffordancesEnabled({ NODE_ENV: "production" })).toBe(false);
  });
});
