"use client";

// Liste les leçons d'un module, avec leur état (validée / à faire) et un
// bouton pour entrer dans la leçon. Si le module n'a pas encore de leçon,
// affiche un message "à venir" au lieu d'une liste vide.

import Link from "next/link";
import { useCompletedLessons } from "@/lib/useProgress";

type LessonSummary = {
  id: string;
  title: string;
};

type ModuleLessonListProps = {
  courseSlug: string;
  moduleSlug: string;
  lessons: LessonSummary[];
};

export default function ModuleLessonList({
  courseSlug,
  moduleSlug,
  lessons,
}: ModuleLessonListProps) {
  const completedLessonIds = useCompletedLessons();

  if (lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-foreground/50">
        Ce module arrive bientôt.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {lessons.map((lesson, index) => {
        const isDone = completedLessonIds.has(lesson.id);
        return (
          <li
            key={lesson.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium " +
                  (isDone ? "bg-success/20 text-success" : "bg-white/5 text-foreground/40")
                }
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className="text-foreground">{lesson.title}</span>
            </div>
            <Link
              href={`/parcours/${courseSlug}/${moduleSlug}/${lesson.id}`}
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
            >
              {isDone ? "Revoir" : "Commencer"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
