"use client";

// Exercice de remise en ordre : l'apprenant clique les éléments dans
// l'ordre qu'il pense correct (jamais de glisser-déposer, pour rester
// utilisable au clavier comme au tactile). Chaque clic ajoute l'élément à
// la fin de sa séquence ; "Annuler le dernier" retire uniquement le
// dernier choisi. Une fois tous les éléments placés, "Vérifier l'ordre"
// compare la séquence à l'ordre attendu et colore chaque position.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { OrdreItem } from "@/lib/content";

type OrdreBlockProps = {
  instruction: string;
  items: OrdreItem[];
  correctOrder: string[];
};

export default function OrdreBlock({ instruction, items, correctOrder }: OrdreBlockProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const itemsById = new Map(items.map((item) => [item.id, item]));
  const remaining = items.filter((item) => !sequence.includes(item.id));
  const isComplete = sequence.length === items.length;
  const correctCount = sequence.filter((id, index) => id === correctOrder[index]).length;
  const allCorrect = checked && correctCount === items.length;

  function handleChoose(itemId: string) {
    if (checked || sequence.includes(itemId)) return;
    setSequence((previous) => [...previous, itemId]);
  }

  function handleUndo() {
    setChecked(false);
    setSequence((previous) => previous.slice(0, -1));
  }

  function handleReset() {
    setChecked(false);
    setSequence([]);
  }

  function handleVerifier() {
    setChecked(true);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Remettre dans l&apos;ordre
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground">
        <InlineText text={instruction} />
      </p>

      {/* Ta séquence en cours de construction */}
      <div className="mt-4 flex flex-col gap-2">
        {sequence.length === 0 && (
          <p className="text-sm text-foreground/40">
            Clique les étapes ci-dessous, dans l&apos;ordre où tu penses qu&apos;elles se déroulent.
          </p>
        )}
        {sequence.map((itemId, index) => {
          const item = itemsById.get(itemId)!;
          const isRight = checked && itemId === correctOrder[index];
          const isWrong = checked && itemId !== correctOrder[index];
          return (
            <div
              key={itemId}
              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors duration-150 ${
                isRight
                  ? "border-success bg-success/[0.08] text-success"
                  : isWrong
                    ? "border-rose-400 bg-rose-500/[0.08] text-rose-300"
                    : "border-accent/40 bg-accent/[0.06] text-foreground"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                {index + 1}
              </span>
              <span>
                {item.emoji ? `${item.emoji} ` : ""}
                <InlineText text={item.label} />
              </span>
              {isRight && <span className="ml-auto">✓</span>}
              {isWrong && <span className="ml-auto">✗</span>}
            </div>
          );
        })}
      </div>

      {/* Éléments encore disponibles */}
      {remaining.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChoose(item.id)}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-left text-sm text-foreground/85 transition-all duration-150 hover:border-white/30 active:scale-[0.98]"
            >
              {item.emoji ? `${item.emoji} ` : ""}
              <InlineText text={item.label} />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {sequence.length > 0 && !checked && (
          <button
            type="button"
            onClick={handleUndo}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95"
          >
            ← Annuler le dernier
          </button>
        )}
        {isComplete && !checked && (
          <button
            type="button"
            onClick={handleVerifier}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
          >
            Vérifier l&apos;ordre
          </button>
        )}
        {checked && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95"
          >
            Recommencer
          </button>
        )}
      </div>

      {checked && (
        <div
          className={`schema-animate mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            allCorrect
              ? "border-success/30 bg-success/[0.08] text-success"
              : "border-hint/30 bg-hint/[0.08] text-hint"
          }`}
        >
          {allCorrect
            ? "Exactement le bon ordre !"
            : `${correctCount}/${items.length} bien placés — regarde les ✗ et recommence.`}
        </div>
      )}
    </div>
  );
}
