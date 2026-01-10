import { CourseStatus } from "./course.types";

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
