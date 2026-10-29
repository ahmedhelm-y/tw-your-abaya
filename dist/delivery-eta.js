import { nothing as g, html as l } from "lit";
import { state as w } from "lit/decorators.js";
import { a as D, g as p, r as c, t as b } from "./styles-vAeqvApy.js";
import { A as k } from "./section-Cbwxq9g0.js";
const f = 864e5;
function T(a, e) {
  return new Date(a.getTime() + e * 36e5);
}
function d(a, e) {
  return !e.includes(a.getUTCDay());
}
function m(a) {
  return new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
}
function _(a, e, i) {
  let r = m(a);
  const t = i.length >= 7 ? [] : i;
  for (; !d(r, t); ) r = new Date(r.getTime() + f);
  for (let s = Math.max(0, Math.round(e)); s > 0; )
    r = new Date(r.getTime() + f), d(r, t) && s--;
  return r;
}
function q(a, e) {
  const i = T(a, e.tzOffset), r = e.offDays.length >= 7 ? [] : e.offDays, t = Math.min(Math.max(Math.round(e.cutoffHour), 0), 24), s = new Date(m(i).getTime() + t * 36e5), n = d(i, r) && i.getTime() < s.getTime() ? m(i) : _(new Date(m(i).getTime() + f), 0, r), h = new Date(n.getTime() + t * 36e5), v = _(n, e.prepDays + e.shipDays, r), u = new Date(h.getTime() - e.tzOffset * 36e5);
  return { cutoff: u, arrival: v, msLeft: Math.max(0, u.getTime() - a.getTime()) };
}
function C(a) {
  const e = Math.max(0, Math.floor(a / 1e3)), i = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), t = e % 60;
  return `${i}:${String(r).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
}
function $(a, e) {
  try {
    return new Intl.DateTimeFormat(e === "en" ? "en-GB" : "ar-SA-u-nu-latn-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC"
    }).format(a);
  } catch {
    return a.toISOString().slice(0, 10);
  }
}
var x = Object.defineProperty, M = (a, e, i, r) => {
  for (var t = void 0, s = a.length - 1, o; s >= 0; s--)
    (o = a[s]) && (t = o(e, i, t) || t);
  return t && x(e, i, t), t;
};
const z = `
.aby-eta__grid { display: grid; gap: 1.25rem; }
@container (min-width: 768px) { .aby-eta__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2rem; align-items: start; } }
.aby-eta__card { display: grid; gap: .75rem; padding: 1.5rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-eta__lead { margin: 0; font-size: 1.0625rem; color: var(--aby-text); }
.aby-eta__clock { display: block; font-size: clamp(2.25rem, 8cqi, 3rem); line-height: 1.1; font-weight: 800; color: var(--aby-accent-ink);
  font-variant-numeric: tabular-nums; direction: ltr; text-align: start; }
[dir="rtl"] .aby-eta__clock { text-align: end; }
.aby-eta__day { margin: 0; font-size: 1.125rem; color: var(--aby-title); }
.aby-eta__day b { font-weight: 800; }
.aby-eta__times { display: grid; gap: .5rem; margin: .25rem 0 0; padding: 0; list-style: none; }
.aby-eta__times li { display: flex; justify-content: space-between; gap: 1rem; padding: .625rem .875rem; border-radius: .75rem; background: var(--aby-bg); font-size: .9375rem; }
.aby-eta__times b { color: var(--aby-title); white-space: nowrap; }
.aby-eta__faq { display: grid; gap: .5rem; }
.aby-eta__faq details { border-radius: 1rem; background: var(--aby-card); }
.aby-eta__faq summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 3.25rem; padding: .75rem 1.125rem;
  font-weight: 700; color: var(--aby-title); cursor: pointer; list-style: none; }
.aby-eta__faq summary::-webkit-details-marker { display: none; }
.aby-eta__faq summary::after { content: "+"; font-size: 1.375rem; line-height: 1; color: var(--aby-accent-ink); }
.aby-eta__faq details[open] summary::after { content: "−"; }
.aby-eta__faq summary:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: -2px; border-radius: 1rem; }
.aby-eta__faq p { margin: 0; padding: 0 1.125rem 1rem; line-height: 1.8; white-space: pre-line; }
`;
class y extends k {
  constructor() {
    super(...arguments), this.styleId = "delivery-eta", this.now = /* @__PURE__ */ new Date();
  }
  styles() {
    return z;
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = window.setInterval(() => this.now = /* @__PURE__ */ new Date(), 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this.timer);
  }
  settings() {
    const e = this.cfg(), i = (Array.isArray(e.off_days) ? e.off_days : []).map((t) => Number((t == null ? void 0 : t.value) ?? t)).filter((t) => t >= 0 && t <= 6), r = (t, s) => t === "" || t === null || t === void 0 || Number.isNaN(Number(t)) ? s : Number(t);
    return {
      cutoffHour: r(e.cutoff_hour, 13),
      prepDays: r(e.prep_days, 1),
      shipDays: r(e.ship_days, 2),
      offDays: i,
      tzOffset: r(e.tz_offset, 3)
    };
  }
  render() {
    const e = this.cfg(), i = q(this.now, this.settings()), r = $(i.arrival, D()), t = p(e.times, "times").map((n) => ({ label: c(n.label), value: c(n.value) })).filter((n) => n.label && n.value), s = p(e.faqs, "faqs").map((n) => ({ q: c(n.q), a: c(n.a) })).filter((n) => n.q && n.a), o = c(e.lead) || b({ ar: "اطلبي خلال", en: "Order within" });
    return this.frame(l`<div class="aby-eta__grid">
      <div class="aby-eta__card">
        <p class="aby-eta__lead">${o}</p>
        <span class="aby-eta__clock" role="timer" aria-live="off">${C(i.msLeft)}</span>
        <p class="aby-eta__day" aria-live="polite">${b({ ar: "وتوصلك يوم", en: "and get it on" })} <b>${r}</b></p>
        ${t.length ? l`<ul class="aby-eta__times">${t.map((n) => l`<li><span>${n.label}</span><b>${n.value}</b></li>`)}</ul>` : g}
      </div>
      ${s.length ? l`<div class="aby-eta__faq">${s.map((n) => l`<details><summary>${n.q}</summary><p>${n.a}</p></details>`)}</div>` : g}
    </div>`, { extraClass: "aby-eta" });
  }
}
M([
  w()
], y.prototype, "now");
typeof y < "u" && y.registerSallaComponent("salla-delivery-eta");
export {
  y as default
};
