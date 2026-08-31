import { API_ROUTES } from "@/constants";
import { apiRequest } from "./configEndpoint";
import { IOnboarding, User } from "@/types/auth.types";
import { NotificationsResponseData } from "@/types/notification.types";
import type { ApiResponse } from "@/types/endpoints.types";
import type { AchievementsData } from "@/types/achievement.types";

export const updateProfile = async (data: Partial<User>) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/profile/update`,
    method: "PUT",
    data,
  });
};

export const updateAvatarProfile = async (data: {
  avatarBase64: string;
}): Promise<ApiResponse<Pick<User, "avatarUrl" | "avatarUrlId">>> => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/avatarProfile`,
    method: "PUT",
    data,
  });
};

export const getUserOnboarding = async () => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/onboarding`,
    method: "GET",
  });
};

export const getProfileBySlug = async (slug: string) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/profile/${slug}`,
    method: "GET",
  });
};

export const updateUserOnboarding = async (data: IOnboarding) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/onboarding`,
    method: "PUT",
    data,
  });
};

export const getMyCoursesEnrrolled = async (
  page: number,
  limit: number,
  search: string,
) => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/courses`,
    method: "GET",
    params: {
      page,
      limit,
      search,
    },
  });
};

export const getMyNotifications = async (): Promise<{
  success: boolean;
  data?: NotificationsResponseData;
  message?: string;
}> => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/notifications`,
    method: "GET",
  });
};

export const getMyAchievements = async (): Promise<
  ApiResponse<AchievementsData>
> => {
  return apiRequest({
    url: `${API_ROUTES.USERS}/achievements`,
    method: "GET",
  });
};
