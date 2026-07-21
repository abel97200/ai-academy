// Tests de la navigation entre leçons (lib/course.ts → getNextLessonRef).
// Ce fichier importe "fs" en haut (lecture de contenu), ce qui ne pose
// aucun problème ici : les tests tournent sous Node, pas dans un navigateur.

import { describe, expect, it } from "vitest";
import { getNextLessonRef } from "@/lib/course";
import type { Course } from "@/lib/courseTypes";

function buildFakeCourse(): Course {
  return {
    slug: "test-course",
    title: "Cours de test",
    promise: "promesse",
    levels: [],
    modules: [
      {
        number: 1,
        slug: "module-1",
        title: "Module 1",
        level: "niveau-1",
        objective: "obj",
        usefulness: "util",
        prerequisites: [],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: ["lesson-1-1", "lesson-1-2"],
      },
      {
        number: 2,
        slug: "module-2",
        title: "Module 2",
        level: "niveau-1",
        objective: "obj",
        usefulness: "util",
        prerequisites: ["module-1"],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: [], // pas encore de contenu
      },
      {
        number: 3,
        slug: "module-3",
        title: "Module 3",
        level: "niveau-1",
        objective: "obj",
        usefulness: "util",
        prerequisites: ["module-2"],
        skills: [],
        deliverable: "livrable",
        estimatedMinutes: 30,
        lessons: ["lesson-3-1"],
      },
    ],
    finalProject: { title: "Final", description: "...", steps: [] },
    specializations: [],
  };
}

describe("getNextLessonRef", () => {
  it("renvoie la leçon suivante dans le même module", () => {
    const course = buildFakeCourse();
    const next = getNextLessonRef(course, "module-1", "lesson-1-1");
    expect(next).toEqual({ moduleSlug: "module-1", lessonId: "lesson-1-2" });
  });

  it("saute les modules sans contenu pour trouver la leçon suivante", () => {
    const course = buildFakeCourse();
    const next = getNextLessonRef(course, "module-1", "lesson-1-2");
    // module-2 n'a aucune leçon : on doit atterrir directement sur module-3.
    expect(next).toEqual({ moduleSlug: "module-3", lessonId: "lesson-3-1" });
  });

  it("renvoie null quand on est à la toute dernière leçon disponible", () => {
    const course = buildFakeCourse();
    const next = getNextLessonRef(course, "module-3", "lesson-3-1");
    expect(next).toBeNull();
  });

  it("renvoie null si le module n'existe pas", () => {
    const course = buildFakeCourse();
    const next = getNextLessonRef(course, "module-inconnu", "lesson-x");
    expect(next).toBeNull();
  });
});
