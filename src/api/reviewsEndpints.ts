import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";
import { ApiResponse } from "@/types/endpoints.types";

export const upsertCourseReview = async (
  courseId: string,
  rating: number,
  comment: string,
) => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_REVIEWS}/${courseId}`,
    method: "POST",
    data: { rating, comment },
  });
};

export const getCourseReviews = async (
  courseId: string,
  page: number,
  limit: number,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_REVIEWS}/${courseId}`,
    method: "GET",
    params: {
      page,
      limit,
    },
  });
};

export const getCourseReview = async (
  courseId: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.COURSE_REVIEWS}/user/${courseId}`,
    method: "GET",
  });
};
