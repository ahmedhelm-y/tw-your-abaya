import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { buy, buyAction } from "../../utils/buy";
import { getConfig, resolveText, t, unwrapValue } from "../../utils/config";
import { schemeClass, sectionStyle } from "../../utils/colors";
import { fetchProduct, getSalla, landingProductId, mainButton, money } from "../../utils/landing";
import { ensureBase, injectStyles } from "../../utils/styles";

const css = `
.aby-sb { position: fixed; inset-inline: 0; bottom: 0; z-index: 40; padding-bottom: env(safe-area-inset-bottom);
  background: color-mix(in srgb, var(--aby-bg) 92%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 -1px 0 color-mix(in srgb, var(--aby-text) 12%, transparent), 0 -12px 32px -24px rgb(0 0 0 / 45%);
  transform: translateY(110%); visibility: hidden; transition: transform .35s ease, visibility 0s linear .35s; }
.aby-sb.is-shown { transform: none; visibility: visible; transition: transform .35s ease; }
/* In the editor and previews the bar sits in the page, so the merchant can see and edit it */
.aby-sb--inline { position: static; transform: none; visibility: visible; transition: none; }
@media (prefers-reduced-motion: reduce) { .aby-sb, .aby-sb.is-shown { transition: none; } }
.aby-sb__inner { display: flex; align-items: center; gap: .75rem; max-width: 1200px; margin-inline: auto; padding: .625rem 1rem; }
.aby-sb__info { display: flex; align-items: center; gap: .75rem; flex: 1 1 auto; min-width: 0; }
.aby-sb__img { width: 2.75rem; height: 2.75rem; flex: 0 0 auto; border-radius: .5rem; object-fit: cover; background: var(--aby-card); }
.aby-sb__name { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; font-size: .9375rem; color: var(--aby-title); }
.aby-sb__price { display: flex; align-items: baseline; gap: .375rem; font-size: .875rem; color: var(--aby-text); }
.aby-sb__price b { color: var(--aby-title); font-size: 1rem; }
.aby-sb__price s { opacity: .7; }
.aby-sb__qty { display: flex; align-items: center; height: 2.75rem; flex: 0 0 auto; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: .625rem; }
.aby-sb__qty button { width: 2.5rem; height: 100%; border: 0; background: none; color: var(--aby-title); font-size: 1.25rem; cursor: pointer; }
.aby-sb__qty button:disabled { opacity: .35; cursor: default; }
.aby-sb__qty output { min-width: 1.75rem; text-align: center; font-weight: 700; color: var(--aby-title); }
.aby-sb__buy { flex: 0 0 auto; }
@media (max-width: 767px) {
  .aby-sb--desktop { display: none; }
  .aby-sb__img { display: none; }
  .aby-sb__buy { flex: 1 1 auto; }
  .aby-sb__info { flex: 0 1 auto; max-width: 40%; flex-direction: column; align-items: flex-start; gap: 0; }
}
@media (min-width: 768px) { .aby-sb--mobile { display: none; } }
`;

export default class StickyBuy extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private product: any = null;
  @state() private pastHero = false;
  @state() private checkoutInView = false;
  @state() private quantity = 1;
  @state() private busy = false;
  @state() private error = "";

  private observers: IntersectionObserver[] = [];
  private noHero = false;

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add("aby-host");
    ensureBase();
    injectStyles("aby-sticky-buy", css);
    // Sections and the page's checkout render after this one connects, so watching starts a tick later
    window.setTimeout(() => this.watch(), 0);
    this.product = await fetchProduct(landingProductId());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observers.forEach((o) => o.disconnect());
    this.observers = [];
    window.removeEventListener("scroll", this.onScroll);
    document.documentElement.style.removeProperty("--aby-sb-h");
  }

  protected updated() {
    const bar = this.querySelector<HTMLElement>(".aby-sb");
    const shown = Boolean(bar?.classList.contains("is-shown"));
    // The page footer keeps clear of the bar while it shows
    document.documentElement.style.setProperty("--aby-sb-h", shown ? `${bar!.offsetHeight}px` : "0px");
  }

  private inline(): boolean {
    return Boolean(this.closest(".component-card"));
  }

  private watch() {
    if (typeof IntersectionObserver === "undefined") {
      this.pastHero = true;
      return;
    }
    const hero = document.querySelector("[data-aby-hero]");
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        this.pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      });
      io.observe(hero);
      this.observers.push(io);
    } else {
      this.noHero = true;
      window.addEventListener("scroll", this.onScroll, { passive: true });
      this.onScroll();
    }
    const checkout = document.querySelector(".s-block--fast-checkout");
    if (checkout) {
      const io = new IntersectionObserver(([entry]) => {
        this.checkoutInView = entry.isIntersecting;
      });
      io.observe(checkout);
      this.observers.push(io);
    }
  }

  private onScroll = () => {
    if (this.noHero) this.pastHero = (window.scrollY || document.documentElement.scrollTop) > 600;
  };

  private async onBuy() {
    if (this.busy) return;
    this.busy = true;
    this.error = "";
    let result;
    try {
      result = await buy({ quantity: this.quantity, product: this.product });
    } finally {
      this.busy = false;
    }
    if (result.kind === "error") {
      this.error = result.message || "";
      (getSalla() as any)?.error?.(result.message);
    }
  }

  private renderPrice() {
    const p = this.product;
    const price = Number(p.is_on_sale ? p.sale_price : p.price) || 0;
    const regular = Number(p.regular_price) || 0;
    return html`<span class="aby-sb__price"><b>${unsafeHTML(money(price))}</b>
      ${p.is_on_sale && regular > price ? html`<s>${unsafeHTML(money(regular))}</s>` : nothing}</span>`;
  }

  render() {
    const cfg = getConfig(this.config);
    const action = buyAction();
    if (action === "none") return nothing;
    const p = this.product;
    const inline = this.inline();
    const shown = inline || (this.pastHero && !this.checkoutInView);
    const showOn = String(unwrapValue(cfg.show_on) || "both");
    const label =
      resolveText(cfg.buy_text) ||
      (action === "link" ? mainButton().text : "") ||
      t({ ar: "اشتري الآن", en: "Buy now" });
    const max = Number(p?.max_quantity) || 99;
    const qty = cfg.show_quantity !== false && action !== "link";
    const classes = [
      "aby-block aby-sb",
      schemeClass(cfg),
      inline ? "aby-sb--inline" : "",
      showOn === "mobile" ? "aby-sb--mobile" : showOn === "desktop" ? "aby-sb--desktop" : "",
      shown ? "is-shown" : "",
    ].filter(Boolean).join(" ");

    return html`<div class=${classes} style=${sectionStyle(cfg)} role="region" aria-label=${t({ ar: "شراء سريع", en: "Quick buy" })} aria-hidden=${shown ? "false" : "true"}>
      <div class="aby-sb__inner">
        ${p
          ? html`<div class="aby-sb__info">
              ${p.image?.url ? html`<img class="aby-sb__img" src=${p.image.url} alt="" loading="lazy" />` : nothing}
              <div style="min-width:0">
                <div class="aby-sb__name">${p.name}</div>
                ${cfg.show_price !== false ? this.renderPrice() : nothing}
              </div>
            </div>`
          : html`<div class="aby-sb__info"></div>`}
        ${qty
          ? html`<div class="aby-sb__qty" role="group" aria-label=${t({ ar: "الكمية", en: "Quantity" })}>
              <button type="button" aria-label=${t({ ar: "زيادة الكمية", en: "Increase quantity" })} tabindex=${shown ? 0 : -1} ?disabled=${this.quantity >= max} @click=${() => (this.quantity = Math.min(max, this.quantity + 1))}>+</button>
              <output aria-live="polite">${this.quantity}</output>
              <button type="button" aria-label=${t({ ar: "تقليل الكمية", en: "Decrease quantity" })} tabindex=${shown ? 0 : -1} ?disabled=${this.quantity <= 1} @click=${() => (this.quantity = Math.max(1, this.quantity - 1))}>−</button>
            </div>`
          : nothing}
        <button type="button" class="aby-btn aby-sb__buy" tabindex=${shown ? 0 : -1} aria-busy=${this.busy ? "true" : "false"} @click=${() => this.onBuy()}>${label}</button>
      </div>
      ${this.error ? html`<p class="aby-error aby-container" role="alert">${this.error}</p>` : nothing}
    </div>`;
  }
}
