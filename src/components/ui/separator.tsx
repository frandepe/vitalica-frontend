interface SeparatorProps {
  className?: string;
  /** Define si el separador es horizontal (default) o vertical */
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  className = "",
  orientation = "horizontal",
}: SeparatorProps) {
  return orientation === "vertical" ? (
    <div
      className={`mx-1 my-0 w-px h-full bg-border ${className}`}
      role="separator"
    />
  ) : (
    <div
      className={`mx-0 my-1 h-px w-full bg-border ${className}`}
      role="separator"
    />
  );
}
