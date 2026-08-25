// Petit pictogramme réutilisable pour les 4 rôles enseignés en 1.1
// (déclencheur/donnée/action/résultat) : mêmes 4 icônes utilisées à
// plusieurs endroits de la leçon (l'aperçu de chaîne, puis les cartes
// vocabulaire) pour aider à mémoriser la structure, comme le demande
// docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md ("faciliter la mémorisation
// d'une structure"). Écrit en switch pour éviter tout risque de
// "composant créé pendant le rendu" (voir components/illustrations/registry.tsx).

export type Role = "declencheur" | "donnee" | "action" | "resultat";

export const ROLE_COLOR: Record<Role, string> = {
  declencheur: "#6366F1",
  donnee: "#F59E0B",
  action: "#14B8A6",
  resultat: "#22C55E",
};

type RoleIconProps = {
  role: Role;
  size?: number;
  // true quand l'icône est accompagnée d'un texte qui la nomme déjà tout
  // près (ex: dans une carte ou un bouton) : elle devient alors purement
  // décorative pour les technologies d'assistance, afin de ne pas dupliquer
  // le nom accessible (ex: bouton "Résultat" + icône aussi nommée
  // "Résultat" = nom accessible "Résultat Résultat"). Par défaut false :
  // utilisée seule (ex: l'aperçu de chaîne), l'icône reste identifiée.
  decorative?: boolean;
};

export default function RoleIcon({ role, size = 40, decorative = false }: RoleIconProps) {
  const color = ROLE_COLOR[role];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      {...(decorative
        ? { "aria-hidden": "true" }
        : { role: "img", "aria-label": ROLE_LABEL[role] })}
    >
      <circle cx="20" cy="20" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />
      {role === "declencheur" && (
        <path
          d="M20 10c-3 0-5 2.4-5 5.6v3.2c0 1-.4 2-1.1 2.7l-1 1c-.4.4-.1 1 .4 1h13.4c.5 0 .8-.6.4-1l-1-1a3.7 3.7 0 0 1-1.1-2.7v-3.2c0-3.2-2-5.6-5-5.6zM17.5 25.5a2.5 2.5 0 0 0 5 0"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {role === "donnee" && (
        <>
          <rect x="13" y="10" width="14" height="19" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
          <line x1="16" y1="15" x2="24" y2="15" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="16" y1="19" x2="24" y2="19" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="16" y1="23" x2="21" y2="23" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {role === "action" && (
        <path d="M16 11.5v17l14-8.5z" fill={color} />
      )}
      {role === "resultat" && (
        <path
          d="M13 20.5l4.5 4.5L27.5 14.5"
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

const ROLE_LABEL: Record<Role, string> = {
  declencheur: "Déclencheur",
  donnee: "Donnée",
  action: "Action",
  resultat: "Résultat",
};
