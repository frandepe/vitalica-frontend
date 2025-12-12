import { Specialty } from "@/constants";
import { InstructorStatus, User } from "./auth.types";
import { Course } from "./course.types";

export interface IApplyInstructor {
  dniNumber: string;
  dniCountry: string;
  certificateType: string;
  issuedBy: string;
  enrollmentNumber: string;
  urlDni: string | null;
  urlCertificate: string[];
  issueDate?: string;
  expiryDate?: string;
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
  issueDate: string; // ISO date string (ej: "2025-10-29T03:00:00.000Z")
  expiryDate: string; // ISO date string
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  documents: ApplicationDocument[];
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

export enum PayoutMethod {
  PAYPAL = "PAYPAL",
  MERCADO_PAGO = "MERCADO_PAGO",
  BANK_TRANSFER = "BANK_TRANSFER",
}
export interface InstructorProfile {
  id: string;
  userId: string;
  status: InstructorStatus;

  headline?: string;
  bio?: string;

  specialties: Specialty[];

  avgRating: number;
  ratingCount: number;
  totalStudents: number;
  totalCourses: number;

  payoutMethod?: PayoutMethod;

  // MÉTODOS DE PAGO
  paypalEmail?: string;

  mpAlias?: string;
  mpCVU?: string;

  bankCBU?: string;
  bankAlias?: string;

  currency?: string;
  country?: string;

  approvedAt?: Date;
  suspendedAt?: Date;

  city?: string;
  state?: string;
  zipCode?: string;

  reviewerNotes?: string;

  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  courses: Course[];
  user: User;
}
