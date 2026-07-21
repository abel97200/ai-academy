"use client";

// QCM à plusieurs questions, enchaînées une par une. Pour chaque question :
// l'utilisateur choisit une option, valide, voit immédiatement si c'est
// juste ou faux, PUIS lit l'explication (dans tous les cas, pour comprendre
// le raisonnement). À la fin, un petit récap du score, et la possibilité
// de recommencer pour s'entraîner — sans perdre la réussite déjà acquise.

import { useState } from "react";
import { useLessonContext } from "@/components/lesson/LessonContext";
import type { QuizQuestion } from "@/lib/content";
import { QUIZ_PASS_THRESHOLD } from "@/lib/courseProgress";
import { recordQuizScore } from "@/lib/progress";

type QuizBlockProps = {
  id: string; // identifiant unique du bloc dans la leçon
  questions: QuizQuestion[];
};

export default function QuizBlock({ id, questions }: QuizBlockProps) {
  const { registerQuizPassed, isQuizPassed } = useLessonContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  // Le résultat de chaque question : null = pas encore répondue.
  const [results, setResults] = useState<(boolean | null)[]>(() =>
    questions.map(() => null)
  );
  const [finished, setFinished] = useState(false);

  const dejaReussi = isQuizPassed(id);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const requiredCorrect = Math.ceil((questions.length * QUIZ_PASS_THRESHOLD) / 100);
  const correctCount = results.filter((result) => result === true).length;
  const reponseCorrecte = answered && selection === currentQuestion.answer;

  function handleValider() {
    if (selection === null) return;
    setAnswered(true);
    const isCorrect = selection === currentQuestion.answer;
    setResults((previous) => {
      const next = [...previous];
      next[currentIndex] = isCorrect;
      return next;
    });
  }

  function handleSuivant() {
    if (isLastQuestion) {
      setFinished(true);
      // "correctCount" tient déjà compte de la réponse qu'on vient de
      // valider (le clic sur "Valider" a mis à jour "results" avant ce
      // second clic sur "Question suivante").
      const percentage = Math.round((correctCount / questions.length) * 100);
      // On enregistre le score dans le localStorage (le meilleur score est
      // conservé) : c'est ce qui permet au module de vérifier la condition
      // "au moins 75% au quiz", même après avoir quitté la leçon.
      recordQuizScore(id, percentage);
      if (percentage >= QUIZ_PASS_THRESHOLD) {
        registerQuizPassed(id);
      }
    } else {
      setCurrentIndex((index) => index + 1);
    }
    setSelection(null);
    setAnswered(false);
  }

  function handleRecommencer() {
    setCurrentIndex(0);
    setSelection(null);
    setAnswered(false);
    setResults(questions.map(() => null));
    setFinished(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          Quiz{dejaReussi && <span className="ml-2 text-success">✓ réussi</span>}
        </span>
        {!finished && (
          <span className="text-xs text-foreground/40">
            Question {currentIndex + 1}/{questions.length}
          </span>
        )}
      </div>

      {/* Petite frise qui montre l'avancée dans les questions, et le
          résultat de chacune une fois répondue. */}
      <div className="mt-3 flex gap-1.5">
        {results.map((result, index) => (
          <span
            key={index}
            className={
              "h-1.5 flex-1 rounded-full transition-colors duration-300 " +
              (result === true
                ? "bg-success"
                : result === false
                  ? "bg-rose-400"
                  : index === currentIndex && !finished
                    ? "bg-accent/60"
                    : "bg-white/10")
            }
          />
        ))}
      </div>

      {!finished ? (
        <>
          <p className="mt-4 text-base leading-relaxed text-foreground">
            {currentQuestion.question}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all duration-150 active:scale-[0.98] ${
                  selection === index
                    ? "border-accent bg-accent/[0.08]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name={`quiz-${id}-${currentIndex}`}
                  checked={selection === index}
                  disabled={answered}
                  onChange={() => setSelection(index)}
                />
                <span className="text-foreground/85">{option}</span>
              </label>
            ))}
          </div>

          {!answered ? (
            <button
              type="button"
              onClick={handleValider}
              disabled={selection === null}
              className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              Valider
            </button>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <div
                className={
                  reponseCorrecte
                    ? "rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm font-medium text-success"
                    : "rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-4 py-3 text-sm font-medium text-rose-300"
                }
              >
                {reponseCorrecte ? "Bonne réponse !" : "Ce n'est pas ça."}
              </div>

              {/* L'explication s'affiche toujours, juste ou faux, pour que
                  le raisonnement soit compris et pas seulement le résultat. */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-foreground/70">
                {currentQuestion.explanation}
              </div>

              <button
                type="button"
                onClick={handleSuivant}
                className="self-start rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
              >
                {isLastQuestion ? "Voir le résultat" : "Question suivante"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {correctCount}/{questions.length} bonnes réponses
          </p>
          {correctCount >= requiredCorrect ? (
            <p className="text-sm font-medium text-success">
              Quiz réussi, bien joué !
            </p>
          ) : (
            <p className="text-sm font-medium text-hint">
              Pas encore assez pour valider ({requiredCorrect}/{questions.length}{" "}
              requises) — retente le quiz.
            </p>
          )}
          <button
            type="button"
            onClick={handleRecommencer}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95"
          >
            Recommencer le quiz
          </button>
        </div>
      )}
    </div>
  );
}
