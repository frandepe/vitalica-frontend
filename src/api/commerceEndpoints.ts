import { API_ROUTES } from "@/constants";
import type { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";

export type CommercialOrderStatus =
  | "CREATED"
  | "CHECKOUT_PENDING"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PAYMENT_FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED"
  | "DISPUTED";

export type CommercialOrderAccessStatus =
  | "PENDING"
  | "GRANTED"
  | "FAILED"
  | "REVOKED";

export type CommercialPaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDED"
  | "CHARGEDBACK"
  | "IN_REVIEW";

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
    status: CommercialOrderStatus;
    accessStatus: CommercialOrderAccessStatus;
    expiresAt: string | null;
  } | null;
}

export interface CoursePurchaseOrderResponse {
  orderId: string;
  status: CommercialOrderStatus;
  accessStatus: CommercialOrderAccessStatus;
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
  checkoutUrlSource: "init_point" | "sandbox_init_point";
  sandboxCheckoutUrl: string | null;
  preferenceId: string;
  externalReference: string;
  paymentStatus: "PENDING";
  checkoutDiagnostics: {
    collectorId: number | string;
    marketplace: string | null;
    marketplaceFee: number;
    installments: 1;
    tokenSource: "seller_oauth";
  };
}

export interface CommercialOrderStatusResponse {
  orderId: string;
  courseId: string;
  courseSlug: string | null;
  courseTitle: string;
  orderStatus: CommercialOrderStatus;
  accessStatus: CommercialOrderAccessStatus;
  latestPaymentId: string | null;
  latestPaymentStatus: CommercialPaymentStatus | null;
  latestPaymentStatusDetail: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  accessGrantedAt: string | null;
  lastPaymentAttemptAt: string | null;
}

export interface SyncCommercialOrderAfterRedirectResponse {
  orderId: string;
  synced: boolean;
  source: "mercado_pago_payment" | "mercado_pago_merchant_order" | "noop";
  paymentId: string | null;
  paymentStatus: CommercialPaymentStatus | null;
  orderStatus: CommercialOrderStatus;
  accessStatus: CommercialOrderAccessStatus;
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

export const getCommercialOrderStatus = async (
  orderId: string,
): Promise<ApiResponse<CommercialOrderStatusResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COMMERCE}/order/${orderId}/status`,
    method: "GET",
  });
};

export const syncCommercialOrderAfterRedirect = async (
  orderId: string,
  params?: {
    paymentId?: string | null;
    collectionId?: string | null;
    merchantOrderId?: string | null;
  },
): Promise<ApiResponse<SyncCommercialOrderAfterRedirectResponse>> => {
  return apiRequest({
    url: `${API_ROUTES.COMMERCE}/order/${orderId}/sync`,
    method: "POST",
    params: {
      paymentId: params?.paymentId ?? undefined,
      collection_id: params?.collectionId ?? undefined,
      merchant_order_id: params?.merchantOrderId ?? undefined,
    },
  });
};
