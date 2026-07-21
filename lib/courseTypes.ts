// Types partagés décrivant une formation. Séparés de lib/course.ts (qui
// lit des fichiers via "fs", donc réservé au serveur) pour que les
// composants client puissent les utiliser sans essayer d'embarquer "fs"
// dans le navigateur.

export type CourseModule = {
  number: number;
  slug: string;
  title: string;
  objective: string; // ce qu'on apprend dans ce module
  usefulness: string; // à quoi ça sert concrètement
  lessons: string[]; // identifiants des leçons, dans l'ordre ; vide = pas encore de contenu
};

export type Course = {
  slug: string;
  title: string;
  promise: string;
  modules: CourseModule[];
};

export type ModuleStatus = "completed" | "current" | "locked";

export type ModuleProgress = {
  status: ModuleStatus;
  completedCount: number;
  totalCount: number;
};

export type CourseProgress = {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  moduleProgress: Record<string, ModuleProgress>; // par slug de module
};
