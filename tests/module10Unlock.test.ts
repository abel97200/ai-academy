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

describe("Contenu et déverrouillage du Module 10", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);
  const module10 = course.modules.find((item) => item.slug === "module-10")!;

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

  it("déclare 6 leçons et le Module 9 comme prérequis", () => {
    expect(module10.lessons).toEqual([
      "lesson-10-1",
      "lesson-10-2",
      "lesson-10-3",
      "lesson-10-4",
      "lesson-10-5",
      "lesson-10-6",
    ]);
    expect(module10.prerequisites).toEqual(["module-9"]);
  });

  it("charge des JSON cohérents avec des quiz de 5 questions", () => {
    const practicalIds = new Set<string>();
    module10.lessons.forEach((lessonId) => {
      const lesson = getLesson("claude-code", "module-10", lessonId);
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

  it("reste verrouillé si le Module 9 est incomplet", () => {
    const snapshot = emptyProgress();
    ["module-1", "module-2", "module-3", "module-4", "module-5", "module-6", "module-7", "module-8"].forEach(
      (slug) => completeModule(snapshot, slug)
    );
    ["lesson-9-1", "lesson-9-2", "lesson-9-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-9"].status).toBe("current");
    expect(progress.moduleProgress["module-10"].status).toBe("locked");
  });

  it("se débloque après la validation complète du Module 9", () => {
    const snapshot = emptyProgress();
    ["module-1", "module-2", "module-3", "module-4", "module-5", "module-6", "module-7", "module-8", "module-9"].forEach(
      (slug) => completeModule(snapshot, slug)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-9"].status).toBe("completed");
    expect(progress.moduleProgress["module-10"].status).toBe("current");
  });
});
