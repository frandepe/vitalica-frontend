import { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";
import { IApplyInstructor, InstructorProfile } from "@/types/instructor.types";

export const upsertInstructorApplication = async (
  data: IApplyInstructor
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/instructor/upsert-application",
    method: "POST",
    data,
  });
};

export const getInstructorApplication = async () => {
  return apiRequest({
    url: "/api/instructor/application",
    method: "GET",
  });
};

export const upsertInstructorProfile = async (
  data: InstructorProfile
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/instructor/profile",
    method: "POST",
    data,
  });
};

export const getInstructorProfile = async () => {
  return apiRequest({
    url: "/api/instructor/profile",
    method: "GET",
  });
};
