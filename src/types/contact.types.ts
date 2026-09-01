import { ApiResponse } from "./endpoints.types";

export type ContactType = "PERSONA" | "ORGANIZACION";

export type ContactReason =
  | "CONSULTA_GENERAL"
  | "ALIANZAS_Y_CONVENIOS"
  | "CAPACITACION_PARA_EMPRESAS"
  | "PRENSA_O_INSTITUCIONAL"
  | "SOPORTE_O_OTRO";

export type OrganizationType =
  | "EMPRESA"
  | "INSTITUCION_EDUCATIVA"
  | "CENTRO_DE_SALUD"
  | "ONG"
  | "ORGANISMO_PUBLICO"
  | "OTRA";

export interface ContactInquiryPayload {
  contactType: ContactType;
  fullName: string;
  email: string;
  phone?: string;
  reason: ContactReason;
  message: string;
  organizationName?: string;
  organizationType?: OrganizationType;
  jobTitle?: string;
  teamSize?: string;
}

export type ContactInquiryResponse = ApiResponse;
