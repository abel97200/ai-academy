// Ce fichier centralise tout ce qui concerne le "contenu" des leçons :
// - les types TypeScript qui décrivent une leçon et chaque type de bloc,
// - la fonction qui va lire un fichier JSON de leçon sur le disque.

import fs from "fs";
import path from "path";

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

// Schéma "trio" : quelques nœuds disposés en cercle et reliés entre eux.
// Le champ "kind" est ce qui permet au composant de savoir quoi dessiner.
export type TrioDiagram = {
  kind: "trio";
  nodes: DiagramNode[];
  links: DiagramLink[];
};

// Pour ajouter un nouveau type de schéma plus tard (ex: une frise, un
// arbre...), créer un nouveau type sur ce modèle et l'ajouter ici avec un "|".
export type Diagram = TrioDiagram;

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

// Un "Block" est forcément l'un de ces types (union discriminée par "type").
// TypeScript s'en sert pour vérifier qu'on n'oublie aucun cas au moment
// d'afficher un bloc.
export type Block =
  | ExplicationBlock
  | SchemaBlock
  | DemoBlock
  | ExerciceBlock
  | QuizBlock
  | ValidationBlock;

// Une leçon complète : un identifiant, un titre, et une liste de blocs.
export type Lesson = {
  id: string;
  title: string;
  blocks: Block[];
};

// Lit le fichier JSON d'une leçon et renvoie son contenu typé.
// Les leçons sont rangées ainsi : /content/<cours>/<module>/<leçon>.json
export function getLesson(
  course: string,
  moduleSlug: string,
  lessonId: string
): Lesson {
  const filePath = path.join(
    process.cwd(),
    "content",
    course,
    moduleSlug,
    `${lessonId}.json`
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(fileContent) as Lesson;
}
