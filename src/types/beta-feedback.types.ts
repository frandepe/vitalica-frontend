import { ApiResponse } from "./endpoints.types";

export type BetaFeedbackType = "ERROR" | "CONFUSION" | "SUGGESTION" | "OTHER";

export interface BetaFeedbackPayload {
  type: BetaFeedbackType;
  message: string;
  originPath?: string;
  images: string[];
}

export type BetaFeedbackResponse = ApiResponse<{
  id: string;
  createdAt: string;
}>;
