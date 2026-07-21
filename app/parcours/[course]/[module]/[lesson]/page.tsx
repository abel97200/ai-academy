// Écran "leçon" : affiche le contenu d'une leçon, bloc par bloc.
// Accessible par exemple sur /parcours/claude-code/module-1/lesson-1-1.

import { getLesson } from "@/lib/content";
import { getCourse, getCourseModule, getNextLessonRef } from "@/lib/course";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { LessonProvider } from "@/components/lesson/LessonContext";
import LessonHeader from "@/components/lesson/LessonHeader";
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
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: course.title, href: `/parcours/${courseSlug}` },
            { label: `Module ${courseModule.number}`, href: moduleHref },
            { label: lesson.title },
          ]}
        />

        <CourseProgress course={course} variant="badge" />

        <LessonProvider lessonId={lesson.id} totalQuizzes={totalQuizzes}>
          <LessonHeader title={lesson.title} />

          {/* On parcourt les blocs de la leçon et on affiche chacun avec
              le composant qui correspond à son type. */}
          <div className="flex flex-col gap-4">
            {lesson.blocks.map((block, index) => (
              <BlockRenderer
                key={index}
                block={block}
                blockId={`${lesson.id}-block-${index}`}
              />
            ))}
          </div>

          <LessonFooterNav moduleHref={moduleHref} nextLessonHref={nextLessonHref} />
        </LessonProvider>
      </div>
    </main>
  );
}
