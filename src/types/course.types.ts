export interface Course {
  id: string;
  instructorId: string;
  instructor?: InstructorProfile;

  title: string;
  slug: string;
  description: string;
  tags: string[];

  specialty: Specialty;
  level: CourseLevel;
  duration?: number; // en minutos
  price: number;
  currency?: string;

  // Multimedia
  thumbnailUrl?: string;
  thumbnailUrlId?: string;
  promoVideoUrl?: string;

  // Stats
  avgRating: number;
  ratingCount: number;
  totalStudents: number;

  // Estados
  status: CourseStatus;
  reviewerNotes?: string;
  revewedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // Relaciones
  reviews?: CourseReview[];
  modules?: CourseModule[];
  quizzes?: CourseQuiz[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  course?: Course;

  title: string;
  description?: string;
  slug: string;
  order: number;

  lessons?: Lesson[];
  quizzes?: CourseQuiz[];

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

  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  course?: Course;

  moduleId?: string;
  module?: CourseModule;

  question: string;
  options: string[];
  correctAnswer: number;

  status: QuizStatus;
  reviewerNotes?: string;
  reviewedBy?: string;

  createdAt: string;
  updatedAt: string;
}

// --------- Enums ---------

export type Specialty = "PROGRAMMING" | "DESIGN" | "MARKETING" | "OTHERS"; // adaptar según tu backend
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuizStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LessonMaterialType = "PDF" | "IMAGE";
export type LessonType = "content" | "videoFile";

// --------- Extras ---------

export interface InstructorProfile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// __________________ NUEVO CURSO ____________________

export interface LessonMaterial {
  type: LessonMaterialType;
  url: string;
}

export interface LessonFormValues {
  title?: string;
  type?: LessonType;
  content?: string;
  videoFile?: string; // este campo solo existe en front. Al back va a pasar como muxAssetId y muxPlaybackId
  order: number;
  isFree: boolean;
  lessonMaterial?: LessonMaterial[];
}

export interface QuizzesFormValues {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  status: QuizStatus;
}

export interface CourseModuleFormValues {
  id: string;
  title: string;
  description?: string;
  order: number; // posición
  lessons?: LessonFormValues[];
  quizzes?: QuizzesFormValues[];
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
  specialty: Specialty;
  promoVideoFile?: string;
  level: CourseLevel;
  duration?: number;
  price: number;
  currency?: string;
  modules?: CourseModuleFormValues[]; // opcional
  quizzes?: CourseQuizFormValues[]; // opcional
}
