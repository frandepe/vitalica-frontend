import { useContext } from "react";
import { CourseExperienceContext } from "./courseExperience.context";

export function useCourseExperience() {
  return useContext(CourseExperienceContext);
}
