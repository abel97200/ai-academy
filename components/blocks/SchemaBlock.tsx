// Affiche un schéma dessiné par le code (pas d'image à fournir), accompagné
// d'une légende. En thème sombre par défaut, le dessin est délégué à
// DiagramRenderer (SVG à nœuds/liens, partagé par tous les parcours — non
// modifié ici). En thème "light-elearning", les mêmes nœuds sont affichés
// comme des cartes colorées cliquables (voir LightVocabularyCards).

import type { Diagram, LessonTheme } from "@/lib/content";
import DiagramRenderer from "@/components/schemas/DiagramRenderer";
import LightVocabularyCards from "@/components/schemas/LightVocabularyCards";

type SchemaBlockProps = {
  diagram: Diagram;
  caption: string;
  theme?: LessonTheme;
};

export default function SchemaBlock({ diagram, caption, theme }: SchemaBlockProps) {
  if (theme === "light-elearning") {
    return (
      <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_8px_30px_rgba(99,102,241,0.08)] sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          📘 Vocabulaire
        </span>
        <div className="mt-6">
          <LightVocabularyCards nodes={diagram.nodes} />
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">{caption}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <DiagramRenderer diagram={diagram} />
      <p className="mt-4 text-center text-sm text-foreground/60">{caption}</p>
    </div>
  );
}
