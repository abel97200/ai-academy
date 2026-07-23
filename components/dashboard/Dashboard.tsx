"use client";

// Tableau de bord : où en est l'utilisateur, et quoi faire ensuite. C'est
// la nouvelle page d'accueil — elle remplace la simple carte de parcours
// par un vrai résumé personnel, pour faciliter la reprise de la formation.

import Link from "next/link";
import { useProgressSnapshot } from "@/lib/useProgress";
import { computeCourseProgress, getNextAction } from "@/lib/courseProgress";
import type { Course, ModuleRequirements } from "@/lib/courseTypes";

type DashboardProps = {
  course: Course;
  moduleRequirements: Record<string, ModuleRequirements>;
  // Titres des leçons existantes, pour afficher la "prochaine action" de
  // façon lisible (le calcul de progression ne connaît que les identifiants).
  lessonTitles: Record<string, string>;
};

export default function Dashboard({ course, moduleRequirements, lessonTitles }: DashboardProps) {
  const progressSnapshot = useProgressSnapshot();
  const progress = computeCourseProgress(course, moduleRequirements, progressSnapshot);
  const nextAction = getNextAction(course, moduleRequirements, progressSnapshot);

  // Niveau actuel : le premier niveau pas encore terminé (sinon le premier).
  const currentLevel =
    course.levels.find((level) => progress.levelProgress[level.slug]?.status === "current") ??
    course.levels[0];

  const currentLevelModules = currentLevel.modules
    .map((slug) => course.modules.find((m) => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  // Module actuel : celui "en cours" dans ce niveau ; sinon le dernier
  // validé (le plus avancé atteint) ; sinon le premier du niveau.
  const currentModule =
    currentLevelModules.find((m) => progress.moduleProgress[m.slug]?.status === "current") ??
    [...currentLevelModules]
      .reverse()
      .find((m) => progress.moduleProgress[m.slug]?.status === "completed") ??
    currentLevelModules[0];

  const continueHref =
    nextAction.kind === "lesson"
      ? `/parcours/${course.slug}/${nextAction.moduleSlug}/${nextAction.lessonId}`
      : nextAction.kind === "module"
        ? `/parcours/${course.slug}/${nextAction.moduleSlug}`
        : `/parcours/${course.slug}`;

  const nextActionLabel =
    nextAction.kind === "lesson"
      ? (lessonTitles[nextAction.lessonId] ?? "Continuer la leçon en cours")
      : nextAction.kind === "module"
        ? "Terminer les conditions de validation du module"
        : "Tout est à jour — explore le parcours complet";

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          AI Academy
        </h1>
        <p className="text-foreground/70">{course.promise}</p>
      </div>

      {/* Statut : niveau/module actuel, progression, prochaine action */}
      <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
          <span className="rounded-full bg-white/5 px-2.5 py-1">
            Niveau {currentLevel.number} · {currentLevel.theme}
          </span>
          {currentModule && (
            <span className="rounded-full bg-white/5 px-2.5 py-1">
              Module {currentModule.number} · {currentModule.title}
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>{progress.percentage}% du cursus</span>
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

        {currentModule && currentModule.skills.length > 0 && (
          <p className="mt-4 text-sm text-foreground/60">
            <span className="font-medium text-foreground/80">Compétence en cours : </span>
            {currentModule.skills[0]}
          </p>
        )}

        <p className="mt-2 text-sm text-foreground/60">
          <span className="font-medium text-foreground/80">Prochaine étape : </span>
          {nextActionLabel}
        </p>

        <Link
          href={continueHref}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
        >
          Continuer ma formation
        </Link>
      </div>

      {/* Projets de niveau */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">Projets de niveau</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {course.levels.map((level) => (
            <div
              key={level.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                Niveau {level.number}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{level.project.title}</p>
              <p className="mt-1 text-xs text-foreground/50">{level.project.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Autres parcours disponibles ou annoncés */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">Autres parcours</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {course.specializations.map((specialization) => {
            const content = (
              <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{specialization.title}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                    specialization.available
                      ? "bg-accent/15 text-accent"
                      : "bg-white/5 text-foreground/40"
                  }`}
                >
                  {specialization.available ? "Disponible" : "À venir"}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/50">{specialization.description}</p>
              </>
            );

            return specialization.available ? (
              <Link
                key={specialization.slug}
                href={`/parcours/${specialization.slug}`}
                className="rounded-2xl border border-accent/30 bg-accent/[0.04] p-4 transition-colors hover:bg-accent/[0.08]"
              >
                {content}
              </Link>
            ) : (
              <div
                key={specialization.slug}
                className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <Link
        href={`/parcours/${course.slug}`}
        className="self-center text-sm text-foreground/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground"
      >
        Voir le parcours complet →
      </Link>
    </div>
  );
}
