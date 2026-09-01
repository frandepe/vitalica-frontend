export function formatDuration(duration?: number | string): string {
  const value = Number(duration);

  if (!Number.isFinite(value)) return "--:--";

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
// Usage example:
// const formattedDuration = formatDuration(duration);
// console.log(formattedDuration); // e.g., "5:30" for 330 seconds
