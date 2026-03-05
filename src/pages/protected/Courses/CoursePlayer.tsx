// /mis-cursos/:slug
// Usuario que ya compró el curso, pagina para realizarlo

// Ejemplos de UI:
// https://ar.pinterest.com/pin/9218374232638071/
// https://ar.pinterest.com/pin/203084264442992501/

// Curso de coursera: https://www.coursera.org/learn/protocolo-medico/lecture/z2E7o/bienvenida

// Para lo que es mux podes usar este playerSoftwareName, y para las miniaturas tene en cuenta que lo podes hacer con urls de mux tmb:

import { useAuth } from "@/hooks/useAuth";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, ListCheck, Menu, ChartPie, Info } from "lucide-react";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { ModulesAccordionCoursePlayer } from "@/components/Accordion/ModulesAccordionCoursePlayer";
import { useCoursePlayerStore } from "@/store/coursePlayer.store";
import { useActiveLesson } from "@/store/coursePlayer.selectors";
import { formatDuration } from "@/utils/format-duration";
import { t } from "@/utils/translations";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { useMedia } from "@/hooks/useMedia";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  completeLesson,
  getCourseWithProgress,
} from "@/api/courseProgressEndpoints";
import { DownloadMaterial } from "@/components/Download/DownloadMaterial";
import { FinalQuizCoursePlayerModule } from "@/components/Quizzes/FinalQuizCoursePlayerModule";
import { ProgressCard } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { GiveReview } from "@/components/Reviews/GiveReview";
// import { CertificateDownloadButton } from "@/templates/certificate.template";

export default function CoursePlayer() {
  const [loading, setLoading] = useState(true);
  const { slug, lessonId } = useParams();
  const setCourse = useCoursePlayerStore((s) => s.setCourse);
  const setActiveLessonId = useCoursePlayerStore((s) => s.setActiveLessonId);
  const course = useCoursePlayerStore((s) => s.course);
  const activeLesson = useActiveLesson();
  const { user } = useAuth();
  const isMobile = useMedia();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadCourse = async () => {
      setLoading(true);

      const res = await getCourseWithProgress(slug!);
      console.log("res getCourseWithProgress", res);
      if (cancelled) return;
      // TODO: Si res.message === "No estás inscrito en este curso" redirigir a la vista de compra del curso

      setCourse(res.data);
      setLoading(false);
    };

    loadCourse();

    return () => {
      cancelled = true;
    };
  }, [slug, setCourse]);

  useEffect(() => {
    if (!course) return;

    const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;

    const nextLessonId = lessonId ?? firstLessonId;

    if (!nextLessonId) return;

    setActiveLessonId(nextLessonId);
  }, [lessonId, course, setActiveLessonId]);

  // auto completar contenido de lectura después de 15s
  useEffect(() => {
    if (!activeLesson) return;
    if (activeLesson.type !== "content") return;
    if (activeLesson.completed) return;

    const timer = setTimeout(() => {
      completeLesson(activeLesson.id);
    }, 15000);

    // si cambia la lección o se va → cancelar
    return () => clearTimeout(timer);
  }, [activeLesson]);

  const materials =
    activeLesson?.lessonMaterial?.map((m) => ({
      key: m.key,
      originalName: m.key.split(".").pop() || "archivo",
    })) || [];

  const completeLessonBtn = async (lessonId: string) => {
    const res = await completeLesson(lessonId);
    console.log("rescomplet", { res, lessonId });
  };

  if (loading || !course) return <GlobalLoading text="Obteniendo curso..." />;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Course List */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild className="absolute top-6 left-6 z-50">
            <Menu />
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>{course.title}</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                <ModulesAccordionCoursePlayer modules={course.modules!} />
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="w-80 border-r border-border bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold mb-4">{course.title}</h1>

            {/* Language Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="primary">
                {t("courseSpecialty", course.specialty!)}
              </Badge>
              <Badge variant="outline">{t("courseLevel", course.level!)}</Badge>
            </div>
          </div>

          {/* Course List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              <ModulesAccordionCoursePlayer modules={course.modules!} />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Right Side - Video Player and Course Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Video Player */}
            {activeLesson?.type === "videoFile" ? (
              <div className="rounded-lg overflow-hidden">
                <MuxPlayer
                  playbackId={activeLesson?.muxPlaybackId}
                  className="w-full 2xl:h-[80vh] mux-custom"
                  metadata={{
                    video_id: activeLesson?.muxPlaybackId,
                    video_title: course.title,
                    viewer_user_id: user.id.toString(),
                  }}
                  onEnded={() => {
                    completeLessonBtn(activeLesson.id);
                  }}
                  accentColor="#20ab9f"
                />
              </div>
            ) : (
              <Card>
                <ScrollArea className="max-h-[70vh] rounded-xl shadow-lg shadow-primary/10">
                  <div
                    className="tiptap px-6 py-5"
                    dangerouslySetInnerHTML={{ __html: activeLesson?.content! }}
                  />
                </ScrollArea>
              </Card>
            )}

            {/* Course Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold my-6 text-balance">
                {activeLesson?.title}
              </h1>

              {/* Instructor */}
              <a
                href={`/perfil/${course.instructor.user.slug}`}
                className="group flex gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 transition-colors"
                target="_blank"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {course.instructor.user.avatarUrl ? (
                    <img
                      src={course.instructor.user.avatarUrl}
                      alt={`${course.instructor.user.firstName} ${course.instructor.user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    `${course.instructor.user.firstName?.[0] ?? ""}${
                      course.instructor.user.lastName?.[0] ?? ""
                    }`
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground group-hover:underline underline-offset-4">
                    {course.instructor.user.firstName}{" "}
                    {course.instructor.user.lastName}
                  </p>

                  {course.instructor.bio && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                      {course.instructor.bio}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    Ver perfil del instructor
                  </p>
                </div>
              </a>
            </div>

            <Tabs defaultValue="tab-1" className="w-full">
              <TabsList className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
                <TabsTrigger
                  value="tab-1"
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Módulos
                </TabsTrigger>
                {activeLesson?.lessonMaterial && (
                  <TabsTrigger
                    value="tab-2"
                    disabled={activeLesson.lessonMaterial.length === 0}
                    className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                  >
                    Descargas
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="tab-3"
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Sobre el curso
                </TabsTrigger>
                <TabsTrigger
                  value="tab-4"
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Progreso
                </TabsTrigger>
                <TabsTrigger
                  value="tab-5"
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Reseña
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab-1" className="pt-6 space-y-10">
                {/* Course Content */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Contenido</h2>
                    <span className="text-sm text-muted-foreground">
                      Duración {formatDuration(course.duration)}hs
                    </span>
                  </div>

                  <div className="space-y-3">
                    {course.modules!.map((module) => (
                      <Card
                        key={module.id}
                        className="hover:shadow-md transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-20 w-28 rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Badge className="flex gap-1">
                                {module.order}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">
                                {module.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {module.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ListCheck className="h-3 w-3" />
                                Lecciones {module.lessons!.length}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tab-2" className="pt-6 space-y-10">
                <DownloadMaterial materials={materials} />
              </TabsContent>
              <TabsContent value="tab-3" className="pt-6 space-y-10">
                {/* Additional Information */}

                <div>
                  <h2 className="text-xl font-bold mb-4">{course.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {course.description}
                  </p>
                </div>

                {course.specialty && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Especialidad</h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {t("courseSpecialty", course.specialty)}
                    </p>
                  </div>
                )}
                {course.level && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Nivel</h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {t("courseLevel", course.level)}
                    </p>
                  </div>
                )}
                {course.requirementsAndMaterials && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Requisitos y materiales
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {course.requirementsAndMaterials}
                    </p>
                  </div>
                )}
                {course.duration && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Duración aproximada{" "}
                      <span className="text-muted-foreground text-sm font-medium">
                        (Establecida por el autor)
                      </span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {formatDuration(course.duration)} horas
                    </p>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold mb-4">Califiación</h2>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(course.avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground">
                      {course.totalStudents} • estudiantes
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Fecha de publicación
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {useFormattedDate(course.publishedAt!, { showTime: false })}
                  </p>
                </div>
                {/* TODO: corroborar y sumar el updatedAt (que tome la ultima version PUBLISHED) */}
              </TabsContent>
              <TabsContent value="tab-4" className="pt-6 space-y-10">
                {/* Progress */}

                <h2 className="text-xl font-bold mb-4">Tu progreso</h2>

                <ProgressCard
                  title={
                    course.progress.percentage < 100
                      ? "Continua con el curso para desbloquear el examen final"
                      : "Completá el examen final para obtener tu certificado"
                  }
                  value={course.progress.percentage}
                  status={
                    course.progress.percentage === 100
                      ? "Completado"
                      : "Progreso"
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
                          Regresar a la última lección vista
                        </Button>
                      )}
                      {course.finalQuiz.lastExamAttemptAt && (
                        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1 p-1 max-w-max">
                          {/* Último intento */}
                          {course.finalQuiz.lastExamAttemptAt && (
                            <div>
                              Último intento:{" "}
                              {useFormattedDate(
                                course.finalQuiz.lastExamAttemptAt,
                              )}
                            </div>
                          )}

                          {/* Intentos usados */}
                          <div className="flex items-center gap-1">
                            Intentos: {course.finalQuiz.finalExamAttempts ?? 0}{" "}
                            de 3
                            {course.finalQuiz.finalExamAttempts != null && (
                              <TooltipIconButton
                                tooltip={(() => {
                                  const remaining =
                                    3 - course.finalQuiz.finalExamAttempts;

                                  if (remaining > 1) {
                                    return `Te quedan ${remaining} intentos. Si los agotás, se bloqueará el examen por 7 días.`;
                                  }

                                  if (remaining === 1) {
                                    return "Es tu último intento. Si no aprobás, el examen se bloqueará por 7 días.";
                                  }

                                  // Agotó los intentos — mostrar fecha exacta de desbloqueo
                                  const unblocksAt = course.finalQuiz.unblocksAt
                                    ? useFormattedDate(
                                        course.finalQuiz.unblocksAt,
                                      )
                                    : null;

                                  return unblocksAt
                                    ? `Agotaste los intentos. El examen se desbloqueará el ${unblocksAt}.`
                                    : "Agotaste los intentos. Contactá a soporte para más información.";
                                })()}
                                side="top"
                              >
                                <Info className="h-4 w-4 text-destructive" />
                              </TooltipIconButton>
                            )}
                          </div>

                          {/* Próximo intento */}
                          {course.finalQuiz.unblocksAt && (
                            <div>
                              Próximo intento disponible:{" "}
                              {useFormattedDate(course.finalQuiz.unblocksAt)}
                            </div>
                          )}

                          {/* Feedback de aprobación */}
                          {course.finalQuiz.finalExamPassedAt ? (
                            <div>
                              <p className="text-success">¡Examen aprobado!</p>
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
                                Ver certificado
                              </Button>
                              {/* <CertificateDownloadButton
                                courseName={course.title!}
                                enrollmentId={course.id}
                                finalExamPassedAt={
                                  course.finalQuiz.lastExamAttemptAt
                                }
                                instructorName={
                                  course.instructor.user.firstName +
                                  " " +
                                  course.instructor.user.lastName
                                }
                                issuedBy="ACES"
                                studentName={""}
                              /> */}
                            </div>
                          ) : (
                            <div className="text-yellow-700">
                              No aprobaste el examen final.
                              {/* Si tiene intentos restantes y cooldown */}
                              {course.finalQuiz.finalExamAttempts != null &&
                                course.finalQuiz.finalExamAttempts < 3 &&
                                course.finalQuiz.lastExamAttemptAt && (
                                  <p>
                                    Podés reintentar a partir de:{" "}
                                    {useFormattedDate(
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
              </TabsContent>
              <TabsContent value="tab-5" className="pt-6 space-y-10">
                <GiveReview
                  courseId={course.id}
                  percentage={course.progress.percentage}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
