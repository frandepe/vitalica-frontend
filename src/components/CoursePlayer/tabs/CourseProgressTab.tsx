import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";
import {
  ArrowRight,
  ChartPie,
  GraduationCap,
  Info,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressCard } from "@/components/ui/progress";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { FinalQuizCoursePlayerModule } from "@/components/Quizzes/FinalQuizCoursePlayerModule";
import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { formatDate } from "@/utils/formatDate";

interface CourseProgressTabProps {
  course: ICourseProgressResponse;
  navigate: NavigateFunction;
  setActiveLessonId: (lessonId: string) => void;
  reloadCourse: (options?: { silent?: boolean }) => Promise<void>;
  onGoToReviews: () => void;
  onContinueToPractice: () => Promise<void>;
}

function getTheoryProgressTitle(course: ICourseProgressResponse) {
  if (course.finalQuiz.finalExamPassedAt) {
    return "Continuá con la práctica presencial para completar tu avance";
  }

  if (course.progress.percentage < 100) {
    return "Continuá con el curso para desbloquear el examen final";
  }

  return "Completá el examen final para obtener tu certificado";
}

function getTheoryProgressStatus(course: ICourseProgressResponse) {
  if (course.finalQuiz.finalExamPassedAt) {
    return "Aprobado";
  }

  if (course.progress.percentage === 100) {
    return "Completado";
  }

  return "Progreso";
}

function getTheorySectionSummary(course: ICourseProgressResponse) {
  if (course.finalQuiz.finalExamPassedAt) {
    return {
      title: "Teoría completada",
      description:
        "Ya terminaste la cursada teórica y aprobaste el examen final.",
      nextStep:
        "Continuá con la práctica presencial para completar el recorrido.",
    };
  }

  if (course.progress.percentage < 100) {
    return {
      title: "Teoría en curso",
      description:
        "Aca ves el avance de lecciones, el estado del examen final y tu certificado teórico.",
      nextStep:
        "Completá las lecciones pendientes para habilitar el examen final.",
    };
  }

  return {
    title: "Teoría lista para examen",
    description:
      "Ya completaste la cursada teórica. Solo falta rendir y aprobar el exámen final.",
    nextStep: "Presentate al examen final para cerrar esta etapa.",
  };
}

function getPracticeSectionSummary(course: ICourseProgressResponse) {
  const practice = course.practice;

  if (!practice?.requiresPractice) return null;

  if (practice.practiceCompleted) {
    return {
      title: "Práctica completada",
      description:
        "La etapa práctica ya fue registrada y desde abajo podes revisar su estado final.",
      nextStep: "Si corresponde, accede a tu certificado práctico.",
    };
  }

  if (practice.latestPracticeRequestStatus === "PENDING") {
    return {
      title: "Práctica en coordinacián",
      description:
        "Ya hay una solicitud creada. En esta sección podes seguir su estado y ver los datos de contacto.",
      nextStep: "Revisá la solicitud actual y coordiná con tu instructor.",
    };
  }

  if (practice.practiceUnlockedAt) {
    return {
      title: "Práctica habilitada",
      description:
        "Ya completaste lo necesario para pasar a la etapa presencial.",
      nextStep: "El siguiente paso es elegir instructor y crear tu solicitud.",
    };
  }

  return {
    title: "Práctica bloqueada",
    description:
      "La práctica presencial sigue dependiendo del avance en la parte teórica.",
    nextStep: "Primero completá la teoría y el examen final requerido.",
  };
}

interface ProgressSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  summaryTitle: string;
  summaryDescription: string;
  nextStep: string;
  children: ReactNode;
}

function PracticeRedirectCard({ navigate }: { navigate: NavigateFunction }) {
  return (
    <Card className="border-dashed bg-muted/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base font-semibold">
          Etapa práctica
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          La gestión de la práctica ahora se realiza desde la sección “Práctica”
          de Mis cursos. Desde ahí podés ver el estado, elegir instructor,
          seguir tu solicitud o acceder al certificado cuando corresponda.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate("/mis-cursos?tab=practico")}
        >
          Ir a mis prácticas
        </Button>
      </CardContent>
    </Card>
  );
}

function ProgressSection({
  eyebrow,
  title,
  description,
  icon,
  summaryTitle,
  summaryDescription,
  nextStep,
  children,
}: ProgressSectionProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-border bg-background/80 p-4 shadow-sm md:p-6">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Información principal */}
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon}
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {title}
                </h3>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="border-t border-border/60 bg-muted/20 lg:border-l lg:border-t-0">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary/30" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Estado actual
                </p>
              </div>

              <h4 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {summaryTitle}
              </h4>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {summaryDescription}
              </p>
            </div>

            {/* Próximo paso */}
            <div className="border-t border-border/60 bg-background/60 px-5 py-4 sm:px-6">
              <p className="text-xs font-medium text-muted-foreground">
                Siguiente paso
              </p>

              <div className="mt-1.5 flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <p className="text-sm font-medium leading-5 text-foreground">
                  {nextStep}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

export function CourseProgressTab({
  course,
  navigate,
  setActiveLessonId,
  onContinueToPractice,
}: CourseProgressTabProps) {
  const theorySection = getTheorySectionSummary(course);
  const practiceSection = getPracticeSectionSummary(course);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Progreso del curso
        </p>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Tu progreso
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Seguí tu avance, desde la formación teórica hasta la práctica
          presencial.
        </p>
      </div>

      <ProgressSection
        eyebrow="Etapa 1"
        title="Progreso teórico"
        description="Avance de tus clases, examen final y acceso al certificado teórico."
        icon={<GraduationCap className="h-5 w-5" />}
        summaryTitle={theorySection.title}
        summaryDescription={theorySection.description}
        nextStep={theorySection.nextStep}
      >
        <ProgressCard
          className="border-primary/20"
          title={getTheoryProgressTitle(course)}
          value={course.progress.percentage}
          status={getTheoryProgressStatus(course)}
          progress={course.progress.percentage}
          icon={<ChartPie size={20} />}
          description={
            <>
              <p>
                Lecciones completadas:{" "}
                <span className="font-semibold text-primary">
                  {course.progress.completedLessons} de{" "}
                  {course.progress.totalLessons}
                </span>
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
                  Regresar a la ultima leccion vista
                </Button>
              )}
              {course.finalQuiz.lastExamAttemptAt && (
                <div className="max-w-max space-y-1 p-1 text-sm text-slate-700 dark:text-slate-300">
                  <h3 className="mb-1 font-bold underline">Examen final:</h3>
                  <div>
                    Ultimo intento:{" "}
                    {formatDate(course.finalQuiz.lastExamAttemptAt)}
                  </div>

                  <div className="flex items-center gap-1">
                    Intentos: {course.finalQuiz.finalExamAttempts ?? 0} de 3
                    {course.finalQuiz.finalExamAttempts != null && (
                      <TooltipIconButton
                        tooltip={(() => {
                          const remaining =
                            3 - course.finalQuiz.finalExamAttempts;

                          if (remaining > 1) {
                            return `Te quedan ${remaining} intentos. Si los agotas, se bloqueara el examen por 7 dias.`;
                          }

                          if (remaining === 1) {
                            return "Es tu ultimo intento. Si no aprobas, el examen se bloqueara por 7 dias.";
                          }

                          const unblocksAt = course.finalQuiz.unblocksAt
                            ? formatDate(course.finalQuiz.unblocksAt)
                            : null;

                          return unblocksAt
                            ? `Agotaste los intentos. El examen se desbloqueara el ${unblocksAt}.`
                            : "Agotaste los intentos. Contacta a soporte para mas informacion.";
                        })()}
                        side="top"
                      >
                        <Info className="h-4 w-4 text-destructive" />
                      </TooltipIconButton>
                    )}
                  </div>

                  {course.finalQuiz.unblocksAt && (
                    <div>
                      Proximo intento disponible:{" "}
                      {formatDate(course.finalQuiz.unblocksAt)}
                    </div>
                  )}

                  {course.finalQuiz.finalExamPassedAt ? (
                    <div>
                      <p className="text-success">Examen aprobado.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() =>
                          navigate(
                            `/certificado/${course.finalQuiz.enrollmentId}`,
                          )
                        }
                      >
                        Ver certificado teórico
                      </Button>
                    </div>
                  ) : (
                    <div className="text-yellow-700">
                      No aprobaste el examen final.
                      {course.finalQuiz.finalExamAttempts != null &&
                        course.finalQuiz.finalExamAttempts < 3 &&
                        course.finalQuiz.lastExamAttemptAt && (
                          <p>
                            Podes reintentar a partir de:{" "}
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

        <Card className="border-dashed bg-muted/10 p-2">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-base font-semibold">
              Examen final
            </CardTitle>
            <CardDescription className="text-sm leading-6">
              Completá el examen final para finalizar la etapa teórica y avanzar
              a la práctica presencial.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <FinalQuizCoursePlayerModule
              courseId={course.id}
              percentage={course.progress.percentage}
              lastExamAttemptAt={course.finalQuiz.lastExamAttemptAt}
              onContinueAfterPass={onContinueToPractice}
            />
          </CardContent>
        </Card>
      </ProgressSection>

      {practiceSection && course.practice && (
        <ProgressSection
          eyebrow="Etapa 2"
          title="Progreso práctico"
          description="Esta sección concentra la práctica presencial, su solicitud, el seguimiento con instructor y el certificado práctico."
          icon={<Stethoscope className="h-5 w-5" />}
          summaryTitle={practiceSection.title}
          summaryDescription={practiceSection.description}
          nextStep={practiceSection.nextStep}
        >
          <PracticeRedirectCard navigate={navigate} />
        </ProgressSection>
      )}
    </div>
  );
}
