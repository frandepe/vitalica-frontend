export function formatLocation(city?: string | null, state?: string | null) {
  return [city, state].filter(Boolean).join(", ") || "Ubicacion no informada";
}
