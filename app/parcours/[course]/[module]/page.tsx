// Écran "module" : liste les leçons d'un module avec leur état.
// Accessible par exemple sur /parcours/claude-code/module-1.

import { getCourse, getCourseModule } from "@/lib/course";
import { getLesson } from "@/lib/content";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CourseProgress from "@/components/parcours/CourseProgress";
import ModuleLessonList from "@/components/parcours/ModuleLessonList";

type ModulePageProps = {
  params: Promise<{ course: string; module: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { course: courseSlug, module: moduleSlug } = await params;
  const course = getCourse(courseSlug);
  const courseModule = getCourseModule(courseSlug, moduleSlug);

  // Pour chaque leçon du module, on ne lit que son titre : le contenu
  // complet (les blocs) n'est lu que sur l'écran de la leçon elle-même.
  const lessons = courseModule.lessons.map((lessonId) => {
    const lesson = getLesson(courseSlug, moduleSlug, lessonId);
    return { id: lesson.id, title: lesson.title };
  });

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: course.title, href: `/parcours/${courseSlug}` },
            { label: `Module ${courseModule.number}` },
          ]}
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Module {courseModule.number} · {courseModule.title}
          </h1>
          <p className="text-foreground/70">{courseModule.objective}</p>
          <p className="text-sm text-foreground/50">{courseModule.usefulness}</p>
        </div>

        <CourseProgress course={course} variant="badge" />

        <ModuleLessonList
          courseSlug={courseSlug}
          moduleSlug={moduleSlug}
          lessons={lessons}
        />
      </div>
    </main>
  );
}
