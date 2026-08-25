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

import type { Block, LessonTheme } from "@/lib/contentTypes";
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
import TriBlock from "@/components/blocks/TriBlock";
import ResumeBlock from "@/components/blocks/ResumeBlock";
import WorkflowBlock from "@/components/blocks/WorkflowBlock";
import OrdreBlock from "@/components/blocks/OrdreBlock";

type BlockRendererProps = {
  block: Block;
  // Identifiant unique du bloc dans la leçon (utile pour les quiz et
  // évaluations, qui doivent savoir "qui" a été réussi/confirmé).
  blockId: string;
  // Thème visuel de la leçon (voir Lesson["theme"]). Absent = rendu par
  // défaut (thème sombre historique) pour tous les blocs.
  theme?: LessonTheme;
};

export default function BlockRenderer({ block, blockId, theme }: BlockRendererProps) {
  switch (block.type) {
    case "explication":
      return <ExplicationBlock content={block.content} visual={block.visual} theme={theme} />;

    case "schema":
      return <SchemaBlock diagram={block.diagram} caption={block.caption} theme={theme} />;

    case "demo":
      return <DemoBlock content={block.content} />;

    case "exercice":
      return (
        <ExerciceBlock
          question={block.question}
          hints={block.hints}
          solution={block.solution}
          theme={theme}
        />
      );

    case "quiz":
      return <QuizBlock id={blockId} questions={block.questions} theme={theme} />;

    case "validation":
      return <ValidationBlock theme={theme} />;

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
          theme={theme}
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
        <AssessmentBlock
          id={blockId}
          title={block.title}
          requirements={block.requirements}
          theme={theme}
        />
      );

    case "situation":
      return (
        <SituationBlock
          context={block.context}
          question={block.question}
          options={block.options}
          illustration={block.illustration}
          kicker={block.kicker}
          theme={theme}
        />
      );

    case "tri":
      return (
        <TriBlock
          instruction={block.instruction}
          categories={block.categories}
          items={block.items}
          illustration={block.illustration}
          theme={theme}
        />
      );

    case "resume":
      return <ResumeBlock content={block.content} theme={theme} />;

    case "workflow":
      return (
        <WorkflowBlock
          prompt={block.prompt}
          payloadLabel={block.payloadLabel}
          actionLabel={block.actionLabel}
          steps={block.steps}
          completionLabel={block.completionLabel}
          theme={theme}
        />
      );

    case "ordre":
      return (
        <OrdreBlock
          instruction={block.instruction}
          items={block.items}
          correctOrder={block.correctOrder}
          theme={theme}
        />
      );

    default:
      // Si un type de bloc inconnu apparaît un jour dans le JSON,
      // on évite de faire planter la page.
      return null;
  }
}
