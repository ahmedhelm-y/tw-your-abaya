import { i as k, x as M, y as T, h as w, l as f, t as b, q as p, z as x } from "./styles-vAeqvApy.js";
const I = { go: (t) => window.location.assign(t) }, N = (t) => !!t && Object.keys(t).length > 0;
function _(t = {}) {
  var n;
  return k() ? (n = t.items) != null && n.length ? "cart" : x() === "product" ? f() ? N(t.options) ? "cart" : "fast-checkout" : "none" : p().url || t.fallbackUrl ? "link" : "none" : "fast-checkout";
}
const L = 15e3;
let c = null;
window.addEventListener("pageshow", () => {
  c = null;
});
function B(t = {}) {
  if (c) return c;
  const n = O(U(t)).then((e) => (e.kind !== "cart" && c === n && (c = null), e));
  return c = n, n;
}
function O(t) {
  return new Promise((n) => {
    const e = window.setTimeout(() => n({ kind: "error", message: l(null) }), L);
    t.then(n, (a) => n({ kind: "error", message: l(a) })).finally(() => window.clearTimeout(e));
  });
}
function h(t) {
  var n, e, a;
  return ((e = (n = t == null ? void 0 : t.data) == null ? void 0 : n.cart) == null ? void 0 : e.items) || ((a = t == null ? void 0 : t.data) == null ? void 0 : a.items) || [];
}
async function P(t, n, e) {
  var r, s;
  const a = new Map(n.map((o) => [String(o.id), Number(o.quantity) || 0]));
  for (const o of e) {
    const i = a.get(String(o.id)) || 0;
    if (!((Number(o.quantity) || 0) <= i))
      try {
        i ? await ((r = t.updateItem) == null ? void 0 : r.call(t, { id: o.id, quantity: i })) : await ((s = t.deleteItem) == null ? void 0 : s.call(t, o.id));
      } catch {
      }
  }
}
function S(t, n, e) {
  var r, s, o;
  const a = w();
  try {
    const i = t.product;
    (o = a == null ? void 0 : a.analytics) == null || o.track("Buy Now", {
      source: "your-abaya",
      action: n,
      product_id: i != null && i.id ? String(i.id) : f(),
      items: ((r = t.items) == null ? void 0 : r.length) || 1,
      quantity: e,
      price: i != null && i.id ? Number(i.sale_price || i.price || 0) * e : null,
      currency: (i == null ? void 0 : i.currency) || ((s = a == null ? void 0 : a.config) == null ? void 0 : s.get("user.currency_code")) || null
    });
  } catch {
  }
}
function l(t) {
  var n, e, a;
  return ((a = (e = (n = t == null ? void 0 : t.response) == null ? void 0 : n.data) == null ? void 0 : e.error) == null ? void 0 : a.message) || (t == null ? void 0 : t.message) || b({ ar: "تعذر إكمال الطلب، حاول مرة أخرى", en: "We couldn't complete the order, please try again" });
}
async function U(t) {
  var a, r, s, o;
  const n = _(t), e = Math.max(1, Number(t.quantity) || 1);
  if (n !== "none" && S(t, n, e), n === "fast-checkout")
    return k() && (M(), T(e)), { kind: n };
  if (n === "cart") {
    const i = (r = (a = w()) == null ? void 0 : a.cart) == null ? void 0 : r.api, m = (s = t.items) != null && s.length ? t.items : [{ id: String(f()), quantity: e, options: t.options }];
    if (m.some((u) => u.max && u.quantity > u.max))
      return { kind: "error", message: b({ ar: "الكمية أكبر من المتاح", en: "The quantity is more than what is available" }) };
    if (!i) return { kind: "error", message: l(null) };
    let d = [];
    try {
      d = h(await ((o = i.details) == null ? void 0 : o.call(i)));
    } catch {
    }
    let g = d;
    try {
      for (const u of m) {
        const y = h(await i.addItem({ id: u.id, quantity: u.quantity, options: u.options, ...u.notes ? { notes: u.notes } : {} }));
        y.length && (g = y);
      }
    } catch (u) {
      return await P(i, d, g), { kind: "error", message: l(u) };
    }
    try {
      return await i.submit(), { kind: n };
    } catch (u) {
      return { kind: "error", message: l(u) };
    }
  }
  return n === "link" ? (I.go(p().url || t.fallbackUrl || ""), { kind: n }) : { kind: "none" };
}
export {
  B as a,
  _ as b
};
