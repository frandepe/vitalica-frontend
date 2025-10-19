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
