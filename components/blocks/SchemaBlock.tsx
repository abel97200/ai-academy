// Affiche un schéma dessiné par le code (pas d'image à fournir), accompagné
// d'une légende. Le dessin proprement dit est délégué à DiagramRenderer,
// qui choisit le bon composant selon le type de schéma décrit dans le JSON.

import type { Diagram } from "@/lib/content";
import DiagramRenderer from "@/components/schemas/DiagramRenderer";

type SchemaBlockProps = {
  diagram: Diagram;
  caption: string;
};

export default function SchemaBlock({ diagram, caption }: SchemaBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <DiagramRenderer diagram={diagram} />
      <p className="mt-4 text-center text-sm text-foreground/60">{caption}</p>
    </div>
  );
}
