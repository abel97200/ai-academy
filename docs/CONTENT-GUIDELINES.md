# Règles de création des leçons

Ce document définit les règles éditoriales obligatoires pour tous les parcours d’AI Academy.

Les contenus doivent respecter, par ordre de priorité :

1. `AI_ACADEMY_VISION.md` ;
2. `AI_ACADEMY_PEDAGOGY.md` ;
3. `AI_ACADEMY_LEARNING_STANDARD.md` ;
4. le blueprint propre au parcours concerné ;
5. le présent document.

En cas de contradiction, la règle la plus récente et la plus spécifique au parcours ou à l’expérience pédagogique doit être signalée avant développement.

## Public cible

L’apprenant est un débutant complet ou presque complet.

Il ne faut jamais supposer qu’il connaît déjà :

- le vocabulaire informatique ;
- la structure d’une application ;
- le terminal ;
- Git et GitHub ;
- les API ;
- les bases de données ;
- les frameworks ;
- le fonctionnement d’un agent IA.

Une explication est validée seulement si elle peut être comprise au premier passage par une personne motivée qui découvre le sujet.

## Principes obligatoires

- Une seule notion principale par leçon.
- Une seule difficulté importante à la fois.
- Les explications sont courtes, simples et techniquement exactes.
- L’apprenant pratique davantage qu’il ne lit.
- Chaque notion abstraite est reliée à une situation concrète.
- Aucun exercice ne demande quelque chose qui n’a pas encore été préparé.
- Une erreur est expliquée sans jugement : pourquoi elle semblait logique, pourquoi elle ne fonctionne pas et comment la corriger.
- Le code est toujours accompagné de son rôle, de ce que l’apprenant doit comprendre, de ce qu’il doit savoir modifier, de ce que l’IA peut produire et de ce qu’il doit vérifier lui-même.
- Les ajouts hors périmètre du MVP ou de la mission sont refusés.

## Ancrage dans le réel

AI Academy enseigne autant que possible à partir de situations, produits, outils et interfaces que l’apprenant rencontrera réellement.

La règle par défaut est :

> Vrai cas ou vrai outil → observation visuelle → question ou manipulation → retour → explication courte → vocabulaire technique → pratique réelle.

Lorsqu’une notion concerne directement un outil réel, cet outil doit être privilégié comme support pédagogique plutôt qu’un exemple fictif autour d’AI Academy.

Exemples recommandés :

- Git et versionnement → Git et GitHub : dépôt, commit, branche, diff, Pull Request et conflit ;
- automatisation → un workflow réel inspiré de Make : déclencheur, modules, données qui circulent, filtres et résultat ;
- déploiement → un vrai flux GitHub → build → déploiement → URL, par exemple avec Vercel lorsque c’est la stack du parcours ;
- terminal → une représentation fidèle du terminal et de vraies commandes adaptées au niveau ;
- Claude Code → le véritable environnement et les actions que l’apprenant devra ensuite reconnaître et réaliser ;
- API → un cas réel de communication entre une application et un service externe, avec requête, réponse et données observables ;
- HTML/CSS → une vraie interface ou une reproduction pédagogique fidèle dont l’apprenant peut relier les éléments visibles au code ;
- agents IA → un besoin réel, avec modèle, instructions, outils, état, décisions, limites et validation humaine rendus observables.

Les exemples fictifs restent autorisés lorsqu’ils simplifient réellement l’apprentissage, protègent des données sensibles ou évitent une dépendance inutile. Ils ne doivent pas être le choix par défaut lorsqu’un exemple réel, stable et compréhensible existe.

AI Academy elle-même ne doit pas devenir l’exemple générique de toutes les notions. L’apprenant doit pouvoir se projeter dans des usages qu’il rencontrera hors de la plateforme.

### Fidélité sans copie

S’inspirer de la logique d’un produit ou de sa pédagogie ne signifie pas copier son cours, ses textes, ses illustrations ou son identité visuelle.

Lorsqu’un produit réel sert de support :

- privilégier les ressources officielles et à jour ;
- utiliser des captures autorisées, des reproductions pédagogiques originales ou des schémas propres à AI Academy selon le besoin ;
- distinguer clairement l’interface réelle d’une simulation pédagogique ;
- ne pas inventer un comportement attribué au produit ;
- vérifier les éléments susceptibles d’évoluer avant publication ou mise à jour d’une leçon ;
- ne jamais exposer de clé, secret, donnée personnelle ou information sensible dans les exemples.

## Expérience visuelle et dynamique

Une leçon ne doit pas ressembler par défaut à une succession de paragraphes dans des cartes.

Elle doit alterner, lorsque la notion s’y prête :

- mises en situation visuelles ;
- captures ou reproductions fidèles d’interfaces réelles ;
- dialogues courts ;
- schémas annotés ;
- zones ou cartes cliquables ;
- questions intégrées dans la scène ;
- simulations ;
- feedback visuel et expliqué ;
- petites démonstrations ;
- manipulations ;
- synthèses courtes.

La couleur, les illustrations et les animations servent la compréhension et la hiérarchie de l’information. Elles ne doivent pas être purement décoratives ni rendre l’interface chargée.

Toutes les leçons ne doivent pas avoir le même gabarit. Le format visuel doit dépendre de la notion : un workflow pour l’automatisation, un diff pour Git, un trajet requête/réponse pour une API, un terminal pour une commande, un diagramme de décision pour un agent.

L’objectif est de conserver un fil conducteur clair tout en variant les mécaniques pédagogiques.

## Ordre recommandé pour introduire une notion

Une leçon suit autant que possible ce rythme :

1. présenter un vrai problème, une vraie interface ou une situation concrète ;
2. demander une prédiction, un choix ou une première action ;
3. montrer ce qui se passe ;
4. expliquer simplement le mécanisme observé ;
5. introduire le terme technique ;
6. faire pratiquer immédiatement dans une simulation ou, lorsque c’est raisonnable, dans le véritable outil ;
7. donner un retour précis ;
8. résumer en langage courant ;
9. demander une petite réutilisation de la notion ;
10. relier la notion au projet fil rouge lorsque cela apporte une valeur réelle.

Le terme technique n’a donc pas toujours besoin d’être donné en premier.

La règle exacte est :

> Ne jamais employer un terme technique non expliqué. Il est toutefois possible de faire découvrir son mécanisme avant d’en donner le nom.

Exemple correct :

- l’apprenant observe une application demander une information à un service externe réel ou fidèlement simulé ;
- il suit la demande et la réponse ;
- seulement ensuite, le cours explique le rôle de l’API.

Exemple incorrect :

- afficher le mot « API » plusieurs fois sans l’expliquer ;
- demander à l’apprenant de mémoriser une définition avant d’avoir compris le mécanisme.

## Interactions réelles

Une leçon ne doit jamais promettre une interaction qui n’existe pas dans l’interface.

Interdit :

- « réponds oui ou non » sans boutons ;
- « classe ces éléments » sans moyen de sélectionner ou déplacer ;
- « remets dans l’ordre » avec du texte uniquement ;
- « observe le résultat » sans démonstration visible ;
- « essaie » lorsque l’apprenant ne peut rien modifier.

Lorsqu’une action est demandée, l’interface doit fournir un moyen réel de l’effectuer et un retour après l’action.

Les interactions à privilégier sont :

- choix cliquable ;
- prédiction ;
- classement ;
- remise en ordre ;
- simulation ;
- exploration d’une capture ou reproduction annotée ;
- modification de code ;
- diagnostic d’erreur ;
- manipulation d’une valeur ;
- observation d’un résultat ;
- nouvelle tentative après correction.

Toute interaction doit rester utilisable sur ordinateur, mobile et au clavier. Une alternative accessible doit exister lorsqu’un glisser-déposer est proposé.

## Explications et analogies

Une analogie sert à rendre le mécanisme intuitif, pas à remplacer l’explication technique.

Elle doit être :

- familière ;
- courte ;
- cohérente avec la notion ;
- suivie rapidement d’un retour vers un cas ou un outil réel.

Une analogie n’est pas conservée si elle crée une fausse représentation difficile à corriger plus tard ou si un exemple réel est tout aussi simple à comprendre.

## Exercices

Chaque exercice doit contenir :

- une consigne précise ;
- le résultat attendu ;
- des indices progressifs ;
- une correction expliquée ;
- des critères de réussite ;
- au moins un exemple acceptable ;
- au moins un exemple insuffisant lorsque cela apporte de la valeur.

Une activité du type « réfléchis mentalement » ne compte pas comme pratique vérifiable.

Lorsque la notion porte sur un outil réel, la progression recommandée est : observer l’outil → manipuler une simulation guidée → reproduire une petite action dans le véritable outil lorsque cela est sûr, gratuit ou raisonnablement accessible.

## Quiz

Chaque leçon contient exactement cinq questions de quiz, sauf décision explicite documentée pour un format pédagogique différent.

Les quiz doivent :

- répartir les bonnes réponses entre plusieurs positions ;
- proposer des réponses toutes plausibles ;
- éviter les distracteurs manifestement absurdes ;
- utiliser des scénarios concrets ;
- vérifier la compréhension et le diagnostic, pas seulement la mémorisation ;
- expliquer pourquoi la bonne réponse est correcte ;
- expliquer pourquoi les autres réponses sont insuffisantes ou incorrectes.

Lorsque cela est pertinent, les questions doivent utiliser une interface, une trace, un extrait de code, un workflow, une réponse d’API, un diff ou un autre artefact réaliste plutôt qu’une question purement abstraite.

## Projet fil rouge

Chaque parcours doit annoncer clairement :

- ce que l’apprenant construit ;
- pourquoi ce projet a été choisi ;
- ce que le projet sait déjà faire ;
- ce qu’il apprend à faire dans le module ;
- ce qu’il ne sait pas encore faire.

AI Academy, la plateforme utilisée pour apprendre, ne doit pas être confondue avec l’application construite par l’apprenant.

Le projet fil rouge ne doit pas empêcher l’utilisation de vrais produits et cas externes pour enseigner une notion. Il sert à réinvestir ce qui a été compris, pas à devenir l’unique exemple de tout le parcours.

## Blocs de contenu

Blocs historiques pris en charge :

`explication`, `schema`, `demo`, `exercice`, `quiz`, `validation`, `code`, `action`, `project`, `assessment`.

Des blocs interactifs supplémentaires peuvent être ajoutés lorsqu’ils répondent à un besoin pédagogique réel et qu’aucun bloc existant ne permet l’interaction attendue.

Avant d’ajouter un nouveau type de bloc, il faut :

1. démontrer le besoin ;
2. vérifier qu’un composant existant ne suffit pas ;
3. construire la version minimale ;
4. assurer la rétrocompatibilité ;
5. ajouter les tests ;
6. documenter le schéma ;
7. vérifier le rendu réel dans le navigateur.

Le moteur doit permettre progressivement des expériences visuelles variées sans créer une page codée en dur pour chaque leçon.

## Validation minimale d’une leçon

Une leçon n’est pas considérée comme terminée uniquement parce que :

- son JSON est valide ;
- les tests passent ;
- le lint et le build réussissent.

Elle doit également réussir une validation réelle d’usage.

La checklist minimale est :

- la notion principale est identifiable ;
- le vocabulaire est expliqué ;
- l’ordre pédagogique est cohérent ;
- un vrai cas ou outil est utilisé lorsqu’il apporte plus de valeur qu’un exemple fictif ;
- l’apprenant voit à quoi la notion ressemble dans un contexte réel lorsque c’est pertinent ;
- la leçon contient suffisamment de visuel et d’action pour ne pas reposer principalement sur la lecture ;
- les interactions annoncées existent réellement ;
- les retours après réponse sont utiles ;
- les exercices peuvent être réalisés ;
- les quiz utilisent des réponses plausibles ;
- le projet fil rouge est compréhensible ;
- la leçon fonctionne sur ordinateur et mobile ;
- la leçon fonctionne au clavier ;
- aucune erreur n’apparaît dans la console ;
- un débutant cible peut terminer la leçon sans aide extérieure indispensable ;
- après la leçon, l’apprenant sait reconnaître la notion lorsqu’il la rencontre dans un vrai outil ou un cas comparable.

La dernière leçon d’un module peut ajouter un bloc `project` et un bloc `assessment` pour valider un livrable observable.

## Validation dans le navigateur

Toute nouvelle mécanique pédagogique doit être testée dans le produit réel, et pas uniquement par lecture du code.

Le test doit vérifier :

- l’ordre d’apparition des informations ;
- le fonctionnement de chaque bouton ;
- les retours corrects et incorrects ;
- la possibilité de recommencer ;
- la progression et la validation ;
- le rendu mobile ;
- la lisibilité des captures, schémas et scènes ;
- l’absence de texte ou de balises mal affichés ;
- l’absence de régression sur les anciennes leçons.

Les tests automatisés complètent cette vérification, mais ne remplacent pas la relecture et l’essai humain de la leçon.

## Critère final : transfert vers le réel

Une leçon est réellement réussie lorsque l’apprenant ne sait pas seulement répondre au quiz, mais peut reconnaître la notion dans un contexte réel et effectuer ou expliquer une petite action correspondante.

Exemples :

- après Git/GitHub, reconnaître un dépôt, un commit, une branche et une Pull Request ;
- après une API, suivre simplement le trajet d’une requête et d’une réponse ;
- après Make, reconnaître le déclencheur, les étapes et le trajet des données dans un scénario ;
- après un déploiement, comprendre le trajet du code jusqu’à l’application publiée.

La mémorisation du vocabulaire ne suffit pas : la compétence doit être transférable hors d’AI Academy.