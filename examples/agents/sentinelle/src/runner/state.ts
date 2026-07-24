import type { ResourceProposal } from "../domain/resource";

export type SentinelleStatus =
  | "running"
  | "completed"
  | "needs_human_review"
  | "failed";

export type StopReason =
  | "success"
  | "max_iterations"
  | "human_review_required"
  | "controlled_error";

export type SentinelleTraceEntry = {
  iteration: number;
  statusBefore: SentinelleStatus;
  outcome: "accepted" | "rejected" | "error" | "human_review";
  statusAfter: SentinelleStatus;
  message: string;
};

export type SentinelleState = {
  topic: string;
  iteration: number;
  maxIterations: number;
  status: SentinelleStatus;
  stopReason?: StopReason;
  proposal?: ResourceProposal;
  lastError?: string;
  trace: SentinelleTraceEntry[];
};

export class SentinelleLoopError extends Error {
  constructor(
    public readonly code: "INCONSISTENT_STATE" | "STEP_FAILED",
    message: string
  ) {
    super(message);
    this.name = "SentinelleLoopError";
  }
}

export function createInitialState(
  topic: string,
  maxIterations = 3
): SentinelleState {
  if (!Number.isInteger(maxIterations) || maxIterations < 1 || maxIterations > 5) {
    throw new SentinelleLoopError(
      "INCONSISTENT_STATE",
      "maxIterations doit être un entier compris entre 1 et 5."
    );
  }

  return {
    topic,
    iteration: 0,
    maxIterations,
    status: "running",
    trace: [],
  };
}

export function assertConsistentState(state: SentinelleState): void {
  const invalidIteration =
    !Number.isInteger(state.iteration) ||
    state.iteration < 0 ||
    state.iteration > state.maxIterations;
  const invalidTrace = state.trace.length !== state.iteration;

  if (invalidIteration || invalidTrace) {
    throw new SentinelleLoopError(
      "INCONSISTENT_STATE",
      "L’itération et la trace doivent progresser ensemble sans dépasser la limite."
    );
  }
}
