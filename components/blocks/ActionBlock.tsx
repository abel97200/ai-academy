"use client";

// Demande à l'apprenant de FAIRE quelque chose de concret (pas juste
// répondre à une question) : il lit les instructions et le critère de
// réussite, écrit une trace de ce qu'il a fait, puis confirme. Cette
// confirmation est enregistrée dans le localStorage et compte dans les
// conditions de validation du module.

import { useEffect, useState } from "react";
import { markActionDone, getActionsDone } from "@/lib/progress";

type ActionBlockProps = {
  id: string;
  title: string;
  instructions: string;
  successCriteria: string;
  evidence: string;
};

export default function ActionBlock({
  id,
  title,
  instructions,
  successCriteria,
  evidence,
}: ActionBlockProps) {
  const [reponse, setReponse] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Si cette action a déjà été confirmée lors d'une visite précédente, on
  // l'affiche directement dans son état "fait" (lu au montage, uniquement
  // disponible côté navigateur).
  useEffect(() => {
    // Lecture d'un système externe (localStorage) au montage : nécessaire.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfirmed(getActionsDone().has(id));
  }, [id]);

  const aEcrit = reponse.trim().length > 0;

  function handleConfirmer() {
    markActionDone(id);
    setConfirmed(true);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Action
      </span>
      <p className="mt-2 text-base font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/70">{instructions}</p>
      <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-foreground/60">
        <span className="font-medium text-foreground/80">Critère de réussite : </span>
        {successCriteria}
      </p>

      {confirmed ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm font-medium text-success">
          ✓ Action confirmée
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-start gap-3">
          <textarea
            value={reponse}
            onChange={(event) => setReponse(event.target.value)}
            placeholder={evidence}
            rows={3}
            className="w-full rounded-xl border border-white/15 bg-black/20 p-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors duration-150 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleConfirmer}
            disabled={!aEcrit}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          >
            Confirmer l&apos;action
          </button>
        </div>
      )}
    </div>
  );
}
