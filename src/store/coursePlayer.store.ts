import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { create } from "zustand";

interface CoursePlayerState {
  course: ICourseProgressResponse | null;
  activeLessonId: string | null;

  setCourse: (course: ICourseProgressResponse) => void;
  setActiveLessonId: (lessonId: string) => void;
}

export const useCoursePlayerStore = create<CoursePlayerState>((set) => ({
  course: null,
  activeLessonId: null,

  setCourse: (course) => set({ course }),
  setActiveLessonId: (lessonId) => set({ activeLessonId: lessonId }),
}));
