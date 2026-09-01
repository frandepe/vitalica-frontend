import { ISpecialty } from "./course.types";
import type { InstructorCredentialType } from "./instructor.types";

export interface PublicInstructorListItem {
  userId: string;
  slug: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  headline: string | null;
  specialties: ISpecialty[];
  city: string | null;
  state: string | null;
  approvedAt: string | null;
  isFoundingInstructor: boolean;
  stats: {
    uniqueStudents: number;
    publishedCourses: number;
    theory: PublicInstructorReputationStats;
    practice: PublicInstructorReputationStats;
  };
  credentialTypes: InstructorCredentialType[];
}

export interface PublicInstructorReputationStats {
  averageRating: number | null;
  reviewCount: number;
}

export interface PublicInstructorListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPublicInstructorsParams {
  page: number;
  limit: number;
  search?: string;
  specialty?: ISpecialty | "ALL";
}
