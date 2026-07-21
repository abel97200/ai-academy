// Gère la progression de l'utilisateur : quelles leçons sont déjà
// complétées, quels scores ont été obtenus aux quiz, quelles actions et
// évaluations ont été confirmées, et quels jours il a été actif. Tout est
// stocké dans le localStorage du navigateur — pas de compte, pas de serveur.

const STORAGE_KEY = "ai-academy-progress";

// Nom de l'événement déclenché à chaque écriture de la progression, pour
// que plusieurs composants affichés en même temps (ex: le badge de
// progression et le bouton de validation) restent synchronisés sans
// attendre un rafraîchissement de la page.
const PROGRESS_EVENT = "ai-academy-progress-changed";

type Progress = {
  completedLessons: string[];
  // Dates ("AAAA-MM-JJ") où l'utilisateur a validé au moins une leçon.
  // Pas encore affiché dans l'interface : sert de base à une future
  // fonctionnalité de "série" de jours d'apprentissage (voir lib/streak.ts).
  activityDates: string[];
  // Meilleur score (0 à 100) obtenu à chaque bloc de quiz, par identifiant.
  quizScores: Record<string, number>;
  // Identifiants des blocs "action" confirmés.
  actionsDone: string[];
  // Identifiants des blocs "assessment" confirmés.
  assessmentsDone: string[];
};

const EMPTY_PROGRESS: Progress = {
  completedLessons: [],
  activityDates: [],
  quizScores: {},
  actionsDone: [],
  assessmentsDone: [],
};

// Vérifie qu'une valeur est bien un tableau de chaînes ; sinon, renvoie un
// tableau vide. Protège contre une donnée ancienne ou corrompue.
function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

// Vérifie qu'une valeur est bien un dictionnaire "identifiant -> nombre" ;
// sinon, renvoie un dictionnaire vide.
function asScoreRecord(value: unknown): Record<string, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  const result: Record<string, number> = {};
  for (const [key, score] of Object.entries(value)) {
    if (typeof score === "number" && Number.isFinite(score)) {
      result[key] = score;
    }
  }
  return result;
}

// Lit la progression enregistrée. Si rien n'a encore été enregistré (tout
// premier lancement), si le localStorage n'est pas disponible (rendu côté
// serveur, navigation privée...), ou si une version plus ancienne de l'app
// a écrit un format différent (voire invalide), on migre en douceur en
// complétant avec des valeurs par défaut : une donnée existante ou
// invalide ne bloque jamais l'application.
function readProgress(): Progress {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      completedLessons: asStringArray(parsed.completedLessons),
      activityDates: asStringArray(parsed.activityDates),
      quizScores: asScoreRecord(parsed.quizScores),
      actionsDone: asStringArray(parsed.actionsDone),
      assessmentsDone: asStringArray(parsed.assessmentsDone),
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeProgress(progress: Progress): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

// Permet à d'autres fichiers (lib/useProgress.ts) d'écouter les changements
// de progression sans connaître le détail du stockage.
export function subscribeToProgressChanges(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(PROGRESS_EVENT, callback);
  return () => window.removeEventListener(PROGRESS_EVENT, callback);
}

export function isLessonCompleted(lessonId: string): boolean {
  return readProgress().completedLessons.includes(lessonId);
}

// Renvoie l'ensemble des leçons complétées (pratique pour les écrans
// parcours/module, qui doivent connaître l'état de plusieurs leçons à la fois).
export function getCompletedLessons(): Set<string> {
  return new Set(readProgress().completedLessons);
}

// Renvoie les dates d'activité enregistrées (voir lib/streak.ts).
export function getActivityDates(): string[] {
  return readProgress().activityDates;
}

// Formate une date en clé "AAAA-MM-JJ", utilisée pour comparer des jours
// entre eux sans se soucier de l'heure.
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function recordActivityToday(progress: Progress): boolean {
  const today = toDateKey(new Date());
  if (progress.activityDates.includes(today)) return false;
  progress.activityDates.push(today);
  return true;
}

export function markLessonCompleted(lessonId: string): void {
  const progress = readProgress();
  let changed = false;

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    changed = true;
  }

  if (recordActivityToday(progress)) {
    changed = true;
  }

  if (changed) {
    writeProgress(progress);
  }
}

// Renvoie le meilleur score enregistré pour un bloc de quiz (0 si aucune tentative).
export function getQuizScore(blockId: string): number {
  return readProgress().quizScores[blockId] ?? 0;
}

export function getQuizScores(): Record<string, number> {
  return readProgress().quizScores;
}

// Enregistre le score d'une tentative de quiz, en ne gardant que le
// meilleur score obtenu (une nouvelle tentative moins bonne ne fait
// jamais reculer la progression déjà acquise).
export function recordQuizScore(blockId: string, percentage: number): void {
  const progress = readProgress();
  const previousBest = progress.quizScores[blockId] ?? 0;
  let changed = false;

  if (percentage > previousBest) {
    progress.quizScores[blockId] = percentage;
    changed = true;
  }

  if (recordActivityToday(progress)) {
    changed = true;
  }

  if (changed) {
    writeProgress(progress);
  }
}

export function getActionsDone(): Set<string> {
  return new Set(readProgress().actionsDone);
}

export function markActionDone(blockId: string): void {
  const progress = readProgress();
  let changed = false;

  if (!progress.actionsDone.includes(blockId)) {
    progress.actionsDone.push(blockId);
    changed = true;
  }
  if (recordActivityToday(progress)) {
    changed = true;
  }
  if (changed) {
    writeProgress(progress);
  }
}

export function getAssessmentsDone(): Set<string> {
  return new Set(readProgress().assessmentsDone);
}

export function markAssessmentDone(blockId: string): void {
  const progress = readProgress();
  let changed = false;

  if (!progress.assessmentsDone.includes(blockId)) {
    progress.assessmentsDone.push(blockId);
    changed = true;
  }
  if (recordActivityToday(progress)) {
    changed = true;
  }
  if (changed) {
    writeProgress(progress);
  }
}
