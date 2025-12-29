import { useEffect, useState } from "react";
import { getAllCoursesAdmin } from "@/api";
import { AdminCoursesAccordion } from "@/components/Accordion/CourseAccordion";
import { AdminCourse } from "@/types/admin.types";

const AdminCourses = () => {
  const [coursesData, setCoursesData] = useState<AdminCourse[] | null>(null);

  const getCourses = async () => {
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
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  if (!coursesData) {
    return <p>No hay cursos registrados</p>;
  }

  return (
    <div className="min-h-screen">
      <AdminCoursesAccordion projects={coursesData} />
    </div>
  );
};

export default AdminCourses;
