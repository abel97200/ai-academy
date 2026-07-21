"use client";

// Affiche le titre de la leçon, avec un badge "Complétée" une fois
// que la leçon a été validée (l'info vient du LessonContext).

import { useLessonContext } from "@/components/lesson/LessonContext";

type LessonHeaderProps = {
  title: string;
};

export default function LessonHeader({ title }: LessonHeaderProps) {
  const { completed } = useLessonContext();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {completed && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
          ✓ Complétée
        </span>
      )}
    </div>
  );
}
