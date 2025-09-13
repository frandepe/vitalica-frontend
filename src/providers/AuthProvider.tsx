import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // No necesitamos context para este ejemplo simple
  // El estado de auth se maneja directamente en useAuth hook
  return <>{children}</>;
};

export default AuthProvider;
