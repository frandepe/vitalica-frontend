import { useState } from "react";
import { BookOpenText } from "lucide-react";
import { UniversalModal } from "@/components/UniversalModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizCoursePlayer } from "@/components/Quizzes/QuizCoursePlayer";
import { useCourseExperience } from "@/experiences/useCourseExperience";
import type {
  ICourseProgressResponse,
  IFinalQuizResult,
} from "@/types/courseProgress.types";
import type { QuizAnswerMap } from "@/types/quiz.types";

export function PreviewProgressPanel({
  course,
}: {
  course: ICourseProgressResponse;
}) {
  const experience = useCourseExperience();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<IFinalQuizResult>();
  const [simulatedCompletion, setSimulatedCompletion] = useState(false);
  const quizzes = course.previewFinalQuiz ?? [];

  const submit = async (answers: QuizAnswerMap) => {
    if (!experience.evaluateFinalExam) return;
    const response = (await experience.evaluateFinalExam(
      course.slug,
      answers,
    )) as IFinalQuizResult;
    setResult(response);
    if (response.data?.passed) setSimulatedCompletion(true);
  };

  return (
    <div className="space-y-4">
      <Card className="border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          Progreso simulado: {course.progress.percentage}% (
          {course.progress.completedLessons}/{course.progress.totalLessons}{" "}
          lecciones).
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            setResult(undefined);
            setOpen(true);
          }}
          disabled={course.progress.percentage < 100 || quizzes.length === 0}
        >
          <BookOpenText size={18} className="mr-1" /> Examen final simulado
        </Button>
        {course.progress.percentage < 100 && (
          <p className="mt-2 text-sm text-warning">
            Completa las lecciones para desbloquear el examen.
          </p>
        )}
        {simulatedCompletion && (
          <p className="mt-3 text-sm text-primary">
            Estado simulado: curso completado. Certificado y práctica son
            demostraciones no verificables.
          </p>
        )}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reiniciar simulación
        </Button>
      </Card>
      <UniversalModal
        open={open}
        onOpenChange={setOpen}
        title="Examen final simulado"
      >
        <QuizCoursePlayer
          quizzes={quizzes}
          moduleTitle="Examen final del curso"
          onComplete={submit}
          finalResult={result}
          isPractice={false}
        />
      </UniversalModal>
    </div>
  );
}
