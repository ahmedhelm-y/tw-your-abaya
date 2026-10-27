import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { buyAction } from "../../utils/buy";
import { resolveText, t } from "../../utils/config";
import { isExpired, revealedKey } from "../../utils/coupon";
import { isLandingPage } from "../../utils/landing";
import { AbySection } from "../../utils/section";

const GRID = 24;
const BRUSH = 22;

const css = `
.aby-sc__card { display: flex; flex-direction: column; align-items: center; gap: 1rem; max-width: 30rem; margin-inline: auto; padding: 1.75rem 1.25rem;
  border-radius: 1.5rem; background: var(--aby-card); text-align: center; user-select: none; -webkit-user-select: none; }
.aby-sc__deal { margin: 0; font-size: 1.5rem; font-weight: 800; line-height: 1.35; color: var(--aby-title); }
.aby-sc__area { position: relative; width: 100%; height: 6.5rem; border-radius: 1rem; overflow: hidden;
  border: 2px dashed var(--aby-accent-ink); background: var(--aby-bg); }
.aby-sc__code { position: absolute; inset: 0; display: grid; place-items: center; font-size: 2rem; font-weight: 800; letter-spacing: .15em;
  color: var(--aby-title); direction: ltr; }
.aby-sc__area.is-open .aby-sc__code { user-select: all; -webkit-user-select: all; }
.aby-sc__canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: grab; transition: opacity .5s ease; }
.aby-sc__canvas.is-gone { opacity: 0; pointer-events: none; }
.aby-sc__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; width: 100%; }
.aby-sc__actions .aby-btn { flex: 1 1 10rem; }
.aby-sc__ghost { background: transparent; color: var(--aby-title); border-color: color-mix(in srgb, var(--aby-text) 30%, transparent); }
.aby-sc__status { min-height: 1.5em; margin: 0; font-size: .875rem; color: var(--aby-text); }
.aby-sc__note { padding: 1.5rem; border: 1px dashed color-mix(in srgb, var(--aby-text) 35%, transparent); border-radius: 1rem; text-align: center; }
@media (prefers-reduced-motion: reduce) { .aby-sc__canvas { transition: none; } }
`;

export default class ScratchCoupon extends AbySection {
  protected readonly styleId = "scratch-coupon";
  @state() private revealed = false;
  @state() private status = "";

  private cells = new Set<number>();
  private drawing = false;
  private moves = 0;
  private resizer?: ResizeObserver;

  protected styles() {
    return css;
  }

  connectedCallback() {
    super.connectedCallback();
    const code = this.code();
    try {
      this.revealed = Boolean(code && localStorage.getItem(revealedKey(code)));
    } catch {
      // storage blocked: the card starts covered
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizer?.disconnect();
  }

  protected updated() {
    const canvas = this.canvas();
    if (!canvas || this.revealed || this.resizer) return;
    this.resizer = new ResizeObserver(() => this.paintCover());
    this.resizer.observe(canvas);
    this.paintCover();
  }

  private code(): string {
    return String(this.cfg().code || "").trim();
  }

  private canvas(): HTMLCanvasElement | null {
    return this.querySelector(".aby-sc__canvas");
  }

  /** Paints the cover at the canvas's real size; scratches restart when the size changes. */
  private paintCover() {
    const canvas = this.canvas();
    if (!canvas || this.revealed) return;
    const box = canvas.getBoundingClientRect();
    if (!box.width) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(box.width * ratio);
    canvas.height = Math.round(box.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    this.cells.clear();
    const cfg = this.cfg();
    const block = this.querySelector(".aby-block") || this;
    const color = getComputedStyle(block).getPropertyValue("--aby-accent").trim() || "#8a5a2b";
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = String(cfg.cover_color || color);
    ctx.fillRect(0, 0, box.width, box.height);
    const hint = () => {
      ctx.fillStyle = "rgb(255 255 255 / 92%)";
      ctx.font = `700 15px ${getComputedStyle(this).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(resolveText(cfg.hint) || t({ ar: "اكشط هنا لتكشف الكود", en: "Scratch here to reveal the code" }), box.width / 2, box.height / 2);
    };
    if (cfg.cover_image) {
      const img = new Image();
      img.onload = () => {
        if (this.revealed) return;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0, box.width, box.height);
        hint();
      };
      img.src = String(cfg.cover_image);
    }
    hint();
  }

  private scratchAt(e: PointerEvent) {
    const canvas = this.canvas();
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const box = canvas.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
    // Scratched area is tracked on a grid, so it works even when the cover image cannot be read back
    const cw = box.width / GRID;
    const ch = box.height / GRID;
    for (let gx = Math.floor((x - BRUSH) / cw); gx <= Math.floor((x + BRUSH) / cw); gx++) {
      for (let gy = Math.floor((y - BRUSH) / ch); gy <= Math.floor((y + BRUSH) / ch); gy++) {
        if (gx >= 0 && gy >= 0 && gx < GRID && gy < GRID) this.cells.add(gy * GRID + gx);
      }
    }
    if (++this.moves % 10 === 0) this.checkDone();
  }

  private checkDone() {
    const need = Math.min(Math.max(Number(this.cfg().reveal_percent) || 50, 30), 80) / 100;
    if (this.cells.size / (GRID * GRID) >= need) this.reveal();
  }

  private reveal() {
    if (this.revealed) return;
    this.revealed = true;
    this.status = t({ ar: "مبروك! هذا كود الخصم", en: "Here is your discount code" });
    this.resizer?.disconnect();
    try {
      localStorage.setItem(revealedKey(this.code()), "1");
    } catch {
      // the code stays visible for this visit
    }
  }

  private async copy() {
    const code = this.code();
    try {
      await navigator.clipboard.writeText(code);
      this.status = t({ ar: "تم نسخ الكود", en: "Code copied" });
    } catch {
      // Older browsers: select the code so the shopper can copy it by hand
      const el = this.querySelector(".aby-sc__code");
      if (el) window.getSelection()?.selectAllChildren(el);
      this.status = t({ ar: "حددنا الكود، انسخه من قائمة النسخ", en: "The code is selected, copy it from your menu" });
    }
  }

  render() {
    const cfg = this.cfg();
    const code = this.code();
    const expired = isExpired(cfg.expires);
    if (!code || expired) {
      if (isLandingPage()) return nothing;
      return this.frame(html`<p class="aby-sc__note">${!code
        ? t({ ar: "اكتب كود الخصم في إعدادات هذا القسم", en: "Add the discount code in this section's settings" })
        : t({ ar: "انتهى هذا الكوبون، ولن يظهر للعملاء", en: "This coupon has expired and is hidden from shoppers" })}</p>`);
    }
    const deal = resolveText(cfg.discount_text) || t({ ar: "خصم خاص على طلبك", en: "A special discount on your order" });

    return this.frame(html`<div class="aby-sc__card">
        <p class="aby-sc__deal">${deal}</p>
        <div class=${`aby-sc__area${this.revealed ? " is-open" : ""}`}>
          <span class="aby-sc__code" aria-hidden=${this.revealed ? "false" : "true"}>${code}</span>
          <canvas class="aby-sc__canvas${this.revealed ? " is-gone" : ""}" aria-hidden="true"
            @pointerdown=${(e: PointerEvent) => { this.drawing = true; (e.target as Element).setPointerCapture?.(e.pointerId); this.scratchAt(e); }}
            @pointermove=${(e: PointerEvent) => { if (this.drawing) this.scratchAt(e); }}
            @pointerup=${() => { this.drawing = false; this.checkDone(); }}
            @pointercancel=${() => { this.drawing = false; }}></canvas>
        </div>
        <p class="aby-sc__status" aria-live="polite">${this.status}</p>
        <div class="aby-sc__actions">
          ${this.revealed
            ? html`<button type="button" class="aby-btn aby-sc__ghost" @click=${() => this.copy()}>${t({ ar: "نسخ الكود", en: "Copy code" })}</button>`
            : html`<button type="button" class="aby-btn aby-sc__ghost" @click=${() => this.reveal()}>${t({ ar: "اكشف الكود", en: "Reveal the code" })}</button>`}
          ${buyAction() !== "none"
            ? html`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} @click=${() => this.press({ quantity: 1 })}>${this.buyLabel()}</button>`
            : nothing}
        </div>
      </div>`, { extraClass: "aby-sc" });
  }
}
