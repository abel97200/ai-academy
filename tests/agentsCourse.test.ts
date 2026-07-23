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

describe("Parcours Créer des agents IA", () => {
  const course = getCourse("agents-ia");
  const requirements = getAllModuleRequirements("agents-ia", course);

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

  it("déclare 4 niveaux, 12 modules et le projet final Sentinelle", () => {
    expect(course.slug).toBe("agents-ia");
    expect(course.levels).toHaveLength(4);
    expect(course.modules).toHaveLength(12);
    expect(course.finalProject.title).toBe("Sentinelle");
    expect(course.modules.map((module) => module.number)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1)
    );
  });

  it("active 6 leçons dans chacun des Modules 1 et 2", () => {
    expect(course.modules[0].lessons).toEqual(
      Array.from({ length: 6 }, (_, index) => `agents-ia-lesson-1-${index + 1}`)
    );
    expect(course.modules[1].lessons).toEqual(
      Array.from({ length: 6 }, (_, index) => `agents-ia-lesson-2-${index + 1}`)
    );
    expect(course.modules[1].prerequisites).toEqual(["module-1"]);
  });

  it("charge des blocs autorisés, des quiz de 5 questions et des ids pratiques uniques", () => {
    const practicalIds = new Set<string>();
    course.modules.slice(0, 2).forEach((courseModule) => {
      courseModule.lessons.forEach((lessonId) => {
        const lesson = getLesson("agents-ia", courseModule.slug, lessonId);
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
  });

  it("n’utilise aucun identifiant de leçon du parcours Claude Code", () => {
    const claudeCourse = getCourse("claude-code");
    const claudeLessonIds = new Set(
      claudeCourse.modules.flatMap((courseModule) => courseModule.lessons)
    );
    const agentLessonIds = course.modules.flatMap((courseModule) => courseModule.lessons);
    expect(agentLessonIds.every((id) => id.startsWith("agents-ia-"))).toBe(true);
    expect(agentLessonIds.some((id) => claudeLessonIds.has(id))).toBe(false);
  });

  it("verrouille le Module 2 puis le déverrouille après validation du Module 1", () => {
    const before = computeCourseProgress(course, requirements, emptyProgress());
    expect(before.moduleProgress["module-1"].status).toBe("current");
    expect(before.moduleProgress["module-2"].status).toBe("locked");

    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    const after = computeCourseProgress(course, requirements, snapshot);
    expect(after.moduleProgress["module-1"].status).toBe("completed");
    expect(after.moduleProgress["module-2"].status).toBe("current");
  });
});
