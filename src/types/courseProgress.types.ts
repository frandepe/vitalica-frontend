import { CourseLevel, ISpecialty, LessonMaterial } from "./course.types";

export interface ICourseProgressResponse {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  specialty: ISpecialty;
  level?: CourseLevel;
  thumbnailUrl?: string;
  duration?: number;
  price: number;
  currency: string;
  requirementsAndMaterials?: string;
  avgRating: number;
  totalStudents: number;
  publishedAt: Date;
  modules: ICourseModuleWithProgress[];

  progress: {
    totalLessons: number;
    completedLessons: number;
    percentage: number;
    lastSeenLessonId: string | null;
  };
  instructor: {
    id: string;
    bio?: string;
    headline?: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
      slug: string;
    };
  };
}

export interface ICourseModuleWithProgress {
  id: string;
  title: string;
  order: number;
  lessons: ILessonWithProgress[];
  description?: string;
}

export interface ILessonWithProgress {
  id: string;
  title: string;
  order: number;
  isFree: boolean;
  muxPlaybackId?: string;
  content?: string;
  type?: "content" | "videoFile";
  lessonMaterial?: LessonMaterial[];
  completed: boolean;
}
