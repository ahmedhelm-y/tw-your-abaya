import { nothing as y, html as b } from "lit";
import { state as v } from "lit/decorators.js";
import { b as x } from "./buy-D6n2j5jF.js";
import { t as c, i as w, r as f } from "./styles-vAeqvApy.js";
import { A as C } from "./section-Cbwxq9g0.js";
function $(r) {
  if (typeof r != "string" || !r.trim()) return null;
  const e = r.trim().replace(/^(\d{4}-\d{2}-\d{2})\s+/, "$1T");
  if (!/^\d{4}-\d{2}-\d{2}/.test(e)) return null;
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? null : t;
}
function S(r, e = /* @__PURE__ */ new Date()) {
  const t = $(r);
  return t !== null && t.getTime() <= e.getTime();
}
function m(r) {
  return `aby-coupon:${r}`;
}
var k = Object.defineProperty, _ = (r, e, t, i) => {
  for (var s = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (s = n(e, t, s) || s);
  return s && k(e, t, s), s;
};
const d = 24, p = 22, z = `
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
class g extends C {
  constructor() {
    super(...arguments), this.styleId = "scratch-coupon", this.revealed = !1, this.status = "", this.cells = /* @__PURE__ */ new Set(), this.drawing = !1, this.moves = 0;
  }
  styles() {
    return z;
  }
  connectedCallback() {
    super.connectedCallback();
    const e = this.code();
    try {
      this.revealed = !!(e && localStorage.getItem(m(e)));
    } catch {
    }
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.resizer) == null || e.disconnect();
  }
  updated() {
    const e = this.canvas();
    !e || this.revealed || this.resizer || (this.resizer = new ResizeObserver(() => this.paintCover()), this.resizer.observe(e), this.paintCover());
  }
  code() {
    return String(this.cfg().code || "").trim();
  }
  canvas() {
    return this.querySelector(".aby-sc__canvas");
  }
  /** Paints the cover at the canvas's real size; scratches restart when the size changes. */
  paintCover() {
    const e = this.canvas();
    if (!e || this.revealed) return;
    const t = e.getBoundingClientRect();
    if (!t.width) return;
    const i = window.devicePixelRatio || 1;
    e.width = Math.round(t.width * i), e.height = Math.round(t.height * i);
    const s = e.getContext("2d");
    if (!s) return;
    s.scale(i, i), this.cells.clear();
    const a = this.cfg(), n = this.querySelector(".aby-block") || this, l = getComputedStyle(n).getPropertyValue("--aby-accent").trim() || "#8a5a2b";
    s.globalCompositeOperation = "source-over", s.fillStyle = String(a.cover_color || l), s.fillRect(0, 0, t.width, t.height);
    const h = () => {
      s.fillStyle = "rgb(255 255 255 / 92%)", s.font = `700 15px ${getComputedStyle(this).fontFamily}`, s.textAlign = "center", s.textBaseline = "middle", s.fillText(f(a.hint) || c({ ar: "اكشط هنا لتكشف الكود", en: "Scratch here to reveal the code" }), t.width / 2, t.height / 2);
    };
    if (a.cover_image) {
      const o = new Image();
      o.onload = () => {
        this.revealed || (s.globalCompositeOperation = "source-over", s.drawImage(o, 0, 0, t.width, t.height), h());
      }, o.src = String(a.cover_image);
    }
    h();
  }
  scratchAt(e) {
    const t = this.canvas(), i = t == null ? void 0 : t.getContext("2d");
    if (!t || !i) return;
    const s = t.getBoundingClientRect(), a = e.clientX - s.left, n = e.clientY - s.top;
    i.globalCompositeOperation = "destination-out", i.beginPath(), i.arc(a, n, p, 0, Math.PI * 2), i.fill();
    const l = s.width / d, h = s.height / d;
    for (let o = Math.floor((a - p) / l); o <= Math.floor((a + p) / l); o++)
      for (let u = Math.floor((n - p) / h); u <= Math.floor((n + p) / h); u++)
        o >= 0 && u >= 0 && o < d && u < d && this.cells.add(u * d + o);
    ++this.moves % 10 === 0 && this.checkDone();
  }
  checkDone() {
    const e = Math.min(Math.max(Number(this.cfg().reveal_percent) || 50, 30), 80) / 100;
    this.cells.size / (d * d) >= e && this.reveal();
  }
  reveal() {
    var e;
    if (!this.revealed) {
      this.revealed = !0, this.status = c({ ar: "مبروك! هذا كود الخصم", en: "Here is your discount code" }), (e = this.resizer) == null || e.disconnect();
      try {
        localStorage.setItem(m(this.code()), "1");
      } catch {
      }
    }
  }
  async copy() {
    var t;
    const e = this.code();
    try {
      await navigator.clipboard.writeText(e), this.status = c({ ar: "تم نسخ الكود", en: "Code copied" });
    } catch {
      const i = this.querySelector(".aby-sc__code");
      i && ((t = window.getSelection()) == null || t.selectAllChildren(i)), this.status = c({ ar: "حددنا الكود، انسخه من قائمة النسخ", en: "The code is selected, copy it from your menu" });
    }
  }
  render() {
    const e = this.cfg(), t = this.code(), i = S(e.expires);
    if (!t || i)
      return w() ? y : this.frame(b`<p class="aby-sc__note">${t ? c({ ar: "انتهى هذا الكوبون، ولن يظهر للعملاء", en: "This coupon has expired and is hidden from shoppers" }) : c({ ar: "اكتب كود الخصم في إعدادات هذا القسم", en: "Add the discount code in this section's settings" })}</p>`);
    const s = f(e.discount_text) || c({ ar: "خصم خاص على طلبك", en: "A special discount on your order" });
    return this.frame(b`<div class="aby-sc__card">
        <p class="aby-sc__deal">${s}</p>
        <div class=${`aby-sc__area${this.revealed ? " is-open" : ""}`}>
          <span class="aby-sc__code" aria-hidden=${this.revealed ? "false" : "true"}>${t}</span>
          <canvas class="aby-sc__canvas${this.revealed ? " is-gone" : ""}" aria-hidden="true"
            @pointerdown=${(a) => {
      var n, l;
      this.drawing = !0, (l = (n = a.target).setPointerCapture) == null || l.call(n, a.pointerId), this.scratchAt(a);
    }}
            @pointermove=${(a) => {
      this.drawing && this.scratchAt(a);
    }}
            @pointerup=${() => {
      this.drawing = !1, this.checkDone();
    }}
            @pointercancel=${() => {
      this.drawing = !1;
    }}></canvas>
        </div>
        <p class="aby-sc__status" aria-live="polite">${this.status}</p>
        <div class="aby-sc__actions">
          ${this.revealed ? b`<button type="button" class="aby-btn aby-sc__ghost" @click=${() => this.copy()}>${c({ ar: "نسخ الكود", en: "Copy code" })}</button>` : b`<button type="button" class="aby-btn aby-sc__ghost" @click=${() => this.reveal()}>${c({ ar: "اكشف الكود", en: "Reveal the code" })}</button>`}
          ${x() !== "none" ? b`<button type="button" class="aby-btn" aria-busy=${this.busy ? "true" : "false"} @click=${() => this.press({ quantity: 1 })}>${this.buyLabel()}</button>` : y}
        </div>
      </div>`, { extraClass: "aby-sc" });
  }
}
_([
  v()
], g.prototype, "revealed");
_([
  v()
], g.prototype, "status");
typeof g < "u" && g.registerSallaComponent("salla-scratch-coupon");
export {
  g as default
};
