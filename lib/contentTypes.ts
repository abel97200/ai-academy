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
  | AssessmentBlock;

// Une leçon complète : un identifiant, un titre, et une liste de blocs.
// "schemaVersion" est informatif (voir docs/CONTENT-SCHEMA-V2.md) : le
// moteur reconnaît chaque bloc par son "type", donc un fichier sans
// schemaVersion (ancien contenu) continue de fonctionner à l'identique.
export type Lesson = {
  id: string;
  schemaVersion?: number;
  title: string;
  blocks: Block[];
};

// Identifiant unique d'un bloc au sein d'une leçon. Utilisé à la fois par
// le lecteur de leçon (pour savoir quel quiz/action/évaluation a été
// complété) et par lib/course.ts (pour calculer les exigences d'un module
// à partir du contenu réel des leçons) : les deux DOIVENT rester alignés.
export function getBlockId(lessonId: string, blockIndex: number): string {
  return `${lessonId}-block-${blockIndex}`;
}
