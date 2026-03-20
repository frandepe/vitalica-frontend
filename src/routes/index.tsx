import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/public.layout";
import AuthLayout from "../layouts/auth.layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import InstructorRoute from "../components/auth/InstructorRoute";

// Lazy loading de páginas para mejor performance
import { lazy } from "react";
import { Illustration, NotFound } from "@/pages/public/404Page";
import ErrorFallback from "@/components/ErrorFallback";
import AdminRoute from "@/components/auth/AdminRoute";
import SubirPageTest from "@/pages/public/upload-test";
import CourseStatus from "@/pages/protected/CourseStatus";
import CourseLayout from "@/layouts/course-player.layout";
import BlogsLayout from "@/layouts/blogs.layout";

// Páginas públicas
const Onboarding = lazy(() => import("@/pages/public/Onboarding"));
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const PrivacyPolicyPage = lazy(
  () => import("@/pages/public/PrivacyPolicyPage"),
);
const Search = lazy(() => import("@/pages/public/Courses/Search"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const TermsAndConditionsPage = lazy(
  () => import("@/pages/public/TermsAndConditionsPage"),
);
const ApplyToBeInstructor = lazy(
  () => import("@/pages/public/ApplyToBeInstructor"),
);
const MyCourses = lazy(() => import("@/pages/protected/MyCourses"));
const TeachesOnVitalica = lazy(
  () => import("@/pages/public/TeachesOnVitalica"),
);
const BlogLandingPage = lazy(() => import("@/pages/public/Blogs/Blogs"));
const CourseOverview = lazy(
  () => import("@/pages/public/Courses/CourseOverview"),
);
const ProfileBySlug = lazy(() => import("@/pages/public/ProfileBySlug"));
const Checkout = lazy(() => import("@/pages/public/Courses/Checkout"));
const CertificatePage = lazy(
  () => import("@/pages/public/Courses/CertificatePage"),
);
const PracticeCertificatePage = lazy(
  () => import("@/pages/public/Courses/PracticeCertificatePage"),
);

// Páginas de autenticación
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));

// Páginas protegidas por autenticación
const ProfilePage = lazy(() => import("@/pages/protected/ProfilePage"));
const CoursePlayer = lazy(
  () => import("@/pages/protected/Courses/CoursePlayer"),
);
const ApplicationStatus = lazy(
  () => import("@/pages/protected/ApplicationStatus"),
);

// Paginas protegicas - Dashboard
const DashboardInstructor = lazy(
  () => import("@/pages/protected/DashboardInstructor"),
);
const CardsDashboard = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/CardsDashboard"),
);
const Analytics = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/Analytics"),
);
const InstructorProfile = lazy(
  () =>
    import("@/pages/protected/ChildrensDashboardInstructor/InstructorProfile"),
);
const InstructorSpecialties = lazy(
  () =>
    import("@/pages/protected/ChildrensDashboardInstructor/InstructorSpecialties"),
);
const Courses = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/Courses"),
);
const PracticeRequests = lazy(
  () =>
    import("@/pages/protected/ChildrensDashboardInstructor/PracticeRequests"),
);
const Reviews = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/Reviews"),
);
const EditCourse = lazy(
  () => import("@/pages/protected/ChildrensDashboardInstructor/EditCourse"),
);

// Páginas del admin
const DashboardAdmin = lazy(() => import("@/pages/admin/DashboardAdmin"));
const AdminUsers = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/AdminUsers"),
);
const AdminCourses = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/AdminCourses"),
);
const AdminPayments = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/AdminPayments"),
);
const CardsDashboardAdmin = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/CardsDashboard"),
);
const InstructorsApplications = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/InstructorsApplications"),
);
const AdminInstructorsSpecialties = lazy(
  () =>
    import("@/pages/admin/ChildrensDashboardAdmin/AdminInstructorsSpecialties"),
);
const InstructorApplication = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/InstructorApplication"),
);
const AdminCourse = lazy(
  () => import("@/pages/admin/ChildrensDashboardAdmin/AdminCourse"),
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
        path: "sobre-nosotros",
        element: <AboutPage />,
      },
      {
        path: "buscar",
        element: <Search />,
      },
      {
        path: "solicitar-ser-instructor",
        element: (
          <ProtectedRoute>
            <ApplyToBeInstructor />
          </ProtectedRoute>
        ),
      },
      {
        path: "mis-cursos",
        element: (
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        ),
      },
      {
        path: "dar-cursos",
        element: <TeachesOnVitalica />,
      },
      {
        path: "contacto",
        element: <ContactPage />,
      },
      {
        path: "politicas-de-privacidad",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "terminos-y-condiciones",
        element: <TermsAndConditionsPage />,
      },
      {
        path: "upload-test",
        element: <SubirPageTest />,
      },

      {
        path: "cursos/:slug",
        element: <CourseOverview />,
      },
      {
        path: "perfil/:slug",
        element: <ProfileBySlug />,
      },
      {
        path: "cursos/:courseId/pago",
        element: <Checkout />,
      },
      {
        path: "certificado/:enrollmentId",
        element: <CertificatePage />,
      },
      {
        path: "certificado-practico/:enrollmentId",
        element: <PracticeCertificatePage />,
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
        path: "estado-curso/:courseId",
        element: (
          <ProtectedRoute>
            <CourseStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "instructor",
        element: (
          <InstructorRoute>
            <DashboardInstructor />
          </InstructorRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="panel-administrativo" replace />,
          },
          { path: "panel-administrativo", element: <CardsDashboard /> },
          {
            path: "perfil-de-instructor",
            element: <InstructorProfile />,
          },
          {
            path: "especialidades",
            element: <InstructorSpecialties />,
          },
          { path: "analiticas", element: <Analytics /> },
          { path: "cursos", element: <Courses /> },
          { path: "practicas", element: <PracticeRequests /> },
          { path: "editar-curso/:courseId", element: <EditCourse /> },
          { path: "resenas", element: <Reviews /> },
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
          { path: "instructores", element: <AdminInstructorsSpecialties /> },
          { path: "cursos", element: <AdminCourses /> },
          { path: "pagos", element: <AdminPayments /> },
          { path: "aplicaciones", element: <InstructorsApplications /> },
          { path: "aplicacion/:id", element: <InstructorApplication /> },
          { path: "curso/:id", element: <AdminCourse /> },
        ],
      },
    ],
  },
  // Ruta curso player
  {
    path: "mis-cursos/:slug",
    element: (
      <ProtectedRoute>
        <CourseLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ":lessonId?",
        element: <CoursePlayer />,
      },
    ],
  },
  {
    path: "blogs",
    element: <BlogsLayout />,

    children: [
      {
        path: "",
        element: <BlogLandingPage />,
      },
    ],
  },
  // Ruta catch-all para 404
  {
    path: "primeros-pasos",
    element: <Onboarding />,
  },
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
