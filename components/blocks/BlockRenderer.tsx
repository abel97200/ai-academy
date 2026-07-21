// Ce composant est le "chef d'orchestre" de l'affichage des blocs.
// Il reçoit un bloc (venant du JSON d'une leçon) et choisit le bon
// composant à utiliser en fonction de son "type".
//
// Comme chaque type de bloc a des champs différents (une "explication" a
// un "content", un "schema" a un "diagram" et une "caption"...), on utilise
// un switch : TypeScript vérifie alors qu'on gère bien tous les cas, et
// on ne peut pas se tromper de champ pour un type donné.
//
// Pour ajouter un nouveau type de bloc plus tard :
// 1. l'ajouter dans l'union "Block" (lib/content.ts),
// 2. créer son composant (ex: components/blocks/SchemaBlock.tsx),
// 3. ajouter un "case" ici.

import { Block } from "@/lib/content";
import ExplicationBlock from "@/components/blocks/ExplicationBlock";
import SchemaBlock from "@/components/blocks/SchemaBlock";
import DemoBlock from "@/components/blocks/DemoBlock";
import ExerciceBlock from "@/components/blocks/ExerciceBlock";
import QuizBlock from "@/components/blocks/QuizBlock";
import ValidationBlock from "@/components/blocks/ValidationBlock";

type BlockRendererProps = {
  block: Block;
  // Identifiant unique du bloc dans la leçon (utile pour les quiz,
  // qui doivent savoir "qui" a été réussi).
  blockId: string;
};

export default function BlockRenderer({ block, blockId }: BlockRendererProps) {
  switch (block.type) {
    case "explication":
      return <ExplicationBlock content={block.content} />;

    case "schema":
      return <SchemaBlock diagram={block.diagram} caption={block.caption} />;

    case "demo":
      return <DemoBlock content={block.content} />;

    case "exercice":
      return (
        <ExerciceBlock
          question={block.question}
          hints={block.hints}
          solution={block.solution}
        />
      );

    case "quiz":
      return <QuizBlock id={blockId} questions={block.questions} />;

    case "validation":
      return <ValidationBlock />;

    default:
      // Si un type de bloc inconnu apparaît un jour dans le JSON,
      // on évite de faire planter la page.
      return null;
  }
}
