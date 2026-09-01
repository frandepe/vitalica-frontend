export type InstructorSupportReason =
  | "PROBLEM"
  | "QUESTION"
  | "SUGGESTION"
  | "OTHER";

export type InstructorSupportStatus = "PENDING" | "ANSWERED";

export interface InstructorSupportPayload {
  reason: InstructorSupportReason;
  subject: string;
  message: string;
}

export interface InstructorSupportResponse {
  success: boolean;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: unknown;
  }>;
  data?: {
    id: string;
    createdAt: string;
  };
}

export interface InstructorSupportTicket {
  id: string;
  reason: InstructorSupportReason;
  subject: string;
  message: string;
  status: InstructorSupportStatus;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}
