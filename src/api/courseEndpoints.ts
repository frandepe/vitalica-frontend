import { NewCourseFormValues } from "@/types/course.types";
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
  data: NewCourseFormValues
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
export const getPromoUploadStatus = async (
  uploadId: string
): Promise<PromoUploadStatus> => {
  return apiRequest({
    url: `/api/course/promo/upload-status/${uploadId}`,
    method: "GET",
  });
};
