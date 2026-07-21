// Gère la progression de l'utilisateur : quelles leçons sont déjà
// complétées, et quels jours il a été actif. Tout est stocké dans le
// localStorage du navigateur — pas de compte, pas de serveur.

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
};

const EMPTY_PROGRESS: Progress = { completedLessons: [], activityDates: [] };

// Lit la progression enregistrée. Si rien n'a encore été enregistré (tout
// premier lancement), si le localStorage n'est pas disponible (rendu côté
// serveur, navigation privée...), ou si une version plus ancienne de l'app
// a écrit un format différent, on complète avec des valeurs par défaut.
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
      completedLessons: parsed.completedLessons ?? [],
      activityDates: parsed.activityDates ?? [],
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

export function markLessonCompleted(lessonId: string): void {
  const progress = readProgress();
  let changed = false;

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    changed = true;
  }

  const today = toDateKey(new Date());
  if (!progress.activityDates.includes(today)) {
    progress.activityDates.push(today);
    changed = true;
  }

  if (changed) {
    writeProgress(progress);
  }
}
