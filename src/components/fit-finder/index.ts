import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { buyAction, type BuyRequest } from "../../utils/buy";
import { getCollectionItems, getLocale, resolveText, t } from "../../utils/config";
import { findOption, lowStock, optionLabel, sharePick, matchValue, recommendLength, remaining, swatchFor, type LengthRow } from "../../utils/fit";
import { fetchProduct, isLandingPage, landingProductId, money } from "../../utils/landing";
import { AbySection, productIdFrom } from "../../utils/section";

const css = `
.aby-ff__grid { display: grid; gap: 1.25rem; }
@container (min-width: 768px) { .aby-ff__grid { grid-template-columns: 2fr 3fr; gap: 2.5rem; align-items: start; } }
.aby-ff__advisor { display: grid; gap: 1rem; padding: 1.25rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-ff__advisor h3 { margin: 0; font-size: 1.125rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__field { display: grid; gap: .375rem; }
.aby-ff__field label { font-weight: 700; font-size: .9375rem; color: var(--aby-title); }
.aby-ff__height { display: flex; align-items: center; gap: .5rem; }
.aby-ff__height input { width: 100%; min-height: 3rem; padding: 0 1rem; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: 1.125rem; font-weight: 700; }
.aby-ff__height input:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-ff__unit { font-weight: 700; color: var(--aby-text); }
.aby-ff__heels { display: flex; align-items: center; gap: .625rem; min-height: 2.75rem; cursor: pointer; font-size: .9375rem; }
.aby-ff__heels input { width: 1.25rem; height: 1.25rem; accent-color: var(--aby-accent); }
.aby-ff__result { margin: 0; padding: .875rem 1rem; border-radius: .875rem; background: var(--aby-bg); color: var(--aby-text); font-size: .9375rem; line-height: 1.7; }
.aby-ff__result strong { display: block; font-size: 1.375rem; color: var(--aby-accent-ink); }
.aby-ff__chart { justify-self: start; padding: 0; border: 0; background: none; color: var(--aby-accent-ink); font: inherit; font-weight: 700;
  text-decoration: underline; text-underline-offset: 4px; cursor: pointer; min-height: 2.75rem; }
.aby-ff__table { width: 100%; border-collapse: collapse; font-size: .875rem; font-variant-numeric: tabular-nums; }
.aby-ff__table th, .aby-ff__table td { padding: .375rem .5rem; border-bottom: 1px solid color-mix(in srgb, var(--aby-text) 15%, transparent); text-align: start; }
.aby-ff__table th { color: var(--aby-title); }
.aby-ff__table tr.is-on td { color: var(--aby-accent-ink); font-weight: 800; }
.aby-ff__pick { display: grid; gap: 1.25rem; }
.aby-ff__group { display: grid; gap: .625rem; border: 0; margin: 0; padding: 0; min-width: 0; }
.aby-ff__group legend { padding: 0; margin-bottom: .625rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__group legend span { font-weight: 500; color: var(--aby-text); }
.aby-ff__opts { display: flex; flex-wrap: wrap; gap: .5rem; }
.aby-ff__opt { position: relative; min-width: 3.25rem; min-height: 2.75rem; padding: .375rem .875rem; border: 1.5px solid color-mix(in srgb, var(--aby-text) 25%, transparent);
  border-radius: .75rem; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-weight: 700; cursor: pointer; }
.aby-ff__opt[aria-checked="true"] { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-ff__opt[aria-disabled="true"] { opacity: .4; text-decoration: line-through; cursor: not-allowed; }
.aby-ff__opt:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-ff__opt.is-tip::after { content: attr(data-tip); position: absolute; top: -.65rem; inset-inline-end: -.25rem; padding: 0 .375rem; border-radius: 999px;
  background: var(--aby-title); color: var(--aby-bg); font-size: .6875rem; line-height: 1.4; white-space: nowrap; }
.aby-ff__swatch { display: inline-flex; align-items: center; gap: .5rem; }
.aby-ff__swatch i { width: 1.125rem; height: 1.125rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); }
.aby-ff__stock { justify-self: start; padding: .25rem .75rem; border-radius: 999px; background: color-mix(in srgb, #d92d20 12%, var(--aby-bg)); color: #b42318;
  font-size: .875rem; font-weight: 700; }
.aby-block.aby-dark .aby-ff__stock, html.aby-mode-dark .aby-auto .aby-ff__stock { color: #fda29b; }
.aby-ff__actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.aby-ff__price { font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-ff__actions .aby-btn { flex: 1 1 12rem; }
.aby-ff__qty { display: flex; align-items: center; height: 2.75rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem; }
.aby-ff__qty button { width: 2.75rem; height: 100%; border: 0; background: none; color: var(--aby-title); font-size: 1.25rem; cursor: pointer; }
.aby-ff__qty button:disabled { opacity: .35; cursor: default; }
.aby-ff__qty output { min-width: 2rem; text-align: center; font-weight: 700; color: var(--aby-title); }
.aby-ff__dialog { width: min(40rem, calc(100vw - 2rem)); max-height: 85vh; padding: 1rem; border: 0; border-radius: 1rem; background: #fff; }
.aby-ff__dialog::backdrop { background: rgb(0 0 0 / 60%); }
.aby-ff__dialog img { width: 100%; height: auto; }
.aby-ff__close { display: block; margin-inline-start: auto; width: 2.75rem; height: 2.75rem; border: 0; background: none; font-size: 1.75rem; cursor: pointer; color: #111; }
.aby-ff__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;

type Kind = "size" | "length" | "color";

export default class FitFinder extends AbySection {
  protected readonly styleId = "fit-finder";
  @state() private product: any = null;
  @state() private loaded = false;
  @state() private height = "";
  @state() private heels = false;
  @state() private chosen: Partial<Record<Kind, number>> = {};
  @state() private quantity = 1;
  @state() private chart = false;

  protected styles() {
    return css;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.product = await fetchProduct(productIdFrom(this.cfg()));
    this.loaded = true;
  }

  private rows(): LengthRow[] {
    return getCollectionItems<LengthRow>(this.cfg().lengths, "lengths").filter((r) => String(r.length ?? "").trim());
  }

  private advice(rows: LengthRow[]): number {
    return recommendLength(Number(this.height), rows, this.heels);
  }

  private onHeight(value: string, rows: LengthRow[]) {
    this.height = value.replace(/[^\d٠-٩]/g, "").slice(0, 3).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    this.applyAdvice(rows);
  }

  /** The advised length is picked for the shopper, who can still change it. */
  private applyAdvice(rows: LengthRow[]) {
    const index = this.advice(rows);
    const option = findOption(this.product, "length");
    const value = index >= 0 ? matchValue(option, rows[index].length) : null;
    if (value && !value.is_out) this.chosen = { ...this.chosen, length: Number(value.id) };
  }

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has("chosen") || !this.product) return;
    const options: Record<string, number> = {};
    for (const { kind, option } of this.options()) if (this.chosen[kind]) options[String(option.id)] = this.chosen[kind]!;
    sharePick({ productId: String(this.product.id), options });
  }

  private options(): { kind: Kind; option: any }[] {
    return (["size", "length", "color"] as Kind[])
      .map((kind) => ({ kind, option: findOption(this.product, kind) }))
      .filter((o) => o.option);
  }

  private request(): BuyRequest {
    const options: Record<string, number> = {};
    for (const { kind, option } of this.options()) if (this.chosen[kind]) options[String(option.id)] = this.chosen[kind]!;
    const id = productIdFrom(this.cfg());
    const own = Boolean(landingProductId());
    const has = Object.keys(options).length > 0;
    if (own || !id) return { quantity: this.quantity, ...(has ? { options } : {}), product: this.product };
    return { items: [{ id, quantity: this.quantity, options: has ? options : undefined, max: Number(this.product?.max_quantity) || undefined }], product: this.product };
  }

  private async onBuy() {
    const missing = this.options().find(({ kind, option }) => option.required && !this.chosen[kind]);
    if (missing) {
      const label = optionLabel(missing.option, getLocale());
      this.error = t({ ar: `اختاري ${label}`, en: `Choose ${label}` });
      return;
    }
    await this.press(this.request());
  }

  private price(): number {
    let sum = Number(this.product?.sale_price || this.product?.price) || 0;
    for (const { kind, option } of this.options()) {
      const value = (option.details as any[]).find((v) => Number(v.id) === this.chosen[kind]);
      sum += Number(value?.additional_price) || 0;
    }
    return sum;
  }

  private stockLeft(): number | null {
    const size = findOption(this.product, "size");
    const value = size && this.chosen.size ? (size.details as any[]).find((v) => Number(v.id) === this.chosen.size) : undefined;
    return lowStock(remaining(this.product, value), Number(this.cfg().stock_threshold) || 5);
  }

  private renderGroup(kind: Kind, option: any, tipId: number | null) {
    const chosenName = (option.details as any[]).find((v) => Number(v.id) === this.chosen[kind])?.name;
    const label = optionLabel(option, getLocale());
    return html`<fieldset class="aby-ff__group">
      <legend>${label}${chosenName ? html` <span>: ${chosenName}</span>` : nothing}</legend>
      <div class="aby-ff__opts" role="radiogroup" aria-label=${label}>
        ${(option.details as any[]).map((v) => {
          const on = this.chosen[kind] === Number(v.id);
          const tip = tipId === Number(v.id);
          return html`<button type="button" role="radio" aria-checked=${on ? "true" : "false"} aria-disabled=${v.is_out ? "true" : "false"}
            class=${`aby-ff__opt${tip ? " is-tip" : ""}`} data-tip=${tip ? t({ ar: "مناسب لك", en: "Your fit" }) : nothing}
            @click=${() => { if (!v.is_out) { this.chosen = { ...this.chosen, [kind]: Number(v.id) }; this.error = ""; } }}>
            ${kind === "color" ? html`<span class="aby-ff__swatch"><i style=${`background:${swatchFor(v.name, v.color)}`}></i>${v.name}</span>` : v.name}
          </button>`;
        })}
      </div>
    </fieldset>`;
  }

  private renderAdvisor(rows: LengthRow[]) {
    const cfg = this.cfg();
    const index = this.advice(rows);
    const chartImage = String(cfg.size_chart || "");
    return html`<div class="aby-ff__advisor">
      <h3>${resolveText(cfg.advisor_title) || t({ ar: "اعرفي طولك المناسب", en: "Find your length" })}</h3>
      <div class="aby-ff__field">
        <label for="aby-ff-height">${t({ ar: "طولك", en: "Your height" })}</label>
        <div class="aby-ff__height">
          <input id="aby-ff-height" inputmode="numeric" autocomplete="off" placeholder="160" .value=${this.height}
            @input=${(e: Event) => this.onHeight((e.target as HTMLInputElement).value, rows)} />
          <span class="aby-ff__unit">${t({ ar: "سم", en: "cm" })}</span>
        </div>
      </div>
      ${cfg.show_heels !== false
        ? html`<label class="aby-ff__heels"><input type="checkbox" .checked=${this.heels}
            @change=${(e: Event) => { this.heels = (e.target as HTMLInputElement).checked; this.applyAdvice(rows); }} />
            ${t({ ar: "هلبسها مع كعب", en: "I'll wear heels" })}</label>`
        : nothing}
      <p class="aby-ff__result" aria-live="polite">${index >= 0
        ? html`${t({ ar: "الطول المناسب لك", en: "Your length" })}<strong>${resolveText(rows[index].length)}</strong>`
        : t({ ar: "اكتبي طولك بالسنتيمتر ونختار لك طول العباية", en: "Type your height in cm and we'll pick the abaya length" })}</p>
      ${rows.length
        ? html`<table class="aby-ff__table"><thead><tr><th>${t({ ar: "طول العباية", en: "Abaya length" })}</th><th>${t({ ar: "طولك (سم)", en: "Your height (cm)" })}</th></tr></thead>
            <tbody>${rows.map((r, i) => html`<tr class=${i === index ? "is-on" : ""}><td>${resolveText(r.length)}</td><td>${Number(r.min)} – ${Number(r.max)}</td></tr>`)}</tbody></table>`
        : nothing}
      ${chartImage ? html`<button type="button" class="aby-ff__chart" @click=${() => this.openChart()}>${t({ ar: "جدول المقاسات", en: "Size chart" })}</button>` : nothing}
    </div>`;
  }

  private async openChart() {
    this.chart = true;
    await this.updateComplete;
    this.querySelector<HTMLDialogElement>(".aby-ff__dialog")?.showModal?.();
  }

  private closeChart() {
    this.querySelector<HTMLDialogElement>(".aby-ff__dialog")?.close?.();
    this.chart = false;
  }

  render() {
    const rows = this.rows();
    if (!this.product) {
      if (!this.loaded || isLandingPage()) return nothing;
      return this.frame(html`<p class="aby-ff__empty">${t({ ar: "اختر العباية من إعدادات هذا القسم", en: "Pick the abaya in this section's settings" })}</p>`);
    }
    const lengthOption = findOption(this.product, "length");
    const advisedIndex = this.advice(rows);
    const tip = advisedIndex >= 0 ? matchValue(lengthOption, rows[advisedIndex].length) : null;
    const left = this.stockLeft();
    const stockText = resolveText(this.cfg().stock_text);
    const max = Number(this.product?.max_quantity) || 99;
    const canBuy = buyAction(this.request()) !== "none";
    const soldOut = this.product?.is_available === false || this.product?.status === "out";

    return this.frame(html`<div class="aby-ff__grid">
      ${rows.length ? this.renderAdvisor(rows) : nothing}
      <div class="aby-ff__pick">
        ${this.options().map(({ kind, option }) => this.renderGroup(kind, option, kind === "length" && tip ? Number(tip.id) : null))}
        ${left !== null
          ? html`<span class="aby-ff__stock" role="status">${t({ ar: `باقي ${left} ${left === 1 ? "قطعة" : left === 2 ? "قطعتين" : "قطع"} بس`, en: `Only ${left} left` })}</span>`
          : stockText ? html`<span class="aby-ff__stock">${stockText}</span>` : nothing}
        <div class="aby-ff__actions">
          <span class="aby-ff__price">${unsafeHTML(money(this.price()))}</span>
          ${canBuy
            ? html`<div class="aby-ff__qty" role="group" aria-label=${t({ ar: "الكمية", en: "Quantity" })}>
                <button type="button" aria-label=${t({ ar: "زيادة الكمية", en: "Increase quantity" })} ?disabled=${this.quantity >= max} @click=${() => (this.quantity = Math.min(max, this.quantity + 1))}>+</button>
                <output>${this.quantity}</output>
                <button type="button" aria-label=${t({ ar: "تقليل الكمية", en: "Decrease quantity" })} ?disabled=${this.quantity <= 1} @click=${() => (this.quantity = Math.max(1, this.quantity - 1))}>−</button>
              </div>
              <button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} ?disabled=${soldOut} @click=${() => this.onBuy()}>
                ${soldOut ? t({ ar: "نفدت الكمية", en: "Sold out" }) : this.buyLabel()}</button>`
            : nothing}
        </div>
      </div>
    </div>
    ${this.chart
      ? html`<dialog class="aby-ff__dialog" @close=${() => (this.chart = false)} @click=${(e: Event) => { if (e.target === e.currentTarget) this.closeChart(); }}>
          <button type="button" class="aby-ff__close" aria-label=${t({ ar: "إغلاق", en: "Close" })} @click=${() => this.closeChart()}>×</button>
          <img src=${String(this.cfg().size_chart)} alt=${t({ ar: "جدول المقاسات", en: "Size chart" })} />
        </dialog>`
      : nothing}`, { extraClass: "aby-ff" });
  }
}
