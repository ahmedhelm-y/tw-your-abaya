import { html as r, nothing as b } from "lit";
import { state as g } from "lit/decorators.js";
import { unsafeHTML as y } from "lit/directives/unsafe-html.js";
import { i as S, v as z, t as A, o as P, b as j } from "./bundle-MR6k8MyO.js";
import { b as L } from "./buy-D6n2j5jF.js";
import { f as q, t as l, m as u, a as B, i as N, r as C } from "./styles-vAeqvApy.js";
import { o as O } from "./fit-Cpxi4Lua.js";
import { A as I, p as T } from "./section-Cbwxq9g0.js";
var E = Object.defineProperty, _ = (n, e, t, i) => {
  for (var a = void 0, s = n.length - 1, m; s >= 0; s--)
    (m = n[s]) && (a = m(e, t, a) || a);
  return a && E(e, t, a), a;
};
const H = `
.aby-bb__grid { display: grid; gap: .875rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@container (min-width: 768px) { .aby-bb__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; } }
.aby-bb__card { position: relative; display: flex; flex-direction: column; border: 2px solid color-mix(in srgb, var(--aby-text) 15%, transparent);
  border-radius: 1rem; background: var(--aby-card); overflow: hidden; transition: border-color .2s ease; }
.aby-bb__card.is-on { border-color: var(--aby-accent-ink); }
.aby-bb__pick { display: flex; flex-direction: column; width: 100%; padding: 0; border: 0; background: none; color: inherit; font: inherit; text-align: start; cursor: pointer; }
.aby-bb__pick:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: -4px; }
.aby-bb__img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: var(--aby-bg); }
.aby-bb__check { position: absolute; top: .625rem; inset-inline-start: .625rem; width: 1.75rem; height: 1.75rem; display: grid; place-items: center;
  border: 2px solid #fff; border-radius: .5rem; background: rgb(0 0 0 / 30%); color: #fff; }
.aby-bb__card.is-on .aby-bb__check { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-bb__check svg { width: 1rem; height: 1rem; opacity: 0; }
.aby-bb__card.is-on .aby-bb__check svg { opacity: 1; }
.aby-bb__info { display: flex; flex-direction: column; gap: .25rem; padding: .75rem .875rem 0; }
.aby-bb__name { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 700; font-size: .9375rem; line-height: 1.5; color: var(--aby-title); }
.aby-bb__price { font-weight: 800; color: var(--aby-title); }
.aby-bb__opts { display: grid; gap: .375rem; padding: .625rem .875rem .875rem; margin-top: auto; }
.aby-bb__opts select { width: 100%; min-height: 2.75rem; padding: 0 .625rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent);
  border-radius: .625rem; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: .875rem; }
.aby-bb__opts select[aria-invalid="true"] { border-color: #d92d20; }
.aby-bb__miss { color: #d92d20; font-size: .8125rem; font-weight: 600; }
.aby-bb__bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding: 1rem 1.25rem;
  border-radius: 1rem; background: var(--aby-card); }
.aby-bb__sum { display: flex; flex-direction: column; gap: .125rem; }
.aby-bb__total { display: flex; align-items: baseline; gap: .5rem; font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-bb__total s { font-size: 1rem; font-weight: 500; opacity: .7; }
.aby-bb__offer { font-size: .875rem; }
.aby-bb__bar .aby-btn { flex: 1 1 14rem; }
.aby-bb__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`, F = r`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3 3 7-7" /></svg>`;
function K(n) {
  return (Array.isArray(n) ? n : typeof n == "string" ? n.split(",") : n ? [n] : []).map((t) => t && typeof t == "object" ? t.value ?? t.id : t).map((t) => String(t ?? "").trim()).filter(Boolean).slice(0, 6);
}
class p extends I {
  constructor() {
    super(...arguments), this.styleId = "complete-look", this.lines = [], this.loaded = !1, this.missing = {};
  }
  styles() {
    return H;
  }
  async connectedCallback() {
    super.connectedCallback();
    const e = this.cfg(), t = e.include_main !== !1 ? T(e, "main_product") : null, i = [.../* @__PURE__ */ new Set([...t ? [t] : [], ...K(e.products)])].slice(0, 6), a = (await Promise.all(i.map((s) => q(s)))).filter((s) => s && S(s));
    this.lines = a.map((s) => ({
      product: s,
      quantity: 1,
      options: {},
      selected: String(s.id) === t || e.preselect !== !1
    })), this.loaded = !0;
  }
  update_(e, t) {
    this.lines = this.lines.map((a, s) => s === e ? { ...a, ...t } : a);
    const i = String(this.lines[e].product.id);
    if (this.missing[i]) {
      const { [i]: a, ...s } = this.missing;
      this.missing = s;
    }
  }
  setOption(e, t, i) {
    const a = { ...this.lines[e].options };
    i ? a[String(t)] = Number(i) : delete a[String(t)], this.update_(e, { options: a, selected: !0 });
  }
  async onBuy() {
    var t;
    const e = z(this.lines, 1);
    if (this.missing = e.missing, !e.ok) {
      this.error = Object.keys(e.missing).length ? l({ ar: "اختاري المقاس لكل قطعة", en: "Choose a size for every piece" }) : l({ ar: "اختاري قطعة واحدة على الأقل", en: "Pick at least one piece" }), await this.updateComplete, (t = this.querySelector('select[aria-invalid="true"]')) == null || t.focus();
      return;
    }
    await this.press({ items: A(this.lines) });
  }
  renderCard(e, t) {
    var f, h, v, $, k;
    const i = e.product, a = (i.options || []).filter((o) => (o == null ? void 0 : o.required) && (o.details || []).length), s = this.missing[String(i.id)] || [], m = (Number(i.sale_price || i.price) || 0) + P(e);
    return r`<li class="aby-bb__card${e.selected ? " is-on" : ""}">
      <button type="button" class="aby-bb__pick" role="checkbox" aria-checked=${e.selected ? "true" : "false"}
        @click=${() => this.update_(t, { selected: !e.selected })}>
        <span class="aby-bb__check">${F}</span>
        ${(h = (f = i.images) == null ? void 0 : f[0]) != null && h.url || (v = i.image) != null && v.url ? r`<img class="aby-bb__img" src=${((k = ($ = i.images) == null ? void 0 : $[0]) == null ? void 0 : k.url) || i.image.url} alt="" loading="lazy" />` : b}
        <span class="aby-bb__info">
          <span class="aby-bb__name">${i.name}</span>
          <span class="aby-bb__price">${y(u(m))}</span>
        </span>
      </button>
      ${a.length ? r`<div class="aby-bb__opts">${a.map((o) => {
      const x = s.includes(Number(o.id)), w = `aby-bb-${i.id}-${o.id}`, d = O(o, B());
      return r`<label class="aby-visually-hidden" for=${w}>${d}</label>
              <select id=${w} aria-invalid=${x ? "true" : "false"} @change=${(c) => this.setOption(t, o.id, c.target.value)}>
                <option value="">${l({ ar: `اختاري ${d}`, en: `Choose ${d}` })}</option>
                ${o.details.map((c) => r`<option value=${c.id} ?disabled=${c.is_out} ?selected=${e.options[String(o.id)] === Number(c.id)}>${c.name}</option>`)}
              </select>
              ${x ? r`<span class="aby-bb__miss">${l({ ar: `اختاري ${d}`, en: `Choose ${d}` })}</span>` : b}`;
    })}</div>` : b}
    </li>`;
  }
  render() {
    if (!this.lines.length)
      return !this.loaded || N() ? b : this.frame(r`<p class="aby-bb__empty">${l({ ar: "اختر قطع اللوك من إعدادات هذا القسم", en: "Pick the look's pieces in this section's settings" })}</p>`);
    const e = j(this.lines), t = C(this.cfg().offer_text), i = L({ items: [{ id: "x", quantity: 1 }] }) !== "none";
    return this.frame(r`<ul class="aby-bb__grid">${this.lines.map((a, s) => this.renderCard(a, s))}</ul>
      <div class="aby-bb__bar">
        <div class="aby-bb__sum" aria-live="polite">
          <span>${l({ ar: e.count === 1 ? "قطعة واحدة" : e.count === 2 ? "قطعتين" : `${e.count} قطع`, en: `${e.count} pieces` })}</span>
          <span class="aby-bb__total">${y(u(e.total))}
            ${e.regular > e.total ? r`<s>${y(u(e.regular))}</s>` : b}</span>
          ${t ? r`<span class="aby-bb__offer">${t}</span>` : b}
        </div>
        ${i ? r`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} ?disabled=${!e.count}
              @click=${() => this.onBuy()}>${C(this.cfg().buy_text) || l({ ar: "أضيفي اللوك للسلة", en: "Add the look" })}</button>` : b}
      </div>`, { extraClass: "aby-bb aby-cl" });
  }
}
_([
  g()
], p.prototype, "lines");
_([
  g()
], p.prototype, "loaded");
_([
  g()
], p.prototype, "missing");
typeof p < "u" && p.registerSallaComponent("salla-complete-look");
export {
  p as default
};
