// src/components/common/ErrorFallback.tsx

import { useRouteError } from "react-router-dom";

export default function ErrorFallback() {
  const error = useRouteError() as any;

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">¡Oops! Algo salió mal 😢</h1>

      {isDev ? (
        // Mostrar error completo en dev
        <div className="w-full max-w-4xl bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs text-red-600 dark:text-red-400">
          <pre>{error?.message}</pre>
          {error?.stack && <pre className="mt-2">{error.stack}</pre>}
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
