import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { getPageNumbers } from "./helpers/get-page-numbers";

interface DotsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export const DotsPagination = ({
  page,
  totalPages,
  onPageChange,
}: DotsPaginationProps) => {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-12 flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 w-9 rounded-lg text-foreground/50 hover:text-zinc-100 hover:bg-foreground/90
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-zinc-600 text-sm select-none"
          >
            ···
          </span>
        ) : (
          <Button
            key={p}
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(p as number)}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
              page === p
                ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                : "text-foreground/50 hover:text-zinc-100 hover:bg-foreground/90"
            }`}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 w-9 rounded-lg text-foreground/50 hover:text-zinc-100 hover:bg-foreground/90
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
