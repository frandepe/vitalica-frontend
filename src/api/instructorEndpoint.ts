import { ICreateCourse } from "@/types/course.types";
import { ApiResponse } from "./authEndpoints";
import { apiRequest } from "./configEndpoint";

export const upsertInstructor = async (
  data: ICreateCourse
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/instructor/upsert-application",
    method: "POST",
    data,
  });
};
