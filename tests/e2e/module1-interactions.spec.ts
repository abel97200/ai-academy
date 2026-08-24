// Parcours détaillé de la leçon 1.1, qui utilise presque tous les types de
// blocs du Module 1 (situation, explication, workflow, schema, exercice,
// quiz, resume, validation) : vérifie que chaque interaction annoncée est
// réellement utilisable, avec un retour visible après action — pas
// seulement que la page s'affiche. Tourne sur desktop ET mobile.

import { test, expect } from "@playwright/test";
import { answerQuiz, goToNextBlock, watchForErrors } from "./helpers";

test("leçon 1.1 : chaque bloc réagit réellement à l'interaction, jusqu'à la validation", async ({
  page,
}) => {
  const { errors } = watchForErrors(page);
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-1");

  // 1) Situation : cliquer une option affiche un retour (feedback), pas
  //    juste une question sans moyen d'y répondre.
  await page
    .getByRole("button", {
      name: "Elle répète presque exactement la même suite d'actions, encore et encore.",
    })
    .click();
  await expect(
    page.getByText("C'est ce genre de répétition, identique ou presque à chaque fois")
  ).toBeVisible();
  await goToNextBlock(page);

  // 2) Explication : simple lecture, on avance.
  await expect(page.getByText("Une tâche répétitive, c'est une suite d'actions")).toBeVisible();
  await goToNextBlock(page);

  // 3) Workflow : chaque étape est explorable au clic, ET le bouton "Lancer"
  //    anime tout le trajet jusqu'à un message de fin.
  await page.getByRole("button", { name: /Statut vérifié/ }).click();
  await expect(page.getByText("Elle trouve la ligne correspondante")).toBeVisible();

  await page.getByRole("button", { name: "Lancer le déroulé" }).click();
  await expect(
    page.getByText("Léa vient de refaire, à l'identique, ce qu'elle fait des dizaines de fois par jour.")
  ).toBeVisible({ timeout: 10_000 });
  await goToNextBlock(page);

  // 4) Explication (vocabulaire) : on avance.
  await expect(page.getByText("un DÉCLENCHEUR démarre le tout")).toBeVisible();
  await goToNextBlock(page);

  // 5) Schema : cliquer un nœud affiche sa définition.
  await page.getByText("Résultat", { exact: true }).click();
  await expect(page.getByText("Ce qu'on obtient à la fin. Ici : le client reçoit sa réponse.")).toBeVisible();
  await goToNextBlock(page);

  // 6) Exercice : la correction n'est accessible qu'après avoir écrit une
  //    tentative (pas un bouton "Voir le résultat" gratuit).
  const solutionButton = page.getByRole("button", { name: "Voir la correction" });
  await page.getByRole("button", { name: "Je tente ma réponse" }).click();
  await expect(solutionButton).toBeDisabled();
  await page.getByPlaceholder("Écris ta réponse ici…").fill("Le formulaire rempli déclenche tout.");
  await expect(solutionButton).toBeEnabled();
  await solutionButton.click();
  await expect(page.getByText("Déclencheur : le formulaire rempli par le client.")).toBeVisible();
  await goToNextBlock(page);

  // 7) Quiz : 5 questions, réponses correctes réparties (voir
  //    tests/automatisationModule1.test.ts pour la vérification statique).
  await answerQuiz(page, [0, 1, 2, 0, 1]);
  await expect(page.getByText("5/5 bonnes réponses")).toBeVisible();
  await expect(page.getByText("Quiz réussi, bien joué !")).toBeVisible();

  // La leçon se valide AUTOMATIQUEMENT dès que le quiz est réussi (pas de
  // bouton "Terminer" à cliquer) : le badge apparaît dans l'en-tête.
  await expect(page.getByText("✓ Complétée")).toBeVisible();

  await goToNextBlock(page); // resume
  await expect(page.getByText("En une phrase")).toBeVisible();
  await goToNextBlock(page); // validation
  await expect(page.getByText("Bravo, leçon validée !")).toBeVisible();

  expect(errors).toEqual([]);
});
