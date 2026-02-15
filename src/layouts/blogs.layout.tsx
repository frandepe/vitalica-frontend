import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/utils/scroll-top";
import { NavbarBlogs } from "./NavbarBlogs";

const BlogsLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Scroll global al cambiar de ruta */}
      <ScrollToTop />
      {/* Navbar fijo */}
      <NavbarBlogs />

      {/* Espacio para compensar el navbar fijo */}
      <main className="pt-16 flex-1">
        <Outlet />
      </main>

      {/* Footer (si lo necesitás en cursos) */}
      {/* <Footer /> */}
    </div>
  );
};

export default BlogsLayout;
