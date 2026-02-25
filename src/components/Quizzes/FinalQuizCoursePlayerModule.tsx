import { useState } from "react";
import { UniversalModal } from "../UniversalModal";
import { Button } from "../ui/button";

import { getFinalCourseQuizzes } from "@/api";
import { BookOpenText, Loader2 } from "lucide-react";
import { QuizCoursePlayerModule } from "./QuizCoursePlayerModule";
import { motion } from "framer-motion";

interface Props {
  courseId: string;
  percentage: number;
}

export const FinalQuizCoursePlayerModule = ({
  courseId,
  percentage,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const handleOpenExam = async () => {
    setOpen(true);

    try {
      setLoading(true);
      const res = await getFinalCourseQuizzes(courseId);
      console.log("res", res);

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
        variant="link"
        disabled={loading || percentage < 100}
        className="bg-gradient-to-r from-primary/10 to-gray-200 w-full"
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
          <QuizCoursePlayerModule
            quizzes={quizzes}
            moduleTitle={`Examen final del curso`}
            onComplete={(score, total) => {
              console.log(`Quiz completado: ${score}/${total} correctas`);
            }}
          />
        )}
      </UniversalModal>
    </motion.div>
  );
};
