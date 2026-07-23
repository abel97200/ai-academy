# Blueprint pédagogique — Parcours « Créer des agents IA »

## Statut du document

Ce document constitue le cahier des charges pédagogique de référence pour le parcours « Créer des agents IA » d’AI Academy.

Il ne contient pas encore le texte complet des 72 leçons. Il fixe l’architecture, les principes, la stack, les livrables, les évaluations et la progression du projet fil rouge.

---

## 1. Positionnement du parcours

### Public cible

Le parcours s’adresse à des débutants motivés ayant déjà des bases légères en programmation.

L’apprenant doit savoir :

- utiliser un terminal ;
- modifier un fichier ;
- comprendre un JSON simple ;
- lancer un projet Node.js ;
- utiliser Git et GitHub à un niveau débutant ;
- comprendre les notions de base d’API, de variables d’environnement et de tests.

### Objectif final

À la fin du parcours, l’apprenant doit être capable de concevoir, construire, tester, sécuriser, publier et maintenir un système d’agents IA supervisé.

### Stack pédagogique principale

- TypeScript ;
- Node.js ;
- API OpenAI ou SDK officiel d’agents ;
- JSON Schema ou Zod pour les sorties structurées ;
- Vitest pour les tests ;
- GitHub pour le versionnement ;
- Vercel pour la publication lorsque c’est adapté.

Claude Code peut être utilisé comme assistant de développement. Il ne doit jamais être présenté comme une brique obligatoire de l’agent.

---

## 2. Principes pédagogiques obligatoires

- La difficulté augmente progressivement.
- Les Modules 1 et 2 restent majoritairement conceptuels et guidés.
- Les premiers scripts réellement exécutables commencent au Module 3.
- Une abstraction avancée n’est introduite qu’après avoir expliqué le mécanisme sous-jacent.
- Une notion principale par leçon.
- L’apprenant pratique davantage qu’il ne lit.
- Le code doit toujours être expliqué.
- Chaque module produit un livrable concret.
- Chaque module ajoute une capacité réelle au projet Sentinelle.
- L’évaluation commence dès les premiers modules.
- Les erreurs, cas limites et scénarios d’échec sont enseignés explicitement.
- Le multi-agents n’est jamais présenté comme nécessaire lorsqu’un agent unique suffit.
- La sécurité, les limites, les coûts et la supervision humaine sont intégrés tout au long du parcours.

Chaque module distingue clairement :

- ce que l’apprenant doit comprendre ;
- ce qu’il doit savoir modifier ;
- ce que Claude Code peut produire ;
- ce que l’apprenant doit obligatoirement vérifier lui-même.

---

## 3. Projet fil rouge — Sentinelle

Sentinelle est un système qui :

1. reçoit un sujet de veille ;
2. recherche ou analyse des ressources pédagogiques ;
3. évalue leur pertinence ;
4. prépare une synthèse ;
5. demande une validation humaine avant publication.

Le projet doit évoluer module après module.

Il permet d’introduire progressivement :

- les instructions ;
- les sorties structurées ;
- les appels d’outils ;
- la boucle agentique ;
- l’état ;
- la mémoire ;
- le RAG ;
- la sécurité ;
- les évaluations ;
- la validation humaine ;
- le multi-agents ;
- l’orchestration ;
- la publication ;
- la maintenance.

---

## 4. Architecture des 12 modules

1. Comprendre ce qu’est un agent IA
2. Définir une mission utile et vérifiable
3. Comprendre modèles, instructions et contexte
4. Construire la boucle de décision
5. Donner des outils à l’agent
6. Construire un premier agent utile
7. Ajouter mémoire et gestion du contexte
8. Maîtriser autonomie, limites et sécurité
9. Évaluer et superviser un agent
10. Concevoir un système multi-agents
11. Orchestrer, planifier et reprendre
12. Publier et maintenir un système d’agents

---

## 5. Structure pédagogique commune des modules

Chaque module comporte six leçons suivant autant que possible cette progression :

1. Comprendre le concept
2. Observer une démonstration
3. Construire une première version
4. Provoquer et diagnostiquer un échec
5. Améliorer, tester et sécuriser
6. Intégrer dans Sentinelle et valider le module

Chaque module doit produire :

- du code exécutable à partir du Module 3 ;
- une commande de lancement ;
- une preuve visible ;
- un test automatique ;
- un scénario d’échec ;
- une décision de conception justifiée ;
- une évolution concrète de Sentinelle ;
- une grille d’évaluation.

---

## 6. Exigences pour les quiz et évaluations

Les quiz doivent :

- répartir les bonnes réponses entre les différentes positions ;
- utiliser des distracteurs crédibles ;
- éviter les réponses absurdes ou trop faciles à éliminer ;
- intégrer des scénarios réalistes ;
- inclure des diagnostics de traces, contrats d’outils et erreurs ;
- éviter d’évaluer uniquement la mémorisation.

Les exercices doivent inclure :

- des critères de réussite ;
- une grille de correction ;
- des exemples acceptables ;
- des exemples insuffisants ;
- des critères bloquants ;
- une preuve enregistrée dans Sentinelle lorsque cela est pertinent.

L’évaluation commence dès le Module 2 avec :

- un comportement attendu ;
- un cas nominal ;
- un cas limite ;
- un refus attendu ;
- une mesure de réussite.

Ce jeu d’évaluation doit être enrichi dans les modules suivants.

---

## 7. Concepts techniques à intégrer progressivement

Le parcours doit couvrir progressivement :

- instructions système ;
- contexte ;
- modèle ;
- sorties structurées ;
- JSON Schema ;
- Zod ;
- appels d’outils ;
- validation des paramètres ;
- boucle agentique ;
- gestion des erreurs ;
- état d’exécution ;
- historique de conversation ;
- mémoire de travail ;
- profil utilisateur ;
- mémoire durable ;
- base documentaire ;
- recherche sémantique ;
- RAG ;
- prompt injection ;
- données non fiables provenant des outils ;
- fuite de secrets ;
- permissions excessives ;
- actions irréversibles ;
- allowlists ;
- limites de coût ;
- limites de durée ;
- conditions d’arrêt ;
- idempotence ;
- arrêt d’urgence ;
- journal d’audit ;
- traces ;
- coûts ;
- latence ;
- évaluations ;
- validation humaine ;
- multi-agents ;
- orchestration ;
- planification ;
- reprise ;
- déploiement ;
- gestion d’incident.

---

## 8. Distinctions obligatoires

Le parcours doit distinguer clairement :

- le modèle ;
- l’agent ;
- les instructions ;
- les outils ;
- l’état ;
- la mémoire ;
- le RAG ;
- l’orchestrateur ;
- la validation humaine.

Il doit aussi distinguer :

- les principes généraux applicables à tous les agents ;
- les choix spécifiques à OpenAI ;
- l’utilisation directe de l’API ;
- l’utilisation du SDK officiel d’agents.

Le parcours doit rester transférable à d’autres fournisseurs et outils.

---

## 9. Règle de simplicité technique

Toujours privilégier la solution la plus simple permettant d’atteindre l’objectif pédagogique.

Ne pas recommander :

- plusieurs agents lorsqu’un seul suffit ;
- une base vectorielle lorsqu’un stockage simple suffit ;
- un orchestrateur complexe lorsqu’une boucle claire suffit ;
- une infrastructure de production lourde pour un projet d’apprentissage.

Pour chaque choix technique important, préciser :

- la solution minimale ;
- la solution intermédiaire ;
- la solution robuste ;
- les critères justifiant le passage à l’étape suivante.

---

## 10. Corrections prioritaires des Modules 1 et 2

Les Modules 1 et 2 existent déjà, mais doivent être améliorés sur les points suivants :

- réduire les répétitions ;
- varier les erreurs fréquentes ;
- rendre les exercices plus vérifiables ;
- répartir les bonnes réponses dans les quiz ;
- améliorer les distracteurs ;
- intégrer davantage de scénarios ;
- clarifier le rôle de Claude Code ;
- ajouter des critères d’évaluation détaillés ;
- préparer le premier jeu d’évaluation de Sentinelle.

Erreurs à varier selon les leçons :

- confondre réponse et action ;
- oublier l’état ;
- utiliser une mission trop large ;
- masquer une condition d’échec ;
- mélanger entrée et instruction ;
- créer des critères impossibles à mesurer.

---

## 11. Format attendu pour le blueprint détaillé

Le futur blueprint complet doit contenir :

- un diagnostic synthétique ;
- une architecture améliorée ;
- un tableau des 12 modules ;
- le détail des six leçons de chaque module ;
- la progression du projet Sentinelle ;
- la stratégie d’évaluation ;
- les critères de réussite finale ;
- les risques pédagogiques à éviter.

Pour chaque module, il doit préciser :

- l’objectif mesurable ;
- les compétences acquises ;
- les six leçons progressives ;
- le livrable ;
- l’évolution de Sentinelle ;
- l’exercice pratique ;
- le scénario d’échec ;
- le test automatique ;
- la grille d’évaluation.

---

## 12. Critères de réussite finale du parcours

Le parcours est réussi si l’apprenant est capable de :

- expliquer clairement ce qu’est un agent ;
- cadrer une mission mesurable ;
- choisir entre simple automatisation, agent unique et système multi-agents ;
- construire un agent TypeScript fonctionnel ;
- utiliser des sorties structurées ;
- connecter et sécuriser des outils ;
- gérer l’état et la mémoire ;
- distinguer mémoire et RAG ;
- écrire et exécuter des tests ;
- provoquer et diagnostiquer des erreurs ;
- définir des budgets, délais et conditions d’arrêt ;
- superviser un agent ;
- intégrer une validation humaine ;
- publier le système ;
- documenter les risques ;
- maintenir et corriger le système en cas d’incident.

---

## 13. Risques pédagogiques à éviter

- trop de théorie sans exécution réelle ;
- trop de code sans explication ;
- dépendance excessive à un fournisseur ;
- confusion entre mémoire et RAG ;
- multi-agents introduit trop tôt ;
- sécurité reléguée à un seul module ;
- évaluations uniquement déclaratives ;
- quiz prévisibles ;
- exercices sans preuve ;
- projet fil rouge décoratif ;
- sur-ingénierie ;
- sentiment de maîtrise sans capacité démontrée.
