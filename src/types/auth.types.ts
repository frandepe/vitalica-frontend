// Roles posibles
export type Role = "USER" | "INSTRUCTOR" | "ADMIN";

// Estado del instructor
export type InstructorStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

// Respuesta del usuario para frontend / autenticación
export interface User {
  id: string;
  email: string;
  password?: string; // opcional, porque no siempre lo vas a exponer
  role: Role;

  firstName?: string | null;
  lastName?: string | null;
  slug: string;

  avatarUrl?: string | null;
  avatarUrlId?: string | null;

  phoneCountryCode?: string | null;
  phoneNumber?: string | null;

  emailVerifiedAt?: Date | null;
  phoneVerifiedAt?: Date | null;

  language?: string | null;
  timezone?: string | null;

  emailNotifications: boolean;
  pushNotifications: boolean;

  application?: InstructorApplication | null;

  isActive: boolean;
  lastLoginAt?: Date | null;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const EMPTY_USER: User = {
  id: "",
  email: "",
  role: "USER",
  slug: "",
  password: undefined,
  firstName: null,
  lastName: null,
  avatarUrl: null,
  avatarUrlId: null,
  phoneCountryCode: null,
  phoneNumber: null,
  emailVerifiedAt: null,
  phoneVerifiedAt: null,
  language: null,
  timezone: null,
  emailNotifications: false,
  pushNotifications: false,
  isActive: false,
  lastLoginAt: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Instructor profile
export interface InstructorProfile {
  id: string;
  userId: string;
  status: InstructorStatus;
  headline?: string | null;
  bio?: string | null;
  specialties: string[]; // podría mapear a enum Specialty si querés
  avgRating: number;
  ratingCount: number;
  totalStudents: number;
  totalCourses: number;

  payoutMethod?: "PAYPAL" | "MERCADO_PAGO" | "BANK_TRANSFER";
  payoutAccountId?: string | null;
  payoutEmail?: string | null;
  currency?: string;

  country?: string;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;

  approvedAt?: Date | null;
  suspendedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Instructor application
export interface InstructorApplication {
  id: string;
  userId: string;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  dniNumber?: string | null;
  dniCountry?: string | null;
  certificateType?: string | null;
  issuedBy?: string | null;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  submittedAt?: Date | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  reviewerNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Course review
export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // acceptPrivacy: boolean;
}

export interface DataValidationEmail {
  email: string;
  firstName: string;
}

export interface EmailVerification {
  id: string;
  token: string;
  expires?: string; // normalmente viene como ISO string desde la API
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}
