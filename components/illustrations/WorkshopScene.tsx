// Illustration "faite maison" : un artisan à son établi, à l'Atelier Bois &
// Co — le petit commerce fil rouge des leçons 1.2 et 1.6. Même style que
// LeaAtDeskScene et ClientFormScene, pour rester cohérent.

export default function WorkshopScene() {
  return (
    <svg
      viewBox="0 0 300 170"
      className="mx-auto h-auto w-full max-w-xs"
      role="img"
      aria-label="Un artisan travaille à son établi, à l'Atelier Bois & Co"
    >
      <ellipse cx="150" cy="152" rx="120" ry="14" fill="#FDE68A" fillOpacity="0.5" />

      {/* établi */}
      <rect x="40" y="118" width="220" height="14" rx="4" fill="#B45309" />
      <rect x="54" y="132" width="14" height="28" rx="3" fill="#92400E" />
      <rect x="232" y="132" width="14" height="28" rx="3" fill="#92400E" />

      {/* planche de bois posée sur l'établi */}
      <rect x="150" y="106" width="90" height="16" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
      <line x1="160" y1="114" x2="230" y2="114" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />

      {/* outils accrochés / posés */}
      <g transform="translate(56,96)">
        <rect width="6" height="26" rx="2" fill="#78716C" />
        <rect x="-7" y="0" width="20" height="7" rx="2" fill="#57534E" />
      </g>
      <circle cx="86" cy="112" r="9" fill="none" stroke="#57534E" strokeWidth="3" />

      {/* artisan */}
      <circle cx="150" cy="60" r="20" fill="#FBCFA0" />
      <path d="M131 56c0-14 38-14 38 0v5h-38z" fill="#44403C" />
      <path d="M124 118c4-27 15-42 26-42s22 15 26 42z" fill="#EA580C" />

      {/* bras tenant un rabot sur la planche */}
      <path
        d="M150 100c8-3 20-4 30-2"
        fill="none"
        stroke="#FBCFA0"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="176" y="94" width="26" height="12" rx="3" fill="#A16207" />

      {/* copeaux de bois */}
      <path d="M204 108c4 2 4 6 0 8" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <path d="M210 112c4 2 4 6 0 8" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
