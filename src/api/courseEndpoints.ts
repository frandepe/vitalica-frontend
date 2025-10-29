import { ICreateCourse } from "@/types/course.types";
import { ApiResponse } from "./authEndpoints";
import { apiRequest } from "./configEndpoint";

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

export const createCourse = async (
  data: ICreateCourse
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/course",
    method: "POST",
    data,
  });
};
// export const upsertCourse = async (
//   data: NewCourseFormValues
// ): Promise<ApiResponse> => {
//   return apiRequest({
//     url: "/api/course/upsert",
//     method: "POST",
//     data,
//   });
// };
