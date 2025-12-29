import { InstructorApplication } from "@/types/instructor.types";

export const paymentMethods = {
  PAYPAL: "PAYPAL",
  MERCADO_PAGO: "MERCADO_PAGO",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

// -------------------------------
// Traducciones a español
// -------------------------------

export const LevelLabels = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
} as const;

export const descriptionCourseLimit = 5000;
export const requirementsAndMaterialsCourseLimit = 2000;

export const translateInstructorStatus = {
  NOT_APPLIED: "No aplicado",
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  SUSPENDED: "Suspendido",
} as const;

export const translateInstructorApplicationStatus = {
  DRAFT: "Borrador",
  SUBMITTED: "Enviado a revisión",
  UNDER_REVIEW: "En revisión",
  APPROVED: "Aprovado",
  REJECTED: "Rechazado",
} as const;

export const statusColorsInstructorApplication: Record<
  InstructorApplication["status"],
  string
> = {
  DRAFT: "bg-yellow-500",
  SUBMITTED: "bg-blue-500",
  UNDER_REVIEW: "bg-indigo-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export const statusLabels: Record<InstructorApplication["status"], string> =
  translateInstructorApplicationStatus;
