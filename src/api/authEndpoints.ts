// authEndpoints.ts

import { apiRequest } from "./configEndpoint";

// Tipos opcionales para la request/response
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface BackendError {
  field: string; // nombre del campo afectado
  message: string; // mensaje de error para mostrar
  value?: any; // valor enviado que causó el error (opcional)
}

export interface ApiResponse<T = any> {
  success: boolean; // true si todo salió bien
  message?: string; // mensaje general opcional
  errors?: BackendError[]; // array de errores por campo opcional
  data?: T; // datos devueltos por la API
}

// Registrar usuario
export const registerUser = async (
  data: RegisterData
): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/auth/register",
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
    url: "/api/auth/login",
    method: "POST",
    data,
  });
};

// Obtener datos del usuario logueado
export const getMe = async (): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/auth/me",
    method: "GET",
  });
};

// Enviar email de verificación
export const sendValidationEmail = async (data: {
  firstName: string;
  email: string;
}): Promise<ApiResponse> => {
  return apiRequest({
    url: "/api/auth/verificar-email",
    method: "POST",
    data,
  });
};

// Confirmar verificación
export const confirmVerification = async (
  token: string
): Promise<ApiResponse> => {
  return apiRequest({
    url: `/api/auth/confirm-verification/${token}`,
    method: "POST",
  });
};

export const getEmailByVerificationToken = async (token: string) => {
  try {
    const res = await apiRequest({
      url: `/api/auth/email/verification/${token}`,
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
    url: "/api/auth/google",
    method: "POST",
    data: { credential },
  });
};

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  return apiRequest({
    url: "/api/users/me",
    method: "PUT",
    data,
  });
};

export const deleteProduct = async (productId: string) => {
  return apiRequest({
    url: `/api/products/${productId}`,
    method: "DELETE",
  });
};
