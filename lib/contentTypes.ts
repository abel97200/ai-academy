// Types décrivant une leçon et chaque type de bloc, plus quelques
// fonctions pures qui en dérivent. Séparé de lib/content.ts (qui lit des
// fichiers via "fs", donc réservé au serveur) pour que les composants
// client (ex: le lecteur de leçon en étapes) puissent les utiliser sans
// essayer d'embarquer "fs" dans le navigateur.

// --- Les différents types de blocs -----------------------------------
// Chaque bloc a un champ "type" qui dit ce qu'il est, et des champs
// propres à ce type. Pour ajouter un nouveau type de bloc plus tard,
// il suffit de créer un nouveau type ci-dessous et de l'ajouter à
// l'union "Block" un peu plus bas.

export type ExplicationBlock = {
  type: "explication";
  content: string;
  // Identifiant d'un micro-diagramme (voir components/blocks/
  // ExplicationVisuals.tsx) qui illustre le propos — utilisé seulement par
  // le thème "light-elearning". Optionnel : sans thème clair, ignoré, et
  // une explication sans "visual" reste un texte simple (acceptable pour
  // une phrase de transition courte).
  visual?: string;
};

// --- Schémas dessinés par le code (pas d'image à fournir) --------------
// Un schéma décrit des nœuds (des boîtes avec un libellé) reliés par des
// liens. Le composant qui l'affiche calcule lui-même leur position : dans
// le JSON, on n'a donc jamais à écrire de coordonnées.

export type DiagramNode = {
  id: string; // identifiant unique du nœud, utilisé par les liens ("from"/"to")
  label: string; // texte affiché dans la boîte
  color?: string; // couleur optionnelle (ex: "#6366F1") ; sinon couleur neutre
  definition?: string; // texte affiché (et lu à voix haute) quand on clique sur ce nœud
};

export type DiagramLink = {
  from: string; // id du nœud de départ
  to: string; // id du nœud d'arrivée
};

// Schéma "trio" : des nœuds disposés en cercle et reliés entre eux.
export type TrioDiagram = {
  kind: "trio";
  nodes: DiagramNode[];
  links: DiagramLink[];
};

// Schéma "flow" : les mêmes nœuds/liens, mais alignés en ligne (horizontale
// ou verticale) plutôt qu'en cercle — utile pour représenter un trajet
// séquentiel (ex: Navigateur → Serveur → Base de données).
export type FlowDiagram = {
  kind: "flow";
  direction: "horizontal" | "vertical";
  nodes: DiagramNode[];
  links: DiagramLink[];
};

// Pour ajouter un nouveau type de schéma plus tard (ex: un arbre...),
// créer un nouveau type sur ce modèle et l'ajouter ici avec un "|".
export type Diagram = TrioDiagram | FlowDiagram;

export type SchemaBlock = {
  type: "schema";
  diagram: Diagram;
  caption: string; // légende affichée sous le schéma
};

export type DemoBlock = {
  type: "demo";
  content: string;
};

export type ExerciceBlock = {
  type: "exercice";
  question: string;
  hints: string[]; // indices, révélés un par un
  solution: string;
};

// Une question de quiz : la question, ses options, l'index de la bonne
// réponse, et une explication pédagogique affichée après coup (juste ou
// faux), pour que l'utilisateur comprenne le raisonnement, pas seulement
// le résultat.
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number; // index de la bonne réponse dans "options"
  explanation: string;
};

// Un bloc "quiz" contient une LISTE de questions, enchaînées une par une.
export type QuizBlock = {
  type: "quiz";
  questions: QuizQuestion[];
};

export type ValidationBlock = {
  type: "validation";
};

// --- Nouveaux blocs (schéma v2) -----------------------------------------

// Extrait de code en lecture seule (pas d'éditeur intégré), avec un nom de
// fichier, un langage informatif, et une explication.
export type CodeBlock = {
  type: "code";
  filename: string;
  language: string;
  code: string;
  explanation: string;
  focusLines?: number[]; // numéros de ligne (à partir de 1) à mettre en avant
};

// Demande à l'apprenant de FAIRE quelque chose de concret, et d'écrire une
// trace de ce qu'il a fait ("evidence") avant de pouvoir confirmer.
export type ActionBlock = {
  type: "action";
  id: string; // identifiant unique dans la leçon, sert à enregistrer la confirmation
  title: string;
  instructions: string;
  successCriteria: string;
  evidence: string; // consigne/placeholder pour la preuve écrite par l'apprenant
};

// Un mini-projet avec des livrables à cocher et des indices.
export type ProjectBlock = {
  type: "project";
  id: string;
  title: string;
  brief: string;
  deliverables: string[];
  successCriteria: string[];
  hints?: string[];
};

// L'évaluation finale d'un module : une checklist que l'apprenant confirme
// avoir satisfaite.
export type AssessmentBlock = {
  type: "assessment";
  title: string;
  requirements: string[];
};

// --- Nouveaux blocs (schéma v3 — pilote "Automatiser de A à Z") --------
// Nés d'un besoin concret : faire découvrir une notion par la manipulation
// (observer une répétition, classer un cas, remettre une suite dans
// l'ordre, suivre une donnée qui circule) plutôt que par la lecture d'une
// définition. Voir docs/CONTENT-SCHEMA-V2.md pour le détail de chaque bloc.

// Une situation de départ (un problème concret), suivie d'une question à
// choix. Contrairement à un quiz, il n'y a pas de bonne/mauvaise réponse
// imposée : chaque option a son propre retour, affiché immédiatement au
// clic, et l'apprenant peut en essayer plusieurs avant de continuer. Sert
// à faire émerger une intuition avant toute définition.
export type SituationOption = {
  label: string;
  feedback: string;
  // Ton du feedback quand ce choix est sélectionné, utilisé seulement par
  // le thème "light-elearning" (voir Lesson["theme"]) : "insight" met en
  // avant l'observation clé attendue (succès, vert) ; "neutral" (défaut)
  // guide vers cette observation sans la présenter comme une erreur — un
  // bloc "situation" reste exploratoire, jamais noté juste/faux.
  tone?: "insight" | "neutral";
};

export type SituationBlock = {
  type: "situation";
  context: string;
  question: string;
  options: SituationOption[];
  // Identifiant d'une illustration du petit registre partagé (voir
  // components/illustrations/registry.tsx), utilisée seulement par le
  // thème "light-elearning". Optionnel : sans thème clair, ignoré.
  illustration?: string;
  // Courte phrase affichée au-dessus de la question (ex: "Avant de parler
  // d'outil, observons une situation très courante."), utilisée seulement
  // par le thème "light-elearning". Optionnel.
  kicker?: string;
};

// Un jeu de tri : classer chaque élément dans l'une de 2 à 4 catégories, en
// cliquant (pas de glisser-déposer, pour rester simple au clavier comme au
// tactile). Chaque item révèle son verdict et son explication au clic, et
// reste modifiable : se tromper n'a aucune conséquence, l'important est de
// comprendre pourquoi. Le nombre de catégories est libre (2 pour un tri
// binaire, 3 pour "automatiser / assister / garder humain", etc.).
export type TriCategory = {
  id: string;
  label: string;
  // Couleur (hex) utilisée seulement par le thème "light-elearning", pour
  // relier visuellement une catégorie à sa couleur ailleurs dans la leçon
  // (ex: les mêmes 4 rôles que le bloc "schema" qui les a introduits).
  // Optionnelle : sans thème clair, ignorée.
  color?: string;
};

export type TriItem = {
  id: string;
  label: string;
  emoji?: string;
  correctCategoryId: string;
  explanation: string;
};

export type TriBlock = {
  type: "tri";
  instruction: string;
  categories: TriCategory[]; // au moins 2
  items: TriItem[];
  // Identifiant d'une illustration du registre partagé (voir
  // components/illustrations/registry.tsx), utilisée seulement par le
  // thème "light-elearning" pour ancrer visuellement le cas à classer.
  // Optionnel : sans thème clair, ignoré.
  illustration?: string;
};

// Une carte de synthèse courte (une minute maximum, sans jargon), utilisée
// pour clore une leçon : le résumé standard réutilisable par toute future
// leçon, pensé comme pendant de "explication" mais pour l'étape Vérifier.
export type ResumeBlock = {
  type: "resume";
  content: string;
};

// Une donnée (le "payload") qui circule visiblement à travers une chaîne
// d'étapes réelles (ex: Formulaire web → CRM → Gmail → Google Sheets).
// Contrairement à "schema" (statique, juste cliquable), ce bloc anime le
// trajet : un marqueur avance étape par étape, avec un temps de pause sur
// chaque étape pour expliquer ce qui arrive à la donnée à ce moment précis.
// Chaque étape reste aussi cliquable indépendamment de l'animation, pour
// une exploration libre (accessible au clavier, sans dépendre du minutage).
export type WorkflowStep = {
  id: string;
  label: string;
  emoji?: string;
  detail: string; // ce qui se passe pour la donnée à cette étape
};

export type WorkflowBlock = {
  type: "workflow";
  prompt: string;
  payloadLabel: string; // ce qui circule, ex: "🗂️ Fiche client"
  actionLabel: string; // libellé du bouton qui lance l'animation
  steps: WorkflowStep[]; // au moins 2, dans l'ordre du trajet
  completionLabel: string; // message affiché une fois le trajet terminé
};

// Un exercice de remise en ordre : l'apprenant clique les éléments dans
// l'ordre qu'il pense correct (jamais de glisser-déposer), peut annuler son
// dernier choix, puis vérifie sa séquence complète. Chaque position reçoit
// un retour visuel correct/incorrect, et l'exercice reste recommençable.
export type OrdreItem = {
  id: string;
  label: string;
  emoji?: string;
};

export type OrdreBlock = {
  type: "ordre";
  instruction: string;
  items: OrdreItem[]; // présentés dans un ordre mélangé (pas l'ordre correct)
  correctOrder: string[]; // identifiants des items, dans l'ordre attendu
};

// Un "Block" est forcément l'un de ces types (union discriminée par "type").
// TypeScript s'en sert pour vérifier qu'on n'oublie aucun cas au moment
// d'afficher un bloc.
export type Block =
  | ExplicationBlock
  | SchemaBlock
  | DemoBlock
  | ExerciceBlock
  | QuizBlock
  | ValidationBlock
  | CodeBlock
  | ActionBlock
  | ProjectBlock
  | AssessmentBlock
  | SituationBlock
  | TriBlock
  | ResumeBlock
  | WorkflowBlock
  | OrdreBlock;

// Une leçon complète : un identifiant, un titre, et une liste de blocs.
// "schemaVersion" est informatif (voir docs/CONTENT-SCHEMA-V2.md) : le
// moteur reconnaît chaque bloc par son "type", donc un fichier sans
// schemaVersion (ancien contenu) continue de fonctionner à l'identique.
// "layout" choisit comment le lecteur présente les blocs :
// - "stages" (défaut) : regroupés en 5 onglets par TYPE de bloc
//   (Comprendre/Observer/Essayer/Corriger/Vérifier) — voir lessonStages.ts.
// - "sequence" : affichés un par un, strictement dans l'ordre du JSON, sans
//   regroupement. Nécessaire quand la pédagogie exige un ordre narratif
//   précis (ex: observer une répétition avant de nommer le mécanisme), ce
//   que le regroupement par type ne peut pas garantir : un bloc
//   "explication" finirait toujours dans l'onglet "Comprendre", quelle que
//   soit sa place réelle dans le déroulé écrit.
//
// "theme" choisit la direction visuelle des blocs de la leçon :
// - absent (défaut) : thème sombre historique, inchangé.
// - "light-elearning" : thème clair, coloré et illustré (pilote : Module 1
//   / leçon 1.1 du parcours Automatisation). Chaque composant de bloc
//   reçoit ce thème et choisit sa propre mise en forme ; un bloc qui ne
//   propose pas encore de variante claire retombe simplement sur son
//   rendu par défaut, donc ce champ est sûr à ajouter progressivement,
//   leçon par leçon.
export type Lesson = {
  id: string;
  schemaVersion?: number;
  layout?: "stages" | "sequence";
  theme?: "light-elearning";
  title: string;
  blocks: Block[];
};

// Raccourci de type pour les composants de bloc, qui reçoivent tous ce
// même thème en prop (voir Lesson["theme"] ci-dessus).
export type LessonTheme = Lesson["theme"];

// Identifiant unique d'un bloc au sein d'une leçon. Utilisé à la fois par
// le lecteur de leçon (pour savoir quel quiz/action/évaluation a été
// complété) et par lib/course.ts (pour calculer les exigences d'un module
// à partir du contenu réel des leçons) : les deux DOIVENT rester alignés.
export function getBlockId(lessonId: string, blockIndex: number): string {
  return `${lessonId}-block-${blockIndex}`;
}
