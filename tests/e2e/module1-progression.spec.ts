// Parcours complet : les 6 leçons du Module 1 sont terminées (quiz réussis,
// puis action + évaluation finale de la leçon 1.6), le module se valide
// réellement dans l'écran module, et la progression survit à un
// rechargement de page (localStorage). Lourd : desktop uniquement.

import { test, expect } from "@playwright/test";
import {
  advanceUntilVisible,
  answerQuiz,
  completeAction,
  completeAssessment,
  watchForErrors,
} from "./helpers";

const QUIZ_ANSWERS: Record<string, number[]> = {
  "automatisation-lesson-1-1": [0, 1, 2, 0, 1],
  "automatisation-lesson-1-2": [2, 0, 1, 2, 0],
  "automatisation-lesson-1-3": [1, 2, 0, 1, 2],
  "automatisation-lesson-1-4": [2, 1, 0, 1, 2],
  "automatisation-lesson-1-5": [0, 2, 1, 2, 0],
  "automatisation-lesson-1-6": [1, 2, 0, 1, 2],
};

test("le Module 1 se valide complètement après les 6 leçons, et la progression persiste", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "parcours complet vérifié une seule fois, côté desktop");
  const { errors } = watchForErrors(page);

  for (const [lessonId, answers] of Object.entries(QUIZ_ANSWERS)) {
    await page.goto(`/parcours/automatisation/module-1/${lessonId}`);
    await advanceUntilVisible(page, "Question 1/5");
    await answerQuiz(page, answers);
    await expect(page.getByText("✓ Complétée")).toBeVisible();

    if (lessonId === "automatisation-lesson-1-6") {
      // La validation du MODULE exige en plus l'action et l'évaluation
      // finale (voir tests/automatisationModule1.test.ts) : on les remplit
      // ici pour de vrai, dans le navigateur. Le bloc quiz reste affiché
      // (état "terminé") tant qu'on n'a pas cliqué "Suivant →" : on avance
      // jusqu'au bloc action, puis jusqu'au bloc évaluation.
      await advanceUntilVisible(page, "Analyse un nouveau cas avec tes propres mots");
      await completeAction(
        page,
        "Ce qui se répète : répondre aux mêmes questions de livraison par chat. Automatisable : une réponse automatique avec le délai standard. À garder humain : le remboursement important, qui exige un jugement au cas par cas. Déclencheur : réception d'une question client sur le délai. Données : la question posée et le délai de livraison actuel. Action : renvoyer automatiquement le délai standard. Résultat : le client est informé sans attendre une réponse humaine."
      );
      await advanceUntilVisible(page, "Évaluation finale du Module 1");
      await completeAssessment(page);
    }
  }

  await page.goto("/parcours/automatisation/module-1");
  await expect(page.getByText("✓ Module validé")).toBeVisible();

  // La progression est en localStorage : un rechargement de la première
  // leçon doit toujours l'afficher comme complétée.
  await page.goto("/parcours/automatisation/module-1/automatisation-lesson-1-1");
  await expect(page.getByText("✓ Complétée")).toBeVisible();

  expect(errors).toEqual([]);
});
