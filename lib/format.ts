export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Parses a user-typed amount field, rejecting empty/non-numeric/zero/negative
// input rather than letting a stray `NaN` or 0 slip into a store — used by
// every form that collects a positive amount (transactions, goals, goal
// contributions, body weight, etc).
export function parsePositiveAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parseFloat(trimmed);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}
