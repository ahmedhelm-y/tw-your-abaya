import { html, nothing } from "lit";
import { getCollectionItems, resolveText, t, unwrapValue } from "../../utils/config";
import { isLandingPage } from "../../utils/landing";
import { AbySection } from "../../utils/section";

const css = `
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

type Badge = { icon: unknown; text: unknown };
type Step = { title: unknown; text: unknown; image: unknown };

export default class TrustStrip extends AbySection {
  protected readonly styleId = "trust-strip";

  protected styles() {
    return css;
  }

  render() {
    const cfg = this.cfg();
    const badges = getCollectionItems<Badge>(cfg.badges, "badges").map((b) => ({ icon: String(b.icon || "sicon-check"), text: resolveText(b.text) })).filter((b) => b.text);
    const steps = getCollectionItems<Step>(cfg.steps, "steps").map((s) => ({ title: resolveText(s.title), text: resolveText(s.text), image: String(s.image || "") })).filter((s) => s.title);
    if (!badges.length && !steps.length) {
      if (isLandingPage()) return nothing;
      return this.frame(html`<p class="aby-ts__empty">${t({ ar: "أضف المميزات أو خطوات الصناعة من إعدادات هذا القسم", en: "Add badges or steps in this section's settings" })}</p>`);
    }
    const compact = unwrapValue(cfg.layout) === "compact" && !steps.length;
    return this.frame(html`
      ${badges.length ? html`<div class="aby-ts__badges">${badges.map((b) => html`<div class="aby-ts__badge"><i class=${b.icon} aria-hidden="true"></i><span>${b.text}</span></div>`)}</div>` : nothing}
      ${steps.length
        ? html`<ol class="aby-ts__steps" style=${`--aby-ts-cols:${Math.min(steps.length, 4)}`}>${steps.map((s) => html`<li class="aby-ts__step">
            ${s.image ? html`<img src=${s.image} alt="" loading="lazy" />` : nothing}
            <h3>${s.title}</h3>${s.text ? html`<p>${s.text}</p>` : nothing}</li>`)}</ol>`
        : nothing}`, { extraClass: `aby-ts${compact ? " aby-ts--compact" : ""}`, title: !compact });
  }
}
