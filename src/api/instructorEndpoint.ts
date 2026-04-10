import { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";
import {
  IApplyInstructor,
  InstructorDashboardCounts,
  InstructorProfile,
  InstructorSpecialtyRequest,
} from "@/types/instructor.types";
import {
  GetPublicInstructorsParams,
  PublicInstructorListItem,
  PublicInstructorListMeta,
} from "@/types/public-instructor.types";
import {
  InstructorReviewItem,
  InstructorReviewType,
  InstructorReviewsMeta,
  InstructorReviewsSummary,
} from "@/types/instructor-reviews.types";
import { API_ROUTES } from "@/constants";

export const upsertInstructorApplication = async (
  data: IApplyInstructor,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/upsert-application`,
    method: "POST",
    data,
  });
};

export const getInstructorApplication = async () => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/application`,
    method: "GET",
  });
};

export const submitInstructorApplication = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/application-submit`,
    method: "POST",
  });
};

export const upsertInstructorProfile = async (
  data: Partial<InstructorProfile>,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/profile`,
    method: "POST",
    data,
  });
};

export const getInstructorProfile = async () => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/profile`,
    method: "GET",
  });
};

export const createInstructorSpecialtyRequest = async (
  requestedSpecialties: string[],
  certificateImages: string[],
): Promise<ApiResponse<InstructorSpecialtyRequest>> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/specialty-requests`,
    method: "POST",
    data: {
      requestedSpecialties,
      certificateImages,
    },
  });
};

export const getInstructorSpecialtyRequests = async (): Promise<
  ApiResponse<InstructorSpecialtyRequest[]>
> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/specialty-requests`,
    method: "GET",
  });
};

export const getCoursesByInstructor = async (
  instructorId: string,
  page: number,
  limit: number,
  search: string,
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/courses/${instructorId}`,
    method: "GET",
    params: {
      page,
      limit,
      search,
    },
  });
};

export const getInstructorReviews = async (params: {
  page: number;
  limit: number;
  courseId?: string;
  type: InstructorReviewType;
}): Promise<
  ApiResponse<InstructorReviewItem[]> & {
    meta?: InstructorReviewsMeta;
    summary?: InstructorReviewsSummary;
  }
> => {
  const { page, limit, courseId, type } = params;

  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/reviews`,
    method: "GET",
    params: {
      page,
      limit,
      courseId: courseId || undefined,
      type,
    },
  });
};

export const getInstructorDashboardCounts = async (): Promise<
  ApiResponse<InstructorDashboardCounts>
> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/dashboard-counts`,
    method: "GET",
  });
};

export const sendInstructorInvitation = async (data: {
  email: string;
}): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/invite-email`,
    method: "POST",
    data,
  });
};

export const getPublicInstructors = async (params: GetPublicInstructorsParams) =>
  apiRequest({
    url: `${API_ROUTES.INSTRUCTOR}/public`,
    method: "GET",
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search?.trim() || undefined,
      specialty:
        params.specialty && params.specialty !== "ALL"
          ? params.specialty
          : undefined,
    },
  }) as Promise<
    ApiResponse<PublicInstructorListItem[]> & { meta?: PublicInstructorListMeta }
  >;
