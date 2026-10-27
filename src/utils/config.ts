export type ComponentConfig = Record<string, any>;

/** Normalizes config from demo (flat) or theme API ({ component: {...} }). */
export function getConfig(raw?: ComponentConfig | null): ComponentConfig {
  if (!raw) return {};
  if (raw.component && typeof raw.component === "object") return raw.component;
  return raw;
}

export function getLocale(): string {
  return (window as any).Salla?.lang?.getLocale?.() || document.documentElement.lang || "ar";
}

export function isRtl(): boolean {
  return (document.documentElement.dir || (getLocale() === "ar" ? "rtl" : "ltr")) === "rtl";
}

/** Resolves a multilingual value ({ ar, en } or plain string): the active locale first, then the other one. */
export function resolveText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, string>;
    const locale = getLocale() === "en" ? "en" : "ar";
    return obj[locale] || obj[locale === "en" ? "ar" : "en"] || "";
  }
  return String(value);
}

/** Built-in UI strings that are not merchant configurable. */
export function t(strings: { ar: string; en: string }): string {
  return getLocale() === "ar" ? strings.ar : strings.en;
}

/** Unwraps dropdown/radio values that arrive as [{ value }], { value } or a plain value. */
export function unwrapValue(value: any): any {
  if (Array.isArray(value)) return value[0]?.value ?? value[0] ?? "";
  if (value && typeof value === "object" && "value" in value) return value.value;
  return value ?? "";
}

/** Returns collection items with the "{prefix}." part stripped from field keys. */
export function getCollectionItems<T extends Record<string, any>>(items: unknown, prefix: string): T[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (!item || typeof item !== "object") return {} as T;
    const normalized: Record<string, any> = {};
    for (const [key, val] of Object.entries(item)) {
      normalized[key.startsWith(`${prefix}.`) ? key.slice(prefix.length + 1) : key] = val;
    }
    return normalized as T;
  });
}

/** A section id typed by the merchant, with any leading "#" and spaces removed. */
export function anchorId(value: unknown): string {
  return String(value ?? "").trim().replace(/^#+/, "").trim();
}

/** A link safe to open: web, mail or phone; a bare domain gets https; anything else (script links) is dropped. */
export function webUrl(value: unknown): string {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "";
  return /^[\w-]+(\.[\w-]+)+/.test(url) ? `https://${url}` : "";
}
