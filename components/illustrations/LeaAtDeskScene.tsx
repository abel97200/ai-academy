// Petite illustration "faite maison" (SVG à plat, pas d'asset externe) :
// Léa reçoit plusieurs emails similaires, toute la journée, et vérifie
// chaque fois le même tableau de suivi. Fait partie du registre partagé
// (voir components/illustrations/registry.tsx) : utilisable par n'importe
// quelle leçon en thème "light-elearning" via `illustration: "lea-desk"`
// sur un bloc "situation", pas seulement la leçon 1.1.

export default function LeaAtDeskScene() {
  return (
    <svg
      viewBox="0 0 360 230"
      className="mx-auto h-auto w-full max-w-md"
      role="img"
      aria-label="Illustration de Léa à son poste de travail : plusieurs emails similaires arrivent autour d'elle pendant qu'elle consulte son tableau de suivi"
    >
      <ellipse cx="180" cy="198" rx="150" ry="16" fill="#EDE9FE" />

      {/* horloge : suggère que ça dure toute la journée */}
      <g transform="translate(24,20)">
        <circle cx="16" cy="16" r="16" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2" />
        <line x1="16" y1="16" x2="16" y2="7" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="16" x2="22" y2="18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* bureau */}
      <rect x="40" y="158" width="280" height="14" rx="7" fill="#C4B5FD" />
      <rect x="60" y="172" width="14" height="38" rx="4" fill="#DDD6FE" />
      <rect x="286" y="172" width="14" height="38" rx="4" fill="#DDD6FE" />

      {/* écran */}
      <rect x="120" y="98" width="120" height="70" rx="10" fill="#4C1D95" />
      <rect x="132" y="110" width="96" height="46" rx="6" fill="#EEF2FF" />
      <rect x="140" y="118" width="50" height="6" rx="3" fill="#A5B4FC" />
      <rect x="140" y="130" width="70" height="6" rx="3" fill="#C7D2FE" />
      <rect x="140" y="142" width="40" height="6" rx="3" fill="#A5B4FC" />
      <rect x="168" y="168" width="24" height="9" fill="#4C1D95" />

      {/* Léa */}
      <circle cx="180" cy="78" r="21" fill="#FBCFA0" />
      <path d="M159 74c0-15 42-15 42 0v6h-42z" fill="#7C2D12" />
      <path d="M141 158c4-29 21-44 39-44s35 15 39 44z" fill="#7C3AED" />

      {/* emails qui arrivent, autour de Léa (mêmes questions, encore et encore) */}
      <g transform="translate(36,46) rotate(-12)">
        <rect width="50" height="34" rx="6" fill="#ffffff" stroke="#6366F1" strokeWidth="2" />
        <path d="M2 4l23 15 23-15" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(272,38) rotate(10)">
        <rect width="50" height="34" rx="6" fill="#ffffff" stroke="#F59E0B" strokeWidth="2" />
        <path d="M2 4l23 15 23-15" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(280,112) rotate(-8)">
        <rect width="44" height="30" rx="6" fill="#ffffff" stroke="#22C55E" strokeWidth="2" />
        <path d="M2 4l20 13 20-13" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(20,114) rotate(9)">
        <rect width="44" height="30" rx="6" fill="#ffffff" stroke="#3B82F6" strokeWidth="2" />
        <path d="M2 4l20 13 20-13" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* petit repère "même question" au-dessus d'un email */}
      <g transform="translate(46,32)">
        <circle cx="10" cy="10" r="10" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
        <path
          d="M6 10a4 4 0 1 1 1.2 2.8M6 10l0 -2.4M6 10l2.2 0.6"
          fill="none"
          stroke="#6366F1"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* tableau de suivi, sur le bureau à côté de Léa */}
      <g transform="translate(246,150)">
        <rect width="46" height="34" rx="5" fill="#ffffff" stroke="#22C55E" strokeWidth="2" />
        <line x1="6" y1="10" x2="40" y2="10" stroke="#BBF7D0" strokeWidth="2.5" />
        <line x1="6" y1="17" x2="40" y2="17" stroke="#BBF7D0" strokeWidth="2.5" />
        <line x1="6" y1="24" x2="28" y2="24" stroke="#BBF7D0" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
