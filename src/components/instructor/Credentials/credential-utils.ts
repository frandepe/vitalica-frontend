import type {
  InstructorCertification,
  InstructorCredential,
  InstructorCredentialForm,
  InstructorCredentialType,
} from "@/types/instructor.types";

export const emptyCredential = (
  type: InstructorCredentialType,
): InstructorCredentialForm => ({
  type,
  title: "",
  organization: "",
  credentialNumber: "",
  jurisdiction: "",
  issuedAt: null,
  expiresAt: null,
  noExpiration: false,
  roleOrArea: "",
  startDate: null,
  endDate: null,
  currentlyActive: false,
  description: "",
  images: [],
});

export const credentialRequiresImage = (type: InstructorCredentialType) =>
  type === "PROFESSIONAL_DEGREE" ||
  type === "PROFESSIONAL_LICENSE" ||
  type === "INSTRUCTOR_CERTIFICATION";

export const isExperienceCredential = (type: InstructorCredentialType) =>
  type === "PROFESSIONAL_EXPERIENCE" || type === "TEACHING_EXPERIENCE";

export const isDateCredential = (type: InstructorCredentialType) =>
  type === "PROFESSIONAL_LICENSE" ||
  type === "INSTRUCTOR_CERTIFICATION" ||
  type === "COMPLEMENTARY_TRAINING";

export const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const mapCredentialToForm = (
  credential: InstructorCredential,
): InstructorCredentialForm => ({
  id: credential.id,
  type: credential.type,
  title: credential.title || "",
  organization: credential.organization || "",
  credentialNumber: credential.credentialNumber || "",
  jurisdiction: credential.jurisdiction || "",
  issuedAt: credential.issuedAt
    ? new Date(credential.issuedAt).toISOString()
    : null,
  expiresAt: credential.expiresAt
    ? new Date(credential.expiresAt).toISOString()
    : null,
  noExpiration: !credential.expiresAt,
  roleOrArea: credential.roleOrArea || "",
  startDate: credential.startDate
    ? new Date(credential.startDate).toISOString()
    : null,
  endDate: credential.endDate ? new Date(credential.endDate).toISOString() : null,
  currentlyActive: credential.currentlyActive,
  description: credential.description || "",
  images: [],
});

export const mapCertificationToCredentialForm = (
  certification: InstructorCertification,
): InstructorCredentialForm => ({
  ...emptyCredential("INSTRUCTOR_CERTIFICATION"),
  id: certification.id,
  title: certification.certificationType || "",
  organization: certification.issuer || "",
  credentialNumber: certification.credentialNumber || "",
  issuedAt: certification.issuedAt
    ? new Date(certification.issuedAt).toISOString()
    : null,
  expiresAt: certification.expiresAt
    ? new Date(certification.expiresAt).toISOString()
    : null,
  noExpiration: !certification.expiresAt,
});
