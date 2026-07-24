import type { ResourceModel } from "./modelClient";

export function createMockResourceModel(
  outputs: unknown[] = [
    {
      title: "Comprendre les agents IA",
      summary:
        "Une introduction progressive aux objectifs, états, actions et limites d’un agent IA.",
      relevanceScore: 84,
      sourceType: "documentation",
      needsHumanReview: true,
    },
  ]
): ResourceModel {
  let index = 0;

  return {
    async generate() {
      const output = outputs[Math.min(index, outputs.length - 1)];
      index += 1;
      return output;
    },
  };
}
