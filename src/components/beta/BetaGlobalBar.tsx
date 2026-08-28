import { ArrowRight, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

export function BetaGlobalBar() {
  return (
    <div className="border-y border-primary/15 bg-[#f4fffb] text-primary-dark shadow-[0_8px_30px_-28px_rgba(34,80,69,0.45)]">
      <Link
        to="/beta"
        className="group mx-auto flex min-h-10 w-full max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
      >
        <FlaskConical className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="hidden md:inline">
          <span className="font-semibold uppercase tracking-[0.16em]">
            Vitalica Beta
          </span>
          <span className="mx-2 text-primary-dark/45">|</span>
          Estás probando una versión previa. No hay pagos.
        </span>
        <span className="md:hidden">
          <span className="font-semibold">Vitalica Beta</span>
        </span>
        <span className="inline-flex items-center gap-1 text-primary">
          Conocé más
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
