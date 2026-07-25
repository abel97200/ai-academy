// Carte de synthèse courte (une minute maximum, sans jargon), utilisée pour
// clore une leçon. Pendant de "DemoBlock" mais pour l'étape Vérifier :
// c'est la clôture standard, réutilisable par toute future leçon.

import InlineText from "@/components/blocks/InlineText";

type ResumeBlockProps = {
  content: string;
};

export default function ResumeBlock({ content }: ResumeBlockProps) {
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
