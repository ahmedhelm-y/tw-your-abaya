import { html as s, nothing as o } from "lit";
import { state as v } from "lit/decorators.js";
import { g as k, r as h, t as d } from "./styles-vAeqvApy.js";
import { e as S, h as M } from "./fit-Cpxi4Lua.js";
import { A as q } from "./section-DUIqt8g_.js";
const f = 0.2;
function z(l) {
  const e = l.map(Number).filter((a) => Number.isInteger(a) && a >= 1 && a <= 5), t = [5, 4, 3, 2, 1].map((a) => e.filter((i) => i === a).length);
  return { average: e.length ? Math.round(e.reduce((a, i) => a + i, 0) / e.length * 10) / 10 : 0, count: e.length, dist: t };
}
function A(l) {
  if (!Number.isFinite(l) || l < 0) return "0:00";
  const e = Math.floor(l);
  return `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`;
}
function w(l, e) {
  let t = 2166136261;
  for (let a = 0; a < l.length; a++) t = Math.imul(t ^ l.charCodeAt(a), 16777619);
  const r = [];
  for (let a = 0; a < e; a++) {
    t = Math.imul(t ^ t >>> 15, 2246822507) ^ Math.imul(t ^ t >>> 13, 3266489909);
    const i = (t >>> 0) % 1e3 / 1e3, c = 0.55 + 0.45 * Math.sin(a / e * Math.PI);
    r.push(Math.round((f + (1 - f) * i * c) * 100) / 100);
  }
  return r;
}
function C(l, e) {
  const t = Math.max(1, Math.floor(l.length / e)), r = [];
  for (let i = 0; i < e; i++) {
    let c = 0;
    for (let n = i * t; n < Math.min((i + 1) * t, l.length); n++) c = Math.max(c, Math.abs(l[n]));
    r.push(c);
  }
  const a = Math.max(...r);
  return a ? r.map((i) => Math.max(f, Math.round(i / a * 100) / 100)) : r.map(() => f);
}
let u = null;
class P {
  constructor(e) {
    this.audio = e, this.state = { playing: !1, time: 0, duration: 0, rate: 1, error: !1 }, this.listeners = [];
    const t = () => this.set({ playing: !e.paused, time: e.currentTime || 0, duration: Number.isFinite(e.duration) ? e.duration : 0 });
    this.events = [
      ["play", t],
      ["pause", t],
      ["timeupdate", t],
      ["loadedmetadata", t],
      ["ended", () => this.set({ playing: !1, time: 0 })],
      ["error", () => this.set({ playing: !1, error: !0 })]
    ];
    for (const [r, a] of this.events) e.addEventListener(r, a);
  }
  onState(e) {
    this.listeners.push(e);
  }
  set(e) {
    this.state = { ...this.state, ...e }, this.listeners.forEach((t) => t(this.state));
  }
  async play() {
    u && u !== this && u.pause(), u = this;
    try {
      await this.audio.play(), this.set({ playing: !0, error: !1 });
    } catch {
      this.set({ playing: !1, error: !0 });
    }
  }
  pause() {
    this.audio.pause(), this.set({ playing: !1 }), u === this && (u = null);
  }
  toggle() {
    return this.state.playing ? this.pause() : this.play();
  }
  seek(e) {
    const t = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    t && (this.audio.currentTime = Math.min(Math.max(e, 0), 1) * t, this.set({ time: this.audio.currentTime }));
  }
  setRate(e) {
    this.audio.playbackRate = e, this.set({ rate: e });
  }
  destroy() {
    u === this && this.pause();
    for (const [e, t] of this.events) this.audio.removeEventListener(e, t);
    this.listeners = [];
  }
}
async function R(l, e) {
  var t;
  try {
    const r = window.AudioContext || window.webkitAudioContext;
    if (!r) throw new Error("no audio context");
    const a = await fetch(l, { mode: "cors" });
    if (!a.ok) throw new Error(String(a.status));
    const i = await a.arrayBuffer(), c = new r();
    try {
      const n = await c.decodeAudioData(i);
      return C(n.getChannelData(0), e);
    } finally {
      (t = c.close) == null || t.call(c);
    }
  } catch {
    return w(l, e);
  }
}
var B = Object.defineProperty, y = (l, e, t, r) => {
  for (var a = void 0, i = l.length - 1, c; i >= 0; i--)
    (c = l[i]) && (a = c(e, t, a) || a);
  return a && B(e, t, a), a;
};
const x = 40;
let E = 0;
const $ = [1, 1.5, 2], m = {
  small: { ar: "صغير", en: "Runs small" },
  true: { ar: "مظبوط", en: "True to size" },
  large: { ar: "واسع", en: "Runs large" }
}, I = `
.aby-rv__summary { display: grid; gap: 1.25rem; margin-bottom: 2rem; padding: 1.5rem; border-radius: 1.5rem; background: var(--aby-card); }
@container (min-width: 768px) { .aby-rv__summary { grid-template-columns: auto 1fr; gap: 2.5rem; align-items: center; } }
.aby-rv__score { display: flex; flex-direction: column; align-items: center; gap: .25rem; }
.aby-rv__avg { font-size: 3rem; font-weight: 800; line-height: 1; color: var(--aby-title); }
.aby-rv__count { font-size: .875rem; color: var(--aby-text); }
.aby-rv__dist { display: grid; gap: .375rem; min-width: 12rem; }
.aby-rv__distrow { display: grid; grid-template-columns: 1.25rem 1fr 2rem; align-items: center; gap: .5rem; font-size: .8125rem; color: var(--aby-text); }
.aby-rv__distbar { height: .375rem; border-radius: 999px; background: color-mix(in srgb, var(--aby-text) 15%, transparent); overflow: hidden; }
.aby-rv__distbar span { display: block; height: 100%; border-radius: inherit; background: var(--aby-accent); }
.aby-rv__said { margin: 0 0 .875rem; line-height: 1.8; color: var(--aby-title); }
.aby-rv__qs { display: flex; flex-wrap: wrap; gap: .5rem; }
.aby-rv__q { min-height: 2.5rem; padding: .375rem 1rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: 999px; background: var(--aby-bg);
  color: var(--aby-title); font: inherit; font-size: .875rem; font-weight: 600; cursor: pointer; }
.aby-rv__q[aria-expanded="true"] { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-rv__answer { margin: .875rem 0 0; padding: .875rem 1rem; border-radius: .875rem; background: var(--aby-bg); line-height: 1.8; color: var(--aby-title); }
.aby-rv__fitbar { display: grid; gap: .5rem; }
.aby-rv__fitlabel { font-weight: 800; color: var(--aby-title); }
.aby-rv__fitscale { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); height: .5rem; border-radius: 999px; overflow: hidden;
  background: color-mix(in srgb, var(--aby-text) 15%, transparent); }
.aby-rv__fitscale span { border-inline-end: 2px solid var(--aby-card); }
.aby-rv__fitdot { position: absolute; top: 50%; width: 1rem; height: 1rem; border-radius: 999px; background: var(--aby-accent); border: 2px solid var(--aby-card);
  transform: translate(50%, -50%); }
[dir="ltr"] .aby-rv__fitdot { transform: translate(-50%, -50%); }
.aby-rv__fitends { display: flex; justify-content: space-between; font-size: .8125rem; }
.aby-rv__filters { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.25rem; }
.aby-rv__filter { min-height: 2.75rem; padding: 0 1rem; border: 1.5px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: 999px;
  background: var(--aby-bg); color: var(--aby-title); font: inherit; font-weight: 700; font-size: .875rem; cursor: pointer; }
.aby-rv__filter[aria-pressed="true"] { border-color: var(--aby-accent-ink); background: var(--aby-accent); color: var(--aby-accent-text); }
.aby-rv__filter:focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-rv__body { display: flex; flex-wrap: wrap; gap: .375rem .5rem; }
.aby-rv__chip { padding: .125rem .625rem; border-radius: 999px; background: var(--aby-bg); font-size: .8125rem; color: var(--aby-text); }
.aby-rv__chip b { color: var(--aby-title); }
.aby-rv__none { padding: 1.5rem; text-align: center; }
.aby-rv__grid { display: grid; gap: 1rem; align-items: start; }
@container (min-width: 640px) { .aby-rv__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (min-width: 1000px) { .aby-rv__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.aby-rv__card { display: flex; flex-direction: column; gap: .875rem; padding: 1.125rem; border-radius: 1.25rem; background: var(--aby-card); }
.aby-rv__head { display: flex; align-items: center; gap: .75rem; }
.aby-rv__avatar { width: 2.75rem; height: 2.75rem; flex: 0 0 auto; display: grid; place-items: center; border-radius: 999px; overflow: hidden; background: var(--aby-accent);
  color: var(--aby-accent-text); font-weight: 800; }
.aby-rv__avatar img { width: 100%; height: 100%; object-fit: cover; }
.aby-rv__who { display: flex; flex-direction: column; min-width: 0; flex: 1 1 auto; }
.aby-rv__name { font-weight: 800; color: var(--aby-title); }
.aby-rv__meta { font-size: .8125rem; color: var(--aby-text); }
.aby-rv__verified { color: var(--aby-accent-ink); font-weight: 700; }
.aby-rv__stars { color: #f5a524; letter-spacing: .05em; white-space: nowrap; }
.aby-rv__stars .off { color: color-mix(in srgb, var(--aby-text) 30%, transparent); }
.aby-rv__place { align-self: flex-start; padding: .25rem .75rem; border-radius: 999px; background: var(--aby-bg); font-size: .8125rem; font-weight: 700; color: var(--aby-title); }
.aby-rv__voice { display: flex; align-items: center; gap: .625rem; padding: .5rem .625rem; border-radius: 999px; background: var(--aby-bg); }
.aby-rv__play { width: 2.75rem; height: 2.75rem; flex: 0 0 auto; display: grid; place-items: center; border: 0; border-radius: 999px; background: var(--aby-accent);
  color: var(--aby-accent-text); cursor: pointer; }
.aby-rv__play svg { width: 1.125rem; height: 1.125rem; }
.aby-rv__wave { display: flex; align-items: center; gap: 2px; height: 2rem; flex: 1 1 auto; min-width: 0; padding: 0; border: 0; background: none; cursor: pointer; direction: ltr; }
.aby-rv__wave span { flex: 1 1 0; min-width: 2px; border-radius: 2px; background: color-mix(in srgb, var(--aby-text) 35%, transparent); }
.aby-rv__wave span.is-done { background: var(--aby-accent); }
.aby-rv__time { font-size: .75rem; font-variant-numeric: tabular-nums; color: var(--aby-text); min-width: 2.25rem; text-align: center; }
.aby-rv__rate { min-width: 2.75rem; height: 2rem; padding: 0 .375rem; border: 1px solid color-mix(in srgb, var(--aby-text) 25%, transparent); border-radius: 999px;
  background: none; color: var(--aby-title); font: inherit; font-size: .75rem; font-weight: 800; cursor: pointer; }
.aby-rv__voice-error { font-size: .8125rem; color: #d92d20; }
.aby-rv__text { margin: 0; line-height: 1.8; color: var(--aby-title); white-space: pre-line; }
.aby-rv__text.is-clamped { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
.aby-rv__more { align-self: flex-start; padding: 0; border: 0; background: none; color: var(--aby-accent-ink); font: inherit; font-size: .875rem; font-weight: 700; cursor: pointer; }
.aby-rv__photos { display: flex; gap: .5rem; }
.aby-rv__photos button { width: 4.5rem; height: 4.5rem; padding: 0; border: 0; border-radius: .75rem; overflow: hidden; cursor: zoom-in; }
.aby-rv__photos img { width: 100%; height: 100%; object-fit: cover; }
.aby-rv :is(button, a):focus-visible { outline: 2px solid var(--aby-accent-ink); outline-offset: 2px; }
.aby-rv__dialog { max-width: min(92vw, 56rem); max-height: 90vh; padding: 0; border: 0; border-radius: 1rem; background: transparent; }
.aby-rv__dialog::backdrop { background: rgb(0 0 0 / 80%); }
.aby-rv__dialog img { display: block; max-width: 100%; max-height: 90vh; border-radius: 1rem; }
.aby-rv__close { position: absolute; top: .5rem; inset-inline-end: .5rem; width: 2.75rem; height: 2.75rem; border: 0; border-radius: 999px; background: rgb(0 0 0 / 55%); color: #fff; font-size: 1.5rem; cursor: pointer; }
`, N = s`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>`, T = s`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`;
function F(l) {
  return l.trim().split(/\s+/).slice(0, 2).map((e) => e[0]).join("").toUpperCase() || "؟";
}
function j(l) {
  const e = String(l || "").trim();
  return /^(https?:)?\/\//i.test(e) || e.startsWith("/") ? e : "";
}
class b extends q {
  constructor() {
    super(...arguments), this.styleId = "reviews", this.players = {}, this.peaks = {}, this.expanded = /* @__PURE__ */ new Set(), this.question = -1, this.photo = "", this.tried = /* @__PURE__ */ new Set(), this.bucket = "", this.voice = /* @__PURE__ */ new Map(), this.answerId = `aby-rv-answer-${++E}`;
  }
  styles() {
    return I;
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this.voice.forEach((t) => t.destroy()), this.voice.clear(), (e = this.observer) == null || e.disconnect(), this.observer = void 0, this.querySelectorAll("[data-watched]").forEach((t) => delete t.dataset.watched);
  }
  connectedCallback() {
    super.connectedCallback(), this.requestUpdate();
  }
  reviews() {
    return k(this.cfg().items, "items").map((e) => {
      var t, r;
      return {
        name: h(e.name),
        city: h(e.city),
        place: h(e.place),
        rate: Math.min(Math.max(Math.round(Number(e.rate) || 0), 0), 5),
        text: h(e.text),
        audio: j(e.audio_url),
        images: [e.image_1, e.image_2, e.image_3].map((a) => String(a || "")).filter(Boolean),
        avatar: String(e.avatar || ""),
        verified: e.verified !== !1,
        height: Number(e.height) || 0,
        size: h(e.size),
        fit: String(Array.isArray(e.fit) ? ((t = e.fit[0]) == null ? void 0 : t.value) ?? "" : ((r = e.fit) == null ? void 0 : r.value) ?? e.fit ?? "")
      };
    }).filter((e) => e.text || e.audio || e.images.length);
  }
  updated() {
    this.querySelectorAll("audio[data-i]").forEach((e) => {
      const t = Number(e.dataset.i);
      if (this.voice.has(t)) return;
      const r = new P(e);
      r.onState((a) => this.players = { ...this.players, [t]: a }), this.voice.set(t, r);
    }), !this.observer && typeof IntersectionObserver < "u" && (this.observer = new IntersectionObserver((e) => {
      for (const t of e) {
        if (!t.isIntersecting) continue;
        const r = t.target;
        this.observer.unobserve(r);
        const a = Number(r.dataset.i);
        R(r.dataset.src || "", x).then((i) => this.peaks = { ...this.peaks, [a]: i });
      }
    }, { rootMargin: "200px" })), this.querySelectorAll(".aby-rv__voice[data-src]:not([data-watched])").forEach((e) => {
      e.dataset.watched = "1", this.observer ? this.observer.observe(e) : this.peaks = { ...this.peaks, [Number(e.dataset.i)]: w(e.dataset.src || "", x) };
    });
  }
  seek(e, t) {
    var a;
    if (e.detail === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    (a = this.voice.get(t)) == null || a.seek((e.clientX - r.left) / r.width);
  }
  seekKey(e, t) {
    var i;
    const r = e.key === "ArrowRight" ? 0.1 : e.key === "ArrowLeft" ? -0.1 : 0;
    if (!r) return;
    e.preventDefault();
    const a = this.players[t];
    a != null && a.duration && ((i = this.voice.get(t)) == null || i.seek(a.time / a.duration + r));
  }
  play(e) {
    var t;
    this.tried = new Set(this.tried).add(e), (t = this.voice.get(e)) == null || t.toggle();
  }
  renderVoice(e, t) {
    const r = this.players[t] || { playing: !1, time: 0, duration: 0, rate: 1, error: !1 }, a = this.peaks[t] || w(e.audio, x), i = r.duration ? r.time / r.duration : 0, c = $[($.indexOf(r.rate) + 1) % $.length];
    return s`<div class="aby-rv__voice" data-i=${t} data-src=${e.audio}>
        <audio data-i=${t} src=${e.audio} preload="metadata"></audio>
        <button type="button" class="aby-rv__play" aria-label=${r.playing ? d({ ar: "إيقاف", en: "Pause" }) : d({ ar: `تشغيل رأي ${e.name}`, en: `Play ${e.name}'s review` })}
          @click=${() => this.play(t)}>${r.playing ? T : N}</button>
        <button type="button" class="aby-rv__wave" aria-label=${d({ ar: "انتقل في التسجيل بالأسهم", en: "Seek in the recording with the arrow keys" })}
          @click=${(n) => this.seek(n, t)} @keydown=${(n) => this.seekKey(n, t)}>
          ${a.map((n, _) => s`<span class=${_ / a.length < i ? "is-done" : ""} style=${`height:${Math.round(n * 100)}%`}></span>`)}
        </button>
        <span class="aby-rv__time">${A(r.playing || r.time ? r.time : r.duration)}</span>
        <button type="button" class="aby-rv__rate" aria-label=${d({ ar: "سرعة التشغيل", en: "Playback speed" })} @click=${() => {
      var n;
      return (n = this.voice.get(t)) == null ? void 0 : n.setRate(c);
    }}>${r.rate}x</button>
      </div>
      ${r.error && this.tried.has(t) ? s`<span class="aby-rv__voice-error" role="alert">${d({ ar: "تعذّر تشغيل التسجيل", en: "The recording could not be played" })}</span>` : o}`;
  }
  renderCard(e, t) {
    const r = e.text.length > 220, a = this.expanded.has(t);
    return s`<li class="aby-rv__card">
      <div class="aby-rv__head">
        <span class="aby-rv__avatar" aria-hidden="true">${e.avatar ? s`<img src=${e.avatar} alt="" loading="lazy" />` : F(e.name)}</span>
        <span class="aby-rv__who">
          <span class="aby-rv__name">${e.name}</span>
          <span class="aby-rv__meta">${e.city}${e.city && e.verified ? " · " : ""}${e.verified ? s`<span class="aby-rv__verified">${d({ ar: "عميل مؤكد", en: "Verified buyer" })}</span>` : o}</span>
        </span>
        ${e.rate ? s`<span class="aby-rv__stars" role="img" aria-label=${`${e.rate}/5`}>${[1, 2, 3, 4, 5].map((i) => s`<span class=${i <= e.rate ? "" : "off"}>★</span>`)}</span>` : o}
      </div>
      ${e.place ? s`<span class="aby-rv__place">${e.place}</span>` : o}
      ${e.height || e.size || m[e.fit] ? s`<div class="aby-rv__body">
            ${e.height ? s`<span class="aby-rv__chip">${d({ ar: "طولها", en: "Height" })} <b>${e.height} ${d({ ar: "سم", en: "cm" })}</b></span>` : o}
            ${e.size ? s`<span class="aby-rv__chip">${d({ ar: "أخدت", en: "Bought" })} <b>${e.size}</b></span>` : o}
            ${m[e.fit] ? s`<span class="aby-rv__chip">${d({ ar: "المقاس", en: "Fit" })} <b>${d(m[e.fit])}</b></span>` : o}
          </div>` : o}
      ${e.audio ? this.renderVoice(e, t) : o}
      ${e.text ? s`<p class=${`aby-rv__text${r && !a ? " is-clamped" : ""}`}>${e.text}</p>` : o}
      ${r ? s`<button type="button" class="aby-rv__more" aria-expanded=${a ? "true" : "false"} @click=${() => {
      const i = new Set(this.expanded);
      a ? i.delete(t) : i.add(t), this.expanded = i;
    }}>${a ? d({ ar: "عرض أقل", en: "Show less" }) : d({ ar: "اقرأ المزيد", en: "Read more" })}</button>` : o}
      ${e.images.length ? s`<div class="aby-rv__photos">${e.images.map((i) => s`<button type="button" aria-label=${d({ ar: "تكبير الصورة", en: "Enlarge photo" })}
            @click=${() => this.openPhoto(i)}><img src=${i} alt="" loading="lazy" /></button>`)}</div>` : o}
    </li>`;
  }
  async openPhoto(e) {
    var t, r;
    this.photo = e, await this.updateComplete, (r = (t = this.querySelector(".aby-rv__dialog")) == null ? void 0 : t.showModal) == null || r.call(t);
  }
  closePhoto() {
    var e, t;
    (t = (e = this.querySelector(".aby-rv__dialog")) == null ? void 0 : e.close) == null || t.call(e), this.photo = "";
  }
  renderSummary(e) {
    const t = this.cfg();
    if (t.show_summary === !1) return o;
    const r = z(e.map((p) => p.rate).filter(Boolean)), a = h(t.summary_text), i = k(t.questions, "questions").map((p) => ({ q: h(p.q), a: h(p.a) })).filter((p) => p.q && p.a);
    if (!r.count && !a && !i.length) return o;
    const c = Math.max(1, ...r.dist), n = S(e.map((p) => p.fit)), _ = n.count ? (n.small * 0 + n.true * 0.5 + n.large * 1) / n.count : 0.5;
    return s`<div class="aby-rv__summary">
      ${n.count ? s`<div class="aby-rv__fitbar" role="img" aria-label=${d({ ar: `${n.truePercent}% قالوا المقاس مظبوط`, en: `${n.truePercent}% said it fits` })}>
            <span class="aby-rv__fitlabel">${d({ ar: `${n.truePercent}% قالوا المقاس مظبوط`, en: `${n.truePercent}% said it fits` })}</span>
            <div class="aby-rv__fitscale"><span></span><span></span><span></span>
              <i class="aby-rv__fitdot" style=${`inset-inline-start:${Math.round(_ * 100)}%`}></i></div>
            <div class="aby-rv__fitends"><span>${d(m.small)}</span><span>${d(m.true)}</span><span>${d(m.large)}</span></div>
          </div>` : o}
      ${r.count ? s`<div class="aby-rv__score">
            <span class="aby-rv__avg">${r.average.toFixed(1)}</span>
            <span class="aby-rv__stars" role="img" aria-label=${`${r.average}/5`}>${[1, 2, 3, 4, 5].map((p) => s`<span class=${p <= Math.round(r.average) ? "" : "off"}>★</span>`)}</span>
            <span class="aby-rv__count">${d({ ar: `${r.count} تقييم`, en: `${r.count} reviews` })}</span>
            <div class="aby-rv__dist">${r.dist.map((p, g) => s`<div class="aby-rv__distrow"><span>${5 - g}</span>
              <span class="aby-rv__distbar"><span style=${`width:${p / c * 100}%`}></span></span><span>${p}</span></div>`)}</div>
          </div>` : o}
      <div>
        ${a ? s`<p class="aby-rv__said">${a}</p>` : o}
        ${i.length ? s`<div class="aby-rv__qs">${i.map((p, g) => s`<button type="button" class="aby-rv__q" aria-expanded=${this.question === g ? "true" : "false"}
              aria-controls=${this.answerId} @click=${() => this.question = this.question === g ? -1 : g}>${p.q}</button>`)}</div>
            ${this.question >= 0 && i[this.question] ? s`<p class="aby-rv__answer" id=${this.answerId} aria-live="polite">${i[this.question].a}</p>` : o}` : o}
      </div>
    </div>`;
  }
  renderFilters(e) {
    const t = { short: 0, mid: 0, tall: 0 };
    for (const a of e) {
      const i = M(a.height);
      i && t[i]++;
    }
    if (Object.values(t).filter(Boolean).length < 2) return o;
    const r = [
      ["", { ar: "الكل", en: "All" }],
      ["short", { ar: "أقل من 155 سم", en: "Under 155 cm" }],
      ["mid", { ar: "155 – 165 سم", en: "155 – 165 cm" }],
      ["tall", { ar: "أطول من 165 سم", en: "Over 165 cm" }]
    ];
    return s`<div class="aby-rv__filters" role="group" aria-label=${d({ ar: "آراء حسب الطول", en: "Reviews by height" })}>
      ${r.filter(([a]) => !a || t[a]).map(([a, i]) => s`<button type="button" class="aby-rv__filter" aria-pressed=${this.bucket === a ? "true" : "false"}
        @click=${() => this.bucket = a}>${d(i)}</button>`)}
    </div>`;
  }
  render() {
    const e = this.reviews(), t = this.renderSummary(e);
    if (!e.length && t === o) return o;
    const r = e.map((a, i) => [a, i]).filter(([a]) => !this.bucket || M(a.height) === this.bucket);
    return this.frame(s`${t}
      ${e.length ? this.renderFilters(e) : o}
      ${e.length ? r.length ? s`<ul class="aby-rv__grid">${r.map(([a, i]) => this.renderCard(a, i))}</ul>` : s`<p class="aby-rv__none">${d({ ar: "مفيش آراء للطول ده لسه", en: "No reviews for this height yet" })}</p>` : o}
      ${this.photo ? s`<dialog class="aby-rv__dialog" @close=${() => this.photo = ""} @click=${(a) => {
      a.target === a.currentTarget && this.closePhoto();
    }}>
            <img src=${this.photo} alt="" /><button type="button" class="aby-rv__close" aria-label=${d({ ar: "إغلاق", en: "Close" })} @click=${() => this.closePhoto()}>×</button>
          </dialog>` : o}`, { extraClass: "aby-rv" });
  }
}
y([
  v()
], b.prototype, "players");
y([
  v()
], b.prototype, "peaks");
y([
  v()
], b.prototype, "expanded");
y([
  v()
], b.prototype, "question");
y([
  v()
], b.prototype, "photo");
y([
  v()
], b.prototype, "tried");
y([
  v()
], b.prototype, "bucket");
typeof b < "u" && b.registerSallaComponent("salla-reviews");
export {
  b as default
};
