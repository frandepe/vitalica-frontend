interface SeparatorProps {
  className?: string;
}

export function Separator({ className = "" }: SeparatorProps) {
  return (
    <div className={`mx-1 my-1 h-px bg-border ${className}`} role="separator" />
  );
}
