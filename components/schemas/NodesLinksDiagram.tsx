"use client";

// Composant générique : il dessine des nœuds (des boîtes avec un libellé)
// reliés par des liens, à partir d'une simple liste de nœuds + une liste
// de liens. On ne donne jamais de coordonnées dans le JSON : ce composant
// calcule lui-même où placer chaque nœud, en les répartissant sur un
// cercle (ce qui dessine un joli triangle pour 3 nœuds, un "trio").
//
// Chaque nœud est cliquable : un clic affiche sa définition juste en
// dessous du schéma, et la fait lire à voix haute (synthèse vocale du
// navigateur). Rien ne se lance jamais tout seul : uniquement au clic.

import { useEffect, useState } from "react";
import type { DiagramLink, DiagramNode } from "@/lib/content";

type NodesLinksDiagramProps = {
  nodes: DiagramNode[];
  links: DiagramLink[];
};

// Dimensions du dessin, exprimées en "unités SVG" (indépendantes de la
// taille réelle à l'écran grâce au viewBox : le schéma reste net et
// s'adapte à toutes les largeurs, du mobile au grand écran).
const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 260;
const CENTER_X = VIEW_WIDTH / 2;
const CENTER_Y = VIEW_HEIGHT / 2 + 6;
const RADIUS = 85;
const BOX_WIDTH = 128;
const BOX_HEIGHT = 56;

const DEFAULT_BORDER_COLOR = "rgba(245, 245, 247, 0.2)";
const ACCENT_COLOR = "#6366f1";

// Position du nœud numéro "index" parmi "total" nœuds, répartis
// régulièrement sur un cercle en commençant tout en haut.
function getNodePosition(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y + RADIUS * Math.sin(angle),
  };
}

// Distance (depuis le centre d'une boîte) à laquelle une ligne doit
// s'arrêter pour toucher son bord plutôt que de passer par-dessus le texte.
function edgeClearance(dx: number, dy: number) {
  const angle = Math.atan2(dy, dx);
  const halfWidth = BOX_WIDTH / 2;
  const halfHeight = BOX_HEIGHT / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return 1 / Math.sqrt((cos * cos) / (halfWidth * halfWidth) + (sin * sin) / (halfHeight * halfHeight));
}

// Lance la lecture à voix haute d'un texte, en français. On coupe d'abord
// toute lecture en cours pour ne jamais superposer deux voix.
function speakFrench(
  text: string,
  onStart: () => void,
  onEnd: () => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

export default function NodesLinksDiagram({ nodes, links }: NodesLinksDiagramProps) {
  // Le nœud survolé (temporaire) et le nœud sélectionné (persiste après un
  // clic, jusqu'au clic sur un autre nœud). "activeId" est celui des deux
  // qui doit être mis en avant visuellement à l'instant présent.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const activeId = hoveredId ?? selectedId;

  useEffect(() => {
    // Détection d'une capacité du navigateur au montage : nécessaire.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    // On coupe toute lecture en cours si le composant disparaît de l'écran
    // (ex: navigation vers une autre page).
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const positions = new Map(
    nodes.map((node, index) => [node.id, getNodePosition(index, nodes.length)])
  );
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  // Un nœud reste "net" s'il n'y a pas de mise en avant en cours, si c'est
  // lui qui est mis en avant, ou s'il est relié au nœud mis en avant.
  function isNodeRelated(nodeId: string) {
    if (activeId === null || activeId === nodeId) return true;
    return links.some(
      (link) =>
        (link.from === activeId && link.to === nodeId) ||
        (link.to === activeId && link.from === nodeId)
    );
  }

  function isLinkRelated(link: DiagramLink) {
    return activeId === null || link.from === activeId || link.to === activeId;
  }

  function handleNodeClick(node: DiagramNode) {
    setSelectedId(node.id);
    if (node.definition) {
      speakFrench(
        node.definition,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }

  function toggleSpeech() {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (selectedNode?.definition) {
      speakFrench(
        selectedNode.definition,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }

  return (
    <>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Schéma reliant : ${nodes.map((node) => node.label).join(", ")}`}
      >
        {/* Les liens d'abord, pour qu'ils passent derrière les nœuds. */}
        {links.map((link, index) => {
          const from = positions.get(link.from);
          const to = positions.get(link.to);
          if (!from || !to) return null;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.hypot(dx, dy);
          const ux = dx / length;
          const uy = dy / length;
          const startClearance = edgeClearance(dx, dy);
          const endClearance = edgeClearance(-dx, -dy);

          const related = isLinkRelated(link);

          return (
            <line
              key={`${link.from}-${link.to}-${index}`}
              x1={from.x + ux * startClearance}
              y1={from.y + uy * startClearance}
              x2={to.x - ux * endClearance}
              y2={to.y - uy * endClearance}
              stroke={related ? ACCENT_COLOR : DEFAULT_BORDER_COLOR}
              strokeWidth={related && activeId !== null ? 2.5 : 1.5}
              strokeLinecap="round"
              className="schema-link schema-animate"
              style={{
                opacity: related ? 1 : 0.3,
                animationDelay: `${(nodes.length + index) * 100}ms`,
              }}
            />
          );
        })}

        {/* Puis les nœuds (une boîte + son libellé), cliquables. */}
        {nodes.map((node, index) => {
          const position = positions.get(node.id);
          if (!position) return null;
          const { x, y } = position;
          const isActive = activeId === node.id;
          const isSelected = selectedId === node.id;
          const related = isNodeRelated(node.id);
          const borderColor = isActive ? ACCENT_COLOR : node.color ?? DEFAULT_BORDER_COLOR;

          return (
            <g
              key={node.id}
              className="schema-node schema-animate cursor-pointer"
              style={{
                opacity: related ? 1 : 0.4,
                transform: isActive ? "scale(1.06)" : "scale(1)",
                transformOrigin: `${x}px ${y}px`,
                filter: isActive
                  ? "drop-shadow(0 0 10px rgba(99, 102, 241, 0.55))"
                  : "none",
                animationDelay: `${index * 100}ms`,
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Afficher la définition de ${node.label}`}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleNodeClick(node)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleNodeClick(node);
                }
              }}
            >
              <rect
                x={x - BOX_WIDTH / 2}
                y={y - BOX_HEIGHT / 2}
                width={BOX_WIDTH}
                height={BOX_HEIGHT}
                rx={16}
                fill={isActive ? "rgba(99, 102, 241, 0.12)" : "rgba(245, 245, 247, 0.04)"}
                stroke={borderColor}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f5f5f7"
                fontSize={15}
                fontWeight={500}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Zone d'explication : n'apparaît qu'après un clic sur un nœud.
          La "key" force un fondu à chaque nouveau nœud sélectionné. */}
      {selectedNode?.definition && (
        <div
          key={selectedNode.id}
          className="schema-animate mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-accent">{selectedNode.label}</h3>
            {speechSupported && (
              <button
                type="button"
                onClick={toggleSpeech}
                className="shrink-0 rounded-full border border-accent/30 px-3 py-1 text-xs font-medium text-accent transition-all duration-150 hover:bg-accent/10 active:scale-95"
              >
                {isSpeaking ? "🔇 Couper la voix" : "🔊 Réécouter"}
              </button>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            {selectedNode.definition}
          </p>
        </div>
      )}
    </>
  );
}
