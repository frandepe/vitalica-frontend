import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { isActive, user, isInitialized } = useAuth();

  // Mientras se hidrata la sesión mostramos loading
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado
  if (!isActive) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero no es admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
