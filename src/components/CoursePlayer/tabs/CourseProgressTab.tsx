import type { NavigateFunction } from "react-router-dom";
import { ChartPie, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressCard } from "@/components/ui/progress";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { FinalQuizCoursePlayerModule } from "@/components/Quizzes/FinalQuizCoursePlayerModule";
import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { formatDate } from "@/utils/formatDate";

interface CourseProgressTabProps {
  course: ICourseProgressResponse;
  navigate: NavigateFunction;
  setActiveLessonId: (lessonId: string) => void;
}

export function CourseProgressTab({
  course,
  navigate,
  setActiveLessonId,
}: CourseProgressTabProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Tu progreso</h2>

      <ProgressCard
        title={
          course.progress.percentage < 100
            ? "Continua con el curso para desbloquear el examen final"
            : "CompletÃ¡ el examen final para obtener tu certificado"
        }
        value={course.progress.percentage}
        status={
          course.progress.percentage === 100 ? "Completado" : "Progreso"
        }
        progress={course.progress.percentage}
        icon={<ChartPie size={20} />}
        description={
          <>
            <p>
              Lecciones completadas:{" "}
              <span className="font-semibold text-primary">
                {course.progress.completedLessons} de{" "}
                {course.progress.totalLessons}
              </span>{" "}
            </p>
            {course.progress.lastSeenLessonId && (
              <Button
                variant="link"
                size="sm"
                className="mt-2 px-0"
                onClick={() =>
                  setActiveLessonId(course.progress.lastSeenLessonId!)
                }
              >
                Regresar a la Ãºltima lecciÃ³n vista
              </Button>
            )}
            {course.finalQuiz.lastExamAttemptAt && (
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1 p-1 max-w-max">
                <h3 className="font-bold mb-1 underline">Examen final:</h3>
                {course.finalQuiz.lastExamAttemptAt && (
                  <div>
                    Ãšltimo intento:{" "}
                    {formatDate(course.finalQuiz.lastExamAttemptAt)}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  Intentos: {course.finalQuiz.finalExamAttempts ?? 0} de 3
                  {course.finalQuiz.finalExamAttempts != null && (
                    <TooltipIconButton
                      tooltip={(() => {
                        const remaining = 3 - course.finalQuiz.finalExamAttempts;

                        if (remaining > 1) {
                          return `Te quedan ${remaining} intentos. Si los agotÃ¡s, se bloquearÃ¡ el examen por 7 dÃ­as.`;
                        }

                        if (remaining === 1) {
                          return "Es tu Ãºltimo intento. Si no aprobÃ¡s, el examen se bloquearÃ¡ por 7 dÃ­as.";
                        }

                        const unblocksAt = course.finalQuiz.unblocksAt
                          ? formatDate(course.finalQuiz.unblocksAt)
                          : null;

                        return unblocksAt
                          ? `Agotaste los intentos. El examen se desbloquearÃ¡ el ${unblocksAt}.`
                          : "Agotaste los intentos. ContactÃ¡ a soporte para mÃ¡s informaciÃ³n.";
                      })()}
                      side="top"
                    >
                      <Info className="h-4 w-4 text-destructive" />
                    </TooltipIconButton>
                  )}
                </div>

                {course.finalQuiz.unblocksAt && (
                  <div>
                    PrÃ³ximo intento disponible:{" "}
                    {formatDate(course.finalQuiz.unblocksAt)}
                  </div>
                )}

                {course.finalQuiz.finalExamPassedAt ? (
                  <div>
                    <p className="text-success">Â¡Examen aprobado!</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        navigate(`/certificado/${course.finalQuiz.enrollmentId}`)
                      }
                    >
                      Ver certificado
                    </Button>
                  </div>
                ) : (
                  <div className="text-yellow-700">
                    No aprobaste el examen final.
                    {course.finalQuiz.finalExamAttempts != null &&
                      course.finalQuiz.finalExamAttempts < 3 &&
                      course.finalQuiz.lastExamAttemptAt && (
                        <p>
                          PodÃ©s reintentar a partir de:{" "}
                          {formatDate(
                            new Date(
                              new Date(
                                course.finalQuiz.lastExamAttemptAt,
                              ).getTime() +
                                24 * 60 * 60 * 1000,
                            ),
                          )}
                        </p>
                      )}
                  </div>
                )}
              </div>
            )}
          </>
        }
      />

      <FinalQuizCoursePlayerModule
        courseId={course.id}
        percentage={course.progress.percentage}
        lastExamAttemptAt={course.finalQuiz.lastExamAttemptAt}
      />
    </>
  );
}
