"use client";

// Variante claire d'un schéma "diagram" (trio ou flow) : au lieu du SVG à
// nœuds/liens (voir NodesLinksDiagram, gardé inchangé pour ne rien casser
// ailleurs), affiche chaque nœud comme une carte colorée cliquable, reliée
// à la suivante par une flèche. Réutilisable par tout futur bloc "schema"
// en thème "light-elearning" — pas spécifique à la leçon 1.1.

import { useState } from "react";
import type { DiagramNode } from "@/lib/content";

type LightVocabularyCardsProps = {
  nodes: DiagramNode[];
};

const DEFAULT_COLOR = "#6366F1";

// Convertit une couleur hex "#RRGGBB" en sa version avec une opacité donnée
// (ex: "1A" ≈ 10%), pour un fond de carte doux dérivé de la couleur du nœud.
function withAlpha(hex: string, alpha: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex;
}

export default function LightVocabularyCards({ nodes }: LightVocabularyCardsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {nodes.map((node, index) => {
          const color = node.color ?? DEFAULT_COLOR;
          const isSelected = selectedId === node.id;
          return (
            <div key={node.id} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedId(node.id)}
                aria-pressed={isSelected}
                style={{
                  borderColor: color,
                  backgroundColor: withAlpha(color, isSelected ? "33" : "14"),
                }}
                className={`flex min-w-[7rem] flex-col items-center gap-1.5 rounded-2xl border-2 px-4 py-3 text-center shadow-sm transition-all duration-150 active:scale-95 ${
                  isSelected ? "scale-105 shadow-md" : "hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-semibold text-slate-800">{node.label}</span>
              </button>
              {index < nodes.length - 1 && (
                <span aria-hidden="true" className="text-lg text-slate-300">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedNode?.definition && (
        <div
          key={selectedNode.id}
          className="schema-animate mt-5 rounded-2xl border-2 p-4 text-sm leading-relaxed text-slate-700 sm:p-5"
          style={{
            borderColor: withAlpha(selectedNode.color ?? DEFAULT_COLOR, "55"),
            backgroundColor: withAlpha(selectedNode.color ?? DEFAULT_COLOR, "0D"),
          }}
        >
          <p className="mb-1 font-semibold text-slate-900">{selectedNode.label}</p>
          <p>{selectedNode.definition}</p>
        </div>
      )}
    </div>
  );
}
