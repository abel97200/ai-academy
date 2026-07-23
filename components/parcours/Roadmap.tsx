"use client";

// La feuille de route complète du parcours : les niveaux, leurs modules
// (état, objectif, prérequis, compétences), le projet de chaque niveau, le
// projet final du cursus, et les spécialisations à venir.

import Link from "next/link";
import { useProgressSnapshot } from "@/lib/useProgress";
import { computeCourseProgress } from "@/lib/courseProgress";
import type { Course, ModuleRequirements, ModuleStatus } from "@/lib/courseTypes";

type RoadmapProps = {
  course: Course;
  moduleRequirements: Record<string, ModuleRequirements>;
};

const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  completed: "Terminé",
  current: "En cours",
  locked: "Verrouillé",
  "coming-soon": "À venir",
};

const MODULE_STATUS_BADGE_CLASS: Record<ModuleStatus, string> = {
  completed: "bg-success/15 text-success",
  current: "bg-accent/15 text-accent",
  locked: "bg-white/5 text-foreground/40",
  "coming-soon": "bg-white/5 text-foreground/40",
};

const MODULE_STATUS_BADGE_ICON: Record<ModuleStatus, string> = {
  completed: "✓",
  current: "",
  locked: "🔒",
  "coming-soon": "",
};

export default function Roadmap({ course, moduleRequirements }: RoadmapProps) {
  const progressSnapshot = useProgressSnapshot();
  const progress = computeCourseProgress(course, moduleRequirements, progressSnapshot);
  const modulesBySlug = new Map(course.modules.map((m) => [m.slug, m]));

  return (
    <div className="flex flex-col gap-10">
      {course.levels.map((level) => {
        const levelProg = progress.levelProgress[level.slug];
        return (
          <section key={level.slug} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                  Niveau {level.number}
                </p>
                <h2 className="text-lg font-semibold text-foreground">{level.theme}</h2>
              </div>
              <span
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium " +
                  (levelProg.status === "completed"
                    ? "bg-success/15 text-success"
                    : levelProg.status === "current"
                      ? "bg-accent/15 text-accent"
                      : "bg-white/5 text-foreground/40")
                }
              >
                {levelProg.status === "completed"
                  ? "Terminé"
                  : levelProg.status === "current"
                    ? "En cours"
                    : "À venir"}
              </span>
            </div>

            <ol className="flex flex-col">
              {level.modules.map((moduleSlug, index) => {
                const courseModule = modulesBySlug.get(moduleSlug);
                if (!courseModule) return null;
                const moduleProg = progress.moduleProgress[moduleSlug];
                const isLast = index === level.modules.length - 1;
                const isCurrent = moduleProg.status === "current";
                const isCompleted = moduleProg.status === "completed";

                const missingPrerequisites = courseModule.prerequisites
                  .filter((slug) => progress.moduleProgress[slug]?.status !== "completed")
                  .map((slug) => modulesBySlug.get(slug)?.title ?? slug);

                return (
                  <li key={moduleSlug} className="relative flex gap-4 pb-6">
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
                        {MODULE_STATUS_BADGE_ICON[moduleProg.status] || courseModule.number}
                      </span>
                      {!isLast && (
                        <span
                          className={
                            "mt-1 w-px flex-1 " + (isCompleted ? "bg-success/40" : "bg-white/10")
                          }
                        />
                      )}
                    </div>

                    <Link
                      href={`/parcours/${course.slug}/${moduleSlug}`}
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
                            MODULE_STATUS_BADGE_CLASS[moduleProg.status]
                          }
                        >
                          {MODULE_STATUS_LABEL[moduleProg.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground/70">{courseModule.objective}</p>

                      {courseModule.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {courseModule.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-foreground/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {moduleProg.status === "locked" && missingPrerequisites.length > 0 && (
                        <p className="mt-3 text-xs text-foreground/40">
                          Nécessite : {missingPrerequisites.join(", ")}
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>

            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                Projet de niveau
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{level.project.title}</p>
              <p className="mt-1 text-sm text-foreground/60">{level.project.description}</p>
            </div>
          </section>
        );
      })}

      {/* Projet final du cursus */}
      <section className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          Projet final du cursus
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          {course.finalProject.title}
        </h2>
        <p className="mt-2 text-sm text-foreground/70">{course.finalProject.description}</p>
        <ol className="mt-3 flex flex-col gap-1 text-sm text-foreground/60">
          {course.finalProject.steps.map((step, index) => (
            <li key={index}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Spécialisations à venir */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">Spécialisations</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {course.specializations.map((specialization) => {
            const content = (
              <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{specialization.title}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
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
      </section>
    </div>
  );
}
