import type { Issue, List, Party } from "@/lib/content/schemas";
import type { MatchErrorCode, MatchOutputCore, MatchRequest } from "./contract";

/** The parts of the active corpus a matching implementation may read. */
export interface CorpusView {
  issues: Issue[];
  parties: Party[];
  lists: List[];
}

export interface MatchOptions {
  /** Mock only: forced scenario (development/preview/test). */
  scenario?: import("./mock").MockScenario;
  /** Mock only: artificial latency. */
  delayMs?: number;
}

export interface MatchingImplementation {
  name: string;
  match(req: MatchRequest, corpus: CorpusView, opts: MatchOptions): Promise<MatchOutputCore>;
}

/** Thrown by implementations to return a typed error code. */
export class MatchError extends Error {
  constructor(public readonly code: MatchErrorCode) {
    super(code);
    this.name = "MatchError";
  }
}
