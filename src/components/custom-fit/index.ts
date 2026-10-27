import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { buyAction, type BuyRequest } from "../../utils/buy";
import { getCollectionItems, resolveText, t, unwrapValue } from "../../utils/config";
import { measurementMessage, sharedPick, whatsappLink } from "../../utils/fit";
import { fetchProduct, isLandingPage } from "../../utils/landing";
import { AbySection, productIdFrom } from "../../utils/section";

const css = `
.aby-cf__grid { display: grid; gap: 1.5rem; }
@container (min-width: 768px) { .aby-cf__grid { grid-template-columns: 2fr 3fr; gap: 2.5rem; align-items: start; } }
.aby-cf__media img { width: 100%; height: auto; border-radius: 1.25rem; background: #fff; }
.aby-cf__form { display: grid; gap: 1rem; padding: 1.5rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-cf__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .875rem; }
@container (max-width: 420px) { .aby-cf__fields { grid-template-columns: minmax(0, 1fr); } }
.aby-cf__field { display: grid; gap: .25rem; min-width: 0; }
.aby-cf__field label { font-weight: 700; font-size: .875rem; color: var(--aby-title); }
.aby-cf__field small { font-size: .75rem; color: var(--aby-text); }
.aby-cf__input { display: flex; align-items: center; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem; background: var(--aby-bg); }
.aby-cf__input:focus-within { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-cf__input input { width: 100%; min-width: 0; min-height: 2.75rem; padding: 0 .875rem; border: 0; background: none; color: var(--aby-title); font: inherit; font-weight: 700; outline: 0; }
.aby-cf__input span { padding-inline-end: .875rem; font-size: .875rem; color: var(--aby-text); }
.aby-cf__notes { width: 100%; min-height: 5.5rem; padding: .75rem .875rem; border: 1px solid color-mix(in srgb, var(--aby-text) 30%, transparent); border-radius: .75rem;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; resize: vertical; }
.aby-cf__notes:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-cf__actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.aby-cf__actions .aby-btn { flex: 1 1 12rem; }
.aby-cf__wa { background: transparent; color: var(--aby-accent-ink); border-color: var(--aby-accent-ink); }
.aby-cf__hint { margin: 0; font-size: .875rem; }
.aby-cf__free { justify-self: start; padding: .25rem .75rem; border-radius: 999px; background: var(--aby-accent); color: var(--aby-accent-text); font-size: .8125rem; font-weight: 700; }
`;

type Field = { label: unknown; unit: unknown; hint: unknown };

export default class CustomFit extends AbySection {
  protected readonly styleId = "custom-fit";
  @state() private product: any = null;
  @state() private values: Record<number, string> = {};
  @state() private notes = "";

  protected styles() {
    return css;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.product = await fetchProduct(productIdFrom(this.cfg()));
  }

  private fields() {
    return getCollectionItems<Field>(this.cfg().fields, "fields")
      .map((f) => ({ label: resolveText(f.label), unit: resolveText(f.unit), hint: resolveText(f.hint) }))
      .filter((f) => f.label);
  }

  private message(): string {
    const rows = this.fields().map((f, i) => ({ label: f.label, unit: f.unit, value: this.values[i] || "" }));
    const head = this.product?.name ? t({ ar: `تفصيل: ${this.product.name}`, en: `Tailoring: ${this.product.name}` }) : "";
    return measurementMessage(rows, this.notes, head);
  }

  /** The cart takes the measurements as the item's note when the product allows notes. */
  private cartReady(): boolean {
    return Boolean(this.product?.can_add_note) && unwrapValue(this.cfg().send_via) !== "whatsapp";
  }

  private request(): BuyRequest | null {
    const id = productIdFrom(this.cfg());
    if (!id) return null;
    // The size, length and color come from the fit finder on the same page
    const options = sharedPick(String(this.product?.id ?? id));
    const missing = (this.product?.options || []).some((o: any) => o?.required && (o.details || []).length && !options[String(o.id)]);
    if (missing) return null;
    return { items: [{ id, quantity: 1, notes: this.message(), options: Object.keys(options).length ? options : undefined }], product: this.product };
  }

  private async onCart() {
    if (!Object.values(this.values).some((v) => v.trim()) && !this.notes.trim()) {
      this.error = t({ ar: "اكتبي مقاس واحد على الأقل", en: "Enter at least one measurement" });
      return;
    }
    const req = this.request();
    if (!req) {
      this.error = t({ ar: "اختاري المقاس واللون من قسم المقاس فوق، وبعدين أضيفي للسلة", en: "Choose the size and color in the fit section above, then add to cart" });
      document.querySelector(".aby-ff")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    await this.press(req);
  }

  render() {
    const cfg = this.cfg();
    const fields = this.fields();
    if (!fields.length && isLandingPage()) return nothing;
    const wa = whatsappLink(cfg.whatsapp, this.message());
    // The cart button shows whenever notes can travel with the item; missing options are asked for on press
    const cart = this.cartReady() && Boolean(productIdFrom(cfg)) && buyAction({ items: [{ id: "x", quantity: 1 }] }) !== "none";
    // A shopper never sees a form with no way to send it
    if (!cart && !wa && isLandingPage()) return nothing;
    const free = resolveText(cfg.free_text);
    const image = String(cfg.image || "");
    return this.frame(html`<div class="aby-cf__grid">
      ${image ? html`<div class="aby-cf__media"><img src=${image} alt="" loading="lazy" /></div>` : nothing}
      <form class="aby-cf__form" @submit=${(e: Event) => { e.preventDefault(); if (cart) this.onCart(); }}>
        ${free ? html`<span class="aby-cf__free">${free}</span>` : nothing}
        <div class="aby-cf__fields">${fields.map((f, i) => html`<div class="aby-cf__field">
          <label for=${`aby-cf-${i}`}>${f.label}</label>
          <div class="aby-cf__input"><input id=${`aby-cf-${i}`} inputmode="decimal" autocomplete="off" .value=${this.values[i] || ""}
            @input=${(e: Event) => { this.values = { ...this.values, [i]: (e.target as HTMLInputElement).value.slice(0, 12) }; this.error = ""; }} />
            ${f.unit ? html`<span>${f.unit}</span>` : nothing}</div>
          ${f.hint ? html`<small>${f.hint}</small>` : nothing}
        </div>`)}</div>
        <label class="aby-visually-hidden" for="aby-cf-notes">${t({ ar: "ملاحظات", en: "Notes" })}</label>
        <textarea id="aby-cf-notes" class="aby-cf__notes" maxlength="500" .value=${this.notes}
          placeholder=${resolveText(cfg.notes_placeholder) || t({ ar: "أي تعديل تحبيه: طول الكم، زراير مخفية، جيوب...", en: "Any changes: sleeve length, hidden buttons, pockets..." })}
          @input=${(e: Event) => (this.notes = (e.target as HTMLTextAreaElement).value)}></textarea>
        <div class="aby-cf__actions">
          ${cart ? html`<button type="submit" class="aby-btn" aria-busy=${this.busy ? "true" : "false"}>${this.buyLabel()}</button>` : nothing}
          ${wa ? html`<a class=${`aby-btn${cart ? " aby-cf__wa" : ""}`} href=${wa} target="_blank" rel="noopener">${t({ ar: "ابعتي المقاسات على الواتساب", en: "Send on WhatsApp" })}</a>` : nothing}
        </div>
        ${!cart && !wa && !isLandingPage()
          ? html`<p class="aby-cf__hint">${t({ ar: "فعّل \"إضافة ملاحظة\" على المنتج في سلة، أو اكتب رقم الواتساب في الإعدادات", en: "Turn on product notes in Salla, or add a WhatsApp number in the settings" })}</p>`
          : nothing}
      </form>
    </div>`, { extraClass: "aby-cf" });
  }
}
