import { InstructorApplication } from "./instructor.types";

// Roles posibles
export type Role = "USER" | "INSTRUCTOR" | "ADMIN";

// Estado del instructor
export type InstructorStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  password?: string;
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
