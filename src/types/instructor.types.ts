import { InstructorStatus, User } from "./auth.types";
import { ISpecialty } from "./course.types";

export interface IApplyInstructor {
  dniNumber: string;
  dniCountry: string;
  credentials: InstructorCredentialForm[];
  requestedSpecialties?: ISpecialty[];
  urlDni: string | null;
}

export type InstructorCredentialType =
  | "PROFESSIONAL_DEGREE"
  | "PROFESSIONAL_LICENSE"
  | "INSTRUCTOR_CERTIFICATION"
  | "COMPLEMENTARY_TRAINING"
  | "PROFESSIONAL_EXPERIENCE"
  | "TEACHING_EXPERIENCE";

export type InstructorCredentialStatus = "PENDING" | "APPROVED";

export interface InstructorCredentialForm {
  id?: string;
  type: InstructorCredentialType;
  title: string;
  organization: string;
  credentialNumber: string;
  jurisdiction: string;
  issuedAt: string | null;
  expiresAt: string | null;
  noExpiration: boolean;
  roleOrArea: string;
  startDate: string | null;
  endDate: string | null;
  currentlyActive: boolean;
  description: string;
  images: string[];
}

export interface InstructorCertificationForm {
  id?: string;
  certificationType: string;
  issuer: string;
  credentialNumber: string;
  issuedAt: string;
  expiresAt: string | null;
  noExpiration: boolean;
  images: string[];
}

export interface IApplyInstructorPayload {
  dniNumber: string;
  dniCountry: string;
  credentials: InstructorCredentialPayload[];
  requestedSpecialties?: ISpecialty[];
  urlDni: string | null;
}

export interface InstructorCredentialPayload {
  id?: string;
  type: InstructorCredentialType;
  title?: string | null;
  organization?: string | null;
  credentialNumber?: string | null;
  jurisdiction?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
  roleOrArea?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currentlyActive?: boolean;
  description?: string | null;
  images: string[];
}

export interface InstructorCertificationPayload {
  id?: string;
  certificationType: string;
  issuer: string;
  credentialNumber: string;
  issuedAt: string;
  expiresAt: string | null;
  images: string[];
}

export type StatusInstructorApplication =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface InstructorApplication {
  id: string;
  userId: string;
  status: StatusInstructorApplication;
  dniNumber: string;
  dniCountry: string;
  certificateType: string;
  enrollmentNumber: string;
  issuedBy: string;
  requestedSpecialties: ISpecialty[];
  issueDate: string; // ISO date string (ej: "2025-10-29T03:00:00.000Z")
  expiryDate: string; // ISO date string
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  documents: ApplicationDocument[];
  certifications: InstructorCertification[];
  credentials: InstructorCredential[];
  specialtyRequests: InstructorSpecialtyRequest[];
  user: User;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  urlDni: string;
  createdAt: string;
  updatedAt: string;
  urlCertificateId: string[];
  urlDniID: string;
  urlCertificate: string[];
}

export interface InstructorCertification {
  id: string;
  applicationId: string;
  certificationType: string;
  issuer: string;
  credentialNumber: string | null;
  issuedAt: string;
  expiresAt: string | null;
  imageUrls: string[];
  imageUrlIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstructorCredential {
  id: string;
  applicationId: string;
  type: InstructorCredentialType;
  status: InstructorCredentialStatus;
  approvedAt: string | null;
  title: string | null;
  organization: string | null;
  credentialNumber: string | null;
  jurisdiction: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  roleOrArea: string | null;
  startDate: string | null;
  endDate: string | null;
  currentlyActive: boolean;
  description: string | null;
  imageUrls: string[];
  imageUrlIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type InstructorSpecialtyRequestStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface InstructorSpecialtyRequest {
  id: string;
  instructorProfileId: string;
  status: InstructorSpecialtyRequestStatus;
  requestedSpecialties: ISpecialty[];
  credentialId: string | null;
  credential: InstructorCredential | null;
  credentialType: InstructorCredentialType | null;
  credentialTitle: string | null;
  credentialOrg: string | null;
  credentialNumber: string | null;
  credentialJurisdiction: string | null;
  credentialIssuedAt: string | null;
  credentialExpiresAt: string | null;
  credentialRoleOrArea: string | null;
  credentialStartDate: string | null;
  credentialEndDate: string | null;
  credentialCurrentlyActive: boolean;
  credentialDescription: string | null;
  certificateUrls: string[];
  certificateUrlIds: string[];
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewerNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum PayoutMethod {
  MERCADO_PAGO = "MERCADO_PAGO",
}

export enum PracticeContactMethod {
  DIRECT_CONTACT = "DIRECT_CONTACT",
  REQUEST_CONTACT = "REQUEST_CONTACT",
}

export interface InstructorProfile {
  id: string;
  userId: string;
  status: InstructorStatus;

  headline?: string;
  bio?: string;

  specialties: ISpecialty[];

  avgTheoreticalRating: number;
  ratingCount: number;
  totalStudents: number;
  totalCourses: number;

  payoutMethod?: PayoutMethod;

  mpCollectorId?: string;
  mpConnectedAt?: Date;

  currency?: string;
  country?: string;

  approvedAt?: Date;
  foundingInstructor?: Date | null;
  suspendedAt?: Date;

  city?: string;
  state?: string;
  zipCode?: string;
  isPublicForPractice?: boolean;
  practiceContactMethod?: PracticeContactMethod;
  practiceWhatsapp?: string;
  practiceEmail?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  practiceNotes?: string;

  reviewerNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorDashboardCounts {
  courses: number;
  reviews: number;
  practices: number;
}
