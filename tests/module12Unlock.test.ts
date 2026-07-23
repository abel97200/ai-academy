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

describe("Contenu et déverrouillage du Module 12", () => {
  const course = getCourse("claude-code");
  const requirements = getAllModuleRequirements("claude-code", course);
  const module12 = course.modules.find((item) => item.slug === "module-12")!;

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

  it("déclare 6 leçons et le Module 11 comme prérequis", () => {
    expect(module12.lessons).toEqual([
      "lesson-12-1", "lesson-12-2", "lesson-12-3",
      "lesson-12-4", "lesson-12-5", "lesson-12-6",
    ]);
    expect(module12.prerequisites).toEqual(["module-11"]);
  });

  it("charge des JSON cohérents avec des quiz de 5 questions", () => {
    const practicalIds = new Set<string>();
    module12.lessons.forEach((lessonId) => {
      const lesson = getLesson("claude-code", "module-12", lessonId);
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

  it("reste verrouillé si le Module 11 est incomplet", () => {
    const snapshot = emptyProgress();
    Array.from({ length: 10 }, (_, index) => `module-${index + 1}`).forEach((slug) =>
      completeModule(snapshot, slug)
    );
    ["lesson-11-1", "lesson-11-2", "lesson-11-3"].forEach((id) =>
      snapshot.completedLessonIds.add(id)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-11"].status).toBe("current");
    expect(progress.moduleProgress["module-12"].status).toBe("locked");
  });

  it("se débloque après la validation complète du Module 11", () => {
    const snapshot = emptyProgress();
    Array.from({ length: 11 }, (_, index) => `module-${index + 1}`).forEach((slug) =>
      completeModule(snapshot, slug)
    );
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-11"].status).toBe("completed");
    expect(progress.moduleProgress["module-12"].status).toBe("current");
  });
});
