import { ISpecialty } from "./course.types";

export type PracticeRequestStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type PracticeContactMethod = "DIRECT_CONTACT" | "REQUEST_CONTACT";
export type PracticeCancelledBy = "STUDENT" | "INSTRUCTOR" | "SYSTEM";

export interface PracticePublicContact {
  practiceWhatsapp?: string | null;
  practiceEmail?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  practiceNotes?: string | null;
}

export interface PracticeReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student?: {
    name: string;
    avatarUrl: string;
  };
}

export interface PracticeInstructor {
  id: string;
  userId: string;
  profileId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  specialties: ISpecialty[];
  city: string | null;
  state: string | null;
  contactMethod: PracticeContactMethod;
  avgPracticeRating: number;
  practiceRatingCount: number;
  contact?: PracticePublicContact | null;
  publicContact?: PracticePublicContact | null;
}

export interface PracticeRequestStudentView {
  id: string;
  enrollmentId: string;
  status: PracticeRequestStatus;
  contactMethod: PracticeContactMethod;
  requestedAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: PracticeCancelledBy | null;
  studentMessage: string | null;
  studentContact: {
    studentWhatsapp: string | null;
    studentEmail: string | null;
  };
  course: {
    id: string;
    title: string | null;
    slug: string;
  };
  review: PracticeReview | null;
  instructor: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    headline: string | null;
    city: string | null;
    state: string | null;
    contactMethod: PracticeContactMethod | null;
    practiceRatingCount: number;
    publicContact: PracticePublicContact | null;
  };
}

export interface PracticeRequestInstructorView {
  id: string;
  enrollmentId: string;
  status: PracticeRequestStatus;
  contactMethod: PracticeContactMethod;
  requestedAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: PracticeCancelledBy | null;
  studentMessage: string | null;
  studentContact: {
    studentWhatsapp: string | null;
    studentEmail: string | null;
  };
  course: {
    id: string;
    title: string | null;
    slug: string;
  };
  review: PracticeReview | null;
  student: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export interface PracticeCertificate {
  enrollmentId: string;
  practiceRequestId: string;
  practiceCompletedAt: string;
  studentName: string;
  courseName: string | null;
  instructorName: string;
  issuedBy: string | null;
}

export interface PracticeProgressInfo {
  enrollmentId: string;
  requiresPractice: boolean;
  practiceUnlockedAt: string | null;
  practiceCompleted: boolean;
  practiceCompletedAt: string | null;
  latestPracticeRequestId: string | null;
  latestPracticeRequestStatus: PracticeRequestStatus | null;
  hasPendingPracticeRequest: boolean;
  practiceCertificateAvailable: boolean;
}

export interface MyCoursePracticeMeta extends PracticeProgressInfo {
  id: string;
  title: string | null;
  slug: string;
  thumbnailUrl: string | null;
  avgTheoreticalRating: number;
  specialty: ISpecialty;
  muxPlaybackId: string | null;
}

export interface CreatePracticeRequestPayload {
  enrollmentId: string;
  instructorId: string;
  contactMethod: PracticeContactMethod;
  studentWhatsapp?: string;
  studentEmail?: string;
  studentMessage?: string;
}

export interface CreatePracticeReviewPayload {
  rating: number;
  comment?: string;
}
