import { useMemo } from "react";
import {
  ICourseProgressResponse,
  ILessonWithProgress,
} from "@/types/courseProgress.types";
import {
  getNextCourseLesson,
  getOrderedCourseLessons,
} from "@/utils/courseLessonOrder";

interface UseCourseLessonNavigationParams {
  course?: Pick<ICourseProgressResponse, "modules"> | null;
  activeLessonId?: string | null;
}

interface UseCourseLessonNavigationResult {
  orderedLessons: ILessonWithProgress[];
  nextLesson: ILessonWithProgress | null;
}

export function useCourseLessonNavigation({
  course,
  activeLessonId,
}: UseCourseLessonNavigationParams): UseCourseLessonNavigationResult {
  const orderedLessons = useMemo(() => getOrderedCourseLessons(course), [course]);

  const nextLesson = useMemo(
    () => getNextCourseLesson(orderedLessons, activeLessonId),
    [orderedLessons, activeLessonId],
  );

  return {
    orderedLessons,
    nextLesson,
  };
}
