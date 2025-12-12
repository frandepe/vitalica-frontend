export interface PromoUploadStatus {
  status: string;
  assetId: string;
  playbackId: string;
  success?: boolean;
  message?: string;
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
