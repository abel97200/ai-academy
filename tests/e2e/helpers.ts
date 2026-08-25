// Petits utilitaires partagés par les tests navigateur (Playwright) du
// Module 1 "Automatiser de A à Z". Chaque helper correspond à une
// interaction réelle décrite dans docs/CONTENT-GUIDELINES.md (choix
// cliquable, remise en ordre par clics, workflow animé...).

import { expect, type Page } from "@playwright/test";

// Installe un espion sur la console et les erreurs non interceptées de la
// page, pour pouvoir vérifier en fin de test qu'aucune erreur n'est
// apparue pendant la navigation ou les interactions.
export function watchForErrors(page: Page): { errors: string[] } {
  const state = { errors: [] as string[] };
  page.on("console", (message) => {
    if (message.type() === "error") {
      state.errors.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    state.errors.push(`pageerror: ${error.message}`);
  });
  return state;
}

// Répond à un bloc "quiz" avec les index de réponse donnés (dans l'ordre
// des 5 questions), en validant puis en passant à la question suivante à
// chaque fois. Suppose que le bloc quiz est déjà visible à l'écran.
export async function answerQuiz(page: Page, answers: number[]): Promise<void> {
  for (let i = 0; i < answers.length; i += 1) {
    const radios = page.locator('input[type="radio"]');
    await expect(radios.first()).toBeVisible();
    await radios.nth(answers[i]).check();
    await page.getByRole("button", { name: "Valider" }).click();

    const isLast = i === answers.length - 1;
    const nextButtonName = isLast ? "Voir le résultat" : "Question suivante";
    await page.getByRole("button", { name: nextButtonName }).click();
  }
}

// Clique le bouton "Suivant →" de navigation entre blocs (LessonSequence).
// Nom exact pour ne jamais confondre avec "Question suivante" (interne au
// quiz) ou "Leçon suivante →" (navigation entre leçons, dans le pied de page).
export async function goToNextBlock(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Suivant →", exact: true }).click();
}

// Avance bloc par bloc jusqu'à ce que le texte donné soit visible à
// l'écran (par exemple l'étiquette d'un type de bloc), sans interagir
// avec les blocs traversés. Utile pour les parcours "golden path" qui ne
// testent en détail qu'un sous-ensemble des blocs d'une leçon.
export async function advanceUntilVisible(
  page: Page,
  text: string,
  maxSteps = 15
): Promise<void> {
  for (let step = 0; step < maxSteps; step += 1) {
    if (await page.getByText(text).first().isVisible().catch(() => false)) {
      return;
    }
    await goToNextBlock(page);
  }
  await expect(page.getByText(text).first()).toBeVisible();
}

// Remplit et confirme un bloc "action" (zone de texte libre + bouton de
// confirmation), déjà visible à l'écran.
export async function completeAction(page: Page, evidenceText: string): Promise<void> {
  await page.getByPlaceholder(/./).last().fill(evidenceText);
  await page.getByRole("button", { name: "Confirmer l'action" }).click();
}

// Coche toutes les exigences d'un bloc "assessment" puis confirme,
// déjà visible à l'écran.
export async function completeAssessment(page: Page): Promise<void> {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i += 1) {
    await checkboxes.nth(i).check();
  }
  await page.getByRole("button", { name: "Confirmer l'évaluation" }).click();
}
