import DropdownMenuProfile from "@/components/user/DropdownMenuProfile";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { useNavigate } from "react-router-dom";

export function NavbarBlogs() {
  const showNavbar = useHideOnScroll(50);
  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 left-0 z-40 w-full bg-background transition-transform duration-300 ${
        showNavbar ? "translate-y-0 shadow-sm" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto h-16 flex justify-between items-center">
        {/* LOGO */}
        <img
          src="/Logo/logoVitalica_beta.png"
          alt="Logotipo de Vitalica"
          width={120}
          height={80}
          onClick={() => navigate("/")}
          className="cursor-pointer select-none md:ml-0 ml-14"
        />
        {/* USER AREA */}
        <div className="md:mr-0 mr-6">
          <DropdownMenuProfile />
        </div>
      </div>
    </header>
  );
}
