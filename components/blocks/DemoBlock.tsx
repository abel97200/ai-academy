// Affiche un exemple concret, avec une étiquette "Démonstration" pour
// le distinguer visuellement d'un bloc d'explication classique.

import InlineText from "@/components/blocks/InlineText";

type DemoBlockProps = {
  content: string;
};

export default function DemoBlock({ content }: DemoBlockProps) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
      <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
        Démonstration
      </span>
      <p className="mt-3 text-base leading-relaxed text-foreground/80">
        <InlineText text={content} />
      </p>
    </div>
  );
}
