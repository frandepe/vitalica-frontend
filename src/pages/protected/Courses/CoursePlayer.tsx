// /mis-cursos/:slug

import { useAuth } from "@/hooks/useAuth";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { CoursePlayerSidebar } from "@/components/CoursePlayer/CoursePlayerSidebar";
import { CourseInstructorCard } from "@/components/CoursePlayer/CourseInstructorCard";
import { CourseModulesTab } from "@/components/CoursePlayer/tabs/CourseModulesTab";
import { CourseDownloadsTab } from "@/components/CoursePlayer/tabs/CourseDownloadsTab";
import { CourseAboutTab } from "@/components/CoursePlayer/tabs/CourseAboutTab";
import { CourseProgressTab } from "@/components/CoursePlayer/tabs/CourseProgressTab";
import { CourseReviewTab } from "@/components/CoursePlayer/tabs/CourseReviewTab";
import { useActiveLesson } from "@/store/coursePlayer.selectors";
import { useCourseAutoAdvance } from "@/hooks/useCourseAutoAdvance";
import { useCourseLessonNavigation } from "@/hooks/useCourseLessonNavigation";
import { useCoursePlayerData } from "@/hooks/useCoursePlayerData";
import { useMedia } from "@/hooks/useMedia";
import { completeLesson } from "@/api/courseProgressEndpoints";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-bar";
import { useCoursePlayerStore } from "@/store/coursePlayer.store";

export default function CoursePlayer() {
  const { slug, lessonId } = useParams();
  const setActiveLessonId = useCoursePlayerStore((s) => s.setActiveLessonId);
  const { loading, course } = useCoursePlayerData({ slug, lessonId });
  const activeLesson = useActiveLesson();
  const { user } = useAuth();
  const isMobile = useMedia();
  const navigate = useNavigate();
  const { nextLesson } = useCourseLessonNavigation({
    course,
    activeLessonId: activeLesson?.id,
  });
  const {
    isAutoAdvanceVisible,
    autoAdvanceRemainingSeconds,
    autoAdvanceProgressPct,
    autoAdvanceTargetLesson,
    startAutoAdvance,
    cancelAutoAdvance,
    navigateToAutoAdvanceTarget,
    handlePlayerPlay,
  } = useCourseAutoAdvance({
    slug,
    activeLessonId: activeLesson?.id,
  });

  useEffect(() => {
    if (!activeLesson) return;
    if (activeLesson.type !== "content") return;
    if (activeLesson.completed) return;

    const timer = setTimeout(() => {
      completeLesson(activeLesson.id);
    }, 15000);

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
      <CoursePlayerSidebar course={course} isMobile={isMobile} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6">
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

                    if (activeLesson.type !== "videoFile") return;

                    startAutoAdvance(activeLesson.id, nextLesson);
                  }}
                  onPlay={handlePlayerPlay}
                  accentColor="#20ab9f"
                />

                {isAutoAdvanceVisible && autoAdvanceTargetLesson && (
                  <Card className="mt-4 border-primary/30 bg-card/95 backdrop-blur-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          La próxima lección comienza en{" "}
                          {autoAdvanceRemainingSeconds} segundos
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {autoAdvanceTargetLesson.title}
                        </p>
                      </div>

                      <Progress
                        value={Math.min(
                          100,
                          Math.max(0, autoAdvanceProgressPct),
                        )}
                        variant="primary"
                        size="sm"
                        animated={false}
                      />

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigateToAutoAdvanceTarget(
                              autoAdvanceTargetLesson.id,
                            )
                          }
                        >
                          Ir ahora
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelAutoAdvance}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <ScrollArea className="max-h-[70vh] rounded-xl shadow-lg shadow-primary/10">
                  <div
                    className="tiptap px-6 py-5"
                    dangerouslySetInnerHTML={{
                      __html: activeLesson?.content ?? "",
                    }}
                  />
                </ScrollArea>
              </Card>
            )}

            <div className="mb-6">
              <h1 className="text-3xl font-bold my-6 text-balance">
                {activeLesson?.title}
              </h1>

              <CourseInstructorCard instructor={course.instructor} />
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
                  Reseñas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab-1" className="pt-6 space-y-10">
                <CourseModulesTab course={course} />
              </TabsContent>
              <TabsContent value="tab-2" className="pt-6 space-y-10">
                <CourseDownloadsTab materials={materials} />
              </TabsContent>
              <TabsContent value="tab-3" className="pt-6 space-y-10">
                <CourseAboutTab course={course} />
                {/* TODO: corroborar y sumar el updatedAt (que tome la ultima version PUBLISHED) */}
              </TabsContent>
              <TabsContent value="tab-4" className="pt-6 space-y-10">
                <CourseProgressTab
                  course={course}
                  navigate={navigate}
                  setActiveLessonId={setActiveLessonId}
                />
              </TabsContent>
              <TabsContent value="tab-5" className="pt-6 space-y-10">
                <CourseReviewTab
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
