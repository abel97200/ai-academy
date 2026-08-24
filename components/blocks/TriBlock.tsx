"use client";

// Un jeu de tri : classer chaque élément dans l'une de 2 à 4 catégories, en
// cliquant (pas de glisser-déposer, pour rester simple au clavier comme au
// tactile). Chaque item révèle son verdict et son explication au clic, et
// reste modifiable : se tromper n'a aucune conséquence, l'important est de
// comprendre pourquoi.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { TriCategory, TriItem } from "@/lib/content";

type TriBlockProps = {
  instruction: string;
  categories: TriCategory[];
  items: TriItem[];
};

type Answer = { categoryId: string; correct: boolean };

export default function TriBlock({ instruction, categories, items }: TriBlockProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  function handleChoose(item: TriItem, categoryId: string) {
    setAnswers((previous) => ({
      ...previous,
      [item.id]: { categoryId, correct: categoryId === item.correctCategoryId },
    }));
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;

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
