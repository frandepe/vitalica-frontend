import type { AuthContextType, User } from "@/types/auth.types";
import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de token al cargar la app
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          // Aquí harías la verificación real del token
          // Por ahora simulamos un usuario
          setUser({
            id: "1",
            email: "user@example.com",
            name: "Usuario Demo",
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Aquí harías la llamada real a tu API
      const mockUser: User = {
        id: "1",
        email,
        name: "Usuario Demo",
      };

      localStorage.setItem("auth-token", "mock-token");
      setUser(mockUser);
    } catch (error) {
      throw new Error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Aquí harías la llamada real a tu API
      const mockUser: User = {
        id: "1",
        email,
        name,
      };

      localStorage.setItem("auth-token", "mock-token");
      setUser(mockUser);
    } catch (error) {
      throw new Error("Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register,
  };
};

export { AuthContext };
