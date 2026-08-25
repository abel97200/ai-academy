// Vérifie que chaque écran du Module 1 se charge correctement (accueil,
// parcours, module, les 6 leçons), sans erreur console ni exception non
// interceptée. Tourne sur desktop ET mobile (voir playwright.config.ts).

import { test, expect } from "@playwright/test";
import { watchForErrors } from "./helpers";

const LESSONS: Array<{ id: string; title: string }> = [
  { id: "automatisation-lesson-1-1", title: "Une automatisation, c'est quoi ?" },
  { id: "automatisation-lesson-1-2", title: "Tâche, processus et workflow" },
  { id: "automatisation-lesson-1-3", title: "Déclencheur, action et données" },
  { id: "automatisation-lesson-1-4", title: "Automatisation, IA ou agent IA ?" },
  { id: "automatisation-lesson-1-5", title: "Tout ce qui peut être automatisé ne doit pas l'être" },
  { id: "automatisation-lesson-1-6", title: "Première enquête d'automatisation" },
];

test("l'accueil propose le parcours Automatiser de A à Z", async ({ page }) => {
  const { errors } = watchForErrors(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Automatiser de A à Z/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("l'écran parcours liste le Module 1 comme module en cours", async ({ page }) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation");
  await expect(page.getByRole("heading", { name: "Automatiser de A à Z" })).toBeVisible();
  await expect(page.getByText("Comprendre l'automatisation")).toBeVisible();
  expect(errors).toEqual([]);
});

test("l'écran module liste les 6 leçons du Module 1", async ({ page }) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1");
  await expect(
    page.getByRole("heading", { name: /Module 1 · Comprendre l'automatisation/ })
  ).toBeVisible();
  for (const lesson of LESSONS) {
    await expect(page.getByText(lesson.title, { exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const lesson of LESSONS) {
  test(`la leçon ${lesson.id} se charge sans erreur`, async ({ page }) => {
    const { errors } = watchForErrors(page);
    await page.goto(`/parcours/automatisation/module-1/${lesson.id}`);
    await expect(page.getByRole("heading", { name: lesson.title })).toBeVisible();
    // Un bloc et une navigation "Suivant" doivent toujours être visibles au
    // premier affichage d'une leçon en layout séquentiel.
    await expect(page.getByRole("button", { name: "Suivant →", exact: true })).toBeVisible();
    // Aucune page ne doit provoquer de débordement horizontal (lisibilité
    // mobile, cf. CONTENT-GUIDELINES : les workflows doivent défiler dans
    // leur propre conteneur, pas casser la mise en page globale).
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(hasHorizontalOverflow, `${lesson.id} déborde horizontalement`).toBe(false);
    expect(errors).toEqual([]);
  });
}
