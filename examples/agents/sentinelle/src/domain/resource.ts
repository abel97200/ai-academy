import { z } from "zod";

export const sourceTypes = [
  "article",
  "course",
  "documentation",
  "video",
  "other",
] as const;

export const ResourceProposalSchema = z
  .object({
    title: z.string().trim().min(3),
    summary: z.string().trim().min(20),
    relevanceScore: z.number().min(0).max(100),
    sourceType: z.enum(sourceTypes),
    needsHumanReview: z.boolean(),
  })
  .strict();

export type ResourceProposal = z.infer<typeof ResourceProposalSchema>;

export type ModelOutputErrorCode =
  | "INVALID_JSON"
  | "INVALID_STRUCTURE"
  | "MODEL_REFUSAL";

export class ModelOutputError extends Error {
  constructor(
    public readonly code: ModelOutputErrorCode,
    message: string,
    public readonly details: string[] = []
  ) {
    super(message);
    this.name = "ModelOutputError";
  }
}

export function parseResourceProposal(rawOutput: unknown): ResourceProposal {
  let candidate = rawOutput;

  if (typeof rawOutput === "string") {
    try {
      candidate = JSON.parse(rawOutput);
    } catch {
      throw new ModelOutputError(
        "INVALID_JSON",
        "La réponse du modèle n’est pas un JSON valide."
      );
    }
  }

  const result = ResourceProposalSchema.safeParse(candidate);
  if (!result.success) {
    throw new ModelOutputError(
      "INVALID_STRUCTURE",
      "La réponse ne respecte pas le contrat ResourceProposal.",
      result.error.issues.map(
        (issue) => `${issue.path.join(".") || "root"}: ${issue.message}`
      )
    );
  }

  return result.data;
}
