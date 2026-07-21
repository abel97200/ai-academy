"use client";

// Un mini-projet : un brief, une liste de livrables à cocher (suivi local,
// pour s'organiser — pas encore une condition de validation du module),
// des critères de réussite, et des indices révélables un par un.

import { useState } from "react";

type ProjectBlockProps = {
  title: string;
  brief: string;
  deliverables: string[];
  successCriteria: string[];
  hints?: string[];
};

export default function ProjectBlock({
  title,
  brief,
  deliverables,
  successCriteria,
  hints = [],
}: ProjectBlockProps) {
  const [checkedDeliverables, setCheckedDeliverables] = useState<boolean[]>(() =>
    deliverables.map(() => false)
  );
  const [nombreIndicesVisibles, setNombreIndicesVisibles] = useState(0);

  const encoreDesIndices = nombreIndicesVisibles < hints.length;

  function toggleDeliverable(index: number) {
    setCheckedDeliverables((previous) =>
      previous.map((value, i) => (i === index ? !value : value))
    );
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
      <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
        Projet
      </span>
      <p className="mt-3 text-base font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{brief}</p>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          Livrables
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {deliverables.map((deliverable, index) => (
            <li key={index}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm transition-all duration-150 hover:border-white/20 active:scale-[0.99]">
                <input
                  type="checkbox"
                  checked={checkedDeliverables[index]}
                  onChange={() => toggleDeliverable(index)}
                  className="mt-0.5"
                />
                <span
                  className={
                    checkedDeliverables[index]
                      ? "text-foreground/50 line-through"
                      : "text-foreground/85"
                  }
                >
                  {deliverable}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          Critères de réussite
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {successCriteria.map((criterion, index) => (
            <li key={index} className="text-sm text-foreground/70">
              • {criterion}
            </li>
          ))}
        </ul>
      </div>

      {hints.length > 0 && (
        <div className="mt-4">
          {nombreIndicesVisibles > 0 && (
            <ul className="mb-3 flex flex-col gap-2">
              {hints.slice(0, nombreIndicesVisibles).map((hint, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-hint/30 bg-hint/[0.08] px-4 py-2 text-sm text-foreground/80"
                >
                  {hint}
                </li>
              ))}
            </ul>
          )}
          {encoreDesIndices && (
            <button
              type="button"
              onClick={() => setNombreIndicesVisibles((n) => n + 1)}
              className="rounded-full bg-hint px-4 py-2 text-sm font-medium text-black transition-all duration-150 hover:opacity-90 active:scale-95"
            >
              Voir un indice
            </button>
          )}
        </div>
      )}
    </div>
  );
}
