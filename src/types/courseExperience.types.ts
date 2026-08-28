import { ICourseProgressResponse } from "./courseProgress.types";
import type { QuizAnswerMap } from "./quiz.types";

export type CourseExperienceMode = "student" | "preview";

export interface CourseExperienceAdapter {
  mode: CourseExperienceMode;
  basePath: string;
  loadCourse: (slug: string) => Promise<ICourseProgressResponse>;
  completeLesson: (lessonId: string) => Promise<unknown>;
  evaluateFinalExam?: (slug: string, answers: QuizAnswerMap) => Promise<unknown>;
  reloadCourse?: (slug: string) => Promise<ICourseProgressResponse>;
}
