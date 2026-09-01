import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface InstructorRouteProps {
  children: ReactNode;
}

const InstructorRoute = ({ children }: InstructorRouteProps) => {
  const location = useLocation();
  const { isActive, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isActive) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role !== "INSTRUCTOR") {
    return <Navigate to="/perfil" replace />;
  }

  return <>{children}</>;
};

export default InstructorRoute;
