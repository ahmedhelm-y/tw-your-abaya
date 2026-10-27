import type { BuyItem } from "./buy";

export type BundleLine = { product: any; selected: boolean; quantity: number; options: Record<string, number> };

/** Ids of the product's required options that have values to choose but none chosen yet. */
export function missingOptions(line: BundleLine): number[] {
  const options: any[] = line.product?.options || [];
  return options
    .filter((o) => o?.required && (o.details || []).length && !line.options[String(o.id)])
    .map((o) => Number(o.id));
}

/** Checks the picked lines before anything reaches the cart; minCount is how many must be picked. */
export function validateLines(lines: BundleLine[], minCount = 0): { ok: boolean; missing: Record<string, number[]> } {
  const missing: Record<string, number[]> = {};
  const picked = lines.filter((l) => l.selected);
  for (const line of picked) {
    const ids = missingOptions(line);
    if (ids.length) missing[String(line.product?.id)] = ids;
  }
  return { ok: picked.length >= minCount && Object.keys(missing).length === 0, missing };
}

const price = (p: any) => Number(p?.sale_price || p?.price) || 0;

/** The extra price of every chosen option value, as the checkout will charge it. */
export function optionExtras(line: BundleLine): number {
  let sum = 0;
  for (const option of line.product?.options || []) {
    const chosen = line.options[String(option.id)];
    const value = (option.details || []).find((v: any) => Number(v.id) === Number(chosen));
    sum += Number(value?.additional_price) || 0;
  }
  return sum;
}

/** Sold out or switched off products cannot join a set. */
export function isAvailable(p: any): boolean {
  return !(p?.status === "out" || p?.is_available === false || p?.is_out_of_stock === true);
}

export function bundleTotal(lines: BundleLine[]): { total: number; regular: number; count: number } {
  const picked = lines.filter((l) => l.selected);
  return {
    total: picked.reduce((sum, l) => sum + (price(l.product) + optionExtras(l)) * l.quantity, 0),
    regular: picked.reduce((sum, l) => sum + (Math.max(Number(l.product?.regular_price) || 0, price(l.product)) + optionExtras(l)) * l.quantity, 0),
    count: picked.length,
  };
}

export function toItems(lines: BundleLine[]): BuyItem[] {
  return lines
    .filter((l) => l.selected)
    .map((l) => ({
      id: String(l.product?.id),
      quantity: l.quantity,
      options: Object.keys(l.options).length ? l.options : undefined,
      max: Number(l.product?.max_quantity) || undefined,
    }));
}
