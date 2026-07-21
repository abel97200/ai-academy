"use client";

// Présente les blocs d'une leçon progressivement, une étape à la fois
// (Comprendre → Observer → Essayer → Corriger → Vérifier), plutôt que
// comme une longue page. Une barre d'étapes cliquable permet de naviguer
// librement, en plus des boutons Précédent/Suivant.

import { useState } from "react";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getBlockId } from "@/lib/contentTypes";
import type { Stage } from "@/lib/lessonStages";

type LessonStagesProps = {
  lessonId: string;
  stages: Stage[];
};

export default function LessonStages({ lessonId, stages }: LessonStagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStage = stages[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === stages.length - 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Barre d'étapes : chaque étape est cliquable, les étapes déjà vues
          apparaissent en vert pour donner un repère de progression. */}
      <div className="flex gap-1.5 sm:gap-2">
        {stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={
                "flex-1 truncate rounded-full px-1 py-2 text-center text-[11px] font-medium transition-all duration-150 sm:text-xs " +
                (isActive
                  ? "bg-accent text-white"
                  : isPast
                    ? "bg-success/15 text-success hover:bg-success/25"
                    : "bg-white/5 text-foreground/40 hover:bg-white/10")
              }
            >
              {stage.label}
            </button>
          );
        })}
      </div>

      {/* Blocs de l'étape en cours */}
      <div className="flex flex-col gap-4">
        {currentStage.blocks.map(({ block, index }) => (
          <BlockRenderer key={index} block={block} blockId={getBlockId(lessonId, index)} />
        ))}
      </div>

      {/* Navigation précédent/suivant */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        >
          ← Précédent
        </button>
        <span className="text-xs text-foreground/40">
          Étape {currentIndex + 1}/{stages.length}
        </span>
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(stages.length - 1, i + 1))}
          disabled={isLast}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
