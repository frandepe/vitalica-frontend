export function formatPrice(value?: number | string, locale = "es-AR") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat(locale).format(number);
}
