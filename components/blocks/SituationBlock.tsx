"use client";

// Une situation de départ (un problème concret), suivie d'une question à
// choix. Contrairement à un quiz, il n'y a pas de bonne/mauvaise réponse
// imposée : chaque option a son propre retour, affiché immédiatement au
// clic, et l'apprenant peut en essayer plusieurs avant de continuer. Sert
// à faire émerger une intuition avant toute définition.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { SituationOption } from "@/lib/content";

type SituationBlockProps = {
  context: string;
  question: string;
  options: SituationOption[];
};

export default function SituationBlock({
  context,
  question,
  options,
}: SituationBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Situation
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground/80">
        <InlineText text={context} />
      </p>
      <p className="mt-4 text-base font-medium text-foreground">
        <InlineText text={question} />
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                isSelected
                  ? "border-accent bg-accent/[0.08] text-foreground"
                  : "border-white/10 text-foreground/85 hover:border-white/20"
              }`}
            >
              <InlineText text={option.label} />
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <div
          key={selectedIndex}
          className="schema-animate mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          <InlineText text={options[selectedIndex].feedback} />
        </div>
      )}
    </div>
  );
}
