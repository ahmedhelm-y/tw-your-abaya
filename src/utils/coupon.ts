/** Reads "2026-12-01 18:30" (the editor's format) or ISO; anything else is null. */
export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const text = value.trim().replace(/^(\d{4}-\d{2}-\d{2})\s+/, "$1T");
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** A coupon without a readable end date never expires. */
export function isExpired(value: unknown, now: Date = new Date()): boolean {
  const end = parseDate(value);
  return end !== null && end.getTime() <= now.getTime();
}

export function revealedKey(code: string): string {
  return `aby-coupon:${code}`;
}
