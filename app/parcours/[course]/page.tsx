// Écran "parcours" : la feuille de route complète d'une formation.
// Accessible par exemple sur /parcours/claude-code.

import { getCourse } from "@/lib/course";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CourseProgress from "@/components/parcours/CourseProgress";
import Roadmap from "@/components/parcours/Roadmap";

type ParcoursPageProps = {
  params: Promise<{ course: string }>;
};

export default async function ParcoursPage({ params }: ParcoursPageProps) {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
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

        <CourseProgress course={course} variant="bar" />

        <Roadmap course={course} />
      </div>
    </main>
  );
}
