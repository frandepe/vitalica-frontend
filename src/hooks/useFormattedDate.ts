import { formatInTimeZone } from "date-fns-tz";
import { es, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

type UseFormattedDateOptions = {
  showTime?: boolean;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

// Map simple de locales soportados
const localeMap: Record<string, Locale> = {
  "es-ES": es,
  es: es,
  "en-US": enUS,
  en: enUS,
};

export function useFormattedDate(
  dateInput: string | Date,
  {
    showTime = true,
    locale = "es-ES",
    formatOptions,
  }: UseFormattedDateOptions = {},
) {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return "";

    // timezone del usuario
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateFnsLocale = localeMap[locale] ?? es;

    // Si el usuario manda formatOptions → usar Intl
    if (formatOptions) {
      return new Intl.DateTimeFormat(locale, formatOptions).format(date);
    }

    const pattern = showTime ? "d MMM yyyy, HH:mm" : "d MMM yyyy";

    return formatInTimeZone(date, timeZone, pattern, {
      locale: dateFnsLocale,
    });
  } catch (error) {
    console.error("Invalid date format:", dateInput);
    return "";
  }
}
// Ejemplos de uso:

// Mostrar fecha + hora:

// const formatted = useFormattedDate(project.createdAt);
// // → "6 nov 2025, 12:27"

// Solo fecha:

// const formatted = useFormattedDate(project.createdAt, { showTime: false });
// // → "6 nov 2025"

// Cambiar idioma o formato:

// const formatted = useFormattedDate(project.createdAt, {
//   locale: "en-US",
//   showTime: true,
//   formatOptions: { dateStyle: "long" },
// });
