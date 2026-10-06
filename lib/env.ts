/**
 * Deployment environment. Dev-only affordances (mock forcing, clock override)
 * are enabled everywhere except production.
 *
 * Resolution: VERCEL_ENV (set by Vercel: production | preview | development),
 * then APP_ENV (set by us, e.g. "test" for e2e), then NODE_ENV.
 */
export type DeploymentEnv = "production" | "preview" | "development" | "test";

export function deploymentEnv(
  env: Record<string, string | undefined> = process.env,
): DeploymentEnv {
  const v = env.VERCEL_ENV ?? env.APP_ENV;
  if (v === "production" || v === "preview" || v === "development" || v === "test") return v;
  return env.NODE_ENV === "production" ? "production" : "development";
}

export function devAffordancesEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return deploymentEnv(env) !== "production";
}
