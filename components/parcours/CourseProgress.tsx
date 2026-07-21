"use client";

// Affiche l'avancement dans le parcours (pourcentage + nombre de leçons
// validées), calculé à partir de la progression enregistrée dans le
// localStorage. Deux présentations, pour que la progression reste
// visible sur tous les écrans sans dupliquer ce calcul :
// - "bar" : la barre complète, utilisée sur l'écran parcours.
// - "badge" : un badge compact, utilisé sur les écrans module et leçon.

import { useProgressSnapshot } from "@/lib/useProgress";
import { computeCourseProgress } from "@/lib/courseProgress";
import type { Course, ModuleRequirements } from "@/lib/courseTypes";

type CourseProgressProps = {
  course: Course;
  moduleRequirements: Record<string, ModuleRequirements>;
  variant?: "bar" | "badge";
};

export default function CourseProgress({
  course,
  moduleRequirements,
  variant = "bar",
}: CourseProgressProps) {
  const progressSnapshot = useProgressSnapshot();
  const progress = computeCourseProgress(course, moduleRequirements, progressSnapshot);

  if (variant === "badge") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/60">
        <span className="font-medium text-accent">{progress.percentage}%</span>
        du parcours · {progress.completedLessons}/{progress.totalLessons} leçons
      </span>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-foreground/60">
        <span>{progress.percentage}% du parcours</span>
        <span>
          {progress.completedLessons}/{progress.totalLessons} leçons validées
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
