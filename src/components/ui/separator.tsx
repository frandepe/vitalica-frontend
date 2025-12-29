interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  className = "",
  orientation = "horizontal",
}: SeparatorProps) {
  return orientation === "vertical" ? (
    <div
      role="separator"
      className={`w-px self-stretch bg-border ${className}`}
    />
  ) : (
    <div
      className={`mx-0 my-1 h-px w-full bg-border ${className}`}
      role="separator"
    />
  );
}
