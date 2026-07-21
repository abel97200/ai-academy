"use client";

// L'évaluation finale d'un module : une checklist d'exigences. L'apprenant
// coche chaque exigence qu'il estime remplir, puis confirme — uniquement
// possible une fois toutes les cases cochées. Cette confirmation compte
// dans les conditions de validation du module.

import { useEffect, useState } from "react";
import { getAssessmentsDone, markAssessmentDone } from "@/lib/progress";

type AssessmentBlockProps = {
  id: string;
  title: string;
  requirements: string[];
};

export default function AssessmentBlock({ id, title, requirements }: AssessmentBlockProps) {
  const [checked, setChecked] = useState<boolean[]>(() => requirements.map(() => false));
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Lecture d'un système externe (localStorage) au montage : nécessaire.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfirmed(getAssessmentsDone().has(id));
  }, [id]);

  const toutCoche = checked.every(Boolean);

  function toggle(index: number) {
    setChecked((previous) => previous.map((value, i) => (i === index ? !value : value)));
  }

  function handleConfirmer() {
    markAssessmentDone(id);
    setConfirmed(true);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Évaluation finale
      </span>
      <p className="mt-2 text-base font-medium text-foreground">{title}</p>

      {confirmed ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm font-medium text-success">
          ✓ Évaluation confirmée
        </div>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-2">
            {requirements.map((requirement, index) => (
              <li key={index}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-4 py-2.5 text-sm transition-all duration-150 hover:border-white/20 active:scale-[0.99]">
                  <input
                    type="checkbox"
                    checked={checked[index]}
                    onChange={() => toggle(index)}
                    className="mt-0.5"
                  />
                  <span className="text-foreground/85">{requirement}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleConfirmer}
            disabled={!toutCoche}
            className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          >
            Confirmer l&apos;évaluation
          </button>
        </>
      )}
    </div>
  );
}
