"use client";

// Affiche les conditions de validation d'un module et leur état actuel :
// leçons terminées, quiz à au moins 75%, actions confirmées, évaluation
// confirmée. Utilisé sur l'écran module, pour que l'apprenant sache
// précisément ce qu'il lui reste à faire.

import { useProgressSnapshot } from "@/lib/useProgress";
import { QUIZ_PASS_THRESHOLD, isModuleValidated } from "@/lib/courseProgress";
import type { ModuleRequirements } from "@/lib/courseTypes";

type ModuleValidationProps = {
  requirements: ModuleRequirements;
};

type ConditionRow = {
  label: string;
  done: boolean;
};

export default function ModuleValidation({ requirements }: ModuleValidationProps) {
  const progress = useProgressSnapshot();
  const validated = isModuleValidated(requirements, progress);

  const conditions: ConditionRow[] = [
    {
      label: `Terminer les ${requirements.lessonIds.length} leçon${requirements.lessonIds.length > 1 ? "s" : ""} du module`,
      done: requirements.lessonIds.every((id) => progress.completedLessonIds.has(id)),
    },
  ];

  if (requirements.quizBlockIds.length > 0) {
    conditions.push({
      label: `Obtenir au moins ${QUIZ_PASS_THRESHOLD}% à chaque quiz`,
      done: requirements.quizBlockIds.every(
        (id) => (progress.quizScores[id] ?? 0) >= QUIZ_PASS_THRESHOLD
      ),
    });
  }

  if (requirements.actionBlockIds.length > 0) {
    conditions.push({
      label: "Confirmer l'action pratique",
      done: requirements.actionBlockIds.every((id) => progress.actionsDone.has(id)),
    });
  }

  if (requirements.assessmentBlockIds.length > 0) {
    conditions.push({
      label: "Confirmer l'évaluation finale",
      done: requirements.assessmentBlockIds.every((id) => progress.assessmentsDone.has(id)),
    });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          Conditions de validation
        </p>
        {validated && (
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            ✓ Module validé
          </span>
        )}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {conditions.map((condition) => (
          <li key={condition.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] " +
                (condition.done
                  ? "bg-success/20 text-success"
                  : "bg-white/5 text-foreground/30")
              }
            >
              {condition.done ? "✓" : ""}
            </span>
            <span className={condition.done ? "text-foreground/50 line-through" : "text-foreground/80"}>
              {condition.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
