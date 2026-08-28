import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ScrollToTop } from "@/utils/scroll-top";
import { Footer } from "./Footer";
import { BetaNavbarBar } from "@/components/beta/BetaNavbarBar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Scroll global al cambiar de ruta */}
      <ScrollToTop />

      {/* Header */}
      <header className="bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Navbar />
          </div>
        </div>
        <BetaNavbarBar />
        <div className="h-10" aria-hidden />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
