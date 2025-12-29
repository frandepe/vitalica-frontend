import {
  CourseLevelLabels,
  courseStatusDescription,
  SpecialtyLabels,
  translateInstructorApplicationStatus,
  translateInstructorStatus,
  translateRole,
  translateStatusCourse,
} from "@/constants";

const dict = {
  role: translateRole,
  instructor: translateInstructorStatus,
  application: translateInstructorApplicationStatus,
  statusCourse: translateStatusCourse,
  courseStatusDescription: courseStatusDescription,
  courseSpecialty: SpecialtyLabels,
  courseLevel: CourseLevelLabels,
};

type Dict = typeof dict;
type Category = keyof Dict;
type KeyOf<C extends Category> = keyof Dict[C];

export function t<C extends Category>(category: C, key: KeyOf<C>): string {
  return dict[category][key] as string;
}
