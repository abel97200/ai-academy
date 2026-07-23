// Vérifie que le Module 4 reste verrouillé tant que le Module 3 n'est pas
// entièrement validé, puis devient accessible une fois le Niveau 1 terminé.

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

describe("Déverrouillage du Module 4 après le Module 3", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);

  function completeModule(snapshot: ProgressSnapshot, moduleSlug: string) {
    const courseModule = course.modules.find((item) => item.slug === moduleSlug)!;
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

  it("le Module 4 a ses 6 leçons et le Module 3 comme prérequis", () => {
    const module4 = course.modules.find((item) => item.slug === "module-4")!;
    expect(module4.lessons).toEqual([
      "lesson-4-1",
      "lesson-4-2",
      "lesson-4-3",
      "lesson-4-4",
      "lesson-4-5",
      "lesson-4-6",
    ]);
    expect(module4.prerequisites).toEqual(["module-3"]);
  });

  it("reste verrouillé tant que le Module 3 est incomplet", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    ["lesson-3-1", "lesson-3-2", "lesson-3-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-3"].status).toBe("current");
    expect(progress.moduleProgress["module-4"].status).toBe("locked");
  });

  it("se débloque lorsque les Modules 1 à 3 sont entièrement validés", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    completeModule(snapshot, "module-3");

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-3"].status).toBe("completed");
    expect(progress.moduleProgress["module-4"].status).toBe("current");
  });
});
