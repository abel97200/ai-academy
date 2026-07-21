// Ce fichier lit le contenu d'une formation depuis le disque : son titre,
// sa promesse, la liste ordonnée de ses niveaux/modules, et ce que chaque
// module exige pour être validé. Réservé au serveur (utilise "fs"). Les
// types et le calcul de progression, eux, sont dans des fichiers séparés
// (lib/courseTypes.ts, lib/courseProgress.ts) pour pouvoir aussi être
// utilisés côté client.

import fs from "fs";
import path from "path";
import { getBlockId, getLesson } from "@/lib/content";
import type { Course, CourseModule, ModuleRequirements } from "@/lib/courseTypes";

// Lit le fichier JSON d'un cours : /content/<cours>/course.json
export function getCourse(courseSlug: string): Course {
  const filePath = path.join(process.cwd(), "content", courseSlug, "course.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as Course;
}

// Retrouve un module précis d'un cours à partir de son "slug" (ex: "module-1").
export function getCourseModule(courseSlug: string, moduleSlug: string): CourseModule {
  const course = getCourse(courseSlug);
  const foundModule = course.modules.find((m) => m.slug === moduleSlug);
  if (!foundModule) {
    throw new Error(`Module "${moduleSlug}" introuvable dans "${courseSlug}".`);
  }
  return foundModule;
}

// Retrouve la leçon qui suit "lessonId" : la suivante dans le même module,
// sinon la première leçon du prochain module qui a du contenu.
// Renvoie null si on est déjà à la toute dernière leçon disponible.
export function getNextLessonRef(
  course: Course,
  moduleSlug: string,
  lessonId: string
): { moduleSlug: string; lessonId: string } | null {
  const moduleIndex = course.modules.findIndex((m) => m.slug === moduleSlug);
  if (moduleIndex === -1) return null;

  const currentModule = course.modules[moduleIndex];
  const lessonIndex = currentModule.lessons.indexOf(lessonId);

  if (lessonIndex !== -1 && lessonIndex + 1 < currentModule.lessons.length) {
    return { moduleSlug, lessonId: currentModule.lessons[lessonIndex + 1] };
  }

  for (let i = moduleIndex + 1; i < course.modules.length; i += 1) {
    const nextModule = course.modules[i];
    if (nextModule.lessons.length > 0) {
      return { moduleSlug: nextModule.slug, lessonId: nextModule.lessons[0] };
    }
  }

  return null;
}

// Calcule ce qu'un module EXIGE pour être validé, en lisant le contenu réel
// de ses leçons : quels blocs quiz/action/assessment elles contiennent (via
// leur identifiant, voir getBlockId). Un module sans leçon (pas encore de
// contenu) renvoie des listes vides.
export function getModuleRequirements(
  courseSlug: string,
  courseModule: CourseModule
): ModuleRequirements {
  const quizBlockIds: string[] = [];
  const actionBlockIds: string[] = [];
  const assessmentBlockIds: string[] = [];

  for (const lessonId of courseModule.lessons) {
    const lesson = getLesson(courseSlug, courseModule.slug, lessonId);
    lesson.blocks.forEach((block, index) => {
      const blockId = getBlockId(lesson.id, index);
      if (block.type === "quiz") quizBlockIds.push(blockId);
      if (block.type === "action") actionBlockIds.push(blockId);
      if (block.type === "assessment") assessmentBlockIds.push(blockId);
    });
  }

  return {
    lessonIds: courseModule.lessons,
    quizBlockIds,
    actionBlockIds,
    assessmentBlockIds,
  };
}

// Calcule les exigences de TOUS les modules d'un cours d'un coup (pratique
// pour les écrans parcours/module, qui ont besoin de connaître l'état de
// plusieurs modules à la fois).
export function getAllModuleRequirements(
  courseSlug: string,
  course: Course
): Record<string, ModuleRequirements> {
  const result: Record<string, ModuleRequirements> = {};
  for (const courseModule of course.modules) {
    result[courseModule.slug] = getModuleRequirements(courseSlug, courseModule);
  }
  return result;
}

// Titre de chaque leçon existante du cours, par identifiant (pratique pour
// le tableau de bord, qui affiche le titre de la "prochaine action" sans
// avoir besoin de charger le contenu complet de la leçon).
export function getAllLessonTitles(
  courseSlug: string,
  course: Course
): Record<string, string> {
  const titles: Record<string, string> = {};
  for (const courseModule of course.modules) {
    for (const lessonId of courseModule.lessons) {
      titles[lessonId] = getLesson(courseSlug, courseModule.slug, lessonId).title;
    }
  }
  return titles;
}
