# Rapport d’audit — AI Academy

Date : 2026-07-23

## Synthèse

AI Academy dispose d’un socle technique clair : application Next.js, contenus JSON extensibles, progression locale, prérequis, tests et parcours structuré. La priorité n’est pas de reconstruire l’application, mais de faire évoluer progressivement l’expérience vers une pédagogie fondée sur des compétences démontrables.

## Direction validée

Chaque module doit progressivement suivre le cycle :

1. Brief : annoncer une mission concrète.
2. Comprendre : expliquer une notion principale simplement.
3. Observer : montrer un exemple ou un schéma.
4. Construire : demander une action, du code ou un mini-projet.
5. Vérifier : quiz, test, checklist ou validation pratique.
6. Réfléchir : reformuler ce qui a été compris et vérifié.
7. Étendre : proposer une amélioration optionnelle utile.

## Décisions structurantes

- Conserver les Modules 1 à 6 et les enrichir progressivement.
- Construire les Modules 7 à 12 directement selon le modèle « école ».
- Exploiter d’abord les blocs existants : `code`, `action`, `project` et `assessment`.
- Ne pas construire prématurément un IDE intégré ou une progression adaptative complexe.
- Faire du tracker puis de Wayli des projets réellement progressifs.
- Maintenir une notion principale par leçon et des étapes courtes pour les débutants.

## Risques à surveiller

- surcharge cognitive pour un débutant ;
- validation trop dépendante des QCM ;
- dépendance aveugle à l’IA ;
- sur-ingénierie du moteur pédagogique ;
- incohérence entre les identifiants enregistrés et les exigences de progression ;
- dette éditoriale si les contenus ne suivent pas un guide commun.

Ce document complète `docs/AI_ACADEMY_VISION.md` et sert de référence synthétique pour les prochaines missions Codex et Claude Code.
