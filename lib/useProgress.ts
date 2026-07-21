"use client";

// Petit hook React qui lit la progression (localStorage) et la garde à
// jour côté client. Utilisé par les écrans tableau de bord/parcours/module
// pour savoir où en est l'utilisateur, sans dupliquer cette logique.
//
// Il se réabonne aux changements de progression (voir lib/progress.ts) :
// ainsi, si l'utilisateur valide une leçon ou un quiz pendant qu'un badge
// de progression est affiché à l'écran, ce badge se met à jour tout de
// suite, sans attendre un rafraîchissement de la page.

import { useEffect, useState } from "react";
import {
  getActionsDone,
  getAssessmentsDone,
  getCompletedLessons,
  getQuizScores,
  subscribeToProgressChanges,
} from "@/lib/progress";
import { EMPTY_PROGRESS_SNAPSHOT, type ProgressSnapshot } from "@/lib/courseProgress";

function readSnapshot(): ProgressSnapshot {
  return {
    completedLessonIds: getCompletedLessons(),
    quizScores: getQuizScores(),
    actionsDone: getActionsDone(),
    assessmentsDone: getAssessmentsDone(),
  };
}

// Hook complet : renvoie tout ce que la progression retient (leçons, scores
// de quiz, actions et évaluations confirmées).
export function useProgressSnapshot(): ProgressSnapshot {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>(EMPTY_PROGRESS_SNAPSHOT);

  useEffect(() => {
    // Lecture initiale, juste après le premier affichage dans le navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot(readSnapshot());

    // Puis on reste à l'écoute des changements suivants.
    return subscribeToProgressChanges(() => {
      setSnapshot(readSnapshot());
    });
  }, []);

  return snapshot;
}

// Raccourci pour les composants qui n'ont besoin que des leçons complétées.
export function useCompletedLessons(): Set<string> {
  return useProgressSnapshot().completedLessonIds;
}
