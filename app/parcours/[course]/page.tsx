// Écran "parcours" : la feuille de route complète d'une formation — les 4
// niveaux, leurs modules, le projet de chaque niveau, le projet final, et
// les spécialisations à venir.
// Accessible par exemple sur /parcours/claude-code.

import { getAllModuleRequirements, getCourse } from "@/lib/course";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CourseProgress from "@/components/parcours/CourseProgress";
import Roadmap from "@/components/parcours/Roadmap";

type ParcoursPageProps = {
  params: Promise<{ course: string }>;
};

export default async function ParcoursPage({ params }: ParcoursPageProps) {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);
  const moduleRequirements = getAllModuleRequirements(courseSlug, course);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <Breadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: course.title }]}
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {course.title}
          </h1>
          <p className="text-foreground/70">{course.promise}</p>
        </div>

        <CourseProgress course={course} moduleRequirements={moduleRequirements} variant="bar" />

        <Roadmap course={course} moduleRequirements={moduleRequirements} />
      </div>
    </main>
  );
}
