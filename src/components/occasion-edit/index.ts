import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { isAvailable } from "../../utils/bundle";
import { buyAction } from "../../utils/buy";
import { getLocale, t } from "../../utils/config";
import { findOption, optionLabel, swatchFor } from "../../utils/fit";
import { fetchProduct, isLandingPage, money } from "../../utils/landing";
import { AbySection } from "../../utils/section";

const css = `
.aby-oe__colors { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; margin-bottom: 1.5rem; }
.aby-oe__color { display: inline-flex; align-items: center; gap: .5rem; min-height: 2.75rem; padding: 0 1rem 0 .5rem; border: 1.5px solid color-mix(in srgb, var(--aby-text) 22%, transparent);
  border-radius: 999px; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-weight: 700; font-size: .875rem; cursor: pointer; }
.aby-oe__color[aria-pressed="true"] { border-color: var(--aby-accent-ink); box-shadow: inset 0 0 0 1px var(--aby-accent-ink); }
.aby-oe__color:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-oe__color i { width: 1.75rem; height: 1.75rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); }
.aby-oe__grid { display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0; margin: 0; list-style: none; }
@container (min-width: 768px) { .aby-oe__grid { grid-template-columns: repeat(var(--aby-oe-cols, 3), minmax(0, 1fr)); gap: 1.5rem; } }
.aby-oe__card { display: flex; flex-direction: column; min-width: 0; border-radius: 1.25rem; background: var(--aby-card); overflow: hidden; }
.aby-oe__img { position: relative; aspect-ratio: 3 / 4; background: var(--aby-bg); }
.aby-oe__img img { width: 100%; height: 100%; object-fit: cover; }
.aby-oe__tag { position: absolute; top: .625rem; inset-inline-start: .625rem; padding: .125rem .625rem; border-radius: 999px; background: var(--aby-accent);
  color: var(--aby-accent-text); font-size: .75rem; font-weight: 700; }
.aby-oe__body { display: flex; flex-direction: column; gap: .5rem; padding: .875rem; flex: 1 1 auto; }
.aby-oe__name { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 700; font-size: .9375rem; line-height: 1.5; color: var(--aby-title); }
.aby-oe__price { display: flex; gap: .5rem; align-items: baseline; font-weight: 800; color: var(--aby-title); }
.aby-oe__price s { font-weight: 500; font-size: .8125rem; opacity: .65; }
.aby-oe__dots { display: flex; gap: .25rem; }
.aby-oe__dots i { width: .875rem; height: .875rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); }
.aby-oe__body select { width: 100%; min-height: 2.75rem; padding: 0 .625rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: .875rem; }
.aby-oe__body select[aria-invalid="true"] { border-color: #d92d20; }
.aby-oe__body .aby-btn { margin-top: auto; padding-inline: .75rem; font-size: .9375rem; }
.aby-oe__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;

function productIds(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : value ? [value] : [];
  return [...new Set(list.map((item: any) => String((item && typeof item === "object" ? item.value ?? item.id : item) ?? "").trim()).filter(Boolean))].slice(0, 12);
}

type Card = { product: any; colors: string[] };

export default class OccasionEdit extends AbySection {
  protected readonly styleId = "occasion-edit";
  @state() private cards: Card[] = [];
  @state() private loaded = false;
  @state() private color = "";
  @state() private picks: Record<string, Record<string, number>> = {};
  @state() private invalid: Record<string, number[]> = {};
  @state() private pressing = "";

  protected styles() {
    return css;
  }

  async connectedCallback() {
    super.connectedCallback();
    const products = (await Promise.all(productIds(this.cfg().products).map((id) => fetchProduct(id)))).filter((p) => p && isAvailable(p));
    this.cards = products.map((product) => {
      const option = findOption(product, "color");
      const colors = option ? (option.details as any[]).filter((v) => !v.is_out).map((v) => String(v.name)) : [];
      return { product, colors };
    });
    this.loaded = true;
  }

  /** Every color across the edit, merged by name, in the order they first appear. */
  private palette(): string[] {
    return [...new Set(this.cards.flatMap((c) => c.colors))];
  }

  private pick(id: string, optionId: number, value: string) {
    const current = { ...(this.picks[id] || {}) };
    if (value) current[String(optionId)] = Number(value);
    else delete current[String(optionId)];
    this.picks = { ...this.picks, [id]: current };
    if (this.invalid[id]) this.invalid = { ...this.invalid, [id]: this.invalid[id].filter((o) => o !== optionId) };
  }

  private async buy(card: Card) {
    const id = String(card.product.id);
    const chosen = { ...(this.picks[id] || {}) };
    // The color filter picks the matching color for the shopper
    const colorOption = findOption(card.product, "color");
    if (colorOption && this.color && !chosen[String(colorOption.id)]) {
      const value = (colorOption.details as any[]).find((v) => String(v.name) === this.color);
      if (value) chosen[String(colorOption.id)] = Number(value.id);
    }
    const missing = (card.product.options || []).filter((o: any) => o?.required && (o.details || []).length && !chosen[String(o.id)]).map((o: any) => Number(o.id));
    if (missing.length) {
      this.invalid = { ...this.invalid, [id]: missing };
      await this.updateComplete;
      this.querySelector<HTMLSelectElement>(`[data-card="${id}"] select[aria-invalid="true"]`)?.focus();
      return;
    }
    this.pressing = id;
    await this.press({ items: [{ id, quantity: 1, options: Object.keys(chosen).length ? chosen : undefined, max: Number(card.product.max_quantity) || undefined }], product: card.product });
    this.pressing = "";
  }

  private renderCard(card: Card) {
    const p = card.product;
    const id = String(p.id);
    const price = Number(p.sale_price || p.price) || 0;
    const regular = Number(p.regular_price) || 0;
    const colorOption = findOption(p, "color");
    const selects = (p.options || []).filter((o: any) => o?.required && (o.details || []).length && o !== colorOption);
    const invalid = this.invalid[id] || [];
    const tag = p.promotion_title || p.subtitle || "";
    return html`<li class="aby-oe__card" data-card=${id}>
      <div class="aby-oe__img">
        ${p.images?.[0]?.url || p.image?.url ? html`<img src=${p.images?.[0]?.url || p.image.url} alt=${p.image?.alt || ""} loading="lazy" />` : nothing}
        ${tag ? html`<span class="aby-oe__tag">${tag}</span>` : nothing}
      </div>
      <div class="aby-oe__body">
        <span class="aby-oe__name">${p.name}</span>
        <span class="aby-oe__price">${unsafeHTML(money(price))}${regular > price ? html`<s>${unsafeHTML(money(regular))}</s>` : nothing}</span>
        ${card.colors.length > 1 ? html`<span class="aby-oe__dots" aria-label=${card.colors.join("، ")}>${card.colors.slice(0, 6).map((c) => html`<i style=${`background:${swatchFor(c)}`}></i>`)}</span>` : nothing}
        ${[...(colorOption && !this.color ? [colorOption] : []), ...selects].map((o: any) => {
          const sid = `aby-oe-${id}-${o.id}`;
          const label = optionLabel(o, getLocale());
          return html`<label class="aby-visually-hidden" for=${sid}>${label}</label>
            <select id=${sid} aria-invalid=${invalid.includes(Number(o.id)) ? "true" : "false"} @change=${(e: Event) => this.pick(id, o.id, (e.target as HTMLSelectElement).value)}>
              <option value="">${t({ ar: `اختاري ${label}`, en: `Choose ${label}` })}</option>
              ${(o.details as any[]).map((v) => html`<option value=${v.id} ?disabled=${v.is_out}>${v.name}</option>`)}
            </select>`;
        })}
        ${buyAction({ items: [{ id, quantity: 1 }] }) !== "none"
          ? html`<button type="button" class="aby-btn" aria-busy=${this.pressing === id ? "true" : "false"} @click=${() => this.buy(card)}>${this.buyLabel()}</button>`
          : nothing}
      </div>
    </li>`;
  }

  render() {
    if (!this.cards.length) {
      if (!this.loaded || isLandingPage()) return nothing;
      return this.frame(html`<p class="aby-oe__empty">${t({ ar: "اختر عبايات التشكيلة من إعدادات هذا القسم", en: "Pick the edit's abayas in this section's settings" })}</p>`);
    }
    const palette = this.palette();
    const shown = this.color ? this.cards.filter((c) => c.colors.includes(this.color)) : this.cards;
    const cols = Math.min(Math.max(Number(this.cfg().columns) || 3, 2), 4);
    return this.frame(html`
      ${palette.length > 1
        ? html`<div class="aby-oe__colors" role="group" aria-label=${t({ ar: "الألوان", en: "Colors" })}>
            <button type="button" class="aby-oe__color" aria-pressed=${!this.color ? "true" : "false"} @click=${() => (this.color = "")}>
              <i style="background:conic-gradient(#111 0 25%,#d8c3a5 0 50%,#6d1f2c 0 75%,#1f2a44 0)"></i>${t({ ar: "كل الألوان", en: "All colors" })}</button>
            ${palette.map((c) => html`<button type="button" class="aby-oe__color" aria-pressed=${this.color === c ? "true" : "false"} @click=${() => (this.color = c)}>
              <i style=${`background:${swatchFor(c)}`}></i>${c}</button>`)}
          </div>`
        : nothing}
      <ul class="aby-oe__grid" style=${`--aby-oe-cols:${cols}`}>${shown.map((c) => this.renderCard(c))}</ul>`, { extraClass: "aby-oe" });
  }
}
