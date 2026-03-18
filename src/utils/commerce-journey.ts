import type {
  CommercialOrderAccessStatus,
  CommercialOrderStatus,
  CommercialOrderStatusResponse,
  CoursePurchaseSellabilityResponse,
} from "@/api";

export type StudentCommerceState =
  | "NOT_PURCHASED"
  | "CHECKOUT_INITIATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "PAYMENT_EXPIRED"
  | "ALREADY_PURCHASED"
  | "MANUAL_REVIEW";

export const isPaidAccessState = (
  orderStatus?: CommercialOrderStatus | null,
  accessStatus?: CommercialOrderAccessStatus | null,
) => accessStatus === "GRANTED" || orderStatus === "PAID";

export const isTerminalStudentCommerceState = (state: StudentCommerceState) =>
  state === "PAYMENT_APPROVED" ||
  state === "PAYMENT_REJECTED" ||
  state === "PAYMENT_EXPIRED" ||
  state === "ALREADY_PURCHASED" ||
  state === "MANUAL_REVIEW";

export const resolveStudentCommerceState = (params: {
  sellability: CoursePurchaseSellabilityResponse | null;
  orderStatus: CommercialOrderStatusResponse | null;
}): StudentCommerceState => {
  const { sellability, orderStatus } = params;

  const effectiveAccessStatus =
    orderStatus?.accessStatus ??
    sellability?.existingOrder?.accessStatus ??
    null;
  const effectiveOrderStatus =
    orderStatus?.orderStatus ?? sellability?.existingOrder?.status ?? null;

  if (effectiveAccessStatus === "GRANTED") {
    return "ALREADY_PURCHASED";
  }

  if (effectiveOrderStatus === "PAID") {
    return "PAYMENT_APPROVED";
  }

  if (effectiveOrderStatus === "PAYMENT_PENDING") {
    return "PAYMENT_PENDING";
  }

  if (
    effectiveOrderStatus === "CREATED" ||
    effectiveOrderStatus === "CHECKOUT_PENDING"
  ) {
    return "CHECKOUT_INITIATED";
  }

  if (
    effectiveOrderStatus === "PAYMENT_FAILED" ||
    effectiveOrderStatus === "CANCELLED"
  ) {
    return "PAYMENT_REJECTED";
  }

  if (effectiveOrderStatus === "EXPIRED") {
    return "PAYMENT_EXPIRED";
  }

  if (
    effectiveOrderStatus === "REFUNDED" ||
    effectiveOrderStatus === "DISPUTED"
  ) {
    return "MANUAL_REVIEW";
  }

  if (sellability?.reasonCode === "ALREADY_PURCHASED") {
    return "ALREADY_PURCHASED";
  }

  return "NOT_PURCHASED";
};

export const getStudentCommerceCopy = (state: StudentCommerceState) => {
  switch (state) {
    case "ALREADY_PURCHASED":
      return {
        badge: "Comprado",
        title: "Ya tenés acceso a este curso",
        description:
          "La compra ya fue confirmada y podés entrar directamente al contenido.",
        actionLabel: "Ir al curso",
      };
    case "CHECKOUT_INITIATED":
      return {
        badge: "Checkout iniciado",
        title: "Tu compra ya fue iniciada",
        description:
          "Retomá la orden existente para continuar en Mercado Pago.",
        actionLabel: "Continuar compra",
      };
    case "PAYMENT_PENDING":
      return {
        badge: "Pago pendiente",
        title: "Estamos esperando confirmación del pago",
        description:
          "Mercado Pago todavía no confirmó el resultado final. Podés volver más tarde o revisar esta misma orden.",
        actionLabel: "Continuar compra",
      };
    case "PAYMENT_APPROVED":
      return {
        badge: "Pago aprobado",
        title: "El pago fue aprobado",
        description:
          "La compra ya está confirmada. El acceso al curso puede demorar unos segundos en habilitarse.",
        actionLabel: "Ver estado de compra",
      };
    case "PAYMENT_REJECTED":
      return {
        badge: "Pago rechazado",
        title: "El último intento no se aprobó",
        description:
          "Podés reintentar el pago reutilizando la misma orden comercial cuando corresponda.",
        actionLabel: "Reintentar compra",
      };
    case "PAYMENT_EXPIRED":
      return {
        badge: "Compra expirada",
        title: "La orden expiró o fue abandonada",
        description:
          "Podés retomar la compra y el sistema reutilizará la orden si sigue siendo válida.",
        actionLabel: "Reintentar compra",
      };
    case "MANUAL_REVIEW":
      return {
        badge: "Revisión",
        title: "Esta compra requiere revisión",
        description:
          "El estado actual necesita soporte manual antes de permitir una nueva operación.",
        actionLabel: "Ver detalle",
      };
    case "NOT_PURCHASED":
    default:
      return {
        badge: "Disponible",
        title: "Este curso está disponible",
        description: "Compralo para acceder a todo el contenido al instante",
        actionLabel: "Comprar",
      };
  }
};
