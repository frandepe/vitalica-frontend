import { Outlet } from "react-router-dom";
import { NavbarCourse } from "./NavbarCourse";

const CourseLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar fijo */}
      <NavbarCourse />

      {/* Espacio para compensar el navbar fijo */}
      <main className="pt-16 flex-1">
        <Outlet />
      </main>

      {/* Footer (si lo necesitás en cursos) */}
      {/* <Footer /> */}
    </div>
  );
};

export default CourseLayout;
