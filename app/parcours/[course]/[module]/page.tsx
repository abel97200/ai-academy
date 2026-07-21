// Écran "module" : objectif, prérequis, compétences, leçons, livrable,
// conditions de validation, temps estimé.
// Accessible par exemple sur /parcours/claude-code/module-1.

import {
  getAllModuleRequirements,
  getCourse,
  getCourseModule,
  getModuleRequirements,
} from "@/lib/course";
import { getLesson } from "@/lib/content";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CourseProgress from "@/components/parcours/CourseProgress";
import ModuleLessonList from "@/components/parcours/ModuleLessonList";
import ModuleValidation from "@/components/parcours/ModuleValidation";

type ModulePageProps = {
  params: Promise<{ course: string; module: string }>;
};

function formatEstimatedTime(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { course: courseSlug, module: moduleSlug } = await params;
  const course = getCourse(courseSlug);
  const courseModule = getCourseModule(courseSlug, moduleSlug);
  const moduleRequirements = getAllModuleRequirements(courseSlug, course);
  const requirements = getModuleRequirements(courseSlug, courseModule);

  // Pour chaque leçon du module, on ne lit que son titre : le contenu
  // complet (les blocs) n'est lu que sur l'écran de la leçon elle-même.
  const lessons = courseModule.lessons.map((lessonId) => {
    const lesson = getLesson(courseSlug, moduleSlug, lessonId);
    return { id: lesson.id, title: lesson.title };
  });

  const prerequisiteModules = courseModule.prerequisites.map(
    (slug) => course.modules.find((m) => m.slug === slug)?.title ?? slug
  );

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
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

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/60">
              ⏱ {formatEstimatedTime(courseModule.estimatedMinutes)}
            </span>
            {prerequisiteModules.length > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/60">
                Prérequis : {prerequisiteModules.join(", ")}
              </span>
            )}
          </div>

          {courseModule.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {courseModule.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {courseModule.deliverable && (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-foreground/60">
              <span className="font-medium text-foreground/80">Livrable attendu : </span>
              {courseModule.deliverable}
            </p>
          )}
        </div>

        <CourseProgress course={course} moduleRequirements={moduleRequirements} variant="badge" />

        <ModuleLessonList courseSlug={courseSlug} moduleSlug={moduleSlug} lessons={lessons} />

        {lessons.length > 0 && <ModuleValidation requirements={requirements} />}
      </div>
    </main>
  );
}
