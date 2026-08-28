import { API_ROUTES } from "@/constants";
import {
  BetaFeedbackPayload,
  BetaFeedbackResponse,
} from "@/types/beta-feedback.types";
import { apiRequest } from "./configEndpoint";

export const sendBetaFeedback = async (
  data: BetaFeedbackPayload,
): Promise<BetaFeedbackResponse> => {
  return apiRequest({
    url: API_ROUTES.BETA_FEEDBACK,
    method: "POST",
    data,
  });
};
