import {
  CourseLevelLabels,
  courseStatusDescription,
  SellabilityExistingOrderAccessStatusLabels,
  SellabilityExistingOrderStatusLabels,
  SellabilityOrderResolutionLabels,
  InstructorCredentialTypeLabels,
  SpecialtyLabels,
  StatusPracticeRequestLabels,
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
  credentialType: InstructorCredentialTypeLabels,
  courseLevel: CourseLevelLabels,
  statusPracticeRequest: StatusPracticeRequestLabels,
  practiceContactMethod: {
    DIRECT_CONTACT: "Contacto directo con el instructor",
    REQUEST_CONTACT: "El instructor contacta al alumno",
  },
  sellabilityExistinOrderStatus: SellabilityExistingOrderStatusLabels,
  sellabilityExistinOrderAccessStatus:
    SellabilityExistingOrderAccessStatusLabels,
  sellabilityOrderResolution: SellabilityOrderResolutionLabels,
};

type Dict = typeof dict;
type Category = keyof Dict;
type KeyOf<C extends Category> = keyof Dict[C];

export function t<C extends Category>(category: C, key: KeyOf<C>): string {
  return dict[category][key] as string;
}
