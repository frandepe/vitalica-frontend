import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/public.layout";
import AuthLayout from "../layouts/auth.layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loading de páginas para mejor performance
import { lazy } from "react";

// Páginas públicas
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));

// Páginas de autenticación
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

// Páginas protegidas
const DashboardPage = lazy(() => import("@/pages/protected/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/protected/ProfilePage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      // Rutas protegidas dentro del layout público
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  // Ruta catch-all para 404
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground mb-6">Página no encontrada</p>
          <a
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);
