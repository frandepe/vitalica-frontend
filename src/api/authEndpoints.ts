import { ApiResponse } from "@/types/endpoints.types";
import { apiRequest } from "./configEndpoint";
import { API_ROUTES } from "@/constants";

// Tipos opcionales para la request/response
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Registrar usuario
export const registerUser = async (
  data: RegisterData
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/register`,
    method: "POST",
    data,
  });
};

// Login usuario
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/login`,
    method: "POST",
    data,
  });
};

// Obtener datos del usuario logueado
export const getMe = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/me`,
    method: "GET",
  });
};

// Enviar email de verificación
export const sendValidationEmail = async (data: {
  firstName: string;
  email: string;
}): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/verificar-email`,
    method: "POST",
    data,
  });
};

// Confirmar verificación
export const confirmVerification = async (
  token: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/confirm-verification/${token}`,
    method: "POST",
  });
};

export const getEmailByVerificationToken = async (token: string) => {
  try {
    const res = await apiRequest({
      url: `${API_ROUTES.AUTH}/email/verification/${token}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Login con Google
export const googleLogin = async (credential: string): Promise<ApiResponse> => {
  return apiRequest({
    url: `${API_ROUTES.AUTH}/google`,
    method: "POST",
    data: { credential },
  });
};
