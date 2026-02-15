import { ICourse } from "@/types/course.types";

export const sectionBackgrounds = [
  "bg-primary/20",
  "bg-secondary/20",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-purple-100",
];

export const LessonTypeLabels = {
  videoFile: "Video",
  content: "Contenido escrito",
} as const;

export const CourseLevelLabels = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
} as const;

export const levels = Object.keys(CourseLevelLabels)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: CourseLevelLabels[key as keyof typeof CourseLevelLabels],
  }));

export const SpecialtyLabels = {
  CPR: "Reanimación cardiopulmonar (RCP)",
  DEA: "Uso de desfibrilador (DEA)",
  FIRST_AID: "Primeros Auxilios",
  PSYCHOLOGICAL_FIRST_AID: "Primeros Auxilios Psicológicos",
  CHILD_CARE: "Atención de niños",
  ELDERLY_CARE: "Atención de adultos mayores",
  FIRST_AID_PETS: "Primeros Auxilios para mascotas",
  TRAUMA: "Trauma",
  HEMORRHAGE: "Control de hemorragias",
  FRACTURES: "Fracturas",
  SPINAL_INJURY: "Lesiones de columna",
  BURNS: "Quemaduras",
  ENVIRONMENTAL_EMERGENCIES: "Emergencias ambientales",
  TOXICOLOGY: "Toxicología",
  OBSTETRICS: "Emergencias obstétricas",
  NEONATAL: "Reanimación neonatal",
  PEDIATRICS: "Emergencias pediátricas",
  CARDIAC_ARREST_ADVANCED: "Paro cardíaco avanzado (ACLS)",
  TRAUMA_LIFE_SUPPORT: "Soporte vital en trauma",
  AIRWAY: "Manejo de vía aérea",
  SHOCK: "Shock",
  BURNS_ADVANCED: "Quemaduras avanzadas",
  DISASTER_RESPONSE: "Respuesta a desastres",
  INFECTIOUS_DISEASE: "Enfermedades infecciosas",
  PALS: "Soporte vital pediátrico (PALS)",
  ACLS: "Soporte vital avanzado (ACLS)",
  BLS: "Soporte vital básico (BLS)",
  HEIMLICH: "Maniobra de Heimlich",
  WILDERNESS_MEDICINE: "Medicina en zonas remotas",
  RESCUE_ACUATIC: "Rescate acuático",
  HAZMAT: "Materiales peligrosos (HAZMAT)",
  ELECTROCUTION: "Electrocución",
  TRANSPORTATION_EVACUATION: "Transporte y evacuación",
} as const;

export const specialties = Object.keys(SpecialtyLabels)
  .filter((key) => isNaN(Number(key)))
  .map((key, index) => ({
    id: index + 1,
    value: key,
    label: SpecialtyLabels[key as keyof typeof SpecialtyLabels],
  }));

export const translateStatusCourse = {
  DRAFT: "Borrador",
  SUBMITTED: "En cola de revisión",
  UNDER_REVIEW: "En revisión",
  PUBLISHED: "Publicado",
  REJECTED: "Rechazado",
  NEEDS_CORRECTION: "Requiere correcciones",
  ARCHIVED: "Archivado",
} as const;

export const courseStatusDescription = {
  DRAFT: "El curso todavía no fue enviado a revisión.",
  SUBMITTED: "El curso fue enviado y está esperando ser revisado.",
  UNDER_REVIEW: "Un administrador está revisando el curso.",
  PUBLISHED: "El curso está publicado y disponible para los alumnos.",
  REJECTED: "El curso fue rechazado y no se publicará.",
  NEEDS_CORRECTION:
    "El curso necesita correcciones antes de volver a enviarse.",
  ARCHIVED: "El curso fue archivado y ya no está disponible.",
} as const;

export const statusColorsCourse: Record<ICourse["status"], string> = {
  DRAFT: "bg-yellow-500",
  SUBMITTED: "bg-blue-500",
  UNDER_REVIEW: "bg-indigo-500",
  PUBLISHED: "bg-green-500",
  NEEDS_CORRECTION: "bg-yellow-500",
  REJECTED: "bg-red-500",
  ARCHIVED: "bg-gray-500",
};

export const statusLabelsCourse: Record<ICourse["status"], string> =
  translateStatusCourse;

export const COURSES_CARD_DEFAULTS = {
  page: 1,
  limit: 12,
  MAX_LIMIT: 20,
} as const;
