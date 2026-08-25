"use client";

// Confirmation visuelle de la validation d'une leçon. La validation est
// désormais AUTOMATIQUE (voir LessonContext) : dès que tous les quiz de la
// leçon sont réussis, elle se marque complétée toute seule. Ce bloc n'a
// donc plus de bouton à cliquer — il se contente de refléter l'état actuel :
// en attente, ou célébration une fois la leçon complétée. La grande
// célébration ("justCompleted") ne s'affiche qu'une fois, au moment où elle
// vient d'être méritée ; en revisitant une leçon déjà validée, l'état reste
// simplement calme (pas de replay de l'animation à chaque visite).
//
// Thème sombre par défaut (historique) ou thème "light-elearning".

import { useLessonContext } from "@/components/lesson/LessonContext";
import type { LessonTheme } from "@/lib/content";

type ValidationBlockProps = {
  theme?: LessonTheme;
};

export default function ValidationBlock({ theme }: ValidationBlockProps) {
  const { allQuizzesPassed, completed, justCompleted } = useLessonContext();

  if (theme === "light-elearning") {
    return (
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        {completed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="relative flex h-14 w-14 items-center justify-center">
              {justCompleted && (
                <span
                  aria-hidden="true"
                  className="celebrate-ring absolute inset-0 rounded-full border-2 border-emerald-400"
                />
              )}
              <span
                className={
                  "relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-md" +
                  (justCompleted ? " celebrate-pop" : "")
                }
              >
                ✓
              </span>
            </span>
            <p className="text-base font-bold text-emerald-800">
              {justCompleted ? "Bravo, leçon validée !" : "Leçon complétée"}
            </p>
            {justCompleted && (
              <p className="text-sm text-emerald-600">Continue comme ça, tu progresses bien.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            {allQuizzesPassed
              ? "Validation en cours…"
              : "Réussis tous les quiz de la leçon pour la valider automatiquement."}
          </p>
        )}
      </div>
    );
  }

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
