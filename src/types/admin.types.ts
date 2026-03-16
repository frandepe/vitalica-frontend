import { CourseStatus } from "./course.types";
import { ISpecialty } from "./course.types";
import { InstructorSpecialtyRequestStatus } from "./instructor.types";

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  status: CourseStatus;
  price: number;
  totalStudents: number;
  createdAt: string;
  parentCourseId: string;
  instructor: {
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface GetAllCoursesAdminParams {
  page?: number;
  limit?: number;
  status?: CourseStatus;
}

export interface GetAllCoursesAdminResponse {
  courses: {
    id: string;
    title: string;
    slug: string;
    status: CourseStatus;
    price: number;
    totalStudents: number;
    createdAt: string;
    parentCourseId: string;
    instructor: {
      userId: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeedbackFormValues {
  status: CourseStatus;
  reviewerNotes: string;
  revewedBy: string;
}

export interface UpdateCourseFeedbackParams {
  courseId: string;
  status: CourseStatus;
  reviewerNotes: string;
  revewedBy: string;
}

export interface AdminInstructorSpecialtyRequest {
  id: string;
  instructorProfileId: string;
  status: InstructorSpecialtyRequestStatus;
  requestedSpecialties: ISpecialty[];
  certificateUrls: string[];
  certificateUrlIds: string[];
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewerNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInstructorSpecialtyProfile {
  id: string;
  userId: string;
  specialties: ISpecialty[];
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  specialtyRequests: AdminInstructorSpecialtyRequest[];
}

export interface AdminCommerceOrderListItem {
  orderId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  buyerEmail: string;
  orderStatus: string;
  accessStatus: string;
  grossAmount: string;
  currency: string;
  latestPaymentId: string | null;
  latestPaymentStatus: string | null;
  latestWebhookStatus: string | null;
  hasRevenueAllocation: boolean;
  hasEnrollment: boolean;
  attentionReasons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminCommerceOrdersResponse {
  orders: AdminCommerceOrderListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminCommercePayment {
  id: string;
  provider: string;
  status: string;
  amount: string;
  currency: string;
  externalPaymentId: string | null;
  externalPreferenceId: string | null;
  externalMerchantOrderId: string | null;
  externalReference: string | null;
  providerStatus: string | null;
  providerStatusDetail: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  lastStatusAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCommerceWebhookEvent {
  id: string;
  provider: string;
  providerEventId: string;
  providerTopic: string;
  status: string;
  failureReason: string | null;
  receivedAt: string;
  processingStartedAt: string | null;
  processedAt: string | null;
  failedAt: string | null;
  payload: unknown;
}

export interface AdminCommerceRevenueAllocation {
  id: string;
  orderId: string;
  paymentId: string;
  status: string;
  currency: string;
  grossAmount: string;
  platformPercent: string;
  instructorPercent: string;
  platformAmount: string;
  instructorAmount: string;
  commissionRuleVersion: string;
  mpCollectorIdSnapshot: string;
  createdAt: string;
}

export interface AdminCommerceEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
}

export interface AdminCommerceOrderDiagnostic {
  order: {
    id: string;
    userId: string;
    courseId: string;
    status: string;
    accessStatus: string;
    courseTitleSnapshot: string;
    grossAmountSnapshot: string;
    currencySnapshot: string;
    platformAmount: string;
    instructorAmount: string;
    platformPercent: string;
    instructorPercent: string;
    commissionRuleVersion: string;
    mpCollectorIdSnapshot: string;
    paidAt: string | null;
    accessGrantedAt: string | null;
    lastPaymentAttemptAt: string | null;
    expiresAt: string | null;
    buyer: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
    course: {
      id: string;
      title: string | null;
      slug: string;
      price: string | number | null;
      currency: string | null;
      deletedAt: string | null;
      status: string;
    };
  };
  payments: AdminCommercePayment[];
  webhookEvents: AdminCommerceWebhookEvent[];
  revenueAllocation: AdminCommerceRevenueAllocation | null;
  enrollment: AdminCommerceEnrollment | null;
  attentionReasons: string[];
}

export interface AdminCommerceRepairResult {
  orderId: string;
  paymentId: string | null;
  enrollmentId: string | null;
  accessStatus: string;
  orderStatus: string;
  revenueAllocationStatus: string | null;
  repairAction: "REPAIRED" | "ALREADY_GRANTED" | "NOOP";
}

export interface AdminCommerceAttentionItem {
  orderId: string;
  userId: string;
  courseId: string;
  orderStatus: string;
  accessStatus: string;
  latestPaymentId: string | null;
  latestPaymentStatus: string | null;
  attentionReasons: string[];
  lastPaymentAttemptAt: string | null;
  latestWebhookFailedAt: string | null;
}
