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

## Ordre recommandé pour introduire une notion

Une leçon suit autant que possible ce rythme :

1. présenter un problème ou une situation concrète ;
2. demander une prédiction, un choix ou une première action ;
3. montrer ce qui se passe ;
4. expliquer simplement le mécanisme observé ;
5. introduire le terme technique ;
6. faire pratiquer immédiatement ;
7. donner un retour précis ;
8. résumer en langage courant ;
9. relier la notion au projet fil rouge.

Le terme technique n’a donc pas toujours besoin d’être donné en premier.

La règle exacte est :

> Ne jamais employer un terme technique non expliqué. Il est toutefois possible de faire découvrir son mécanisme avant d’en donner le nom.

Exemple correct :

- l’apprenant observe une application demander une météo à un service externe ;
- il suit la demande et la réponse ;
- seulement ensuite, le cours explique que cet intermédiaire s’appelle une API.

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
- suivie d’un retour vers le fonctionnement réel de l’application.

Une analogie n’est pas conservée si elle crée une fausse représentation difficile à corriger plus tard.

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

Exemple faible :

- API ;
- couleur du bouton ;
- câble de recharge.

Exemple utile :

« La progression disparaît après actualisation. Quelle partie semble en cause ? »

- l’affichage ;
- le calcul ;
- la conservation de la donnée.

## Projet fil rouge

Chaque parcours doit annoncer clairement :

- ce que l’apprenant construit ;
- pourquoi ce projet a été choisi ;
- ce que le projet sait déjà faire ;
- ce qu’il apprend à faire dans le module ;
- ce qu’il ne sait pas encore faire.

AI Academy, la plateforme utilisée pour apprendre, ne doit pas être confondue avec l’application construite par l’apprenant.

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
- les interactions annoncées existent réellement ;
- les retours après réponse sont utiles ;
- les exercices peuvent être réalisés ;
- les quiz utilisent des réponses plausibles ;
- le projet fil rouge est compréhensible ;
- la leçon fonctionne sur ordinateur et mobile ;
- la leçon fonctionne au clavier ;
- aucune erreur n’apparaît dans la console ;
- un débutant cible peut terminer la leçon sans aide extérieure indispensable.

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
- l’absence de texte ou de balises mal affichés ;
- l’absence de régression sur les anciennes leçons.

Les tests automatisés complètent cette vérification, mais ne remplacent pas la relecture et l’essai humain de la leçon.