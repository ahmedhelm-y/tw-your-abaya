function U(t) {
  return t ? t.component && typeof t.component == "object" ? t.component : t : {};
}
function I() {
  var t, e, n;
  return ((n = (e = (t = window.Salla) == null ? void 0 : t.lang) == null ? void 0 : e.getLocale) == null ? void 0 : n.call(e)) || document.documentElement.lang || "ar";
}
function G(t) {
  if (t == null || t === "") return "";
  if (typeof t == "string") return t;
  if (typeof t == "object") {
    const e = t, n = I() === "en" ? "en" : "ar";
    return e[n] || e[n === "en" ? "ar" : "en"] || "";
  }
  return String(t);
}
function Q(t) {
  return I() === "ar" ? t.ar : t.en;
}
function V(t) {
  var e;
  return Array.isArray(t) ? ((e = t[0]) == null ? void 0 : e.value) ?? t[0] ?? "" : t && typeof t == "object" && "value" in t ? t.value : t ?? "";
}
function X(t, e) {
  return Array.isArray(t) ? t.map((n) => {
    if (!n || typeof n != "object") return {};
    const o = {};
    for (const [r, a] of Object.entries(n))
      o[r.startsWith(`${e}.`) ? r.slice(e.length + 1) : r] = a;
    return o;
  }) : [];
}
function Z(t) {
  return String(t ?? "").trim().replace(/^#+/, "").trim();
}
function tt(t) {
  const e = String(t ?? "").trim();
  return e ? /^(https?:|mailto:|tel:)/i.test(e) ? e : /^[a-z][a-z0-9+.-]*:/i.test(e) ? "" : /^[\w-]+(\.[\w-]+)+/.test(e) ? `https://${e}` : "" : "";
}
function p() {
  return window.Salla;
}
function v() {
  var t, e;
  return ((e = (t = p()) == null ? void 0 : t.config) == null ? void 0 : e.get("theme.settings")) || {};
}
function _() {
  var t, e;
  return ((e = (t = p()) == null ? void 0 : t.config) == null ? void 0 : e.get("page.is_landing_page")) === !0;
}
function M() {
  var e;
  const t = v().page_for_product;
  return typeof t == "boolean" || t === void 0 || t === null ? t === !1 ? "promotion" : "product" : typeof t == "string" ? t === "promotion" ? "promotion" : "product" : Array.isArray(t) && ((e = t[0]) == null ? void 0 : e.value) === "promotion" ? "promotion" : "product";
}
function P() {
  var e, n;
  if (!_() || M() !== "product") return null;
  const t = (n = (e = v().product) == null ? void 0 : e.value) == null ? void 0 : n[0];
  return t ? String(t) : null;
}
function et() {
  const t = v();
  return { text: String(t.main_btn_text || ""), url: String(t.main_btn_url || "") };
}
const R = "1616473", E = ["images", "rating", "sold_quantity", "options"];
async function k(t, e) {
  var n;
  try {
    const o = E.map((c) => `with[]=${c}`).join("&"), a = await (await fetch(`https://api.salla.dev/store/v1/products/${t}/details?${o}`, {
      headers: { "store-identifier": e, "accept-language": document.documentElement.lang === "en" ? "en" : "ar" }
    })).json();
    return (n = a == null ? void 0 : a.data) != null && n.id ? a.data : null;
  } catch {
    return null;
  }
}
async function nt(t) {
  var o, r, a, c;
  const e = p();
  if (!t) return null;
  await ((o = e == null ? void 0 : e.onReady) == null ? void 0 : o.call(e));
  const n = String(((r = e == null ? void 0 : e.config) == null ? void 0 : r.get("store.id")) || "");
  if (_()) {
    if (String(t) !== P()) return n ? k(t, n) : null;
    try {
      const l = await ((a = e == null ? void 0 : e.product) == null ? void 0 : a.api.getDetails(t, E));
      return (c = l == null ? void 0 : l.data) != null && c.id ? l.data : null;
    } catch {
      return null;
    }
  }
  return n && await k(t, n) || k(t, R);
}
function rt() {
  const t = document.querySelector(".s-block--fast-checkout"), e = t == null ? void 0 : t.getAttribute("data-layout");
  if (window.innerWidth < 1024 || e === "side-drawer" || !t) {
    window.dispatchEvent(new CustomEvent("open-checkout-drawer"));
    return;
  }
  t.scrollIntoView({ behavior: "smooth", block: "center" });
}
function L(t, e = 20) {
  if (t <= 1) return;
  const n = document.querySelector(
    ".s-block--fast-checkout salla-quantity-input, .s-block--fast-checkout-main salla-quantity-input"
  );
  if (n != null && n.setValue) {
    n.setValue(t);
    return;
  }
  e > 0 && window.setTimeout(() => L(t, e - 1), 100);
}
function ot(t) {
  const e = p();
  return e != null && e.money ? e.money(t) : String(t);
}
const N = ["bg", "card", "title", "text", "accent"], $ = "#111111", i = "#ffffff", j = 4.5;
function m(t) {
  if (typeof t != "string") return null;
  const e = t.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(e)) return null;
  const n = e.length === 3 ? e.replace(/./g, (o) => o + o) : e;
  return [0, 2, 4].map((o) => parseInt(n.slice(o, o + 2), 16));
}
function A([t, e, n]) {
  return "#" + [t, e, n].map((o) => Math.round(o).toString(16).padStart(2, "0")).join("");
}
function h(t) {
  const e = m(t);
  return e ? A(e) : null;
}
function S(t) {
  const [e, n, o] = t.map((r) => {
    const a = r / 255;
    return a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * e + 0.7152 * n + 0.0722 * o;
}
function b(t, e) {
  const n = m(t), o = m(e);
  if (!n || !o) return 1;
  const [r, a] = [S(n), S(o)].sort((c, l) => l - c);
  return (r + 0.05) / (a + 0.05);
}
function f(t) {
  const e = b($, t) >= b(i, t) ? $ : i;
  return b(e, t) >= j ? e : "#000000";
}
function u(t, e, n) {
  const o = m(t), r = m(e);
  return A(o.map((a, c) => a + (r[c] - a) * n));
}
function s(t, e, n, o = j) {
  let r = t;
  for (let a = 0; a < 20 && e.some((c) => b(r, c) < o); a++)
    r = u(r, n, 0.05 * (a + 1));
  return e.every((a) => b(r, a) >= o) ? r : n;
}
const y = "#000000", B = (t) => t === "light" ? y : i;
function g(t, e) {
  return {
    ...t,
    accentText: f(t.accent),
    accentInk: s(t.accent, [t.bg, t.card], B(e))
  };
}
const d = {
  light: g({ bg: "#ffffff", card: "#f7f4f0", title: "#1a1714", text: "#4a4440", accent: "#8a5a2b" }, "light"),
  dark: g({ bg: "#141210", card: "#1f1b18", title: "#f5efe8", text: "#c9bfb4", accent: "#d9a46a" }, "dark")
};
function q(t) {
  const e = h(t);
  if (!e) return structuredClone(d);
  const n = u(e, i, 0.94), o = u(e, i, 0.88), r = u(e, "#000000", 0.88), a = u(e, "#000000", 0.8);
  return {
    light: g({
      bg: n,
      card: o,
      title: s(u(e, "#000000", 0.8), [n, o], "#000000"),
      text: s(u(e, "#000000", 0.65), [n, o], "#000000"),
      accent: e
    }, "light"),
    dark: g({
      bg: r,
      card: a,
      title: s(u(e, i, 0.92), [r, a], i),
      text: s(u(e, i, 0.75), [r, a], i),
      // An accent that disappears into the dark background is lifted until it stands out
      accent: s(e, [r], i, 3)
    }, "dark")
  };
}
const D = (t) => t === "accentText" ? "accent-text" : t === "accentInk" ? "accent-ink" : t;
function O(t, e) {
  const n = {};
  for (const o of ["l", "d"]) {
    const r = {};
    for (const c of N) {
      const l = h(t[`${o}_${c}`]);
      l && (r[c] = l);
    }
    const a = o === "l" ? "light" : "dark";
    if (r.bg) {
      const c = f(r.bg);
      r.card ?? (r.card = u(r.bg, c, 0.08)), r.title ?? (r.title = s(c, [r.bg, r.card], c === i ? i : y)), r.text ?? (r.text = s(c, [r.bg, r.card], c === i ? i : y));
    }
    if (r.accent) {
      r["accent-text"] = f(r.accent);
      const c = [r.bg || d[a].bg, r.card || d[a].card];
      r["accent-ink"] = s(r.accent, c, f(c[0]) === i ? i : y);
    }
    for (const [c, l] of Object.entries(r)) n[`${e}${o}-${c}`] = l;
  }
  return n;
}
function at(t) {
  const e = {};
  if (h(t.brand_color)) {
    const n = q(t.brand_color);
    for (const [o, r] of [["light", "l"], ["dark", "d"]])
      for (const [a, c] of Object.entries(n[o])) e[`--aby-${r}-${D(a)}`] = c;
  }
  return { ...e, ...O(t, "--aby-") };
}
function K(t) {
  const e = h(t);
  if (!e) return {};
  const n = {};
  let o = e;
  return b(e, d.dark.bg) < 3 && (o = s(e, [d.dark.bg], i, 3), n["--aby-d-accent"] = o, n["--aby-d-accent-text"] = f(o)), n["--aby-l-accent-ink"] = s(e, [d.light.bg, d.light.card], y), n["--aby-d-accent-ink"] = s(o, [d.dark.bg, d.dark.card], i), n;
}
function ct(t) {
  return Object.entries(O(t, "--aby-s-")).map(([e, n]) => `${e}:${n}`).join(";");
}
function it(t) {
  const e = String(V(t.color_scheme) || "auto");
  return e === "dark" ? "aby-dark" : e === "light" ? "" : "aby-auto";
}
const z = "aby-mode";
let w = null;
function st(t) {
  if (w) return w;
  try {
    const e = JSON.parse(localStorage.getItem(z) || "null");
    if (((e == null ? void 0 : e.mode) === "light" || (e == null ? void 0 : e.mode) === "dark") && e.base === t) return e.mode;
  } catch {
  }
  return null;
}
function lt(t, e, n) {
  var o;
  return e && n ? n : t === "system" ? (o = window.matchMedia) != null && o.call(window, "(prefers-color-scheme: dark)").matches ? "dark" : "light" : t === "dark" ? "dark" : "light";
}
function ut(t, e) {
  w = t;
  try {
    localStorage.setItem(z, JSON.stringify({ mode: t, base: e }));
  } catch {
  }
}
function dt(t) {
  var r;
  if (typeof IntersectionObserver > "u" || (r = window.matchMedia) != null && r.call(window, "(prefers-reduced-motion: reduce)").matches) return;
  t.classList.add("aby-reveal");
  const e = () => {
    t.classList.add("is-in"), n.disconnect(), window.clearTimeout(o);
  }, n = new IntersectionObserver(
    (a) => {
      a.some((c) => c.isIntersecting) && e();
    },
    { rootMargin: "0px 0px -10% 0px" }
  ), o = window.setTimeout(e, 2500);
  n.observe(t);
}
const W = `
.aby-reveal { transition: opacity .6s ease, transform .6s ease; }
.aby-reveal:not(.is-in) { opacity: 0; transform: translateY(16px); }
@media (prefers-reduced-motion: reduce) { .aby-reveal, .aby-reveal:not(.is-in) { opacity: 1; transform: none; transition: none; } }
`;
function F(t, e) {
  if (document.getElementById(t)) return;
  const n = document.createElement("style");
  n.id = t, n.textContent = e, document.head.appendChild(n);
}
const H = ["bg", "card", "title", "text", "accent", "accent-text", "accent-ink"], T = (t, e) => d[t][e === "accent-text" ? "accentText" : e === "accent-ink" ? "accentInk" : e], Y = {
  accent: "--color-primary",
  "accent-text": "--color-primary-reverse"
}, x = (t) => H.map((e) => {
  const n = t === "l" ? "light" : "dark", o = Y[e], r = o ? `var(${o}, ${T(n, e)})` : T(n, e);
  return `--aby-${e}: var(--aby-s-${t}-${e}, var(--aby-${t}-${e}, ${r}));`;
}).join(" "), J = `
.aby-host { display: block; width: 100%; min-width: 0; container-type: inline-size; }
[data-aby-section] { scroll-margin-top: var(--aby-hd-h, 0px); }
/* The last block keeps clear of the sticky buy bar while it shows */
.aby-ft { padding-bottom: calc(1.25rem + var(--aby-sb-h, 0px)) !important; }
.component-card:has(> .aby-host:not(:empty)) { min-height: 0; }
.aby-block { ${x("l")}
  display: block; width: 100%; box-sizing: border-box; font-family: var(--font-main, inherit);
  color: var(--aby-text); background: var(--aby-bg); }
.aby-block.aby-dark, html.aby-mode-dark .aby-block.aby-auto { ${x("d")} }
@media (prefers-color-scheme: dark) { html:not(.aby-mode-light) .aby-block.aby-auto { ${x("d")} } }
html.aby-mode-ready .aby-block { transition: background-color .3s ease, color .3s ease; }
.aby-block *, .aby-block *::before, .aby-block *::after { box-sizing: border-box; }
.aby-block img, .aby-block video { display: block; max-width: 100%; }
.aby-block h2, .aby-block h3, .aby-block p, .aby-block ul { margin: 0; padding: 0; }
.aby-block ul { list-style: none; }
.aby-container { width: 100%; max-width: 1200px; margin-inline: auto; padding-inline: 1rem; }
.aby-section { padding-block: 2.5rem; }
@container (min-width: 768px) { .aby-section { padding-block: 4rem; } }
.aby-title { text-align: center; margin-bottom: 1.75rem; }
.aby-title h2 { font-size: 1.75rem; line-height: 1.3; font-weight: 700; color: var(--aby-title); }
.aby-title p { margin-top: .5rem; font-size: 1rem; line-height: 1.7; color: var(--aby-text); }
@container (min-width: 768px) { .aby-title h2 { font-size: 2.25rem; } }
.aby-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 2.75rem;
  padding: .75rem 1.75rem; border: 1px solid transparent; border-radius: var(--aby-radius, .625rem);
  background: var(--aby-accent); color: var(--aby-accent-text); font: inherit; font-weight: 700; font-size: 1rem;
  line-height: 1.2; text-decoration: none; cursor: pointer; transition: transform .2s ease, opacity .2s ease; }
.aby-btn:hover { transform: translateY(-1px); opacity: .92; }
.aby-btn:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 3px; }
.aby-btn[disabled], .aby-btn[aria-busy="true"] { opacity: .6; cursor: progress; transform: none; }
.aby-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.aby-error { margin-top: .5rem; color: #b42318; font-size: .875rem; }
.aby-block.aby-dark .aby-error, html.aby-mode-dark .aby-auto .aby-error { color: #fda29b; }
@media (prefers-color-scheme: dark) { html:not(.aby-mode-light) .aby-auto .aby-error { color: #fda29b; } }
@media (prefers-reduced-motion: reduce) { .aby-btn, html.aby-mode-ready .aby-block { transition: none; } .aby-btn:hover { transform: none; } }
${W}
`;
let C = !1;
function bt() {
  if (F("aby-base", J), C) return;
  C = !0;
  const t = document.documentElement;
  if (t.style.getPropertyValue("--aby-d-accent")) return;
  const e = getComputedStyle(t).getPropertyValue("--color-primary").trim();
  for (const [n, o] of Object.entries(K(e))) t.style.setProperty(n, o);
}
export {
  I as a,
  F as b,
  U as c,
  ct as d,
  bt as e,
  nt as f,
  X as g,
  p as h,
  _ as i,
  lt as j,
  st as k,
  P as l,
  ot as m,
  ut as n,
  Z as o,
  at as p,
  et as q,
  G as r,
  it as s,
  Q as t,
  V as u,
  dt as v,
  tt as w,
  rt as x,
  L as y,
  M as z
};
