const f = "٠١٢٣٤٥٦٧٨٩";
function u(n) {
  return String(n ?? "").replace(/[٠-٩]/g, (e) => String(f.indexOf(e))).replace(/\s+/g, "").toLowerCase();
}
const l = {
  size: /مقاس|size/i,
  length: /طول|length/i,
  color: /لون|الوان|ألوان|colou?r/i
}, m = /اسود|أسود|ابيض|أبيض|بيج|بني|رمادي|كحلي|ازرق|أزرق|اخضر|أخضر|زيتي|عنابي|نبيتي|احمر|أحمر|وردي|زهري|فوشي|موف|بنفسجي|ليلكي|ذهبي|فضي|نود|كريمي|black|white|beige|brown|grey|gray|navy|blue|green|olive|maroon|burgundy|red|pink|fuchsia|purple|lilac|gold|silver|nude|cream/i, g = /^(\d{2}\s*-\s*)?(xxs|xs|s|m|l|xl|xxl|xxxl|\dxl)(\s*-\s*\d{2})?$|free\s*size|فري\s*سايز|مقاس\s*واحد/i;
function c(n) {
  const e = ((n == null ? void 0 : n.details) || []).map((t) => u(t == null ? void 0 : t.name));
  if (!e.length) return null;
  const i = (t) => e.filter(t).length / e.length;
  if ((n == null ? void 0 : n.type) === "color" || i((t) => m.test(t)) >= 0.5) return "color";
  if (i((t) => g.test(t)) >= 0.5) return "size";
  const r = e.map((t) => /^\d{2}(\.\d)?(in|inch|انش|إنش|بوصة|")?$/.test(t) ? parseFloat(t) : NaN);
  return r.every((t) => t >= 48 && t <= 66) ? "length" : r.every((t) => t >= 30 && t <= 47) ? "size" : null;
}
function o(n, e) {
  const i = ((n == null ? void 0 : n.options) || []).filter((a) => ((a == null ? void 0 : a.details) || []).length), r = i.find((a) => c(a) === e);
  if (r) return r;
  const t = i.filter((a) => c(a) === null), s = t.find((a) => l[e].test(String((a == null ? void 0 : a.name) || "")) && !(e === "size" && l.length.test(String((a == null ? void 0 : a.name) || ""))));
  return s || e === "size" && t.find((a) => (a == null ? void 0 : a.required) && (a == null ? void 0 : a.type) === "single-option" && !l.length.test(a.name) && !l.color.test(a.name)) || null;
}
function b(n, e) {
  const i = u(e);
  if (!n || !i) return null;
  const r = /^\d+$/.test(i);
  return n.details.find(
    (t) => r ? (u(t.name).match(/\d+/g) ?? []).includes(i) : u(t.name).includes(i)
  ) || null;
}
function y(n, e, i = !1) {
  const r = Number(n);
  if (!e.length || !(r >= 100 && r <= 230)) return -1;
  let t = e.findIndex((s) => r >= Number(s.min) && r <= Number(s.max));
  return t < 0 && (t = r < Number(e[0].min) ? 0 : e.length - 1), i ? Math.min(t + 1, e.length - 1) : t;
}
function S(n, e) {
  const i = Number(e == null ? void 0 : e.quantity);
  if (e && e.quantity !== null && e.quantity !== void 0 && Number.isFinite(i) && i >= 0) return i;
  const r = Number(n == null ? void 0 : n.quantity);
  return n != null && n.can_show_remained_quantity && !(n != null && n.is_hidden_quantity) && Number.isFinite(r) && r >= 0 ? r : null;
}
function w(n, e) {
  return n !== null && n > 0 && n <= Math.max(1, e) ? n : null;
}
function x(n) {
  const e = n.map(String).filter((t) => t === "small" || t === "true" || t === "large"), i = e.length, r = { small: 0, true: 0, large: 0 };
  for (const t of e) r[t]++;
  return { ...r, count: i, truePercent: i ? Math.round(r.true / i * 100) : 0 };
}
function N(n) {
  const e = Number(n);
  return e >= 100 && e <= 230 ? e < 155 ? "short" : e <= 165 ? "mid" : "tall" : null;
}
const h = [
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
  [/ذهبي|gold/i, "#c9a54a"]
];
function _(n, e) {
  var t;
  const i = String(e || "").trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(i)) return i;
  const r = String(n || "");
  return ((t = h.find(([s]) => s.test(r))) == null ? void 0 : t[1]) || "#bdb6ad";
}
function $(n) {
  window.__abyFit = n, window.dispatchEvent(new CustomEvent("aby:fit", { detail: n }));
}
function z(n) {
  const e = window.__abyFit;
  return e && n && e.productId === n ? e.options : {};
}
function k(n, e = "", i = "") {
  const r = n.filter((t) => t.value.trim()).map((t) => `${t.label}: ${t.value.trim()}${t.unit ? ` ${t.unit}` : ""}`);
  return e.trim() && r.push(e.trim()), [i, ...r].filter(Boolean).join(`
`);
}
function L(n, e) {
  let i = String(n ?? "").replace(/[٠-٩]/g, (r) => String(f.indexOf(r))).replace(/\D/g, "");
  return i.startsWith("00") && (i = i.slice(2)), i.startsWith("05") && i.length === 10 && (i = `966${i.slice(1)}`), i.length < 9 ? "" : `https://wa.me/${i}?text=${encodeURIComponent(e)}`;
}
const d = {
  size: { ar: "المقاس", en: "Size" },
  length: { ar: "الطول", en: "Length" },
  color: { ar: "اللون", en: "Color" }
};
function q(n, e) {
  const i = c(n);
  return i ? d[i][e === "en" ? "en" : "ar"] : String((n == null ? void 0 : n.name) || "");
}
export {
  b as a,
  $ as b,
  S as c,
  _ as d,
  x as e,
  o as f,
  N as h,
  w as l,
  k as m,
  q as o,
  y as r,
  z as s,
  L as w
};
