import { useEffect, useState } from "react";
import { GridCards } from "@/components/CardsAnimated/GridCards";
import { CardInstructorCourse } from "@/components/instructor/CardInstructorCourse";
import { Calendar, Plus, Users } from "lucide-react";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { TextImage } from "@/components/TextImage";
import { createCourse, getInstructorCourses } from "@/api";
import { useNavigate } from "react-router-dom";
import { ICourse } from "@/types/course.types";
import { Skeleton } from "@/components/ui/skeleton";
import { InstructorMyCoursesSkeleton } from "@/components/Skeletons/InstructorMyCoursesSkeleton";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

export default function Courses() {
  const navigate = useNavigate();

  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getInstructorCourses();
      if (res.success) {
        setCoursesData(res.data);
      } else {
        console.error("Error fetching courses:", res.message);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

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

  const onCreate = async () => {
    const res = await createCourse();
    if (!res.success) {
      console.error("Error creating course:", res.message);
      return;
    }
    navigate(`/perfil/editar-curso/${res.data.id}`);
  };

  const totalPages = Math.ceil(coursesData.length / ITEMS_PER_PAGE);

  const courses = coursesData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ===============================
  // 1) PANTALLA DE CARGA (SKELETON)
  // ===============================
  if (loading) {
    return <InstructorMyCoursesSkeleton />;
  }

  // ===============================
  // 2) SIN CURSOS
  // ===============================
  if (!loading && coursesData.length === 0) {
    return (
      <div className="flex xl:flex-row flex-col w-full items-start">
        <TextImage
          title="Todavía no tenés cursos creados"
          description="Empezá a compartir tu conocimiento creando tu primer curso."
          imageSrc="/Banners/banner2.jpg"
          buttonPrimary={{
            label: "Crear curso",
            onSubmit: onCreate,
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
  }

  // ===============================
  // 3) CURSOS NORMALES
  // ===============================
  return (
    <div>
      <h2 className="text-2xl font-semibold pt-6 mb-4">Mis Cursos</h2>
      <div className="flex justify-between">
        <TextPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {/* TODO: añadir logica para crear nuevo curso */}
        <Button variant="secondary" className="gap-2">
          Nuevo curso <Plus size={16} />
        </Button>
      </div>

      <div className="flex lg:flex-row flex-col w-full items-start mt-2">
        <div className="flex-1 grid gap-6 mx-auto">
          {courses.map((course, index) => (
            <CardInstructorCourse key={index} {...course} />
          ))}
        </div>

        <div className="w-80 flex flex-col gap-6 pl-6 mx-auto">
          {infoCards.map((card) => (
            <GridCards key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
