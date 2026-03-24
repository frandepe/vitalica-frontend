// /mis-cursos/:slug

import { useAuth } from "@/hooks/useAuth";
import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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

const COURSE_PLAYER_TAB_PARAM = "tab";
const COURSE_PLAYER_TABS = {
  modules: "modules",
  downloads: "downloads",
  about: "about",
  progress: "progress",
  reviews: "reviews",
} as const;

type CoursePlayerTab =
  (typeof COURSE_PLAYER_TABS)[keyof typeof COURSE_PLAYER_TABS];

const DEFAULT_COURSE_PLAYER_TAB = COURSE_PLAYER_TABS.modules;

function isCoursePlayerTab(value: string | null): value is CoursePlayerTab {
  return (
    value === COURSE_PLAYER_TABS.modules ||
    value === COURSE_PLAYER_TABS.downloads ||
    value === COURSE_PLAYER_TABS.about ||
    value === COURSE_PLAYER_TABS.progress ||
    value === COURSE_PLAYER_TABS.reviews
  );
}

export default function CoursePlayer() {
  const { slug, lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const setActiveLessonId = useCoursePlayerStore((s) => s.setActiveLessonId);
  const { loading, course, reloadCourse } = useCoursePlayerData({
    slug,
    lessonId,
  });
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
      id: m.id,
      key: m.key,
      originalName: m.originalName,
      sizeBytes: m.sizeBytes,
      type: m.type,
    })) || [];
  const hasDownloadsTab = materials.length > 0;
  const requestedTab = searchParams.get(COURSE_PLAYER_TAB_PARAM);
  const activeTab =
    isCoursePlayerTab(requestedTab) &&
    (requestedTab !== COURSE_PLAYER_TABS.downloads || hasDownloadsTab)
      ? requestedTab
      : DEFAULT_COURSE_PLAYER_TAB;

  const completeLessonBtn = async (lessonId: string) => {
    const res = await completeLesson(lessonId);
    console.log("rescomplet", { res, lessonId });
  };

  const setCoursePlayerTab = useCallback((
    tab: CoursePlayerTab,
    options?: { replace?: boolean },
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (tab === DEFAULT_COURSE_PLAYER_TAB) {
      nextSearchParams.delete(COURSE_PLAYER_TAB_PARAM);
    } else {
      nextSearchParams.set(COURSE_PLAYER_TAB_PARAM, tab);
    }

    setSearchParams(nextSearchParams, { replace: options?.replace ?? false });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (requestedTab === activeTab) return;
    setCoursePlayerTab(activeTab, { replace: true });
  }, [activeTab, requestedTab, setCoursePlayerTab]);

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

            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setCoursePlayerTab(value as CoursePlayerTab)
              }
              className="w-full"
            >
              <TabsList className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
                <TabsTrigger
                  value={COURSE_PLAYER_TABS.modules}
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Módulos
                </TabsTrigger>
                {hasDownloadsTab && (
                  <TabsTrigger
                    value={COURSE_PLAYER_TABS.downloads}
                    disabled={materials.length === 0}
                    className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                  >
                    Descargas
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value={COURSE_PLAYER_TABS.about}
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Sobre el curso
                </TabsTrigger>
                <TabsTrigger
                  value={COURSE_PLAYER_TABS.progress}
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Progreso
                </TabsTrigger>
                <TabsTrigger
                  value={COURSE_PLAYER_TABS.reviews}
                  className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  Reseñas
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value={COURSE_PLAYER_TABS.modules}
                className="pt-6 space-y-10"
              >
                <CourseModulesTab course={course} />
              </TabsContent>
              <TabsContent
                value={COURSE_PLAYER_TABS.downloads}
                className="pt-6 space-y-10"
              >
                <CourseDownloadsTab materials={materials} />
              </TabsContent>
              <TabsContent
                value={COURSE_PLAYER_TABS.about}
                className="pt-6 space-y-10"
              >
                <CourseAboutTab course={course} />
                {/* TODO: corroborar y sumar el updatedAt (que tome la ultima version PUBLISHED) */}
              </TabsContent>
              <TabsContent
                value={COURSE_PLAYER_TABS.progress}
                className="pt-6 space-y-10"
              >
                <CourseProgressTab
                  course={course}
                  navigate={navigate}
                  setActiveLessonId={setActiveLessonId}
                  reloadCourse={reloadCourse}
                  onGoToReviews={() => {
                    setCoursePlayerTab(COURSE_PLAYER_TABS.reviews, {
                      replace: true,
                    });
                  }}
                  onContinueToPractice={async () => {
                    setCoursePlayerTab(COURSE_PLAYER_TABS.progress, {
                      replace: true,
                    });
                    await reloadCourse({ silent: true });
                  }}
                />
              </TabsContent>
              <TabsContent
                value={COURSE_PLAYER_TABS.reviews}
                className="pt-6 space-y-10"
              >
                <CourseReviewTab course={course} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
