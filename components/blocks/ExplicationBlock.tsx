// Composant qui affiche un bloc de type "explication" : un simple texte,
// mis en valeur dans une carte au style de AI Academy (fond sombre,
// coins arrondis, texte aéré et lisible).

type ExplicationBlockProps = {
  content: string;
};

export default function ExplicationBlock({ content }: ExplicationBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-base leading-relaxed text-foreground/80">
        {content}
      </p>
    </div>
  );
}
