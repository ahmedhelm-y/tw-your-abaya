import { nothing as c, html as l } from "lit";
import { state as h } from "lit/decorators.js";
import { unsafeHTML as N } from "lit/directives/unsafe-html.js";
import { b as S } from "./buy-Drq8RgLr.js";
import { f as C, g as A, l as I, a as x, t as o, r as u, i as L, m as O } from "./styles-vAeqvApy.js";
import { r as P, f as y, a as k, b as F, o as w, l as T, c as j, d as B } from "./fit-Cpxi4Lua.js";
import { A as M, p as q } from "./section-DUIqt8g_.js";
var Y = Object.defineProperty, f = (g, t, e, a) => {
  for (var i = void 0, r = g.length - 1, n; r >= 0; r--)
    (n = g[r]) && (i = n(t, e, i) || i);
  return i && Y(t, e, i), i;
};
const H = `
.aby-ff__grid { display: grid; gap: 1.25rem; }
@container (min-width: 768px) { .aby-ff__grid { grid-template-columns: 2fr 3fr; gap: 2.5rem; align-items: start; } }
.aby-ff__advisor { display: grid; gap: 1rem; padding: 1.25rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-ff__advisor h3 { margin: 0; font-size: 1.125rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__field { display: grid; gap: .375rem; }
.aby-ff__field label { font-weight: 700; font-size: .9375rem; color: var(--aby-title); }
.aby-ff__height { display: flex; align-items: center; gap: .5rem; }
.aby-ff__height input { width: 100%; min-height: 3rem; padding: 0 1rem; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: 1.125rem; font-weight: 700; }
.aby-ff__height input:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-ff__unit { font-weight: 700; color: var(--aby-text); }
.aby-ff__heels { display: flex; align-items: center; gap: .625rem; min-height: 2.75rem; cursor: pointer; font-size: .9375rem; }
.aby-ff__heels input { width: 1.25rem; height: 1.25rem; accent-color: var(--aby-accent); }
.aby-ff__result { margin: 0; padding: .875rem 1rem; border-radius: .875rem; background: var(--aby-bg); color: var(--aby-text); font-size: .9375rem; line-height: 1.7; }
.aby-ff__result strong { display: block; font-size: 1.375rem; color: var(--aby-accent-ink); }
.aby-ff__chart { justify-self: start; padding: 0; border: 0; background: none; color: var(--aby-accent-ink); font: inherit; font-weight: 700;
  text-decoration: underline; text-underline-offset: 4px; cursor: pointer; min-height: 2.75rem; }
.aby-ff__table { width: 100%; border-collapse: collapse; font-size: .875rem; font-variant-numeric: tabular-nums; }
.aby-ff__table th, .aby-ff__table td { padding: .375rem .5rem; border-bottom: 1px solid color-mix(in srgb, var(--aby-text) 15%, transparent); text-align: start; }
.aby-ff__table th { color: var(--aby-title); }
.aby-ff__table tr.is-on td { color: var(--aby-accent-ink); font-weight: 800; }
.aby-ff__pick { display: grid; gap: 1.25rem; }
.aby-ff__group { display: grid; gap: .625rem; border: 0; margin: 0; padding: 0; min-width: 0; }
.aby-ff__group legend { padding: 0; margin-bottom: .625rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__group legend span { font-weight: 500; color: var(--aby-text); }
.aby-ff__opts { display: flex; flex-wrap: wrap; gap: .5rem; }
.aby-ff__opt { position: relative; min-width: 3.25rem; min-height: 2.75rem; padding: .375rem .875rem; border: 1.5px solid color-mix(in srgb, var(--aby-text) 25%, transparent);
  border-radius: .75rem; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-weight: 700; cursor: pointer; }
.aby-ff__opt[aria-checked="true"] { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-ff__opt[aria-disabled="true"] { opacity: .4; text-decoration: line-through; cursor: not-allowed; }
.aby-ff__opt:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-ff__opt.is-tip::after { content: attr(data-tip); position: absolute; top: -.65rem; inset-inline-end: -.25rem; padding: 0 .375rem; border-radius: 999px;
  background: var(--aby-title); color: var(--aby-bg); font-size: .6875rem; line-height: 1.4; white-space: nowrap; }
.aby-ff__swatch { display: inline-flex; align-items: center; gap: .5rem; }
.aby-ff__swatch i { width: 1.125rem; height: 1.125rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); }
.aby-ff__stock { justify-self: start; padding: .25rem .75rem; border-radius: 999px; background: color-mix(in srgb, #d92d20 12%, var(--aby-bg)); color: #b42318;
  font-size: .875rem; font-weight: 700; }
.aby-block.aby-dark .aby-ff__stock, html.aby-mode-dark .aby-auto .aby-ff__stock { color: #fda29b; }
.aby-ff__actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.aby-ff__price { font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__actions .aby-btn { flex: 1 1 12rem; }
.aby-ff__qty { display: flex; align-items: center; height: 2.75rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem; }
.aby-ff__qty button { width: 2.75rem; height: 100%; border: 0; background: none; color: var(--aby-title); font-size: 1.25rem; cursor: pointer; }
.aby-ff__qty button:disabled { opacity: .35; cursor: default; }
.aby-ff__qty output { min-width: 2rem; text-align: center; font-weight: 700; color: var(--aby-title); }
.aby-ff__dialog { width: min(40rem, calc(100vw - 2rem)); max-height: 85vh; padding: 1rem; border: 0; border-radius: 1rem; background: #fff; }
.aby-ff__dialog::backdrop { background: rgb(0 0 0 / 60%); }
.aby-ff__dialog img { width: 100%; height: auto; }
.aby-ff__close { display: block; margin-inline-start: auto; width: 2.75rem; height: 2.75rem; border: 0; background: none; font-size: 1.75rem; cursor: pointer; color: #111; }
.aby-ff__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;
class d extends M {
  constructor() {
    super(...arguments), this.styleId = "fit-finder", this.product = null, this.loaded = !1, this.height = "", this.heels = !1, this.chosen = {}, this.quantity = 1, this.chart = !1;
  }
  styles() {
    return H;
  }
  async connectedCallback() {
    super.connectedCallback(), this.product = await C(q(this.cfg())), this.loaded = !0;
  }
  rows() {
    return A(this.cfg().lengths, "lengths").filter((t) => String(t.length ?? "").trim());
  }
  advice(t) {
    return P(Number(this.height), t, this.heels);
  }
  onHeight(t, e) {
    this.height = t.replace(/[^\d٠-٩]/g, "").slice(0, 3).replace(/[٠-٩]/g, (a) => String("٠١٢٣٤٥٦٧٨٩".indexOf(a))), this.applyAdvice(e);
  }
  /** The advised length is picked for the shopper, who can still change it. */
  applyAdvice(t) {
    const e = this.advice(t), a = y(this.product, "length"), i = e >= 0 ? k(a, t[e].length) : null;
    i && !i.is_out && (this.chosen = { ...this.chosen, length: Number(i.id) });
  }
  updated(t) {
    if (!t.has("chosen") || !this.product) return;
    const e = {};
    for (const { kind: a, option: i } of this.options()) this.chosen[a] && (e[String(i.id)] = this.chosen[a]);
    F({ productId: String(this.product.id), options: e });
  }
  options() {
    return ["size", "length", "color"].map((t) => ({ kind: t, option: y(this.product, t) })).filter((t) => t.option);
  }
  request() {
    var r;
    const t = {};
    for (const { kind: n, option: s } of this.options()) this.chosen[n] && (t[String(s.id)] = this.chosen[n]);
    const e = q(this.cfg()), a = !!I(), i = Object.keys(t).length > 0;
    return a || !e ? { quantity: this.quantity, ...i ? { options: t } : {}, product: this.product } : { items: [{ id: e, quantity: this.quantity, options: i ? t : void 0, max: Number((r = this.product) == null ? void 0 : r.max_quantity) || void 0 }], product: this.product };
  }
  async onBuy() {
    const t = this.options().find(({ kind: e, option: a }) => a.required && !this.chosen[e]);
    if (t) {
      const e = w(t.option, x());
      this.error = o({ ar: `اختاري ${e}`, en: `Choose ${e}` });
      return;
    }
    await this.press(this.request());
  }
  price() {
    var e, a;
    let t = Number(((e = this.product) == null ? void 0 : e.sale_price) || ((a = this.product) == null ? void 0 : a.price)) || 0;
    for (const { kind: i, option: r } of this.options()) {
      const n = r.details.find((s) => Number(s.id) === this.chosen[i]);
      t += Number(n == null ? void 0 : n.additional_price) || 0;
    }
    return t;
  }
  stockLeft() {
    const t = y(this.product, "size"), e = t && this.chosen.size ? t.details.find((a) => Number(a.id) === this.chosen.size) : void 0;
    return T(j(this.product, e), Number(this.cfg().stock_threshold) || 5);
  }
  renderGroup(t, e, a) {
    var n;
    const i = (n = e.details.find((s) => Number(s.id) === this.chosen[t])) == null ? void 0 : n.name, r = w(e, x());
    return l`<fieldset class="aby-ff__group">
      <legend>${r}${i ? l` <span>: ${i}</span>` : c}</legend>
      <div class="aby-ff__opts" role="radiogroup" aria-label=${r}>
        ${e.details.map((s) => {
      const m = this.chosen[t] === Number(s.id), b = a === Number(s.id);
      return l`<button type="button" role="radio" aria-checked=${m ? "true" : "false"} aria-disabled=${s.is_out ? "true" : "false"}
            class=${`aby-ff__opt${b ? " is-tip" : ""}`} data-tip=${b ? o({ ar: "مناسب لك", en: "Your fit" }) : c}
            @click=${() => {
        s.is_out || (this.chosen = { ...this.chosen, [t]: Number(s.id) }, this.error = "");
      }}>
            ${t === "color" ? l`<span class="aby-ff__swatch"><i style=${`background:${B(s.name, s.color)}`}></i>${s.name}</span>` : s.name}
          </button>`;
    })}
      </div>
    </fieldset>`;
  }
  renderAdvisor(t) {
    const e = this.cfg(), a = this.advice(t), i = String(e.size_chart || "");
    return l`<div class="aby-ff__advisor">
      <h3>${u(e.advisor_title) || o({ ar: "اعرفي طولك المناسب", en: "Find your length" })}</h3>
      <div class="aby-ff__field">
        <label for="aby-ff-height">${o({ ar: "طولك", en: "Your height" })}</label>
        <div class="aby-ff__height">
          <input id="aby-ff-height" inputmode="numeric" autocomplete="off" placeholder="160" .value=${this.height}
            @input=${(r) => this.onHeight(r.target.value, t)} />
          <span class="aby-ff__unit">${o({ ar: "سم", en: "cm" })}</span>
        </div>
      </div>
      ${e.show_heels !== !1 ? l`<label class="aby-ff__heels"><input type="checkbox" .checked=${this.heels}
            @change=${(r) => {
      this.heels = r.target.checked, this.applyAdvice(t);
    }} />
            ${o({ ar: "هلبسها مع كعب", en: "I'll wear heels" })}</label>` : c}
      <p class="aby-ff__result" aria-live="polite">${a >= 0 ? l`${o({ ar: "الطول المناسب لك", en: "Your length" })}<strong>${u(t[a].length)}</strong>` : o({ ar: "اكتبي طولك بالسنتيمتر ونختار لك طول العباية", en: "Type your height in cm and we'll pick the abaya length" })}</p>
      ${t.length ? l`<table class="aby-ff__table"><thead><tr><th>${o({ ar: "طول العباية", en: "Abaya length" })}</th><th>${o({ ar: "طولك (سم)", en: "Your height (cm)" })}</th></tr></thead>
            <tbody>${t.map((r, n) => l`<tr class=${n === a ? "is-on" : ""}><td>${u(r.length)}</td><td>${Number(r.min)} – ${Number(r.max)}</td></tr>`)}</tbody></table>` : c}
      ${i ? l`<button type="button" class="aby-ff__chart" @click=${() => this.openChart()}>${o({ ar: "جدول المقاسات", en: "Size chart" })}</button>` : c}
    </div>`;
  }
  async openChart() {
    var t, e;
    this.chart = !0, await this.updateComplete, (e = (t = this.querySelector(".aby-ff__dialog")) == null ? void 0 : t.showModal) == null || e.call(t);
  }
  closeChart() {
    var t, e;
    (e = (t = this.querySelector(".aby-ff__dialog")) == null ? void 0 : t.close) == null || e.call(t), this.chart = !1;
  }
  render() {
    var _, v, $;
    const t = this.rows();
    if (!this.product)
      return !this.loaded || L() ? c : this.frame(l`<p class="aby-ff__empty">${o({ ar: "اختر العباية من إعدادات هذا القسم", en: "Pick the abaya in this section's settings" })}</p>`);
    const e = y(this.product, "length"), a = this.advice(t), i = a >= 0 ? k(e, t[a].length) : null, r = this.stockLeft(), n = u(this.cfg().stock_text), s = Number((_ = this.product) == null ? void 0 : _.max_quantity) || 99, m = S(this.request()) !== "none", b = ((v = this.product) == null ? void 0 : v.is_available) === !1 || (($ = this.product) == null ? void 0 : $.status) === "out";
    return this.frame(l`<div class="aby-ff__grid">
      ${t.length ? this.renderAdvisor(t) : c}
      <div class="aby-ff__pick">
        ${this.options().map(({ kind: p, option: z }) => this.renderGroup(p, z, p === "length" && i ? Number(i.id) : null))}
        ${r !== null ? l`<span class="aby-ff__stock" role="status">${o({ ar: `باقي ${r} ${r === 1 ? "قطعة" : r === 2 ? "قطعتين" : "قطع"} بس`, en: `Only ${r} left` })}</span>` : n ? l`<span class="aby-ff__stock">${n}</span>` : c}
        <div class="aby-ff__actions">
          <span class="aby-ff__price">${N(O(this.price()))}</span>
          ${m ? l`<div class="aby-ff__qty" role="group" aria-label=${o({ ar: "الكمية", en: "Quantity" })}>
                <button type="button" aria-label=${o({ ar: "زيادة الكمية", en: "Increase quantity" })} ?disabled=${this.quantity >= s} @click=${() => this.quantity = Math.min(s, this.quantity + 1)}>+</button>
                <output>${this.quantity}</output>
                <button type="button" aria-label=${o({ ar: "تقليل الكمية", en: "Decrease quantity" })} ?disabled=${this.quantity <= 1} @click=${() => this.quantity = Math.max(1, this.quantity - 1)}>−</button>
              </div>
              <button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} ?disabled=${b} @click=${() => this.onBuy()}>
                ${b ? o({ ar: "نفدت الكمية", en: "Sold out" }) : this.buyLabel()}</button>` : c}
        </div>
      </div>
    </div>
    ${this.chart ? l`<dialog class="aby-ff__dialog" @close=${() => this.chart = !1} @click=${(p) => {
      p.target === p.currentTarget && this.closeChart();
    }}>
          <button type="button" class="aby-ff__close" aria-label=${o({ ar: "إغلاق", en: "Close" })} @click=${() => this.closeChart()}>×</button>
          <img src=${String(this.cfg().size_chart)} alt=${o({ ar: "جدول المقاسات", en: "Size chart" })} />
        </dialog>` : c}`, { extraClass: "aby-ff" });
  }
}
f([
  h()
], d.prototype, "product");
f([
  h()
], d.prototype, "loaded");
f([
  h()
], d.prototype, "height");
f([
  h()
], d.prototype, "heels");
f([
  h()
], d.prototype, "chosen");
f([
  h()
], d.prototype, "quantity");
f([
  h()
], d.prototype, "chart");
typeof d < "u" && d.registerSallaComponent("salla-fit-finder");
export {
  d as default
};
