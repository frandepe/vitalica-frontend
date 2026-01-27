import { ICourse } from "@/types/course.types";
import { create } from "zustand";

interface CoursePlayerState {
  course: ICourse | null;
  activeLessonId: string | null;

  setCourse: (course: ICourse) => void;
  setActiveLessonId: (lessonId: string) => void;
}

export const useCoursePlayerStore = create<CoursePlayerState>((set) => ({
  course: null,
  activeLessonId: null,

  setCourse: (course) => set({ course }),
  setActiveLessonId: (lessonId) => set({ activeLessonId: lessonId }),
}));
