import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";
import { User } from "@/types/auth.types";

export const updateProfile = async (data: Partial<User>) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/profile/update`,
    method: "PUT",
    data,
  });
};

export const updateAvatarProfile = async (data: { avatarBase64: string }) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/avatarProfile`,
    method: "PUT",
    data,
  });
};
