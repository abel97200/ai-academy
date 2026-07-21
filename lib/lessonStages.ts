// Regroupe les blocs d'une leçon en 5 étapes pédagogiques, pour que le
// lecteur de leçon les présente progressivement (une étape à la fois avec
// une navigation précédent/suivant) plutôt que comme une longue page.
//
// Le regroupement est déduit automatiquement du "type" de chaque bloc :
// pas besoin de le déclarer dans le JSON.

import type { Block } from "@/lib/content";

export type StageKey = "comprendre" | "observer" | "essayer" | "corriger" | "verifier";

// On garde l'index d'origine du bloc (sa position dans la leçon complète),
// car c'est lui qui sert à construire son identifiant unique (getBlockId) —
// pas sa position au sein de l'étape.
export type StageBlock = {
  block: Block;
  index: number;
};

export type Stage = {
  key: StageKey;
  label: string;
  blocks: StageBlock[];
};

const STAGE_ORDER: { key: StageKey; label: string }[] = [
  { key: "comprendre", label: "Comprendre" },
  { key: "observer", label: "Observer" },
  { key: "essayer", label: "Essayer" },
  { key: "corriger", label: "Corriger" },
  { key: "verifier", label: "Vérifier" },
];

// À quelle étape appartient chaque type de bloc. Pour ajouter un futur
// type de bloc, il suffit de lui associer une étape ici.
const STAGE_BY_BLOCK_TYPE: Record<Block["type"], StageKey> = {
  explication: "comprendre",
  schema: "observer",
  demo: "observer",
  exercice: "essayer",
  action: "essayer",
  code: "essayer",
  project: "essayer",
  quiz: "corriger",
  assessment: "verifier",
  validation: "verifier",
};

// Regroupe les blocs d'une leçon par étape, dans l'ordre Comprendre →
// Vérifier. Seules les étapes qui contiennent au moins un bloc sont
// renvoyées (une leçon n'a pas forcément besoin des 5).
export function groupBlocksByStage(blocks: Block[]): Stage[] {
  const blocksByStage = new Map<StageKey, StageBlock[]>();

  blocks.forEach((block, index) => {
    const stageKey = STAGE_BY_BLOCK_TYPE[block.type];
    const existing = blocksByStage.get(stageKey) ?? [];
    existing.push({ block, index });
    blocksByStage.set(stageKey, existing);
  });

  return STAGE_ORDER.filter((stage) => blocksByStage.has(stage.key)).map(
    (stage) => ({
      key: stage.key,
      label: stage.label,
      blocks: blocksByStage.get(stage.key)!,
    })
  );
}
