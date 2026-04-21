import { StatusInstructorApplication } from "@/types/instructor.types";
import { apiRequest } from "./configEndpoint";
import { API_ROUTES } from "@/constants";
import { ApiResponse } from "@/types/endpoints.types";
import { ISpecialty } from "@/types/course.types";
import {
  AdminCommerceAttentionItem,
  AdminCommerceOrderDiagnostic,
  AdminCommerceOrdersResponse,
  AdminCommerceRepairResult,
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
  foundingInstructor?: boolean;
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

export const getCommercialOrdersAdmin = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  attentionOnly?: boolean;
}): Promise<ApiResponse<AdminCommerceOrdersResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/commerce/orders`,
    method: "GET",
    params,
  });
};

export const getCommercialOrderDiagnosticAdmin = async (
  orderId: string,
): Promise<ApiResponse<AdminCommerceOrderDiagnostic>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/commerce/order/${orderId}`,
    method: "GET",
  });
};

export const repairCommercialOrderAccessAdmin = async (
  orderId: string,
): Promise<ApiResponse<AdminCommerceRepairResult>> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/commerce/order/${orderId}/repair-access`,
    method: "POST",
  });
};

export const getCommercialOrdersRequiringAttentionAdmin = async (): Promise<
  ApiResponse<AdminCommerceAttentionItem[]>
> => {
  return apiRequest({
    url: `${API_ROUTES.ADMIN}/commerce/orders/requiring-attention`,
    method: "GET",
  });
};
