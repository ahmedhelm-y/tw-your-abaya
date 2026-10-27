import { nothing as n, html as i } from "lit";
import { state as g } from "lit/decorators.js";
import { unsafeHTML as _ } from "lit/directives/unsafe-html.js";
import { b as v } from "./buy-Drq8RgLr.js";
import { f as x, u as m, m as u, r as p } from "./styles-vAeqvApy.js";
import { A as w, p as $ } from "./section-DUIqt8g_.js";
var k = Object.defineProperty, f = (b, e, a, t) => {
  for (var r = void 0, o = b.length - 1, s; o >= 0; o--)
    (s = b[o]) && (r = s(e, a, r) || r);
  return r && k(e, a, r), r;
};
const M = `
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
class d extends w {
  constructor() {
    super(...arguments), this.styleId = "hero", this.product = null, this.mobile = !1, this.onMedia = (e) => {
      this.mobile = e.matches;
    };
  }
  styles() {
    return M;
  }
  async connectedCallback() {
    var e, a, t, r;
    super.connectedCallback(), this.media = (e = window.matchMedia) == null ? void 0 : e.call(window, "(max-width: 767px)"), this.mobile = !!((a = this.media) != null && a.matches), (r = (t = this.media) == null ? void 0 : t.addEventListener) == null || r.call(t, "change", this.onMedia), this.product = await x($(this.cfg()));
  }
  disconnectedCallback() {
    var e, a;
    super.disconnectedCallback(), (a = (e = this.media) == null ? void 0 : e.removeEventListener) == null || a.call(e, "change", this.onMedia);
  }
  renderMedia() {
    var s, h, c;
    const e = this.cfg(), a = (l, y) => String(this.mobile && e[y] || e[l] || "");
    if (m(e.media) === "video") {
      const l = a("video_url", "video_url_mobile");
      if (l) {
        const y = (s = window.matchMedia) == null ? void 0 : s.call(window, "(prefers-reduced-motion: reduce)").matches;
        return i`<video .src=${l} poster=${e.poster || n} ?autoplay=${!y} muted loop playsinline preload="metadata"
          aria-hidden="true"></video>`;
      }
    }
    const t = a("image", "image_mobile"), r = ((c = (h = this.product) == null ? void 0 : h.image) == null ? void 0 : c.url) || "", o = t || r;
    return o ? i`<img src=${o} alt="" fetchpriority="high" />` : n;
  }
  renderPrice() {
    const e = this.product;
    if (!e || this.cfg().show_price === !1) return n;
    const a = Number(e.is_on_sale ? e.sale_price : e.price) || 0, t = Number(e.regular_price) || 0;
    return i`<span class="aby-hero__price">${_(u(a))}
      ${e.is_on_sale && t > a ? i`<s>${_(u(t))}</s>` : n}</span>`;
  }
  render() {
    const e = this.cfg(), a = m(e.layout) === "split" ? "split" : "overlay", t = m(e.content_align) !== "start", r = Math.min(Math.max(Number(e.overlay ?? 35), 0), 80) / 100, o = Math.min(Math.max(Number(e.height) || 85, 50), 100), s = p(e.badge), h = p(e.title), c = p(e.subtitle), l = v() !== "none";
    return this.frame(
      i`<div class="aby-hero__wrap" style=${`--aby-hero-veil:${r};--aby-hero-h:${o}vh`}>
        <div class="aby-hero__media">${this.renderMedia()}</div>
        <div class="aby-hero__body">
          ${s ? i`<span class="aby-hero__badge">${s}</span>` : n}
          ${h ? i`<h1 class="aby-hero__title">${h}</h1>` : n}
          ${c ? i`<p class="aby-hero__sub">${c}</p>` : n}
          <div class="aby-hero__cta">
            ${l ? i`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"}
                  @click=${() => this.press({ quantity: 1, product: this.product })}>${this.buyLabel()}</button>` : n}
            ${this.renderPrice()}
          </div>
        </div>
      </div>`,
      { hero: !0, title: !1, extraClass: `aby-hero aby-hero--${a}${t ? " aby-hero--center" : ""}` }
    );
  }
}
f([
  g()
], d.prototype, "product");
f([
  g()
], d.prototype, "mobile");
typeof d < "u" && d.registerSallaComponent("salla-hero");
export {
  d as default
};
