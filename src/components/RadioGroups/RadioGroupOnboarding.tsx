import { cn } from "@/utils/cn";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-3", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    emoji: React.ReactNode; // <--- cambio aquí
    title: string;
    description?: string;
  }
>(({ className, emoji, title, description, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full items-center gap-3 rounded-lg border p-3 text-left shadow-sm transition-all cursor-pointer",
      "hover:shadow-md hover:bg-muted/50",
      "focus-visible:outline focus-visible:outline-ring/70",
      "data-[state=checked]:border-gray-400 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="text-2xl">{emoji}</span>
    <div className="flex flex-col">
      <span className="font-medium">{title}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </div>
  </RadioGroupPrimitive.Item>
));

RadioCard.displayName = "RadioCard";

export { RadioGroup, RadioCard };
