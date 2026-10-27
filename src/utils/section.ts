import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { buy, type BuyRequest } from "./buy";
import { schemeClass, sectionStyle } from "./colors";
import { anchorId, getConfig, resolveText, t } from "./config";
import { getSalla, landingProductId } from "./landing";
import { reveal } from "./reveal";
import { ensureBase, injectStyles } from "./styles";

/** The page's own product on a product page, else the product picked in the section's field. */
export function productIdFrom(cfg: Record<string, any>, field = "product"): string | null {
  const own = landingProductId();
  if (own) return own;
  const value = cfg[field];
  const first = Array.isArray(value) ? value[0] : value;
  const id = first && typeof first === "object" ? first.value ?? first.id : first;
  return id ? String(id) : null;
}

/**
 * Shared base for the bundle's sections: light DOM, one stylesheet per section type, the section frame
 * with its colors, title and anchor, the reveal animation, and the buy button's busy and error states.
 */
export abstract class AbySection extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() protected busy = false;
  @state() protected error = "";

  /** Short id for this section type's stylesheet, e.g. "hero". */
  protected abstract readonly styleId: string;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("aby-host");
    ensureBase();
    injectStyles(`aby-${this.styleId}`, this.styles());
  }

  protected firstUpdated() {
    const container = this.querySelector(".aby-section:not([data-aby-hero]) > .aby-container");
    if (container) reveal(container);
  }

  protected cfg(): Record<string, any> {
    return getConfig(this.config);
  }

  protected styles(): string {
    return "";
  }

  protected buyLabel(): string {
    return resolveText(this.cfg().buy_text) || t({ ar: "اشتري الآن", en: "Buy now" });
  }

  protected async press(req: BuyRequest = {}): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.error = "";
    let result;
    try {
      result = await buy(req);
    } finally {
      this.busy = false;
    }
    if (result.kind === "error") {
      this.error = result.message || "";
      (getSalla() as any)?.error?.(result.message);
    }
  }

  protected frame(body: TemplateResult | typeof nothing, o: { extraClass?: string; hero?: boolean; title?: boolean } = {}) {
    const cfg = this.cfg();
    const title = o.title === false ? "" : resolveText(cfg.title);
    const subtitle = o.title === false ? "" : resolveText(cfg.subtitle);
    const anchor = anchorId(cfg.section_id);
    const classes = ["aby-block aby-section", schemeClass(cfg), o.extraClass || ""].filter(Boolean).join(" ");
    return html`<section class=${classes} style=${sectionStyle(cfg)} data-aby-section=${anchor || nothing}
      ?data-aby-hero=${Boolean(o.hero)}>
      <div class="aby-container">
        ${title || subtitle
          ? html`<div class="aby-title">${title ? html`<h2>${title}</h2>` : nothing}${subtitle ? html`<p>${subtitle}</p>` : nothing}</div>`
          : nothing}
        ${body}
        ${this.error ? html`<p class="aby-error" role="alert">${this.error}</p>` : nothing}
      </div>
    </section>`;
  }
}
