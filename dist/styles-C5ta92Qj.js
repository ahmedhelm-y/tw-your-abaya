function ht(t) {
  return t ? t.component && typeof t.component == "object" ? t.component : t : {};
}
function N() {
  var t, e, n;
  return ((n = (e = (t = window.Salla) == null ? void 0 : t.lang) == null ? void 0 : e.getLocale) == null ? void 0 : n.call(e)) || document.documentElement.lang || "ar";
}
function pt(t) {
  if (t == null || t === "") return "";
  if (typeof t == "string") return t;
  if (typeof t == "object") {
    const e = t, n = N() === "en" ? "en" : "ar";
    return e[n] || e[n === "en" ? "ar" : "en"] || "";
  }
  return String(t);
}
function B(t) {
  return N() === "ar" ? t.ar : t.en;
}
function Y(t) {
  var e;
  return Array.isArray(t) ? ((e = t[0]) == null ? void 0 : e.value) ?? t[0] ?? "" : t && typeof t == "object" && "value" in t ? t.value : t ?? "";
}
function kt(t, e) {
  return Array.isArray(t) ? t.map((n) => {
    if (!n || typeof n != "object") return {};
    const r = {};
    for (const [o, a] of Object.entries(n))
      r[o.startsWith(`${e}.`) ? o.slice(e.length + 1) : o] = a;
    return r;
  }) : [];
}
function wt(t) {
  return String(t ?? "").trim().replace(/^#+/, "").trim();
}
function b() {
  return window.Salla;
}
function O() {
  var t, e;
  return ((e = (t = b()) == null ? void 0 : t.config) == null ? void 0 : e.get("theme.settings")) || {};
}
function I() {
  var t, e;
  return ((e = (t = b()) == null ? void 0 : t.config) == null ? void 0 : e.get("page.is_landing_page")) === !0;
}
function R() {
  var e;
  const t = O().page_for_product;
  return typeof t == "boolean" || t === void 0 || t === null ? t === !1 ? "promotion" : "product" : typeof t == "string" ? t === "promotion" ? "promotion" : "product" : Array.isArray(t) && ((e = t[0]) == null ? void 0 : e.value) === "promotion" ? "promotion" : "product";
}
function _() {
  var e, n;
  if (!I() || R() !== "product") return null;
  const t = (n = (e = O().product) == null ? void 0 : e.value) == null ? void 0 : n[0];
  return t ? String(t) : null;
}
function W() {
  const t = O();
  return { text: String(t.main_btn_text || ""), url: String(t.main_btn_url || "") };
}
const Q = "1616473", q = ["images", "rating", "sold_quantity", "options"];
async function S(t, e) {
  var n;
  try {
    const r = q.map((i) => `with[]=${i}`).join("&"), a = await (await fetch(`https://api.salla.dev/store/v1/products/${t}/details?${r}`, {
      headers: { "store-identifier": e, "accept-language": document.documentElement.lang === "en" ? "en" : "ar" }
    })).json();
    return (n = a == null ? void 0 : a.data) != null && n.id ? a.data : null;
  } catch {
    return null;
  }
}
async function xt(t) {
  var r, o, a, i;
  const e = b();
  if (!t) return null;
  await ((r = e == null ? void 0 : e.onReady) == null ? void 0 : r.call(e));
  const n = String(((o = e == null ? void 0 : e.config) == null ? void 0 : o.get("store.id")) || "");
  if (I()) {
    if (String(t) !== _()) return n ? S(t, n) : null;
    try {
      const c = await ((a = e == null ? void 0 : e.product) == null ? void 0 : a.api.getDetails(t, q));
      return (i = c == null ? void 0 : c.data) != null && i.id ? c.data : null;
    } catch {
      return null;
    }
  }
  return n && await S(t, n) || S(t, Q);
}
function X() {
  const t = document.querySelector(".s-block--fast-checkout"), e = t == null ? void 0 : t.getAttribute("data-layout");
  if (window.innerWidth < 1024 || e === "side-drawer" || !t) {
    window.dispatchEvent(new CustomEvent("open-checkout-drawer"));
    return;
  }
  t.scrollIntoView({ behavior: "smooth", block: "center" });
}
function D(t, e = 20) {
  if (t <= 1) return;
  const n = document.querySelector(
    ".s-block--fast-checkout salla-quantity-input, .s-block--fast-checkout-main salla-quantity-input"
  );
  if (n != null && n.setValue) {
    n.setValue(t);
    return;
  }
  e > 0 && window.setTimeout(() => D(t, e - 1), 100);
}
function vt(t) {
  const e = b();
  return e != null && e.money ? e.money(t) : String(t);
}
const U = { go: (t) => window.location.assign(t) }, G = (t) => !!t && Object.keys(t).length > 0;
function J(t = {}) {
  var e;
  return I() ? (e = t.items) != null && e.length ? "cart" : R() === "product" ? _() ? G(t.options) ? "cart" : "fast-checkout" : "none" : W().url || t.fallbackUrl ? "link" : "none" : "fast-checkout";
}
const Z = 15e3;
let g = null;
window.addEventListener("pageshow", () => {
  g = null;
});
function Tt(t = {}) {
  if (g) return g;
  const e = tt(it(t)).then((n) => (n.kind !== "cart" && g === e && (g = null), n));
  return g = e, e;
}
function tt(t) {
  return new Promise((e) => {
    const n = window.setTimeout(() => e({ kind: "error", message: w(null) }), Z);
    t.then(e, (r) => e({ kind: "error", message: w(r) })).finally(() => window.clearTimeout(n));
  });
}
function L(t) {
  var e, n, r;
  return ((n = (e = t == null ? void 0 : t.data) == null ? void 0 : e.cart) == null ? void 0 : n.items) || ((r = t == null ? void 0 : t.data) == null ? void 0 : r.items) || [];
}
async function et(t, e, n) {
  var o, a;
  const r = new Map(e.map((i) => [String(i.id), Number(i.quantity) || 0]));
  for (const i of n) {
    const c = r.get(String(i.id)) || 0;
    if (!((Number(i.quantity) || 0) <= c))
      try {
        c ? await ((o = t.updateItem) == null ? void 0 : o.call(t, { id: i.id, quantity: c })) : await ((a = t.deleteItem) == null ? void 0 : a.call(t, i.id));
      } catch {
      }
  }
}
function nt(t, e, n) {
  var o, a, i;
  const r = b();
  try {
    const c = t.product;
    (i = r == null ? void 0 : r.analytics) == null || i.track("Buy Now", {
      source: "your-abaya",
      action: e,
      product_id: c != null && c.id ? String(c.id) : _(),
      items: ((o = t.items) == null ? void 0 : o.length) || 1,
      quantity: n,
      price: c != null && c.id ? Number(c.sale_price || c.price || 0) * n : null,
      currency: (c == null ? void 0 : c.currency) || ((a = r == null ? void 0 : r.config) == null ? void 0 : a.get("user.currency_code")) || null
    });
  } catch {
  }
}
function w(t) {
  var e, n, r;
  return ((r = (n = (e = t == null ? void 0 : t.response) == null ? void 0 : e.data) == null ? void 0 : n.error) == null ? void 0 : r.message) || (t == null ? void 0 : t.message) || B({ ar: "تعذر إكمال الطلب، حاول مرة أخرى", en: "We couldn't complete the order, please try again" });
}
function rt() {
  var n, r, o;
  const t = b();
  try {
    const a = (r = (n = t == null ? void 0 : t.url) == null ? void 0 : n.get) == null ? void 0 : r.call(n, "cart");
    if (a) return String(a);
  } catch {
  }
  return `${String(((o = t == null ? void 0 : t.config) == null ? void 0 : o.get("store.url")) || location.origin).replace(/\/+$/, "")}/cart`;
}
const ot = { ms: 6e3 };
async function at() {
  var m, y, j, u, k;
  const t = b(), e = (m = t == null ? void 0 : t.cart) == null ? void 0 : m.api, n = () => (U.go(rt()), !0);
  if (!(e != null && e.submit)) return n();
  let r = !1;
  const o = () => r = !!document.querySelector("salla-login-modal"), a = () => r = !0, i = location.href, c = () => location.href !== i;
  try {
    (j = (y = t == null ? void 0 : t.event) == null ? void 0 : y.on) == null || j.call(y, "login::open", o);
  } catch {
  }
  window.addEventListener("pagehide", a, { once: !0 }), window.addEventListener("beforeunload", a, { once: !0 });
  const p = new Promise((C) => window.setTimeout(() => C("wait"), ot.ms));
  try {
    const C = Promise.resolve(e.submit()).then(() => "ok");
    return await Promise.race([C, p]), r || await p, !r && !c() ? n() : !0;
  } catch {
    return r ? !0 : n();
  } finally {
    try {
      (k = (u = t == null ? void 0 : t.event) == null ? void 0 : u.off) == null || k.call(u, "login::open", o);
    } catch {
    }
  }
}
async function it(t) {
  var r, o, a, i;
  const e = J(t), n = Math.max(1, Number(t.quantity) || 1);
  if (e !== "none" && nt(t, e, n), e === "fast-checkout")
    return I() && (X(), D(n)), { kind: e };
  if (e === "cart") {
    const c = (o = (r = b()) == null ? void 0 : r.cart) == null ? void 0 : o.api, p = (a = t.items) != null && a.length ? t.items : [{ id: String(_()), quantity: n, options: t.options }];
    if (p.some((u) => u.max && u.quantity > u.max))
      return { kind: "error", message: B({ ar: "الكمية أكبر من المتاح", en: "The quantity is more than what is available" }) };
    if (!c) return { kind: "error", message: w(null) };
    let m = [];
    try {
      m = L(await ((i = c.details) == null ? void 0 : i.call(c)));
    } catch {
    }
    let y = m;
    try {
      for (const u of p) {
        const k = L(await c.addItem({ id: u.id, quantity: u.quantity, options: u.options, ...u.notes ? { notes: u.notes } : {} }));
        k.length && (y = k);
      }
    } catch (u) {
      return await et(c, m, y), { kind: "error", message: w(u) };
    }
    return await at() ? { kind: e } : { kind: "error", message: w(null) };
  }
  return e === "link" ? (U.go(W().url || t.fallbackUrl || ""), { kind: e }) : { kind: "none" };
}
const ct = ["bg", "card", "title", "text", "accent"], P = "#111111", s = "#ffffff", K = 4.5;
function T(t) {
  if (typeof t != "string") return null;
  const e = t.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(e)) return null;
  const n = e.length === 3 ? e.replace(/./g, (r) => r + r) : e;
  return [0, 2, 4].map((r) => parseInt(n.slice(r, r + 2), 16));
}
function F([t, e, n]) {
  return "#" + [t, e, n].map((r) => Math.round(r).toString(16).padStart(2, "0")).join("");
}
function E(t) {
  const e = T(t);
  return e ? F(e) : null;
}
function M(t) {
  const [e, n, r] = t.map((o) => {
    const a = o / 255;
    return a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * e + 0.7152 * n + 0.0722 * r;
}
function h(t, e) {
  const n = T(t), r = T(e);
  if (!n || !r) return 1;
  const [o, a] = [M(n), M(r)].sort((i, c) => c - i);
  return (o + 0.05) / (a + 0.05);
}
function x(t) {
  const e = h(P, t) >= h(s, t) ? P : s;
  return h(e, t) >= K ? e : "#000000";
}
function d(t, e, n) {
  const r = T(t), o = T(e);
  return F(r.map((a, i) => a + (o[i] - a) * n));
}
function l(t, e, n, r = K) {
  let o = t;
  for (let a = 0; a < 20 && e.some((i) => h(o, i) < r); a++)
    o = d(o, n, 0.05 * (a + 1));
  return e.every((a) => h(o, a) >= r) ? o : n;
}
const v = "#000000", st = (t) => t === "light" ? v : s;
function $(t, e) {
  return {
    ...t,
    accentText: x(t.accent),
    accentInk: l(t.accent, [t.bg, t.card], st(e))
  };
}
const f = {
  light: $({ bg: "#ffffff", card: "#f7f4f0", title: "#1a1714", text: "#4a4440", accent: "#8a5a2b" }, "light"),
  dark: $({ bg: "#141210", card: "#1f1b18", title: "#f5efe8", text: "#c9bfb4", accent: "#d9a46a" }, "dark")
};
function ut(t) {
  const e = E(t);
  if (!e) return structuredClone(f);
  const n = d(e, s, 0.94), r = d(e, s, 0.88), o = d(e, "#000000", 0.88), a = d(e, "#000000", 0.8);
  return {
    light: $({
      bg: n,
      card: r,
      title: l(d(e, "#000000", 0.8), [n, r], "#000000"),
      text: l(d(e, "#000000", 0.65), [n, r], "#000000"),
      accent: e
    }, "light"),
    dark: $({
      bg: o,
      card: a,
      title: l(d(e, s, 0.92), [o, a], s),
      text: l(d(e, s, 0.75), [o, a], s),
      // An accent that disappears into the dark background is lifted until it stands out
      accent: l(e, [o], s, 3)
    }, "dark")
  };
}
const lt = (t) => t === "accentText" ? "accent-text" : t === "accentInk" ? "accent-ink" : t;
function H(t, e) {
  const n = {};
  for (const r of ["l", "d"]) {
    const o = {};
    for (const i of ct) {
      const c = E(t[`${r}_${i}`]);
      c && (o[i] = c);
    }
    const a = r === "l" ? "light" : "dark";
    if (o.bg) {
      const i = x(o.bg);
      o.card ?? (o.card = d(o.bg, i, 0.08)), o.title ?? (o.title = l(i, [o.bg, o.card], i === s ? s : v)), o.text ?? (o.text = l(i, [o.bg, o.card], i === s ? s : v));
    }
    if (o.accent) {
      o["accent-text"] = x(o.accent);
      const i = [o.bg || f[a].bg, o.card || f[a].card];
      o["accent-ink"] = l(o.accent, i, x(i[0]) === s ? s : v);
    }
    for (const [i, c] of Object.entries(o)) n[`${e}${r}-${i}`] = c;
  }
  return n;
}
function $t(t) {
  const e = {};
  if (E(t.brand_color)) {
    const n = ut(t.brand_color);
    for (const [r, o] of [["light", "l"], ["dark", "d"]])
      for (const [a, i] of Object.entries(n[r])) e[`--aby-${o}-${lt(a)}`] = i;
  }
  return { ...e, ...H(t, "--aby-") };
}
function dt(t) {
  const e = E(t);
  if (!e) return {};
  const n = {};
  let r = e;
  return h(e, f.dark.bg) < 3 && (r = l(e, [f.dark.bg], s, 3), n["--aby-d-accent"] = r, n["--aby-d-accent-text"] = x(r)), n["--aby-l-accent-ink"] = l(e, [f.light.bg, f.light.card], v), n["--aby-d-accent-ink"] = l(r, [f.dark.bg, f.dark.card], s), n;
}
function It(t) {
  return Object.entries(H(t, "--aby-s-")).map(([e, n]) => `${e}:${n}`).join(";");
}
function _t(t) {
  const e = String(Y(t.color_scheme) || "auto");
  return e === "dark" ? "aby-dark" : e === "light" ? "" : "aby-auto";
}
function Et(t, e, n) {
  var r;
  return t === "system" ? (r = window.matchMedia) != null && r.call(window, "(prefers-color-scheme: dark)").matches ? "dark" : "light" : t === "dark" ? "dark" : "light";
}
function jt(t) {
  var o;
  if (typeof IntersectionObserver > "u" || (o = window.matchMedia) != null && o.call(window, "(prefers-reduced-motion: reduce)").matches) return;
  t.classList.add("aby-reveal");
  const e = () => {
    t.classList.add("is-in"), n.disconnect(), window.clearTimeout(r);
  }, n = new IntersectionObserver(
    (a) => {
      a.some((i) => i.isIntersecting) && e();
    },
    { rootMargin: "0px 0px -10% 0px" }
  ), r = window.setTimeout(e, 2500);
  n.observe(t);
}
const ft = `
.aby-reveal { transition: opacity .6s ease, transform .6s ease; }
.aby-reveal:not(.is-in) { opacity: 0; transform: translateY(16px); }
@media (prefers-reduced-motion: reduce) { .aby-reveal, .aby-reveal:not(.is-in) { opacity: 1; transform: none; transition: none; } }
`;
function bt(t, e) {
  if (document.getElementById(t)) return;
  const n = document.createElement("style");
  n.id = t, n.textContent = e, document.head.appendChild(n);
}
const yt = ["bg", "card", "title", "text", "accent", "accent-text", "accent-ink"], V = (t, e) => f[t][e === "accent-text" ? "accentText" : e === "accent-ink" ? "accentInk" : e], mt = {
  accent: "--color-primary",
  "accent-text": "--color-primary-reverse"
}, A = (t) => yt.map((e) => {
  const n = t === "l" ? "light" : "dark", r = mt[e], o = r ? `var(${r}, ${V(n, e)})` : V(n, e);
  return `--aby-${e}: var(--aby-s-${t}-${e}, var(--aby-${t}-${e}, ${o}));`;
}).join(" "), gt = `
.aby-host { display: block; width: 100%; min-width: 0; container-type: inline-size; }
[data-aby-section] { scroll-margin-top: var(--aby-hd-h, 0px); }
/* The page's end keeps clear of the sticky buy bar while it shows */
.aby-host:has(> .aby-sb:not(.aby-sb--inline)) { height: var(--aby-sb-h, 0px); }
.component-card:has(> .aby-host:not(:empty)) { min-height: 0; }
.aby-block { ${A("l")}
  display: block; width: 100%; box-sizing: border-box; font-family: var(--font-main, inherit);
  color: var(--aby-text); background: var(--aby-bg); }
.aby-block.aby-dark, html.aby-mode-dark .aby-block.aby-auto { ${A("d")} }
@media (prefers-color-scheme: dark) { html:not(.aby-mode-light) .aby-block.aby-auto { ${A("d")} } }
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
.aby-cta { display: flex; justify-content: center; margin-top: 2rem; }
.aby-cta .aby-btn { min-width: min(100%, 16rem); }
.aby-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.aby-error { margin-top: .5rem; color: #b42318; font-size: .875rem; }
.aby-block.aby-dark .aby-error, html.aby-mode-dark .aby-auto .aby-error { color: #fda29b; }
@media (prefers-color-scheme: dark) { html:not(.aby-mode-light) .aby-auto .aby-error { color: #fda29b; } }
@media (prefers-reduced-motion: reduce) { .aby-btn, html.aby-mode-ready .aby-block { transition: none; } .aby-btn:hover { transform: none; } }
${ft}
`;
let z = !1;
function Ct() {
  if (bt("aby-base", gt), z) return;
  z = !0;
  const t = document.documentElement;
  if (t.style.getPropertyValue("--aby-d-accent")) return;
  const e = getComputedStyle(t).getPropertyValue("--color-primary").trim();
  for (const [n, r] of Object.entries(dt(e))) t.style.setProperty(n, r);
}
export {
  N as a,
  J as b,
  Et as c,
  bt as d,
  Ct as e,
  xt as f,
  kt as g,
  Tt as h,
  I as i,
  b as j,
  ht as k,
  _ as l,
  vt as m,
  W as n,
  It as o,
  $t as p,
  jt as q,
  pt as r,
  _t as s,
  B as t,
  Y as u,
  wt as v
};
