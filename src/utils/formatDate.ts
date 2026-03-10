import { formatInTimeZone } from "date-fns-tz";
import { es, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

type FormatDateOptions = {
  showTime?: boolean;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

const localeMap: Record<string, Locale> = {
  "es-ES": es,
  es,
  "en-US": enUS,
  en: enUS,
};

export function formatDate(
  dateInput: string | Date,
  {
    showTime = true,
    locale = "es-ES",
    formatOptions,
  }: FormatDateOptions = {},
) {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return "";

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateFnsLocale = localeMap[locale] ?? es;

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
