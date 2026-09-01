import { TooltipIconButton } from "@/components/TooltipIconButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { Award } from "lucide-react";

type FoundingInstructorBadgeProps = {
  compact?: boolean;
  className?: string;
};

export function FoundingInstructorBadge({
  compact = false,
  className,
}: FoundingInstructorBadgeProps) {
  const tooltip = "Miembro fundador de Vitalica";

  if (compact) {
    return (
      <TooltipIconButton
        tooltip={tooltip}
        side="top"
        className={cn(
          "size-5 rounded-full p-0 text-amber-600 hover:bg-transparent hover:text-amber-600",
          className,
        )}
      >
        <Award className="h-4 w-4" />
      </TooltipIconButton>
    );
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <Badge
        variant="warning"
        size="md"
        className="gap-2 rounded-full px-3 py-1"
      >
        <TooltipIconButton
          tooltip={tooltip}
          side="top"
          className="size-7 rounded-full p-0 text-black"
        >
          <Award />
        </TooltipIconButton>
        Miembro fundador
      </Badge>
    </div>
  );
}
