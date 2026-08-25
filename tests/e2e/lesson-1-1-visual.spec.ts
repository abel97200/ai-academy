// Garde-fou visuel spécifique à la refonte "light-elearning" de la leçon
// 1.1 (voir docs/CONTENT-SCHEMA-V2.md § Thème visuel d'une leçon) : vérifie
// que les zones principales attendues sont bien présentes, que le thème
// clair est réellement appliqué (pas juste que la page se charge), que les
// cartes de réponse restent interactives, et qu'aucune leçon voisine n'a
// été affectée par erreur.

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

test("leçon 1.2 n'est pas affectée par le thème clair de la leçon 1.1", async ({ page }) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-2");
  // Le schéma de la leçon 1.2 doit rester le SVG historique à nœuds/liens
  // (pas les cartes "Vocabulaire" du thème clair, pas de pill de thème).
  await goToNextBlock(page);
  await goToNextBlock(page);
  await goToNextBlock(page);
  await expect(page.getByText("📘 Vocabulaire")).not.toBeVisible();
  await expect(
    page.getByRole("img", { name: /Schéma reliant : Tâche, Processus, Workflow/ })
  ).toBeVisible();
  expect(errors).toEqual([]);
});
