import {
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";
import type {
  PracticeContactMethod,
  PracticeProgressInfo,
  PracticeRequestStatus,
  PracticeRequestStudentView,
} from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";

export const CONTACT_METHOD_LABELS = {
  DIRECT_CONTACT: "Contacto directo",
  REQUEST_CONTACT: "El instructor te contacta",
} as const satisfies Record<PracticeContactMethod, string>;

export interface PracticeStatusCopy {
  title: string;
  description: string;
  badge: string;
  variant: "success" | "info" | "warning";
  icon: LucideIcon;
}

export function getStatusCopy(practice: PracticeProgressInfo): PracticeStatusCopy {
  if (practice.practiceCompleted) {
    return {
      title: "Practica completada",
      description:
        "Tu practica ya fue registrada y el certificado esta disponible.",
      badge: "Completada",
      variant: "success",
      icon: CheckCircle2,
    };
  }

  if (practice.latestPracticeRequestStatus === "PENDING") {
    return {
      title: "Solicitud en curso",
      description:
        "Tu solicitud ya fue enviada. Desde aca podes seguirla o cancelarla.",
      badge: "Pendiente",
      variant: "info",
      icon: RefreshCcw,
    };
  }

  if (practice.latestPracticeRequestStatus === "CANCELLED") {
    return {
      title: "Solicitud cancelada",
      description: "Podes iniciar una nueva solicitud con otro instructor.",
      badge: "Cancelada",
      variant: "warning",
      icon: AlertCircle,
    };
  }

  if (practice.practiceUnlockedAt) {
    return {
      title: "Practica disponible",
      description: "Ya podes elegir instructor y crear tu solicitud.",
      badge: "Disponible",
      variant: "info",
      icon: CheckCircle2,
    };
  }

  return {
    title: "Practica bloqueada",
    description:
      "La practica se habilita cuando completes la parte teorica requerida.",
    badge: "Bloqueada",
    variant: "warning",
    icon: AlertCircle,
  };
}

export function getRequestStatusVariant(status?: PracticeRequestStatus | null) {
  if (status === "COMPLETED") return "success" as const;
  if (status === "CANCELLED") return "warning" as const;
  return "info" as const;
}

export function getAssignedInstructorDescription(
  contactMethod: PracticeContactMethod,
) {
  return contactMethod === "DIRECT_CONTACT"
    ? "Podes contactar al instructor directamente con los datos disponibles en esta solicitud."
    : "El instructor se pondra en contacto con vos usando los datos que compartiste.";
}

export function getPracticeRequestStateLabel(
  request: PracticeRequestStudentView,
) {
  if (request.completedAt) {
    return `Completada el ${formatDate(request.completedAt, {
      showTime: false,
    })}`;
  }

  if (request.cancelledAt) {
    return `Cancelada el ${formatDate(request.cancelledAt, {
      showTime: false,
    })}`;
  }

  return "Pendiente de coordinacion";
}
