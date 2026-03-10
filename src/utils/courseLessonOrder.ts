import {
  ICourseProgressResponse,
  ILessonWithProgress,
} from "@/types/courseProgress.types";

type CourseModulesSource = Pick<ICourseProgressResponse, "modules"> | null | undefined;

export function getOrderedCourseLessons(
  course: CourseModulesSource,
): ILessonWithProgress[] {
  if (!course?.modules?.length) return [];

  return [...course.modules]
    .sort((a, b) => a.order - b.order)
    .flatMap((module) =>
      [...(module.lessons ?? [])]
        .filter((lesson): lesson is ILessonWithProgress => Boolean(lesson))
        .sort((a, b) => a.order - b.order),
    );
}

export function getNextCourseLesson(
  orderedLessons: ILessonWithProgress[],
  activeLessonId?: string | null,
): ILessonWithProgress | null {
  if (!activeLessonId) return null;

  const activeIndex = orderedLessons.findIndex(
    (lesson) => lesson.id === activeLessonId,
  );

  if (activeIndex < 0 || activeIndex >= orderedLessons.length - 1) {
    return null;
  }

  return orderedLessons[activeIndex + 1];
}
