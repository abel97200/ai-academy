"use client";

// Petit hook React qui lit la progression (localStorage) et la garde à
// jour côté client. Utilisé par les écrans parcours/module/leçon pour
// savoir quelles leçons sont déjà validées, sans dupliquer cette logique.
//
// Il se réabonne aux changements de progression (voir lib/progress.ts) :
// ainsi, si l'utilisateur valide une leçon pendant qu'un badge de
// progression est affiché à l'écran, ce badge se met à jour tout de
// suite, sans attendre un rafraîchissement de la page.

import { useEffect, useState } from "react";
import { getCompletedLessons, subscribeToProgressChanges } from "@/lib/progress";

export function useCompletedLessons(): Set<string> {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Lecture initiale, juste après le premier affichage dans le navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedLessonIds(getCompletedLessons());

    // Puis on reste à l'écoute des changements suivants.
    return subscribeToProgressChanges(() => {
      setCompletedLessonIds(getCompletedLessons());
    });
  }, []);

  return completedLessonIds;
}
