// Vérifie les contenus et le déverrouillage séquentiel des Modules 7 à 12.
import { describe, expect, it } from "vitest";
import { getAllModuleRequirements, getCourse } from "@/lib/course";
import { computeCourseProgress, type ProgressSnapshot } from "@/lib/courseProgress";

function emptyProgress(): ProgressSnapshot {
  return { completedLessonIds: new Set(), quizScores: {}, actionsDone: new Set(), assessmentsDone: new Set() };
}

describe("Modules 7 à 12", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);

  function completeModule(snapshot: ProgressSnapshot, moduleSlug: string) {
    const module = course.modules.find((item) => item.slug === moduleSlug)!;
    module.lessons.forEach((id) => snapshot.completedLessonIds.add(id));
    requirements[moduleSlug].quizBlockIds.forEach((id) => { snapshot.quizScores[id] = 100; });
    requirements[moduleSlug].actionBlockIds.forEach((id) => snapshot.actionsDone.add(id));
    requirements[moduleSlug].assessmentBlockIds.forEach((id) => snapshot.assessmentsDone.add(id));
  }

  for (let number = 7; number <= 12; number += 1) {
    const slug = `module-${number}`;
    const previous = `module-${number - 1}`;

    it(`${slug} référence six leçons et dépend de ${previous}`, () => {
      const module = course.modules.find((item) => item.slug === slug)!;
      expect(module.lessons).toEqual(Array.from({ length: 6 }, (_, index) => `lesson-${number}-${index + 1}`));
      expect(module.prerequisites).toEqual([previous]);
      expect(requirements[slug].quizBlockIds).toHaveLength(6);
    });

    it(`${slug} reste verrouillé avant la validation de ${previous} puis se débloque`, () => {
      const snapshot = emptyProgress();
      for (let completed = 1; completed < number - 1; completed += 1) completeModule(snapshot, `module-${completed}`);
      const before = computeCourseProgress(course, requirements, snapshot);
      expect(before.moduleProgress[slug].status).toBe("locked");
      completeModule(snapshot, previous);
      const after = computeCourseProgress(course, requirements, snapshot);
      expect(after.moduleProgress[previous].status).toBe("completed");
      expect(after.moduleProgress[slug].status).toBe("current");
    });
  }
});
