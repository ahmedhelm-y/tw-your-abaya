// Field builders for twilight-bundle.json, in the shapes the Salla landing editor saves.

export const L = (ar, en) => ({ ar, en });

export const text = (id, label, value, o = {}) => ({ id, type: "string", format: "text", label, icon: o.icon || "sicon-format-text-alt", multilanguage: o.multilang !== false, required: false, placeholder: o.placeholder || null, description: o.desc || null, minLength: 0, maxLength: o.max || 200, value });
export const area = (id, label, value, o = {}) => ({ id, type: "string", format: "textarea", label, icon: "sicon-paragraph", multilanguage: o.multilang !== false, required: false, description: o.desc || null, maxLength: o.max || 1000, rows: 3, value });
export const color = (id, label, value, desc = null) => ({ id, type: "string", format: "color", inputType: "color", label, icon: "sicon-format-fill", required: false, description: desc, value });
export const sw = (id, label, value, desc = null) => ({ id, type: "boolean", format: "switch", label, icon: "sicon-toggle-off", required: false, description: desc, value, selected: value });
export const num = (id, label, value, min, max, desc = null) => ({ id, type: "number", format: "number", inputType: "number", label, icon: "sicon-calculator", required: false, description: desc, minimum: min, maximum: max, value });
export const image = (id, label, value, desc = null) => ({ id, type: "string", format: "image", label, icon: "sicon-image", required: false, description: desc, value });
export const url = (id, label, value, desc = null) => ({ id, type: "string", format: "url", label, icon: "sicon-link", required: false, description: desc, value });
export const datetime = (id, label, value, desc = null) => ({ id, type: "string", format: "datetime", inputType: "datetime-local", label, icon: "sicon-calendar-time", required: false, description: desc, value });
export const icon = (id, label, value) => ({ id, type: "string", format: "icon", label, icon: "sicon-star2", required: false, class: "form--inline", value });
export const opt = (value, label) => ({ label, value, key: value });
export const drop = (id, label, options, selected, desc = null) => {
  const opts = options.map(([v, l]) => opt(v, l));
  const chosen = opts.find((o) => o.value === selected);
  return { id, type: "items", format: "dropdown-list", source: "Manual", label, icon: "sicon-list", required: false, description: desc, options: opts, selected: [chosen], value: [chosen] };
};
export const checks = (id, label, options, selected = [], desc = null) => {
  const opts = options.map(([v, l]) => opt(v, l));
  const chosen = opts.filter((o) => selected.includes(o.value));
  return { id, type: "items", format: "checkbox-list", label, icon: "sicon-list", required: false, multichoice: true, description: desc, options: opts, selected: chosen, value: chosen };
};
export const products = (id, label, desc, multichoice = false) => ({ id, type: "items", format: "dropdown-list", source: "products", label, icon: "sicon-box", placeholder: "البحث في قائمة المنتجات...", required: false, description: desc, options: [], selected: [], value: [], searchable: true, multichoice });
export const collection = (id, itemLabel, fields, value, min, max) => ({ id, type: "collection", format: "collection", required: min > 0, minLength: min, maxLength: max, item_label: itemLabel, fields: fields.map((f) => ({ ...f, id: `${id}.${f.id}` })), value: value.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [`${id}.${k}`, v]))) });

/** A divider; with a label it becomes a small heading for the fields under it. */
export const line = (id, label) =>
  label ? { id, type: "static", format: "description", value: `<strong>${label}</strong>` } : { id, type: "static", format: "line" };

/** Title, subtitle and the anchor id the header's links scroll to. */
export const sectionBase = (title = L("", ""), subtitle = L("", ""), sectionId = "") => [
  text("title", "العنوان", title),
  text("subtitle", "الوصف", subtitle),
  text("section_id", "معرّف القسم (للروابط)", sectionId, { multilang: false, desc: "كلمة إنجليزية بدون مسافات مثل notes، واكتبها في روابط رأس الصفحة لتنتقل لهذا القسم" }),
];

const COLOR_TOKENS = [
  ["bg", "الخلفية"],
  ["card", "خلفية البطاقات"],
  ["title", "العناوين"],
  ["text", "النصوص"],
  ["accent", "الأزرار والتمييز"],
];

/** Light and dark colors (l_*, d_*) and the color scheme; empty colors follow the page palette. */
export const colorFields = (o = {}) => [
  line("clr-line-l", "ألوان الوضع الفاتح"),
  ...COLOR_TOKENS.map(([token, label]) => color(`l_${token}`, label, "", token === "bg" ? "اتركها فارغة لتتبع ألوان الصفحة، والنصوص تُضبط تلقائياً لتكون واضحة" : null)),
  line("clr-line-d", "ألوان الوضع الداكن"),
  ...COLOR_TOKENS.map(([token, label]) => color(`d_${token}`, label, "")),
  ...(o.scheme === false
    ? []
    : [drop("color_scheme", "وضع الألوان", [["auto", "حسب وضع الصفحة"], ["light", "فاتح دائماً"], ["dark", "داكن دائماً"]], "auto", "حسب وضع الصفحة يتبع زر الوضع في رأس الصفحة، أو جهاز الزائر إذا لم تستخدم رأس الصفحة")]),
];
