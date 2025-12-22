import { LessonType, SaveCourseDraftPayload } from "@/types/course.types";
import { apiRequest } from "./configEndpoint";
import { ApiResponse, PromoUploadStatus } from "@/types/endpoints.types";

export interface GetProductsParams {
  categoryId?: string;
  page?: number;
  search?: string;
}

export const getProducts = async (params: GetProductsParams) => {
  return apiRequest({
    url: "/api/products",
    method: "GET",
    params,
  });
};

export const createCourse = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course",
    method: "POST",
  });
};

export const getInstructorCourses = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/instructor-courses",
    method: "GET",
  });
};

export const getCourseById = async (courseId: string): Promise<ApiResponse> => {
  return apiRequest({
    url: `/api/course/${courseId}`,
    method: "GET",
  });
};

export const saveCourseAsDraft = async (
  data: SaveCourseDraftPayload
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/save-draft",
    method: "PUT",
    data,
  });
};

export const saveCourseThumbnail = async (
  id: string,
  thumbnailUrl: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/save-thumbnail",
    method: "PUT",
    data: {
      id,
      thumbnailUrl,
    },
  });
};

// 🔹 1) Obtener URL de subida directa a Mux
export const createPromoDirectUpload = async (
  courseId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/promo/direct-upload",
    method: "POST",
    data: { courseId },
  });
};

// 🔹 2) Confirmar upload y guardar asset en la base
export const confirmPromoUpload = async (
  courseId: string,
  uploadId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/promo/confirm",
    method: "POST",
    data: { courseId, uploadId },
  });
};

// 🔹 3) Consultar estado del upload (y obtener playbackId)
export const getMuxUploadStatus = async (
  uploadId: string
): Promise<PromoUploadStatus> => {
  return apiRequest({
    url: `/api/course/promo/upload-status/${uploadId}`,
    method: "GET",
  });
};

// Mux Video Lessons

// 🔹 1) Obtener URL de subida directa a Mux
export const createLessonDirectUpload = async (
  lessonId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/lesson/direct-upload",
    method: "POST",
    data: { lessonId },
  });
};

// 🔹 2) Confirmar upload y guardar asset en la base
export const confirmLessonVideoUpload = async (
  lessonId: string,
  uploadId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course/lesson/video/confirm",
    method: "POST",
    data: { lessonId, uploadId },
  });
};

// AWS S3 Material Upload Test
interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export const requestMaterialUploadUrlTest = async (
  courseId: string,
  file: File
): Promise<ApiResponse<UploadUrlResponse>> => {
  return apiRequest({
    url: "/api/course/upload-test",
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
  key: string
): Promise<ApiResponse<DownloadMaterialResponse>> => {
  return apiRequest({
    url: "/api/course/download-material",
    method: "GET",
    params: { key },
  });
};

// Creacion de Modulos y Lecciones
export const createCourseModule = async (
  courseId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `/api/course/${courseId}/modules`,
    method: "POST",
  });
};

export const deleteCourseModule = async (
  moduleId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `/api/course/module/${moduleId}`,
    method: "DELETE",
  });
};

export const createCourseLesson = async (
  moduleId: string,
  payload?: { title?: string; type: LessonType }
) => {
  return apiRequest({
    url: `/api/course/${moduleId}/lesson`,
    method: "POST",
    data: payload,
  });
};

export const deleteCourseLesson = async (
  lessonId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `/api/course/lesson/${lessonId}`,
    method: "DELETE",
  });
};

export const requestMaterialUploadUrl = async (
  lessonId: string,
  file: File
): Promise<ApiResponse<UploadUrlResponse>> => {
  return apiRequest({
    url: "/api/course/upload-lesson-material",
    method: "POST",
    data: {
      lessonId,
      fileType: file.type,
      originalName: file.name,
    },
  });
};
