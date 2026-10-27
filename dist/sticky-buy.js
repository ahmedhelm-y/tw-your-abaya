import { LitElement as g, nothing as l, html as o } from "lit";
import { property as x, state as b } from "lit/decorators.js";
import { unsafeHTML as h } from "lit/directives/unsafe-html.js";
import { a as w, b as k } from "./buy-Drq8RgLr.js";
import { e as $, b as q, f as S, l as I, h as H, m, c as B, u as C, r as P, q as E, t as u, s as z, d as L } from "./styles-vAeqvApy.js";
var O = Object.defineProperty, n = (y, t, s, e) => {
  for (var i = void 0, r = y.length - 1, c; r >= 0; r--)
    (c = y[r]) && (i = c(t, s, i) || i);
  return i && O(t, s, i), i;
};
const j = `
.aby-sb { position: fixed; inset-inline: 0; bottom: 0; z-index: 40; padding-bottom: env(safe-area-inset-bottom);
  background: color-mix(in srgb, var(--aby-bg) 92%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 -1px 0 color-mix(in srgb, var(--aby-text) 12%, transparent), 0 -12px 32px -24px rgb(0 0 0 / 45%);
  transform: translateY(110%); visibility: hidden; transition: transform .35s ease, visibility 0s linear .35s; }
.aby-sb.is-shown { transform: none; visibility: visible; transition: transform .35s ease; }
/* In the editor and previews the bar sits in the page, so the merchant can see and edit it */
.aby-sb--inline { position: static; transform: none; visibility: visible; transition: none; }
@media (prefers-reduced-motion: reduce) { .aby-sb, .aby-sb.is-shown { transition: none; } }
.aby-sb__inner { display: flex; align-items: center; gap: .75rem; max-width: 1200px; margin-inline: auto; padding: .625rem 1rem; }
.aby-sb__info { display: flex; align-items: center; gap: .75rem; flex: 1 1 auto; min-width: 0; }
.aby-sb__img { width: 2.75rem; height: 2.75rem; flex: 0 0 auto; border-radius: .5rem; object-fit: cover; background: var(--aby-card); }
.aby-sb__name { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; font-size: .9375rem; color: var(--aby-title); }
.aby-sb__price { display: flex; align-items: baseline; gap: .375rem; font-size: .875rem; color: var(--aby-text); }
.aby-sb__price b { color: var(--aby-title); font-size: 1rem; }
.aby-sb__price s { opacity: .7; }
.aby-sb__qty { display: flex; align-items: center; height: 2.75rem; flex: 0 0 auto; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem; }
.aby-sb__qty button { width: 2.5rem; height: 100%; border: 0; background: none; color: var(--aby-title); font-size: 1.25rem; cursor: pointer; }
.aby-sb__qty button:disabled { opacity: .35; cursor: default; }
.aby-sb__qty output { min-width: 1.75rem; text-align: center; font-weight: 700; color: var(--aby-title); }
.aby-sb__buy { flex: 0 0 auto; }
@media (max-width: 767px) {
  .aby-sb--desktop { display: none; }
  .aby-sb__img { display: none; }
  .aby-sb__buy { flex: 1 1 auto; }
  .aby-sb__info { flex: 0 1 auto; max-width: 40%; flex-direction: column; align-items: flex-start; gap: 0; }
}
@media (min-width: 768px) { .aby-sb--mobile { display: none; } }
`;
class a extends g {
  constructor() {
    super(...arguments), this.product = null, this.pastHero = !1, this.checkoutInView = !1, this.quantity = 1, this.busy = !1, this.error = "", this.observers = [], this.noHero = !1, this.onScroll = () => {
      this.noHero && (this.pastHero = (window.scrollY || document.documentElement.scrollTop) > 600);
    };
  }
  createRenderRoot() {
    return this;
  }
  async connectedCallback() {
    super.connectedCallback(), this.classList.add("aby-host"), $(), q("aby-sticky-buy", j), window.setTimeout(() => this.watch(), 0), this.product = await S(I());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.observers.forEach((t) => t.disconnect()), this.observers = [], window.removeEventListener("scroll", this.onScroll), document.documentElement.style.removeProperty("--aby-sb-h");
  }
  updated() {
    const t = this.querySelector(".aby-sb"), s = !!(t != null && t.classList.contains("is-shown"));
    document.documentElement.style.setProperty("--aby-sb-h", s ? `${t.offsetHeight}px` : "0px");
  }
  inline() {
    return !!this.closest(".component-card");
  }
  watch() {
    if (typeof IntersectionObserver > "u") {
      this.pastHero = !0;
      return;
    }
    const t = document.querySelector("[data-aby-hero]");
    if (t) {
      const e = new IntersectionObserver(([i]) => {
        this.pastHero = !i.isIntersecting && i.boundingClientRect.bottom < 0;
      });
      e.observe(t), this.observers.push(e);
    } else
      this.noHero = !0, window.addEventListener("scroll", this.onScroll, { passive: !0 }), this.onScroll();
    const s = document.querySelector(".s-block--fast-checkout");
    if (s) {
      const e = new IntersectionObserver(([i]) => {
        this.checkoutInView = i.isIntersecting;
      });
      e.observe(s), this.observers.push(e);
    }
  }
  async onBuy() {
    var s, e;
    if (this.busy) return;
    this.busy = !0, this.error = "";
    let t;
    try {
      t = await w({ quantity: this.quantity, product: this.product });
    } finally {
      this.busy = !1;
    }
    t.kind === "error" && (this.error = t.message || "", (e = (s = H()) == null ? void 0 : s.error) == null || e.call(s, t.message));
  }
  renderPrice() {
    const t = this.product, s = Number(t.is_on_sale ? t.sale_price : t.price) || 0, e = Number(t.regular_price) || 0;
    return o`<span class="aby-sb__price"><b>${h(m(s))}</b>
      ${t.is_on_sale && e > s ? o`<s>${h(m(e))}</s>` : l}</span>`;
  }
  render() {
    var p;
    const t = B(this.config), s = k();
    if (s === "none") return l;
    const e = this.product, i = this.inline(), r = i || this.pastHero && !this.checkoutInView, c = String(C(t.show_on) || "both"), f = P(t.buy_text) || (s === "link" ? E().text : "") || u({ ar: "اشتري الآن", en: "Buy now" }), d = Number(e == null ? void 0 : e.max_quantity) || 99, _ = t.show_quantity !== !1 && s !== "link", v = [
      "aby-block aby-sb",
      z(t),
      i ? "aby-sb--inline" : "",
      c === "mobile" ? "aby-sb--mobile" : c === "desktop" ? "aby-sb--desktop" : "",
      r ? "is-shown" : ""
    ].filter(Boolean).join(" ");
    return o`<div class=${v} style=${L(t)} role="region" aria-label=${u({ ar: "شراء سريع", en: "Quick buy" })} aria-hidden=${r ? "false" : "true"}>
      <div class="aby-sb__inner">
        ${e ? o`<div class="aby-sb__info">
              ${(p = e.image) != null && p.url ? o`<img class="aby-sb__img" src=${e.image.url} alt="" loading="lazy" />` : l}
              <div style="min-width:0">
                <div class="aby-sb__name">${e.name}</div>
                ${t.show_price !== !1 ? this.renderPrice() : l}
              </div>
            </div>` : o`<div class="aby-sb__info"></div>`}
        ${_ ? o`<div class="aby-sb__qty" role="group" aria-label=${u({ ar: "الكمية", en: "Quantity" })}>
              <button type="button" aria-label=${u({ ar: "زيادة الكمية", en: "Increase quantity" })} tabindex=${r ? 0 : -1} ?disabled=${this.quantity >= d} @click=${() => this.quantity = Math.min(d, this.quantity + 1)}>+</button>
              <output aria-live="polite">${this.quantity}</output>
              <button type="button" aria-label=${u({ ar: "تقليل الكمية", en: "Decrease quantity" })} tabindex=${r ? 0 : -1} ?disabled=${this.quantity <= 1} @click=${() => this.quantity = Math.max(1, this.quantity - 1)}>−</button>
            </div>` : l}
        <button type="button" class="aby-btn aby-sb__buy" tabindex=${r ? 0 : -1} aria-busy=${this.busy ? "true" : "false"} @click=${() => this.onBuy()}>${f}</button>
      </div>
      ${this.error ? o`<p class="aby-error aby-container" role="alert">${this.error}</p>` : l}
    </div>`;
  }
}
n([
  x({ type: Object })
], a.prototype, "config");
n([
  b()
], a.prototype, "product");
n([
  b()
], a.prototype, "pastHero");
n([
  b()
], a.prototype, "checkoutInView");
n([
  b()
], a.prototype, "quantity");
n([
  b()
], a.prototype, "busy");
n([
  b()
], a.prototype, "error");
typeof a < "u" && a.registerSallaComponent("salla-sticky-buy");
export {
  a as default
};
