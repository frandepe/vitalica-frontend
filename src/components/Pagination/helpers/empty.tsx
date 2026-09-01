import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl  border border-foreground/50">
      <BookOpen className="h-7 w-7 text-foreground/65" />
    </div>
    <h3 className="text-lg font-semibold text-foreground/65 mb-2">
      {hasSearch ? "Sin resultados" : "Todavía no tenés cursos"}
    </h3>
    <p className="text-sm text-foreground/65 max-w-xs">
      {hasSearch ? (
        "No encontramos cursos que coincidan con tu búsqueda. Intentá con otro término."
      ) : (
        <>
          <Link
            to="/buscar?search=&page=1&limit=10"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Explorá el catálogo
          </Link>{" "}
          y empezá a aprender hoy.
        </>
      )}
    </p>
  </div>
);
