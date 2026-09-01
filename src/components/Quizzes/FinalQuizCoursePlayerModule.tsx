import { useMemo, useState } from "react";
import { UniversalModal } from "../UniversalModal";
import { Button } from "../ui/button";

import { getFinalCourseQuizzes } from "@/api";
import { BookOpenText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuizCoursePlayer } from "./QuizCoursePlayer";
import { submitFinalExam } from "@/api/courseProgressEndpoints";
import { IFinalQuizResult } from "@/types/courseProgress.types";
import type { FinalQuizQuestion, QuizAnswerMap } from "@/types/quiz.types";

interface Props {
  courseId: string;
  percentage: number;
  lastExamAttemptAt: Date | null;
  onContinueAfterPass?: () => Promise<void>;
}

export const FinalQuizCoursePlayerModule = ({
  courseId,
  percentage,
  lastExamAttemptAt,
  onContinueAfterPass,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<FinalQuizQuestion[]>([]);
  const [finalQuizResponse, setFinalQuizResponse] =
    useState<IFinalQuizResult>();
  const [continuing, setContinuing] = useState(false);

  const canRetry = useMemo(() => {
    if (!lastExamAttemptAt) return true;
    const hoursSinceLastAttempt =
      (Date.now() - new Date(lastExamAttemptAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastAttempt >= 24;
  }, [lastExamAttemptAt]);

  const handleModalOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setFinalQuizResponse(undefined);
      setContinuing(false);
    }
  };

  const handleOpenExam = async () => {
    setFinalQuizResponse(undefined);
    setOpen(true);

    try {
      setLoading(true);
      const res = await getFinalCourseQuizzes(courseId);

      if (res.success && res.data) {
        setQuizzes(res.data);
        return;
      }

      console.error("Error fetching final course quizzes:", res.message);
    } catch (error) {
      console.error("Error fetching final course quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuizzes = async (answers: QuizAnswerMap) => {
    const res = await submitFinalExam(courseId, answers);
    setFinalQuizResponse(res);
  };

  const handleContinueAfterPass = async () => {
    setContinuing(true);

    try {
      await onContinueAfterPass?.();
      handleModalOpenChange(false);
    } finally {
      setContinuing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      title={
        percentage < 100
          ? "Completá el curso para desbloquear el examen final"
          : "Examen final del curso"
      }
    >
      <Button
        onClick={handleOpenExam}
        variant={loading || percentage < 100 ? "outline" : "default"}
        disabled={loading || percentage < 100 || !canRetry}
        className="w-full"
      >
        {loading ? (
          <Loader2 size={18} className="mr-1 animate-spin" />
        ) : (
          <BookOpenText size={18} className="mr-1" />
        )}
        Examen final
      </Button>
      {percentage < 100 && (
        <p className="mt-2 text-sm text-warning">
          Completa el curso para desbloquear el examen final
        </p>
      )}

      <UniversalModal
        open={open}
        onOpenChange={handleModalOpenChange}
        title="Examen final del curso"
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Cargando preguntas...
            </span>
          </div>
        ) : (
          <QuizCoursePlayer
            quizzes={quizzes}
            moduleTitle="Examen final del curso"
            onComplete={(answers: QuizAnswerMap) => submitQuizzes(answers)}
            isPractice={false}
            finalResult={finalQuizResponse}
            passedActionLabel="Ir a Progreso"
            passedActionDescription="Tu examen ya fue aprobado. Actualiza el progreso y continua con la practica presencial."
            onPassedAction={handleContinueAfterPass}
            passedActionLoading={continuing}
          />
        )}
      </UniversalModal>
    </motion.div>
  );
};
