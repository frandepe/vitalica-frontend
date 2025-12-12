import { Temporal } from "@js-temporal/polyfill";

type UseFormattedDateOptions = {
  showTime?: boolean;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

export function useFormattedDate(
  dateInput: string | Date,
  {
    showTime = true,
    locale = "es-ES",
    formatOptions,
  }: UseFormattedDateOptions = {}
) {
  try {
    // Convertir cualquier entrada a string ISO
    const isoString =
      dateInput instanceof Date ? dateInput.toISOString() : dateInput;

    // Zona horaria del usuario
    const timeZone = Temporal.Now.timeZoneId();

    // Convertir ISO → Instant → ZonedDateTime
    const zonedDate =
      Temporal.Instant.from(isoString).toZonedDateTimeISO(timeZone);

    // Configuración del formato
    const baseOptions: Intl.DateTimeFormatOptions = showTime
      ? { dateStyle: "medium", timeStyle: "short" }
      : { dateStyle: "medium" };

    return zonedDate.toLocaleString(locale, {
      ...baseOptions,
      ...formatOptions,
    });
  } catch (error) {
    console.error("Invalid date format:", dateInput);
    return "";
  }
}

// 💡 Ejemplos de uso:

// 📅 Mostrar fecha + hora:

// const formatted = useFormattedDate(project.createdAt);
// // → "6 nov 2025, 12:27"

// 📆 Solo fecha:

// const formatted = useFormattedDate(project.createdAt, { showTime: false });
// // → "6 nov 2025"

// 🌍 Cambiar idioma o formato:

// const formatted = useFormattedDate(project.createdAt, {
//   locale: "en-US",
//   showTime: true,
//   formatOptions: { dateStyle: "long" },
// });
