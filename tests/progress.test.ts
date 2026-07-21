// Tests de lib/progress.ts : lecture/écriture normale, et surtout la
// "migration" défensive — une donnée ancienne (v1, sans les nouveaux
// champs) ou corrompue ne doit jamais faire planter l'application.
//
// lib/progress.ts n'accède au localStorage que via "window", qu'on
// simule ici avec un petit faux objet en mémoire (pas besoin de jsdom
// pour un stockage clé/valeur aussi simple).

import { beforeEach, describe, expect, it, vi } from "vitest";

function installFakeWindow() {
  const store = new Map<string, string>();
  const fakeWindow = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
  vi.stubGlobal("window", fakeWindow);
  return fakeWindow;
}

describe("lib/progress", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("enregistre une leçon complétée et la retrouve", async () => {
    installFakeWindow();
    const { markLessonCompleted, isLessonCompleted } = await import("@/lib/progress");

    expect(isLessonCompleted("lesson-1-1")).toBe(false);
    markLessonCompleted("lesson-1-1");
    expect(isLessonCompleted("lesson-1-1")).toBe(true);
  });

  it("ne garde que le meilleur score d'un quiz", async () => {
    installFakeWindow();
    const { recordQuizScore, getQuizScore } = await import("@/lib/progress");

    recordQuizScore("bloc-quiz", 50);
    expect(getQuizScore("bloc-quiz")).toBe(50);

    recordQuizScore("bloc-quiz", 30); // moins bon : ne doit pas remplacer 50
    expect(getQuizScore("bloc-quiz")).toBe(50);

    recordQuizScore("bloc-quiz", 100); // meilleur : remplace
    expect(getQuizScore("bloc-quiz")).toBe(100);
  });

  it("enregistre les actions et évaluations confirmées", async () => {
    installFakeWindow();
    const { markActionDone, getActionsDone, markAssessmentDone, getAssessmentsDone } =
      await import("@/lib/progress");

    markActionDone("action-1");
    markAssessmentDone("assessment-1");

    expect(getActionsDone().has("action-1")).toBe(true);
    expect(getAssessmentsDone().has("assessment-1")).toBe(true);
  });

  it("migre une donnée v1 (sans les nouveaux champs) sans planter", async () => {
    const fakeWindow = installFakeWindow();
    // Ancien format, écrit par une version précédente de l'app : seulement
    // "completedLessons" et "activityDates", aucun des nouveaux champs.
    fakeWindow.localStorage.setItem(
      "ai-academy-progress",
      JSON.stringify({ completedLessons: ["lesson-1-1"], activityDates: ["2026-01-01"] })
    );

    const { isLessonCompleted, getQuizScores, getActionsDone, getAssessmentsDone } =
      await import("@/lib/progress");

    expect(isLessonCompleted("lesson-1-1")).toBe(true);
    expect(getQuizScores()).toEqual({});
    expect(getActionsDone().size).toBe(0);
    expect(getAssessmentsDone().size).toBe(0);
  });

  it("retombe sur une progression vide si le JSON stocké est invalide", async () => {
    const fakeWindow = installFakeWindow();
    fakeWindow.localStorage.setItem("ai-academy-progress", "{ceci n'est pas du JSON");

    const { getCompletedLessons, getQuizScores } = await import("@/lib/progress");

    expect(getCompletedLessons().size).toBe(0);
    expect(getQuizScores()).toEqual({});
  });

  it("ignore les champs de mauvais type plutôt que de planter", async () => {
    const fakeWindow = installFakeWindow();
    fakeWindow.localStorage.setItem(
      "ai-academy-progress",
      JSON.stringify({
        completedLessons: "pas-un-tableau",
        quizScores: ["pas-un-objet"],
        actionsDone: [1, 2, "ok"],
      })
    );

    const { getCompletedLessons, getQuizScores, getActionsDone } = await import(
      "@/lib/progress"
    );

    expect(getCompletedLessons().size).toBe(0);
    expect(getQuizScores()).toEqual({});
    // Seule la valeur "ok" (une vraie chaîne) doit survivre au filtrage.
    expect(Array.from(getActionsDone())).toEqual(["ok"]);
  });

  it("fonctionne sans planter quand window n'existe pas (rendu serveur)", async () => {
    vi.stubGlobal("window", undefined);
    const { getCompletedLessons, isLessonCompleted } = await import("@/lib/progress");

    expect(getCompletedLessons().size).toBe(0);
    expect(isLessonCompleted("quoi-que-ce-soit")).toBe(false);
  });
});
