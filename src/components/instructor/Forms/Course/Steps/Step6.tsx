import {
  BookOpen,
  Clock,
  GraduationCap,
  Tag,
  FileText,
  Video,
  CheckCircle2,
  DollarSign,
  PlayCircle,
  AlertCircle,
  XCircle,
  CheckCircle,
  AlertCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";
import { LessonTypeLabels } from "@/constants";
import { formatDuration } from "@/utils/format-duration";
import { formatPrice } from "@/utils/format-price";
import { t } from "@/utils/translations";
import { ICourse } from "@/types/course.types";

interface Props {
  course?: ICourse | null;
  completionPercentage: number;
  totalLessons?: number;
  warningCount: number;
  errorCount: number;
  minimumFinalQuizQuestions?: number;
  validationIssues: {
    type: "error" | "warning";
    message: string;
    field: string;
  }[];
}

export const Step6 = ({
  course,
  completionPercentage,
  totalLessons,
  warningCount,
  errorCount,
  minimumFinalQuizQuestions = 5,
  validationIssues,
}: Props) => {
  if (!course) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="p-6 max-w-md text-center">
          <p className="text-destructive font-medium">
            No se pudo cargar el preview
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Por favor, intenta nuevamente más tarde
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {validationIssues.length > 0 && (
        <Alert
          variant={errorCount > 0 ? "destructive" : "warning"}
          icon={AlertCircle}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="leading-snug">
              <span className="font-semibold block">
                {errorCount > 0
                  ? "Hay contenido obligatorio pendiente. Por favor, completá los campos marcados en rojo antes de finalizar el curso."
                  : "Hay contenido opcional pendiente. Podés finalizar el curso sin completar estos campos, pero se recomienda hacerlo para una mejor experiencia del alumno."}
              </span>

              {(errorCount > 0 || warningCount > 0) && (
                <span className="text-sm text-muted-foreground">
                  {errorCount > 0 &&
                    `${errorCount} ${
                      errorCount === 1
                        ? "contenido obligatorio"
                        : "contenidos obligatorios"
                    }`}
                  {errorCount > 0 && warningCount > 0 && ", "}
                  {warningCount > 0 &&
                    `${warningCount} ${
                      warningCount === 1
                        ? "contenido opcional"
                        : "contenidos opcionales"
                    }`}
                </span>
              )}
            </div>

            <Badge
              variant={errorCount > 0 ? "destructive" : "primary"}
              className="shrink-0"
            >
              {completionPercentage}% completo
            </Badge>
          </div>
        </Alert>
      )}

      {/* Hero Section with Thumbnail */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Thumbnail */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative aspect-video md:aspect-auto">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl || "/placeholder.svg"} // TODO: Crear componente de imágen genérica como placeholder, que se visualice la especialidad
                alt={course.title || "Course thumbnail"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 gap-3">
                <BookOpen className="w-24 h-24 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground text-center">
                  Sin imagen de portada
                </p>
              </div>
            )}
          </div>

          {/* Course Header Info */}
          <div className="md:col-span-3 p-6 space-y-4">
            <div>
              <div className="flex gap-2 justify-between items-center">
                {course.title ? (
                  <h1 className="text-3xl font-bold tracking-tight text-balance">
                    {course.title}
                  </h1>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-xl italic">Sin título asignado</span>
                  </div>
                )}
                <Badge variant="info" size="sm" className="self-start mt-1">
                  {t("statusCourse", course.status)}
                </Badge>
              </div>

              {course.description ? (
                <p className="text-muted-foreground mt-3 text-pretty leading-relaxed">
                  {course.description}
                </p>
              ) : (
                <p className="text-muted-foreground/60 mt-3 italic text-sm">
                  Sin descripción
                </p>
              )}
            </div>

            {/* Tags and Badges */}
            <div className="flex flex-wrap gap-2">
              {course.specialty ? (
                <Badge variant="primary" className="gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t("courseSpecialty", course.specialty)}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-dashed text-muted-foreground"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Sin especialidad
                </Badge>
              )}

              {course.level ? (
                <Badge variant="secondary" className="gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {t("courseLevel", course.level)}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-dashed text-muted-foreground"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Sin nivel
                </Badge>
              )}

              {course.tags && course.tags.length > 0 ? (
                course.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="outline"
                  className="border-dashed text-muted-foreground"
                >
                  Sin etiquetas
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {course.duration !== null ? (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatDuration(course.duration)}h de contenido
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
                  <Clock className="w-4 h-4" />
                  <span className="italic">Duración no definida</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {course.modules && course.modules.length}{" "}
                  {course.modules && course.modules.length === 1
                    ? "módulo"
                    : "módulos"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <PlayCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {totalLessons} {totalLessons === 1 ? "lección" : "lecciones"}
                </span>
              </div>

              {course.price !== null ? (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">
                    {course.currency} {formatPrice(course.price)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-destructive italic">
                    Precio no definido
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Course Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - Modules */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Contenido del curso</h2>
          </div>

          {course.modules && course.modules.length === 0 ? (
            <Alert variant="destructive" icon={XCircle}>
              <div>
                <span className="font-semibold">
                  El curso no tiene módulos.
                </span>
                <span className="text-sm ml-2">
                  Agrega al menos un módulo con lecciones.
                </span>
              </div>
            </Alert>
          ) : (
            course.modules &&
            course.modules.map((module, moduleIndex) => (
              <Card key={module.id} className="overflow-hidden">
                <div className="bg-muted/10 p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {module.order}
                        </span>
                        {module.title ? (
                          <h3 className="font-semibold text-lg">
                            {module.title}
                          </h3>
                        ) : (
                          <h3 className="font-semibold text-lg text-muted-foreground italic">
                            Módulo sin título
                          </h3>
                        )}
                      </div>
                      {module.description ? (
                        <p className="text-sm text-muted-foreground mt-2 text-pretty">
                          {module.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground/60 mt-2 italic">
                          Sin descripción
                        </p>
                      )}
                    </div>
                    {module && (module.quizzes?.length ?? 0) > 0 && (
                      <Badge variant="primary" className="shrink-0">
                        {module.quizzes!.length}{" "}
                        {module.quizzes!.length === 1
                          ? "pregunta"
                          : "preguntas"}
                      </Badge>
                    )}
                  </div>
                </div>

                {(module.lessons ?? []).length === 0 ? (
                  <div className="p-4">
                    <Alert
                      variant="destructive"
                      title="Este módulo no tiene lecciones. Agrega contenido para completarlo."
                      icon={AlertCircle}
                    />
                  </div>
                ) : (
                  <div className="divide-y">
                    {(module.lessons ?? []).map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-4 hover:bg-muted/10 border-border"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-sm text-muted-foreground font-medium shrink-0 mt-0.5">
                              {moduleIndex + 1}.{idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm leading-relaxed">
                                {lesson.title || (
                                  <span className="italic text-muted-foreground">
                                    Sin título
                                  </span>
                                )}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {lesson.type &&
                                  lesson.type in LessonTypeLabels && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs gap-1"
                                    >
                                      {lesson.type === "videoFile" && (
                                        <Video className="w-3 h-3" />
                                      )}
                                      {
                                        LessonTypeLabels[
                                          lesson.type as keyof typeof LessonTypeLabels
                                        ]
                                      }
                                    </Badge>
                                  )}
                                {lesson.lessonMaterial &&
                                  lesson.lessonMaterial?.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs gap-1"
                                    >
                                      <FileText className="w-3 h-3" />
                                      Material extra
                                    </Badge>
                                  )}
                                {lesson.isFree && (
                                  <Badge
                                    variant="success"
                                    className="text-xs gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Gratis
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Sidebar - Additional Info */}
        <div className="space-y-4">
          {validationIssues.length > 0 && (
            <Card className="p-5 border-border">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold">Completar información</h3>
              </div>
              <div className="space-y-2">
                {validationIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    {issue.type === "error" ? (
                      <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        issue.type === "error"
                          ? "text-destructive"
                          : "text-amber-600"
                      }
                    >
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
            </Card>
          )}

          {validationIssues.length === 0 && (
            <Alert variant="success" icon={CheckCircle}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Curso completo
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Toda la información del curso está completa y lista para
                publicar.
              </p>
            </Alert>
          )}

          {/* Final Exam */}
          {course.quizzes &&
          course.quizzes?.length >= minimumFinalQuizQuestions ? (
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Examen final</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.quizzes?.length}{" "}
                    {course.quizzes?.length === 1 ? "pregunta" : "preguntas"}{" "}
                    configuradas
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-5 border-dashed">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <GraduationCap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-muted-foreground">
                    Examen final
                  </h3>
                  <p className="text-sm text-muted-foreground/70 italic">
                    Para poder publicarse, el curso debe incluir un examen final
                    con un mínimo de {minimumFinalQuizQuestions} preguntas
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Requirements */}
          {course.requirementsAndMaterials ? (
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <FileText className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    Requisitos y materiales
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {course.requirementsAndMaterials}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-5 border-dashed">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-muted-foreground">
                    Requisitos y materiales
                  </h3>
                  <p className="text-sm text-muted-foreground/70 italic">
                    No se especificaron requisitos para el curso
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Course Summary */}
          <Card className="p-5 bg-muted/10">
            <h3 className="font-semibold mb-3">Resumen del curso</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Módulos:</span>
                <span className="font-medium">
                  {course.modules && course.modules.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lecciones:</span>
                <span className="font-medium">{totalLessons}</span>
              </div>
              {course.duration !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span className="font-medium">
                    {formatDuration(course.duration)} hs
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Examen final:</span>
                <span className="font-medium">
                  {course.quizzes?.length} preguntas
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {errorCount > 0 && (
        <>
          <Alert variant="destructive" icon={AlertCircleIcon}>
            Antes de enviar el curso a revisión, completá todos los campos
            obligatorios.
          </Alert>
          <Alert variant="info" icon={AlertCircleIcon}>
            ¿Necesitás ayuda con algún punto? Escribinos haciendo{" "}
            <a href="/soporte" target="_blank" className="underline">
              click aquí
            </a>
            .
          </Alert>
        </>
      )}
    </div>
  );
};
