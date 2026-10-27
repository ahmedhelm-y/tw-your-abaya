// Size, length and color options of an abaya, the length advisor, stock left and review fit.

export type OptionKind = "size" | "length" | "color";
export type LengthRow = { length: unknown; min: unknown; max: unknown };
export type Fit = "small" | "true" | "large";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Lowercase, Western digits, no spaces, so "٥٦ إنش" and "56in" compare by their digits and letters. */
export function normalize(text: unknown): string {
  return String(text ?? "")
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/\s+/g, "")
    .toLowerCase();
}

const NAMES: Record<OptionKind, RegExp> = {
  size: /مقاس|size/i,
  length: /طول|length/i,
  color: /لون|الوان|ألوان|colou?r/i,
};

const COLOR_WORDS = /اسود|أسود|ابيض|أبيض|بيج|بني|رمادي|كحلي|ازرق|أزرق|اخضر|أخضر|زيتي|عنابي|نبيتي|احمر|أحمر|وردي|زهري|فوشي|موف|بنفسجي|ليلكي|ذهبي|فضي|نود|كريمي|black|white|beige|brown|grey|gray|navy|blue|green|olive|maroon|burgundy|red|pink|fuchsia|purple|lilac|gold|silver|nude|cream/i;
const SIZE_WORDS = /^(\d{2}\s*-\s*)?(xxs|xs|s|m|l|xl|xxl|xxxl|\dxl)(\s*-\s*\d{2})?$|free\s*size|فري\s*سايز|مقاس\s*واحد/i;

/** What an option's values look like: colors, letter or EU sizes, or abaya lengths (48 to 66 inches). */
export function classify(option: any): OptionKind | null {
  const names: string[] = (option?.details || []).map((v: any) => normalize(v?.name));
  if (!names.length) return null;
  const share = (test: (n: string) => boolean) => names.filter(test).length / names.length;
  if (option?.type === "color" || share((n) => COLOR_WORDS.test(n)) >= 0.5) return "color";
  if (share((n) => SIZE_WORDS.test(n)) >= 0.5) return "size";
  const numbers = names.map((n) => (/^\d{2}(\.\d)?(in|inch|انش|إنش|بوصة|")?$/.test(n) ? parseFloat(n) : NaN));
  if (numbers.every((x) => x >= 48 && x <= 66)) return "length";
  if (numbers.every((x) => x >= 30 && x <= 47)) return "size";
  return null;
}

/**
 * The product's option of that kind. Its values decide first, because stores sometimes name an option of
 * colors "size"; the name decides only for values that say nothing, and a size falls back to the first
 * required single choice.
 */
export function findOption(product: any, kind: OptionKind): any | null {
  const options: any[] = (product?.options || []).filter((o: any) => (o?.details || []).length);
  const byValues = options.find((o) => classify(o) === kind);
  if (byValues) return byValues;
  const unknown = options.filter((o) => classify(o) === null);
  const named = unknown.find((o) => NAMES[kind].test(String(o?.name || "")) && !(kind === "size" && NAMES.length.test(String(o?.name || ""))));
  if (named) return named;
  if (kind === "size") return unknown.find((o) => o?.required && o?.type === "single-option" && !NAMES.length.test(o.name) && !NAMES.color.test(o.name)) || null;
  return null;
}

/** The option value whose name holds the text; a number matches a whole number only, so "5" never picks "56". */
export function matchValue(option: any, text: unknown): any | null {
  const wanted = normalize(text);
  if (!option || !wanted) return null;
  const numeric = /^\d+$/.test(wanted);
  return (
    (option.details as any[]).find((v) =>
      numeric ? (normalize(v.name).match(/\d+/g) ?? ([] as string[])).includes(wanted) : normalize(v.name).includes(wanted)
    ) || null
  );
}

/**
 * The row of the merchant's length table for a height in cm. With heels the shopper moves one length up.
 * A height under the table takes the first row and one over it the last, so a valid height always gets an answer.
 */
export function recommendLength(height: number, rows: LengthRow[], heels = false): number {
  const h = Number(height);
  if (!rows.length || !(h >= 100 && h <= 230)) return -1;
  let index = rows.findIndex((r) => h >= Number(r.min) && h <= Number(r.max));
  if (index < 0) index = h < Number(rows[0].min) ? 0 : rows.length - 1;
  return heels ? Math.min(index + 1, rows.length - 1) : index;
}

/**
 * Pieces left to show for a choice, or null when the store does not share it. A value's own quantity comes
 * first; the product's quantity counts only when the merchant turned on showing what remains.
 */
export function remaining(product: any, value?: any): number | null {
  const own = Number(value?.quantity);
  if (value && value.quantity !== null && value.quantity !== undefined && Number.isFinite(own) && own >= 0) return own;
  const total = Number(product?.quantity);
  if (product?.can_show_remained_quantity && !product?.is_hidden_quantity && Number.isFinite(total) && total >= 0) return total;
  return null;
}

/** "Only N left" shows for low stock only, never for sold out or plenty. */
export function lowStock(left: number | null, threshold: number): number | null {
  return left !== null && left > 0 && left <= Math.max(1, threshold) ? left : null;
}

/** How each fit was reported, and the share that said it fits. */
export function fitSummary(fits: unknown[]): { small: number; true: number; large: number; count: number; truePercent: number } {
  const valid = fits.map(String).filter((f): f is Fit => f === "small" || f === "true" || f === "large");
  const count = valid.length;
  const tally = { small: 0, true: 0, large: 0 };
  for (const f of valid) tally[f]++;
  return { ...tally, count, truePercent: count ? Math.round((tally.true / count) * 100) : 0 };
}

export type HeightBucket = "short" | "mid" | "tall";

/** Height groups for the review filter: under 155, 155 to 165, over 165. */
export function heightBucket(height: unknown): HeightBucket | null {
  const h = Number(height);
  if (!(h >= 100 && h <= 230)) return null;
  return h < 155 ? "short" : h <= 165 ? "mid" : "tall";
}

/** Color names merchants use, mapped to a swatch; anything else shows as a neutral dot with its name. */
const SWATCHES: [RegExp, string][] = [
  [/اسود|أسود|black/i, "#111111"],
  [/ابيض|أبيض|white|اوف|off/i, "#f4f1ea"],
  [/بيج|beige|نود|nude|كريمي|cream/i, "#d8c3a5"],
  [/بني|brown|كاكاو|cocoa|موكا|mocha/i, "#6b4a35"],
  [/رمادي|grey|gray/i, "#8a8a8a"],
  [/كحلي|navy/i, "#1f2a44"],
  [/ازرق|أزرق|blue/i, "#3a5ba0"],
  [/اخضر|أخضر|green|زيتي|olive/i, "#4d6b3c"],
  [/عنابي|نبيتي|maroon|burgundy/i, "#6d1f2c"],
  [/احمر|أحمر|red/i, "#b3261e"],
  [/فوشي|fuchsia|magenta/i, "#c2187a"],
  [/وردي|pink|زهري/i, "#e4a6b8"],
  [/موف|بنفسجي|purple|lilac|ليلكي/i, "#7b5a8c"],
  [/ذهبي|gold/i, "#c9a54a"],
];

export function swatchFor(name: unknown, explicit?: unknown): string {
  const own = String(explicit || "").trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(own)) return own;
  const text = String(name || "");
  return SWATCHES.find(([re]) => re.test(text))?.[1] || "#bdb6ad";
}

/** The options the shopper picked in the fit finder, shared so the tailoring form can send them too. */
export type FitPick = { productId: string; options: Record<string, number> };
export function sharePick(pick: FitPick): void {
  (window as any).__abyFit = pick;
  window.dispatchEvent(new CustomEvent("aby:fit", { detail: pick }));
}
export function sharedPick(productId: string | null): Record<string, number> {
  const pick = (window as any).__abyFit as FitPick | undefined;
  return pick && productId && pick.productId === productId ? pick.options : {};
}

/** Measurements and notes as one plain message, for the cart note or a WhatsApp chat. */
export function measurementMessage(rows: { label: string; value: string; unit?: string }[], notes = "", product = ""): string {
  const lines = rows.filter((r) => r.value.trim()).map((r) => `${r.label}: ${r.value.trim()}${r.unit ? ` ${r.unit}` : ""}`);
  if (notes.trim()) lines.push(notes.trim());
  return [product, ...lines].filter(Boolean).join("\n");
}

/** A wa.me link for a Saudi or international number; empty when the number is not usable. */
export function whatsappLink(phone: unknown, text: string): string {
  let digits = String(phone ?? "").replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d))).replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("05") && digits.length === 10) digits = `966${digits.slice(1)}`;
  if (digits.length < 9) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const KIND_LABELS: Record<OptionKind, { ar: string; en: string }> = {
  size: { ar: "المقاس", en: "Size" },
  length: { ar: "الطول", en: "Length" },
  color: { ar: "اللون", en: "Color" },
};

/** The name to show for an option: what its values are, so a mislabeled option still reads right. */
export function optionLabel(option: any, locale: string): string {
  const kind = classify(option);
  return kind ? KIND_LABELS[kind][locale === "en" ? "en" : "ar"] : String(option?.name || "");
}
