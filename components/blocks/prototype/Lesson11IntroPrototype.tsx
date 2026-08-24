"use client";

// PROTOTYPE VISUEL — écran "Situation" de la leçon 1.1 uniquement.
// Objectif : donner un aperçu rapide d'une nouvelle direction visuelle
// (fond clair, coloré, illustration, cartes) SANS refaire tout le design
// system. Volontairement câblé en dur pour ce seul bloc (voir le cas
// spécial dans BlockRenderer.tsx) — pas un composant générique candidat à
// la réutilisation dans d'autres leçons en l'état.
//
// La logique fonctionnelle reste identique à SituationBlock : les données
// (context/question/options) viennent du JSON de la leçon, les 3 choix
// restent cliquables et affichent un feedback, rien n'est codé en dur ici
// à part la mise en forme.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { SituationOption } from "@/lib/content";

type Lesson11IntroPrototypeProps = {
  context: string;
  question: string;
  options: SituationOption[];
};

const CARD_THEMES = [
  {
    border: "border-violet-300",
    ring: "ring-violet-400",
    bg: "bg-violet-50",
    chip: "bg-violet-600",
    text: "text-violet-900",
    feedbackBg: "bg-violet-100",
    feedbackBorder: "border-violet-300",
    feedbackText: "text-violet-900",
  },
  {
    border: "border-blue-300",
    ring: "ring-blue-400",
    bg: "bg-blue-50",
    chip: "bg-blue-600",
    text: "text-blue-900",
    feedbackBg: "bg-blue-100",
    feedbackBorder: "border-blue-300",
    feedbackText: "text-blue-900",
  },
  {
    border: "border-amber-300",
    ring: "ring-amber-400",
    bg: "bg-amber-50",
    chip: "bg-amber-500",
    text: "text-amber-900",
    feedbackBg: "bg-amber-100",
    feedbackBorder: "border-amber-300",
    feedbackText: "text-amber-900",
  },
];

// Petite illustration SVG "faite maison" : Léa à son poste, plusieurs
// emails qui arrivent autour d'elle. Style plat, simple, coloré.
function LeaAtHerDeskIllustration() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="mx-auto h-auto w-full max-w-md"
      role="img"
      aria-label="Illustration de Léa à son poste de travail, entourée de plusieurs emails"
    >
      {/* halo décoratif */}
      <ellipse cx="180" cy="190" rx="150" ry="18" fill="#EDE9FE" />

      {/* bureau */}
      <rect x="40" y="150" width="280" height="14" rx="7" fill="#C4B5FD" />
      <rect x="60" y="164" width="14" height="40" rx="4" fill="#DDD6FE" />
      <rect x="286" y="164" width="14" height="40" rx="4" fill="#DDD6FE" />

      {/* écran */}
      <rect x="120" y="90" width="120" height="72" rx="10" fill="#4C1D95" />
      <rect x="132" y="102" width="96" height="48" rx="6" fill="#EEF2FF" />
      <rect x="140" y="110" width="50" height="6" rx="3" fill="#A5B4FC" />
      <rect x="140" y="122" width="70" height="6" rx="3" fill="#C7D2FE" />
      <rect x="140" y="134" width="40" height="6" rx="3" fill="#A5B4FC" />
      <rect x="168" y="160" width="24" height="10" fill="#4C1D95" />

      {/* Léa */}
      <circle cx="180" cy="70" r="22" fill="#FBCFA0" />
      <path d="M158 66c0-16 44-16 44 0v6h-44z" fill="#7C2D12" />
      <path
        d="M140 150c4-30 22-46 40-46s36 16 40 46z"
        fill="#7C3AED"
      />

      {/* emails qui arrivent, autour de Léa */}
      <g transform="translate(38,40) rotate(-12)">
        <rect width="52" height="36" rx="6" fill="#ffffff" stroke="#6366F1" strokeWidth="2" />
        <path d="M2 4l24 16 24-16" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(270,30) rotate(10)">
        <rect width="52" height="36" rx="6" fill="#ffffff" stroke="#F59E0B" strokeWidth="2" />
        <path d="M2 4l24 16 24-16" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(280,110) rotate(-8)">
        <rect width="46" height="32" rx="6" fill="#ffffff" stroke="#22C55E" strokeWidth="2" />
        <path d="M2 4l21 14 21-14" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(20,110) rotate(9)">
        <rect width="46" height="32" rx="6" fill="#ffffff" stroke="#3B82F6" strokeWidth="2" />
        <path d="M2 4l21 14 21-14" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function Lesson11IntroPrototype({
  context,
  question,
  options,
}: Lesson11IntroPrototypeProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedTheme = selectedIndex !== null ? CARD_THEMES[selectedIndex % CARD_THEMES.length] : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6 text-slate-900 shadow-[0_8px_30px_rgba(124,58,237,0.12)] sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        🔎 Situation
      </span>

      <LeaAtHerDeskIllustration />

      <p className="mt-2 text-center text-base leading-relaxed text-slate-600 sm:text-left">
        <InlineText text={context} />
      </p>

      <div className="mt-5 rounded-2xl border-2 border-dashed border-violet-300 bg-white/70 p-4 sm:p-5">
        <p className="text-lg font-semibold leading-snug text-slate-900">
          <InlineText text={question} />
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option, index) => {
          const theme = CARD_THEMES[index % CARD_THEMES.length];
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left text-sm font-medium shadow-sm transition-all duration-150 active:scale-[0.98] ${theme.bg} ${
                isSelected ? `${theme.border} ring-4 ${theme.ring}` : "border-white hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${theme.chip}`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className={theme.text}>
                <InlineText text={option.label} />
              </span>
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && selectedTheme && (
        <div
          key={selectedIndex}
          className={`schema-animate mt-5 rounded-2xl border-2 p-4 text-sm font-medium leading-relaxed sm:p-5 ${selectedTheme.feedbackBg} ${selectedTheme.feedbackBorder} ${selectedTheme.feedbackText}`}
        >
          💬 <InlineText text={options[selectedIndex].feedback} />
        </div>
      )}
    </div>
  );
}
