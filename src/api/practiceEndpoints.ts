import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";
import {
  CreatePracticeRequestPayload,
  CreatePracticeReviewPayload,
} from "@/types/practice.types";

export const getPracticeInstructors = async () => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/instructors`,
    method: "GET",
  });
};

export const createPracticeRequest = async (
  data: CreatePracticeRequestPayload,
) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/requests`,
    method: "POST",
    data,
  });
};

export const getPracticeRequestById = async (practiceRequestId: string) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/requests/${practiceRequestId}`,
    method: "GET",
  });
};

export const cancelPracticeRequest = async (practiceRequestId: string) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/requests/${practiceRequestId}/cancel`,
    method: "POST",
  });
};

export const getPracticeReview = async (practiceRequestId: string) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/reviews/request/${practiceRequestId}/me`,
    method: "GET",
  });
};

export const createPracticeReview = async (
  practiceRequestId: string,
  data: CreatePracticeReviewPayload,
) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/reviews/request/${practiceRequestId}`,
    method: "POST",
    data,
  });
};

export const getPracticeCertificate = async (enrollmentId: string) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/certificate/${enrollmentId}`,
    method: "GET",
  });
};

export const getCoursePracticeReviews = async (
  courseId: string,
  page: number,
  limit: number,
) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/reviews/course/${courseId}`,
    method: "GET",
    params: {
      page,
      limit,
    },
  });
};

export const getInstructorPracticeRequests = async () => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/instructor/requests`,
    method: "GET",
  });
};

export const completeInstructorPracticeRequest = async (
  practiceRequestId: string,
) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/instructor/requests/${practiceRequestId}/completed`,
    method: "POST",
  });
};

export const cancelInstructorPracticeRequest = async (
  practiceRequestId: string,
) => {
  return apiRequest({
    url: `${API_ROUTES.PRACTICE}/instructor/requests/${practiceRequestId}/cancel`,
    method: "POST",
  });
};
