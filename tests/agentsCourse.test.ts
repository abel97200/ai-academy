import fs from "fs";
import path from "path";
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
  const activeModules = course.modules.slice(0, 2);

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
    expect(course.modules[1].title).toBe("Cadrer une mission utile et évaluable");
    expect(course.modules[1].estimatedMinutes).toBe(130);
  });

  it("charge 12 JSON valides, des blocs autorisés et des ids uniques", () => {
    const lessonIds = activeModules.flatMap((courseModule) => courseModule.lessons);
    expect(new Set(lessonIds).size).toBe(12);
    const practicalIds = new Set<string>();
    activeModules.forEach((courseModule) => {
      courseModule.lessons.forEach((lessonId) => {
        const lessonPath = path.join(
          process.cwd(),
          "content",
          "agents-ia",
          courseModule.slug,
          `${lessonId}.json`
        );
        expect(() => JSON.parse(fs.readFileSync(lessonPath, "utf-8"))).not.toThrow();
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

  it("propose exactement 5 questions par leçon avec une distribution 10/10/10 dans chaque module", () => {
    activeModules.forEach((courseModule) => {
      const answerCounts = [0, 0, 0];
      courseModule.lessons.forEach((lessonId) => {
        const lesson = getLesson("agents-ia", courseModule.slug, lessonId);
        const quiz = lesson.blocks.find((block) => block.type === "quiz");
        expect(quiz?.questions).toHaveLength(5);
        quiz?.questions.forEach((question) => {
          expect(question.options).toHaveLength(3);
          expect(question.answer).toBeGreaterThanOrEqual(0);
          expect(question.answer).toBeLessThan(question.options.length);
          answerCounts[question.answer] += 1;
          expect(question.explanation).toContain("Correct");
          expect(question.explanation).toContain("autres choix sont insuffisants");
        });
      });
      expect(answerCounts).toEqual([10, 10, 10]);
      expect(Math.max(...answerCounts) / 30).toBeLessThanOrEqual(0.4);
    });
  });

  it("rend chaque exercice évaluable et impose une preuve à conserver", () => {
    activeModules.forEach((courseModule) => {
      courseModule.lessons.forEach((lessonId) => {
        const lesson = getLesson("agents-ia", courseModule.slug, lessonId);
        const exercises = lesson.blocks.filter((block) => block.type === "exercice");
        expect(exercises).toHaveLength(1);
        const exercise = exercises[0];
        expect(exercise.question).toContain("Consigne —");
        expect(exercise.question).toContain("Données d’entrée —");
        expect(exercise.question).toContain("Résultat attendu —");
        expect(exercise.hints.some((hint) => hint.startsWith("Critères de réussite —"))).toBe(true);
        expect(exercise.hints.some((hint) => hint.startsWith("Critère bloquant —"))).toBe(true);
        expect(exercise.hints.some((hint) => hint.startsWith("Preuve Sentinelle —"))).toBe(true);
        expect(exercise.solution).toContain("Grille —");
        expect(exercise.solution).toContain("Exemple acceptable —");
        expect(exercise.solution).toContain("Exemple insuffisant —");
      });
    });
  });

  it("cadre Claude Code comme assistant de développement dans chaque leçon", () => {
    activeModules.forEach((courseModule) => {
      courseModule.lessons.forEach((lessonId) => {
        const lesson = getLesson("agents-ia", courseModule.slug, lessonId);
        const codeBlocks = lesson.blocks.filter((block) => block.type === "code");
        expect(codeBlocks).toHaveLength(1);
        codeBlocks.forEach((block) => {
          expect(block.explanation).toContain("À comprendre —");
          expect(block.explanation).toContain("À modifier —");
          expect(block.explanation).toContain("Claude Code peut —");
          expect(block.explanation).toContain("À vérifier —");
        });
      });
    });
  });

  it("fournit des projets et évaluations finales avec niveaux et critères bloquants", () => {
    activeModules.forEach((courseModule) => {
      const finalLesson = getLesson(
        "agents-ia",
        courseModule.slug,
        courseModule.lessons.at(-1)!
      );
      const project = finalLesson.blocks.find((block) => block.type === "project");
      const assessment = finalLesson.blocks.find((block) => block.type === "assessment");
      expect(project?.deliverables.length).toBeGreaterThanOrEqual(5);
      expect(project?.successCriteria.some((criterion) => criterion.startsWith("Bloquant —"))).toBe(true);
      expect(assessment?.requirements.some((requirement) => requirement.startsWith("Critère de réussite —"))).toBe(true);
      expect(assessment?.requirements.some((requirement) => requirement.startsWith("Bloquant —"))).toBe(true);
      expect(assessment?.requirements.some((requirement) => requirement.startsWith("Niveau insuffisant —"))).toBe(true);
      expect(assessment?.requirements.some((requirement) => requirement.startsWith("Niveau acceptable —"))).toBe(true);
      expect(assessment?.requirements.some((requirement) => requirement.startsWith("Niveau maîtrisé —"))).toBe(true);
    });
  });

  it("persiste l’évaluation conceptuelle v0 de Sentinelle pour le Module 3", () => {
    const evalPath = path.join(
      process.cwd(),
      "content",
      "agents-ia",
      "sentinelle-evals-v0.json"
    );
    const evaluation = JSON.parse(fs.readFileSync(evalPath, "utf-8")) as {
      status: string;
      successMeasure: string;
      reuse: { module: number };
      cases: Array<{
        id: string;
        type: string;
        expectedOutput: Record<string, unknown>;
        successCriteria: string[];
        blockingCriteria: string[];
      }>;
    };
    expect(evaluation.status).toBe("conceptual");
    expect(evaluation.successMeasure.length).toBeGreaterThan(20);
    expect(evaluation.reuse.module).toBe(3);
    expect(new Set(evaluation.cases.map((testCase) => testCase.id)).size).toBe(
      evaluation.cases.length
    );
    expect(new Set(evaluation.cases.map((testCase) => testCase.type))).toEqual(
      new Set(["nominal", "edge", "refusal"])
    );
    evaluation.cases.forEach((testCase) => {
      expect(Object.keys(testCase.expectedOutput).length).toBeGreaterThan(0);
      expect(testCase.successCriteria.length).toBeGreaterThan(0);
      expect(testCase.blockingCriteria.length).toBeGreaterThan(0);
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
