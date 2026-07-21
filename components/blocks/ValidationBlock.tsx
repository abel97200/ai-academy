"use client";

// Bouton final de la leçon. Il n'est cliquable que si tous les quiz de
// la leçon ont été réussis (info fournie par le LessonContext). Au clic,
// on enregistre la leçon comme complétée (localStorage) et on affiche une
// célébration : un ✓ qui apparaît avec un léger "pop" et un anneau qui
// s'étend, plus un message d'encouragement. Cette grande célébration ne
// s'affiche qu'une fois, juste après le clic ("justCompleted") — si on
// revient plus tard sur une leçon déjà validée, l'état reste simplement
// calme (pas de replay de l'animation à chaque visite).

import { useLessonContext } from "@/components/lesson/LessonContext";

export default function ValidationBlock() {
  const { allQuizzesPassed, completed, justCompleted, completeLesson } =
    useLessonContext();

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
        <>
          <button
            type="button"
            onClick={completeLesson}
            disabled={!allQuizzesPassed}
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          >
            Terminer la leçon
          </button>
          {!allQuizzesPassed && (
            <p className="mt-3 text-xs text-foreground/40">
              Réussis tous les quiz de la leçon pour pouvoir la valider.
            </p>
          )}
        </>
      )}
    </div>
  );
}
