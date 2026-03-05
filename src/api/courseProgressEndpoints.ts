import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";
import { ApiResponse } from "@/types/endpoints.types";

export const upsertCourseProgress = async (
  courseId: string,
  progress?: number,
) => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_PROGRESS}/${courseId}`,
    method: "POST",
    data: { progress },
  });
};

export const completeLesson = async (lessonId: string) => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_PROGRESS}/lesson/${lessonId}/complete`,
    method: "POST",
  });
};

export const getCourseWithProgress = async (
  slug: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_PROGRESS}/${slug}`,
    method: "GET",
  });
};

export const submitFinalExam = async (
  courseId: string,
  answers: Record<string, number>,
) => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_PROGRESS}/quiz/final/${courseId}/submit`,
    method: "POST",
    data: { answers },
  });
};

export const getCertificateByEnrollmentId = async (
  enrollmentId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_PROGRESS}/certificate/${enrollmentId}`,
    method: "GET",
  });
};
