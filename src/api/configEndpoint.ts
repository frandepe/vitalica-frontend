import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";

// Crear instancia de Axios
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // tu URL base desde Vite
  responseType: "json",
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Interceptor para agregar token a cada request
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

    // Asegurar que headers siempre esté definido
    if (!config.headers) {
      config.headers = AxiosHeaders.from({});
    }

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const url = error.config?.url || "";

      // Ignorar login y register
      const isAuthRoute =
        url.includes("/auth/login") || url.includes("/auth/register");

      if (!isAuthRoute && error.response.status === 401) {
        // Solo para rutas privadas
        localStorage.removeItem("token");
        console.warn("Usuario no autorizado o token expirado");
        // Podés redirigir o desloguear aquí si querés
      }

      return Promise.reject(error); // para manejarlo en apiRequest
    }

    return Promise.reject(error);
  }
);

// Interfaz del request genérico
interface PropsApiRequest {
  url: string;
  data?: unknown; // body para POST/PUT
  params?: object; // query params para GET
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

// Función genérica para llamadas a la API
export const apiRequest = async ({
  url,
  data,
  params,
  method,
}: PropsApiRequest) => {
  try {
    const response = await API.request({
      url,
      method,
      data,
      params,
    });

    return response.data;
  } catch (error: unknown) {
    // Extraer datos del backend si existen
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const backendData = axios.isAxiosError(error)
      ? error.response?.data
      : undefined;
    if (status === 401) {
      const isAuthRoute =
        url.includes("/auth/login") || url.includes("/auth/register");
      if (isAuthRoute) {
        // Solo devolver la data del backend tal cual
        return backendData;
      }
      return {
        success: false,
        message:
          backendData?.message ??
          backendData?.error ??
          "Usuario no autorizado o token expirado",
        errors: backendData?.errors ?? [],
        data: backendData?.data,
      };
    }

    if (status === 429) {
      return {
        success: false,
        message:
          backendData?.message ??
          backendData?.error ??
          "Demasiadas solicitudes. Intenta nuevamente más tarde.",
        errors: [],
        data: backendData?.data,
      };
    }

    if (backendData) {
      return {
        success: backendData.success ?? false,
        message:
          backendData.message ??
          backendData.error ??
          "Error desconocido del servidor",
        errors: backendData.errors ?? [],
        data: backendData.data,
      };
    }

    // 🔸 Si no hay response, es un error de red o CORS
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error de conexión con el servidor",
      errors: [],
    };
  }
};
