import { LitElement as v, nothing as c, html as a } from "lit";
import { property as u, state as x } from "lit/decorators.js";
import { e as k, b as w, c as z, r as m, g as C, w as j, s as L, d as P, t as b, h as R } from "./styles-vAeqvApy.js";
var F = Object.defineProperty, _ = (l, t, p, n) => {
  for (var e = void 0, o = l.length - 1, s; o >= 0; o--)
    (s = l[o]) && (e = s(t, p, e) || e);
  return e && F(t, p, e), e;
};
const d = (l) => `
${l} .aby-ft__logo--light.has-dark { display: none; }
${l} .aby-ft__logo--dark { display: block; }
${l} .aby-ft__logo--light:not(.has-dark) { filter: brightness(0) invert(1); }`, O = `
.aby-ft { padding-block: 2.5rem 1.25rem; border-top: 1px solid color-mix(in srgb, var(--aby-text) 12%, transparent); }
.aby-ft__top { display: grid; gap: 1.75rem; }
@container (min-width: 768px) { .aby-ft__top { grid-template-columns: 2fr 1fr; align-items: start; } }
.aby-ft__logo { display: block; height: 48px; width: auto; max-width: 60%; object-fit: contain; }
.aby-ft .aby-ft__logo--dark { display: none; }
.aby-ft__name { font-size: 1.25rem; font-weight: 800; color: var(--aby-title); }
.aby-ft__about { margin-top: .75rem; max-width: 36rem; font-size: .9375rem; line-height: 1.8; color: var(--aby-text); }
.aby-ft__contact { display: grid; gap: .25rem; }
.aby-ft__contact a { display: inline-flex; align-items: center; gap: .5rem; min-height: 2.75rem; color: var(--aby-text); text-decoration: none; font-weight: 600; }
.aby-ft__contact a:hover { color: var(--aby-accent-ink); }
.aby-ft__contact i { font-size: 1.125rem; color: var(--aby-accent-ink); }
.aby-ft__social { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
.aby-ft__social a { width: 2.75rem; height: 2.75rem; display: grid; place-items: center; border-radius: 999px; background: var(--aby-card);
  color: var(--aby-title); font-size: 1.125rem; text-decoration: none; }
.aby-ft__social a:hover { background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-ft a:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-ft__bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 2rem; padding-top: 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--aby-text) 10%, transparent); }
.aby-ft__payments { display: flex; flex-wrap: wrap; gap: .5rem; }
.aby-ft__payments img { width: 3rem; height: 2rem; object-fit: contain; padding: .25rem; border-radius: .375rem; background: #fff; }
.aby-ft__copy { font-size: .8125rem; color: var(--aby-text); }
${[".aby-ft.aby-dark", "html.aby-mode-dark .aby-ft.aby-auto"].map(d).join("")}
@media (prefers-color-scheme: dark) { ${d("html:not(.aby-mode-light) .aby-ft.aby-auto")} }
`;
class f extends v {
  constructor() {
    super(...arguments), this.store = { logo: "", name: "", payments: [] };
  }
  createRenderRoot() {
    return this;
  }
  async connectedCallback() {
    var n, e, o, s;
    super.connectedCallback(), this.classList.add("aby-host"), k(), w("aby-page-footer", O);
    const t = R();
    await ((n = t == null ? void 0 : t.onReady) == null ? void 0 : n.call(t));
    const p = ((e = t == null ? void 0 : t.config) == null ? void 0 : e.get("store.settings.payments")) || [];
    this.store = {
      logo: ((o = t == null ? void 0 : t.config) == null ? void 0 : o.get("store.logo")) || "",
      name: ((s = t == null ? void 0 : t.config) == null ? void 0 : s.get("store.name")) || "",
      payments: p.map((i) => {
        var y, g;
        return { src: ((g = (y = t == null ? void 0 : t.url) == null ? void 0 : y.cdn) == null ? void 0 : g.call(y, `images/payment/${i}_mini.png`, 116, 116)) || "", name: i };
      }).filter((i) => i.src)
    };
  }
  render() {
    const t = z(this.config), p = t.logo || this.store.logo, n = this.store.name, e = m(t.about), o = String(t.phone || "").trim(), s = String(t.whatsapp || "").replace(/[^\d]/g, ""), i = String(t.email || "").trim(), y = C(t.social, "social").map((r) => ({ icon: String(r.icon || "sicon-link"), url: j(r.url) })).filter((r) => r.url), g = (/* @__PURE__ */ new Date()).getFullYear(), h = (m(t.copyright) || "© {year} {store}").replace("{year}", String(g)).replace("{store}", n), $ = o || s || i;
    return a`<footer class=${`aby-block aby-ft ${L(t)}`} style=${P(t)}>
      <div class="aby-container">
        <div class="aby-ft__top">
          <div>
            ${p ? a`<img class="aby-ft__logo aby-ft__logo--light${t.logo_dark ? " has-dark" : ""}" src=${p} alt=${n} loading="lazy" />
                  ${t.logo_dark ? a`<img class="aby-ft__logo aby-ft__logo--dark" src=${t.logo_dark} alt=${n} loading="lazy" />` : c}` : a`<span class="aby-ft__name">${n}</span>`}
            ${e ? a`<p class="aby-ft__about">${e}</p>` : c}
            ${y.length ? a`<div class="aby-ft__social">${y.map((r) => a`<a href=${r.url} target="_blank" rel="noopener" aria-label=${r.icon.replace(/^sicon-/, "")}><i class=${r.icon}></i></a>`)}</div>` : c}
          </div>
          ${$ ? a`<div class="aby-ft__contact" aria-label=${b({ ar: "تواصل معنا", en: "Contact us" })}>
                ${o ? a`<a href=${`tel:${o.replace(/[^\d+]/g, "")}`}><i class="sicon-phone"></i><span dir="ltr">${o}</span></a>` : c}
                ${s ? a`<a href=${`https://wa.me/${s}`} target="_blank" rel="noopener"><i class="sicon-whatsapp"></i>${b({ ar: "واتساب", en: "WhatsApp" })}</a>` : c}
                ${i ? a`<a href=${`mailto:${i}`}><i class="sicon-mail"></i><span dir="ltr">${i}</span></a>` : c}
              </div>` : c}
        </div>
        <div class="aby-ft__bottom">
          ${t.show_payments !== !1 && this.store.payments.length ? a`<div class="aby-ft__payments">${this.store.payments.map((r) => a`<img src=${r.src} alt=${r.name} loading="lazy" />`)}</div>` : c}
          <p class="aby-ft__copy">${h}</p>
        </div>
      </div>
    </footer>`;
  }
}
_([
  u({ type: Object })
], f.prototype, "config");
_([
  x()
], f.prototype, "store");
typeof f < "u" && f.registerSallaComponent("salla-page-footer");
export {
  f as default
};
