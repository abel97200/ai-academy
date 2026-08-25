// Petits diagrammes CSS (pas de SVG lourd nécessaire ici) qui illustrent
// RÉELLEMENT le propos d'un bloc "explication" en thème "light-elearning" —
// pas une icône décorative à côté d'un paragraphe (interdit par
// docs/AI_ACADEMY_VISUAL_LEARNING_STANDARD.md). Écrit en switch (comme
// components/illustrations/registry.tsx) pour éviter tout risque de
// "composant créé pendant le rendu".
//
// Pour ajouter un visuel : lui donner un identifiant ci-dessous, l'utiliser
// depuis n'importe quel bloc "explication" via son champ JSON `visual`.

const MINI_STEPS = ["📩", "🔎", "📊", "✉️"];

// "repeat-pattern" : montre la MÊME suite de 4 mini-icônes qui revient
// plusieurs fois, de plus en plus estompée — rend visible ce qu'est une
// répétition avant même de lire la définition.
function RepeatPatternVisual() {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:items-start">
      {[1, 0.7, 0.45].map((opacity, row) => (
        <div key={row} className="flex items-center gap-1.5" style={{ opacity }}>
          {MINI_STEPS.map((emoji, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm">
                {emoji}
              </span>
              {index < MINI_STEPS.length - 1 && (
                <span aria-hidden="true" className="text-indigo-200">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      ))}
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">
        ↻ encore et encore, toute la journée
      </span>
    </div>
  );
}

// "chain-preview" : aperçu abstrait et monochrome de la chaîne à 4 étapes
// qui sera nommée et détaillée juste après (bloc "schema" suivant) — montre
// le mécanisme avant son vocabulaire, comme le demande le standard visuel.
function ChainPreviewVisual() {
  return (
    <div className="flex items-center justify-center gap-2 sm:justify-start">
      {[0, 1, 2, 3].map((index) => (
        <span key={index} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 rounded-full border-2 border-indigo-300 bg-indigo-100"
          />
          {index < 3 && (
            <span aria-hidden="true" className="h-px w-6 bg-indigo-200 sm:w-10" />
          )}
        </span>
      ))}
    </div>
  );
}

export function ExplicationVisual({ visual }: { visual: string | undefined }) {
  switch (visual) {
    case "repeat-pattern":
      return <RepeatPatternVisual />;
    case "chain-preview":
      return <ChainPreviewVisual />;
    default:
      return null;
  }
}
