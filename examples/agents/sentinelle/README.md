# Sentinelle — Modules 3 et 4

Cet exemple ajoute deux capacités progressives au projet fil rouge :

1. produire une proposition de ressource structurée et validée ;
2. exécuter cette génération dans une boucle bornée et observable.

Sentinelle ne possède encore aucun outil externe. Elle ne recherche pas réellement une ressource et ne publie rien.

## Lancer sans réseau

Le mode simulé est le mode par défaut. Il ne demande aucune clé et ne coûte rien.

```bash
npm run sentinelle:demo -- "sécurité des agents IA"
```

## Lancer les tests

```bash
npm run sentinelle:test
```

Les tests emploient uniquement des doublures déterministes. Ils ne contactent jamais une API.

## Essayer l’appel OpenAI optionnel

Copie les noms de variables de `.env.example`, mais conserve les vraies valeurs uniquement dans ton environnement local :

```bash
export OPENAI_API_KEY="ta_cle_secrete"
export OPENAI_MODEL="gpt-5.6"
npm run sentinelle:live -- "sécurité des agents IA"
```

Un appel API peut coûter de l’argent. La clé est secrète : ne l’écris jamais dans un fichier suivi par Git, une leçon, une capture ou une trace. Le SDK lit `OPENAI_API_KEY` depuis l’environnement.

## Architecture

```text
src/
├── domain/resource.ts        contrat Zod et erreurs de validation
├── model/modelClient.ts      interface portable du fournisseur
├── model/mockResourceModel.ts doublure locale pour démos et tests
├── model/openAIResourceModel.ts adaptateur OpenAI Responses optionnel
├── model/generateResource.ts entrée → modèle → validation
├── runner/state.ts           état et invariants de la boucle
├── runner/runSentinelle.ts   boucle bornée et traces
└── cli.ts                    commande de démonstration
```

Le domaine ne connaît ni OpenAI ni un nom de modèle. Changer de fournisseur revient à remplacer l’adaptateur, pas le schéma, la boucle ou les tests.

## Limites humaines

- Une sortie du modèle reste non fiable tant que Zod ne l’a pas validée.
- Un score de pertinence est une proposition, pas une vérité.
- Toute proposition demande une revue humaine avant utilisation.
- Le mode réel exige une décision consciente sur le coût et la clé.
- La boucle s’arrête toujours ; elle ne transforme pas encore Sentinelle en agent complet.
