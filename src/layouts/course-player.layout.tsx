import { Outlet } from "react-router-dom";
import { NavbarCourse } from "./NavbarCourse";
import { ScrollToTop } from "@/utils/scroll-top";
import { BetaNavbarBar } from "@/components/beta/BetaNavbarBar";

const CourseLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Scroll global al cambiar de ruta */}
      <ScrollToTop />
      {/* Navbar fijo */}
      <NavbarCourse />
      <BetaNavbarBar />

      {/* Espacio para compensar el navbar fijo */}
      <main className="pt-[104px] flex-1">
        <Outlet />
      </main>

      {/* Footer (si lo necesitás en cursos) */}
      {/* <Footer /> */}
    </div>
  );
};

export default CourseLayout;
