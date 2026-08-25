"use client";

// Un jeu de tri : classer chaque élément dans l'une de 2 à 4 catégories, en
// cliquant (pas de glisser-déposer, pour rester simple au clavier comme au
// tactile). Chaque item révèle son verdict et son explication au clic, et
// reste modifiable : se tromper n'a aucune conséquence, l'important est de
// comprendre pourquoi.
//
// Thème sombre par défaut (historique) ou thème "light-elearning" : cartes
// claires, catégories colorées (voir TriCategory.color) pour se relier
// visuellement à un schéma vu plus tôt dans la leçon.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import { RegisteredIllustration } from "@/components/illustrations/registry";
import type { LessonTheme, TriCategory, TriItem } from "@/lib/content";

type TriBlockProps = {
  instruction: string;
  categories: TriCategory[];
  items: TriItem[];
  illustration?: string;
  theme?: LessonTheme;
};

type Answer = { categoryId: string; correct: boolean };

const DEFAULT_COLOR = "#6366F1";

function withAlpha(hex: string, alpha: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex;
}

export default function TriBlock({
  instruction,
  categories,
  items,
  illustration,
  theme,
}: TriBlockProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  function handleChoose(item: TriItem, categoryId: string) {
    setAnswers((previous) => ({
      ...previous,
      [item.id]: { categoryId, correct: categoryId === item.correctCategoryId },
    }));
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;
  const light = theme === "light-elearning";

  if (light) {
    return (
      <div className="rounded-3xl border-2 border-indigo-100 bg-white p-6 shadow-[0_8px_30px_rgba(99,102,241,0.08)] sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          🗂️ Classement
        </span>

        {illustration && (
          <div className="mt-5">
            <RegisteredIllustration id={illustration} />
          </div>
        )}

        <p className="mt-4 text-base leading-relaxed text-slate-700">
          <InlineText text={instruction} />
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {items.map((item) => {
            const answer = answers[item.id];
            return (
              <div
                key={item.id}
                className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {item.emoji ? `${item.emoji} ` : ""}
                  <InlineText text={item.label} />
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const color = category.color ?? DEFAULT_COLOR;
                    const isChosen = answer?.categoryId === category.id;
                    const isCorrectChoice = isChosen && answer!.correct;
                    const isWrongChoice = isChosen && !answer!.correct;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleChoose(item, category.id)}
                        style={
                          isChosen && isCorrectChoice
                            ? { borderColor: color, backgroundColor: withAlpha(color, "22"), color }
                            : undefined
                        }
                        className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                          isCorrectChoice
                            ? ""
                            : isWrongChoice
                              ? "border-rose-300 bg-rose-50 text-rose-600"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                {answer && (
                  <div
                    key={answer.categoryId}
                    className={`schema-animate mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      answer.correct
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <span className="font-semibold">
                      {answer.correct ? "✅ Bien vu — " : "🧭 Pas tout à fait — "}
                    </span>
                    <InlineText text={item.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {answeredCount === items.length && (
          <p className="mt-4 text-sm font-semibold text-slate-600">
            {correctCount}/{items.length} bien classés.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Jeu de tri
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground">
        <InlineText text={instruction} />
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const answer = answers[item.id];
          return (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-foreground">
                {item.emoji ? `${item.emoji} ` : ""}
                <InlineText text={item.label} />
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isChosen = answer?.categoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleChoose(item, category.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
                        isChosen
                          ? answer!.correct
                            ? "border-success bg-success/10 text-success"
                            : "border-rose-400 bg-rose-500/10 text-rose-300"
                          : "border-white/15 text-foreground/70 hover:border-white/30"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              {answer && (
                <div
                  key={answer.categoryId}
                  className={`schema-animate mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    answer.correct ? "bg-success/[0.08] text-success" : "bg-rose-500/[0.08] text-rose-300"
                  }`}
                >
                  {answer.correct ? "Bien vu — " : "Pas tout à fait — "}
                  <span className="text-foreground/70">
                    <InlineText text={item.explanation} />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {answeredCount === items.length && (
        <p className="mt-4 text-sm font-medium text-foreground/70">
          {correctCount}/{items.length} bien classés.
        </p>
      )}
    </div>
  );
}
