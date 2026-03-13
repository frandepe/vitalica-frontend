import { useCallback, useEffect, useState } from "react";
import { getCourseWithProgress } from "@/api/courseProgressEndpoints";
import { useCoursePlayerStore } from "@/store/coursePlayer.store";

interface UseCoursePlayerDataParams {
  slug?: string;
  lessonId?: string;
}

interface UseCoursePlayerDataResult {
  loading: boolean;
  course: ReturnType<typeof useCoursePlayerStore.getState>["course"];
  reloadCourse: (options?: { silent?: boolean }) => Promise<void>;
}

export function useCoursePlayerData({
  slug,
  lessonId,
}: UseCoursePlayerDataParams): UseCoursePlayerDataResult {
  const [loading, setLoading] = useState(true);
  const setCourse = useCoursePlayerStore((state) => state.setCourse);
  const setActiveLessonId = useCoursePlayerStore(
    (state) => state.setActiveLessonId,
  );
  const course = useCoursePlayerStore((state) => state.course);
  const reloadCourse = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!slug) return;

      if (!options?.silent) {
        setLoading(true);
      }

      const res = await getCourseWithProgress(slug);
      setCourse(res.data);
      if (!options?.silent) {
        setLoading(false);
      }
    },
    [setCourse, slug],
  );

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

  return {
    loading,
    course,
    reloadCourse,
  };
}
