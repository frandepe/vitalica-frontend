import type { QuizStatus } from "./course.types";

export type QuizAnswerMap = Record<string, number>;

export interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  options: string[];
  correctAnswer?: number;
  courseId?: string;
  moduleId?: string | null;
  status?: QuizStatus;
  reviewerNotes?: string | null;
  reviewedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleQuiz extends QuizQuestion {
  courseId: string;
  moduleId: string;
  correctAnswer: number;
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
}

export type FinalQuizQuestion = QuizQuestion;
export interface InstructorFinalQuiz extends QuizQuestion {
  correctAnswer: number;
}
