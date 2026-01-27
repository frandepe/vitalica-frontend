import { useCoursePlayerStore } from "./coursePlayer.store";

export const useActiveLesson = () => {
  return useCoursePlayerStore((state) => {
    if (!state.course || !state.activeLessonId) return null;

    return state.course
      .modules!.flatMap((m) => m.lessons)
      .find((l) => l!.id === state.activeLessonId);
  });
};
