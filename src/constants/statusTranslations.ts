import { InstructorApplication } from "@/types/instructor.types";

export const translateStatus = {
  DRAFT: "Borrador",
  SUBMITTED: "Enviado",
  UNDER_REVIEW: "En revisión",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
} as const;

export const translateInstructorStatus = {
  NOT_APPLIED: "No aplicado",
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  SUSPENDED: "Suspendido",
} as const;

export const translateRole = {
  USER: "Usuario",
  INSTRUCTOR: "Instructor",
  ADMIN: "Administrador",
} as const;

export const statusColors: Record<InstructorApplication["status"], string> = {
  DRAFT: "bg-yellow-500",
  SUBMITTED: "bg-blue-500",
  UNDER_REVIEW: "bg-indigo-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export const statusLabels: Record<InstructorApplication["status"], string> =
  translateStatus;

const dict = {
  role: translateRole,
  instructor: translateInstructorStatus,
  application: translateStatus,
};

type Dict = typeof dict;
type Category = keyof Dict;
type KeyOf<C extends Category> = keyof Dict[C];

export function t<C extends Category>(category: C, key: KeyOf<C>): string {
  return dict[category][key] as string;
}
