// Illustration "faite maison" : un client remplit un formulaire de contact
// en ligne pour signaler un article cassé à la réception — le nouveau cas
// utilisé pour transférer ce qui vient d'être appris (bloc "tri" de la
// leçon 1.1). Même style que LeaAtDeskScene, pour rester cohérent.

export default function ClientFormScene() {
  return (
    <svg
      viewBox="0 0 300 170"
      className="mx-auto h-auto w-full max-w-xs"
      role="img"
      aria-label="Un client remplit un formulaire de contact en ligne pour signaler un article cassé à la réception"
    >
      <ellipse cx="150" cy="150" rx="120" ry="14" fill="#FEF3C7" fillOpacity="0.6" />

      {/* bureau */}
      <rect x="30" y="118" width="220" height="12" rx="6" fill="#FDE68A" />
      <rect x="46" y="130" width="12" height="30" rx="3" fill="#FEF3C7" />
      <rect x="222" y="130" width="12" height="30" rx="3" fill="#FEF3C7" />

      {/* écran avec le formulaire */}
      <rect x="96" y="66" width="108" height="62" rx="8" fill="#1E293B" />
      <rect x="106" y="76" width="88" height="42" rx="5" fill="#ffffff" />
      <rect x="112" y="82" width="40" height="5" rx="2.5" fill="#CBD5E1" />
      <rect x="112" y="92" width="76" height="7" rx="3.5" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1" />
      <rect x="112" y="103" width="76" height="7" rx="3.5" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1" />
      <rect x="150" y="112" width="38" height="6" rx="3" fill="#6366F1" />
      <rect x="146" y="128" width="16" height="7" fill="#1E293B" />

      {/* client */}
      <circle cx="150" cy="46" r="19" fill="#FBCFA0" />
      <path d="M132 43c0-13 36-13 36 0v5h-36z" fill="#1F2937" />
      <path d="M116 118c3-25 18-38 34-38s31 13 34 38z" fill="#F59E0B" />

      {/* colis cassé, à côté du bureau */}
      <g transform="translate(230,90)">
        <rect width="40" height="32" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
        <path d="M0 12h40M20 12v20" stroke="#B45309" strokeWidth="1.5" />
        <path
          d="M6 6l6 8-5 4 7 7"
          fill="none"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* curseur cliquant sur "envoyer" */}
      <path
        d="M176 138l7 16 2.5-6.5 6.5-2.5z"
        fill="#1E293B"
      />
    </svg>
  );
}
