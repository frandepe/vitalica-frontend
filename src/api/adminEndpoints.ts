import { StatusInstructorApplication } from "@/types/instructor.types";
import { apiRequest } from "./configEndpoint";

interface PropsGiveInstructorApplicationFeedback {
  status: StatusInstructorApplication;
  reviewedBy: string;
  reviewerNotes: string;
}

export const getInstructorApplications = async () => {
  return apiRequest({
    url: "/api/instructor/applications",
    method: "GET",
  });
};

export const getInstructorApplicationById = async (applicationId: string) => {
  return apiRequest({
    url: `/api/instructor/application/${applicationId}`,
    method: "GET",
  });
};

export const giveInstructorApplicationFeedback = async (
  applicationId: string,
  data: PropsGiveInstructorApplicationFeedback
) => {
  return apiRequest({
    url: `/api/instructor/feedback/${applicationId}`,
    method: "PUT",
    data,
  });
};
