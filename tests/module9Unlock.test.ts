import { describe, expect, it } from "vitest";
import { getLesson } from "@/lib/content";
import { getAllModuleRequirements, getCourse } from "@/lib/course";
import { computeCourseProgress, type ProgressSnapshot } from "@/lib/courseProgress";

const supportedTypes = new Set([
  "explication",
  "schema",
  "demo",
  "exercice",
  "quiz",
  "validation",
  "code",
  "action",
  "project",
  "assessment",
]);

function emptyProgress(): ProgressSnapshot {
  return {
    completedLessonIds: new Set(),
    quizScores: {},
    actionsDone: new Set(),
    assessmentsDone: new Set(),
  };
}

describe("Contenu et déverrouillage du Module 9", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);
  const module9 = course.modules.find((item) => item.slug === "module-9")!;

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

  it("déclare 6 leçons et le Module 8 comme prérequis", () => {
    expect(module9.lessons).toEqual([
      "lesson-9-1",
      "lesson-9-2",
      "lesson-9-3",
      "lesson-9-4",
      "lesson-9-5",
      "lesson-9-6",
    ]);
    expect(module9.prerequisites).toEqual(["module-8"]);
  });

  it("charge des JSON cohérents avec des quiz de 5 questions", () => {
    const practicalIds = new Set<string>();
    module9.lessons.forEach((lessonId) => {
      const lesson = getLesson("claude-code", "module-9", lessonId);
      expect(lesson.id).toBe(lessonId);
      expect(lesson.blocks.at(-1)?.type).toBe("validation");
      const quizzes = lesson.blocks.filter((block) => block.type === "quiz");
      expect(quizzes).toHaveLength(1);
      expect(quizzes[0].questions).toHaveLength(5);
      lesson.blocks.forEach((block) => {
        expect(supportedTypes.has(block.type)).toBe(true);
        if (block.type === "action" || block.type === "project") {
          expect(practicalIds.has(block.id)).toBe(false);
          practicalIds.add(block.id);
        }
      });
    });
  });

  it("reste verrouillé si le Module 8 est incomplet", () => {
    const snapshot = emptyProgress();
    ["module-1", "module-2", "module-3", "module-4", "module-5", "module-6", "module-7"].forEach(
      (slug) => completeModule(snapshot, slug)
    );
    ["lesson-8-1", "lesson-8-2", "lesson-8-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-8"].status).toBe("current");
    expect(progress.moduleProgress["module-9"].status).toBe("locked");
  });

  it("se débloque après la validation complète du Module 8", () => {
    const snapshot = emptyProgress();
    ["module-1", "module-2", "module-3", "module-4", "module-5", "module-6", "module-7", "module-8"].forEach(
      (slug) => completeModule(snapshot, slug)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-8"].status).toBe("completed");
    expect(progress.moduleProgress["module-9"].status).toBe("current");
  });
});
