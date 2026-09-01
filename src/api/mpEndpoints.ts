import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";

export const connectMP = async () => {
  return apiRequest({
    url: `${API_ROUTES.MP}/oauth/connect`,
    method: "GET",
  });
};
