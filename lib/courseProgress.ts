// Calcule l'avancement dans une formation. Fonctions pures (pas d'accès au
// localStorage ni au système de fichiers ici) : elles peuvent donc être
// utilisées aussi bien côté serveur que côté client, qui lui fournit la
// progression (leçons/quiz/actions/évaluations) lue depuis le localStorage.

import type {
  Course,
  CourseProgress,
  LevelProgress,
  ModuleProgress,
  ModuleRequirements,
  ModuleStatus,
} from "@/lib/courseTypes";

// Score minimum (en %) à un quiz pour qu'il compte comme réussi.
export const QUIZ_PASS_THRESHOLD = 75;

// Un instantané de la progression de l'utilisateur, tel que lu dans le
// localStorage (voir lib/progress.ts et lib/useProgress.ts).
export type ProgressSnapshot = {
  completedLessonIds: Set<string>;
  quizScores: Record<string, number>; // identifiant de bloc -> meilleur score (0-100)
  actionsDone: Set<string>;
  assessmentsDone: Set<string>;
};

export const EMPTY_PROGRESS_SNAPSHOT: ProgressSnapshot = {
  completedLessonIds: new Set(),
  quizScores: {},
  actionsDone: new Set(),
  assessmentsDone: new Set(),
};

// Un module est validé quand TOUTES ses conditions sont remplies : leçons
// terminées, quiz à au moins 75%, actions confirmées, évaluations confirmées.
// Un module sans aucune leçon (pas encore de contenu) n'est jamais "validé".
export function isModuleValidated(
  requirements: ModuleRequirements,
  progress: ProgressSnapshot
): boolean {
  if (requirements.lessonIds.length === 0) return false;

  const allLessonsDone = requirements.lessonIds.every((id) =>
    progress.completedLessonIds.has(id)
  );
  const allQuizzesPassed = requirements.quizBlockIds.every(
    (id) => (progress.quizScores[id] ?? 0) >= QUIZ_PASS_THRESHOLD
  );
  const allActionsDone = requirements.actionBlockIds.every((id) =>
    progress.actionsDone.has(id)
  );
  const allAssessmentsDone = requirements.assessmentBlockIds.every((id) =>
    progress.assessmentsDone.has(id)
  );

  return allLessonsDone && allQuizzesPassed && allActionsDone && allAssessmentsDone;
}

// À partir de la structure du cours, de ce que chaque module exige, et de
// la progression de l'utilisateur, calcule l'état de chaque module et de
// chaque niveau, ainsi que le pourcentage global d'avancement.
export function computeCourseProgress(
  course: Course,
  moduleRequirements: Record<string, ModuleRequirements>,
  progress: ProgressSnapshot
): CourseProgress {
  let totalLessons = 0;
  let completedLessons = 0;
  const moduleProgress: Record<string, ModuleProgress> = {};
  // Modules déjà validés au fil du parcours : sert à vérifier les
  // prérequis. On avance dans l'ordre du cursus (course.modules), donc un
  // prérequis est toujours un module déjà rencontré à ce stade.
  const validatedModules = new Set<string>();

  for (const courseModule of course.modules) {
    const totalCount = courseModule.lessons.length;
    const completedCount = courseModule.lessons.filter((id) =>
      progress.completedLessonIds.has(id)
    ).length;

    totalLessons += totalCount;
    completedLessons += completedCount;

    const requirements: ModuleRequirements = moduleRequirements[courseModule.slug] ?? {
      lessonIds: [],
      quizBlockIds: [],
      actionBlockIds: [],
      assessmentBlockIds: [],
    };
    const validated = isModuleValidated(requirements, progress);
    if (validated) {
      validatedModules.add(courseModule.slug);
    }

    const prerequisitesMet = courseModule.prerequisites.every((slug) =>
      validatedModules.has(slug)
    );

    let status: ModuleStatus;
    if (totalCount === 0) {
      status = "coming-soon";
    } else if (!prerequisitesMet) {
      status = "locked";
    } else if (validated) {
      status = "completed";
    } else {
      status = "current";
    }

    moduleProgress[courseModule.slug] = { status, completedCount, totalCount, validated };
  }

  const levelProgress: Record<string, LevelProgress> = {};
  for (const level of course.levels) {
    const modulesWithContent = level.modules.filter(
      (slug) => (moduleProgress[slug]?.totalCount ?? 0) > 0
    );
    const completedModules = level.modules.filter(
      (slug) => moduleProgress[slug]?.status === "completed"
    ).length;

    levelProgress[level.slug] = {
      status:
        modulesWithContent.length === 0
          ? "coming-soon"
          : completedModules === level.modules.length
            ? "completed"
            : "current",
      completedModules,
      totalModules: level.modules.length,
    };
  }

  const percentage =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return { totalLessons, completedLessons, percentage, moduleProgress, levelProgress };
}

// La prochaine chose à faire dans le cursus, pour le tableau de bord :
// - la prochaine leçon non terminée du module en cours, s'il y en a une ;
// - sinon, si le module en cours a toutes ses leçons faites mais n'est pas
//   encore validé (quiz/action/évaluation manquants), on renvoie vers le module ;
// - sinon (rien de disponible, ou tout est fait), on le signale.
export type NextAction =
  | { kind: "lesson"; moduleSlug: string; lessonId: string }
  | { kind: "module"; moduleSlug: string }
  | { kind: "done" };

export function getNextAction(
  course: Course,
  moduleRequirements: Record<string, ModuleRequirements>,
  progress: ProgressSnapshot
): NextAction {
  const { moduleProgress } = computeCourseProgress(course, moduleRequirements, progress);

  for (const courseModule of course.modules) {
    if (moduleProgress[courseModule.slug]?.status !== "current") continue;

    const nextLesson = courseModule.lessons.find(
      (id) => !progress.completedLessonIds.has(id)
    );
    if (nextLesson) {
      return { kind: "lesson", moduleSlug: courseModule.slug, lessonId: nextLesson };
    }
    return { kind: "module", moduleSlug: courseModule.slug };
  }

  return { kind: "done" };
}
