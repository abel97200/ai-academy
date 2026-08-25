// Visuels qui illustrent RÉELLEMENT le propos d'un bloc "explication" en
// thème "light-elearning" — pas une icône décorative à côté d'un
// paragraphe (interdit par docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md).
// Écrit en switch (comme components/illustrations/registry.tsx) pour
// éviter tout risque de "composant créé pendant le rendu".
//
// Pour ajouter un visuel : lui donner un identifiant ci-dessous, l'utiliser
// depuis n'importe quel bloc "explication" via son champ JSON `visual`.

import type { ReactNode } from "react";
import OverflowingInboxScene from "@/components/illustrations/OverflowingInboxScene";
import RoleIcon, { type Role } from "@/components/illustrations/RoleIcon";
import ConceptIcon, { type ConceptShape } from "@/components/illustrations/ConceptIcon";
import { RegisteredIllustration } from "@/components/illustrations/registry";

// Une rangée d'icônes reliées par des flèches — utilisée par plusieurs
// visuels ci-dessous pour prévisualiser une structure à N concepts avant
// de la nommer en détail (schéma ou tri qui suit).
function IconRow({
  items,
}: {
  items: { key: string; node: ReactNode }[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
      {items.map((item, index) => (
        <span key={item.key} className="flex items-center gap-1.5">
          {item.node}
          {index < items.length - 1 && (
            <span aria-hidden="true" className="text-lg text-indigo-200">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

const CHAIN_ROLES: Role[] = ["declencheur", "donnee", "action", "resultat"];
const DAT_ROLES: Role[] = ["declencheur", "donnee", "action"];

const PROCESS_TRIO: { shape: ConceptShape; color: string; label: string }[] = [
  { shape: "checklist", color: "#F59E0B", label: "Tâche" },
  { shape: "loop", color: "#6366F1", label: "Processus" },
  { shape: "gear", color: "#22C55E", label: "Workflow" },
];

const APPROACH_TRIO: { shape: ConceptShape; color: string; label: string }[] = [
  { shape: "gear", color: "#14B8A6", label: "Automatisation classique" },
  { shape: "chat", color: "#3B82F6", label: "IA" },
  { shape: "network", color: "#8B5CF6", label: "Agent IA" },
];

const DECISION_TRIO: { shape: ConceptShape; color: string; label: string }[] = [
  { shape: "robot", color: "#22C55E", label: "Automatiser" },
  { shape: "handshake", color: "#F59E0B", label: "Assister" },
  { shape: "hand", color: "#6366F1", label: "Garder humain" },
];

export function ExplicationVisual({ visual }: { visual: string | undefined }) {
  switch (visual) {
    case "workshop":
    case "client-form":
    case "lea-desk":
      return <RegisteredIllustration id={visual} />;

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
      return (
        <IconRow
          items={CHAIN_ROLES.map((role) => ({
            key: role,
            node: <RoleIcon role={role} size={44} />,
          }))}
        />
      );

    case "chain-preview-dat":
      return (
        <IconRow
          items={DAT_ROLES.map((role) => ({
            key: role,
            node: <RoleIcon role={role} size={44} />,
          }))}
        />
      );

    case "process-trio":
      return (
        <IconRow
          items={PROCESS_TRIO.map((item) => ({
            key: item.shape,
            node: <ConceptIcon shape={item.shape} color={item.color} label={item.label} size={44} />,
          }))}
        />
      );

    case "approach-trio":
      return (
        <IconRow
          items={APPROACH_TRIO.map((item) => ({
            key: item.shape,
            node: <ConceptIcon shape={item.shape} color={item.color} label={item.label} size={44} />,
          }))}
        />
      );

    case "decision-trio":
      return (
        <IconRow
          items={DECISION_TRIO.map((item) => ({
            key: item.shape,
            node: <ConceptIcon shape={item.shape} color={item.color} label={item.label} size={44} />,
          }))}
        />
      );

    default:
      return null;
  }
}
