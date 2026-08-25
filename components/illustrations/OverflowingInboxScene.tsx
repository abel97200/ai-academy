// Illustration "faite maison" : une boîte de réception qui déborde
// d'emails quasiment identiques — rend visible ce qu'est une répétition
// avant même de lire sa définition (voir docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md,
// fonction "montrer une conséquence" / "matérialiser une abstraction").
// Fait le lien visuel avec la scène de Léa (même famille d'enveloppes).

const ENVELOPE_COLORS = ["#6366F1", "#F59E0B", "#22C55E", "#3B82F6", "#EC4899"];

export default function OverflowingInboxScene() {
  return (
    <svg
      viewBox="0 0 300 168"
      className="mx-auto h-auto w-full max-w-xs"
      role="img"
      aria-label="Une boîte de réception qui déborde de nombreux emails presque identiques"
    >
      <ellipse cx="150" cy="150" rx="110" ry="12" fill="#EEF2FF" />

      {/* pile d'enveloppes, en éventail, qui débordent du bac */}
      {ENVELOPE_COLORS.map((color, index) => {
        const angle = (index - 2) * 9;
        const x = 84 + index * 28;
        const y = 58 + Math.abs(index - 2) * 4;
        return (
          <g key={index} transform={`translate(${x},${y}) rotate(${angle})`}>
            <rect width="52" height="36" rx="6" fill="#ffffff" stroke={color} strokeWidth="2" />
            <path
              d="M2 4l24 16 24-16"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}

      {/* le bac / la boîte de réception, au premier plan */}
      <path
        d="M40 108 L92 108 L112 140 L188 140 L208 108 L260 108 L248 152 L52 152 Z"
        fill="#C7D2FE"
        stroke="#6366F1"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="92" y1="108" x2="208" y2="108" stroke="#6366F1" strokeWidth="2" />
    </svg>
  );
}
