import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { create } from "zustand";
import { calculateLessonCompletion } from "@/utils/courseProgress";

interface CoursePlayerState {
  course: ICourseProgressResponse | null;
  activeLessonId: string | null;

  setCourse: (course: ICourseProgressResponse) => void;
  setActiveLessonId: (lessonId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
  reset: () => void;
  resetSimulation: () => void;
}

export const useCoursePlayerStore = create<CoursePlayerState>((set) => ({
  course: null,
  activeLessonId: null,

  setCourse: (course) => set({ course }),
  setActiveLessonId: (lessonId) => set({ activeLessonId: lessonId }),
  markLessonCompleted: (lessonId) =>
    set((state) => {
      if (!state.course) return state;
      const lessonIds = state.course.modules.flatMap((module) =>
        module.lessons.map((lesson) => lesson.id),
      );
      const completedLessonIds = new Set(
        state.course.modules.flatMap((module) =>
          module.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id),
        ),
      );
      completedLessonIds.add(lessonId);
      const progress = calculateLessonCompletion({
        totalLessons: lessonIds.length,
        lessonIds,
        completedLessonIds,
      });
      return {
        course: {
          ...state.course,
          modules: state.course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
            ),
          })),
          progress: {
            ...state.course.progress,
            ...progress,
            lastSeenLessonId: state.course.progress.lastSeenLessonId,
          },
        },
      };
    }),
  reset: () => set({ course: null, activeLessonId: null }),
  resetSimulation: () =>
    set((state) => {
      if (!state.course) return state;
      return {
        course: {
          ...state.course,
          modules: state.course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) => ({
              ...lesson,
              completed: false,
            })),
          })),
          progress: {
            ...state.course.progress,
            totalLessons: state.course.modules.reduce(
              (total, module) => total + module.lessons.length,
              0,
            ),
            completedLessons: 0,
            percentage: 0,
            lastSeenLessonId: null,
          },
          finalQuiz: {
            ...state.course.finalQuiz,
            finalExamAttempts: null,
            blockedAt: null,
            unblocksAt: null,
            finalExamPassedAt: null,
            lastExamAttemptAt: null,
          },
        },
      };
    }),
}));
