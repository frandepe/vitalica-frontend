import { type ReactNode } from "react";
import { CourseExperienceAdapter } from "@/types/courseExperience.types";
import { studentExperienceAdapter } from "./studentExperience.adapter";
import { CourseExperienceContext } from "./courseExperience.context";

export function CourseExperienceProvider({
  adapter = studentExperienceAdapter,
  children,
}: {
  adapter?: CourseExperienceAdapter;
  children: ReactNode;
}) {
  return (
    <CourseExperienceContext.Provider value={adapter}>
      {children}
    </CourseExperienceContext.Provider>
  );
}
