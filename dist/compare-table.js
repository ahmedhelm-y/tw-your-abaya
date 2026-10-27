import { html as e, nothing as n } from "lit";
import { g as d, r as t, i as m, t as s } from "./styles-vAeqvApy.js";
import { A as b } from "./section-DUIqt8g_.js";
const p = `
.aby-ct__table { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-radius: 1.25rem; overflow: hidden; background: var(--aby-card); }
.aby-ct__head { padding: 1rem 1.125rem; font-weight: 800; font-size: 1.0625rem; color: var(--aby-title); border-bottom: 2px solid color-mix(in srgb, var(--aby-text) 12%, transparent); }
.aby-ct__head--us { background: var(--aby-accent); color: var(--aby-accent-text); border-bottom-color: transparent; }
.aby-ct__cell { display: flex; align-items: flex-start; gap: .625rem; padding: .875rem 1.125rem; font-size: .9375rem; line-height: 1.6;
  border-bottom: 1px solid color-mix(in srgb, var(--aby-text) 10%, transparent); }
.aby-ct__cell--us { color: var(--aby-title); font-weight: 600; background: color-mix(in srgb, var(--aby-accent) 7%, var(--aby-card)); }
.aby-ct__cell--them { color: color-mix(in srgb, var(--aby-text) 75%, transparent); }
.aby-ct__mark { flex: 0 0 auto; width: 1.375rem; height: 1.375rem; display: grid; place-items: center; border-radius: 999px; margin-top: .1rem; }
.aby-ct__cell--us .aby-ct__mark { background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-ct__cell--them .aby-ct__mark { background: color-mix(in srgb, var(--aby-text) 15%, transparent); color: var(--aby-text); }
.aby-ct__mark svg { width: .875rem; height: .875rem; }
.aby-ct__table > :nth-last-child(-n + 2) { border-bottom: 0; }
@container (max-width: 480px) { .aby-ct__cell { padding: .75rem; font-size: .875rem; } .aby-ct__head { padding: .875rem .75rem; } }
.aby-ct__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`, y = e`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3 3 7-7" /></svg>`, _ = e`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 8h8" /></svg>`;
class l extends b {
  constructor() {
    super(...arguments), this.styleId = "compare-table";
  }
  styles() {
    return p;
  }
  render() {
    const r = this.cfg(), o = d(r.rows, "rows").map((a) => ({ us: t(a.us), them: t(a.them) })).filter((a) => a.us);
    if (!o.length)
      return m() ? n : this.frame(e`<p class="aby-ct__empty">${s({ ar: "أضف سطور المقارنة من إعدادات هذا القسم", en: "Add comparison rows in this section's settings" })}</p>`);
    const c = t(r.us_label) || s({ ar: "عندنا", en: "Us" }), i = t(r.them_label) || s({ ar: "عند غيرنا", en: "Others" });
    return this.frame(e`<div class="aby-ct__table" role="table" aria-label=${t(r.title) || s({ ar: "مقارنة", en: "Comparison" })}>
      <div role="row" style="display:contents">
        <span class="aby-ct__head aby-ct__head--us" role="columnheader">${c}</span>
        <span class="aby-ct__head" role="columnheader">${i}</span>
      </div>
      ${o.map((a) => e`<div role="row" style="display:contents">
        <span class="aby-ct__cell aby-ct__cell--us" role="cell"><span class="aby-ct__mark">${y}</span>${a.us}</span>
        <span class="aby-ct__cell aby-ct__cell--them" role="cell">${a.them ? e`<span class="aby-ct__mark">${_}</span>${a.them}` : n}</span>
      </div>`)}
    </div>`, { extraClass: "aby-ct" });
  }
}
typeof l < "u" && l.registerSallaComponent("salla-compare-table");
export {
  l as default
};
