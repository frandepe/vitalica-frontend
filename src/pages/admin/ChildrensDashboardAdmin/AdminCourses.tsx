import { useEffect, useState } from "react";
import { AdminCoursesAccordion } from "@/components/Accordion/CourseAccordion";
import { AdminCourse } from "@/types/admin.types";
import { getAllCoursesAdmin } from "@/api";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";

const AdminCourses = () => {
  const [coursesData, setCoursesData] = useState<AdminCourse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // estado de loading

  const getCourses = async () => {
    setLoading(true); // arrancamos loading
    try {
      const response = await getAllCoursesAdmin({
        page: 1,
        limit: 10,
      });

      if (response.success && response.data) {
        setCoursesData(response.data.courses);
      }

      console.log("response", response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false); // terminamos loading
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  if (loading) {
    return <GlobalLoading text="Cargando cursos..." />;
  }

  if (!coursesData) {
    return <p>No registramos cursos</p>;
  }

  return (
    <div className="min-h-screen">
      <AdminCoursesAccordion projects={coursesData} />
    </div>
  );
};

export default AdminCourses;
