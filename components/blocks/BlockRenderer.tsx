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

import type { Block } from "@/lib/contentTypes";
import ExplicationBlock from "@/components/blocks/ExplicationBlock";
import SchemaBlock from "@/components/blocks/SchemaBlock";
import DemoBlock from "@/components/blocks/DemoBlock";
import ExerciceBlock from "@/components/blocks/ExerciceBlock";
import QuizBlock from "@/components/blocks/QuizBlock";
import ValidationBlock from "@/components/blocks/ValidationBlock";
import CodeBlock from "@/components/blocks/CodeBlock";
import ActionBlock from "@/components/blocks/ActionBlock";
import ProjectBlock from "@/components/blocks/ProjectBlock";
import AssessmentBlock from "@/components/blocks/AssessmentBlock";
import SituationBlock from "@/components/blocks/SituationBlock";
import Lesson11IntroPrototype from "@/components/blocks/prototype/Lesson11IntroPrototype";
import TriBlock from "@/components/blocks/TriBlock";
import ResumeBlock from "@/components/blocks/ResumeBlock";
import WorkflowBlock from "@/components/blocks/WorkflowBlock";
import OrdreBlock from "@/components/blocks/OrdreBlock";

type BlockRendererProps = {
  block: Block;
  // Identifiant unique du bloc dans la leçon (utile pour les quiz et
  // évaluations, qui doivent savoir "qui" a été réussi/confirmé).
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

    case "code":
      return (
        <CodeBlock
          filename={block.filename}
          language={block.language}
          code={block.code}
          explanation={block.explanation}
          focusLines={block.focusLines}
        />
      );

    case "action":
      return (
        <ActionBlock
          id={block.id}
          title={block.title}
          instructions={block.instructions}
          successCriteria={block.successCriteria}
          evidence={block.evidence}
        />
      );

    case "project":
      return (
        <ProjectBlock
          title={block.title}
          brief={block.brief}
          deliverables={block.deliverables}
          successCriteria={block.successCriteria}
          hints={block.hints}
        />
      );

    case "assessment":
      // Les blocs "assessment" n'ont pas d'identifiant propre dans le JSON
      // (voir docs/CONTENT-SCHEMA-V2.md) : on utilise l'identifiant généré
      // automatiquement pour ce bloc, comme pour les quiz.
      return (
        <AssessmentBlock id={blockId} title={block.title} requirements={block.requirements} />
      );

    case "situation":
      // PROTOTYPE VISUEL — voir components/blocks/prototype/Lesson11IntroPrototype.tsx.
      // Cas spécial temporaire, câblé sur le tout premier bloc de la leçon
      // 1.1 uniquement, pour tester une nouvelle direction visuelle sans
      // toucher au composant générique ni aux autres leçons.
      if (blockId === "automatisation-lesson-1-1-block-0") {
        return (
          <Lesson11IntroPrototype
            context={block.context}
            question={block.question}
            options={block.options}
          />
        );
      }
      return (
        <SituationBlock context={block.context} question={block.question} options={block.options} />
      );

    case "tri":
      return (
        <TriBlock instruction={block.instruction} categories={block.categories} items={block.items} />
      );

    case "resume":
      return <ResumeBlock content={block.content} />;

    case "workflow":
      return (
        <WorkflowBlock
          prompt={block.prompt}
          payloadLabel={block.payloadLabel}
          actionLabel={block.actionLabel}
          steps={block.steps}
          completionLabel={block.completionLabel}
        />
      );

    case "ordre":
      return (
        <OrdreBlock
          instruction={block.instruction}
          items={block.items}
          correctOrder={block.correctOrder}
        />
      );

    default:
      // Si un type de bloc inconnu apparaît un jour dans le JSON,
      // on évite de faire planter la page.
      return null;
  }
}
