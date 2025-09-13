import type React from "react";

import type { ReactNode } from "react";

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const AuthForm = ({ children, onSubmit, isLoading = false }: AuthFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Procesando...
            </div>
          ) : (
            "Continuar"
          )}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
