"use client";

// Une situation de départ (un problème concret), suivie d'une question à
// choix. Contrairement à un quiz, il n'y a pas de bonne/mauvaise réponse
// imposée : chaque option a son propre retour, affiché immédiatement au
// clic, et l'apprenant peut en essayer plusieurs avant de continuer. Sert
// à faire émerger une intuition avant toute définition.
//
// Deux rendus cohabitent dans ce même composant :
// - le rendu par défaut (thème sombre historique), inchangé ;
// - le rendu "light-elearning" (voir Lesson["theme"]) : une scène claire,
//   illustrée et colorée, pilotée pour la leçon 1.1 du Module 1
//   "Automatiser de A à Z". Les deux partagent les mêmes données
//   (context/question/options) : seule la mise en forme change.

import { useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import { RegisteredIllustration } from "@/components/illustrations/registry";
import type { LessonTheme, SituationOption } from "@/lib/content";

type SituationBlockProps = {
  context: string;
  question: string;
  options: SituationOption[];
  illustration?: string;
  kicker?: string;
  theme?: LessonTheme;
};

export default function SituationBlock({
  context,
  question,
  options,
  illustration,
  kicker,
  theme,
}: SituationBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (theme === "light-elearning") {
    return (
      <LightSituationScene
        context={context}
        question={question}
        options={options}
        illustration={illustration}
        kicker={kicker}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Situation
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground/80">
        <InlineText text={context} />
      </p>
      <p className="mt-4 text-base font-medium text-foreground">
        <InlineText text={question} />
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                isSelected
                  ? "border-accent bg-accent/[0.08] text-foreground"
                  : "border-white/10 text-foreground/85 hover:border-white/20"
              }`}
            >
              <InlineText text={option.label} />
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <div
          key={selectedIndex}
          className="schema-animate mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          <InlineText text={options[selectedIndex].feedback} />
        </div>
      )}
    </div>
  );
}

// --- Rendu "light-elearning" ---------------------------------------------

// Palette décorative des 3 cartes de réponse (violet/bleu/ambre — identité
// AI Academy / information / observation, voir docs/CONTENT-SCHEMA-V2.md).
// Le vert n'apparaît jamais ici : il est réservé au feedback "insight",
// pour rester la couleur qui signale une vraie réussite.
const OPTION_THEMES = [
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    ring: "ring-violet-300",
    chip: "bg-violet-600",
    text: "text-violet-900",
    feedbackBg: "bg-violet-50",
    feedbackBorder: "border-violet-200",
    feedbackText: "text-violet-900",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-300",
    chip: "bg-blue-600",
    text: "text-blue-900",
    feedbackBg: "bg-blue-50",
    feedbackBorder: "border-blue-200",
    feedbackText: "text-blue-900",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-300",
    chip: "bg-amber-500",
    text: "text-amber-900",
    feedbackBg: "bg-amber-50",
    feedbackBorder: "border-amber-200",
    feedbackText: "text-amber-900",
  },
];

const INSIGHT_THEME = {
  ring: "ring-emerald-400",
  border: "border-emerald-300",
  feedbackBg: "bg-emerald-50",
  feedbackBorder: "border-emerald-200",
  feedbackText: "text-emerald-900",
};

type LightSituationSceneProps = {
  context: string;
  question: string;
  options: SituationOption[];
  illustration?: string;
  kicker?: string;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

function LightSituationScene({
  context,
  question,
  options,
  illustration,
  kicker,
  selectedIndex,
  onSelect,
}: LightSituationSceneProps) {
  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null;
  const selectedIsInsight = selectedOption?.tone === "insight";
  const selectedTheme = selectedIsInsight
    ? INSIGHT_THEME
    : selectedIndex !== null
      ? OPTION_THEMES[selectedIndex % OPTION_THEMES.length]
      : null;

  return (
    <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6 text-slate-900 shadow-[0_8px_30px_rgba(124,58,237,0.10)] sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          🔎 Situation
        </span>
        {kicker && <span className="text-sm italic text-slate-500">{kicker}</span>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5 lg:items-center">
        <div className="order-2 lg:order-1 lg:col-span-2">
          <p className="text-base leading-relaxed text-slate-600">
            <InlineText text={context} />
          </p>
        </div>
        {illustration && (
          <div className="order-1 lg:order-2 lg:col-span-3">
            <RegisteredIllustration id={illustration} />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border-2 border-dashed border-violet-300 bg-white/70 p-4 sm:p-5">
        <p className="text-lg font-semibold leading-snug text-slate-900">
          <InlineText text={question} />
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option, index) => {
          const optionTheme = OPTION_THEMES[index % OPTION_THEMES.length];
          const isSelected = selectedIndex === index;
          const isInsight = option.tone === "insight";
          const ringClass = isSelected
            ? isInsight
              ? `${INSIGHT_THEME.border} ring-4 ${INSIGHT_THEME.ring}`
              : `${optionTheme.border} ring-4 ${optionTheme.ring}`
            : "border-white hover:-translate-y-0.5 hover:shadow-md";
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left text-sm font-medium shadow-sm transition-all duration-150 active:scale-[0.98] ${optionTheme.bg} ${ringClass}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${optionTheme.chip}`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className={optionTheme.text}>
                <InlineText text={option.label} />
              </span>
            </button>
          );
        })}
      </div>

      {selectedOption && selectedTheme && (
        <div
          key={selectedIndex}
          className={`schema-animate mt-5 rounded-2xl border-2 p-4 text-sm leading-relaxed sm:p-5 ${selectedTheme.feedbackBg} ${selectedTheme.feedbackBorder} ${selectedTheme.feedbackText}`}
        >
          <p className="mb-1 flex items-center gap-2 font-semibold">
            {selectedIsInsight ? (
              <>
                <span aria-hidden="true">✅</span> Bonne observation
              </>
            ) : (
              <>
                <span aria-hidden="true">🧭</span> À y regarder de plus près
              </>
            )}
          </p>
          <p className="font-normal">
            <InlineText text={selectedOption.feedback} />
          </p>
        </div>
      )}
    </div>
  );
}
