"use client";

// Anime une donnée (le "payload") qui circule à travers une chaîne
// d'étapes réelles (ex: Formulaire web → CRM → Gmail → Google Sheets).
// Un marqueur avance étape par étape ; à chaque arrêt, le détail de ce qui
// arrive à la donnée s'affiche. Chaque étape reste aussi cliquable
// indépendamment de l'animation (comme un schéma), pour que l'exploration
// ne dépende jamais du minutage de l'animation — utilisable au clavier.
//
// Deux rendus cohabitent ici : le thème sombre historique (par défaut,
// inchangé) et le thème "light-elearning" — une infographie claire et
// colorée où la donnée circule visiblement au-dessus des étapes.

import { useEffect, useRef, useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { LessonTheme, WorkflowStep } from "@/lib/content";

type WorkflowBlockProps = {
  prompt: string;
  payloadLabel: string;
  actionLabel: string;
  steps: WorkflowStep[];
  completionLabel: string;
  theme?: LessonTheme;
};

type Phase = "idle" | "running" | "done";

const STEP_DELAY = 900; // ms passés sur chaque étape
const STEP_DELAY_REDUCED = 150; // ms si prefers-reduced-motion

// Palette cyclique des nœuds en thème clair : bleu (information) / ambre
// (observation) / violet (identité) / vert (résultat) — voir
// docs/CONTENT-SCHEMA-V2.md pour la fonction de chaque couleur.
const LIGHT_STEP_THEMES = [
  { ring: "border-blue-400 bg-blue-100", dot: "bg-blue-500" },
  { ring: "border-amber-400 bg-amber-100", dot: "bg-amber-500" },
  { ring: "border-violet-400 bg-violet-100", dot: "bg-violet-500" },
  { ring: "border-emerald-400 bg-emerald-100", dot: "bg-emerald-500" },
];

export default function WorkflowBlock({
  prompt,
  payloadLabel,
  actionLabel,
  steps,
  completionLabel,
  theme,
}: WorkflowBlockProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  function schedule(fn: () => void, delay: number) {
    timeouts.current.push(setTimeout(fn, delay));
  }

  function handleLancer() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = prefersReducedMotion ? STEP_DELAY_REDUCED : STEP_DELAY;

    setPhase("running");
    setActiveIndex(0);

    steps.forEach((_, index) => {
      if (index === 0) return;
      schedule(() => setActiveIndex(index), index * stepDelay);
    });

    schedule(() => {
      setPhase("done");
    }, steps.length * stepDelay);
  }

  const activeStep = activeIndex !== null ? steps[activeIndex] : null;

  if (theme === "light-elearning") {
    const progressPercent =
      activeIndex !== null && steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0;

    return (
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-6 text-slate-900 shadow-[0_8px_30px_rgba(59,130,246,0.10)] sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          🔄 Workflow
        </span>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          <InlineText text={prompt} />
        </p>

        <div className="mt-8 overflow-x-auto pb-3">
          <div className="relative min-w-max px-4">
            {/* donnée qui circule, au-dessus de la ligne */}
            {activeIndex !== null && (
              <div
                className="pointer-events-none absolute -top-7 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-violet-300 bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-md transition-all duration-500 ease-out motion-reduce:transition-none"
                style={{ left: `calc(${progressPercent}% )`, marginLeft: "2rem" }}
              >
                {payloadLabel}
              </div>
            )}

            <div className="relative flex items-start gap-10">
              <div className="absolute left-8 right-8 top-8 -z-10 h-1 rounded-full bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200" />

              {steps.map((step, index) => {
                const stepTheme = LIGHT_STEP_THEMES[index % LIGHT_STEP_THEMES.length];
                const isActive = activeIndex === index;
                const isPast = activeIndex !== null && index < activeIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Voir ce qui se passe à l'étape ${step.label}`}
                    className="flex w-24 flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl shadow-sm transition-all duration-300 ${
                        isActive
                          ? `${stepTheme.ring} scale-110 shadow-md`
                          : isPast
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {step.emoji ?? "📦"}
                    </div>
                    <span className="text-center text-[11px] font-medium leading-tight text-slate-600">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeStep && (
          <div
            key={activeStep.id}
            className="schema-animate mt-2 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900 sm:p-5"
          >
            <span className="font-semibold">{payloadLabel} · </span>
            <InlineText text={activeStep.detail} />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleLancer}
            disabled={phase === "running"}
            className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          >
            {phase === "running" ? "En cours…" : actionLabel}
          </button>
          <span className="text-xs text-slate-400">
            Tu peux aussi cliquer sur chaque étape pour l&apos;explorer librement.
          </span>
        </div>

        {phase === "done" && (
          <div className="schema-animate mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 sm:p-5">
            ✅ <InlineText text={completionLabel} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Workflow
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground/80">
        <InlineText text={prompt} />
      </p>

      {/* Chaîne des étapes : défile horizontalement si trop large pour tenir
          sur un petit écran, plutôt que de devenir illisible en se tassant. */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="relative flex min-w-max items-start gap-8 px-2">
          <div className="absolute left-8 right-8 top-7 -z-10 h-px bg-white/10" />

          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            const isPast = phase !== "idle" && activeIndex !== null && index < activeIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Voir ce qui se passe à l'étape ${step.label}`}
                className="flex w-24 flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl transition-all duration-300 ${
                    isActive
                      ? "scale-110 border-accent bg-accent/15"
                      : isPast
                        ? "border-success/40 bg-success/[0.06]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  {step.emoji ?? "📦"}
                </div>
                <span className="text-center text-[11px] leading-tight text-foreground/60">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeStep && (
        <div
          key={activeStep.id}
          className="schema-animate mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          <span className="font-medium text-accent">{payloadLabel} · </span>
          <InlineText text={activeStep.detail} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleLancer}
          disabled={phase === "running"}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          {phase === "running" ? "En cours…" : actionLabel}
        </button>
        <span className="text-xs text-foreground/40">
          Tu peux aussi cliquer sur chaque étape pour l&apos;explorer librement.
        </span>
      </div>

      {phase === "done" && (
        <div className="schema-animate mt-4 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm font-medium text-success">
          <InlineText text={completionLabel} />
        </div>
      )}
    </div>
  );
}
