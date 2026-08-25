"use client";

// Affiche une question d'exercice, avec :
// - des indices qui se révèlent un par un (bouton "Voir un indice") ;
// - une vraie zone de réponse (un champ de texte) : l'utilisateur doit
//   écrire sa tentative avant de pouvoir voir la correction, pour qu'il
//   réfléchisse vraiment avant de regarder la solution.
//
// Thème sombre par défaut (historique) ou thème "light-elearning"
// (encadré clair, indices ambrés, correction verte).

import { useRef, useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { LessonTheme } from "@/lib/content";

type ExerciceBlockProps = {
  question: string;
  hints: string[];
  solution: string;
  theme?: LessonTheme;
};

export default function ExerciceBlock({
  question,
  hints,
  solution,
  theme,
}: ExerciceBlockProps) {
  const [nombreIndicesVisibles, setNombreIndicesVisibles] = useState(0);
  const [zoneReponseOuverte, setZoneReponseOuverte] = useState(false);
  const [reponse, setReponse] = useState("");
  const [solutionVisible, setSolutionVisible] = useState(false);
  const zoneReponseRef = useRef<HTMLTextAreaElement>(null);

  const encoreDesIndices = nombreIndicesVisibles < hints.length;
  const aEcritUneTentative = reponse.trim().length > 0;

  function ouvrirZoneReponse() {
    setZoneReponseOuverte(true);
    // On donne directement le focus au champ de réponse qui vient d'apparaître.
    requestAnimationFrame(() => zoneReponseRef.current?.focus());
  }

  const light = theme === "light-elearning";

  return (
    <div
      className={
        light
          ? "rounded-3xl border-2 border-violet-100 bg-white p-6 shadow-[0_8px_30px_rgba(124,58,237,0.08)] sm:p-8"
          : "rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      }
    >
      <span
        className={
          light
            ? "inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            : "text-xs font-medium uppercase tracking-wide text-foreground/40"
        }
      >
        {light ? "✏️ Exercice" : "Exercice"}
      </span>
      <p
        className={
          light
            ? "mt-3 text-base leading-relaxed text-slate-800"
            : "mt-2 text-base leading-relaxed text-foreground"
        }
      >
        <InlineText text={question} />
      </p>

      {/* Indices déjà révélés */}
      {nombreIndicesVisibles > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {hints.slice(0, nombreIndicesVisibles).map((hint, index) => (
            <li
              key={index}
              className={
                light
                  ? "rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
                  : "rounded-xl border border-hint/30 bg-hint/[0.08] px-4 py-2 text-sm text-foreground/80"
              }
            >
              <InlineText text={hint} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {encoreDesIndices && (
          <button
            type="button"
            onClick={() => setNombreIndicesVisibles((n) => n + 1)}
            className={
              light
                ? "rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 transition-all duration-150 hover:bg-amber-300 active:scale-95"
                : "rounded-full bg-hint px-4 py-2 text-sm font-medium text-black transition-all duration-150 hover:opacity-90 active:scale-95"
            }
          >
            Voir un indice
          </button>
        )}

        {!zoneReponseOuverte && (
          <button
            type="button"
            onClick={ouvrirZoneReponse}
            className={
              light
                ? "rounded-full border-2 border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 transition-all duration-150 hover:border-violet-300 hover:bg-violet-50 active:scale-95"
                : "rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95"
            }
          >
            Je tente ma réponse
          </button>
        )}
      </div>

      {/* Zone de réponse : n'apparaît qu'après avoir cliqué sur le bouton ci-dessus. */}
      {zoneReponseOuverte && (
        <div className="mt-4 flex flex-col items-start gap-3">
          <textarea
            ref={zoneReponseRef}
            value={reponse}
            onChange={(event) => setReponse(event.target.value)}
            placeholder="Écris ta réponse ici…"
            rows={3}
            className={
              light
                ? "w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors duration-150 focus:border-violet-400 focus:outline-none"
                : "w-full rounded-xl border border-white/15 bg-black/20 p-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors duration-150 focus:border-accent focus:outline-none"
            }
          />

          {!solutionVisible && (
            <button
              type="button"
              onClick={() => setSolutionVisible(true)}
              disabled={!aEcritUneTentative}
              className={
                light
                  ? "rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                  : "rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
              }
            >
              Voir la correction
            </button>
          )}
        </div>
      )}

      {solutionVisible && (
        <div
          className={
            light
              ? "mt-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "mt-4 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm text-foreground/90"
          }
        >
          <InlineText text={solution} />
        </div>
      )}
    </div>
  );
}
