import {
  CoursePublishValidation,
  LessonType,
  SaveCourseDraftPayload,
} from "@/types/course.types";
import { apiRequest } from "./configEndpoint";
import { ApiResponse } from "@/types/endpoints.types";

import { API_ROUTES } from "@/constants";

export const createCourse = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}`,
    method: "POST",
  });
};

export const getInstructorCourses = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/instructor-courses`,
    method: "GET",
  });
};

export const getCourses = async (
  page: number,
  limit: number,
  search: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/`,
    method: "GET",
    params: {
      page,
      limit,
      search,
    },
  });
};

export const getCourseById = async (courseId: string): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/${courseId}`,
    method: "GET",
  });
};

export const getCourseBySlug = async (slug: string): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/public/${slug}`,
    method: "GET",
  });
};

export const saveCourseAsDraft = async (
  data: SaveCourseDraftPayload,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/save-draft`,
    method: "PUT",
    data,
  });
};

export const saveCourseThumbnail = async (
  id: string,
  thumbnailUrl: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/save-thumbnail`,
    method: "PUT",
    data: {
      id,
      thumbnailUrl,
    },
  });
};

// AWS S3 Material Upload Test
interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export const requestMaterialUploadUrlTest = async (
  courseId: string,
  file: File,
): Promise<ApiResponse<UploadUrlResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/upload-test`,
    method: "POST",
    data: {
      courseId,
      fileType: file.type,
      originalName: file.name,
    },
  });
};

interface DownloadMaterialResponse {
  url: string;
}

export const requestMaterialDownloadUrl = async (
  key: string,
): Promise<ApiResponse<DownloadMaterialResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/download-material`,
    method: "GET",
    params: { key },
  });
};

// Creacion de Modulos y Lecciones
export const createCourseModule = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/${courseId}/modules`,
    method: "POST",
  });
};

export const deleteCourseModule = async (
  moduleId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/module/${moduleId}`,
    method: "DELETE",
  });
};

export const createCourseLesson = async (
  moduleId: string,
  payload?: { title?: string; type: LessonType },
) => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/${moduleId}/lesson`,
    method: "POST",
    data: payload,
  });
};

export const deleteCourseLesson = async (
  lessonId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/lesson/${lessonId}`,
    method: "DELETE",
  });
};

export const requestMaterialUploadUrl = async (
  lessonId: string,
  file: File,
): Promise<ApiResponse<UploadUrlResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/upload-lesson-material`,
    method: "POST",
    data: {
      lessonId,
      fileType: file.type,
      originalName: file.name,
    },
  });
};

export interface CreateModuleQuizPayload {
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const createModuleQuiz = async (
  payload: CreateModuleQuizPayload,
): Promise<ApiResponse<{ id: string }>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/module/quiz`,
    method: "POST",
    data: payload,
  });
};

export const getModuleQuizzes = async (
  moduleId: string,
): Promise<ApiResponse<any[]>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/module/${moduleId}/quizzes`,
    method: "GET",
  });
};

export const getFinalCourseQuizzes = async (
  courseId: string,
): Promise<ApiResponse<any[]>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/quiz/final/${courseId}`,
    method: "GET",
  });
};

export const deleteModuleQuiz = async (
  quizId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/module/quiz/${quizId}`,
    method: "DELETE",
  });
};

export const reorderModuleQuizzes = async (
  moduleId: string,
  quizIds: string[],
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/module/${moduleId}/quizzes/reorder`,
    method: "PATCH",
    data: { quizIds },
  });
};

export interface CreateFinalQuizPayload {
  courseId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Crear quiz final del curso
export const createFinalQuiz = async (
  payload: CreateFinalQuizPayload,
): Promise<ApiResponse<{ id: string }>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/quiz/final-quiz`,
    method: "POST",
    data: payload,
  });
};

// Obtener quizzes finales del curso
export const getFinalQuizzes = async (
  courseId: string,
): Promise<ApiResponse<any[]>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/quiz/final/${courseId}`,
    method: "GET",
  });
};

// Eliminar quiz final
export const deleteFinalQuiz = async (quizId: string): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/quiz/final/${quizId}`,
    method: "DELETE",
  });
};

export const reorderFinalQuizzes = async (
  courseId: string,
  quizIds: string[],
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/quiz/final/${courseId}/reorder`,
    method: "PATCH",
    data: { quizIds },
  });
};

// Obtener preview de un curso (estructura, lecciones, quizzes)
export const getCoursePreview = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/preview/${courseId}`,
    method: "GET",
  });
};

// Enviar curso para revisión
export const submitCourseForReview = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/submit/${courseId}`,
    method: "PATCH",
  });
};

export const getCourseStatus = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/status/${courseId}`,
    method: "GET",
  });
};

export const validateCourseForPublication = async (
  courseId: string,
): Promise<ApiResponse<CoursePublishValidation>> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/validate/${courseId}`,
    method: "GET",
  });
};

export const getFreeLessons = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/free-lessons/${courseId}`,
    method: "GET",
  });
};

export const createOrGetCourseDraft = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE}/edit-published/${courseId}`,
    method: "POST",
  });
};
