import { API_ROUTES } from "@/constants";
import type { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";

export interface CoursePurchaseSellabilityResponse {
  courseId: string;
  courseTitle: string | null;
  amount: string | null;
  currency: string | null;
  isSellable: boolean;
  reasonCode: string | null;
  reasonMessage: string;
  orderResolution: "CREATE_ORDER" | "REUSE_EXISTING_ORDER" | "BLOCKED";
  existingOrder: {
    orderId: string;
    status: string;
    accessStatus: string;
    expiresAt: string | null;
  } | null;
}

export interface CoursePurchaseOrderResponse {
  orderId: string;
  status: string;
  accessStatus: string;
  orderAction: "CREATED" | "REUSED";
  snapshot: {
    courseId: string;
    courseTitle: string;
    instructorProfileId: string;
    instructorUserId: string;
    mpCollectorId: string;
    grossAmount: string;
    currency: string;
    platformPercent: string;
    instructorPercent: string;
    platformAmount: string;
    instructorAmount: string;
    commissionRuleVersion: string;
  };
  expiresAt: string | null;
  checkoutPreparation: {
    provider: "MERCADO_PAGO";
    status: "NOT_CREATED";
    nextAction: "CREATE_MERCADO_PAGO_CHECKOUT";
    ready: true;
  };
}

export interface MercadoPagoCheckoutResponse {
  orderId: string;
  paymentProvider: "MERCADO_PAGO";
  paymentId: string;
  checkoutUrl: string;
  sandboxCheckoutUrl: string | null;
  preferenceId: string;
  externalReference: string;
  paymentStatus: "PENDING";
}

export const getCoursePurchaseSellability = async (
  courseId: string,
): Promise<ApiResponse<CoursePurchaseSellabilityResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COMMERCE}/course/${courseId}/sellability`,
    method: "GET",
  });
};

export const createCoursePurchaseOrder = async (
  courseId: string,
): Promise<ApiResponse<CoursePurchaseOrderResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COMMERCE}/course/${courseId}/order`,
    method: "POST",
  });
};

export const createMercadoPagoCheckout = async (
  orderId: string,
): Promise<ApiResponse<MercadoPagoCheckoutResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COMMERCE}/order/${orderId}/checkout`,
    method: "POST",
  });
};
