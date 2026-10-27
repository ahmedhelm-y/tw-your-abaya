import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { buyAction } from "../../utils/buy";
import { resolveText, unwrapValue } from "../../utils/config";
import { fetchProduct, money } from "../../utils/landing";
import { AbySection, productIdFrom } from "../../utils/section";

const css = `
.aby-hero { position: relative; padding: 0; overflow: hidden; }
.aby-hero > .aby-container { max-width: none; padding: 0; }
.aby-hero__media { position: relative; overflow: hidden; background: var(--aby-card); }
.aby-hero__media img, .aby-hero__media video { width: 100%; height: 100%; object-fit: cover; }
.aby-hero__body { display: flex; flex-direction: column; gap: 1rem; max-width: 36rem; }
.aby-hero__badge { align-self: flex-start; padding: .375rem .875rem; border-radius: 999px; background: var(--aby-accent); color: var(--aby-accent-text);
  font-size: .8125rem; font-weight: 700; }
.aby-hero__title { margin: 0; font-size: 2.25rem; line-height: 1.2; font-weight: 800; color: var(--aby-title); }
.aby-hero__sub { margin: 0; font-size: 1.0625rem; line-height: 1.8; color: var(--aby-text); }
.aby-hero__cta { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: .5rem; }
.aby-hero__price { display: flex; align-items: baseline; gap: .5rem; font-size: 1.375rem; font-weight: 800; color: var(--aby-title); }
.aby-hero__price s { font-size: 1rem; font-weight: 500; opacity: .7; }
@container (min-width: 768px) { .aby-hero__title { font-size: 3.25rem; } }

/* Overlay: text over full-bleed media, on a dark veil; the body sits above the positioned media */
.aby-hero--overlay .aby-hero__body { position: relative; z-index: 1; }
.aby-hero--overlay .aby-hero__media { position: absolute; inset: 0; background: color-mix(in srgb, var(--aby-accent) 25%, #0d0b0a); }
.aby-hero--overlay .aby-hero__media::after { content: ""; position: absolute; inset: 0; background: rgb(0 0 0 / var(--aby-hero-veil, .35)); }
.aby-hero--overlay .aby-hero__wrap { display: flex; align-items: center; min-height: var(--aby-hero-h, 85vh);
  max-width: 1200px; margin-inline: auto; padding: 5rem 1rem 3rem; }
.aby-hero--overlay.aby-hero--center .aby-hero__wrap { justify-content: center; text-align: center; }
.aby-hero--overlay.aby-hero--center .aby-hero__body { align-items: center; }
.aby-hero--overlay.aby-hero--center .aby-hero__badge { align-self: center; }
.aby-hero--overlay .aby-hero__title, .aby-hero--overlay .aby-hero__sub, .aby-hero--overlay .aby-hero__price { color: #fff; }

/* Split: media beside the text */
.aby-hero--split .aby-hero__wrap { display: grid; gap: 2rem; max-width: 1200px; margin-inline: auto; padding: 2.5rem 1rem; align-items: center; }
.aby-hero--split .aby-hero__media { aspect-ratio: 4 / 5; border-radius: 1.25rem; }
@container (min-width: 768px) { .aby-hero--split .aby-hero__wrap { grid-template-columns: 1fr 1fr; gap: 3.5rem; padding-block: 4rem; } }
@container (max-width: 767px) { .aby-hero--split .aby-hero__media { order: -1; aspect-ratio: 1 / 1; } }
`;

export default class Hero extends AbySection {
  protected readonly styleId = "hero";
  @state() private product: any = null;
  @state() private mobile = false;
  private media?: MediaQueryList;

  protected styles() {
    return css;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.media = window.matchMedia?.("(max-width: 767px)");
    this.mobile = Boolean(this.media?.matches);
    this.media?.addEventListener?.("change", this.onMedia);
    this.product = await fetchProduct(productIdFrom(this.cfg()));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.media?.removeEventListener?.("change", this.onMedia);
  }

  private onMedia = (e: MediaQueryListEvent) => {
    this.mobile = e.matches;
  };

  private renderMedia() {
    const cfg = this.cfg();
    const pick = (desktop: string, phone: string) => String((this.mobile && cfg[phone]) || cfg[desktop] || "");
    if (unwrapValue(cfg.media) === "video") {
      const src = pick("video_url", "video_url_mobile");
      if (src) {
        const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        // The key forces a fresh element when the source changes between phone and desktop
        return html`<video .src=${src} poster=${cfg.poster || nothing} ?autoplay=${!still} muted loop playsinline preload="metadata"
          aria-hidden="true"></video>`;
      }
    }
    const image = pick("image", "image_mobile");
    const fallback = this.product?.image?.url || "";
    const src = image || fallback;
    return src ? html`<img src=${src} alt="" fetchpriority="high" />` : nothing;
  }

  private renderPrice() {
    const p = this.product;
    if (!p || this.cfg().show_price === false) return nothing;
    const price = Number(p.is_on_sale ? p.sale_price : p.price) || 0;
    const regular = Number(p.regular_price) || 0;
    return html`<span class="aby-hero__price">${unsafeHTML(money(price))}
      ${p.is_on_sale && regular > price ? html`<s>${unsafeHTML(money(regular))}</s>` : nothing}</span>`;
  }

  render() {
    const cfg = this.cfg();
    const layout = unwrapValue(cfg.layout) === "split" ? "split" : "overlay";
    const center = unwrapValue(cfg.content_align) !== "start";
    const veil = Math.min(Math.max(Number(cfg.overlay ?? 35), 0), 80) / 100;
    const height = Math.min(Math.max(Number(cfg.height) || 85, 50), 100);
    const badge = resolveText(cfg.badge);
    const title = resolveText(cfg.title);
    const subtitle = resolveText(cfg.subtitle);
    const canBuy = buyAction() !== "none";

    return this.frame(
      html`<div class="aby-hero__wrap" style=${`--aby-hero-veil:${veil};--aby-hero-h:${height}vh`}>
        <div class="aby-hero__media">${this.renderMedia()}</div>
        <div class="aby-hero__body">
          ${badge ? html`<span class="aby-hero__badge">${badge}</span>` : nothing}
          ${title ? html`<h1 class="aby-hero__title">${title}</h1>` : nothing}
          ${subtitle ? html`<p class="aby-hero__sub">${subtitle}</p>` : nothing}
          <div class="aby-hero__cta">
            ${canBuy
              ? html`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"}
                  @click=${() => this.press({ quantity: 1, product: this.product })}>${this.buyLabel()}</button>`
              : nothing}
            ${this.renderPrice()}
          </div>
        </div>
      </div>`,
      { hero: true, title: false, extraClass: `aby-hero aby-hero--${layout}${center ? " aby-hero--center" : ""}` }
    );
  }
}
