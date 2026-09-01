import { Card } from "@/components/ui/card";
import {
  BarChart3,
  ChevronRight,
  DollarSign,
  GraduationCap,
  LifeBuoy,
  School,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const features = [
  {
    title: "Panel administrativo",
    href: "/admin/panel-administrativo",
    description:
      "Accede a herramientas y reportes administrativos para gestionar toda la plataforma.",
    icon: <BarChart3 />,
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    description:
      "Visualiza y administra todos los usuarios registrados en la plataforma.",
    icon: <Users />,
  },
  {
    title: "Instructores",
    href: "/admin/instructores",
    description:
      "Revisa perfiles de instructores, aprueba o gestiona su estado y desempeño.",
    icon: <GraduationCap />,
  },
  {
    title: "Aplicaciones",
    href: "/admin/aplicaciones",
    description:
      "Revisa nuevas aplicaciones de instructores y proporciona feedback sobre su aceptación.",
    icon: <School />,
  },
  {
    title: "Cursos",
    href: "/admin/cursos",
    description:
      "Gestiona todos los cursos: revisa contenido, aprueba o rechaza y da feedback a los instructores.",
    icon: <Video />,
  },
  {
    title: "Pagos",
    href: "/admin/pagos",
    description:
      "Supervisa los pagos realizados, pendientes y resuelve cualquier incidencia financiera.",
    icon: <DollarSign />,
  },
  {
    title: "Métricas",
    href: "/admin/metricas",
    description:
      "Consulta estadísticas globales sobre cursos, instructores, usuarios y desempeño de la plataforma.",
    icon: <TrendingUp />,
  },
  {
    title: "Moderación",
    href: "/admin/moderacion",
    description:
      "Controla contenido, revisa reportes y asegura que se cumplan las normas de la comunidad.",
    icon: <ShieldCheck />,
  },
  {
    title: "Soportes",
    href: "/admin/soportes",
    description:
      "Gestiona consultas y problemas enviados por instructores para mantener la plataforma funcionando correctamente.",
    icon: <LifeBuoy />,
  },
];

export default function DashboardInstructor() {
  return (
    <div className="flex flex-wrap justify-center md:justify-start relative z-10 py-10 md:max-w-7xl gap-10">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="h-[250px] flex-1 min-w-[250px] max-w-[300px]"
        >
          <Feature {...feature} />
        </Card>
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(href)}
      className="flex flex-col gap-1 py-7 relative group/feature cursor-pointer h-full"
    >
      {/* Fondo de hover */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent z-0 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 px-10 flex flex-col h-full">
        <div className="mb-4 rounded-lg bg-blue-100 text-secondary w-max p-2 group-hover/feature:bg-secondary group-hover/feature:text-white transition duration-200">
          {icon}
        </div>

        <div className="text-lg font-bold mb-2">
          <div className="absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-secondary transition-all duration-200" />
          <span className="inline-block text-neutral-800 dark:text-neutral-100 group-hover/feature:translate-x-2 transition duration-200">
            {title}
          </span>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs mb-2 group-hover/feature:translate-x-2 transition duration-200">
          {description}
        </p>

        <div className="mt-auto">
          <ChevronRight className="ml-auto text-neutral-400 group-hover/feature:text-secondary transition duration-200" />
        </div>
      </div>
    </div>
  );
};
