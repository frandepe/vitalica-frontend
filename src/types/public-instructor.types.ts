import { ISpecialty } from "./course.types";

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
  totalCourses: number;
  totalStudents: number;
  avgTheoreticalRating: number;
  ratingCount: number;
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
