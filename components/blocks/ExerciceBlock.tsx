"use client";

// Affiche une question d'exercice, avec :
// - des indices qui se révèlent un par un (bouton "Voir un indice", ambre) ;
// - une vraie zone de réponse (un champ de texte) : l'utilisateur doit
//   écrire sa tentative avant de pouvoir voir la correction, pour qu'il
//   réfléchisse vraiment avant de regarder la solution.

import { useRef, useState } from "react";

type ExerciceBlockProps = {
  question: string;
  hints: string[];
  solution: string;
};

export default function ExerciceBlock({
  question,
  hints,
  solution,
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

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Exercice
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground">
        {question}
      </p>

      {/* Indices déjà révélés */}
      {nombreIndicesVisibles > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
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

      <div className="mt-4 flex flex-wrap gap-3">
        {encoreDesIndices && (
          <button
            type="button"
            onClick={() => setNombreIndicesVisibles((n) => n + 1)}
            className="rounded-full bg-hint px-4 py-2 text-sm font-medium text-black transition-all duration-150 hover:opacity-90 active:scale-95"
          >
            Voir un indice
          </button>
        )}

        {!zoneReponseOuverte && (
          <button
            type="button"
            onClick={ouvrirZoneReponse}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-150 hover:border-white/30 active:scale-95"
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
            className="w-full rounded-xl border border-white/15 bg-black/20 p-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors duration-150 focus:border-accent focus:outline-none"
          />

          {!solutionVisible && (
            <button
              type="button"
              onClick={() => setSolutionVisible(true)}
              disabled={!aEcritUneTentative}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              Voir la correction
            </button>
          )}
        </div>
      )}

      {solutionVisible && (
        <div className="mt-4 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm text-foreground/90">
          {solution}
        </div>
      )}
    </div>
  );
}
