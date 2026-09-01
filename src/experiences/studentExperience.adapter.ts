import {
  completeLesson,
  getCourseWithProgress,
} from "@/api/courseProgressEndpoints";
import { CourseExperienceAdapter } from "@/types/courseExperience.types";

export const studentExperienceAdapter: CourseExperienceAdapter = {
  mode: "student",
  basePath: "/mis-cursos",
  loadCourse: async (slug) => {
    const response = await getCourseWithProgress(slug);
    return response.data;
  },
  completeLesson,
  reloadCourse: async (slug) => {
    const response = await getCourseWithProgress(slug);
    return response.data;
  },
};
