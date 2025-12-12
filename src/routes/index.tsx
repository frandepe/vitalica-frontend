import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/public.layout";
import AuthLayout from "../layouts/auth.layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy loading de páginas para mejor performance
import { lazy } from "react";
import { Illustration, NotFound } from "@/pages/public/404Page";
import ErrorFallback from "@/components/ErrorFallback";
import AdminRoute from "@/components/auth/AdminRoute";

// Páginas públicas
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const ApplyToBeInstructor = lazy(
  () => import("@/pages/public/ApplyToBeInstructor")
);

// Páginas de autenticación
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));

// Páginas protegidas por autenticación
const ProfilePage = lazy(() => import("@/pages/protected/ProfilePage"));
const ApplicationStatus = lazy(
  () => import("@/pages/protected/ApplicationStatus")
);

// Paginas protegicas - Dashboard
const DashboardInstructor = lazy(
  () => import("@/pages/protected/DashboardInstructor")
);
const CardsDashboard = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/CardsDashboard")
);
const Analytics = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/Analytics")
);
const InstructorProfile = lazy(
  () =>
    import("@/pages/protected/ChildrensDashboardInstructor/InstructorProfile")
);
const Courses = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/Courses")
);
const EditCourse = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/EditCourse")
);

// Páginas del admin
const DashboardAdmin = lazy(() => import("@/pages/admin/DashboardAdmin"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const CardsDashboardAdmin = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/CardsDashboard")
);
const InstructorsApplications = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/InstructorsApplications")
);
const InstructorApplication = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/InstructorApplication")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorFallback />,
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
        path: "solicitar-ser-instructor",
        element: <ApplyToBeInstructor />,
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
        path: "estado-aplicacion",
        element: (
          <ProtectedRoute>
            <ApplicationStatus />
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
            element: <InstructorProfile />,
          },
          { path: "analiticas", element: <Analytics /> },
          { path: "cursos", element: <Courses /> },
          { path: "editar-curso/:courseId", element: <EditCourse /> },
          { path: "resenas", element: <div>Reviews</div> },
        ],
      },
    ],
  },
  // Rutas autenticación
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
      {
        path: "verificar-email",
        element: <VerifyEmailPage />,
      },
    ],
  },
  // Rutas admin
  {
    path: "admin",
    element: <PublicLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        element: (
          <AdminRoute>
            <DashboardAdmin />
          </AdminRoute>
        ),
        children: [
          { path: "panel-administrativo", element: <CardsDashboardAdmin /> },
          { path: "usuarios", element: <AdminUsers /> },
          { path: "aplicaciones", element: <InstructorsApplications /> },
          { path: "aplicacion/:id", element: <InstructorApplication /> },
        ],
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
