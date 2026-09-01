import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { CourseLevelLabels } from "@/constants";
import type { CourseLevel } from "@/types/course.types";
import {
  CourseSearchFilters,
  DurationFilter,
  PriceFilter,
  RatingFilter,
} from "@/utils/search-filters";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseFiltersPanelProps {
  open: boolean;
  appliedFilters: CourseSearchFilters;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: CourseSearchFilters) => void;
  onClear: () => void;
}

const ratingOptions: Array<{ value: RatingFilter; label: string }> = [
  { value: "4.5", label: "4,5 o más" },
  { value: "4", label: "4,0 o más" },
  { value: "3.5", label: "3,5 o más" },
  { value: "3", label: "3,0 o más" },
];

const durationOptions: Array<{ value: DurationFilter; label: string }> = [
  { value: "short", label: "Hasta 3 horas" },
  { value: "medium", label: "Más de 3 y hasta 5 horas" },
  { value: "long", label: "Más de 5 horas" },
];

const levelOptions = Object.entries(CourseLevelLabels) as Array<
  [CourseLevel, string]
>;

const toggleValue = <T extends string>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

const cloneFilters = (filters: CourseSearchFilters): CourseSearchFilters => ({
  ...filters,
  levels: [...filters.levels],
  prices: [...filters.prices],
});

export function CourseFiltersPanel({
  open,
  appliedFilters,
  onOpenChange,
  onApply,
  onClear,
}: CourseFiltersPanelProps) {
  const [draft, setDraft] = useState<CourseSearchFilters>(() =>
    cloneFilters(appliedFilters),
  );

  useEffect(() => {
    if (open) setDraft(cloneFilters(appliedFilters));
  }, [open, appliedFilters]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        side="right"
        className="
    flex h-[100dvh] w-full max-w-none flex-col
    rounded-none border-none
    shadow-[-12px_0_30px_-12px_rgba(0,0,0,0.18)]
    p-0
    data-[state=open]:duration-300
    data-[state=closed]:duration-200
    sm:w-[26rem] sm:max-w-[90vw]
    lg:left-auto lg:right-0 lg:top-0 lg:flex
    lg:h-[100dvh] lg:w-[28rem] lg:max-w-[90vw]
    lg:translate-x-0 lg:translate-y-0 lg:rounded-none
  "
      >
        <ModalHeader className="shrink-0 border-b px-6 py-5 pr-14 text-left">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Explorar cursos
            </span>
          </div>
          <ModalTitle className="text-xl">Todos los filtros</ModalTitle>
          <ModalDescription>
            Ajustá los criterios y aplicalos cuando estés listo.
          </ModalDescription>
        </ModalHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
          <FilterGroup title="Valoración">
            <RadioOptions
              name="rating"
              value={draft.rating}
              options={ratingOptions}
              onChange={(rating) =>
                setDraft((current) => ({ ...current, rating }))
              }
            />
          </FilterGroup>

          <Separator />

          <FilterGroup title="Duración del curso">
            <RadioOptions
              name="duration"
              value={draft.duration}
              options={durationOptions}
              onChange={(duration) =>
                setDraft((current) => ({ ...current, duration }))
              }
            />
          </FilterGroup>

          <Separator />

          <FilterGroup title="Nivel">
            <div className="space-y-3">
              {levelOptions.map(([value, label]) => (
                <CheckboxOption
                  key={value}
                  checked={draft.levels.includes(value)}
                  label={label}
                  onCheckedChange={() =>
                    setDraft((current) => ({
                      ...current,
                      levels: toggleValue(current.levels, value),
                    }))
                  }
                />
              ))}
            </div>
          </FilterGroup>

          <Separator />

          <FilterGroup title="Precio">
            <div className="space-y-3">
              {(
                [
                  ["free", "Gratuito"],
                  ["paid", "De pago"],
                ] as Array<[PriceFilter, string]>
              ).map(([value, label]) => (
                <CheckboxOption
                  key={value}
                  checked={draft.prices.includes(value)}
                  label={label}
                  onCheckedChange={() =>
                    setDraft((current) => ({
                      ...current,
                      prices: toggleValue(current.prices, value),
                    }))
                  }
                />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Seleccionar ambas opciones muestra todos los precios.
            </p>
          </FilterGroup>
        </div>

        <div className="shrink-0 border-t bg-background/95 p-4 backdrop-blur sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="active:scale-[0.98] transition-transform"
              onClick={onClear}
            >
              Limpiar filtros
            </Button>
            <Button
              type="button"
              className="active:scale-[0.98] transition-transform"
              onClick={() => onApply(draft)}
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="py-5">
      <legend className="mb-4 text-sm font-semibold text-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function RadioOptions<T extends RatingFilter | DurationFilter>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 accent-primary"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxOption({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: () => void;
}) {
  const id = `course-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <span>{label}</span>
    </label>
  );
}
