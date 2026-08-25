// Composant qui affiche un bloc de type "explication" : un texte, mis en
// valeur dans une carte, éventuellement accompagné d'un micro-diagramme
// (voir ExplicationVisuals.tsx) qui illustre réellement le propos — une
// simple icône à côté du texte ne suffit pas au standard visuel (voir
// docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md).
//
// Thème sombre par défaut (historique, texte seul) ou thème
// "light-elearning" (information = bleu).

import InlineText from "@/components/blocks/InlineText";
import { ExplicationVisual } from "@/components/blocks/ExplicationVisuals";
import type { LessonTheme } from "@/lib/content";

type ExplicationBlockProps = {
  content: string;
  visual?: string;
  theme?: LessonTheme;
};

export default function ExplicationBlock({ content, visual, theme }: ExplicationBlockProps) {
  if (theme === "light-elearning") {
    return (
      <div className="rounded-3xl border-2 border-blue-100 bg-blue-50 p-6 sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          💡 À comprendre
        </span>

        {visual && (
          <div className="mt-5">
            <ExplicationVisual visual={visual} />
          </div>
        )}

        <p className="mt-4 text-base leading-relaxed text-blue-900">
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
