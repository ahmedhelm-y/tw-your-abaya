import { i as p, x as P, y as M, h, l as k, t as v, q as T, z as x } from "./styles-vAeqvApy.js";
const L = { go: (t) => window.location.assign(t) }, I = (t) => !!t && Object.keys(t).length > 0;
function N(t = {}) {
  var n;
  return p() ? (n = t.items) != null && n.length ? "cart" : x() === "product" ? k() ? I(t.options) ? "cart" : "fast-checkout" : "none" : T().url || t.fallbackUrl ? "link" : "none" : "fast-checkout";
}
const E = 15e3;
let l = null;
window.addEventListener("pageshow", () => {
  l = null;
});
function z(t = {}) {
  if (l) return l;
  const n = U(j(t)).then((e) => (e.kind !== "cart" && l === n && (l = null), e));
  return l = n, n;
}
function U(t) {
  return new Promise((n) => {
    const e = window.setTimeout(() => n({ kind: "error", message: g(null) }), E);
    t.then(n, (i) => n({ kind: "error", message: g(i) })).finally(() => window.clearTimeout(e));
  });
}
function b(t) {
  var n, e, i;
  return ((e = (n = t == null ? void 0 : t.data) == null ? void 0 : n.cart) == null ? void 0 : e.items) || ((i = t == null ? void 0 : t.data) == null ? void 0 : i.items) || [];
}
async function _(t, n, e) {
  var c, s;
  const i = new Map(n.map((r) => [String(r.id), Number(r.quantity) || 0]));
  for (const r of e) {
    const o = i.get(String(r.id)) || 0;
    if (!((Number(r.quantity) || 0) <= o))
      try {
        o ? await ((c = t.updateItem) == null ? void 0 : c.call(t, { id: r.id, quantity: o })) : await ((s = t.deleteItem) == null ? void 0 : s.call(t, r.id));
      } catch {
      }
  }
}
function B(t, n, e) {
  var c, s, r;
  const i = h();
  try {
    const o = t.product;
    (r = i == null ? void 0 : i.analytics) == null || r.track("Buy Now", {
      source: "your-abaya",
      action: n,
      product_id: o != null && o.id ? String(o.id) : k(),
      items: ((c = t.items) == null ? void 0 : c.length) || 1,
      quantity: e,
      price: o != null && o.id ? Number(o.sale_price || o.price || 0) * e : null,
      currency: (o == null ? void 0 : o.currency) || ((s = i == null ? void 0 : i.config) == null ? void 0 : s.get("user.currency_code")) || null
    });
  } catch {
  }
}
function g(t) {
  var n, e, i;
  return ((i = (e = (n = t == null ? void 0 : t.response) == null ? void 0 : n.data) == null ? void 0 : e.error) == null ? void 0 : i.message) || (t == null ? void 0 : t.message) || v({ ar: "تعذر إكمال الطلب، حاول مرة أخرى", en: "We couldn't complete the order, please try again" });
}
function O() {
  var e, i, c;
  const t = h();
  try {
    const s = (i = (e = t == null ? void 0 : t.url) == null ? void 0 : e.get) == null ? void 0 : i.call(e, "cart");
    if (s) return String(s);
  } catch {
  }
  return `${String(((c = t == null ? void 0 : t.config) == null ? void 0 : c.get("store.url")) || location.origin).replace(/\/+$/, "")}/cart`;
}
const C = { ms: 6e3 };
async function $() {
  var d, u, y, a, m;
  const t = h(), n = (d = t == null ? void 0 : t.cart) == null ? void 0 : d.api, e = () => (L.go(O()), !0);
  if (!(n != null && n.submit)) return e();
  let i = !1;
  const c = () => i = !!document.querySelector("salla-login-modal"), s = () => i = !0, r = location.href, o = () => location.href !== r;
  try {
    (y = (u = t == null ? void 0 : t.event) == null ? void 0 : u.on) == null || y.call(u, "login::open", c);
  } catch {
  }
  window.addEventListener("pagehide", s, { once: !0 }), window.addEventListener("beforeunload", s, { once: !0 });
  const f = new Promise((w) => window.setTimeout(() => w("wait"), C.ms));
  try {
    const w = Promise.resolve(n.submit()).then(() => "ok");
    return await Promise.race([w, f]), i || await f, !i && !o() ? e() : !0;
  } catch {
    return i ? !0 : e();
  } finally {
    try {
      (m = (a = t == null ? void 0 : t.event) == null ? void 0 : a.off) == null || m.call(a, "login::open", c);
    } catch {
    }
  }
}
async function j(t) {
  var i, c, s, r;
  const n = N(t), e = Math.max(1, Number(t.quantity) || 1);
  if (n !== "none" && B(t, n, e), n === "fast-checkout")
    return p() && (P(), M(e)), { kind: n };
  if (n === "cart") {
    const o = (c = (i = h()) == null ? void 0 : i.cart) == null ? void 0 : c.api, f = (s = t.items) != null && s.length ? t.items : [{ id: String(k()), quantity: e, options: t.options }];
    if (f.some((a) => a.max && a.quantity > a.max))
      return { kind: "error", message: v({ ar: "الكمية أكبر من المتاح", en: "The quantity is more than what is available" }) };
    if (!o) return { kind: "error", message: g(null) };
    let d = [];
    try {
      d = b(await ((r = o.details) == null ? void 0 : r.call(o)));
    } catch {
    }
    let u = d;
    try {
      for (const a of f) {
        const m = b(await o.addItem({ id: a.id, quantity: a.quantity, options: a.options, ...a.notes ? { notes: a.notes } : {} }));
        m.length && (u = m);
      }
    } catch (a) {
      return await _(o, d, u), { kind: "error", message: g(a) };
    }
    return await $() ? { kind: n } : { kind: "error", message: g(null) };
  }
  return n === "link" ? (L.go(T().url || t.fallbackUrl || ""), { kind: n }) : { kind: "none" };
}
export {
  z as a,
  N as b
};
