// Page d'accueil de AI Academy : le tableau de bord (où en est
// l'utilisateur, quoi faire ensuite), pour faciliter la reprise directe
// de la formation à chaque visite.

import { getAllLessonTitles, getAllModuleRequirements, getCourse } from "@/lib/course";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const course = getCourse("claude-code");
  const moduleRequirements = getAllModuleRequirements(course.slug, course);
  const lessonTitles = getAllLessonTitles(course.slug, course);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
      <Dashboard
        course={course}
        moduleRequirements={moduleRequirements}
        lessonTitles={lessonTitles}
      />
    </main>
  );
}
