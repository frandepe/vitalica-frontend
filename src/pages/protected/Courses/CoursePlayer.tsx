// /mis-cursos/:slug
// Usuario que ya compró el curso, pagina para realizarlo

// Ejemplos de UI:
// https://ar.pinterest.com/pin/9218374232638071/
// https://ar.pinterest.com/pin/203084264442992501/

// Curso de coursera: https://www.coursera.org/learn/protocolo-medico/lecture/z2E7o/bienvenida

// Para lo que es mux podes usar este playerSoftwareName, y para las miniaturas tene en cuenta que lo podes hacer con urls de mux tmb:

import { getCourseBySlug } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ListCheck, Menu } from "lucide-react";
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

export default function CoursePlayer() {
  const [loading, setLoading] = useState(true);
  const { slug, lessonId } = useParams();
  const setCourse = useCoursePlayerStore((s) => s.setCourse);
  const setActiveLessonId = useCoursePlayerStore((s) => s.setActiveLessonId);
  const course = useCoursePlayerStore((s) => s.course);
  const activeLesson = useActiveLesson();
  const { user } = useAuth();
  const isMobile = useMedia();

  console.log("activeLesson", activeLesson);

  useEffect(() => {
    let cancelled = false;

    const loadCourse = async () => {
      setLoading(true);

      const res = await getCourseBySlug(slug!);
      if (cancelled) return;

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
              <Card className="flex items-center gap-3 max-w-max p-4 shadow-sm hover:shadow-md transition-all">
                <Avatar
                  className="h-12 w-12 cursor-pointer"
                  onClick={() =>
                    alert("TODO: redireccionar al perfil del instructor")
                  }
                >
                  <AvatarImage
                    src={
                      course.instructor?.user?.avatarUrl ||
                      "/Placeholders/no-image-profile.png"
                    }
                  />
                  <AvatarFallback>
                    {course.instructor?.user?.firstName
                      ?.slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {course.instructor?.user?.firstName}{" "}
                    {course.instructor?.user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor?.headline}
                  </p>
                </div>
              </Card>
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
                {activeLesson?.lessonMaterial?.length}
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
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
