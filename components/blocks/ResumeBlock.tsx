// Carte de synthèse courte (une minute maximum, sans jargon), utilisée pour
// clore une leçon. Thème sombre par défaut (historique) ou thème
// "light-elearning" (vert = validation/réussite).

import InlineText from "@/components/blocks/InlineText";
import type { LessonTheme } from "@/lib/content";

type ResumeBlockProps = {
  content: string;
  theme?: LessonTheme;
};

export default function ResumeBlock({ content, theme }: ResumeBlockProps) {
  if (theme === "light-elearning") {
    return (
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          ✅ En une phrase
        </span>
        <p className="mt-3 text-base leading-relaxed text-emerald-900">
          <InlineText text={content} />
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-success/30 bg-success/[0.06] p-6">
      <span className="inline-block rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
        En une phrase
      </span>
      <p className="mt-3 text-base leading-relaxed text-foreground/85">
        <InlineText text={content} />
      </p>
    </div>
  );
}
