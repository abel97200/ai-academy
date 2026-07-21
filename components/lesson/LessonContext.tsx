"use client";

// Ce contexte React est le "carnet partagé" d'une leçon : il permet à
// des blocs différents (les quiz, le bloc de validation, le titre) de
// se parler entre eux, même s'ils sont affichés côte à côte sans lien direct.
//
// Concrètement il retient :
// - quels quiz de la leçon ont déjà été réussis,
// - si la leçon est déjà marquée comme complétée (lu/écrit dans le localStorage).
//
// La validation est AUTOMATIQUE : dès que tous les quiz de la leçon sont
// réussis, la leçon se marque complétée toute seule (voir l'effet plus bas).
// Il n'y a plus de bouton "Terminer la leçon" à cliquer.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isLessonCompleted, markLessonCompleted } from "@/lib/progress";

type LessonContextValue = {
  // true seulement si tous les quiz de la leçon ont été réussis.
  allQuizzesPassed: boolean;
  isQuizPassed: (quizId: string) => boolean;
  registerQuizPassed: (quizId: string) => void;
  // true une fois que la leçon a été validée (et ça reste vrai après un refresh).
  completed: boolean;
  // true seulement pendant la session où la leçon vient tout juste d'être
  // auto-validée (jamais vrai si elle était déjà complétée avant l'affichage
  // de la page). Sert à ne montrer la grande célébration qu'une fois, au
  // moment où elle est méritée.
  justCompleted: boolean;
};

const LessonContext = createContext<LessonContextValue | null>(null);

type LessonProviderProps = {
  lessonId: string;
  totalQuizzes: number;
  children: ReactNode;
};

export function LessonProvider({
  lessonId,
  totalQuizzes,
  children,
}: LessonProviderProps) {
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Le localStorage n'existe que dans le navigateur : impossible de lire la
  // progression pendant le rendu initial (serveur). On la lit donc juste
  // après le premier affichage, pour éviter un décalage serveur/client.
  useEffect(() => {
    // Lecture d'un système externe (localStorage) au montage : nécessaire.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(isLessonCompleted(lessonId));
  }, [lessonId]);

  const registerQuizPassed = useCallback((quizId: string) => {
    setPassedQuizzes((previous) => {
      if (previous.has(quizId)) {
        return previous;
      }
      return new Set(previous).add(quizId);
    });
  }, []);

  const isQuizPassed = useCallback(
    (quizId: string) => passedQuizzes.has(quizId),
    [passedQuizzes]
  );

  const allQuizzesPassed = passedQuizzes.size >= totalQuizzes;

  // Auto-validation : dès que tous les quiz sont réussis, on marque la
  // leçon comme complétée automatiquement. Le garde-fou "!completed"
  // garantit que ça ne se déclenche qu'une seule fois : une fois "completed"
  // passé à true, cette condition n'est plus jamais remplie pour cette leçon.
  useEffect(() => {
    if (allQuizzesPassed && !completed) {
      markLessonCompleted(lessonId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompleted(true);
      setJustCompleted(true);
    }
  }, [allQuizzesPassed, completed, lessonId]);

  const value: LessonContextValue = {
    allQuizzesPassed,
    isQuizPassed,
    registerQuizPassed,
    completed,
    justCompleted,
  };

  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  );
}

// Petit raccourci utilisé par les blocs pour accéder au contexte de leur leçon.
export function useLessonContext(): LessonContextValue {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error(
      "useLessonContext doit être utilisé à l'intérieur de <LessonProvider>."
    );
  }
  return context;
}
