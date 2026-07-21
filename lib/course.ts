// Ce fichier lit le contenu d'une formation depuis le disque : son titre,
// sa promesse, et la liste ordonnée de ses modules. Réservé au serveur
// (utilise "fs"). Les types et le calcul de progression, eux, sont dans
// des fichiers séparés (lib/courseTypes.ts, lib/courseProgress.ts) pour
// pouvoir aussi être utilisés côté client.

import fs from "fs";
import path from "path";
import type { Course } from "@/lib/courseTypes";

// Lit le fichier JSON d'un cours : /content/<cours>/course.json
export function getCourse(courseSlug: string): Course {
  const filePath = path.join(process.cwd(), "content", courseSlug, "course.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as Course;
}

// Retrouve un module précis d'un cours à partir de son "slug" (ex: "module-1").
export function getCourseModule(courseSlug: string, moduleSlug: string) {
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
