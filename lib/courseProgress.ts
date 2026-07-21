// Calcule l'avancement dans une formation. Fonction pure (pas d'accès au
// localStorage ni au système de fichiers ici) : elle peut donc être
// utilisée aussi bien dans un composant serveur que dans un composant
// client, qui lui fournit la liste des leçons complétées.

import type { Course, CourseProgress, ModuleProgress, ModuleStatus } from "@/lib/courseTypes";

// À partir de la structure du cours et de l'ensemble des leçons complétées
// (lu dans le localStorage), calcule l'état de chaque module ainsi que le
// pourcentage global d'avancement. Un module sans aucune leçon est
// "verrouillé" (à venir) ; sinon "terminé" si toutes ses leçons sont
// validées, "en cours" sinon.
export function computeCourseProgress(
  course: Course,
  completedLessonIds: Set<string>
): CourseProgress {
  let totalLessons = 0;
  let completedLessons = 0;
  const moduleProgress: Record<string, ModuleProgress> = {};

  for (const courseModule of course.modules) {
    const totalCount = courseModule.lessons.length;
    const completedCount = courseModule.lessons.filter((id) =>
      completedLessonIds.has(id)
    ).length;

    totalLessons += totalCount;
    completedLessons += completedCount;

    let status: ModuleStatus;
    if (totalCount === 0) {
      status = "locked";
    } else if (completedCount === totalCount) {
      status = "completed";
    } else {
      status = "current";
    }

    moduleProgress[courseModule.slug] = { status, completedCount, totalCount };
  }

  const percentage =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return { totalLessons, completedLessons, percentage, moduleProgress };
}
