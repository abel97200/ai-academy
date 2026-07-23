// Types partagés décrivant une formation. Séparés de lib/course.ts (qui
// lit des fichiers via "fs", donc réservé au serveur) pour que les
// composants client puissent les utiliser sans essayer d'embarquer "fs"
// dans le navigateur.

export type CourseModule = {
  number: number; // numéro global du module dans le cursus (1 à 12)
  slug: string;
  title: string;
  level: string; // slug du niveau parent (voir CourseLevel)
  objective: string; // objectif de compétence : ce qu'on apprend dans ce module
  usefulness: string; // à quoi ça sert concrètement
  prerequisites: string[]; // slugs des modules requis avant celui-ci
  skills: string[]; // compétences visées
  deliverable: string; // livrable pratique attendu en fin de module
  estimatedMinutes: number; // temps estimé pour suivre le module
  lessons: string[]; // identifiants des leçons, dans l'ordre ; vide = pas encore de contenu ("à venir")
};

export type LevelProject = {
  title: string;
  description: string;
};

export type CourseLevel = {
  number: number;
  slug: string;
  title: string;
  theme: string; // ex: "Comprendre et préparer"
  modules: string[]; // slugs des modules de ce niveau, dans l'ordre
  project: LevelProject; // projet de niveau (affiché à titre indicatif)
};

export type Specialization = {
  slug: string;
  title: string;
  description: string;
  available?: boolean;
};

export type FinalProject = {
  title: string; // "Wayli"
  description: string;
  steps: string[];
};

export type Course = {
  slug: string;
  title: string;
  promise: string;
  levels: CourseLevel[];
  modules: CourseModule[]; // liste à plat de tous les modules, référencés par CourseLevel.modules
  finalProject: FinalProject;
  specializations: Specialization[]; // affichées "à venir", sans contenu
};

// --- Avancement, calculé à partir de la progression (localStorage) -------

export type ModuleStatus = "completed" | "current" | "locked" | "coming-soon";

export type ModuleProgress = {
  status: ModuleStatus;
  completedCount: number; // nombre de leçons complétées
  totalCount: number; // nombre de leçons au total
  // true seulement si le module remplit TOUTES les conditions de validation
  // (leçons + quiz à au moins 75% + actions confirmées + évaluation confirmée).
  validated: boolean;
};

export type LevelStatus = "completed" | "current" | "coming-soon";

export type LevelProgress = {
  status: LevelStatus;
  completedModules: number;
  totalModules: number;
};

export type CourseProgress = {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  moduleProgress: Record<string, ModuleProgress>; // par slug de module
  levelProgress: Record<string, LevelProgress>; // par slug de niveau
};

// Ce qu'un module EXIGE pour être validé : les identifiants de tous ses
// blocs quiz/action/assessment, calculés côté serveur en lisant le contenu
// réel de ses leçons (voir lib/course.ts → getModuleRequirements).
export type ModuleRequirements = {
  lessonIds: string[];
  quizBlockIds: string[];
  actionBlockIds: string[];
  assessmentBlockIds: string[];
};
