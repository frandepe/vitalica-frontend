import type { InstructorCredentialType } from "@/types/instructor.types";

export type CredentialOption = {
  type: InstructorCredentialType;
  label: string;
  description: string;
  iconSrc: string;
};

export const credentialOptions: CredentialOption[] = [
  {
    type: "PROFESSIONAL_DEGREE",
    label: "Título profesional",
    description: "Médico, enfermero, técnico, guardavidas...",
    iconSrc: "/Icons/titulo-profesional.png",
  },
  {
    type: "PROFESSIONAL_LICENSE",
    label: "Matrícula profesional",
    description: "Matrícula o habilitación vigente.",
    iconSrc: "/Icons/matricula-profesional.png",
  },
  {
    type: "INSTRUCTOR_CERTIFICATION",
    label: "Certificación como instructor",
    description: "RCP, primeros auxilios, DEA...",
    iconSrc: "/Icons/certificacion-como-instructor.png",
  },
  {
    type: "COMPLEMENTARY_TRAINING",
    label: "Formación complementaria",
    description: "Cursos y formaciones relacionadas.",
    iconSrc: "/Icons/formacion-complementaria.png",
  },
  {
    type: "PROFESSIONAL_EXPERIENCE",
    label: "Experiencia profesional",
    description: "Hospitales, ambulancias, emergencias, rescate...",
    iconSrc: "/Icons/experiencia-profesional.png",
  },
  {
    type: "TEACHING_EXPERIENCE",
    label: "Experiencia docente",
    description: "Capacitaciones o docencia previa.",
    iconSrc: "/Icons/experiencia-docente.png",
  },
];

export const getCredentialOption = (type: InstructorCredentialType) =>
  credentialOptions.find((option) => option.type === type) ||
  credentialOptions[0];
