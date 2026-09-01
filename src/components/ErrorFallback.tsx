// src/components/common/ErrorFallback.tsx
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const getErrorDetails = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return {
      message:
        typeof error.data === "string" ? error.data : error.statusText,
      stack: undefined,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: "Error desconocido",
    stack: undefined,
  };
};

export default function ErrorFallback() {
  const error = useRouteError();
  const errorDetails = getErrorDetails(error);

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">¡Oops! Algo salió mal 😢</h1>

      {isDev ? (
        // Mostrar error completo en dev
        <div className="w-full max-w-4xl bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs text-red-600 dark:text-red-400">
          <pre>{errorDetails.message}</pre>
          {errorDetails.stack && <pre className="mt-2">{errorDetails.stack}</pre>}
        </div>
      ) : (
        // Mensaje amigable en prod
        <p className="text-sm text-muted-foreground">
          Lo sentimos, ocurrió un error inesperado. useRouteError no logra
          descifrar el error.
        </p>
      )}
    </div>
  );
}
