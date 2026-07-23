import { describe, expect, it } from "vitest";
import { getLesson } from "@/lib/content";
import { getAllModuleRequirements, getCourse } from "@/lib/course";
import { computeCourseProgress, type ProgressSnapshot } from "@/lib/courseProgress";

const supportedTypes = new Set([
  "explication", "schema", "demo", "exercice", "quiz",
  "validation", "code", "action", "project", "assessment",
]);

function emptyProgress(): ProgressSnapshot {
  return {
    completedLessonIds: new Set(),
    quizScores: {},
    actionsDone: new Set(),
    assessmentsDone: new Set(),
  };
}

describe("Contenu et déverrouillage du Module 11", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);
  const module11 = course.modules.find((item) => item.slug === "module-11")!;

  function completeModule(snapshot: ProgressSnapshot, moduleSlug: string) {
    const courseModule = course.modules.find((item) => item.slug === moduleSlug)!;
    courseModule.lessons.forEach((id) => snapshot.completedLessonIds.add(id));
    requirements[moduleSlug].quizBlockIds.forEach((id) => {
      snapshot.quizScores[id] = 100;
    });
    requirements[moduleSlug].actionBlockIds.forEach((id) => snapshot.actionsDone.add(id));
    requirements[moduleSlug].assessmentBlockIds.forEach((id) =>
      snapshot.assessmentsDone.add(id)
    );
  }

  it("déclare 6 leçons et le Module 10 comme prérequis", () => {
    expect(module11.lessons).toEqual([
      "lesson-11-1", "lesson-11-2", "lesson-11-3",
      "lesson-11-4", "lesson-11-5", "lesson-11-6",
    ]);
    expect(module11.prerequisites).toEqual(["module-10"]);
  });

  it("charge des JSON cohérents avec des quiz de 5 questions", () => {
    const practicalIds = new Set<string>();
    module11.lessons.forEach((lessonId) => {
      const lesson = getLesson("claude-code", "module-11", lessonId);
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

  it("reste verrouillé si le Module 10 est incomplet", () => {
    const snapshot = emptyProgress();
    Array.from({ length: 9 }, (_, index) => `module-${index + 1}`).forEach((slug) =>
      completeModule(snapshot, slug)
    );
    ["lesson-10-1", "lesson-10-2", "lesson-10-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-10"].status).toBe("current");
    expect(progress.moduleProgress["module-11"].status).toBe("locked");
  });

  it("se débloque après la validation complète du Module 10", () => {
    const snapshot = emptyProgress();
    Array.from({ length: 10 }, (_, index) => `module-${index + 1}`).forEach((slug) =>
      completeModule(snapshot, slug)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-10"].status).toBe("completed");
    expect(progress.moduleProgress["module-11"].status).toBe("current");
  });
});
