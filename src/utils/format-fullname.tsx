export function formatFullName(
  firstName?: string | null,
  lastName?: string | null,
) {
  return (
    `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Instructor disponible"
  );
}
