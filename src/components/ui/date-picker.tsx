import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";

interface DateTimePickerProps {
  showTime?: boolean;
  value?: Date | null; // 👈 ahora recibe Date | null
  onChange?: (val: Date | null) => void; // 👈 devuelve Date | null
}

export default function DateTimePicker({
  showTime = false,
  value,
  onChange,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value || null);
  const [hour, setHour] = React.useState("00");
  const [minute, setMinute] = React.useState("00");
  const [ampm, setAmpm] = React.useState("AM");

  React.useEffect(() => {
    setDate(value || null);
  }, [value]);

  const handleDateChange = (d: Date | undefined) => {
    if (!d) {
      setDate(null);
      onChange?.(null);
      return;
    }

    const newDate = new Date(d);
    if (!showTime) {
      newDate.setHours(0, 0, 0, 0);
    } else {
      let h = parseInt(hour);
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      newDate.setHours(h, parseInt(minute), 0, 0);
    }

    setDate(newDate);
    onChange?.(newDate);
  };

  React.useEffect(() => {
    if (date && showTime) handleDateChange(date);
  }, [hour, minute, ampm]);

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de fecha */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Selector de hora */}
      {showTime && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Select value={hour} onValueChange={setHour}>
            <SelectTrigger className="w-[62px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const h = i + 1;
                return (
                  <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                    {h.toString().padStart(2, "0")}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select value={minute} onValueChange={setMinute}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["00", "15", "30", "45"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ampm} onValueChange={setAmpm}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Resultado */}
      {/* <p className="text-sm text-muted-foreground">
        Seleccionado:{" "}
        {date
          ? format(date, showTime ? "PPP p" : "PPP")
          : "Ninguna fecha seleccionada"}
      </p> */}
    </div>
  );
}
