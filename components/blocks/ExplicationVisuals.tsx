// Visuels qui illustrent RÉELLEMENT le propos d'un bloc "explication" en
// thème "light-elearning" — pas une icône décorative à côté d'un
// paragraphe (interdit par docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md).
// Écrit en switch (comme components/illustrations/registry.tsx) pour
// éviter tout risque de "composant créé pendant le rendu".
//
// Pour ajouter un visuel : lui donner un identifiant ci-dessous, l'utiliser
// depuis n'importe quel bloc "explication" via son champ JSON `visual`.

import OverflowingInboxScene from "@/components/illustrations/OverflowingInboxScene";
import RoleIcon, { type Role } from "@/components/illustrations/RoleIcon";

const CHAIN_ROLES: Role[] = ["declencheur", "donnee", "action", "resultat"];

// "chain-preview" : aperçu de la chaîne à 4 étapes qui sera nommée et
// détaillée juste après (bloc "schema" suivant), avec les mêmes
// pictogrammes qu'on retrouvera sur les cartes vocabulaire — montre le
// mécanisme avant son vocabulaire, et prépare la mémorisation de la
// structure en la présentant une première fois visuellement.
function ChainPreviewVisual() {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:justify-start">
      {CHAIN_ROLES.map((role, index) => (
        <span key={role} className="flex items-center gap-1.5">
          <RoleIcon role={role} size={44} />
          {index < CHAIN_ROLES.length - 1 && (
            <span aria-hidden="true" className="text-lg text-indigo-200">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ExplicationVisual({ visual }: { visual: string | undefined }) {
  switch (visual) {
    case "repeat-pattern":
      return (
        <div className="flex flex-col items-center gap-2">
          <OverflowingInboxScene />
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">
            ↻ La même demande, encore et encore, toute la journée
          </span>
        </div>
      );
    case "chain-preview":
      return <ChainPreviewVisual />;
    default:
      return null;
  }
}
