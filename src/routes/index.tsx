import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/public.layout";
import AuthLayout from "../layouts/auth.layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loading de páginas para mejor performance
import { lazy } from "react";
import { DashboardInstructor } from "@/pages/protected/DashboardInstructor";
import { CardsDashboard } from "@/pages/protected/ChildrensDashboardInstructor/CardsDashboard";
import { Illustration, NotFound } from "@/pages/public/404Page";
import { InstructorInformationForm } from "@/components/instructor/Forms/InstructorInformationForm";

// Páginas públicas
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));

// Páginas de autenticación
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

// Páginas protegidas
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
        path: "contacto",
        element: <ContactPage />,
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <DashboardInstructor />
          </ProtectedRoute>
        ),
        children: [
          { path: "panel-administrativo", element: <CardsDashboard /> },
          {
            path: "perfil-de-instructor",
            element: <InstructorInformationForm />,
          },
          { path: "analiticas", element: <div>Analytics</div> },
          { path: "cursos", element: <div>Courses</div> },
          { path: "crear-curso", element: <div>Students</div> },
          { path: "resenas", element: <div>Reviews</div> },
        ],
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
      <div className="relative flex flex-col w-full justify-center min-h-svh bg-background p-6 md:p-10">
        <div className="relative max-w-5xl mx-auto w-full">
          <Illustration className="absolute inset-0 w-full h-[50vh] opacity-[0.04] dark:opacity-[0.03] text-foreground" />
          <NotFound
            title="Página no encontrada"
            description="Parece que te perdiste. Esta página no existe."
          />
        </div>
      </div>
    ),
  },
]);
