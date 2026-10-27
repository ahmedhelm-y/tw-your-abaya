import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { bundleTotal, isAvailable, optionExtras, toItems, validateLines, type BundleLine } from "../../utils/bundle";
import { buyAction } from "../../utils/buy";
import { getLocale, resolveText, t } from "../../utils/config";
import { optionLabel } from "../../utils/fit";
import { fetchProduct, isLandingPage, money } from "../../utils/landing";
import { AbySection, productIdFrom } from "../../utils/section";

const css = `
.aby-bb__grid { display: grid; gap: .875rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@container (min-width: 768px) { .aby-bb__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; } }
.aby-bb__card { position: relative; display: flex; flex-direction: column; border: 2px solid color-mix(in srgb, var(--aby-text) 15%, transparent);
  border-radius: 1rem; background: var(--aby-card); overflow: hidden; transition: border-color .2s ease; }
.aby-bb__card.is-on { border-color: var(--aby-accent-ink); }
.aby-bb__pick { display: flex; flex-direction: column; width: 100%; padding: 0; border: 0; background: none; color: inherit; font: inherit; text-align: start; cursor: pointer; }
.aby-bb__pick:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: -4px; }
.aby-bb__img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: var(--aby-bg); }
.aby-bb__check { position: absolute; top: .625rem; inset-inline-start: .625rem; width: 1.75rem; height: 1.75rem; display: grid; place-items: center;
  border: 2px solid #fff; border-radius: .5rem; background: rgb(0 0 0 / 30%); color: #fff; }
.aby-bb__card.is-on .aby-bb__check { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-bb__check svg { width: 1rem; height: 1rem; opacity: 0; }
.aby-bb__card.is-on .aby-bb__check svg { opacity: 1; }
.aby-bb__info { display: flex; flex-direction: column; gap: .25rem; padding: .75rem .875rem 0; }
.aby-bb__name { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 700; font-size: .9375rem; line-height: 1.5; color: var(--aby-title); }
.aby-bb__price { font-weight: 800; color: var(--aby-title); }
.aby-bb__opts { display: grid; gap: .375rem; padding: .625rem .875rem .875rem; margin-top: auto; }
.aby-bb__opts select { width: 100%; min-height: 2.75rem; padding: 0 .625rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent);
  border-radius: .625rem; background: var(--aby-bg); color: var(--aby-title); font: inherit; font-size: .875rem; }
.aby-bb__opts select[aria-invalid="true"] { border-color: #d92d20; }
.aby-bb__miss { color: #d92d20; font-size: .8125rem; font-weight: 600; }
.aby-bb__bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding: 1rem 1.25rem;
  border-radius: 1rem; background: var(--aby-card); }
.aby-bb__sum { display: flex; flex-direction: column; gap: .125rem; }
.aby-bb__total { display: flex; align-items: baseline; gap: .5rem; font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-bb__total s { font-size: 1rem; font-weight: 500; opacity: .7; }
.aby-bb__offer { font-size: .875rem; }
.aby-bb__bar .aby-btn { flex: 1 1 14rem; }
.aby-bb__empty { padding: 2rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
`;

const CHECK = html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3 3 7-7" /></svg>`;

/** Product ids from the editor's multi-select, a single value, or "1,2,3". */
function productIds(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : value ? [value] : [];
  return list
    .map((item: any) => (item && typeof item === "object" ? item.value ?? item.id : item))
    .map((id) => String(id ?? "").trim())
    .filter(Boolean)
    .slice(0, 6);
}

export default class CompleteLook extends AbySection {
  protected readonly styleId = "complete-look";
  @state() private lines: BundleLine[] = [];
  @state() private loaded = false;
  @state() private missing: Record<string, number[]> = {};

  protected styles() {
    return css;
  }

  async connectedCallback() {
    super.connectedCallback();
    const cfg = this.cfg();
    // The abaya the page sells leads the look, picked, and the pieces that go with it follow
    const main = cfg.include_main !== false ? productIdFrom(cfg, "main_product") : null;
    const ids = [...new Set([...(main ? [main] : []), ...productIds(cfg.products)])].slice(0, 6);
    const products = (await Promise.all(ids.map((id) => fetchProduct(id)))).filter((p) => p && isAvailable(p));
    this.lines = products.map((product) => ({
      product, quantity: 1, options: {}, selected: String(product.id) === main || cfg.preselect !== false,
    }));
    this.loaded = true;
  }

  private update_(index: number, change: Partial<BundleLine>) {
    this.lines = this.lines.map((line, i) => (i === index ? { ...line, ...change } : line));
    const id = String(this.lines[index].product.id);
    if (this.missing[id]) {
      const { [id]: _, ...rest } = this.missing;
      this.missing = rest;
    }
  }

  private setOption(index: number, optionId: number, value: string) {
    const options = { ...this.lines[index].options };
    if (value) options[String(optionId)] = Number(value);
    else delete options[String(optionId)];
    this.update_(index, { options, selected: true });
  }

  private async onBuy() {
    const check = validateLines(this.lines, 1);
    this.missing = check.missing;
    if (!check.ok) {
      this.error = Object.keys(check.missing).length
        ? t({ ar: "اختاري المقاس لكل قطعة", en: "Choose a size for every piece" })
        : t({ ar: "اختاري قطعة واحدة على الأقل", en: "Pick at least one piece" });
      await this.updateComplete;
      this.querySelector<HTMLSelectElement>('select[aria-invalid="true"]')?.focus();
      return;
    }
    await this.press({ items: toItems(this.lines) });
  }

  private renderCard(line: BundleLine, index: number) {
    const p = line.product;
    const required: any[] = (p.options || []).filter((o: any) => o?.required && (o.details || []).length);
    const missing = this.missing[String(p.id)] || [];
    const price = (Number(p.sale_price || p.price) || 0) + optionExtras(line);
    return html`<li class="aby-bb__card${line.selected ? " is-on" : ""}">
      <button type="button" class="aby-bb__pick" role="checkbox" aria-checked=${line.selected ? "true" : "false"}
        @click=${() => this.update_(index, { selected: !line.selected })}>
        <span class="aby-bb__check">${CHECK}</span>
        ${p.images?.[0]?.url || p.image?.url ? html`<img class="aby-bb__img" src=${p.images?.[0]?.url || p.image.url} alt="" loading="lazy" />` : nothing}
        <span class="aby-bb__info">
          <span class="aby-bb__name">${p.name}</span>
          <span class="aby-bb__price">${unsafeHTML(money(price))}</span>
        </span>
      </button>
      ${required.length
        ? html`<div class="aby-bb__opts">${required.map((o) => {
            const invalid = missing.includes(Number(o.id));
            const id = `aby-bb-${p.id}-${o.id}`;
            const label = optionLabel(o, getLocale());
            return html`<label class="aby-visually-hidden" for=${id}>${label}</label>
              <select id=${id} aria-invalid=${invalid ? "true" : "false"} @change=${(e: Event) => this.setOption(index, o.id, (e.target as HTMLSelectElement).value)}>
                <option value="">${t({ ar: `اختاري ${label}`, en: `Choose ${label}` })}</option>
                ${(o.details as any[]).map((v) => html`<option value=${v.id} ?disabled=${v.is_out} ?selected=${line.options[String(o.id)] === Number(v.id)}>${v.name}</option>`)}
              </select>
              ${invalid ? html`<span class="aby-bb__miss">${t({ ar: `اختاري ${label}`, en: `Choose ${label}` })}</span>` : nothing}`;
          })}</div>`
        : nothing}
    </li>`;
  }

  render() {
    if (!this.lines.length) {
      if (!this.loaded || isLandingPage()) return nothing;
      return this.frame(html`<p class="aby-bb__empty">${t({ ar: "اختر قطع اللوك من إعدادات هذا القسم", en: "Pick the look's pieces in this section's settings" })}</p>`);
    }
    const sum = bundleTotal(this.lines);
    const offer = resolveText(this.cfg().offer_text);
    const canBuy = buyAction({ items: [{ id: "x", quantity: 1 }] }) !== "none";
    return this.frame(html`<ul class="aby-bb__grid">${this.lines.map((line, i) => this.renderCard(line, i))}</ul>
      <div class="aby-bb__bar">
        <div class="aby-bb__sum" aria-live="polite">
          <span>${t({ ar: sum.count === 1 ? "قطعة واحدة" : sum.count === 2 ? "قطعتين" : `${sum.count} قطع`, en: `${sum.count} pieces` })}</span>
          <span class="aby-bb__total">${unsafeHTML(money(sum.total))}
            ${sum.regular > sum.total ? html`<s>${unsafeHTML(money(sum.regular))}</s>` : nothing}</span>
          ${offer ? html`<span class="aby-bb__offer">${offer}</span>` : nothing}
        </div>
        ${canBuy
          ? html`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} ?disabled=${!sum.count}
              @click=${() => this.onBuy()}>${resolveText(this.cfg().buy_text) || t({ ar: "أضيفي اللوك للسلة", en: "Add the look" })}</button>`
          : nothing}
      </div>`, { extraClass: "aby-bb aby-cl" });
  }
}
