import { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";
import { IApplyInstructor, InstructorProfile } from "@/types/instructor.types";
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
