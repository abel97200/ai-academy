// Vérifie que le Module 6 reste verrouillé tant que le Module 5 n'est pas
// entièrement validé, puis devient accessible une fois le Module 5 terminé.

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

describe("Déverrouillage du Module 6 après le Module 5", () => {
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

  it("le Module 6 a ses 6 leçons et le Module 5 comme prérequis", () => {
    const module6 = course.modules.find((item) => item.slug === "module-6")!;
    expect(module6.lessons).toEqual([
      "lesson-6-1",
      "lesson-6-2",
      "lesson-6-3",
      "lesson-6-4",
      "lesson-6-5",
      "lesson-6-6",
    ]);
    expect(module6.prerequisites).toEqual(["module-5"]);
  });

  it("reste verrouillé tant que le Module 5 est incomplet", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    completeModule(snapshot, "module-3");
    completeModule(snapshot, "module-4");
    ["lesson-5-1", "lesson-5-2", "lesson-5-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-5"].status).toBe("current");
    expect(progress.moduleProgress["module-6"].status).toBe("locked");
  });

  it("se débloque lorsque les Modules 1 à 5 sont entièrement validés", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    completeModule(snapshot, "module-2");
    completeModule(snapshot, "module-3");
    completeModule(snapshot, "module-4");
    completeModule(snapshot, "module-5");

    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-5"].status).toBe("completed");
    expect(progress.moduleProgress["module-6"].status).toBe("current");
  });
});
