// Petit registre d'illustrations SVG "faites maison", réutilisables par
// n'importe quel bloc "situation" en thème "light-elearning" via son champ
// JSON `illustration` (un identifiant, jamais du JSX dans le contenu).
// Pour ajouter une illustration : créer son composant dans ce dossier,
// puis ajouter un "case" ci-dessous.
//
// Écrit comme un switch (plutôt que "const X = table[id]; <X />") pour
// que chaque branche rende directement du JSX : aucune valeur "composant"
// n'est jamais réassignée pendant le rendu, ce qu'exige la règle
// react-hooks/static-components.

import LeaAtDeskScene from "@/components/illustrations/LeaAtDeskScene";
import ClientFormScene from "@/components/illustrations/ClientFormScene";
import WorkshopScene from "@/components/illustrations/WorkshopScene";

export type IllustrationId = "lea-desk" | "client-form" | "workshop";

export function RegisteredIllustration({ id }: { id: string | undefined }) {
  switch (id as IllustrationId | undefined) {
    case "lea-desk":
      return <LeaAtDeskScene />;
    case "client-form":
      return <ClientFormScene />;
    case "workshop":
      return <WorkshopScene />;
    default:
      return null;
  }
}
