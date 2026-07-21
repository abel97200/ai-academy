"use client";

// Confirmation visuelle de la validation d'une leçon. La validation est
// désormais AUTOMATIQUE (voir LessonContext) : dès que tous les quiz de la
// leçon sont réussis, elle se marque complétée toute seule. Ce bloc n'a
// donc plus de bouton à cliquer — il se contente de refléter l'état actuel :
// en attente, ou célébration une fois la leçon complétée. La grande
// célébration ("justCompleted") ne s'affiche qu'une fois, au moment où elle
// vient d'être méritée ; en revisitant une leçon déjà validée, l'état reste
// simplement calme (pas de replay de l'animation à chaque visite).

import { useLessonContext } from "@/components/lesson/LessonContext";

export default function ValidationBlock() {
  const { allQuizzesPassed, completed, justCompleted } = useLessonContext();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
      {completed ? (
        <div className="flex flex-col items-center gap-2">
          <span className="relative flex h-12 w-12 items-center justify-center">
            {justCompleted && (
              <span
                aria-hidden="true"
                className="celebrate-ring absolute inset-0 rounded-full border-2 border-success"
              />
            )}
            <span
              className={
                "relative flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-2xl text-success" +
                (justCompleted ? " celebrate-pop" : "")
              }
            >
              ✓
            </span>
          </span>
          <p className="text-sm font-medium text-success">
            {justCompleted ? "Bravo, leçon validée !" : "Leçon complétée"}
          </p>
          {justCompleted && (
            <p className="text-xs text-foreground/50">
              Continue comme ça, tu progresses bien.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-foreground/50">
          {allQuizzesPassed
            ? "Validation en cours…"
            : "Réussis tous les quiz de la leçon pour la valider automatiquement."}
        </p>
      )}
    </div>
  );
}
