"use client";

// Barre de navigation en bas d'une leçon : un lien de retour vers le
// module (toujours visible), et un bouton "Leçon suivante" qui apparaît
// une fois la leçon validée, s'il existe une leçon après celle-ci.

import Link from "next/link";
import { useLessonContext } from "@/components/lesson/LessonContext";

type LessonFooterNavProps = {
  moduleHref: string;
  nextLessonHref: string | null;
};

export default function LessonFooterNav({
  moduleHref,
  nextLessonHref,
}: LessonFooterNavProps) {
  const { completed } = useLessonContext();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
      <Link
        href={moduleHref}
        className="text-sm text-foreground/60 transition-colors hover:text-foreground"
      >
        ← Retour au module
      </Link>

      {completed && nextLessonHref && (
        <Link
          href={nextLessonHref}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
        >
          Leçon suivante →
        </Link>
      )}
    </div>
  );
}
