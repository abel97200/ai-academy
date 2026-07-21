// Lit le contenu d'une leçon depuis le disque. Réservé au serveur (utilise
// "fs"). Les types et fonctions pures, eux, sont dans lib/contentTypes.ts
// (voir ce fichier) — importés et ré-exportés ici pour que le code serveur
// existant continue de tout trouver via "@/lib/content" sans rien changer.

import fs from "fs";
import path from "path";
import type { Lesson } from "@/lib/contentTypes";

export * from "@/lib/contentTypes";

// Lit le fichier JSON d'une leçon et renvoie son contenu typé.
// Les leçons sont rangées ainsi : /content/<cours>/<module>/<leçon>.json
export function getLesson(
  course: string,
  moduleSlug: string,
  lessonId: string
): Lesson {
  const filePath = path.join(
    process.cwd(),
    "content",
    course,
    moduleSlug,
    `${lessonId}.json`
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(fileContent) as Lesson;
}
