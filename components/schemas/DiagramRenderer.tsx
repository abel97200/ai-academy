// Choisit le composant à utiliser pour dessiner un schéma, selon son "kind".
// Même principe que BlockRenderer : un switch, pour que TypeScript vérifie
// qu'on gère bien tous les types de schémas.
//
// Pour ajouter un nouveau type de schéma plus tard :
// 1. le décrire dans lib/content.ts (nouveau type ajouté à l'union "Diagram"),
// 2. créer son composant dans ce dossier (ou réutiliser NodesLinksDiagram),
// 3. ajouter un "case" ici.

import type { Diagram } from "@/lib/content";
import NodesLinksDiagram from "@/components/schemas/NodesLinksDiagram";

type DiagramRendererProps = {
  diagram: Diagram;
};

export default function DiagramRenderer({ diagram }: DiagramRendererProps) {
  switch (diagram.kind) {
    case "trio":
      return <NodesLinksDiagram nodes={diagram.nodes} links={diagram.links} />;

    default:
      return null;
  }
}
