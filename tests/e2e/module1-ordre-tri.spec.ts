// Vérifie spécifiquement les deux blocs créés pour ce pilote :
// - "ordre" (remise en ordre par clics, leçon 1.2) : chemin correct, chemin
//   incorrect avec message adapté, "Annuler le dernier" et "Recommencer" ;
// - "tri" (leçon 1.3, 3 catégories) : un choix reste modifiable et change
//   de couleur/texte quand on se corrige.
// Vérifie aussi que "workflow" (leçon 1.3) fonctionne avec une donnée et un
// nombre d'étapes différents de la leçon 1.1 (généricité du composant).

import { test, expect } from "@playwright/test";
import { goToNextBlock, watchForErrors } from "./helpers";

test("leçon 1.2 : le bloc ordre distingue un mauvais et un bon classement, et se réinitialise", async ({
  page,
}) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-2");
  await goToNextBlock(page); // explication d'intro -> bloc "ordre"
  await expect(page.getByText("Remets ces 5 étapes dans l'ordre")).toBeVisible();

  // Chemin volontairement incorrect (ordre d'affichage brut).
  await page.getByRole("button", { name: /Le devis est rédigé/ }).click();
  await page.getByRole("button", { name: /Le devis est envoyé au client/ }).click();
  await page.getByRole("button", { name: /Le client envoie sa demande de devis/ }).click();
  await page.getByRole("button", { name: /Le prix est calculé selon les besoins/ }).click();
  await page.getByRole("button", { name: /Le commercial relève les besoins du client/ }).click();

  await page.getByRole("button", { name: "Vérifier l'ordre" }).click();
  await expect(page.getByText(/bien placés/)).toBeVisible();
  await expect(page.getByText("Exactement le bon ordre !")).not.toBeVisible();

  // On recommence, cette fois dans le bon ordre.
  await page.getByRole("button", { name: "Recommencer" }).click();
  await page.getByRole("button", { name: /Le client envoie sa demande de devis/ }).click();
  // "Annuler le dernier" doit retirer le tout dernier choix, sans toucher
  // aux précédents.
  await page.getByRole("button", { name: "← Annuler le dernier" }).click();
  await page.getByRole("button", { name: /Le client envoie sa demande de devis/ }).click();
  await page.getByRole("button", { name: /Le commercial relève les besoins du client/ }).click();
  await page.getByRole("button", { name: /Le prix est calculé selon les besoins/ }).click();
  await page.getByRole("button", { name: /Le devis est rédigé/ }).click();
  await page.getByRole("button", { name: /Le devis est envoyé au client/ }).click();

  await page.getByRole("button", { name: "Vérifier l'ordre" }).click();
  await expect(page.getByText("Exactement le bon ordre !")).toBeVisible();

  expect(errors).toEqual([]);
});

test("leçon 1.2 : le schéma tâche/processus/workflow est cliquable", async ({ page }) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-2");
  await goToNextBlock(page);
  await goToNextBlock(page);
  await goToNextBlock(page); // -> bloc schema (trio)
  await page.getByText("Workflow", { exact: true }).click();
  await expect(
    page.getByText("Ce même processus, décrit avec des étapes claires et reproductibles")
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("leçon 1.3 : le workflow (4 étapes, sens unique) et le tri à 3 catégories fonctionnent", async ({
  page,
}) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-3");

  // Situation d'ouverture (prédiction) : un simple clic suffit.
  await page
    .getByRole("button", { name: "Plusieurs applications vont se transmettre sa fiche, les unes après les autres." })
    .click();
  await goToNextBlock(page);

  // Workflow générique réutilisé avec des données différentes de la leçon 1.1
  // (4 étapes, un seul aller, pas de retour) : preuve que le composant se
  // généralise et n'est pas câblé en dur pour un seul scénario.
  await page.getByRole("button", { name: "Suivre la fiche client" }).click();
  await expect(
    page.getByText("La fiche du client vient de circuler à travers 3 applications")
  ).toBeVisible({ timeout: 10_000 });
  await goToNextBlock(page);

  // 3 situations consécutives (déclencheur / données / action) : chacune
  // reste indépendamment cliquable.
  await page.getByRole("button", { name: "Le formulaire rempli et envoyé par le visiteur" }).click();
  await goToNextBlock(page);
  await page
    .getByRole("button", { name: "La fiche du client : prénom, email, type de demande, budget" })
    .click();
  await goToNextBlock(page);
  await page
    .getByRole("button", { name: "Enregistrer la fiche, envoyer un email, ajouter une ligne" })
    .click();
  await goToNextBlock(page);

  await goToNextBlock(page); // explication -> bloc tri (3 catégories)
  await expect(page.getByText("Pour chaque élément de ce cas")).toBeVisible();

  // Un item classé d'abord dans la mauvaise catégorie, puis corrigé :
  // le bloc doit rester modifiable et changer de couleur/texte.
  const item = page.locator("div", { hasText: "Le formulaire envoyé par le visiteur" }).last();
  await item.getByRole("button", { name: "Action" }).click();
  await expect(page.getByText("Pas tout à fait —")).toBeVisible();
  await item.getByRole("button", { name: "Déclencheur" }).click();
  await expect(page.getByText("Bien vu —")).toBeVisible();

  expect(errors).toEqual([]);
});
