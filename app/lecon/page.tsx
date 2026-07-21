// Cette URL fixe existait avant la mise en place du parcours complet
// (voir /parcours/[cours]/[module]/[leçon]). On redirige vers l'adresse
// définitive de cette leçon pour ne pas casser un lien existant.

import { redirect } from "next/navigation";

export default function LeconRedirectPage() {
  redirect("/parcours/claude-code/module-1/lesson-1-1");
}
