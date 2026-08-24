import { ModelOutputError } from "../domain/resource";
import { generateResource } from "../model/generateResource";
import type { ResourceModel } from "../model/modelClient";
import {
  assertConsistentState,
  SentinelleLoopError,
  type SentinelleState,
  type SentinelleTraceEntry,
} from "./state";

export type RunSentinelleOptions = {
  minimumScore?: number;
  requireHumanReview?: boolean;
};

function withTrace(
  state: SentinelleState,
  entry: SentinelleTraceEntry
): SentinelleState {
  return {
    ...state,
    iteration: entry.iteration,
    status: entry.statusAfter,
    trace: [...state.trace, entry],
  };
}

export async function runSentinelle(
  initialState: SentinelleState,
  model: ResourceModel,
  options: RunSentinelleOptions = {}
): Promise<SentinelleState> {
  const minimumScore = options.minimumScore ?? 70;
  const requireHumanReview = options.requireHumanReview ?? true;
  let state: SentinelleState = structuredClone(initialState);

  while (state.status === "running") {
    assertConsistentState(state);

    if (state.iteration >= state.maxIterations) {
      return {
        ...state,
        status: "needs_human_review",
        stopReason: "max_iterations",
      };
    }

    const iteration = state.iteration + 1;

    try {
      const proposal = await generateResource(state.topic, model);

      if (proposal.relevanceScore < minimumScore) {
        state = withTrace(state, {
          iteration,
          statusBefore: "running",
          outcome: "rejected",
          statusAfter:
            iteration >= state.maxIterations ? "needs_human_review" : "running",
          message: `Score ${proposal.relevanceScore} inférieur au seuil ${minimumScore}.`,
        });
        if (state.status === "needs_human_review") {
          state = {...state, stopReason: "max_iterations"};
        }
        continue;
      }

      if (requireHumanReview || proposal.needsHumanReview) {
        return {
          ...withTrace(state, {
            iteration,
            statusBefore: "running",
            outcome: "human_review",
            statusAfter: "needs_human_review",
            message: "Proposition valide transmise à la validation humaine.",
          }),
          proposal,
          stopReason: "human_review_required",
        };
      }

      return {
        ...withTrace(state, {
          iteration,
          statusBefore: "running",
          outcome: "accepted",
          statusAfter: "completed",
          message: "Proposition conforme et seuil atteint.",
        }),
        proposal,
        stopReason: "success",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue pendant l’étape.";
      const controlled = error instanceof ModelOutputError;
      state = withTrace(state, {
        iteration,
        statusBefore: "running",
        outcome: "error",
        statusAfter:
          controlled && iteration < state.maxIterations
            ? "running"
            : "needs_human_review",
        message,
      });

      if (state.status === "needs_human_review") {
        return {
          ...state,
          stopReason: "controlled_error",
          lastError: message,
        };
      }

      if (!controlled) {
        throw new SentinelleLoopError("STEP_FAILED", message);
      }
    }
  }

  return state;
}
