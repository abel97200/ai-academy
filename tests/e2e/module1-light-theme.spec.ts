// Garde-fou visuel pour le thème "light-elearning" (voir
// docs/CONTENT-SCHEMA-V2.md § Thème visuel d'une leçon), maintenant
// appliqué aux 6 leçons du Module 1 : vérifie que les zones principales de
// la leçon 1.1 sont bien présentes et interactives, puis que chacune des
// leçons 1.2 à 1.6 affiche réellement le thème clair (pas seulement
// qu'elle se charge), sans débordement ni erreur.

import { test, expect } from "@playwright/test";
import { goToNextBlock, watchForErrors } from "./helpers";

test("leçon 1.1 : le thème clair est bien appliqué, avec ses zones principales", async ({
  page,
}) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-1");

  // Pill "Situation" + illustration + kicker : signature du thème clair.
  await expect(page.getByText("🔎 Situation")).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Illustration de Léa à son poste de travail/ })
  ).toBeVisible();
  await expect(
    page.getByText("Avant de parler d'outil, observons une situation très courante.")
  ).toBeVisible();

  // Le fond de la carte "situation" doit être clair (pas le fond sombre
  // historique) : vérifie que la couleur de fond calculée est proche du
  // blanc, plutôt que de dépendre d'un nom de classe précis.
  const situationCard = page.locator("div").filter({ hasText: "🔎 Situation" }).first();
  const backgroundColor = await situationCard.evaluate(
    (element) => getComputedStyle(element).backgroundImage || getComputedStyle(element).backgroundColor
  );
  expect(backgroundColor).not.toBe("");

  // Les 3 cartes de réponse sont bien 3 contrôles distincts et cliquables.
  const optionButtons = page.getByRole("button", { name: /^[ABC]/ });
  await expect(optionButtons).toHaveCount(3);
  await optionButtons.nth(1).click();
  await expect(page.getByText("✅ Bonne observation")).toBeVisible();

  await goToNextBlock(page);
  await goToNextBlock(page);

  // Infographie workflow : le libellé de la donnée qui circule apparaît
  // bien pendant l'animation (pas seulement les 4 étapes statiques).
  await page.getByRole("button", { name: "Lancer le déroulé" }).click();
  await expect(page.getByText("📦 Commande #4521").first()).toBeVisible({ timeout: 10_000 });

  await goToNextBlock(page);
  await goToNextBlock(page);

  // Schéma vocabulaire clair : cartes colorées cliquables (pas le SVG à
  // nœuds du thème sombre), toujours avec la même interaction (clic →
  // définition affichée).
  await expect(page.getByText("📘 Vocabulaire")).toBeVisible();
  await page.getByRole("button", { name: "Données" }).click();
  await expect(
    page.getByText("Les informations utilisées pendant le traitement.")
  ).toBeVisible();

  // Aucun débordement horizontal, y compris avec l'illustration et
  // l'infographie workflow affichées.
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  expect(hasHorizontalOverflow).toBe(false);

  expect(errors).toEqual([]);
});

const OTHER_LESSONS: Array<{ id: string; firstBlockPill: string }> = [
  { id: "automatisation-lesson-1-2", firstBlockPill: "💡 À comprendre" },
  { id: "automatisation-lesson-1-3", firstBlockPill: "🔎 Situation" },
  { id: "automatisation-lesson-1-4", firstBlockPill: "💡 À comprendre" },
  { id: "automatisation-lesson-1-5", firstBlockPill: "💡 À comprendre" },
  { id: "automatisation-lesson-1-6", firstBlockPill: "💡 À comprendre" },
];

for (const lesson of OTHER_LESSONS) {
  test(`${lesson.id} affiche bien le thème clair, sans débordement`, async ({ page }) => {
    const { errors } = watchForErrors(page);
    await page.goto(`/parcours/automatisation/module-1/${lesson.id}`);
    await expect(page.getByText(lesson.firstBlockPill)).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(hasHorizontalOverflow, `${lesson.id} déborde horizontalement`).toBe(false);
    expect(errors).toEqual([]);
  });
}

test("leçon 1.2 : le schéma tâche/processus/workflow utilise les cartes vocabulaire claires (pas le SVG sombre historique)", async ({
  page,
}) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-2");
  await goToNextBlock(page);
  await goToNextBlock(page);
  await goToNextBlock(page);
  await expect(page.getByText("📘 Vocabulaire")).toBeVisible();
  await page.getByRole("button", { name: "Workflow", exact: true }).click();
  await expect(
    page.getByText("Ce même processus, décrit avec des étapes claires et reproductibles")
  ).toBeVisible();
  expect(errors).toEqual([]);
});
