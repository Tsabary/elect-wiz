/**
 * Selects the matching implementation from configuration (MATCHING_IMPL).
 * Phase 1 has only the mock; Phase 2 registers the real backend here.
 */
import { mockImplementation } from "./mock";
import type { MatchingImplementation } from "./types";

const IMPLEMENTATIONS: Record<string, MatchingImplementation> = {
  mock: mockImplementation,
};

export function selectImplementation(
  env: Record<string, string | undefined> = process.env,
): MatchingImplementation | null {
  return IMPLEMENTATIONS[env.MATCHING_IMPL ?? "mock"] ?? null;
}
