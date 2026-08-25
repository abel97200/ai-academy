// Composant qui affiche un bloc de type "explication" : un simple texte,
// mis en valeur dans une carte. En thème sombre par défaut, style neutre
// historique. En thème "light-elearning", un encadré théorique clair
// (information = bleu, voir docs/CONTENT-SCHEMA-V2.md).

import InlineText from "@/components/blocks/InlineText";
import type { LessonTheme } from "@/lib/content";

type ExplicationBlockProps = {
  content: string;
  theme?: LessonTheme;
};

export default function ExplicationBlock({ content, theme }: ExplicationBlockProps) {
  if (theme === "light-elearning") {
    return (
      <div className="flex gap-4 rounded-2xl border-2 border-blue-100 bg-blue-50 p-5 sm:p-6">
        <span className="text-2xl" aria-hidden="true">
          💡
        </span>
        <p className="text-base leading-relaxed text-blue-900">
          <InlineText text={content} />
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-base leading-relaxed text-foreground/80">
        <InlineText text={content} />
      </p>
    </div>
  );
}
