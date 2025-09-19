import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  BookPlus,
  ChartNoAxesCombined,
  ChevronRight,
  Star,
  UserRoundPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const features = [
  {
    title: "Perfil", // editar perfil de instructor
    href: "/perfil/perfil-de-instructor",
    description:
      "Actualiza tu información personal y profesional para que tus estudiantes te conozcan mejor.",
    icon: <UserRoundPen />,
  },
  {
    title: "Analíticas",
    href: "/perfil/analiticas",
    description:
      "Consulta estadísticas sobre tus cursos, estudiantes y desempeño general como instructor.",
    icon: <ChartNoAxesCombined />,
  },
  {
    title: "Mis Cursos",
    href: "/perfil/cursos",
    description:
      "Administra todos tus cursos: edita, organiza el contenido y realiza actualizaciones fácilmente.",
    icon: <BookOpen />,
  },
  {
    title: "Nuevo curso",
    href: "/perfil/crear-curso",
    description:
      "Crea un curso desde cero y compártelo con tu comunidad de estudiantes.",
    icon: <BookPlus />,
  },
  {
    title: "Reseñas y Calificaciones",
    href: "/perfil/resenas",
    description:
      "Lee la opinión de tus estudiantes, revisa sus valoraciones y mejora tu propuesta educativa.",
    icon: <Star />,
  },
];

export const CardsDashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10 py-10 md:max-w-7xl mx-auto gap-10">
      {features.map((feature) => (
        <Card key={feature.title} className="h-[250px]">
          <Feature {...feature} />
        </Card>
      ))}
    </div>
  );
};

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
