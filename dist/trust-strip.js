import { nothing as r, html as e } from "lit";
import { g as c, r as n, i as p, t as d, u as m } from "./styles-vAeqvApy.js";
import { A as g } from "./section-DUIqt8g_.js";
const b = `
.aby-ts__badges { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr)); gap: .75rem; }
.aby-ts__badge { display: flex; align-items: center; gap: .75rem; padding: .875rem 1rem; border-radius: 1rem; background: var(--aby-card); }
.aby-ts__badge i { flex: 0 0 auto; width: 2.5rem; height: 2.5rem; display: grid; place-items: center; border-radius: 999px;
  background: color-mix(in srgb, var(--aby-accent) 14%, var(--aby-bg)); color: var(--aby-accent-ink); font-size: 1.25rem; font-style: normal; }
.aby-ts__badge span { font-weight: 700; font-size: .9375rem; line-height: 1.5; color: var(--aby-title); }
.aby-ts__steps { display: grid; gap: 1rem; margin-top: 2rem; padding: 0; list-style: none; counter-reset: step; }
@container (min-width: 768px) { .aby-ts__steps { grid-template-columns: repeat(var(--aby-ts-cols, 4), minmax(0, 1fr)); gap: 1.25rem; } }
.aby-ts__step { position: relative; display: grid; gap: .5rem; padding: 1.25rem; border-radius: 1.25rem; background: var(--aby-card); counter-increment: step; }
.aby-ts__step::before { content: counter(step); width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 999px;
  background: var(--aby-accent); color: var(--aby-accent-text); font-weight: 800; }
.aby-ts__step h3 { margin: 0; font-size: 1.0625rem; font-weight: 800; color: var(--aby-title); }
.aby-ts__step p { margin: 0; font-size: .9375rem; line-height: 1.7; }
.aby-ts__step img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: .875rem; }
.aby-section.aby-ts--compact { padding-block: 1.5rem; }
.aby-ts__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;
class l extends g {
  constructor() {
    super(...arguments), this.styleId = "trust-strip";
  }
  styles() {
    return b;
  }
  render() {
    const s = this.cfg(), i = c(s.badges, "badges").map((t) => ({ icon: String(t.icon || "sicon-check"), text: n(t.text) })).filter((t) => t.text), a = c(s.steps, "steps").map((t) => ({ title: n(t.title), text: n(t.text), image: String(t.image || "") })).filter((t) => t.title);
    if (!i.length && !a.length)
      return p() ? r : this.frame(e`<p class="aby-ts__empty">${d({ ar: "أضف المميزات أو خطوات الصناعة من إعدادات هذا القسم", en: "Add badges or steps in this section's settings" })}</p>`);
    const o = m(s.layout) === "compact" && !a.length;
    return this.frame(e`
      ${i.length ? e`<div class="aby-ts__badges">${i.map((t) => e`<div class="aby-ts__badge"><i class=${t.icon} aria-hidden="true"></i><span>${t.text}</span></div>`)}</div>` : r}
      ${a.length ? e`<ol class="aby-ts__steps" style=${`--aby-ts-cols:${Math.min(a.length, 4)}`}>${a.map((t) => e`<li class="aby-ts__step">
            ${t.image ? e`<img src=${t.image} alt="" loading="lazy" />` : r}
            <h3>${t.title}</h3>${t.text ? e`<p>${t.text}</p>` : r}</li>`)}</ol>` : r}`, { extraClass: `aby-ts${o ? " aby-ts--compact" : ""}`, title: !o });
  }
}
typeof l < "u" && l.registerSallaComponent("salla-trust-strip");
export {
  l as default
};
