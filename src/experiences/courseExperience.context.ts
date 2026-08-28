import { createContext } from "react";
import { CourseExperienceAdapter } from "@/types/courseExperience.types";
import { studentExperienceAdapter } from "./studentExperience.adapter";

export const CourseExperienceContext = createContext<CourseExperienceAdapter>(
  studentExperienceAdapter,
);
