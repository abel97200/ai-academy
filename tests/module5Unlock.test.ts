// Vérifie que le Module 5 reste verrouillé tant que le Module 4 n'est pas
// entièrement validé, puis devient accessible une fois le Module 4 terminé.

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

describe("Déverrouillage du Module 5 après le Module 4", () => {
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

  it("le Module 5 a ses 6 leçons et le Module 4 comme prérequis", () => {
    const module5 = course.modules.find((item) => item.slug === "module-5")!;
    expect(module5.lessons).toEqual([
      "lesson-5-1",
      "lesson-5-2",
      "lesson-5-3",
      "lesson-5-4",
      "lesson-5-5",
      "lesson-5-6",
    ]);
    expect(module5.prerequisites).toEqual(["module-4"]);
  });

  it("reste verrouillé tant que le Module 4 est incomplet", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    completeModule(snapshot, "module-3");
    ["lesson-4-1", "lesson-4-2", "lesson-4-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-4"].status).toBe("current");
    expect(progress.moduleProgress["module-5"].status).toBe("locked");
  });

  it("se débloque lorsque les Modules 1 à 4 sont entièrement validés", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    completeModule(snapshot, "module-3");
    completeModule(snapshot, "module-4");

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-4"].status).toBe("completed");
    expect(progress.moduleProgress["module-5"].status).toBe("current");
  });
});
