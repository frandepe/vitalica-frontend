import {
  evaluateCoursePreviewFinalExam,
  getCoursePreview,
} from "@/api/courseEndpoints";
import { CourseExperienceAdapter } from "@/types/courseExperience.types";
import { ICourseProgressResponse } from "@/types/courseProgress.types";

const mapPreviewCourse = (data: any): ICourseProgressResponse => {
  const modules = (data.modules ?? []).map((module: any) => ({
    ...module,
    lessons: (module.lessons ?? []).map((lesson: any) => ({
      ...lesson,
      completed: false,
    })),
  }));
  const totalLessons = modules.reduce(
    (total: number, module: any) => total + module.lessons.length,
    0,
  );

  return {
    ...data,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    avgTheoreticalRating: Number(data.avgTheoreticalRating ?? 0),
    totalStudents: Number(data.totalStudents ?? 0),
    progress: {
      totalLessons,
      completedLessons: 0,
      percentage: 0,
      lastSeenLessonId: null,
    },
    modules,
    previewFinalQuiz: data.finalQuiz ?? [],
    finalQuiz: {
    finalExamAttempts: null,
    blockedAt: null,
    unblocksAt: null,
    finalExamPassedAt: null,
    lastExamAttemptAt: null,
    enrollmentId: "",
    },
  };
};

export const previewExperienceAdapter: CourseExperienceAdapter = {
  mode: "preview",
  basePath: "/vista-previa",
  loadCourse: async (slug) => {
    const response = await getCoursePreview(slug);
    if (!response.success || !response.data) {
      throw new Error(response.message ?? "No se pudo cargar el preview");
    }
    return mapPreviewCourse(response.data);
  },
  completeLesson: async () => ({ success: true, simulated: true }),
  evaluateFinalExam: async (slug, answers) => {
    const response = await evaluateCoursePreviewFinalExam(slug, answers);
    if (!response.success) throw new Error(response.message ?? "No se pudo evaluar el examen");
    return response;
  },
  reloadCourse: async (slug) => {
    const response = await getCoursePreview(slug);
    if (!response.success || !response.data) {
      throw new Error(response.message ?? "No se pudo cargar el preview");
    }
    return mapPreviewCourse(response.data);
  },
};
