// Écran "leçon" : affiche le contenu d'une leçon, étape par étape.
// Accessible par exemple sur /parcours/claude-code/module-1/lesson-1-1.

import { getLesson } from "@/lib/content";
import {
  getAllModuleRequirements,
  getCourse,
  getCourseModule,
  getNextLessonRef,
} from "@/lib/course";
import { groupBlocksByStage } from "@/lib/lessonStages";
import { LessonProvider } from "@/components/lesson/LessonContext";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonStages from "@/components/lesson/LessonStages";
import LessonFooterNav from "@/components/lesson/LessonFooterNav";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CourseProgress from "@/components/parcours/CourseProgress";

type LessonPageProps = {
  params: Promise<{ course: string; module: string; lesson: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { course: courseSlug, module: moduleSlug, lesson: lessonId } = await params;

  const course = getCourse(courseSlug);
  const courseModule = getCourseModule(courseSlug, moduleSlug);
  const lesson = getLesson(courseSlug, moduleSlug, lessonId);
  const stages = groupBlocksByStage(lesson.blocks);
  const moduleRequirements = getAllModuleRequirements(courseSlug, course);

  // Le bouton de validation finale n'est actif que si tous les quiz de
  // la leçon sont réussis : on compte donc combien il y en a.
  const totalQuizzes = lesson.blocks.filter(
    (block) => block.type === "quiz"
  ).length;

  const moduleHref = `/parcours/${courseSlug}/${moduleSlug}`;
  const nextLessonRef = getNextLessonRef(course, moduleSlug, lessonId);
  const nextLessonHref = nextLessonRef
    ? `/parcours/${courseSlug}/${nextLessonRef.moduleSlug}/${nextLessonRef.lessonId}`
    : null;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: course.title, href: `/parcours/${courseSlug}` },
            { label: `Module ${courseModule.number}`, href: moduleHref },
            { label: lesson.title },
          ]}
        />

        <CourseProgress course={course} moduleRequirements={moduleRequirements} variant="badge" />

        <LessonProvider lessonId={lesson.id} totalQuizzes={totalQuizzes}>
          <LessonHeader title={lesson.title} />

          <LessonStages lessonId={lesson.id} stages={stages} />

          <LessonFooterNav moduleHref={moduleHref} nextLessonHref={nextLessonHref} />
        </LessonProvider>
      </div>
    </main>
  );
}
