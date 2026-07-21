// Tests du regroupement des blocs en étapes pédagogiques
// (Comprendre / Observer / Essayer / Corriger / Vérifier).

import { describe, expect, it } from "vitest";
import { groupBlocksByStage } from "@/lib/lessonStages";
import type { Block } from "@/lib/contentTypes";

describe("groupBlocksByStage", () => {
  it("regroupe chaque type de bloc dans la bonne étape, dans l'ordre", () => {
    const blocks: Block[] = [
      { type: "explication", content: "..." },
      { type: "schema", diagram: { kind: "trio", nodes: [], links: [] }, caption: "..." },
      { type: "exercice", question: "...", hints: [], solution: "..." },
      { type: "quiz", questions: [] },
      { type: "validation" },
    ];

    const stages = groupBlocksByStage(blocks);

    expect(stages.map((s) => s.key)).toEqual([
      "comprendre",
      "observer",
      "essayer",
      "corriger",
      "verifier",
    ]);
  });

  it("omet les étapes qui n'ont aucun bloc", () => {
    const blocks: Block[] = [
      { type: "explication", content: "..." },
      { type: "validation" },
    ];

    const stages = groupBlocksByStage(blocks);

    expect(stages.map((s) => s.key)).toEqual(["comprendre", "verifier"]);
  });

  it("conserve l'index d'origine de chaque bloc (pas sa position dans l'étape)", () => {
    const blocks: Block[] = [
      { type: "explication", content: "A" }, // index 0 -> comprendre
      { type: "demo", content: "B" }, // index 1 -> observer
      { type: "explication", content: "C" }, // index 2 -> comprendre aussi
    ];

    const stages = groupBlocksByStage(blocks);
    const comprendre = stages.find((s) => s.key === "comprendre")!;

    expect(comprendre.blocks.map((b) => b.index)).toEqual([0, 2]);
  });

  it("place les blocs 'action', 'code' et 'project' dans l'étape Essayer", () => {
    const blocks: Block[] = [
      { type: "code", filename: "a.js", language: "js", code: "1", explanation: "..." },
      {
        type: "action",
        id: "a1",
        title: "...",
        instructions: "...",
        successCriteria: "...",
        evidence: "...",
      },
      {
        type: "project",
        id: "p1",
        title: "...",
        brief: "...",
        deliverables: [],
        successCriteria: [],
      },
    ];

    const stages = groupBlocksByStage(blocks);

    expect(stages).toHaveLength(1);
    expect(stages[0].key).toBe("essayer");
    expect(stages[0].blocks).toHaveLength(3);
  });

  it("place le bloc 'assessment' dans l'étape Vérifier, avec 'validation'", () => {
    const blocks: Block[] = [
      { type: "assessment", title: "...", requirements: [] },
      { type: "validation" },
    ];

    const stages = groupBlocksByStage(blocks);

    expect(stages).toHaveLength(1);
    expect(stages[0].key).toBe("verifier");
    expect(stages[0].blocks).toHaveLength(2);
  });
});
