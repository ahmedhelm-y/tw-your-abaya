import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { getCollectionItems, getLocale, resolveText, t } from "../../utils/config";
import { eta, formatCountdown, formatDay, type EtaSettings } from "../../utils/eta";
import { AbySection } from "../../utils/section";

const css = `
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

type Time = { label: unknown; value: unknown };
type Faq = { q: unknown; a: unknown };

export default class DeliveryEta extends AbySection {
  protected readonly styleId = "delivery-eta";
  @state() private now = new Date();
  private timer?: number;

  protected styles() {
    return css;
  }

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => (this.now = new Date()), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
  }

  private settings(): EtaSettings {
    const cfg = this.cfg();
    const off = (Array.isArray(cfg.off_days) ? cfg.off_days : []).map((d: any) => Number(d?.value ?? d)).filter((d: number) => d >= 0 && d <= 6);
    const num = (v: unknown, fallback: number) => (v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? fallback : Number(v));
    return {
      cutoffHour: num(cfg.cutoff_hour, 13),
      prepDays: num(cfg.prep_days, 1),
      shipDays: num(cfg.ship_days, 2),
      offDays: off,
      tzOffset: num(cfg.tz_offset, 3),
    };
  }

  render() {
    const cfg = this.cfg();
    const r = eta(this.now, this.settings());
    const day = formatDay(r.arrival, getLocale());
    const times = getCollectionItems<Time>(cfg.times, "times").map((x) => ({ label: resolveText(x.label), value: resolveText(x.value) })).filter((x) => x.label && x.value);
    const faqs = getCollectionItems<Faq>(cfg.faqs, "faqs").map((x) => ({ q: resolveText(x.q), a: resolveText(x.a) })).filter((x) => x.q && x.a);
    const lead = resolveText(cfg.lead) || t({ ar: "اطلبي خلال", en: "Order within" });
    return this.frame(html`<div class="aby-eta__grid">
      <div class="aby-eta__card">
        <p class="aby-eta__lead">${lead}</p>
        <span class="aby-eta__clock" role="timer" aria-live="off">${formatCountdown(r.msLeft)}</span>
        <p class="aby-eta__day" aria-live="polite">${t({ ar: "وتوصلك يوم", en: "and get it on" })} <b>${day}</b></p>
        ${times.length ? html`<ul class="aby-eta__times">${times.map((x) => html`<li><span>${x.label}</span><b>${x.value}</b></li>`)}</ul>` : nothing}
      </div>
      ${faqs.length ? html`<div class="aby-eta__faq">${faqs.map((f) => html`<details><summary>${f.q}</summary><p>${f.a}</p></details>`)}</div>` : nothing}
    </div>`, { extraClass: "aby-eta" });
  }
}
