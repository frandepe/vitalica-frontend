import { SpecialtyLabels } from "@/constants";
import type { CourseLevel, ISpecialty } from "@/types/course.types";

export type RatingFilter = "" | "3" | "3.5" | "4" | "4.5";
export type DurationFilter = "" | "short" | "medium" | "long";
export type PriceFilter = "free" | "paid";

export interface CourseSearchFilters {
  rating: RatingFilter;
  duration: DurationFilter;
  levels: CourseLevel[];
  prices: PriceFilter[];
}

export const EMPTY_COURSE_SEARCH_FILTERS: CourseSearchFilters = {
  rating: "",
  duration: "",
  levels: [],
  prices: [],
};

const RATINGS = new Set<RatingFilter>(["3", "3.5", "4", "4.5"]);
const DURATIONS = new Set<DurationFilter>(["short", "medium", "long"]);
const LEVELS = new Set<CourseLevel>(["BASIC", "INTERMEDIATE", "ADVANCED"]);
const PRICES = new Set<PriceFilter>(["free", "paid"]);
const SPECIALTIES = new Set<ISpecialty>(
  Object.keys(SpecialtyLabels) as ISpecialty[],
);

const getValues = (params: URLSearchParams, key: string) =>
  params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

export const parseCourseSearchFilters = (
  params: URLSearchParams,
): CourseSearchFilters => {
  const rating = getValues(params, "rating").find((value) =>
    RATINGS.has(value as RatingFilter),
  ) as RatingFilter | undefined;
  const duration = getValues(params, "duration").find((value) =>
    DURATIONS.has(value as DurationFilter),
  ) as DurationFilter | undefined;

  return {
    rating: rating ?? "",
    duration: duration ?? "",
    levels: Array.from(
      new Set(
        getValues(params, "level").filter((value): value is CourseLevel =>
          LEVELS.has(value as CourseLevel),
        ),
      ),
    ),
    prices: Array.from(
      new Set(
        getValues(params, "price").filter((value): value is PriceFilter =>
          PRICES.has(value as PriceFilter),
        ),
      ),
    ),
  };
};

export const writeCourseSearchFilters = (
  params: URLSearchParams,
  filters: CourseSearchFilters,
) => {
  const next = new URLSearchParams(params);

  if (filters.rating) next.set("rating", filters.rating);
  else next.delete("rating");

  if (filters.duration) next.set("duration", filters.duration);
  else next.delete("duration");

  if (filters.levels.length > 0) {
    next.set("level", filters.levels.join(","));
  } else {
    next.delete("level");
  }

  if (filters.prices.length === 1) {
    next.set("price", filters.prices[0]);
  } else {
    next.delete("price");
  }

  next.set("page", "1");
  return next;
};

export const countActiveCourseSearchFilters = (
  filters: CourseSearchFilters,
) =>
  Number(Boolean(filters.rating)) +
  Number(Boolean(filters.duration)) +
  filters.levels.length +
  Number(filters.prices.length === 1);

export const parseCourseSpecialty = (params: URLSearchParams) => {
  const specialty = getValues(params, "specialty").find((value) =>
    SPECIALTIES.has(value as ISpecialty),
  );
  return (specialty as ISpecialty | undefined) ?? "";
};

export const writeCourseSpecialty = (
  params: URLSearchParams,
  specialty: ISpecialty | "",
) => {
  const next = new URLSearchParams(params);
  if (specialty) {
    next.set("specialty", specialty);
    next.delete("search");
  } else {
    next.delete("specialty");
  }
  next.set("page", "1");
  return next;
};
