// Tests de la logique de validation de module/niveau et du calcul de
// progression (lib/courseProgress.ts). Fonctions pures : pas besoin de
// navigateur ni de système de fichiers pour les tester.

import { describe, expect, it } from "vitest";
import {
  computeCourseProgress,
  getNextAction,
  isModuleValidated,
  type ProgressSnapshot,
} from "@/lib/courseProgress";
import type { Course, ModuleRequirements } from "@/lib/courseTypes";

function emptyProgress(): ProgressSnapshot {
  return {
    completedLessonIds: new Set(),
    quizScores: {},
    actionsDone: new Set(),
    assessmentsDone: new Set(),
  };
}

const requirements: ModuleRequirements = {
  lessonIds: ["l1", "l2"],
  quizBlockIds: ["l2-block-1"],
  actionBlockIds: ["l2-block-2"],
  assessmentBlockIds: ["l2-block-3"],
};

describe("isModuleValidated", () => {
  it("n'est jamais validé si le module n'a aucune leçon", () => {
    const empty: ModuleRequirements = {
      lessonIds: [],
      quizBlockIds: [],
      actionBlockIds: [],
      assessmentBlockIds: [],
    };
    expect(isModuleValidated(empty, emptyProgress())).toBe(false);
  });

  it("n'est pas validé tant que toutes les conditions ne sont pas réunies", () => {
    const progress = emptyProgress();
    progress.completedLessonIds.add("l1");
    progress.completedLessonIds.add("l2");
    // Quiz, action et évaluation manquants.
    expect(isModuleValidated(requirements, progress)).toBe(false);
  });

  it("est validé quand toutes les conditions sont réunies (quiz >= 75%)", () => {
    const progress = emptyProgress();
    progress.completedLessonIds.add("l1");
    progress.completedLessonIds.add("l2");
    progress.quizScores["l2-block-1"] = 75;
    progress.actionsDone.add("l2-block-2");
    progress.assessmentsDone.add("l2-block-3");
    expect(isModuleValidated(requirements, progress)).toBe(true);
  });

  it("n'est pas validé si le score du quiz est sous le seuil", () => {
    const progress = emptyProgress();
    progress.completedLessonIds.add("l1");
    progress.completedLessonIds.add("l2");
    progress.quizScores["l2-block-1"] = 50;
    progress.actionsDone.add("l2-block-2");
    progress.assessmentsDone.add("l2-block-3");
    expect(isModuleValidated(requirements, progress)).toBe(false);
  });
});

// Un petit cours à 2 niveaux / 3 modules pour tester le calcul global.
function buildFakeCourse(): Course {
  return {
    slug: "test-course",
    title: "Cours de test",
    promise: "promesse",
    levels: [
      {
        number: 1,
        slug: "niveau-1",
        title: "Niveau 1",
        theme: "thème 1",
        modules: ["module-a", "module-b"],
        project: { title: "Projet 1", description: "..." },
      },
      {
        number: 2,
        slug: "niveau-2",
        title: "Niveau 2",
        theme: "thème 2",
        modules: ["module-c"],
        project: { title: "Projet 2", description: "..." },
      },
    ],
    modules: [
      {
        number: 1,
        slug: "module-a",
        title: "Module A",
        level: "niveau-1",
        objective: "obj",
        usefulness: "util",
        prerequisites: [],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: ["a1"],
      },
      {
        number: 2,
        slug: "module-b",
        title: "Module B",
        level: "niveau-1",
        objective: "obj",
        usefulness: "util",
        prerequisites: ["module-a"],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: ["b1"],
      },
      {
        number: 3,
        slug: "module-c",
        title: "Module C",
        level: "niveau-2",
        objective: "obj",
        usefulness: "util",
        prerequisites: ["module-b"],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: [], // pas encore de contenu -> "à venir"
      },
    ],
    finalProject: { title: "Final", description: "...", steps: [] },
    specializations: [],
  };
}

function requirementsFor(lessonIds: string[]): ModuleRequirements {
  return { lessonIds, quizBlockIds: [], actionBlockIds: [], assessmentBlockIds: [] };
}

describe("computeCourseProgress", () => {
  it("marque un module sans leçon comme 'coming-soon'", () => {
    const course = buildFakeCourse();
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor(["b1"]),
      "module-c": requirementsFor([]),
    };
    const progress = computeCourseProgress(course, reqs, emptyProgress());
    expect(progress.moduleProgress["module-c"].status).toBe("coming-soon");
  });

  it("verrouille un module dont le prérequis n'est pas validé", () => {
    const course = buildFakeCourse();
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor(["b1"]),
      "module-c": requirementsFor([]),
    };
    // module-a pas encore terminé -> module-b doit être verrouillé.
    const progress = computeCourseProgress(course, reqs, emptyProgress());
    expect(progress.moduleProgress["module-b"].status).toBe("locked");
  });

  it("débloque un module une fois son prérequis validé", () => {
    const course = buildFakeCourse();
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor(["b1"]),
      "module-c": requirementsFor([]),
    };
    const snapshot = emptyProgress();
    snapshot.completedLessonIds.add("a1");
    const progress = computeCourseProgress(course, reqs, snapshot);
    expect(progress.moduleProgress["module-a"].status).toBe("completed");
    expect(progress.moduleProgress["module-b"].status).toBe("current");
  });

  it("calcule le pourcentage global sur les leçons existantes uniquement", () => {
    const course = buildFakeCourse();
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor(["b1"]),
      "module-c": requirementsFor([]),
    };
    const snapshot = emptyProgress();
    snapshot.completedLessonIds.add("a1");
    const progress = computeCourseProgress(course, reqs, snapshot);
    // 1 leçon complétée sur 2 leçons existantes (module-c n'en a aucune).
    expect(progress.totalLessons).toBe(2);
    expect(progress.completedLessons).toBe(1);
    expect(progress.percentage).toBe(50);
  });
});

describe("getNextAction", () => {
  it("pointe vers la première leçon non terminée du module en cours", () => {
    const course = buildFakeCourse();
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor(["b1"]),
      "module-c": requirementsFor([]),
    };
    const action = getNextAction(course, reqs, emptyProgress());
    expect(action).toEqual({ kind: "lesson", moduleSlug: "module-a", lessonId: "a1" });
  });

  it("renvoie 'done' quand plus aucun module n'est en cours", () => {
    // Seul module-a a du contenu, et il est déjà terminé.
    const course = buildFakeCourse();
    course.modules[1].lessons = []; // module-b devient aussi "à venir"
    const reqs = {
      "module-a": requirementsFor(["a1"]),
      "module-b": requirementsFor([]),
      "module-c": requirementsFor([]),
    };
    const snapshot = emptyProgress();
    snapshot.completedLessonIds.add("a1");
    const action = getNextAction(course, reqs, snapshot);
    expect(action).toEqual({ kind: "done" });
  });
});
