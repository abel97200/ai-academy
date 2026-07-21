"use client";

// La "feuille de route" du parcours : une liste verticale numérotée des
// modules, reliés par une ligne, chacun montrant son titre, son objectif,
// son utilité, et son état (terminé / en cours / verrouillé).

import Link from "next/link";
import { useCompletedLessons } from "@/lib/useProgress";
import { computeCourseProgress } from "@/lib/courseProgress";
import type { Course, ModuleStatus } from "@/lib/courseTypes";

type RoadmapProps = {
  course: Course;
};

const STATUS_LABEL: Record<ModuleStatus, string> = {
  completed: "Terminé",
  current: "En cours",
  locked: "Bientôt",
};

export default function Roadmap({ course }: RoadmapProps) {
  const completedLessonIds = useCompletedLessons();
  const progress = computeCourseProgress(course, completedLessonIds);

  return (
    <ol className="flex flex-col">
      {course.modules.map((courseModule, index) => {
        const moduleProgress = progress.moduleProgress[courseModule.slug];
        const isLast = index === course.modules.length - 1;
        const isLocked = moduleProgress.status === "locked";
        const isCompleted = moduleProgress.status === "completed";
        const isCurrent = moduleProgress.status === "current";

        return (
          <li key={courseModule.slug} className="relative flex gap-4 pb-8">
            {/* Colonne de gauche : le numéro d'étape, relié par une ligne. */}
            <div className="flex flex-col items-center">
              <span
                className={
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold " +
                  (isCompleted
                    ? "bg-success/20 text-success"
                    : isCurrent
                      ? "bg-accent text-white"
                      : "bg-white/5 text-foreground/30")
                }
              >
                {isCompleted ? "✓" : courseModule.number}
              </span>
              {/* Le segment qui suit un module terminé se colore en vert :
                  le "chemin déjà parcouru" se voit d'un coup d'œil. */}
              {!isLast && (
                <span
                  className={
                    "mt-1 w-px flex-1 " + (isCompleted ? "bg-success/40" : "bg-white/10")
                  }
                />
              )}
            </div>

            {/* Carte du module */}
            <Link
              href={`/parcours/${course.slug}/${courseModule.slug}`}
              className={
                "mb-1 flex-1 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 " +
                (isCurrent
                  ? "border-accent/50 bg-accent/[0.05] hover:border-accent"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20")
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h3 className="font-medium text-foreground">
                  Module {courseModule.number} · {courseModule.title}
                </h3>
                <span
                  className={
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
                    (isCompleted
                      ? "bg-success/15 text-success"
                      : isCurrent
                        ? "bg-accent/15 text-accent"
                        : "bg-white/5 text-foreground/40")
                  }
                >
                  {STATUS_LABEL[moduleProgress.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/70">{courseModule.objective}</p>
              <p className={"mt-1 text-sm " + (isLocked ? "text-foreground/35" : "text-foreground/50")}>
                {courseModule.usefulness}
              </p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
