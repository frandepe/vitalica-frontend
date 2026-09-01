/**
 * Parse seguro de números positivos
 */

const parsePositiveInt = (
  value: string | null,
  defaultValue: number,
): number => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return defaultValue;
  return Math.floor(n);
};

export { parsePositiveInt };
