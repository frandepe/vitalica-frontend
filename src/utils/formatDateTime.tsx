export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};
