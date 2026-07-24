import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  ModelOutputError,
  ResourceProposalSchema,
} from "../domain/resource";
import type { ResourceModel } from "./modelClient";

type OpenAIResourceModelOptions = {
  apiKey: string;
  model: string;
};

export function createOpenAIResourceModel({
  apiKey,
  model,
}: OpenAIResourceModelOptions): ResourceModel {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY manque. Utilise le mode simulé ou configure la variable localement."
    );
  }

  const client = new OpenAI({ apiKey });

  return {
    async generate(request) {
      const response = await client.responses.parse({
        model,
        input: [
          { role: "system", content: request.systemInstruction },
          { role: "user", content: request.userInput },
        ],
        text: {
          format: zodTextFormat(
            ResourceProposalSchema,
            "sentinelle_resource_proposal"
          ),
        },
      });

      if (!response.output_parsed) {
        throw new ModelOutputError(
          "MODEL_REFUSAL",
          "Le modèle n’a pas fourni de proposition structurée."
        );
      }

      return response.output_parsed;
    },
  };
}
