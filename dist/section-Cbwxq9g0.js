import { LitElement as f, nothing as i, html as n } from "lit";
import { property as h, state as b } from "lit/decorators.js";
import { a as p } from "./buy-D6n2j5jF.js";
import { e as m, b as g, v, c as $, r as l, t as C, h as S, o as _, s as j, d as x, l as k } from "./styles-vAeqvApy.js";
var A = Object.defineProperty, y = (o, r, e, s) => {
  for (var t = void 0, a = o.length - 1, c; a >= 0; a--)
    (c = o[a]) && (t = c(r, e, t) || t);
  return t && A(r, e, t), t;
};
function P(o, r = "product") {
  const e = k();
  if (e) return e;
  const s = o[r], t = Array.isArray(s) ? s[0] : s, a = t && typeof t == "object" ? t.value ?? t.id : t;
  return a ? String(a) : null;
}
class u extends f {
  constructor() {
    super(...arguments), this.busy = !1, this.error = "";
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("aby-host"), m(), g(`aby-${this.styleId}`, this.styles());
  }
  firstUpdated() {
    const r = this.querySelector(".aby-section:not([data-aby-hero]) > .aby-container");
    r && v(r);
  }
  cfg() {
    return $(this.config);
  }
  styles() {
    return "";
  }
  buyLabel() {
    return l(this.cfg().buy_text) || C({ ar: "اشتري الآن", en: "Buy now" });
  }
  async press(r = {}) {
    var s, t;
    if (this.busy) return;
    this.busy = !0, this.error = "";
    let e;
    try {
      e = await p(r);
    } finally {
      this.busy = !1;
    }
    e.kind === "error" && (this.error = e.message || "", (t = (s = S()) == null ? void 0 : s.error) == null || t.call(s, e.message));
  }
  frame(r, e = {}) {
    const s = this.cfg(), t = e.title === !1 ? "" : l(s.title), a = e.title === !1 ? "" : l(s.subtitle), c = _(s.section_id), d = ["aby-block aby-section", j(s), e.extraClass || ""].filter(Boolean).join(" ");
    return n`<section class=${d} style=${x(s)} data-aby-section=${c || i}
      ?data-aby-hero=${!!e.hero}>
      <div class="aby-container">
        ${t || a ? n`<div class="aby-title">${t ? n`<h2>${t}</h2>` : i}${a ? n`<p>${a}</p>` : i}</div>` : i}
        ${r}
        ${this.error ? n`<p class="aby-error" role="alert">${this.error}</p>` : i}
      </div>
    </section>`;
  }
}
y([
  h({ type: Object })
], u.prototype, "config");
y([
  b()
], u.prototype, "busy");
y([
  b()
], u.prototype, "error");
export {
  u as A,
  P as p
};
