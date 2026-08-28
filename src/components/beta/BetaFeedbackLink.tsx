import { MessageSquareText } from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

type BetaFeedbackLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export function BetaFeedbackLink({
  className,
  children = "Enviar feedback",
}: BetaFeedbackLinkProps) {
  const location = useLocation();
  const originPath = `${location.pathname}${location.search}`;

  return (
    <Link
      to={`/beta/feedback?from=${encodeURIComponent(originPath)}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-primary/25 bg-background px-4 py-2 text-sm font-medium text-primary outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <MessageSquareText className="h-4 w-4" />
      {children}
    </Link>
  );
}
