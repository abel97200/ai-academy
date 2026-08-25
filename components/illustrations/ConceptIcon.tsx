// Petit pictogramme générique et réutilisable : une forme (shape) dans une
// couleur donnée, pour illustrer un concept abstrait de façon cohérente à
// travers plusieurs leçons (ex: tâche/processus/workflow en 1.2,
// automatisation/IA/agent en 1.4, automatiser/assister/humain en 1.5).
// Complète RoleIcon.tsx (dédié aux 4 rôles déclencheur/donnée/action/
// résultat) sans le modifier. Écrit en switch pour éviter tout risque de
// "composant créé pendant le rendu".

export type ConceptShape =
  | "checklist"
  | "loop"
  | "gear"
  | "chat"
  | "network"
  | "robot"
  | "handshake"
  | "hand";

type ConceptIconProps = {
  shape: ConceptShape;
  color: string;
  size?: number;
  label?: string;
  // true quand l'icône est accompagnée d'un texte qui la nomme déjà tout
  // près (voir RoleIcon.tsx pour la même règle) : elle devient alors
  // purement décorative pour les technologies d'assistance.
  decorative?: boolean;
};

export default function ConceptIcon({
  shape,
  color,
  size = 40,
  label,
  decorative = false,
}: ConceptIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      {...(decorative || !label
        ? { "aria-hidden": "true" }
        : { role: "img", "aria-label": label })}
    >
      <circle cx="20" cy="20" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />

      {shape === "checklist" && (
        <>
          <rect x="12" y="10" width="16" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M15.5 16l1.8 1.8 3-3.2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="21.5" y1="16.5" x2="24.5" y2="16.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15.5 23l1.8 1.8 3-3.2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="21.5" y1="23.5" x2="24.5" y2="23.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}

      {shape === "loop" && (
        <path
          d="M14 15a7 7 0 1 1-1.8 6.6M12.2 21.6v-4h4M26 25a7 7 0 1 0 1.8-6.6M27.8 18.4v4h-4"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {shape === "gear" && (
        <>
          <circle cx="20" cy="20" r="5" fill="none" stroke={color} strokeWidth="1.8" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={20 + 7 * Math.cos((angle * Math.PI) / 180)}
              y1={20 + 7 * Math.sin((angle * Math.PI) / 180)}
              x2={20 + 10.5 * Math.cos((angle * Math.PI) / 180)}
              y2={20 + 10.5 * Math.sin((angle * Math.PI) / 180)}
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
        </>
      )}

      {shape === "chat" && (
        <>
          <path
            d="M11 13h18a1.6 1.6 0 0 1 1.6 1.6v9.8a1.6 1.6 0 0 1-1.6 1.6H18l-4.5 4v-4H11a1.6 1.6 0 0 1-1.6-1.6v-9.8A1.6 1.6 0 0 1 11 13z"
            fill="none"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <line x1="13.5" y1="18" x2="26.5" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13.5" y1="21.5" x2="22" y2="21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {shape === "network" && (
        <>
          <circle cx="20" cy="12" r="2.6" fill={color} />
          <circle cx="12" cy="27" r="2.6" fill={color} />
          <circle cx="28" cy="27" r="2.6" fill={color} />
          <line x1="20" y1="14.6" x2="13" y2="24.8" stroke={color} strokeWidth="1.6" />
          <line x1="20" y1="14.6" x2="27" y2="24.8" stroke={color} strokeWidth="1.6" />
          <line x1="14.6" y1="27" x2="25.4" y2="27" stroke={color} strokeWidth="1.6" />
        </>
      )}

      {shape === "robot" && (
        <>
          <rect x="12" y="15" width="16" height="13" rx="3" fill="none" stroke={color} strokeWidth="1.8" />
          <line x1="20" y1="15" x2="20" y2="11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="20" cy="9.5" r="1.6" fill={color} />
          <circle cx="16.5" cy="21" r="1.6" fill={color} />
          <circle cx="23.5" cy="21" r="1.6" fill={color} />
          <line x1="16" y1="25.5" x2="24" y2="25.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}

      {shape === "handshake" && (
        <path
          d="M10 18l4-3 4 3 3-2.4 5 3.6-3 3.4-2-1.4-3 3.2-4-3-4 2.6z"
          fill="none"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {shape === "hand" && (
        <path
          d="M15 24v-8.5a1.5 1.5 0 0 1 3 0V20m3 4v-9a1.5 1.5 0 0 1 3 0v7m3 2v-6a1.5 1.5 0 0 1 3 0v6.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2.3-4a1.4 1.4 0 0 1 2.3-1.6L15 24"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
