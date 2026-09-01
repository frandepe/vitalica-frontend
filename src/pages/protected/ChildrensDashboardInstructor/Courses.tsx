import { useEffect, useState } from "react";
import { CardInstructorCourse } from "@/components/instructor/CardInstructorCourse";
import { FileCheck2, ListChecks, Plus } from "lucide-react";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { TextImage } from "@/components/TextImage";
import { createCourse, getInstructorCourses } from "@/api";
import { useNavigate } from "react-router-dom";
import type { CourseStatus, ICourse } from "@/types/course.types";
import { InstructorMyCoursesSkeleton } from "@/components/Skeletons/InstructorMyCoursesSkeleton";
import { Button } from "@/components/ui/button";
import { INSTRUCTOR_ROUTES } from "@/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TitleAdminPages from "@/components/Texts/TitleAdminPages";

const ITEMS_PER_PAGE = 6;
const REVIEW_STATUSES: CourseStatus[] = ["SUBMITTED", "UNDER_REVIEW"];

const getCourseStatusSummary = (courses: ICourse[]) => ({
  total: courses.length,
  drafts: courses.filter((course) => course.status === "DRAFT").length,
  inReview: courses.filter((course) => REVIEW_STATUSES.includes(course.status))
    .length,
  published: courses.filter((course) => course.status === "PUBLISHED").length,
});

export default function Courses() {
  const navigate = useNavigate();

  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
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

  const onCreate = async () => {
    setLoadingCreate(true);
    try {
      const res = await createCourse();
      if (!res.success) {
        console.error("Error creating course:", res.message);
        return;
      }
      navigate(`${INSTRUCTOR_ROUTES.EDIT_COURSE}/${res.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCreate(false);
    }
  };

  const totalPages = Math.ceil(coursesData.length / ITEMS_PER_PAGE);
  const courseStatusSummary = getCourseStatusSummary(coursesData);

  const courses = coursesData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return <InstructorMyCoursesSkeleton />;
  }

  // TODO: Si el usuario todavia no completo su perfil de instructor, va a salir un error al intentar crear curso
  if (!loading && coursesData.length === 0) {
    return (
      <div className="flex xl:flex-row flex-col w-full items-start">
        <TextImage
          title="Todavía no tenés cursos creados"
          description="Empezá a compartir tu conocimiento creando tu primer curso."
          imageSrc="/Banners/banner2.jpg"
          buttonPrimary={{
            label: "+ Tu primer curso",
            onSubmit: onCreate,
          }}
          buttonSecondary={{
            label: "Más información",
            href: "https://shadcnblocks.com", // TODO: cambiar link a pagina de ayuda
          }}
        />

        <div className="w-full max-w-80 flex flex-col gap-6 p-6 mx-auto">
          <CourseStatusSummaryCard summary={courseStatusSummary} />
          <CoursePublishingInfoCard />
        </div>
      </div>
    );
  }

  // ===============================
  // 3) CURSOS NORMALES
  // ===============================
  return (
    <div>
      <div className="pt-6 mb-4">
        <TitleAdminPages title="Mis cursos" />
      </div>
      <div className="flex justify-between">
        <TextPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <Button
          variant="secondary"
          className="gap-2"
          onClick={onCreate}
          disabled={loadingCreate}
        >
          {loadingCreate ? "Creando..." : "Nuevo curso"} <Plus size={16} />
        </Button>
      </div>

      <div className="flex lg:flex-row flex-col w-full items-start mt-2">
        <div className="flex-1 grid gap-6 mx-auto">
          {courses.map((course) => (
            <CardInstructorCourse key={course.id} {...course} />
          ))}
        </div>

        <div className="w-full max-w-80 flex flex-col gap-6 pl-0 pt-6 mx-auto lg:pl-6 lg:pt-0">
          <CourseStatusSummaryCard summary={courseStatusSummary} />
          <CoursePublishingInfoCard />
        </div>
      </div>
    </div>
  );
}

function CourseStatusSummaryCard({
  summary,
}: {
  summary: ReturnType<typeof getCourseStatusSummary>;
}) {
  const items = [
    { label: "Total", value: summary.total },
    { label: "Borradores", value: summary.drafts },
    { label: "En revisión", value: summary.inReview },
    { label: "Publicados", value: summary.published },
  ];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm p-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ListChecks className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="font-semibold text-slate-900">Estado de tus cursos</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-lg font-semibold tabular-nums text-slate-950">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CoursePublishingInfoCard() {
  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm p-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <FileCheck2 className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="font-semibold text-slate-900">
            ¿Cómo publico un curso?
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">
          Completá el contenido de tu curso y, cuando esté listo, envialo a
          revisión. Nuestro equipo lo revisará antes de publicarlo.
        </p>
      </CardContent>
    </Card>
  );
}
