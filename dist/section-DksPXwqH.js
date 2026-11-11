import { LitElement as h, nothing as n, html as c } from "lit";
import { property as p, state as b } from "lit/decorators.js";
import { e as g, d as m, q as v, k as $, r as l, t as S, h as _, j as C, v as d, s as k, o as w, l as j } from "./styles-C5ta92Qj.js";
var x = Object.defineProperty, u = (o, s, t, e) => {
  for (var r = void 0, a = o.length - 1, i; a >= 0; a--)
    (i = o[a]) && (r = i(s, t, r) || r);
  return r && x(s, t, r), r;
};
function I(o) {
  var e;
  const s = document.querySelector(`[data-aby-section="${CSS.escape(o)}"]`), t = (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
  s == null || s.scrollIntoView({ behavior: t ? "auto" : "smooth", block: "start" });
}
function L(o, s = "product") {
  const t = j();
  if (t) return t;
  const e = o[s], r = Array.isArray(e) ? e[0] : e, a = r && typeof r == "object" ? r.value ?? r.id : r;
  return a ? String(a) : null;
}
class y extends h {
  constructor() {
    super(...arguments), this.busy = !1, this.error = "";
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("aby-host"), g(), m(`aby-${this.styleId}`, this.styles());
  }
  firstUpdated() {
    const s = this.querySelector(".aby-section:not([data-aby-hero]) > .aby-container");
    s && v(s);
  }
  cfg() {
    return $(this.config);
  }
  styles() {
    return "";
  }
  buyLabel() {
    return l(this.cfg().buy_text) || S({ ar: "اشتري الآن", en: "Buy now" });
  }
  async press(s = {}) {
    var e, r;
    if (this.busy) return;
    this.busy = !0, this.error = "";
    let t;
    try {
      t = await _(s);
    } finally {
      this.busy = !1;
    }
    t.kind === "error" && (this.error = t.message || "", (r = (e = C()) == null ? void 0 : e.error) == null || r.call(e, t.message));
  }
  /**
   * The page's one primary action, repeated at the end of a section: the same button that takes the
   * shopper back up to the abaya and its buy button. Hidden when the merchant clears its text.
   */
  renderCta() {
    const s = this.cfg(), t = l(s.cta_text), e = d(s.cta_target) || "top";
    return !t || s.show_cta === !1 ? n : c`<div class="aby-cta"><button type="button" class="aby-btn" @click=${() => I(e)}>${t}</button></div>`;
  }
  frame(s, t = {}) {
    const e = this.cfg(), r = t.title === !1 ? "" : l(e.title), a = t.title === !1 ? "" : l(e.subtitle), i = d(e.section_id), f = ["aby-block aby-section", k(e), t.extraClass || ""].filter(Boolean).join(" ");
    return c`<section class=${f} style=${w(e)} data-aby-section=${i || n}
      ?data-aby-hero=${!!t.hero}>
      <div class="aby-container">
        ${r || a ? c`<div class="aby-title">${r ? c`<h2>${r}</h2>` : n}${a ? c`<p>${a}</p>` : n}</div>` : n}
        ${s}
        ${this.error ? c`<p class="aby-error" role="alert">${this.error}</p>` : n}
      </div>
    </section>`;
  }
}
u([
  p({ type: Object })
], y.prototype, "config");
u([
  b()
], y.prototype, "busy");
u([
  b()
], y.prototype, "error");
export {
  y as A,
  L as p
};
