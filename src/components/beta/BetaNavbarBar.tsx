import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { BetaGlobalBar } from "./BetaGlobalBar";

export function BetaNavbarBar() {
  const showNavbar = useHideOnScroll(50);

  return (
    <div
      className={`fixed left-0 top-0 z-30 w-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
        showNavbar ? "translate-y-16" : "translate-y-0"
      }`}
    >
      <BetaGlobalBar />
    </div>
  );
}
