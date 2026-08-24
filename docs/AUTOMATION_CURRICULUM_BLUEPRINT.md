# AI Academy — Blueprint pédagogique « Automatiser de A à Z »

## Statut
Document de référence produit et pédagogique pour le troisième parcours AI Academy.

## Positionnement

« Automatiser de A à Z » est une **formation autonome à part entière**. Elle ne dépend d’aucun autre parcours AI Academy.

Un apprenant débutant doit pouvoir commencer ici sans avoir suivi « Créer une application avec Claude Code » ni « Créer des agents IA ».

Lorsque des notions comme API, JSON, webhook, authentification ou IA deviennent nécessaires, elles sont expliquées dans ce parcours au niveau requis. Les autres parcours peuvent être proposés comme approfondissements, jamais comme prérequis.

Make est l’outil principal de mise en pratique, mais **la compétence enseignée est l’automatisation**, pas seulement l’utilisation de Make.

## Promesse

À la fin du parcours, l’apprenant doit être capable :

- d’expliquer simplement ce qu’est une automatisation ;
- d’observer et cartographier un processus personnel ou professionnel ;
- d’identifier ce qui mérite ou non d’être automatisé ;
- d’estimer les gains, risques et difficultés ;
- de concevoir un workflow avant de le construire ;
- de construire des automatisations avec Make ;
- de comprendre les données qui circulent ;
- d’utiliser conditions, filtres, routes et traitements multiples ;
- de choisir un déclencheur adapté ;
- de comprendre et utiliser webhooks, HTTP et API ;
- de tester, diagnostiquer et fiabiliser une automatisation ;
- d’utiliser l’IA uniquement lorsqu’elle apporte une valeur réelle ;
- de documenter, expliquer et livrer une automatisation à une entreprise.

## Public cible

Débutants complets ou quasi débutants en automatisation.

Aucun prérequis provenant d’un autre parcours AI Academy.

L’apprenant doit seulement être capable d’utiliser un navigateur, créer des comptes sur des services web et suivre des instructions simples.

## Principes pédagogiques obligatoires

Le parcours doit être une vraie formation e-learning, et non une documentation Make découpée en pages.

Chaque notion doit privilégier la séquence suivante lorsque pertinente :

**situation réelle → observation → théorie simple → cas de figure → décision de l’apprenant → conséquence/feedback → vocabulaire technique → simulation → pratique → vérification de la compréhension.**

La théorie reste obligatoire, mais elle doit être courte, visuelle et accessible.

Les leçons doivent varier leurs mécaniques : scènes métier, workflows animés, cartes, données en mouvement, décisions, tris, construction, diagnostic, simulations d’interface, quiz et mini-défis.

Les exemples doivent être concrets et crédibles : PME, artisan, commercial, support client, formulaire, Google Sheets, Gmail, Slack, CRM, API ou autres services réels lorsque cela est pertinent. Éviter les exemples abstraits du type « AI Academy pourrait faire X ».

L’interface doit être colorée, dynamique, moderne et lisible, dans l’esprit des bons produits e-learning interactifs, sans copier leur identité visuelle ni leurs contenus.

## Rôle de Make

AI Academy reste le professeur et le simulateur. Make est l’atelier réel.

On ne demande pas à l’apprenant d’ouvrir Make simplement pour observer quelque chose qu’AI Academy peut expliquer elle-même.

Un passage dans le vrai Make est utilisé lorsqu’une compétence réelle doit être acquise : créer un scénario, connecter une application, mapper des données, construire un filtre/router, recevoir un webhook, appeler une API, gérer une erreur ou réaliser un projet.

Cible indicative : environ 70 % de l’expérience pédagogique dans AI Academy et 30 % de pratique réelle dans Make, à ajuster selon les tests utilisateurs.

## Architecture générale

- 9 modules
- 54 leçons (6 par module)
- 3 mini-projets structurants
- exercices et cas de diagnostic réguliers
- 1 mission PME finale
- 1 examen final combinant théorie, audit, diagnostic et construction

Durée cible initiale : 25 à 35 heures, à valider par l’usage.

---

# Module 1 — Comprendre l’automatisation

## Objectif
Comprendre ce qu’est une automatisation, comment elle fonctionne et reconnaître les situations où elle est ou n’est pas pertinente.

### 1.1 — Une automatisation, c’est quoi ?
Situation d’une employée qui répète la même suite d’actions pour chaque demande client. Identifier les répétitions puis transformer visuellement le processus en `déclencheur → données → action → résultat`.

### 1.2 — Tâche, processus et workflow
Remettre dans l’ordre les étapes d’une demande de devis puis distinguer tâche, processus et workflow.

### 1.3 — Déclencheur, action et données
Suivre visuellement une fiche client entre plusieurs applications et identifier ce qui démarre le workflow, ce qui circule et ce qui agit.

### 1.4 — Automatisation, IA ou agent IA ?
Classer des cas réels : facture automatique, relance à J+3, catégorisation d’un email libre, recherche autonome multi-étapes. Montrer qu’une règle classique est souvent préférable à l’IA.

### 1.5 — Tout ce qui peut être automatisé ne doit pas l’être
Décider entre automatiser, assister ou garder humain pour plusieurs situations : confirmation simple, remboursement exceptionnel, décision RH, validation juridique, copie répétitive de données.

### 1.6 — Première enquête d’automatisation
Observer la journée d’une petite entreprise, repérer les tâches répétitives et construire un premier workflow visuel.

### Validation du module
L’apprenant doit savoir expliquer une automatisation avec ses propres mots et reconnaître déclencheur, données et actions dans un cas inconnu.

### Make
Non nécessaire.

---

# Module 2 — Auditer un processus

## Objectif
Savoir observer un processus, comprendre son fonctionnement actuel, identifier ses problèmes et décider objectivement s’il mérite d’être automatisé.

### 2.1 — Observer avant de proposer
Une entreprise veut automatiser ses devis. L’apprenant choisit les questions à poser aux salariés avant de proposer une solution.

### 2.2 — Cartographier le processus actuel (As-Is)
Construire visuellement la carte du processus actuel : acteurs, outils, données, étapes et décisions.

### 2.3 — Trouver les pertes de temps et les erreurs
Identifier répétition, attente, double saisie, oubli, erreur et goulot d’étranglement à partir de données concrètes.

### 2.4 — Est-ce un bon candidat à l’automatisation ?
Évaluer fréquence, temps consommé, stabilité des règles, structure des données, exceptions, stabilité des applications, risques et gains potentiels.

### 2.5 — Estimer le gain et la complexité
Calculer simplement le temps économisé et comparer plusieurs opportunités selon valeur, difficulté et risque.

### 2.6 — Concevoir le processus futur (To-Be)
Transformer l’As-Is en processus cible et décider explicitement ce qui reste sous contrôle humain.

### Mini-projet 1 — Audit Express
À partir d’un dossier PME inédit : produire As-Is, problèmes, score d’opportunité, priorité et To-Be.

### Make
Non nécessaire.

---

# Module 3 — Construire son premier scénario dans Make

## Objectif
Savoir lire l’interface Make et construire, tester puis activer une automatisation simple avec de vraies applications.

### 3.1 — Lire un scénario Make sans être perdu
Passer d’une représentation pédagogique à une interface réaliste de Make et identifier scénario, module, connexion, historique et Run once.

### 3.2 — Applications, modules et connexions
Comprendre qu’une application représente un service et qu’un module réalise une opération avec ce service.

### 3.3 — Créer un déclencheur
Cas réel : une nouvelle ligne apparaît dans Google Sheets. Identifier puis configurer le point de départ.

### 3.4 — Ajouter une action
Construire une première chaîne, par exemple Google Sheets → Gmail ou notification.

### 3.5 — Faire passer une donnée d’un module au suivant
Première introduction concrète au mapping : utiliser une donnée issue du déclencheur dans l’action suivante.

### 3.6 — Tester avant d’activer
Utiliser Run once, observer les données, vérifier le résultat, corriger puis activer le scénario.

### Réalisation
Nouvelle demande → enregistrement/lecture → notification.

### Make
Oui. Première construction réelle obligatoire.

---

# Module 4 — Comprendre les données et le mapping

## Objectif
Comprendre ce qui circule réellement dans une automatisation et être capable de sélectionner, transformer et transmettre les bonnes données.

### 4.1 — Qu’est-ce qu’une donnée ?
Partir d’une fiche client lisible avant d’introduire la représentation informatique.

### 4.2 — Suivre une donnée dans un workflow
Suivre séparément email, budget ou nom à travers formulaire → Make → tableur → email.

### 4.3 — Comprendre le mapping
Relier visuellement une donnée de sortie à un champ d’entrée et observer immédiatement les conséquences d’un mauvais mapping.

### 4.4 — Types de données
Découvrir texte, nombre, booléen et date à travers des situations pratiques et les erreurs provoquées par un mauvais type.

### 4.5 — Collections et tableaux
Comprendre progressivement une structure contenant un client puis plusieurs produits, sans supposer la connaissance préalable du JSON.

### 4.6 — Transformer les données
Appliquer des transformations simples sur texte, dates et nombres pour préparer une donnée avant l’étape suivante.

### Mini-projet 2 — Pipeline de données
Formulaire → nettoyage → transformation → stockage → message personnalisé.

### Make
Oui, principalement dans la seconde moitié du module.

---

# Module 5 — Faire prendre des décisions au workflow

## Objectif
Construire des automatisations capables d’appliquer des règles, de suivre plusieurs chemins et de traiter plusieurs éléments.

### 5.1 — Une automatisation peut appliquer des règles
Construire une condition métier sans commencer par le vocabulaire technique.

### 5.2 — Le Filter
Visualiser des dossiers qui passent ou sont bloqués, puis reproduire la logique dans Make.

### 5.3 — Plusieurs conditions : ET / OU
Résoudre des situations professionnelles combinant plusieurs critères.

### 5.4 — Le Router
Orienter support, commercial ou facturation vers différents chemins selon les données reçues.

### 5.5 — Traiter plusieurs éléments : Iterator
Faire éclater visuellement un tableau de plusieurs produits afin de traiter chaque élément séparément.

### 5.6 — Regrouper des résultats : Aggregator
Comprendre l’opération inverse et produire un résultat consolidé à partir de plusieurs éléments.

### Validation
Cas de diagnostic avec workflow volontairement mal construit.

### Make
Oui.

---

# Module 6 — Déclencher au bon moment

## Objectif
Savoir choisir et configurer le mécanisme de déclenchement adapté à un besoin réel.

### 6.1 — « Quand ? » est une décision de conception
Comparer rapport hebdomadaire, nouveau formulaire et vérification régulière de commandes.

### 6.2 — Planification (Scheduling)
Comprendre fréquence, horaires et impact sur les exécutions/coûts.

### 6.3 — Polling
Visualiser un scénario qui vérifie régulièrement s’il existe de nouvelles données.

### 6.4 — Webhook
Comprendre l’inversion : l’événement prévient immédiatement l’automatisation.

### 6.5 — Construire un vrai webhook
Recevoir réellement des données dans Make et observer l’exécution.

### 6.6 — Choisir le bon déclencheur
Résoudre plusieurs situations professionnelles et justifier chaque choix.

### Make
Obligatoire pour la manipulation webhook ; les concepts sont d’abord enseignés dans AI Academy.

---

# Module 7 — API et HTTP : connecter presque n’importe quoi

## Objectif
Comprendre pourquoi une API est parfois nécessaire et savoir réaliser un appel HTTP simple depuis Make sans prérequis provenant d’un autre parcours.

### 7.1 — Pourquoi avons-nous besoin d’une API ?
Deux services ne disposent pas d’une intégration directe. L’apprenant doit comprendre le besoin avant de découvrir le terme.

### 7.2 — Requête et réponse
Visualiser Make → demande → API → réponse → Make et inspecter une réponse simplifiée.

### 7.3 — GET : demander une information
Construire une requête de lecture à partir d’une vraie documentation API simplifiée.

### 7.4 — POST : envoyer ou créer une information
Comparer GET et POST à travers les actions produites plutôt que par mémorisation de définitions.

### 7.5 — URL, endpoint, paramètres, headers, authentification et body
Démonter une requête comme un puzzle et replacer chaque élément au bon endroit. Introduire JSON uniquement au niveau nécessaire.

### 7.6 — Utiliser HTTP dans Make
Construire `déclencheur → API → réponse → extraction → action` avec une vraie API adaptée à l’apprentissage.

### Mini-projet 3 — Intégration API
Réaliser une intégration sans recette complète, avec indices progressifs.

### Make
Oui.

---

# Module 8 — Construire des automatisations fiables

## Objectif
Savoir comprendre une panne, diagnostiquer sa cause, choisir la bonne stratégie de récupération et éviter des effets dangereux.

### 8.1 — Pourquoi les automatisations cassent
Provoquer donnée manquante, API indisponible, authentification incorrecte et format inattendu.

### 8.2 — Lire une exécution
Suivre entrée → modules → erreur dans un historique réaliste.

### 8.3 — Diagnostiquer avant de corriger
Identifier où l’erreur apparaît, quelle donnée la provoque, pourquoi et avec quelle conséquence avant toute modification.

### 8.4 — Que faire après une erreur ?
Choisir entre réessayer, ignorer, route alternative, arrêter ou demander une intervention humaine.

### 8.5 — Error handlers et reprise
Construire les mécanismes nécessaires dans Make.

### 8.6 — Doublons et effets dangereux
Cas du double clic générant deux commandes, deux factures ou deux emails. Introduire l’idée d’idempotence en langage simple avant son nom technique.

### Évaluation — Autopsie d’un workflow
Diagnostiquer plusieurs automatisations cassées sans tutoriel pas-à-pas.

### Make
Oui.

---

# Module 9 — Passer de constructeur à automaticien

## Objectif
Savoir intégrer l’IA avec discernement, concevoir pour une autre personne et préparer/livrer une solution professionnelle.

### 9.1 — Quand utiliser l’IA
Comparer une règle déterministe (`montant > 10 000`) avec une tâche nécessitant de comprendre un email libre.

### 9.2 — Ajouter une étape IA
Exemple : email → classification IA → Router → équipe appropriée.

### 9.3 — Ne pas faire aveuglément confiance à l’IA
Traiter les sorties IA comme potentiellement incertaines et choisir quand une validation humaine est nécessaire.

### 9.4 — Concevoir pour quelqu’un d’autre
Nommage, documentation, permissions, secrets, coûts et maintenabilité.

### 9.5 — Présenter une solution à un client
Expliquer problème, As-Is, proposition, bénéfices, limites, risques et rôle humain sans jargon inutile.

### 9.6 — Préparer la mission finale
Dernier cas guidé avec diminution progressive des indices.

### Make
Oui selon le cas ; le module ne remplace pas le parcours spécialisé Agents IA.

---

# Projet final — Mission PME

## Principe
L’apprenant reçoit un dossier client suffisamment réaliste pour devoir raisonner et non suivre une recette.

Le dossier comprend notamment : présentation de l’entreprise, échanges avec des salariés, volumes, temps de traitement, outils utilisés, exemples d’emails/formulaires/tableaux, erreurs observées, contraintes et attentes du dirigeant. Certaines informations peuvent être secondaires afin de reproduire un vrai contexte d’audit.

## Phase 1 — Audit
Reconstituer seul le processus As-Is.

## Phase 2 — Diagnostic
Identifier répétitions, erreurs, attentes, doubles saisies, tâches à faible valeur et décisions qui doivent rester humaines.

## Phase 3 — Priorisation
Comparer plusieurs opportunités selon valeur, faisabilité, effort et risque.

## Phase 4 — To-Be
Dessiner et justifier le processus cible.

## Phase 5 — Construction
Construire la solution dans Make. Aucun tutoriel intégral. Des indices progressifs peuvent être proposés et leur utilisation peut réduire le score d’autonomie.

## Phase 6 — Tests
Tester au minimum : cas normal, donnée manquante, doublon, exception, service indisponible et cas nécessitant un humain.

## Phase 7 — Livraison
Présenter la solution comme à un dirigeant : fonctionnement, bénéfices, limites, risques, maintenance et responsabilités humaines.

---

# Examen final

| Épreuve | Poids |
|---|---:|
| Théorie et compréhension | 15 % |
| Cas de figure | 15 % |
| Audit d’un processus | 20 % |
| Diagnostic de workflows | 20 % |
| Construction pratique | 30 % |

Seuil global recommandé : **75 %**.

Conditions bloquantes recommandées :

- Audit ≥ 60 %
- Construction pratique ≥ 60 %

Réussir les quiz seuls ne permet donc jamais de valider le parcours.

---

# Mécaniques visuelles et interactives

Le moteur pédagogique doit pouvoir combiner au moins les mécaniques suivantes :

1. **Scène métier** — personnages, applications, problème concret.
2. **Workflow animé** — circulation visible des données.
3. **Décision** — plusieurs choix plausibles avec feedback contextualisé.
4. **Simulation d’outil** — représentation pédagogique de Make, API, email, tableur, etc.
5. **Diagnostic** — localiser et expliquer une anomalie.
6. **Construction** — assembler, ordonner ou modifier un workflow.
7. **Cours visuel** — théorie courte, illustration, exemple et cas de figure.

Toutes les leçons ne doivent pas suivre exactement le même gabarit. La mécanique doit être choisie en fonction de la notion à apprendre.

## Quiz

Les quiz doivent privilégier compréhension et transfert :

- réponses correctes réparties ;
- distracteurs crédibles ;
- situations réalistes ;
- questions de diagnostic ;
- prédiction du comportement d’un workflow ;
- justification d’un choix d’architecture ;
- mémorisation pure limitée aux notions réellement indispensables.

---

# Critère de réussite pédagogique final

Le parcours est réussi uniquement si, face à un processus métier inédit, l’apprenant peut :

1. l’expliquer ;
2. le cartographier ;
3. identifier ce qui mérite d’être automatisé ;
4. identifier ce qui doit rester humain ;
5. estimer grossièrement l’intérêt de l’automatisation ;
6. concevoir le workflow cible ;
7. construire une solution fonctionnelle ;
8. suivre et transformer les données ;
9. gérer conditions, déclencheurs et intégrations ;
10. tester les cas normaux et les échecs ;
11. diagnostiquer un problème ;
12. expliquer et documenter la solution pour une autre personne.

Le parcours ne doit jamais donner l’illusion de compétence parce que l’apprenant sait seulement reconnaître les boutons de Make ou réussir des QCM.

---

# Règle d’implémentation

Ne pas implémenter les 54 leçons en une seule mission de développement.

Ordre recommandé :

1. implémenter le Module 1 dans le nouveau format visuel ;
2. le tester réellement comme apprenant débutant sur mobile et ordinateur ;
3. vérifier compréhension, rythme, interactions et charge de lecture ;
4. corriger le moteur pédagogique si nécessaire ;
5. figer ce standard ;
6. seulement ensuite développer les modules suivants par petites versions testables.

Le premier module sert donc également de pilote UX/pédagogique pour le parcours complet.