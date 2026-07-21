// Page d'accueil de AI Academy : présente le parcours disponible et
// mène vers son écran dédié (la feuille de route complète).

import Link from "next/link";
import { getCourse } from "@/lib/course";

export default function Home() {
  const course = getCourse("claude-code");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-4">
        {/* Titre principal */}
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
          AI Academy
        </h1>

        {/* Sous-titre */}
        <p className="text-lg text-foreground/70 max-w-lg">
          Apprends à créer de vraies applications avec Claude Code
        </p>

        {/* Carte présentant le parcours */}
        <div className="mt-10 w-full">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-black/20">
            <h2 className="text-xl font-medium text-foreground">{course.title}</h2>
            <p className="mt-2 text-sm text-foreground/60">{course.promise}</p>

            {/* Lien vers l'écran parcours (la feuille de route complète) */}
            <Link
              href={`/parcours/${course.slug}`}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95"
            >
              Commencer
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
