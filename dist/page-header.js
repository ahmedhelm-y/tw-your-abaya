import { html as r, LitElement as k, nothing as y } from "lit";
import { property as $, state as b } from "lit/decorators.js";
import { a as M, b as C } from "./buy-D6n2j5jF.js";
import { c as l, e as B, b as P, p as j, j as E, k as S, u, n as K, h as f, g as z, o as L, r as _, t as m } from "./styles-vAeqvApy.js";
var O = Object.defineProperty, c = (d, e, t, a) => {
  for (var o = void 0, s = d.length - 1, i; s >= 0; s--)
    (i = d[s]) && (o = i(e, t, o) || o);
  return o && O(e, t, o), o;
};
const v = (d) => `
${d} .aby-hd__logo--light.has-dark { display: none; }
${d} .aby-hd__logo--dark { display: block; }
${d} .aby-hd__logo--light:not(.has-dark) { filter: brightness(0) invert(1); }`, T = `
.aby-hd { position: relative; }
.aby-hd--shadow { box-shadow: 0 1px 0 color-mix(in srgb, var(--aby-text) 12%, transparent); }
.aby-hd--trans:not(.is-solid) { background: transparent; box-shadow: none; --aby-title: #fff; --aby-text: #fff; }
.aby-hd.is-solid { background: color-mix(in srgb, var(--aby-bg) 78%, transparent); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--aby-text) 10%, transparent); }
/* Previews clip the section list with overflow: hidden, which blocks sticky; clip does not */
.components-grid:has(.aby-hd--sticky) { overflow: clip; }
.aby-hd__inner { display: flex; align-items: center; gap: .75rem 1.25rem; flex-wrap: wrap; max-width: 1200px; margin-inline: auto;
  padding: .625rem 1rem; min-height: calc(var(--aby-hd-logo, 56px) + 1.25rem); }
.aby-hd__brand { display: inline-flex; align-items: center; flex: 0 0 auto; text-decoration: none; }
.aby-hd__logo { display: block; height: var(--aby-hd-logo, 56px); width: auto; max-width: 45vw; object-fit: contain; }
.aby-hd .aby-hd__logo--dark { display: none; }
.aby-hd__name { font-size: 1.25rem; font-weight: 800; color: var(--aby-title); }
.aby-hd__nav { display: flex; gap: .25rem; flex: 1 1 auto; justify-content: center; min-width: 0; }
.aby-hd__nav a { display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0 .75rem; border-radius: 999px; color: var(--aby-text);
  font-weight: 600; font-size: .9375rem; text-decoration: none; white-space: nowrap; }
.aby-hd__nav a:hover { background: color-mix(in srgb, var(--aby-text) 8%, transparent); }
.aby-hd__nav a:focus-visible, .aby-hd__toggle:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-hd__actions { display: flex; align-items: center; gap: .5rem; margin-inline-start: auto; }
.aby-hd__toggle { width: 2.75rem; height: 2.75rem; display: grid; place-items: center; padding: 0; border: 0; border-radius: 999px; background: none;
  color: var(--aby-title); cursor: pointer; }
.aby-hd__toggle svg { width: 22px; height: 22px; }
.aby-hd__buy { min-height: 2.75rem; padding: .5rem 1.25rem; font-size: .9375rem; }
/* Centered logo: links on one side, actions on the other */
@container (min-width: 768px) {
  .aby-hd--center .aby-hd__inner { display: grid; grid-template-columns: 1fr auto 1fr; }
  .aby-hd--center .aby-hd__brand { grid-column: 2; grid-row: 1; }
  .aby-hd--center .aby-hd__nav { grid-column: 1; grid-row: 1; justify-content: flex-start; }
  .aby-hd--center .aby-hd__actions { grid-column: 3; grid-row: 1; }
}
/* Phones: links move to their own scrolling row under the logo */
@container (max-width: 767px) {
  .aby-hd__nav { order: 3; flex-basis: 100%; justify-content: flex-start; overflow-x: auto; scrollbar-width: none; margin-inline: -1rem; padding-inline: 1rem; }
  .aby-hd__nav::-webkit-scrollbar { display: none; }
  .aby-hd--center .aby-hd__brand { order: 0; }
}
${["html.aby-mode-dark .aby-hd.aby-auto", ".aby-hd.aby-hd--trans:not(.is-solid)"].map(v).join("")}
@media (prefers-color-scheme: dark) { ${v("html:not(.aby-mode-light) .aby-hd.aby-auto")} }
`, V = r`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
  <circle cx="12" cy="12" r="4.5" /><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>`, R = r`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>`;
function I() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
class h extends k {
  constructor() {
    super(...arguments), this.store = { logo: "", name: "" }, this.mode = "light", this.solid = !1, this.busy = !1, this.modeKey = "", this.paletteKey = "", this.paletteVars = [], this.onScroll = () => {
      const e = !!l(this.config).sticky && this.getBoundingClientRect().top <= 1 && I() > 1;
      e !== this.solid && (this.solid = e);
    };
  }
  createRenderRoot() {
    return this;
  }
  async connectedCallback() {
    var t, a, o;
    super.connectedCallback(), this.classList.add("aby-host"), B(), P("aby-page-header", T), document.addEventListener("scroll", this.onScroll, { capture: !0, passive: !0 }), this.resizer = new ResizeObserver(() => this.frame()), this.resizer.observe(this);
    for (const s of [300, 1500]) window.setTimeout(() => this.requestUpdate(), s);
    const e = f();
    await ((t = e == null ? void 0 : e.onReady) == null ? void 0 : t.call(e)), this.store = { logo: ((a = e == null ? void 0 : e.config) == null ? void 0 : a.get("store.logo")) || "", name: ((o = e == null ? void 0 : e.config) == null ? void 0 : o.get("store.name")) || "" };
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), document.removeEventListener("scroll", this.onScroll, { capture: !0 }), (e = this.resizer) == null || e.disconnect(), this.unframe(), this.clearPalette(), this.modeKey = this.paletteKey = "", document.documentElement.classList.remove("aby-mode-dark", "aby-mode-light", "aby-mode-ready");
  }
  // Palette and mode are applied before the first paint, so the page never flashes the wrong colors
  willUpdate() {
    const e = l(this.config), t = j(e), a = JSON.stringify(t);
    if (a !== this.paletteKey) {
      this.paletteKey = a, this.clearPalette();
      for (const [s, i] of Object.entries(t)) document.documentElement.style.setProperty(s, i);
      this.paletteVars = Object.keys(t);
    }
    const o = `${this.baseMode()}|${this.toggleShown()}`;
    o !== this.modeKey && (this.modeKey = o, this.applyMode(E(this.baseMode(), this.toggleShown(), S(this.baseMode()))));
  }
  updated() {
    this.frame(), this.onScroll();
  }
  clearPalette() {
    for (const e of this.paletteVars) document.documentElement.style.removeProperty(e);
    this.paletteVars = [];
  }
  baseMode() {
    return String(u(l(this.config).default_mode) || "light");
  }
  toggleShown() {
    return l(this.config).show_mode_toggle !== !1;
  }
  applyMode(e) {
    this.mode = e, document.documentElement.classList.toggle("aby-mode-dark", e === "dark"), document.documentElement.classList.toggle("aby-mode-light", e === "light");
  }
  toggleMode() {
    const e = this.mode === "dark" ? "light" : "dark";
    document.documentElement.classList.add("aby-mode-ready"), this.applyMode(e), K(e, this.baseMode());
  }
  /**
   * White-on-image only works over the hero: without one, the header would put white text on the page
   * background, so it stays solid.
   */
  transparent() {
    if (!l(this.config).transparent) return !1;
    const e = document.querySelector(".aby-section");
    return !!(e != null && e.matches("[data-aby-hero].aby-hero--overlay"));
  }
  /** Sticky and the transparent overlap go on the outermost box of the section, the editor's card included. */
  frame() {
    const e = l(this.config), t = this.closest(".component-card") || this;
    this.framed && this.framed !== t && this.unframe();
    const a = !!e.sticky, o = this.transparent();
    t.style.position = a ? "sticky" : o ? "relative" : "", t.style.top = a ? "0" : "", t.style.zIndex = a || o ? "30" : "", t.style.marginBottom = o ? `-${this.offsetHeight}px` : "", document.documentElement.style.setProperty("--aby-hd-h", a ? `${this.offsetHeight}px` : "0px"), this.framed = t;
  }
  unframe() {
    this.framed && (this.framed.style.position = this.framed.style.top = this.framed.style.zIndex = this.framed.style.marginBottom = "", document.documentElement.style.removeProperty("--aby-hd-h"), this.framed = void 0);
  }
  goTo(e, t) {
    var o;
    const a = document.querySelector(`[data-aby-section="${CSS.escape(t)}"]`);
    a && (e.preventDefault(), a.scrollIntoView({ behavior: (o = window.matchMedia) != null && o.call(window, "(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  }
  async onBuy() {
    var t, a;
    if (this.busy) return;
    this.busy = !0;
    let e;
    try {
      e = await M();
    } finally {
      this.busy = !1;
    }
    e.kind === "error" && ((a = (t = f()) == null ? void 0 : t.error) == null || a.call(t, e.message));
  }
  render() {
    const e = l(this.config), t = Math.min(Math.max(Number(e.logo_height) || 56, 24), 140), a = [
      "aby-block aby-hd aby-auto",
      u(e.align) === "start" ? "" : "aby-hd--center",
      e.show_shadow !== !1 ? "aby-hd--shadow" : "",
      this.transparent() ? "aby-hd--trans" : "",
      e.sticky ? "aby-hd--sticky" : "",
      this.solid ? "is-solid" : ""
    ].filter(Boolean).join(" "), o = e.logo || this.store.logo, s = e.logo_dark || "", i = this.store.name, g = z(e.nav, "nav").map((n) => ({ label: _(n.label), target: L(n.target) })).filter((n) => n.label && n.target), w = e.show_buy !== !1 && C() !== "none", p = this.mode === "dark";
    return r`<header class=${a} style=${`--aby-hd-logo:${t}px`}>
      <div class="aby-hd__inner">
        <span class="aby-hd__brand">
          ${o ? r`<img class="aby-hd__logo aby-hd__logo--light${s ? " has-dark" : ""}" src=${o} alt=${i} />
                ${s ? r`<img class="aby-hd__logo aby-hd__logo--dark" src=${s} alt=${i} />` : y}` : r`<span class="aby-hd__name">${i}</span>`}
        </span>
        ${g.length ? r`<nav class="aby-hd__nav" aria-label=${m({ ar: "أقسام الصفحة", en: "Page sections" })}>
              ${g.map((n) => r`<a href=${`#${n.target}`} @click=${(x) => this.goTo(x, n.target)}>${n.label}</a>`)}
            </nav>` : y}
        <div class="aby-hd__actions">
          ${this.toggleShown() ? r`<button type="button" class="aby-hd__toggle" @click=${() => this.toggleMode()} aria-pressed=${p ? "true" : "false"}
                aria-label=${m({ ar: "الوضع الداكن", en: "Dark mode" })}>${p ? V : R}</button>` : y}
          ${w ? r`<button type="button" class="aby-btn aby-hd__buy" aria-busy=${this.busy ? "true" : "false"} @click=${() => this.onBuy()}>
                ${_(e.buy_text) || m({ ar: "اشتري الآن", en: "Buy now" })}</button>` : y}
        </div>
      </div>
    </header>`;
  }
}
c([
  $({ type: Object })
], h.prototype, "config");
c([
  b()
], h.prototype, "store");
c([
  b()
], h.prototype, "mode");
c([
  b()
], h.prototype, "solid");
c([
  b()
], h.prototype, "busy");
typeof h < "u" && h.registerSallaComponent("salla-page-header");
export {
  h as default
};
