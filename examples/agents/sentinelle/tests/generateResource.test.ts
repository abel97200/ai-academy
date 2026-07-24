import { describe, expect, it } from "vitest";
import {
  ModelOutputError,
  parseResourceProposal,
} from "../src/domain/resource";

const validProposal = {
  title: "Introduction aux agents IA",
  summary:
    "Une ressource structurée qui présente objectifs, états, actions et limites.",
  relevanceScore: 82,
  sourceType: "documentation",
  needsHumanReview: true,
};

describe("ResourceProposal", () => {
  it("accepte une sortie valide", () => {
    expect(parseResourceProposal(validProposal)).toEqual(validProposal);
  });

  it("refuse une sortie sans champ obligatoire", () => {
    const withoutTitle: Record<string, unknown> = { ...validProposal };
    delete withoutTitle.title;
    expect(() => parseResourceProposal(withoutTitle)).toThrow(ModelOutputError);
  });

  it("refuse un score hors plage", () => {
    expect(() =>
      parseResourceProposal({...validProposal, relevanceScore: 120})
    ).toThrow(ModelOutputError);
  });

  it("refuse un type incorrect", () => {
    expect(() =>
      parseResourceProposal({...validProposal, needsHumanReview: "oui"})
    ).toThrow(ModelOutputError);
  });

  it("refuse un JSON invalide avec une erreur nommée", () => {
    try {
      parseResourceProposal('{"title":');
      throw new Error("Le test devait échouer.");
    } catch (error) {
      expect(error).toBeInstanceOf(ModelOutputError);
      expect((error as ModelOutputError).code).toBe("INVALID_JSON");
    }
  });
});
