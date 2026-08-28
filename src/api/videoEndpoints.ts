import { ApiResponse, PromoUploadStatus } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";
import { API_ROUTES } from "@/constants";

// 🔹 1) Obtener URL de subida directa a Mux
export const createPromoVideoDirectUpload = async (
  courseId: string,
  file: File
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/promo/direct-upload`,
    method: "POST",
    data: { courseId, fileName: file.name, contentType: file.type },
  });
};

// 🔹 3) Consultar estado del upload (y obtener playbackId)
export const getPromoMuxUploadStatus = async (
  courseId: string,
  uploadId: string,
): Promise<PromoUploadStatus> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/promo/${courseId}/upload-status/${uploadId}`,
    method: "GET",
  });
};

export const getLessonMuxUploadStatus = async (
  lessonId: string,
  uploadId: string,
): Promise<PromoUploadStatus> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/lesson/${lessonId}/upload-status/${uploadId}`,
    method: "GET",
  });
};

export const deleteLessonVideo = async (
  lessonId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/lesson/${lessonId}/video/delete`,
    method: "DELETE",
  });
};

// Mux Video Lessons

// 🔹 1) Obtener URL de subida directa a Mux
export const createLessonDirectUpload = async (
  lessonId: string,
  file: File
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/lesson/direct-upload`,
    method: "POST",
    data: { lessonId, fileName: file.name, contentType: file.type },
  });
};

// 🔹 2) Confirmar upload y guardar asset en la base
export const savePromoVideoToCourse = async (
  courseId: string,
  uploadId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/promo/confirm`,
    method: "POST",
    data: { courseId, uploadId },
  });
};

// 🔹 2) Confirmar upload y guardar asset en la base
export const saveLessonVideoToCourse = async (
  lessonId: string,
  uploadId: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.VIDEO}/lesson/video/confirm`,
    method: "POST",
    data: { lessonId, uploadId },
  });
};
