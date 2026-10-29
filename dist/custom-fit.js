import { nothing as o, html as l } from "lit";
import { state as h } from "lit/decorators.js";
import { b as _ } from "./buy-D6n2j5jF.js";
import { f as v, g as $, r as d, t as c, u as x, i as m } from "./styles-vAeqvApy.js";
import { m as w, s as k, w as C } from "./fit-Cpxi4Lua.js";
import { A as z, p } from "./section-Cbwxq9g0.js";
var S = Object.defineProperty, y = (b, t, a, r) => {
  for (var e = void 0, i = b.length - 1, s; i >= 0; i--)
    (s = b[i]) && (e = s(t, a, e) || e);
  return e && S(t, a, e), e;
};
const q = `
.aby-cf__grid { display: grid; gap: 1.5rem; }
@container (min-width: 768px) { .aby-cf__grid { grid-template-columns: 2fr 3fr; gap: 2.5rem; align-items: start; } }
.aby-cf__media img { width: 100%; height: auto; border-radius: 1.25rem; background: #fff; }
.aby-cf__form { display: grid; gap: 1rem; padding: 1.5rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-cf__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .875rem; }
@container (max-width: 420px) { .aby-cf__fields { grid-template-columns: minmax(0, 1fr); } }
.aby-cf__field { display: grid; gap: .25rem; min-width: 0; }
.aby-cf__field label { font-weight: 700; font-size: .875rem; color: var(--aby-title); }
.aby-cf__field small { font-size: .75rem; color: var(--aby-text); }
.aby-cf__input { display: flex; align-items: center; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem; background: var(--aby-bg); }
.aby-cf__input:focus-within { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-cf__input input { width: 100%; min-width: 0; min-height: 2.75rem; padding: 0 .875rem; border: 0; background: none; color: var(--aby-title); font: inherit; font-weight: 700; outline: 0; }
.aby-cf__input span { padding-inline-end: .875rem; font-size: .875rem; color: var(--aby-text); }
.aby-cf__notes { width: 100%; min-height: 5.5rem; padding: .75rem .875rem; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; resize: vertical; }
.aby-cf__notes:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-cf__actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.aby-cf__actions .aby-btn { flex: 1 1 12rem; }
.aby-cf__wa { background: transparent; color: var(--aby-accent-ink); border-color: var(--aby-accent-ink); }
.aby-cf__hint { margin: 0; font-size: .875rem; }
.aby-cf__free { justify-self: start; padding: .25rem .75rem; border-radius: 999px; background: var(--aby-accent); color: var(--aby-accent-text); font-size: .8125rem; font-weight: 700; }
`;
class f extends z {
  constructor() {
    super(...arguments), this.styleId = "custom-fit", this.product = null, this.values = {}, this.notes = "";
  }
  styles() {
    return q;
  }
  async connectedCallback() {
    super.connectedCallback(), this.product = await v(p(this.cfg()));
  }
  fields() {
    return $(this.cfg().fields, "fields").map((t) => ({ label: d(t.label), unit: d(t.unit), hint: d(t.hint) })).filter((t) => t.label);
  }
  message() {
    var r;
    const t = this.fields().map((e, i) => ({ label: e.label, unit: e.unit, value: this.values[i] || "" })), a = (r = this.product) != null && r.name ? c({ ar: `تفصيل: ${this.product.name}`, en: `Tailoring: ${this.product.name}` }) : "";
    return w(t, this.notes, a);
  }
  /** The cart takes the measurements as the item's note when the product allows notes. */
  cartReady() {
    var t;
    return !!((t = this.product) != null && t.can_add_note) && x(this.cfg().send_via) !== "whatsapp";
  }
  request() {
    var e, i;
    const t = p(this.cfg());
    if (!t) return null;
    const a = k(String(((e = this.product) == null ? void 0 : e.id) ?? t));
    return (((i = this.product) == null ? void 0 : i.options) || []).some((s) => (s == null ? void 0 : s.required) && (s.details || []).length && !a[String(s.id)]) ? null : { items: [{ id: t, quantity: 1, notes: this.message(), options: Object.keys(a).length ? a : void 0 }], product: this.product };
  }
  async onCart() {
    var a;
    if (!Object.values(this.values).some((r) => r.trim()) && !this.notes.trim()) {
      this.error = c({ ar: "اكتبي مقاس واحد على الأقل", en: "Enter at least one measurement" });
      return;
    }
    const t = this.request();
    if (!t) {
      this.error = c({ ar: "اختاري المقاس واللون من قسم المقاس فوق، وبعدين أضيفي للسلة", en: "Choose the size and color in the fit section above, then add to cart" }), (a = document.querySelector(".aby-ff")) == null || a.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    await this.press(t);
  }
  render() {
    const t = this.cfg(), a = this.fields();
    if (!a.length && m()) return o;
    const r = C(t.whatsapp, this.message()), e = this.cartReady() && !!p(t) && _({ items: [{ id: "x", quantity: 1 }] }) !== "none";
    if (!e && !r && m()) return o;
    const i = d(t.free_text), s = String(t.image || "");
    return this.frame(l`<div class="aby-cf__grid">
      ${s ? l`<div class="aby-cf__media"><img src=${s} alt="" loading="lazy" /></div>` : o}
      <form class="aby-cf__form" @submit=${(n) => {
      n.preventDefault(), e && this.onCart();
    }}>
        ${i ? l`<span class="aby-cf__free">${i}</span>` : o}
        <div class="aby-cf__fields">${a.map((n, u) => l`<div class="aby-cf__field">
          <label for=${`aby-cf-${u}`}>${n.label}</label>
          <div class="aby-cf__input"><input id=${`aby-cf-${u}`} inputmode="decimal" autocomplete="off" .value=${this.values[u] || ""}
            @input=${(g) => {
      this.values = { ...this.values, [u]: g.target.value.slice(0, 12) }, this.error = "";
    }} />
            ${n.unit ? l`<span>${n.unit}</span>` : o}</div>
          ${n.hint ? l`<small>${n.hint}</small>` : o}
        </div>`)}</div>
        <label class="aby-visually-hidden" for="aby-cf-notes">${c({ ar: "ملاحظات", en: "Notes" })}</label>
        <textarea id="aby-cf-notes" class="aby-cf__notes" maxlength="500" .value=${this.notes}
          placeholder=${d(t.notes_placeholder) || c({ ar: "أي تعديل تحبيه: طول الكم، زراير مخفية، جيوب...", en: "Any changes: sleeve length, hidden buttons, pockets..." })}
          @input=${(n) => this.notes = n.target.value}></textarea>
        <div class="aby-cf__actions">
          ${e ? l`<button type="submit" class="aby-btn" aria-busy=${this.busy ? "true" : "false"}>${this.buyLabel()}</button>` : o}
          ${r ? l`<a class=${`aby-btn${e ? " aby-cf__wa" : ""}`} href=${r} target="_blank" rel="noopener">${c({ ar: "ابعتي المقاسات على الواتساب", en: "Send on WhatsApp" })}</a>` : o}
        </div>
        ${!e && !r && !m() ? l`<p class="aby-cf__hint">${c({ ar: 'فعّل "إضافة ملاحظة" على المنتج في سلة، أو اكتب رقم الواتساب في الإعدادات', en: "Turn on product notes in Salla, or add a WhatsApp number in the settings" })}</p>` : o}
      </form>
    </div>`, { extraClass: "aby-cf" });
  }
}
y([
  h()
], f.prototype, "product");
y([
  h()
], f.prototype, "values");
y([
  h()
], f.prototype, "notes");
typeof f < "u" && f.registerSallaComponent("salla-custom-fit");
export {
  f as default
};
