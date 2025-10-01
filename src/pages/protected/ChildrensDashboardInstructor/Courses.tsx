import React, { useState } from "react";
import { GridCards } from "@/components/CardsAnimated/GridCards";
import { CardInstructorCourse } from "@/components/instructor/CardInstructorCourse";
import { Calendar, Users } from "lucide-react";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { TextImage } from "@/components/TextImage";

const ITEMS_PER_PAGE = 6;

interface ICourse {
  title: string;
  description: string;
  thumbnailUrl: string;
  specialty: string;
  level: "Principiante" | "Intermedio" | "Avanzado"; // si querés limitarlo a esos 3
  duration: number; // en minutos
  price: number;
  currency: string; // Ej: "USD", "ARS", etc.
  avgRating: number; // promedio de estrellas
  ratingCount: number; // cantidad de reviews
  totalStudents: number; // cantidad de alumnos
}

export const Courses: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const sampleCourses: ICourse[] = [
    // {
    //   title: "Curso de RCP Básico",
    //   description:
    //     "Aprendé técnicas esenciales de reanimación cardiopulmonar para emergencias.",
    //   thumbnailUrl: "https://placehold.co/400x300",
    //   specialty: "Emergencias Médicas",
    //   level: "Principiante",
    //   duration: 120,
    //   price: 50,
    //   currency: "USD",
    //   avgRating: 4.5,
    //   ratingCount: 95,
    //   totalStudents: 120,
    // },
    // {
    //   title: "Trauma Avanzado",
    //   description:
    //     "Manejo avanzado de trauma en pacientes críticos, con casos prácticos.",
    //   thumbnailUrl: "https://placehold.co/400x300",
    //   specialty: "Trauma",
    //   level: "Avanzado",
    //   duration: 240,
    //   price: 120,
    //   currency: "USD",
    //   avgRating: 4.8,
    //   ratingCount: 60,
    //   totalStudents: 85,
    // },
    // {
    //   title: "Primeros Auxilios en el Hogar",
    //   description:
    //     "Curso práctico para actuar ante accidentes domésticos comunes.",
    //   thumbnailUrl: "https://placehold.co/400x300",
    //   specialty: "Primeros Auxilios",
    //   level: "Intermedio",
    //   duration: 90,
    //   price: 35,
    //   currency: "USD",
    //   avgRating: 4.2,
    //   ratingCount: 150,
    //   totalStudents: 200,
    // },
  ];

  const infoCards = [
    {
      title: "Gestión de tiempos",
      description:
        "Organizá y visualizá tus horarios fácilmente con nuestro sistema de calendario.",
      Icon: Calendar,
    },
    {
      title: "Trabajo en equipo",
      description:
        "Colaborá con tu equipo de manera eficiente y mantené todos los proyectos en orden.",
      Icon: Users,
    },
  ];

  const totalPages = Math.ceil(sampleCourses.length / ITEMS_PER_PAGE);

  const courses = sampleCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (courses.length === 0)
    return (
      <div className="flex xl:flex-row flex-col w-full items-start">
        <TextImage
          title="Todavía no tenés cursos creados"
          description="Empezá a compartir tu conocimiento creando tu primer curso. Es fácil, rápido y vas a tener todo en un solo lugar para gestionarlo."
          imageSrc="/Banners/banner2.jpg"
          buttonPrimary={{
            label: "Crear curso",
            href: "/perfil/nuevo-curso",
          }}
          buttonSecondary={{
            label: "Más información",
            href: "https://shadcnblocks.com",
          }}
        />

        <div className="w-80 flex flex-col gap-6 p-6 mx-auto">
          {infoCards.map((card) => (
            <GridCards key={card.title} {...card} />
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold pt-6 mb-4">Mis Cursos</h2>
      <TextPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <div className="flex lg:flex-row flex-col w-full items-start">
        <div className="flex-1 grid gap-6 mx-auto">
          {courses.map((course, index) => (
            <CardInstructorCourse key={index} {...course} />
          ))}
        </div>
        <div className="w-80 flex flex-col gap-6 p-6 mx-auto">
          {infoCards.map((card) => (
            <GridCards key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};
