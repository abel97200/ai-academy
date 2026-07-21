# Format de contenu — Schéma v2

Ce document décrit le format JSON du contenu à partir de la version 2 du moteur. Il complète (et ne remplace pas) `docs/` si un format v1 était déjà documenté ailleurs : **tous les blocs v1 restent valides**, le moteur les accepte toujours.

## `schemaVersion`

Chaque fichier de leçon peut porter un champ `"schemaVersion": 2` à la racine. Il est **informatif** : le moteur reconnaît chaque bloc par son champ `"type"` (union discriminée), donc un fichier sans `schemaVersion` (ancien contenu) continue de fonctionner à l'identique. Les nouveaux contenus doivent porter `"schemaVersion": 2`.

```json
{
  "id": "lesson-1-1",
  "schemaVersion": 2,
  "title": "...",
  "blocks": [ ... ]
}
```

## Étapes du lecteur de leçon

Le lecteur regroupe automatiquement les blocs d'une leçon en 5 étapes (pas besoin de le déclarer dans le JSON — c'est déduit du `type` de chaque bloc) :

| Étape | Blocs qui y apparaissent |
|---|---|
| 1. Comprendre | `explication` |
| 2. Observer | `schema`, `demo` |
| 3. Essayer | `exercice`, `action`, `code`, `project` |
| 4. Corriger | `quiz` |
| 5. Vérifier | `assessment`, `validation` |

Une leçon n'a pas besoin d'avoir un bloc dans chaque étape : seules les étapes qui contiennent au moins un bloc sont affichées.

---

## Blocs existants (inchangés)

Voir `content/claude-code/module-1/lesson-1-1.json` pour des exemples réels. Résumé rapide :

- `explication` — `{ type, content }`
- `schema` — `{ type, diagram, caption }` (voir section Schémas)
- `demo` — `{ type, content }`
- `exercice` — `{ type, question, hints[], solution }`
- `quiz` — `{ type, questions: [{ question, options[], answer, explanation }] }`
- `validation` — `{ type }`

---

## Nouveaux blocs

### `code`

Affiche un extrait de code **en lecture seule** (pas d'éditeur intégré), avec un nom de fichier, une coloration de langage informative, et une explication.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `type` | `"code"` | oui | |
| `filename` | `string` | oui | Nom affiché en en-tête (ex: `"todo.json"`) |
| `language` | `string` | oui | Étiquette du langage (ex: `"json"`, `"javascript"`) |
| `code` | `string` | oui | Le code, avec ses retours à la ligne (`\n`) |
| `explanation` | `string` | oui | Explication affichée sous le code |
| `focusLines` | `number[]` | non | Numéros de ligne (à partir de 1) à mettre en surbrillance |

```json
{
  "type": "code",
  "filename": "tache.json",
  "language": "json",
  "code": "{\n  \"id\": 1,\n  \"titre\": \"Faire les courses\",\n  \"terminee\": false\n}",
  "focusLines": [4],
  "explanation": "\"terminee\" est la donnée qui change quand tu coches la case : elle passe de false à true."
}
```

### `action`

Demande à l'apprenant de **faire** quelque chose de concret (pas juste répondre à une question) et d'écrire une trace de ce qu'il a fait avant de pouvoir confirmer.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `type` | `"action"` | oui | |
| `id` | `string` | oui | Identifiant unique dans la leçon (sert à enregistrer la confirmation) |
| `title` | `string` | oui | Titre de l'action |
| `instructions` | `string` | oui | Ce que l'apprenant doit faire |
| `successCriteria` | `string` | oui | Ce qui définit une réussite |
| `evidence` | `string` | oui | Consigne/placeholder pour la preuve écrite par l'apprenant (pas une réponse fournie par le contenu) |

```json
{
  "type": "action",
  "id": "expliquer-tracker",
  "title": "Explique le tracker avec tes mots",
  "instructions": "Décris ce qui se passe, étape par étape, quand tu coches une tâche dans le tracker.",
  "successCriteria": "Tu mentionnes bien les trois piliers : interface, données, logique.",
  "evidence": "Écris ton explication ici (3 à 5 phrases)…"
}
```

### `project`

Un mini-projet avec des livrables à cocher et des indices. (Bloc prêt pour les futurs modules ; le Module 1 n'en a pas besoin, mais le moteur le supporte et le teste.)

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `type` | `"project"` | oui | |
| `id` | `string` | oui | Identifiant unique dans la leçon |
| `title` | `string` | oui | |
| `brief` | `string` | oui | Description du projet |
| `deliverables` | `string[]` | oui | Liste de livrables à cocher |
| `successCriteria` | `string[]` | oui | Critères de réussite |
| `hints` | `string[]` | non | Indices, révélés un par un |

### `assessment`

L'évaluation finale d'un module : une checklist que l'apprenant confirme avoir satisfaite.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `type` | `"assessment"` | oui | |
| `title` | `string` | oui | |
| `requirements` | `string[]` | oui | Liste d'exigences à cocher avant de pouvoir confirmer |

```json
{
  "type": "assessment",
  "title": "Évaluation finale du module",
  "requirements": [
    "Je sais nommer les trois piliers d'une application.",
    "Je sais expliquer la différence entre frontend et backend.",
    "Je sais dire à quoi sert une base de données.",
    "Je sais décrire le trajet d'une information via une API."
  ]
}
```

---

## Schéma `flow`

En plus du schéma `trio` (3 nœuds en cercle), le moteur sait dessiner un schéma **linéaire** (une chaîne d'étapes), utile pour représenter un trajet séquentiel (ex : Navigateur → Serveur → Base de données).

| Champ | Type | Description |
|---|---|---|
| `kind` | `"flow"` | |
| `direction` | `"horizontal"` \| `"vertical"` | Sens d'alignement des nœuds |
| `nodes` | `DiagramNode[]` | Mêmes champs que pour `trio` (`id`, `label`, `color?`, `definition?`) |
| `links` | `DiagramLink[]` | Mêmes champs que pour `trio` (`from`, `to`) |

```json
{
  "type": "schema",
  "diagram": {
    "kind": "flow",
    "direction": "horizontal",
    "nodes": [
      { "id": "interface", "label": "Interface", "definition": "..." },
      { "id": "api", "label": "API", "definition": "..." },
      { "id": "serveur", "label": "Serveur", "definition": "..." },
      { "id": "donnees", "label": "Base de données", "definition": "..." }
    ],
    "links": [
      { "from": "interface", "to": "api" },
      { "from": "api", "to": "serveur" },
      { "from": "serveur", "to": "donnees" }
    ]
  },
  "caption": "Le trajet d'une information, de l'écran à la base de données."
}
```

Le même composant `NodesLinksDiagram` dessine les deux types de schéma (`trio` en cercle, `flow` en ligne) : nœuds cliquables, définition + lecture à voix haute, surbrillance indigo, tout est identique aux schémas existants.

---

## Métadonnées de niveau et de module (`course.json`)

Le fichier `course.json` décrit maintenant des **niveaux**, chacun listant ses **modules** (par slug), plus les spécialisations et le projet final. Voir `lib/courseTypes.ts` pour les types exacts, et `content/claude-code/course.json` pour le contenu réel. Chaque module porte désormais, en plus des champs existants (`objective`, `usefulness`, `lessons`) :

- `level` — slug du niveau parent
- `prerequisites` — slugs des modules requis avant celui-ci
- `skills` — compétences visées
- `deliverable` — livrable pratique attendu
- `estimatedMinutes` — temps estimé

---

## Progression (localStorage)

En plus de `completedLessons` et `activityDates` (existants), la progression retient maintenant :

- `quizScores` — meilleur score (0 à 100) obtenu par bloc de quiz, par identifiant de bloc
- `actionsDone` — identifiants des blocs `action` confirmés
- `assessmentsDone` — identifiants des blocs `assessment` confirmés

La lecture de la progression est **défensive** : tout champ manquant ou de mauvais type retombe sur une valeur vide par défaut, donc une donnée ancienne (v1) ou corrompue ne bloque jamais l'application — c'est la migration.
