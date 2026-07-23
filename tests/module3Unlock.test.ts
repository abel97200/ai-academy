// Vérifie, à partir du contenu RÉEL du cours (pas de données inventées),
// que le Module 3 reste verrouillé tant que le Module 2 n'est pas
// entièrement validé, et se débloque une fois qu'il l'est. Utilise les
// mêmes fonctions que l'application (getCourse, getAllModuleRequirements,
// computeCourseProgress), donc ce test casserait si le contenu réel
// changeait de façon incompatible.

import { describe, expect, it } from "vitest";
import { getAllModuleRequirements, getCourse } from "@/lib/course";
import { computeCourseProgress, type ProgressSnapshot } from "@/lib/courseProgress";

function emptyProgress(): ProgressSnapshot {
  return {
    completedLessonIds: new Set(),
    quizScores: {},
    actionsDone: new Set(),
    assessmentsDone: new Set(),
  };
}

describe("Déverrouillage du Module 3 après le Module 2", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);

  it("le Module 3 a bien ses 6 leçons et le Module 2 comme prérequis", () => {
    const module3 = course.modules.find((m) => m.slug === "module-3")!;
    expect(module3.lessons).toEqual([
      "lesson-3-1",
      "lesson-3-2",
      "lesson-3-3",
      "lesson-3-4",
      "lesson-3-5",
      "lesson-3-6",
    ]);
    expect(module3.prerequisites).toEqual(["module-2"]);
  });

  it("est verrouillé sans aucune progression", () => {
    const progress = computeCourseProgress(course, requirements, emptyProgress());
    expect(progress.moduleProgress["module-3"].status).toBe("locked");
  });

  // Valide entièrement un module (leçons + quiz + actions + évaluations)
  // dans un instantané de progression, pour construire des scénarios.
  function completeModule(snapshot: ProgressSnapshot, moduleSlug: string) {
    const courseModule = course.modules.find((m) => m.slug === moduleSlug)!;
    courseModule.lessons.forEach((id) => snapshot.completedLessonIds.add(id));
    requirements[moduleSlug].quizBlockIds.forEach((blockId) => {
      snapshot.quizScores[blockId] = 100;
    });
    requirements[moduleSlug].actionBlockIds.forEach((blockId) =>
      snapshot.actionsDone.add(blockId)
    );
    requirements[moduleSlug].assessmentBlockIds.forEach((blockId) =>
      snapshot.assessmentsDone.add(blockId)
    );
  }

  it("reste verrouillé si le Module 2 n'est que partiellement fait", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    // Seulement 3 des 6 leçons du module 2 marquées terminées : pas complet.
    ["lesson-2-1", "lesson-2-2", "lesson-2-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-2"].status).toBe("current");
    expect(progress.moduleProgress["module-3"].status).toBe("locked");
  });

  it("se débloque une fois le Module 2 entièrement validé (leçons + quiz à 75%)", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-2"].status).toBe("completed");
    expect(progress.moduleProgress["module-3"].status).toBe("current");
  });
});
