import { useMemo, useState } from "react";
import { UniversalModal } from "../UniversalModal";
import { Button } from "../ui/button";

import { getFinalCourseQuizzes } from "@/api";
import { BookOpenText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuizCoursePlayer } from "./QuizCoursePlayer";
import { submitFinalExam } from "@/api/courseProgressEndpoints";
import { IFinalQuizResult } from "@/types/courseProgress.types";

interface Props {
  courseId: string;
  percentage: number;
  lastExamAttemptAt: Date | null;
}

export const FinalQuizCoursePlayerModule = ({
  courseId,
  percentage,
  lastExamAttemptAt,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [finalQuizResponse, setFinalQuizResponse] =
    useState<IFinalQuizResult>();

  const canRetry = useMemo(() => {
    if (!lastExamAttemptAt) return true;
    const hoursSinceLastAttempt =
      (Date.now() - new Date(lastExamAttemptAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastAttempt >= 24;
  }, [lastExamAttemptAt]);

  const handleOpenExam = async () => {
    setOpen(true);

    try {
      setLoading(true);
      const res = await getFinalCourseQuizzes(courseId);

      // Guardamos los quizzes del módulo en el estado
      if (res.success && res.data) {
        setQuizzes(res.data);
      }
    } catch (error) {
      console.error("Error fetching final course quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const submitQuizzes = async (answers: Record<string, number>) => {
    const res = await submitFinalExam(courseId, answers);
    setFinalQuizResponse(res);
    console.log("resSubmit", res);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      title={
        percentage < 100
          ? "Completa el curso para desbloquear el examen final"
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
        <p className="text-warning mt-2 text-sm">
          Completá el curso para desbloquear el examen final
        </p>
      )}

      <UniversalModal
        open={open}
        onOpenChange={handleCloseModal}
        title={`Examen final del curso`}
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Cargando preguntas...
            </span>
          </div>
        ) : (
          <QuizCoursePlayer
            quizzes={quizzes}
            moduleTitle={`Examen final del curso`}
            onComplete={(answers: Record<string, number>) =>
              // console.log("Respuestas enviadas", answers)
              submitQuizzes(answers)
            }
            isPractice={false}
            finalResult={finalQuizResponse}
          />
        )}
      </UniversalModal>
    </motion.div>
  );
};
