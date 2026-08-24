"use client";

// Présente les blocs d'une leçon UN PAR UN, strictement dans l'ordre du
// JSON — contrairement à LessonStages, qui les regroupe par étape
// pédagogique (donc par TYPE de bloc, pas par ordre d'écriture). Utilisé
// quand la pédagogie exige un déroulé narratif précis (ex: observer une
// répétition avant de nommer le mécanisme), ce que le regroupement par
// type ne peut pas garantir : un bloc "explication" finirait toujours dans
// l'onglet "Comprendre", même écrit après des blocs "Essayer".
//
// Chaque bloc garde une étiquette d'étape pédagogique (Comprendre /
// Observer / Essayer / Corriger / Vérifier), déduite de son type via
// getStageForBlockType, pour rester lisible au regard du même modèle
// pédagogique que le mode "stages" — sans que ça réordonne quoi que ce
// soit. La navigation vers l'avant est libre (Précédent/Suivant) ; les
// points de progression ne permettent de revenir qu'aux étapes déjà vues,
// pour ne rien dévoiler à l'avance.

import { useState } from "react";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getBlockId } from "@/lib/contentTypes";
import { getStageForBlockType } from "@/lib/lessonStages";
import type { Block } from "@/lib/contentTypes";

type LessonSequenceProps = {
  lessonId: string;
  blocks: Block[];
};

export default function LessonSequence({ lessonId, blocks }: LessonSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestReached, setFurthestReached] = useState(0);

  const currentBlock = blocks[currentIndex];
  const currentStage = getStageForBlockType(currentBlock.type);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === blocks.length - 1;

  function goTo(index: number) {
    setCurrentIndex(index);
    setFurthestReached((furthest) => Math.max(furthest, index));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Points de progression : un par bloc, cliquables seulement s'ils
          ont déjà été vus (pas de spoil sur la suite de la leçon). */}
      <div className="flex flex-wrap gap-1.5">
        {blocks.map((block, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          const isReachable = index <= furthestReached;
          return (
            <button
              key={index}
              type="button"
              disabled={!isReachable}
              onClick={() => goTo(index)}
              aria-label={`Étape ${index + 1} sur ${blocks.length}`}
              aria-current={isActive}
              className={
                "h-2 flex-1 rounded-full transition-colors duration-150 " +
                (isActive
                  ? "bg-accent"
                  : isPast
                    ? "bg-success/50 hover:bg-success/70"
                    : "bg-white/10") +
                (isReachable ? " cursor-pointer" : " cursor-not-allowed")
              }
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          {currentStage.label}
        </span>
        <span className="text-xs text-foreground/40">
          Étape {currentIndex + 1}/{blocks.length}
        </span>
      </div>

      {/* Bloc en cours */}
      <BlockRenderer block={currentBlock} blockId={getBlockId(lessonId, currentIndex)} />

      {/* Navigation précédent/suivant */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={isFirst}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        >
          ← Précédent
        </button>
        <button
          type="button"
          onClick={() => goTo(Math.min(blocks.length - 1, currentIndex + 1))}
          disabled={isLast}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
