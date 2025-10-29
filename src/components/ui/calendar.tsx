import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(props.month || new Date());

  const years = Array.from({ length: 100 }, (_, i) => 1975 + i); // años 1975–2074
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const defaultClassNames = {
    months: "relative flex flex-col sm:flex-row gap-4",
    month: "w-full",
    month_caption:
      "relative mx-10 mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 z-20",
    caption_label: "text-sm font-medium",
    nav: "absolute top-0 flex w-full justify-between z-10",
    button_previous: cn(
      buttonVariants({ variant: "ghost" }),
      "size-9 text-muted-foreground/80 hover:text-foreground p-0"
    ),
    button_next: cn(
      buttonVariants({ variant: "ghost" }),
      "size-9 text-muted-foreground/80 hover:text-foreground p-0"
    ),
    weekday: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
    day_button:
      "relative flex size-9 items-center justify-center whitespace-nowrap rounded-lg p-0 text-foreground hover:bg-accent hover:text-foreground group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground",
    day: "group size-9 px-0 text-sm",
    today:
      "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary",
    hidden: "invisible",
  };

  const mergedClassNames = { ...defaultClassNames, ...classNames };

  const defaultComponents = {
    Chevron: (props: any) => {
      if (props.orientation === "left")
        return <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />;
      return <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />;
    },
  };

  const mergedComponents = { ...defaultComponents, ...userComponents };

  return (
    <div className="relative">
      <div className="flex justify-center gap-2 my-2">
        <select
          className="border border-border rounded-md px-2 py-1 text-sm bg-background"
          value={month.getMonth()}
          onChange={(e) => {
            const newMonth = new Date(month);
            newMonth.setMonth(Number(e.target.value));
            setMonth(newMonth);
          }}
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="border border-border rounded-md px-2 py-1 text-sm bg-background"
          value={month.getFullYear()}
          onChange={(e) => {
            const newMonth = new Date(month);
            newMonth.setFullYear(Number(e.target.value));
            setMonth(newMonth);
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <DayPicker
        {...props}
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className={cn("w-fit", className)}
        classNames={mergedClassNames}
        components={mergedComponents}
      />
    </div>
  );
}
