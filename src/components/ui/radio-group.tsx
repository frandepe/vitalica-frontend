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

const OptionCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "relative rounded-lg border border-border py-1 px-3 transition-all cursor-pointer",
      "hover:border-primary/50",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5",
      className
    )}
    {...props}
  >
    {/* Badge SOLO cuando está seleccionada */}
    <span className="absolute top-2 right-2 hidden text-xs font-semibold text-primary data-[state=checked]:block">
      Correcta
    </span>

    {children}
  </RadioGroupPrimitive.Item>
));

OptionCard.displayName = "OptionCard";

export { RadioGroup, OptionCard };
