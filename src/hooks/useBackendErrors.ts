import { useState } from "react";

export const useBackendErrors = () => {
  const [errors, setErrors] = useState<string[]>([]);

  // Setear múltiples errores desde el backend
  const setBackendErrors = (backendErrors: { message: string }[]) => {
    const msgs = backendErrors.map((err) => err.message);
    setErrors(msgs);
  };

  // Setear un solo mensaje de error
  const setBackendErrorMessage = (message: string) => {
    setErrors([message]);
  };

  const clearErrors = () => setErrors([]);

  const getGeneralErrors = () => errors;

  return {
    errors,
    setBackendErrors,
    setBackendErrorMessage,
    clearErrors,
    getGeneralErrors,
  };
};
