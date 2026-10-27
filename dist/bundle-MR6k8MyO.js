function a(t) {
  var e;
  return (((e = t.product) == null ? void 0 : e.options) || []).filter((i) => (i == null ? void 0 : i.required) && (i.details || []).length && !t.options[String(i.id)]).map((i) => Number(i.id));
}
function d(t, n = 0) {
  var r;
  const e = {}, i = t.filter((o) => o.selected);
  for (const o of i) {
    const s = a(o);
    s.length && (e[String((r = o.product) == null ? void 0 : r.id)] = s);
  }
  return { ok: i.length >= n && Object.keys(e).length === 0, missing: e };
}
const u = (t) => Number((t == null ? void 0 : t.sale_price) || (t == null ? void 0 : t.price)) || 0;
function c(t) {
  var e;
  let n = 0;
  for (const i of ((e = t.product) == null ? void 0 : e.options) || []) {
    const r = t.options[String(i.id)], o = (i.details || []).find((s) => Number(s.id) === Number(r));
    n += Number(o == null ? void 0 : o.additional_price) || 0;
  }
  return n;
}
function f(t) {
  return !((t == null ? void 0 : t.status) === "out" || (t == null ? void 0 : t.is_available) === !1 || (t == null ? void 0 : t.is_out_of_stock) === !0);
}
function l(t) {
  const n = t.filter((e) => e.selected);
  return {
    total: n.reduce((e, i) => e + (u(i.product) + c(i)) * i.quantity, 0),
    regular: n.reduce((e, i) => {
      var r;
      return e + (Math.max(Number((r = i.product) == null ? void 0 : r.regular_price) || 0, u(i.product)) + c(i)) * i.quantity;
    }, 0),
    count: n.length
  };
}
function m(t) {
  return t.filter((n) => n.selected).map((n) => {
    var e, i;
    return {
      id: String((e = n.product) == null ? void 0 : e.id),
      quantity: n.quantity,
      options: Object.keys(n.options).length ? n.options : void 0,
      max: Number((i = n.product) == null ? void 0 : i.max_quantity) || void 0
    };
  });
}
export {
  l as b,
  f as i,
  c as o,
  m as t,
  d as v
};
