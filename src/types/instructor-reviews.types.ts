export type InstructorReviewType = "ALL" | "THEORETICAL" | "PRACTICAL";

export interface InstructorReviewStudent {
  id: string | null;
  name: string;
  avatarUrl: string;
}

export interface InstructorReviewCourse {
  id: string;
  title: string | null;
  slug: string;
}

export interface InstructorReviewItem {
  id: string;
  type: Exclude<InstructorReviewType, "ALL">;
  rating: number;
  comment: string | null;
  createdAt: string;
  course: InstructorReviewCourse;
  student: InstructorReviewStudent | null;
}

export interface InstructorReviewsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InstructorReviewsSummary {
  total: number;
  theoretical: number;
  practical: number;
}
