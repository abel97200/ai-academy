# AI Academy — Standard pédagogique et visuel

## Statut

Ce document est une règle produit obligatoire pour toutes les nouvelles leçons AI Academy et pour toute refonte pédagogique future.

Il complète `AI_ACADEMY_PEDAGOGY.md`, `AI_ACADEMY_LEARNING_STANDARD.md`, les blueprints de parcours et `CONTENT-GUIDELINES.md`.

## Décision structurante

**Le visuel n’est pas optionnel dans AI Academy.**

Une leçon ne doit jamais être considérée comme terminée si elle se contente principalement d’afficher du texte dans des cartes, même si son contenu est exact et ses tests passent.

Le niveau minimum recherché est celui d’un e-learning moderne dans lequel l’écran lui-même participe à l’enseignement.

AI Academy s’inspire des principes efficaces observés dans des produits de référence tels que Brilliant, Duolingo et Codecademy : compréhension visuelle et manipulation, progression courte et feedback, apprentissage par la pratique et projets. Il ne faut copier ni leur identité visuelle, ni leurs contenus, ni leurs illustrations.

## Objectif pédagogique

Pour chaque notion, AI Academy doit permettre successivement ou progressivement de répondre à trois questions :

1. **Est-ce que je comprends ?** — explication + représentation visuelle.
2. **Est-ce que je sais l’utiliser ?** — interaction ou exercice dans un contexte pertinent.
3. **Est-ce que je sais le refaire ou raisonner seul ?** — nouveau cas, diagnostic, construction ou projet.

La forme exacte varie selon la notion. Ces trois dimensions peuvent être réparties sur plusieurs écrans ou leçons.

## Les trois fonctions d’une bonne leçon

### Enseigner

Utiliser selon le besoin :

- explication courte ;
- illustration ;
- scène professionnelle ;
- schéma ;
- animation ;
- comparaison ;
- démonstration ;
- interface réelle ou reproduction pédagogique fidèle ;
- exemple concret.

Une séquence d’enseignement peut comporter plusieurs écrans sans question. Il est interdit d’ajouter une question uniquement pour rendre l’écran artificiellement interactif.

### Faire pratiquer

Utiliser selon la compétence :

- choisir ;
- sélectionner plusieurs réponses ;
- classer ;
- ordonner ;
- relier ;
- compléter ;
- construire ;
- corriger ;
- prédire ;
- manipuler ;
- simuler ;
- diagnostiquer ;
- réaliser une action dans un vrai outil.

### Vérifier

La validation peut utiliser :

- QCM à choix unique ;
- QCM à choix multiples ;
- classement ;
- association ;
- remise en ordre ;
- construction ;
- correction ;
- diagnostic ;
- prédiction ;
- nouveau cas ;
- exercice pratique ;
- mini-projet.

La mémorisation d’une définition ne suffit jamais lorsqu’une compétence peut être vérifiée de manière plus réaliste.

## Principe de variété

Une leçon ne doit pas être générée à partir d’un gabarit répétitif du type :

`question → réponse → question → réponse → quiz`.

Exemples de rythmes acceptables :

- illustration → explication → démonstration → explication → quiz ;
- scène métier → observation → explication → classement → feedback → nouveau cas ;
- théorie illustrée → exemple → schéma animé → association → synthèse ;
- démonstration → explication → construction → erreur volontaire → correction ;
- interface réelle → zones annotées → explication → simulation → pratique réelle.

Deux leçons consécutives ne doivent pas nécessairement employer la même structure.

## Standard visuel obligatoire

### L’écran doit enseigner

Quand une notion peut être représentée visuellement, sa représentation doit occuper une place significative dans l’écran.

Exemples :

- automatisation → workflow et données qui circulent ;
- API → requête et réponse entre deux systèmes ;
- Git → historique, branche, commit ou diff ;
- terminal → terminal fidèle avec commande et résultat ;
- données → fiche, champs, tableaux et transformations visibles ;
- agent IA → modèle, instructions, outils, état, décision et validation humaine ;
- erreur → point de rupture et conséquences visibles.

Une petite icône placée à côté d’un paragraphe ne compte pas comme une véritable illustration pédagogique.

### Illustrations

Les illustrations doivent être fréquentes lorsque le sujet s’y prête et avoir une fonction claire :

- montrer une situation ;
- matérialiser une abstraction ;
- montrer un avant/après ;
- suivre une donnée ;
- montrer une conséquence ;
- distinguer plusieurs options ;
- faciliter la mémorisation d’une structure.

Elles peuvent être produites avec SVG/CSS, assets originaux, iconographie cohérente, captures autorisées ou ressources libres/licites.

Ne jamais copier les illustrations d’une plateforme de formation de référence.

### Couleur

AI Academy doit éviter l’expérience uniforme sombre composée uniquement de cartes gris/noir.

Les leçons privilégient une base claire ou lumineuse et utilisent la couleur comme code pédagogique :

- violet/indigo : identité et progression ;
- bleu : information et mécanisme ;
- jaune/orange : observation ou attention ;
- vert : validation ou fonctionnement correct ;
- rouge doux : erreur ou risque.

Cette palette est une direction, pas une obligation d’utiliser toutes les couleurs sur chaque écran.

Les thèmes et contrastes doivent rester accessibles.

### Composition

Un écran peut utiliser :

- scène plein écran ou grande illustration ;
- composition en deux colonnes ;
- infographie centrale ;
- cartes reliées ;
- timeline ;
- comparaison côte à côte ;
- interface simulée ;
- atelier de construction ;
- tableau de classement ;
- synthèse visuelle.

Ne pas réduire toute l’expérience à une grande carte centrée.

## Références réelles

Quand la notion concerne un outil existant, utiliser autant que possible le vrai contexte : GitHub pour Git, Make pour l’automatisation, Vercel pour un déploiement adapté, terminal pour les commandes, APIs réelles adaptées pour HTTP/API.

La représentation peut être simplifiée pour l’apprentissage, mais elle ne doit pas inventer le comportement du produit.

## Progression de la théorie

La théorie est obligatoire. Elle ne doit pas être remplacée par des jeux.

Une explication complexe doit être découpée en petites unités. Par exemple :

`illustration → 2 à 5 phrases → exemple → schéma → 2 à 5 phrases → vérification`.

Il est acceptable d’avoir plusieurs écrans purement explicatifs lorsque cela aide réellement la compréhension.

Le vocabulaire technique doit être défini, mais le mécanisme peut être montré avant son nom lorsque cela facilite l’intuition.

## Bibliothèque d’interactions attendue

Le moteur pédagogique doit progressivement supporter de manière générique :

1. choix unique ;
2. choix multiple ;
3. classement par catégories ;
4. remise en ordre ;
5. association / relier ;
6. compléter un élément manquant ;
7. construire un workflow ou une structure ;
8. corriger une structure ou un workflow ;
9. prédire un résultat ;
10. simulation avec valeurs modifiables ;
11. diagnostic d’erreur ;
12. pratique dans un véritable outil lorsque nécessaire.

Il n’est pas nécessaire d’implémenter toute cette bibliothèque avant d’en avoir besoin. Les composants doivent être ajoutés progressivement et rester génériques.

## Feedback

Après une réponse, ne pas afficher seulement « correct » ou « incorrect ».

Le feedback doit expliquer :

- pourquoi la bonne réponse fonctionne ;
- pourquoi une erreur pouvait sembler logique ;
- ce qui change concrètement selon le choix ;
- quelle règle réutiliser dans un autre contexte.

Lorsque possible, montrer visuellement la conséquence de la réponse.

## Difficulté progressive

Une notion suit idéalement trois niveaux :

### Guidé
L’apprenant observe et réalise une petite action avec beaucoup d’aide.

### Transfert
Même notion dans un contexte différent avec moins d’aide.

### Autonome
Diagnostic, construction ou cas pratique sans recette complète.

Les indices doivent pouvoir être progressifs plutôt que donner immédiatement la solution.

## Quiz

Un quiz n’est qu’un outil parmi d’autres.

Il peut utiliser choix unique ou multiple, mais doit aussi laisser place à classement, association, ordre, correction, construction et diagnostic lorsque ces formats évaluent mieux la compétence.

Les bonnes réponses doivent être réparties. Les distracteurs doivent être plausibles et refléter des erreurs réelles de débutant.

Les questions ne doivent jamais demander une notion qui n’a pas été enseignée ou préparée.

## Mobile et accessibilité

Le mobile doit être conçu, pas seulement réduit.

- pas de workflow illisible compressé ;
- pas de scroll horizontal obligatoire pour comprendre une notion ;
- cartes et contrôles suffisamment grands ;
- alternative accessible au drag-and-drop ;
- contraste lisible ;
- navigation clavier sur desktop ;
- animations non indispensables à la compréhension et respect des préférences de mouvement réduit lorsque pertinent.

## Niveau minimum de qualité visuelle

Pour toute nouvelle leçon, demander :

> Si je retire le titre AI Academy, est-ce que cet écran ressemble clairement à une expérience de formation interactive moderne, ou simplement à une application SaaS affichant du texte ?

Si la réponse est « application SaaS affichant du texte », la leçon n’atteint pas le standard.

Une leçon doit comporter suffisamment de scènes, illustrations, schémas, démonstrations ou manipulations pour que le visuel participe réellement à l’apprentissage.

## Anti-patterns interdits

- fond sombre uniforme + succession de cartes sombres pour toute une leçon ;
- gros paragraphe puis question répétée à chaque étape ;
- question sur chaque écran sans justification pédagogique ;
- illustration décorative sans fonction d’apprentissage ;
- interaction factice ;
- cinq QCM utilisés là où une construction ou un diagnostic serait plus pertinent ;
- même composition répétée sur toutes les leçons ;
- jargon avant intuition et explication ;
- cas fictif AI Academy utilisé par défaut alors qu’un vrai cas est disponible ;
- exercice impossible à réaliser dans l’interface ;
- validation reposant uniquement sur la mémorisation.

## Validation avant livraison

Une leçon ne peut être déclarée terminée qu’après vérification dans le navigateur sur desktop et mobile.

La revue humaine doit contrôler au minimum :

- richesse visuelle suffisante ;
- clarté au premier passage ;
- variété du rythme ;
- théorie suffisante ;
- illustrations réellement explicatives ;
- interactions adaptées à la compétence ;
- feedback utile ;
- absence de surcharge ;
- progression de difficulté ;
- transfert vers un nouveau cas ;
- fonctionnement mobile ;
- absence d’erreur console.

Les tests automatisés sont nécessaires mais ne remplacent pas cette validation.

## Règle de développement

Ne jamais généraliser un nouveau format visuel à des dizaines de leçons avant validation humaine d’un pilote.

Procédure :

1. concevoir une leçon pilote ;
2. vérifier le rendu réel ;
3. tester la compréhension ;
4. corriger ;
5. transformer les bonnes mécaniques en composants génériques ;
6. appliquer progressivement aux autres leçons.

La qualité d’apprentissage prime sur le volume de contenu produit.