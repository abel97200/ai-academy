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
  const activeModules = course.modules.slice(0, 4);

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

  it("active 6 leçons dans chacun des Modules 1 à 4", () => {
    activeModules.forEach((courseModule, moduleIndex) => {
      expect(courseModule.lessons).toEqual(
        Array.from(
          { length: 6 },
          (_, lessonIndex) =>
            `agents-ia-lesson-${moduleIndex + 1}-${lessonIndex + 1}`
        )
      );
    });
    expect(course.modules[1].prerequisites).toEqual(["module-1"]);
    expect(course.modules[1].title).toBe("Cadrer une mission utile et évaluable");
    expect(course.modules[1].estimatedMinutes).toBe(130);
    expect(course.modules[2].prerequisites).toEqual(["module-2"]);
    expect(course.modules[2].title).toBe(
      "Appeler un modèle et produire une sortie structurée"
    );
    expect(course.modules[2].estimatedMinutes).toBe(150);
    expect(course.modules[3].prerequisites).toEqual(["module-3"]);
    expect(course.modules[3].title).toBe(
      "Construire une boucle agentique bornée et observable"
    );
    expect(course.modules[3].estimatedMinutes).toBe(165);
  });

  it("charge 24 JSON valides, des blocs autorisés et des ids uniques", () => {
    const lessonIds = activeModules.flatMap((courseModule) => courseModule.lessons);
    expect(new Set(lessonIds).size).toBe(24);
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
          expect(question.explanation.trim().length).toBeGreaterThanOrEqual(20);
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

  it("fait diagnostiquer un échec contrôlé dans chaque leçon des Modules 3 et 4", () => {
    activeModules.slice(2).forEach((courseModule) => {
      courseModule.lessons.forEach((lessonId) => {
        const lesson = getLesson("agents-ia", courseModule.slug, lessonId);
        const explanations = lesson.blocks
          .filter((block) => block.type === "explication")
          .map((block) => block.content)
          .join(" ");
        expect(explanations).toContain("Échec provoqué —");
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

  it("livre un projet Sentinelle exécutable, testé hors ligne et sans secret", () => {
    const exampleRoot = path.join(
      process.cwd(),
      "examples",
      "agents",
      "sentinelle"
    );
    const requiredFiles = [
      ".env.example",
      "README.md",
      "src/cli.ts",
      "src/domain/resource.ts",
      "src/model/generateResource.ts",
      "src/model/mockResourceModel.ts",
      "src/model/openAIResourceModel.ts",
      "src/runner/runSentinelle.ts",
      "tests/generateResource.test.ts",
      "tests/runSentinelle.test.ts",
    ];

    requiredFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(exampleRoot, relativePath))).toBe(true);
    });

    const sourceFiles = requiredFiles
      .filter((relativePath) => relativePath !== ".env.example")
      .map((relativePath) =>
        fs.readFileSync(path.join(exampleRoot, relativePath), "utf-8")
      );
    sourceFiles.forEach((source) => {
      expect(source).not.toMatch(/sk-[A-Za-z0-9_-]{20,}/);
      expect(source).not.toMatch(/apiKey\s*:\s*["'][^"']+["']/);
    });

    const generationTests = fs.readFileSync(
      path.join(exampleRoot, "tests", "generateResource.test.ts"),
      "utf-8"
    );
    ["JSON invalide", "sans champ obligatoire", "score hors plage", "type incorrect"].forEach(
      (failureCase) => expect(generationTests).toContain(failureCase)
    );

    const runnerTests = fs.readFileSync(
      path.join(exampleRoot, "tests", "runSentinelle.test.ts"),
      "utf-8"
    );
    ["success", "max_iterations", "trace", "inconsistent_state", "human_review_required"].forEach(
      (scenario) => expect(runnerTests.toLowerCase()).toContain(scenario)
    );
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

  it("déverrouille séquentiellement les Modules 2, 3 et 4", () => {
    const before = computeCourseProgress(course, requirements, emptyProgress());
    expect(before.moduleProgress["module-1"].status).toBe("current");
    expect(before.moduleProgress["module-2"].status).toBe("locked");
    expect(before.moduleProgress["module-3"].status).toBe("locked");
    expect(before.moduleProgress["module-4"].status).toBe("locked");

    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    const afterModule1 = computeCourseProgress(course, requirements, snapshot);
    expect(afterModule1.moduleProgress["module-1"].status).toBe("completed");
    expect(afterModule1.moduleProgress["module-2"].status).toBe("current");
    expect(afterModule1.moduleProgress["module-3"].status).toBe("locked");

    completeModule(snapshot, "module-2");
    const afterModule2 = computeCourseProgress(course, requirements, snapshot);
    expect(afterModule2.moduleProgress["module-2"].status).toBe("completed");
    expect(afterModule2.moduleProgress["module-3"].status).toBe("current");
    expect(afterModule2.moduleProgress["module-4"].status).toBe("locked");

    completeModule(snapshot, "module-3");
    const afterModule3 = computeCourseProgress(course, requirements, snapshot);
    expect(afterModule3.moduleProgress["module-3"].status).toBe("completed");
    expect(afterModule3.moduleProgress["module-4"].status).toBe("current");
  });
});
