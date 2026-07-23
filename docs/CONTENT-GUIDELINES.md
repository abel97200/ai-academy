# Règles de création des leçons

Les contenus doivent respecter la vision de `AI_ACADEMY_VISION.md`.

## Principes

- Une notion principale par leçon.
- Explications courtes et techniquement exactes.
- Tout terme technique est défini avant utilisation.
- Chaque notion abstraite reçoit immédiatement un exemple concret.
- L’apprenant pratique davantage qu’il ne lit.
- Le code est toujours accompagné de son rôle, de ce que l’apprenant doit comprendre, de ce qu’il doit savoir modifier et de ce que Claude Code peut gérer.
- Les ajouts hors périmètre du MVP sont refusés.

## Blocs disponibles

`explication`, `schema`, `demo`, `exercice`, `quiz`, `validation`, `code`, `action`, `project`, `assessment`.

## Validation minimale

Chaque leçon comporte un exercice avec indices et correction, exactement cinq questions de quiz avec explication, puis un bloc `validation`. Les leçons pratiques utilisent `action` ou `code` lorsque cela apporte une vraie manipulation. La dernière leçon d’un module peut ajouter un bloc `project` et un bloc `assessment`.
