import { nothing as l, html as n } from "lit";
import { state as v } from "lit/decorators.js";
import { unsafeHTML as g } from "lit/directives/unsafe-html.js";
import { p as w, u as b, c as $, f as k, m as f, r as u, b as M } from "./styles-C5ta92Qj.js";
import { A as P, p as C } from "./section-DksPXwqH.js";
let _ = "", m = [];
function z(s) {
  const e = w(s), a = String(b(s.default_mode) || "light"), r = `${JSON.stringify(e)}|${a}`, t = document.documentElement, o = $(a);
  if (r === _) return o;
  _ = r;
  for (const i of m) t.style.removeProperty(i);
  for (const [i, c] of Object.entries(e)) t.style.setProperty(i, c);
  return m = Object.keys(e), t.classList.toggle("aby-mode-dark", o === "dark"), t.classList.toggle("aby-mode-light", o === "light"), o;
}
function L() {
  const s = document.documentElement;
  for (const e of m) s.style.removeProperty(e);
  m = [], _ = "", s.classList.remove("aby-mode-dark", "aby-mode-light");
}
var S = Object.defineProperty, x = (s, e, a, r) => {
  for (var t = void 0, o = s.length - 1, i; o >= 0; o--)
    (i = s[o]) && (t = i(e, a, t) || t);
  return t && S(e, a, t), t;
};
const j = `
.aby-hero { position: relative; padding: 0; overflow: hidden; }
.aby-hero > .aby-container { max-width: none; padding: 0; }
.aby-hero__media { position: relative; overflow: hidden; background: var(--aby-card); }
.aby-hero__media img, .aby-hero__media video { width: 100%; height: 100%; object-fit: cover; }
.aby-hero__body { display: flex; flex-direction: column; gap: 1rem; max-width: 36rem; }
.aby-hero__badge { align-self: flex-start; padding: .375rem .875rem; border-radius: 999px; background: var(--aby-accent); color: var(--aby-accent-text);
  font-size: .8125rem; font-weight: 700; }
.aby-hero__title { margin: 0; font-size: 2.25rem; line-height: 1.2; font-weight: 800; color: var(--aby-title); }
.aby-hero__sub { margin: 0; font-size: 1.0625rem; line-height: 1.8; color: var(--aby-text); }
.aby-hero__cta { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: .5rem; }
.aby-hero__price { display: flex; align-items: baseline; gap: .5rem; font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-hero__price s { font-size: 1rem; font-weight: 500; opacity: .7; }
@container (min-width: 768px) { .aby-hero__title { font-size: 3.25rem; } }

/* Overlay: text over full-bleed media, on a dark veil; the body sits above the positioned media */
.aby-hero--overlay .aby-hero__body { position: relative; z-index: 1; }
.aby-hero--overlay .aby-hero__media { position: absolute; inset: 0; background: color-mix(in srgb, var(--aby-accent) 25%, #0d0b0a); }
.aby-hero--overlay .aby-hero__media::after { content: ""; position: absolute; inset: 0; background: rgb(0 0 0 / var(--aby-hero-veil, .35)); }
.aby-hero--overlay .aby-hero__wrap { display: flex; align-items: center; min-height: var(--aby-hero-h, 85vh);
  max-width: 1200px; margin-inline: auto; padding: 5rem 1rem 3rem; }
.aby-hero--overlay.aby-hero--center .aby-hero__wrap { justify-content: center; text-align: center; }
.aby-hero--overlay.aby-hero--center .aby-hero__body { align-items: center; }
.aby-hero--overlay.aby-hero--center .aby-hero__badge { align-self: center; }
.aby-hero--overlay .aby-hero__title, .aby-hero--overlay .aby-hero__sub, .aby-hero--overlay .aby-hero__price { color: #fff; }

/* Split: media beside the text */
.aby-hero--split .aby-hero__wrap { display: grid; gap: 2rem; max-width: 1200px; margin-inline: auto; padding: 2.5rem 1rem; align-items: center; }
.aby-hero--split .aby-hero__media { aspect-ratio: 4 / 5; border-radius: 1.25rem; }
@container (min-width: 768px) { .aby-hero--split .aby-hero__wrap { grid-template-columns: 1fr 1fr; gap: 3.5rem; padding-block: 4rem; } }
@container (max-width: 767px) { .aby-hero--split .aby-hero__media { order: -1; aspect-ratio: 1 / 1; } }
`;
class y extends P {
  constructor() {
    super(...arguments), this.styleId = "hero", this.product = null, this.mobile = !1, this.onMedia = (e) => {
      this.mobile = e.matches;
    };
  }
  styles() {
    return j;
  }
  async connectedCallback() {
    var e, a, r, t;
    super.connectedCallback(), this.media = (e = window.matchMedia) == null ? void 0 : e.call(window, "(max-width: 767px)"), this.mobile = !!((a = this.media) != null && a.matches), (t = (r = this.media) == null ? void 0 : r.addEventListener) == null || t.call(r, "change", this.onMedia), this.product = await k(C(this.cfg()));
  }
  disconnectedCallback() {
    var e, a;
    super.disconnectedCallback(), (a = (e = this.media) == null ? void 0 : e.removeEventListener) == null || a.call(e, "change", this.onMedia), L();
  }
  // The brand color and page mode are page-wide; the hero's own colors stay on the hero
  willUpdate() {
    const e = this.cfg();
    z({ brand_color: e.brand_color, default_mode: e.default_mode });
  }
  renderMedia() {
    var i, c, h;
    const e = this.cfg(), a = (d, p) => String(this.mobile && e[p] || e[d] || "");
    if (b(e.media) === "video") {
      const d = a("video_url", "video_url_mobile");
      if (d) {
        const p = (i = window.matchMedia) == null ? void 0 : i.call(window, "(prefers-reduced-motion: reduce)").matches;
        return n`<video .src=${d} poster=${e.poster || l} ?autoplay=${!p} muted loop playsinline preload="metadata"
          aria-hidden="true"></video>`;
      }
    }
    const r = a("image", "image_mobile"), t = ((h = (c = this.product) == null ? void 0 : c.image) == null ? void 0 : h.url) || "", o = r || t;
    return o ? n`<img src=${o} alt="" fetchpriority="high" />` : l;
  }
  renderPrice() {
    const e = this.product;
    if (!e || this.cfg().show_price === !1) return l;
    const a = Number(e.is_on_sale ? e.sale_price : e.price) || 0, r = Number(e.regular_price) || 0;
    return n`<span class="aby-hero__price">${g(f(a))}
      ${e.is_on_sale && r > a ? n`<s>${g(f(r))}</s>` : l}</span>`;
  }
  render() {
    const e = this.cfg(), a = b(e.layout) === "split" ? "split" : "overlay", r = b(e.content_align) !== "start", t = Math.min(Math.max(Number(e.overlay ?? 35), 0), 80) / 100, o = Math.min(Math.max(Number(e.height) || 85, 50), 100), i = u(e.badge), c = u(e.title), h = u(e.subtitle), d = M() !== "none";
    return this.frame(
      n`<div class="aby-hero__wrap" style=${`--aby-hero-veil:${t};--aby-hero-h:${o}vh`}>
        <div class="aby-hero__media">${this.renderMedia()}</div>
        <div class="aby-hero__body">
          ${i ? n`<span class="aby-hero__badge">${i}</span>` : l}
          ${c ? n`<h1 class="aby-hero__title">${c}</h1>` : l}
          ${h ? n`<p class="aby-hero__sub">${h}</p>` : l}
          <div class="aby-hero__cta">
            ${d ? n`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"}
                  @click=${() => this.press({ quantity: 1, product: this.product })}>${this.buyLabel()}</button>` : l}
            ${this.renderPrice()}
          </div>
        </div>
      </div>`,
      { hero: !0, title: !1, extraClass: `aby-hero aby-hero--${a}${r ? " aby-hero--center" : ""}` }
    );
  }
}
x([
  v()
], y.prototype, "product");
x([
  v()
], y.prototype, "mobile");
typeof y < "u" && y.registerSallaComponent("salla-hero");
export {
  y as default
};
