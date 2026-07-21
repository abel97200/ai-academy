// Calcule le nombre de jours consécutifs d'apprentissage ("streak"), à
// partir des dates d'activité enregistrées dans la progression.
//
// Cette fonction n'est pas encore branchée à l'interface : elle sert de
// base prête à l'emploi pour une future fonctionnalité de série (un badge
// "3 jours d'affilée", par exemple), sans qu'on ait besoin de revenir sur
// le format de stockage de la progression le jour où elle sera activée.

import { toDateKey } from "@/lib/progress";

export function computeStreak(activityDates: string[], today: Date = new Date()): number {
  const dates = new Set(activityDates);
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  // Si rien n'a encore été fait aujourd'hui, la série n'est pas forcément
  // "cassée" : elle peut repartir d'hier (la journée n'est pas terminée).
  if (!dates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
