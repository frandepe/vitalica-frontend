import { StatusInstructorApplication } from "@/types/instructor.types";
import { apiRequest } from "./configEndpoint";
import { API_ROUTES } from "@/constants";
import { ApiResponse } from "@/types/endpoints.types";
import { ISpecialty } from "@/types/course.types";
import {
  AdminInstructorSpecialtyProfile,
  AdminInstructorSpecialtyRequest,
  GetAllCoursesAdminParams,
  GetAllCoursesAdminResponse,
  UpdateCourseFeedbackParams,
} from "@/types/admin.types";

interface PropsGiveInstructorApplicationFeedback {
  status: StatusInstructorApplication;
  reviewedBy: string;
  reviewerNotes: string;
  approvedSpecialties?: ISpecialty[];
}

export const getInstructorApplications = async () => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/applications`,
    method: "GET",
  });
};

export const getInstructorApplicationById = async (applicationId: string) => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/application/${applicationId}`,
    method: "GET",
  });
};

export const giveInstructorApplicationFeedback = async (
  applicationId: string,
  data: PropsGiveInstructorApplicationFeedback
) => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/feedback/${applicationId}`,
    method: "PUT",
    data,
  });
};

export const getAllCoursesAdmin = async (
  params?: GetAllCoursesAdminParams
): Promise<ApiResponse<GetAllCoursesAdminResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/courses`,
    method: "GET",
    params,
  });
};

export const updateFeedbackCourse = async (
  data: UpdateCourseFeedbackParams
): Promise<ApiResponse> => {
  const { courseId, ...payload } = data;

  return apiRequest({
    url: `${API_ROUTES.ADMIN}/course/feedback/${courseId}`,
    method: "PATCH",
    data: payload,
  });
};

export const getInstructorsSpecialtyManagement = async (): Promise<
  ApiResponse<AdminInstructorSpecialtyProfile[]>
> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/instructors/specialties`,
    method: "GET",
  });
};

export const updateInstructorSpecialties = async (
  instructorProfileId: string,
  specialties: ISpecialty[],
): Promise<ApiResponse<AdminInstructorSpecialtyProfile>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/instructors/${instructorProfileId}/specialties`,
    method: "PATCH",
    data: { specialties },
  });
};

export const resolveInstructorSpecialtyRequest = async (
  requestId: string,
  data: {
    status: "APPROVED" | "REJECTED";
    approvedSpecialties?: ISpecialty[];
    reviewerNotes?: string;
    reviewedBy?: string;
  },
): Promise<ApiResponse<AdminInstructorSpecialtyRequest>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/instructor-specialty-requests/${requestId}/resolve`,
    method: "PATCH",
    data,
  });
};
