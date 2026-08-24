# Philosophie pédagogique — AI Academy

Ce document est la **référence obligatoire** pour tout parcours, module ou leçon, présent ou futur, d'AI Academy.

Il ne décrit pas *ce qu'on enseigne*, mais **comment on enseigne**. Toute personne (ou tout agent) qui écrit du contenu doit avoir lu ce document et respecter ses règles. En cas de doute sur une décision de contenu, ce document tranche.

## Ce que ce document n'est pas

AI Academy n'est pas un manuel scolaire numérisé. On ne cherche pas à *couvrir* un programme, on cherche à faire en sorte que l'apprenant **comprenne, manipule, se trompe, corrige et progresse** — dans cet ordre, en boucle, à chaque notion.

L'inspiration vient de ce que font bien les meilleures formations interactives actuelles : des leçons courtes et actives (à la Duolingo), une intuition construite avant la formalisation (à la Brilliant), un apprentissage par la pratique directe dans un vrai contexte de projet (à la Codecademy). On ne copie ni leur contenu ni leur identité — on en retient les mécanismes qui marchent, et on les applique à notre propre fil rouge (le tracker, puis Wayli).

---

## 1. Quel est le profil de l'apprenant ?

**Principe.** L'apprenant type d'AI Academy est un **grand débutant complet** : il n'a pas de vocabulaire technique acquis, pas de formation en informatique, et découvre le développement en autonomie, souvent sur des créneaux courts et fragmentés (le soir, un weekend). Il n'apprend pas pour l'apprentissage — il apprend parce qu'il veut *construire quelque chose* (son tracker, puis Wayli).

**Pourquoi ça compte.** Un contenu écrit « pour quelqu'un qui code déjà un peu » perd cet apprenant en une phrase. À l'inverse, un contenu qui suppose zéro acquis mais respecte son intelligence (sans le prendre de haut) le garde engagé.

**Exemple concret.** Le Module 1 explique le trajet d'une action utilisateur jusqu'à l'enregistrement d'un résultat *avant* de nommer « frontend », « backend » ou « API ». Ça part de ce que l'apprenant connaît déjà (cliquer sur une case dans une todo-list) et non d'un schéma d'architecture.

**Règle.** Aucun contenu ne doit présumer une connaissance non enseignée dans un module précédent (ou listé en `prerequisites`). Si une notion externe est nécessaire, elle doit être introduite en une phrase avant d'être utilisée.

---

## 2. Comment un débutant apprend-il le mieux ?

**Principe.** Par l'action, pas par la lecture. Un débutant retient ce qu'il a manipulé, prédit, raté, corrigé — beaucoup plus que ce qu'il a lu passivement. L'apprentissage part du **concret vers l'abstrait**, jamais l'inverse.

**Pourquoi ça compte.** La charge mentale d'un débutant est presque entièrement occupée par le vocabulaire et les concepts nouveaux. S'il doit en plus digérer une explication longue et théorique avant de toucher à quoi que ce soit, il décroche. Manipuler d'abord donne un point d'ancrage concret auquel raccrocher la théorie ensuite.

**Exemple concret.** Plutôt que d'expliquer en trois paragraphes ce qu'est une donnée booléenne, montrer le JSON d'une tâche (`"terminee": false`), surligner la ligne, et demander : « Que devient cette valeur quand tu coches la case ? » avant de nommer le concept.

**Règle.** Chaque nouvelle notion doit être rencontrée en contexte (exemple, schéma, extrait de code réel) avant — ou au pire en même temps que — sa définition formelle. Jamais une définition seule, sans exemple attaché.

---

## 3. Quelle doit être la structure idéale d'une leçon ?

**Principe.** Une leçon suit toujours les cinq étapes déjà en place dans le moteur : **Comprendre → Observer → Essayer → Corriger → Vérifier**. Ce n'est pas une convention arbitraire : c'est le cycle pédagogique complet — intuition, preuve, pratique, erreur, validation.

**Pourquoi ça compte.** Chacune de ces étapes répond à un besoin cognitif différent : *Comprendre* pose le pourquoi, *Observer* montre que ça marche vraiment (schéma, démo), *Essayer* fait manipuler, *Corriger* confronte à l'erreur dans un cadre sans risque (quiz), *Vérifier* referme la boucle et donne le sentiment de maîtrise. Sauter une étape casse le cycle — par exemple, faire manipuler sans avoir d'abord donné le sens produit du bachotage, pas de la compréhension.

**Exemple concret.** Une leçon sur les tâches d'une todo-list : `explication` (pourquoi une tâche a besoin d'un identifiant unique) → `schema` (flux de la donnée) → `exercice`/`action` (modifier une tâche) → `quiz` (piéger la confusion identifiant/titre) → `validation`.

**Règle.** Une leçon ne peut pas sauter l'étape *Essayer* ni l'étape *Vérifier*. Une leçon purement théorique (sans aucun bloc `exercice`, `action`, `code` ou `project`) est invalide.

---

## 4. Combien de notions nouvelles maximum par leçon ?

**Principe.** **Une seule notion-clé par leçon**, avec au maximum deux ou trois notions secondaires strictement nécessaires pour la faire vivre.

**Pourquoi ça compte.** C'est une question de charge cognitive : un cerveau qui découvre peut activement traiter très peu d'éléments nouveaux à la fois. Vouloir « rentabiliser » une leçon en y glissant trois concepts indépendants ne fait pas gagner de temps — ça fait perdre la notion principale dans le bruit.

**Exemple concret.** Une leçon sur « qu'est-ce qu'une base de données » ne doit pas aussi introduire les requêtes SQL *et* les relations entre tables le même jour. Une leçon = une question à laquelle l'apprenant peut répondre clairement en sortant : « à quoi sert une base de données ? ».

**Règle.** Avant d'écrire une leçon, formuler la question unique à laquelle elle répond. Si la réponse nécessite d'introduire plus d'une notion non liée, la leçon doit être scindée en deux.

---

## 5. Dans quel ordre introduire une notion ?

**Principe.** Toujours dans cet ordre : **problème concret → intuition/exemple → nom de la notion → généralisation → application dans le fil rouge**.

**Pourquoi ça compte.** Commencer par le nom technique force l'apprenant à mémoriser une étiquette vide de sens, qu'il devra remplir plus tard. Commencer par le problème donne d'abord une raison d'exister à la notion — le nom devient alors un raccourci pratique pour quelque chose qu'on a déjà compris, pas un mot à apprendre par cœur.

**Exemple concret.** Pour introduire une API : d'abord montrer que le navigateur ne peut pas parler directement à la base de données (le problème), puis montrer un échange simple de requête/réponse (l'intuition), *puis seulement* dire « ça s'appelle une API ».

**Règle.** Aucun bloc `explication` ne doit ouvrir sur une définition technique brute (« Une API est... »). Il doit ouvrir sur le problème ou le contexte qui rend la notion nécessaire.

---

## 6. Quand utiliser une analogie ?

**Principe.** Une analogie s'utilise quand une notion est **abstraite et sans équivalent visible** dans l'expérience quotidienne de l'apprenant (état, API, base de données, asynchrone...). Elle sert de pont temporaire entre du connu et de l'inconnu — pas de substitut définitif à la compréhension technique.

**Pourquoi ça compte.** Une bonne analogie accélère l'intuition. Mais une analogie non refermée devient une fausse croyance qui pollue la compréhension future (ex : « une base de données, c'est un classeur » suffit pour l'intuition, mais bloque si elle n'est jamais dépassée vers la vraie notion de requête).

**Exemple concret.** « Une API, c'est un peu comme une serveuse entre toi et la cuisine : tu ne rentres pas en cuisine, tu passes par elle. » — immédiatement suivi de : « Concrètement, ça veut dire que ton interface envoie une requête à une adresse précise, et attend une réponse. Là où l'analogie s'arrête : une API peut refuser ta demande si elle est mal formée. »

**Règle.** Toute analogie doit être **suivie immédiatement** de l'explication technique réelle et d'une phrase précisant où l'analogie s'arrête. Une analogie ne remplace jamais l'explication — elle la précède.

---

## 7. Quand introduire le terme technique ?

**Principe.** Le terme technique arrive **après** que l'intuition ou la manipulation a eu lieu — jamais avant. On fait vivre la notion, puis on lui donne son nom officiel, en signalant explicitement que c'est le nom qu'on retrouvera partout ensuite.

**Pourquoi ça compte.** Nommer avant de comprendre transforme l'apprentissage en par-cœur. Nommer après avoir compris transforme le mot en repère utile, que l'apprenant a déjà « rempli » de sens avant même de le lire.

**Exemple concret.** « Tu viens de voir que la valeur passe de `false` à `true` quand tu coches la case. C'est ce qu'on appelle une donnée **booléenne** : elle n'a que deux états possibles. »

**Règle.** Le terme technique doit toujours être introduit en gras la première fois, accompagné d'une phrase de définition courte reliée à l'exemple qui vient d'être vu — pas une définition de dictionnaire isolée.

---

## 8. Quels types d'exercices utiliser ?

**Principe.** Des exercices qui font **agir sur la notion qu'on vient de voir**, de préférence ancrés dans le fil rouge, et qui font **prédire avant de vérifier**.

Types à privilégier :
- **Prédiction guidée** : « Que va afficher ce code ? » avant de révéler la réponse.
- **Modification ciblée** : changer une ligne précise et observer l'effet.
- **Action réelle** (bloc `action`) : faire vraiment quelque chose (créer un fichier, lancer une commande) et décrire ce qui s'est passé.
- **Indices progressifs** (`hints`) : un premier indice qui oriente sans donner la réponse, un dernier qui la donne presque — jamais la solution en un clic.

**Pourquoi ça compte.** Prédire avant de vérifier force un engagement actif : l'apprenant prend position, donc l'erreur (ou la réussite) devient significative pour lui, pas juste une case cochée.

**Exemple concret.** Bloc `exercice` : « Voici le JSON d'une tâche. Si on met `"terminee": true`, que va changer dans l'affichage à ton avis ? » avec indices progressifs avant la solution.

**Règle.** Chaque exercice doit porter sur la notion-clé qui vient d'être introduite (pas une notion plus ancienne isolée), et proposer des indices progressifs plutôt qu'un bouton « voir la solution » unique.

---

## 9. Quels types d'exercices éviter ?

**Principe.** Éviter tout exercice qui teste la **mémorisation pure**, qui piège sans enseigner, ou qui exige une connaissance jamais enseignée dans le parcours.

À éviter explicitement :
- Le recopiage sans réflexion (« retape ce code »).
- Les questions ambiguës ou à double sens, dont l'apprenant peut se tromper pour de mauvaises raisons.
- Les questions « gotcha » qui piègent sur un détail non enseigné, juste pour faire baisser le score.
- Les exercices qui demandent un acquis d'un module non prérequis.
- Les exercices trop longs sans aucun point de vérification intermédiaire (l'apprenant se perd et ne sait pas s'il est sur la bonne voie).

**Pourquoi ça compte.** Un exercice qui piège sans raison pédagogique ne mesure pas la compréhension, il mesure la chance — et il décourage sans rien enseigner en échange.

**Exemple concret.** À éviter : un quiz qui demande la syntaxe exacte d'une fonction JavaScript jamais montrée dans la leçon. À privilégier : une question dont la mauvaise réponse correspond à une confusion réelle et fréquente (ex : confondre `=` et `===`), avec une explication qui lève cette confusion.

**Règle.** Chaque mauvaise réponse d'un exercice à choix doit correspondre à une **erreur de raisonnement plausible et déjà documentée dans l'explication**, jamais à un piège gratuit.

---

## 10. Comment concevoir un quiz réellement utile ?

**Principe.** Un quiz ne vérifie pas si l'apprenant a retenu un mot — il vérifie s'il a compris un mécanisme. Chaque question doit être **construite autour d'une confusion réelle**, et chaque réponse (juste ou fausse) doit renvoyer une explication, pas juste un ✓ ou un ✗.

**Pourquoi ça compte.** Le champ `explanation` du bloc `quiz` est l'endroit où l'apprentissage se termine réellement : c'est là que l'erreur devient une leçon. Un quiz sans explication par question est une évaluation, pas un outil pédagogique.

**Exemple concret.** Question : « Que se passe-t-il si deux tâches ont le même identifiant ? » Les mauvaises réponses reflètent des erreurs courantes (« rien, ça n'a pas d'importance »), et l'explication corrige précisément cette croyance.

**Règle.** Toute question de quiz doit avoir un champ `explanation` non vide et spécifique à cette question. Le seuil de validation (75 %, sur le **meilleur score obtenu**, jamais le dernier) doit toujours rester atteignable en repassant le quiz autant de fois que nécessaire, sans pénalité ni changement des questions à chaque tentative qui viserait à décourager.

---

## 11. Comment corriger une erreur sans décourager l'apprenant ?

**Principe.** L'erreur est une **donnée utile**, jamais une faute. Le ton de la correction doit toujours désigner le raisonnement, jamais la personne, et toujours ouvrir une porte vers la réussite plutôt que fermer une porte sur l'échec.

**Pourquoi ça compte.** Un apprenant autodidacte, seul devant son écran, n'a personne pour relativiser un « Faux » sec. Le texte de correction est, à ce moment précis, la seule voix pédagogique présente — elle doit rassurer autant qu'elle corrige.

**Exemple concret.** À éviter : « Faux. » À utiliser : « Presque : tu as confondu le titre et l'identifiant de la tâche. C'est une confusion très fréquente au début — voici la différence... »

**Règle.** Aucun message d'erreur ne doit se limiter à indiquer que la réponse est fausse. Il doit toujours : (1) nommer la confusion précise, (2) la normaliser en une phrase courte, (3) réexpliquer le point clé. Le score enregistré est toujours le **meilleur essai**, jamais le dernier ni une moyenne.

---

## 12. Comment maintenir la motivation tout au long du parcours ?

**Principe.** La motivation d'un débutant autodidacte se construit par des **victoires fréquentes et visibles**, un lien constant avec un projet qui a du sens pour lui, et de la variété dans le format des leçons.

**Pourquoi ça compte.** Sans validation externe (professeur, classe), l'apprenant a besoin que la plateforme lui montre elle-même qu'il avance — sinon le doute (« est-ce que je progresse vraiment ? ») s'installe et fait abandonner.

**Exemple concret.** Chaque bloc `validation` franchi, chaque `assessment` de fin de module, chaque niveau complété doit être visible et daté (dashboard, streak). Chaque module doit rappeler en une phrase à quoi il vient de servir dans le tracker ou Wayli.

**Règle.** Chaque module doit se terminer sur une preuve concrète de progression du fil rouge (pas seulement un score), et le dashboard doit toujours refléter cette progression sans délai ni ambiguïté.

---

## 13. Comment faire progresser le projet fil rouge ?

**Principe.** Chaque module doit ajouter **une pierre concrète et fonctionnelle** au fil rouge (le tracker, puis Wayli), jamais un exercice isolé sans lien avec lui. La question « à quoi ça sert ? » doit toujours pouvoir se répondre par « ça va me servir pour mon tracker / pour Wayli ».

**Pourquoi ça compte.** Le fil rouge est ce qui transforme une suite de notions techniques en un projet dont l'apprenant est fier. C'est aussi ce qui donne un contexte stable où réutiliser une notion déjà vue — la meilleure façon de la consolider.

**Exemple concret.** Le Niveau 1 fait cadrer et démarrer le tracker ; le Niveau 2 le rend interactif ; le Niveau 3 le transforme en vraie application ; le Niveau 4 le publie. Chaque notion nouvelle (HTML, CSS, JS, React...) est appliquée **sur ce même projet**, jamais sur un projet-jouet déconnecté.

**Règle.** Tout bloc `action` ou `project` doit, par défaut, faire progresser le tracker ou Wayli. Un exercice isolé, sans lien avec le fil rouge, n'est acceptable que pour illustrer un point ponctuel et doit rester minoritaire dans la leçon.

---

## 14. Comment alterner théorie, démonstration et pratique ?

**Principe.** L'alternance Comprendre → Observer → Essayer doit se vivre à l'échelle de **chaque notion**, pas seulement de la leçon entière. On ne fait jamais de longue théorie suivie de longue pratique : on découpe en petits cycles courts.

**Pourquoi ça compte.** Un débutant qui reçoit dix minutes de théorie d'affilée avant de toucher à quoi que ce soit a déjà oublié les deux premières minutes au moment de pratiquer. Des cycles courts et répétés ancrent bien mieux que des blocs longs.

**Exemple concret.** Plutôt qu'un long bloc `explication` suivi d'un seul gros exercice final, alterner : `explication` courte sur une seule idée → `schema`/`demo` qui la montre → `exercice` court dessus → notion suivante.

**Règle.** Aucun bloc `explication` ne doit dépasser ce qui est nécessaire pour une seule idée. Dès qu'une notion est posée, elle doit être suivie d'une observation ou d'une pratique avant d'en introduire une nouvelle — pas de longue chaîne de blocs `explication` consécutifs.

---

## 15. Quels sont les principes UX d'une plateforme d'apprentissage moderne ?

**Principe.** L'expérience doit être **sans friction, immédiate dans son retour, et honnête sur la progression**. La plateforme elle-même enseigne, par la façon dont elle réagit à chaque action.

Principes concrets :
- **Feedback instantané** : toute action (quiz, exercice, action) donne une réponse immédiate, jamais un silence.
- **Progression toujours visible** : dashboard, streak, pourcentage de module — l'apprenant ne doit jamais se demander « où j'en suis ».
- **Sessions courtes possibles** : une leçon doit pouvoir se terminer en une session de 5 à 15 minutes, pour s'adapter à un emploi du temps fragmenté.
- **Aucune friction d'accès** : pas d'étape inutile entre l'envie d'apprendre et le début de la leçon.
- **Ton humain dans toute l'interface**, pas seulement dans le contenu pédagogique — les messages d'erreur techniques (formulaire, chargement...) doivent être aussi bienveillants que les corrections de quiz.
- **Rien n'est bloquant silencieusement** : si l'apprenant est coincé, il doit toujours avoir un indice ou une échappatoire, jamais une impasse.

**Pourquoi ça compte.** Le design de l'interaction est lui-même un message pédagogique implicite : une interface confuse ou punitive enseigne à l'apprenant qu'apprendre est difficile et anxiogène, même si le contenu est excellent.

**Règle.** Aucune interaction de la plateforme (quiz, action, validation, navigation) ne doit rester sans retour visuel. Toute notion de score ou de progression affichée doit être exacte, immédiate, et jamais trompeuse (ex : ne jamais afficher un module comme « terminé » s'il ne l'est pas réellement selon les règles de validation).

---

## Checklist de validation pédagogique d'un module

Un module n'est considéré comme **terminé** que si toutes les cases suivantes sont vraies pour *chacune* de ses leçons :

- [ ] Chaque leçon répond à **une seule question centrale**, formulable en une phrase.
- [ ] Aucune leçon ne présuppose une notion non enseignée dans un module prérequis.
- [ ] Chaque leçon suit le cycle **Comprendre → Observer → Essayer → Corriger → Vérifier**, sans étape sautée.
- [ ] Aucun bloc `explication` n'ouvre sur une définition technique brute — chacun ouvre sur un problème ou un exemple concret.
- [ ] Chaque terme technique est introduit **après** l'intuition ou la manipulation, en gras, avec une définition reliée à l'exemple qui précède.
- [ ] Chaque analogie utilisée est suivie de l'explication technique réelle et d'une phrase indiquant où l'analogie s'arrête.
- [ ] Chaque exercice porte sur la notion qui vient d'être vue, propose des indices progressifs, et évite le piège gratuit.
- [ ] Chaque mauvaise réponse de quiz correspond à une confusion réelle et plausible, pas à un piège arbitraire.
- [ ] Chaque question de quiz a une `explanation` non vide, spécifique, et bienveillante.
- [ ] Le score de quiz retenu est le meilleur essai, jamais le dernier.
- [ ] Chaque bloc `action` ou `project` fait progresser concrètement le fil rouge (tracker / Wayli).
- [ ] Le module se termine sur une preuve visible de progression (validation, assessment, mise à jour du fil rouge).
- [ ] Aucune leçon ne peut raisonnablement dépasser une session de 15 minutes sans point de vérification intermédiaire.
- [ ] Le ton de tous les textes (explication, quiz, erreurs, consignes) reste simple, humain et sans jugement.
- [ ] Le module a été relu en se demandant : *« Un grand débutant, seul, sans aide, peut-il suivre ça sans décrocher ? »* — et la réponse est oui.

Un module qui échoue sur un seul point de cette checklist n'est pas prêt, même si son contenu technique est correct.
