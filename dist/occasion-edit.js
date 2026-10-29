import { nothing as p, html as s } from "lit";
import { state as b } from "lit/decorators.js";
import { unsafeHTML as N } from "lit/directives/unsafe-html.js";
import { i as j } from "./bundle-MR6k8MyO.js";
import { b as q } from "./buy-D6n2j5jF.js";
import { f as O, m as z, a as P, t as u, i as L } from "./styles-vAeqvApy.js";
import { f, d as A, o as M } from "./fit-Cpxi4Lua.js";
import { A as B } from "./section-Cbwxq9g0.js";
var E = Object.defineProperty, m = (l, t, e, r) => {
  for (var i = void 0, a = l.length - 1, c; a >= 0; a--)
    (c = l[a]) && (i = c(t, e, i) || i);
  return i && E(t, e, i), i;
};
const F = `
.aby-oe__colors { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; margin-bottom: 1.5rem; }
.aby-oe__color { display: inline-flex; align-items: center; gap: .5rem; min-height: 2.75rem; padding: 0 1rem 0 .5rem; border: 1.5px solid color-mix(in srgb, var(--aby-text) 22%, transparent);
  border-radius: 999px; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-weight: 700; font-size: .875rem; cursor: pointer; }
.aby-oe__color[aria-pressed="true"] { border-color: var(--aby-accent-ink); box-shadow: inset 0 0 0 1px var(--aby-accent-ink); }
.aby-oe__color:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-oe__color i { width: 1.75rem; height: 1.75rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); }
.aby-oe__grid { display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0; margin: 0; list-style: none; }
@container (min-width: 768px) { .aby-oe__grid { grid-template-columns: repeat(var(--aby-oe-cols, 3), minmax(0, 1fr)); gap: 1.5rem; } }
.aby-oe__card { display: flex; flex-direction: column; min-width: 0; border-radius: 1.25rem; background: var(--aby-card); overflow: hidden; }
.aby-oe__img { position: relative; aspect-ratio: 3 / 4; background: var(--aby-bg); }
.aby-oe__img img { width: 100%; height: 100%; object-fit: cover; }
.aby-oe__tag { position: absolute; top: .625rem; inset-inline-start: .625rem; padding: .125rem .625rem; border-radius: 999px; background: var(--aby-accent);
  color: var(--aby-accent-text); font-size: .75rem; font-weight: 700; }
.aby-oe__body { display: flex; flex-direction: column; gap: .5rem; padding: .875rem; flex: 1 1 auto; }
.aby-oe__name { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 700; font-size: .9375rem; line-height: 1.5; color: var(--aby-title); }
.aby-oe__price { display: flex; gap: .5rem; align-items: baseline; font-weight: 800; color: var(--aby-title); }
.aby-oe__price s { font-weight: 500; font-size: .8125rem; opacity: .65; }
.aby-oe__dots { display: flex; gap: .25rem; }
.aby-oe__dots i { width: .875rem; height: .875rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); }
.aby-oe__body select { width: 100%; min-height: 2.75rem; padding: 0 .625rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: .875rem; }
.aby-oe__body select[aria-invalid="true"] { border-color: #d92d20; }
.aby-oe__body .aby-btn { margin-top: auto; padding-inline: .75rem; font-size: .9375rem; }
.aby-oe__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;
function H(l) {
  const t = Array.isArray(l) ? l : typeof l == "string" ? l.split(",") : l ? [l] : [];
  return [...new Set(t.map((e) => String((e && typeof e == "object" ? e.value ?? e.id : e) ?? "").trim()).filter(Boolean))].slice(0, 12);
}
class d extends B {
  constructor() {
    super(...arguments), this.styleId = "occasion-edit", this.cards = [], this.loaded = !1, this.color = "", this.picks = {}, this.invalid = {}, this.pressing = "";
  }
  styles() {
    return F;
  }
  async connectedCallback() {
    super.connectedCallback();
    const t = (await Promise.all(H(this.cfg().products).map((e) => O(e)))).filter((e) => e && j(e));
    this.cards = t.map((e) => {
      const r = f(e, "color"), i = r ? r.details.filter((a) => !a.is_out).map((a) => String(a.name)) : [];
      return { product: e, colors: i };
    }), this.loaded = !0;
  }
  /** Every color across the edit, merged by name, in the order they first appear. */
  palette() {
    return [...new Set(this.cards.flatMap((t) => t.colors))];
  }
  pick(t, e, r) {
    const i = { ...this.picks[t] || {} };
    r ? i[String(e)] = Number(r) : delete i[String(e)], this.picks = { ...this.picks, [t]: i }, this.invalid[t] && (this.invalid = { ...this.invalid, [t]: this.invalid[t].filter((a) => a !== e) });
  }
  async buy(t) {
    var c;
    const e = String(t.product.id), r = { ...this.picks[e] || {} }, i = f(t.product, "color");
    if (i && this.color && !r[String(i.id)]) {
      const n = i.details.find((g) => String(g.name) === this.color);
      n && (r[String(i.id)] = Number(n.id));
    }
    const a = (t.product.options || []).filter((n) => (n == null ? void 0 : n.required) && (n.details || []).length && !r[String(n.id)]).map((n) => Number(n.id));
    if (a.length) {
      this.invalid = { ...this.invalid, [e]: a }, await this.updateComplete, (c = this.querySelector(`[data-card="${e}"] select[aria-invalid="true"]`)) == null || c.focus();
      return;
    }
    this.pressing = e, await this.press({ items: [{ id: e, quantity: 1, options: Object.keys(r).length ? r : void 0, max: Number(t.product.max_quantity) || void 0 }], product: t.product }), this.pressing = "";
  }
  renderCard(t) {
    var v, $, x, k, w, S;
    const e = t.product, r = String(e.id), i = Number(e.sale_price || e.price) || 0, a = Number(e.regular_price) || 0, c = f(e, "color"), n = (e.options || []).filter((o) => (o == null ? void 0 : o.required) && (o.details || []).length && o !== c), g = this.invalid[r] || [], _ = e.promotion_title || e.subtitle || "";
    return s`<li class="aby-oe__card" data-card=${r}>
      <div class="aby-oe__img">
        ${($ = (v = e.images) == null ? void 0 : v[0]) != null && $.url || (x = e.image) != null && x.url ? s`<img src=${((w = (k = e.images) == null ? void 0 : k[0]) == null ? void 0 : w.url) || e.image.url} alt=${((S = e.image) == null ? void 0 : S.alt) || ""} loading="lazy" />` : p}
        ${_ ? s`<span class="aby-oe__tag">${_}</span>` : p}
      </div>
      <div class="aby-oe__body">
        <span class="aby-oe__name">${e.name}</span>
        <span class="aby-oe__price">${N(z(i))}${a > i ? s`<s>${N(z(a))}</s>` : p}</span>
        ${t.colors.length > 1 ? s`<span class="aby-oe__dots" aria-label=${t.colors.join("، ")}>${t.colors.slice(0, 6).map((o) => s`<i style=${`background:${A(o)}`}></i>`)}</span>` : p}
        ${[...c && !this.color ? [c] : [], ...n].map((o) => {
      const C = `aby-oe-${r}-${o.id}`, h = M(o, P());
      return s`<label class="aby-visually-hidden" for=${C}>${h}</label>
            <select id=${C} aria-invalid=${g.includes(Number(o.id)) ? "true" : "false"} @change=${(y) => this.pick(r, o.id, y.target.value)}>
              <option value="">${u({ ar: `اختاري ${h}`, en: `Choose ${h}` })}</option>
              ${o.details.map((y) => s`<option value=${y.id} ?disabled=${y.is_out}>${y.name}</option>`)}
            </select>`;
    })}
        ${q({ items: [{ id: r, quantity: 1 }] }) !== "none" ? s`<button type="button" class="aby-btn" aria-busy=${this.pressing === r ? "true" : "false"} @click=${() => this.buy(t)}>${this.buyLabel()}</button>` : p}
      </div>
    </li>`;
  }
  render() {
    if (!this.cards.length)
      return !this.loaded || L() ? p : this.frame(s`<p class="aby-oe__empty">${u({ ar: "اختر عبايات التشكيلة من إعدادات هذا القسم", en: "Pick the edit's abayas in this section's settings" })}</p>`);
    const t = this.palette(), e = this.color ? this.cards.filter((i) => i.colors.includes(this.color)) : this.cards, r = Math.min(Math.max(Number(this.cfg().columns) || 3, 2), 4);
    return this.frame(s`
      ${t.length > 1 ? s`<div class="aby-oe__colors" role="group" aria-label=${u({ ar: "الألوان", en: "Colors" })}>
            <button type="button" class="aby-oe__color" aria-pressed=${this.color ? "false" : "true"} @click=${() => this.color = ""}>
              <i style="background:conic-gradient(#111 0 25%,#d8c3a5 0 50%,#6d1f2c 0 75%,#1f2a44 0)"></i>${u({ ar: "كل الألوان", en: "All colors" })}</button>
            ${t.map((i) => s`<button type="button" class="aby-oe__color" aria-pressed=${this.color === i ? "true" : "false"} @click=${() => this.color = i}>
              <i style=${`background:${A(i)}`}></i>${i}</button>`)}
          </div>` : p}
      <ul class="aby-oe__grid" style=${`--aby-oe-cols:${r}`}>${e.map((i) => this.renderCard(i))}</ul>`, { extraClass: "aby-oe" });
  }
}
m([
  b()
], d.prototype, "cards");
m([
  b()
], d.prototype, "loaded");
m([
  b()
], d.prototype, "color");
m([
  b()
], d.prototype, "picks");
m([
  b()
], d.prototype, "invalid");
m([
  b()
], d.prototype, "pressing");
typeof d < "u" && d.registerSallaComponent("salla-occasion-edit");
export {
  d as default
};
