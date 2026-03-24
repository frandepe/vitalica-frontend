import { SpecialtyLabels } from "@/constants";

export type ISpecialty = keyof typeof SpecialtyLabels;

export interface ICourse {
  id: string;
  instructorId: string;

  title?: string;
  slug: string;
  description?: string;
  tags?: string[];

  specialty?: ISpecialty | null;
  level?: CourseLevel;
  duration?: number; // en minutos
  price?: number;
  currency?: "ARS";

  // Multimedia
  thumbnailUrl?: string;
  thumbnailUrlId?: string;
  promoVideoUrl?: string;
  muxPlaybackId?: string;
  muxPromoAssetId?: string;

  // Stats
  avgTheoreticalRating: number;
  ratingCount: number;
  totalStudents: number;
  versions?: IStatusVersion[];
  // Estados
  status: CourseStatus;
  reviewerNotes?: string;
  revewedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  requirementsAndMaterials?: string;

  // Instructor
  instructor?: {
    id: string;
    bio: string;
    headline: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
      slug: string;
    };
  };

  // Relaciones
  // reviews?: CourseReview[];
  modules?: CourseModule[];
  quizzes?: CourseQuiz[];
}

export interface IStatusVersion {
  id: string;
  status: CourseStatus;
  revewedBy: string | null;
  reviewerNotes: string | null;
}

export interface CourseModuleFormValues {
  id: string;
  title: string;
  formId?: string;
  description?: string;
  order: number; // posición
  lessons?: LessonFormValues[];
  quizzes?: QuizzesFormValues[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  course?: ICourse;

  title: string;
  description?: string;
  slug: string;
  order: number;

  lessons?: Lesson[];
  quizzes?: CourseQuiz[];

  createdAt: string;
  updatedAt: string;
}

export interface LessonMaterial {
  id: string;
  lessonId: string;
  type: LessonMaterialType;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  module?: CourseModule;

  title: string;
  slug: string;
  content?: string;
  muxAssetId?: string;
  muxPlaybackId?: string;
  order: number;
  isFree: boolean;
  type: "videoFile" | "content";
  deletedAt?: string;
  lessonMaterial?: LessonMaterial[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  course?: ICourse;

  moduleId?: string;
  module?: CourseModule;

  question: string;
  options: string[];
  correctAnswer: number;
  order: number;

  status: QuizStatus;
  reviewerNotes?: string;
  reviewedBy?: string;

  createdAt: string;
  updatedAt: string;
}

// --------- Enums ---------

export type CourseLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type CourseStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "NEEDS_CORRECTION"
  | "REJECTED"
  | "ARCHIVED";
export type QuizStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LessonMaterialType =
  | "PDF"
  | "JPG"
  | "JPEG"
  | "PNG"
  | "DOCX"
  | "XLSX"
  | "PPTX"
  | "ZIP";
export type LessonType = "content" | "videoFile";

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface LessonFormValues {
  id: string;
  title?: string;
  type?: LessonType | null;
  content?: string;
  order: number;
  isFree: boolean;
  muxAssetId?: string;
  muxPlaybackId?: string | null | undefined;
  lessonMaterial?: LessonMaterial[];
}

export interface QuizzesFormValues {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  status: QuizStatus;
}

export interface CourseQuizFormValues {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface NewCourseFormValues {
  title: string;
  description: string;
  tags: string[];
  specialty: ISpecialty | null;
  thumbnailUrl?: string;
  level: CourseLevel | null;
  // duration?: number;
  durationHours: number;
  durationMinutes: number;
  price: number;
  currency?: "ARS";
  requirementsAndMaterials?: string;
  muxPromoAssetId?: string;
  muxPlaybackId?: string;
  modules?: CourseModuleFormValues[]; // opcional
  quizzes?: CourseQuizFormValues[]; // opcional
}

export type SaveCourseDraftPayload = Omit<
  NewCourseFormValues,
  "durationHours" | "durationMinutes"
> & {
  duration: number;
};

export interface ICreateCourse {
  title: string;
  description: string;
  tags: string[];
  specialty: ISpecialty;
  level: CourseLevel;
}

export type LessonUploadState = {
  progress: number;
  status: string;
};

export interface CoursePreview {
  title: string | null;
  description: string | null;
  tags: string[];
  level: CourseLevel | null;
  specialty: ISpecialty | null;
  duration: number | null;
  price: number | null;
  currency: string | null;
  thumbnailUrl: string | null;
  requirementsAndMaterials: string | null;
  finalQuizzesCount: number;
  status: CourseStatus;
  modules: {
    id: string;
    title: string | null;
    description: string | null;
    order: number;
    quizzesCount: number;
    lessons: {
      id: string;
      title: string | null;
      type: string | null;
      isFree: boolean;
      hasVideo: boolean;
      lessonMaterial: boolean;
    }[];
  }[];
}

export interface CoursePublishValidation {
  isValid: boolean;
  minimumFinalQuizQuestions: number;
  finalQuizQuestionsCount: number;
  errors: string[];
}
