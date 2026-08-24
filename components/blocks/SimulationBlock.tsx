"use client";

// Le cœur interactif de la leçon pilote : une simulation de requête/réponse
// entre l'apprenant, l'application, un intermédiaire encore désigné par
// "?", et un service externe (variable selon le scénario). Un même bloc
// peut proposer plusieurs scénarios (météo, itinéraire, connexion Google…),
// affichés comme des puces, pour faire comprendre que le mécanisme se
// généralise — avant même de savoir comment il s'appelle.

import { useEffect, useRef, useState } from "react";
import InlineText from "@/components/blocks/InlineText";
import type { SimulationScenario } from "@/lib/content";

type SimulationBlockProps = {
  prompt: string;
  actionLabel: string;
  scenarios: SimulationScenario[];
};

type Phase = "idle" | "running" | "done";
type Direction = "aller" | "retour";

const STEP_DELAY = 650; // ms entre deux nœuds
const STEP_DELAY_REDUCED = 120; // ms si prefers-reduced-motion (avance vite, sans glisser)

export default function SimulationBlock({
  prompt,
  actionLabel,
  scenarios,
}: SimulationBlockProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [dotPosition, setDotPosition] = useState(0); // index du nœud (0 à 3) le plus proche du marqueur
  const [direction, setDirection] = useState<Direction>("aller");
  const [message, setMessage] = useState<string | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = scenarios[scenarioIndex];

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  function schedule(fn: () => void, delay: number) {
    timeouts.current.push(setTimeout(fn, delay));
  }

  function resetAnimation() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("idle");
    setDotPosition(0);
    setMessage(null);
  }

  function handleChangeScenario(index: number) {
    resetAnimation();
    setScenarioIndex(index);
  }

  function handleLancer() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = prefersReducedMotion ? STEP_DELAY_REDUCED : STEP_DELAY;

    setPhase("running");
    setDirection("aller");
    setMessage(scenario.requestLabel);
    setDotPosition(0);

    for (let step = 1; step <= 3; step += 1) {
      schedule(() => setDotPosition(step), step * stepDelay);
    }

    const arrivalDelay = 3 * stepDelay + 400;
    schedule(() => {
      setDirection("retour");
      setMessage(scenario.responseLabel);
    }, arrivalDelay);

    for (let step = 1; step <= 3; step += 1) {
      schedule(() => setDotPosition(3 - step), arrivalDelay + step * stepDelay);
    }

    schedule(() => {
      setPhase("done");
      setMessage(null);
    }, arrivalDelay + 3 * stepDelay + 200);
  }

  const nodes: { emoji: string; label: string }[] = [
    { emoji: "🧑", label: "Toi" },
    { emoji: "🤖", label: "AI Academy" },
    { emoji: "❓", label: "?" },
    { emoji: scenario.serviceEmoji ?? "🌐", label: scenario.serviceLabel },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        Simulation
      </span>
      <p className="mt-2 text-base leading-relaxed text-foreground/80">
        <InlineText text={prompt} />
      </p>

      {scenarios.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {scenarios.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChangeScenario(index)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
                index === scenarioIndex
                  ? "bg-accent text-white"
                  : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {item.emoji ? `${item.emoji} ` : ""}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Chaîne des 4 nœuds + marqueur animé */}
      <div className="relative mt-6 flex items-start justify-between">
        <div className="absolute left-[12.5%] right-[12.5%] top-7 -z-10 h-px bg-white/10" />
        <div
          aria-hidden="true"
          className="absolute top-7 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(99,102,241,0.7)] transition-all duration-500 motion-reduce:transition-none"
          style={{
            left: `${12.5 + dotPosition * 25}%`,
            opacity: phase === "running" ? 1 : 0,
          }}
        />

        {nodes.map((node, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl transition-all duration-300 ${
                phase === "running" && dotPosition === index
                  ? "scale-110 border-accent bg-accent/15"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {node.emoji}
            </div>
            <span className="text-center text-[11px] text-foreground/60">
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {message && (
        <div className="schema-animate mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-center text-sm text-foreground/80">
          {direction === "aller" ? "→ " : "← "}
          <InlineText text={message} />
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
      </div>

      {phase === "done" && (
        <div className="schema-animate mt-4 rounded-xl border border-success/30 bg-success/[0.08] px-4 py-3 text-sm font-medium text-success">
          AI Academy t&apos;affiche : <InlineText text={scenario.resultLabel} />
        </div>
      )}
    </div>
  );
}
