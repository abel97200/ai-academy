import { createMockResourceModel } from "./model/mockResourceModel";
import { createOpenAIResourceModel } from "./model/openAIResourceModel";
import type { ResourceModel } from "./model/modelClient";
import { runSentinelle } from "./runner/runSentinelle";
import { createInitialState } from "./runner/state";

function selectModel(liveMode: boolean): ResourceModel {
  if (!liveMode) {
    return createMockResourceModel();
  }

  console.warn(
    "Mode réel : cet appel peut coûter de l’argent. La clé ne sera jamais affichée."
  );
  return createOpenAIResourceModel({
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-5.6",
  });
}

async function main() {
  const args = process.argv.slice(2);
  const liveMode = args.includes("--live");
  const topic =
    args.find((argument) => !argument.startsWith("--")) ?? "agents IA";
  const finalState = await runSentinelle(
    createInitialState(topic, 3),
    selectModel(liveMode),
    { requireHumanReview: true }
  );

  console.log(JSON.stringify(finalState, null, 2));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erreur inconnue.";
  console.error(`Sentinelle s’est arrêtée : ${message}`);
  process.exitCode = 1;
});
