// Tests du Module 1 du parcours "Automatiser de A à Z" (pilote UX/pédagogique).
// Vérifie : chargement du parcours, présence des 6 leçons, structure des
// blocs (y compris les nouveaux types situation/tri/resume/workflow/ordre),
// unicité des identifiants, quiz de 5 questions avec des bonnes réponses
// réparties, absence de question interactive sans contrôle utilisable,
// progression/déverrouillage, et absence de régression sur les autres cours.

import { describe, expect, it } from "vitest";
import { getLesson } from "@/lib/content";
import { getAllModuleRequirements, getCourse } from "@/lib/course";
import { computeCourseProgress, type ProgressSnapshot } from "@/lib/courseProgress";
import type { Block } from "@/lib/contentTypes";

const supportedTypes = new Set<Block["type"]>([
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
  "situation",
  "tri",
  "resume",
  "workflow",
  "ordre",
]);

function emptyProgress(): ProgressSnapshot {
  return {
    completedLessonIds: new Set(),
    quizScores: {},
    actionsDone: new Set(),
    assessmentsDone: new Set(),
  };
}

describe("Parcours Automatiser de A à Z — Module 1 (pilote)", () => {
  const course = getCourse("automatisation");
  const requirements = getAllModuleRequirements("automatisation", course);
  const module1 = course.modules.find((item) => item.slug === "module-1")!;

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

  it("déclare 9 modules, dont 6 leçons pour le Module 1 et aucun prérequis externe", () => {
    expect(course.modules).toHaveLength(9);
    expect(module1.prerequisites).toEqual([]);
    expect(module1.lessons).toEqual([
      "automatisation-lesson-1-1",
      "automatisation-lesson-1-2",
      "automatisation-lesson-1-3",
      "automatisation-lesson-1-4",
      "automatisation-lesson-1-5",
      "automatisation-lesson-1-6",
    ]);
  });

  it("applique le thème visuel light-elearning aux 6 leçons du Module 1", () => {
    module1.lessons.forEach((lessonId) => {
      const lesson = getLesson("automatisation", "module-1", lessonId);
      expect(lesson.theme).toBe("light-elearning");
    });
  });

  it("déclare les modules 2 à 9 sans contenu (à venir), pour ne développer que le Module 1", () => {
    const otherModules = course.modules.filter((m) => m.slug !== "module-1");
    expect(otherModules).toHaveLength(8);
    otherModules.forEach((m) => {
      expect(m.lessons).toEqual([]);
    });
  });

  it("charge des JSON cohérents, en layout séquentiel, avec un quiz de 5 questions chacun", () => {
    const practicalIds = new Set<string>();

    module1.lessons.forEach((lessonId) => {
      const lesson = getLesson("automatisation", "module-1", lessonId);
      expect(lesson.id).toBe(lessonId);
      expect(lesson.layout).toBe("sequence");
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

  it("répartit les bonnes réponses des quiz sur plusieurs positions (pas toujours la première)", () => {
    module1.lessons.forEach((lessonId) => {
      const lesson = getLesson("automatisation", "module-1", lessonId);
      const quiz = lesson.blocks.find((block) => block.type === "quiz");
      if (!quiz || quiz.type !== "quiz") return;

      const answerPositions = new Set(quiz.questions.map((q) => q.answer));
      expect(
        answerPositions.size,
        `${lessonId} : les bonnes réponses du quiz devraient utiliser plusieurs positions`
      ).toBeGreaterThan(1);

      // Chaque question a des options plausibles (au moins 2) et une réponse valide.
      quiz.questions.forEach((question) => {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(0);
      });
    });

    // Sur l'ensemble du module, la première option n'est pas systématiquement
    // la bonne réponse (régression historique explicitement à éviter).
    const allAnswers: number[] = [];
    module1.lessons.forEach((lessonId) => {
      const lesson = getLesson("automatisation", "module-1", lessonId);
      const quiz = lesson.blocks.find((block) => block.type === "quiz");
      if (quiz && quiz.type === "quiz") {
        quiz.questions.forEach((q) => allAnswers.push(q.answer));
      }
    });
    const alwaysFirst = allAnswers.every((answer) => answer === 0);
    expect(alwaysFirst).toBe(false);
  });

  it("ne propose aucune question interactive sans contrôle utilisable", () => {
    module1.lessons.forEach((lessonId) => {
      const lesson = getLesson("automatisation", "module-1", lessonId);
      lesson.blocks.forEach((block) => {
        if (block.type === "situation") {
          expect(block.options.length).toBeGreaterThanOrEqual(2);
          block.options.forEach((option) => {
            expect(option.label.length).toBeGreaterThan(0);
            expect(option.feedback.length).toBeGreaterThan(0);
          });
        }

        if (block.type === "tri") {
          expect(block.categories.length).toBeGreaterThanOrEqual(2);
          const categoryIds = new Set(block.categories.map((c) => c.id));
          expect(block.items.length).toBeGreaterThan(0);
          block.items.forEach((item) => {
            expect(categoryIds.has(item.correctCategoryId)).toBe(true);
          });
        }

        if (block.type === "ordre") {
          const itemIds = block.items.map((item) => item.id);
          expect(block.correctOrder.slice().sort()).toEqual(itemIds.slice().sort());
          expect(new Set(itemIds).size).toBe(itemIds.length);
        }

        if (block.type === "workflow") {
          expect(block.steps.length).toBeGreaterThanOrEqual(2);
        }

        if (block.type === "quiz") {
          block.questions.forEach((question) => {
            expect(question.options.length).toBeGreaterThanOrEqual(2);
          });
        }
      });
    });
  });

  it("le Module 1 est débloqué dès le départ (aucun prérequis) et se valide en complétant leçons, quiz, action et évaluation", () => {
    const emptySnapshot = emptyProgress();
    const initialProgress = computeCourseProgress(course, requirements, emptySnapshot);
    expect(initialProgress.moduleProgress["module-1"].status).toBe("current");

    const fullSnapshot = emptyProgress();
    completeModule(fullSnapshot, "module-1");
    const finalProgress = computeCourseProgress(course, requirements, fullSnapshot);
    expect(finalProgress.moduleProgress["module-1"].status).toBe("completed");
    expect(finalProgress.moduleProgress["module-1"].validated).toBe(true);
  });

  it("réussir uniquement les quiz ne suffit pas à valider le module (action + évaluation requises)", () => {
    const snapshot = emptyProgress();
    module1.lessons.forEach((id) => snapshot.completedLessonIds.add(id));
    requirements["module-1"].quizBlockIds.forEach((blockId) => {
      snapshot.quizScores[blockId] = 100;
    });
    // Ni l'action, ni l'évaluation finale ne sont confirmées ici.
    const progress = computeCourseProgress(course, requirements, snapshot);
    expect(progress.moduleProgress["module-1"].validated).toBe(false);
    expect(requirements["module-1"].actionBlockIds.length).toBeGreaterThan(0);
    expect(requirements["module-1"].assessmentBlockIds.length).toBeGreaterThan(0);
  });

  it("les modules 2 à 9, sans contenu, restent «à venir» quel que soit l'avancement du Module 1", () => {
    const snapshot = emptyProgress();
    completeModule(snapshot, "module-1");
    const progress = computeCourseProgress(course, requirements, snapshot);
    course.modules
      .filter((m) => m.slug !== "module-1")
      .forEach((m) => {
        expect(progress.moduleProgress[m.slug].status).toBe("coming-soon");
      });
  });

  it("n'entraîne aucune régression sur les parcours existants", () => {
    const claudeCode = getCourse("claude-code");
    expect(claudeCode.modules.length).toBeGreaterThan(0);
    const automatisationSpecialization = claudeCode.specializations.find(
      (s) => s.slug === "automatisation"
    );
    expect(automatisationSpecialization?.available).toBe(true);

    const agentsIa = getCourse("agents-ia");
    expect(agentsIa.modules.find((m) => m.slug === "module-1")?.lessons).toEqual([
      "agents-ia-lesson-1-1",
      "agents-ia-lesson-1-2",
      "agents-ia-lesson-1-3",
      "agents-ia-lesson-1-4",
      "agents-ia-lesson-1-5",
      "agents-ia-lesson-1-6",
    ]);
  });
});
