import { apiRequest } from "./configEndpoint";
import { User } from "@/types/auth.types";

export const updateProfile = async (data: Partial<User>) => {
  return apiRequest({
    url: "/api/users/profile/update",
    method: "PUT",
    data,
  });
};

export const updateAvatarProfile = async (data: { avatarBase64: string }) => {
  return apiRequest({
    url: "/api/users/avatarProfile",
    method: "PUT",
    data,
  });
};
