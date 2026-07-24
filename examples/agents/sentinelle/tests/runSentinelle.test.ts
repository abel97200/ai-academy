import { describe, expect, it } from "vitest";
import { createMockResourceModel } from "../src/model/mockResourceModel";
import { runSentinelle } from "../src/runner/runSentinelle";
import {
  createInitialState,
  SentinelleLoopError,
} from "../src/runner/state";

const validProposal = {
  title: "Comprendre une boucle agentique",
  summary:
    "Une ressource claire sur les états, transitions, limites et traces d’exécution.",
  relevanceScore: 88,
  sourceType: "course",
  needsHumanReview: false,
};

const lowScoreProposal = {
  ...validProposal,
  relevanceScore: 30,
};

describe("runSentinelle", () => {
  it("s’arrête sur la condition de réussite", async () => {
    const result = await runSentinelle(
      createInitialState("boucles agentiques"),
      createMockResourceModel([validProposal]),
      { requireHumanReview: false }
    );

    expect(result.status).toBe("completed");
    expect(result.stopReason).toBe("success");
    expect(result.iteration).toBe(1);
  });

  it("s’arrête sur la limite d’itérations sans sixième appel", async () => {
    const result = await runSentinelle(
      createInitialState("sujet difficile", 3),
      createMockResourceModel([lowScoreProposal]),
      { requireHumanReview: false }
    );

    expect(result.status).toBe("needs_human_review");
    expect(result.stopReason).toBe("max_iterations");
    expect(result.iteration).toBe(3);
  });

  it("journalise exactement chaque étape exécutée", async () => {
    const result = await runSentinelle(
      createInitialState("traces agentiques", 3),
      createMockResourceModel([lowScoreProposal, validProposal]),
      { requireHumanReview: false }
    );

    expect(result.trace).toHaveLength(2);
    expect(result.trace.map((entry) => entry.iteration)).toEqual([1, 2]);
    expect(result.trace.map((entry) => entry.outcome)).toEqual([
      "rejected",
      "accepted",
    ]);
  });

  it("remonte une erreur d’état contrôlée", async () => {
    const inconsistentState = {
      ...createInitialState("état incohérent", 3),
      iteration: 2,
      trace: [],
    };

    await expect(
      runSentinelle(inconsistentState, createMockResourceModel())
    ).rejects.toMatchObject<Partial<SentinelleLoopError>>({
      code: "INCONSISTENT_STATE",
    });
  });

  it("passe en validation humaine lorsqu’il ne peut pas conclure", async () => {
    const result = await runSentinelle(
      createInitialState("validation humaine"),
      createMockResourceModel([validProposal]),
      { requireHumanReview: true }
    );

    expect(result.status).toBe("needs_human_review");
    expect(result.stopReason).toBe("human_review_required");
    expect(result.proposal).toEqual(validProposal);
  });
});
