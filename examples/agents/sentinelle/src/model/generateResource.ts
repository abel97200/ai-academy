import { z } from "zod";
import {
  parseResourceProposal,
  type ResourceProposal,
} from "../domain/resource";
import type { ResourceModel } from "./modelClient";

const TopicSchema = z.string().trim().min(3, "Le sujet doit contenir au moins 3 caractères.");

export const SENTINELLE_SYSTEM_INSTRUCTION = [
  "Tu aides à préparer une veille pédagogique.",
  "Propose une seule ressource potentielle à vérifier.",
  "N’invente pas d’action externe et ne publie rien.",
  "Le score va de 0 à 100 et une revue humaine reste obligatoire.",
].join(" ");

export async function generateResource(
  topic: string,
  model: ResourceModel
): Promise<ResourceProposal> {
  const validTopic = TopicSchema.parse(topic);
  const rawOutput = await model.generate({
    systemInstruction: SENTINELLE_SYSTEM_INSTRUCTION,
    userInput: `Sujet de veille : ${validTopic}`,
  });

  return parseResourceProposal(rawOutput);
}
