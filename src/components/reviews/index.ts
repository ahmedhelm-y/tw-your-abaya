import { html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { loadPeaks, type PlayerState, VoicePlayer } from "../../utils/audio";
import { getCollectionItems, resolveText, t } from "../../utils/config";
import { fitSummary, heightBucket, type HeightBucket } from "../../utils/fit";
import { formatTime, ratingSummary, seededBars } from "../../utils/reviews";
import { AbySection } from "../../utils/section";

type Item = { name: unknown; city: unknown; place: unknown; rate: unknown; text: unknown; audio_url: unknown; image_1: unknown; image_2: unknown;
  image_3: unknown; avatar: unknown; verified: unknown; height: unknown; size: unknown; fit: unknown };
type Question = { q: unknown; a: unknown };
type Review = { name: string; city: string; place: string; rate: number; text: string; audio: string; images: string[]; avatar: string; verified: boolean;
  height: number; size: string; fit: string };

const BARS = 40;
let instances = 0;
const RATES = [1, 1.5, 2];
const FIT_LABELS: Record<string, { ar: string; en: string }> = {
  small: { ar: "صغير", en: "Runs small" },
  true: { ar: "مظبوط", en: "True to size" },
  large: { ar: "واسع", en: "Runs large" },
};

const css = `
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
`;

const PLAY = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>`;
const PAUSE = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`;

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "؟";
}

function safeUrl(value: unknown): string {
  const url = String(value || "").trim();
  return /^(https?:)?\/\//i.test(url) || url.startsWith("/") ? url : "";
}

export default class Reviews extends AbySection {
  protected readonly styleId = "reviews";
  @state() private players: Record<number, PlayerState> = {};
  @state() private peaks: Record<number, number[]> = {};
  @state() private expanded = new Set<number>();
  @state() private question = -1;
  @state() private photo = "";
  @state() private tried = new Set<number>();
  @state() private bucket: HeightBucket | "" = "";
  private voice = new Map<number, VoicePlayer>();
  private answerId = `aby-rv-answer-${++instances}`;
  private observer?: IntersectionObserver;

  protected styles() {
    return css;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.voice.forEach((p) => p.destroy());
    this.voice.clear();
    this.observer?.disconnect();
    this.observer = undefined;
    // Moved in the editor: everything attaches again on the next connect
    this.querySelectorAll<HTMLElement>("[data-watched]").forEach((el) => delete el.dataset.watched);
  }

  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }

  private reviews(): Review[] {
    return getCollectionItems<Item>(this.cfg().items, "items")
      .map((item) => ({
        name: resolveText(item.name),
        city: resolveText(item.city),
        place: resolveText(item.place),
        rate: Math.min(Math.max(Math.round(Number(item.rate) || 0), 0), 5),
        text: resolveText(item.text),
        audio: safeUrl(item.audio_url),
        images: [item.image_1, item.image_2, item.image_3].map((i) => String(i || "")).filter(Boolean),
        avatar: String(item.avatar || ""),
        verified: item.verified !== false,
        height: Number(item.height) || 0,
        size: resolveText(item.size),
        fit: String(Array.isArray(item.fit) ? (item.fit as any)[0]?.value ?? "" : (item.fit as any)?.value ?? item.fit ?? ""),
      }))
      // A review needs something to say: words, a voice note or photos
      .filter((r) => r.text || r.audio || r.images.length);
  }

  protected updated() {
    // Players attach to their audio elements once, and waveforms load when a card comes into view
    this.querySelectorAll<HTMLAudioElement>("audio[data-i]").forEach((audio) => {
      const i = Number(audio.dataset.i);
      if (this.voice.has(i)) return;
      const player = new VoicePlayer(audio);
      player.onState((s) => (this.players = { ...this.players, [i]: s }));
      this.voice.set(i, player);
    });
    if (!this.observer && typeof IntersectionObserver !== "undefined") {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          this.observer!.unobserve(el);
          const i = Number(el.dataset.i);
          loadPeaks(el.dataset.src || "", BARS).then((bars) => (this.peaks = { ...this.peaks, [i]: bars }));
        }
      }, { rootMargin: "200px" });
    }
    this.querySelectorAll<HTMLElement>(".aby-rv__voice[data-src]:not([data-watched])").forEach((el) => {
      el.dataset.watched = "1";
      if (this.observer) this.observer.observe(el);
      else this.peaks = { ...this.peaks, [Number(el.dataset.i)]: seededBars(el.dataset.src || "", BARS) };
    });
  }

  private seek(e: MouseEvent, i: number) {
    // Enter or Space on the wave reports no pointer position; the arrow keys handle the keyboard
    if (e.detail === 0) return;
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.voice.get(i)?.seek((e.clientX - box.left) / box.width);
  }

  private seekKey(e: KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" ? 0.1 : e.key === "ArrowLeft" ? -0.1 : 0;
    if (!step) return;
    e.preventDefault();
    const s = this.players[i];
    if (s?.duration) this.voice.get(i)?.seek(s.time / s.duration + step);
  }

  private play(i: number) {
    this.tried = new Set(this.tried).add(i);
    this.voice.get(i)?.toggle();
  }

  private renderVoice(r: Review, i: number) {
    const s = this.players[i] || { playing: false, time: 0, duration: 0, rate: 1, error: false };
    const bars = this.peaks[i] || seededBars(r.audio, BARS);
    const done = s.duration ? s.time / s.duration : 0;
    const nextRate = RATES[(RATES.indexOf(s.rate) + 1) % RATES.length];
    return html`<div class="aby-rv__voice" data-i=${i} data-src=${r.audio}>
        <audio data-i=${i} src=${r.audio} preload="metadata"></audio>
        <button type="button" class="aby-rv__play" aria-label=${s.playing ? t({ ar: "إيقاف", en: "Pause" }) : t({ ar: `تشغيل رأي ${r.name}`, en: `Play ${r.name}'s review` })}
          @click=${() => this.play(i)}>${s.playing ? PAUSE : PLAY}</button>
        <button type="button" class="aby-rv__wave" aria-label=${t({ ar: "انتقل في التسجيل بالأسهم", en: "Seek in the recording with the arrow keys" })}
          @click=${(e: MouseEvent) => this.seek(e, i)} @keydown=${(e: KeyboardEvent) => this.seekKey(e, i)}>
          ${bars.map((b, k) => html`<span class=${k / bars.length < done ? "is-done" : ""} style=${`height:${Math.round(b * 100)}%`}></span>`)}
        </button>
        <span class="aby-rv__time">${formatTime(s.playing || s.time ? s.time : s.duration)}</span>
        <button type="button" class="aby-rv__rate" aria-label=${t({ ar: "سرعة التشغيل", en: "Playback speed" })} @click=${() => this.voice.get(i)?.setRate(nextRate)}>${s.rate}x</button>
      </div>
      ${s.error && this.tried.has(i) ? html`<span class="aby-rv__voice-error" role="alert">${t({ ar: "تعذّر تشغيل التسجيل", en: "The recording could not be played" })}</span>` : nothing}`;
  }

  private renderCard(r: Review, i: number) {
    const long = r.text.length > 220;
    const open = this.expanded.has(i);
    return html`<li class="aby-rv__card">
      <div class="aby-rv__head">
        <span class="aby-rv__avatar" aria-hidden="true">${r.avatar ? html`<img src=${r.avatar} alt="" loading="lazy" />` : initials(r.name)}</span>
        <span class="aby-rv__who">
          <span class="aby-rv__name">${r.name}</span>
          <span class="aby-rv__meta">${r.city}${r.city && r.verified ? " · " : ""}${r.verified ? html`<span class="aby-rv__verified">${t({ ar: "عميل مؤكد", en: "Verified buyer" })}</span>` : nothing}</span>
        </span>
        ${r.rate ? html`<span class="aby-rv__stars" role="img" aria-label=${`${r.rate}/5`}>${[1, 2, 3, 4, 5].map((n) => html`<span class=${n <= r.rate ? "" : "off"}>★</span>`)}</span>` : nothing}
      </div>
      ${r.place ? html`<span class="aby-rv__place">${r.place}</span>` : nothing}
      ${r.height || r.size || FIT_LABELS[r.fit]
        ? html`<div class="aby-rv__body">
            ${r.height ? html`<span class="aby-rv__chip">${t({ ar: "طولها", en: "Height" })} <b>${r.height} ${t({ ar: "سم", en: "cm" })}</b></span>` : nothing}
            ${r.size ? html`<span class="aby-rv__chip">${t({ ar: "أخدت", en: "Bought" })} <b>${r.size}</b></span>` : nothing}
            ${FIT_LABELS[r.fit] ? html`<span class="aby-rv__chip">${t({ ar: "المقاس", en: "Fit" })} <b>${t(FIT_LABELS[r.fit])}</b></span>` : nothing}
          </div>`
        : nothing}
      ${r.audio ? this.renderVoice(r, i) : nothing}
      ${r.text ? html`<p class=${`aby-rv__text${long && !open ? " is-clamped" : ""}`}>${r.text}</p>` : nothing}
      ${long ? html`<button type="button" class="aby-rv__more" aria-expanded=${open ? "true" : "false"} @click=${() => {
          const next = new Set(this.expanded);
          open ? next.delete(i) : next.add(i);
          this.expanded = next;
        }}>${open ? t({ ar: "عرض أقل", en: "Show less" }) : t({ ar: "اقرأ المزيد", en: "Read more" })}</button>` : nothing}
      ${r.images.length
        ? html`<div class="aby-rv__photos">${r.images.map((src) => html`<button type="button" aria-label=${t({ ar: "تكبير الصورة", en: "Enlarge photo" })}
            @click=${() => this.openPhoto(src)}><img src=${src} alt="" loading="lazy" /></button>`)}</div>`
        : nothing}
    </li>`;
  }

  private async openPhoto(src: string) {
    this.photo = src;
    await this.updateComplete;
    this.querySelector<HTMLDialogElement>(".aby-rv__dialog")?.showModal?.();
  }

  private closePhoto() {
    this.querySelector<HTMLDialogElement>(".aby-rv__dialog")?.close?.();
    this.photo = "";
  }

  private renderSummary(reviews: Review[]) {
    const cfg = this.cfg();
    if (cfg.show_summary === false) return nothing;
    const sum = ratingSummary(reviews.map((r) => r.rate).filter(Boolean));
    const said = resolveText(cfg.summary_text);
    const questions = getCollectionItems<Question>(cfg.questions, "questions")
      .map((q) => ({ q: resolveText(q.q), a: resolveText(q.a) }))
      .filter((q) => q.q && q.a);
    if (!sum.count && !said && !questions.length) return nothing;
    const max = Math.max(1, ...sum.dist);
    const fit = fitSummary(reviews.map((r) => r.fit));
    // The dot sits where the reviews lean: small on one end, large on the other
    const lean = fit.count ? (fit.small * 0 + fit.true * 0.5 + fit.large * 1) / fit.count : 0.5;
    return html`<div class="aby-rv__summary">
      ${fit.count
        ? html`<div class="aby-rv__fitbar" role="img" aria-label=${t({ ar: `${fit.truePercent}% قالوا المقاس مظبوط`, en: `${fit.truePercent}% said it fits` })}>
            <span class="aby-rv__fitlabel">${t({ ar: `${fit.truePercent}% قالوا المقاس مظبوط`, en: `${fit.truePercent}% said it fits` })}</span>
            <div class="aby-rv__fitscale"><span></span><span></span><span></span>
              <i class="aby-rv__fitdot" style=${`inset-inline-start:${Math.round(lean * 100)}%`}></i></div>
            <div class="aby-rv__fitends"><span>${t(FIT_LABELS.small)}</span><span>${t(FIT_LABELS.true)}</span><span>${t(FIT_LABELS.large)}</span></div>
          </div>`
        : nothing}
      ${sum.count
        ? html`<div class="aby-rv__score">
            <span class="aby-rv__avg">${sum.average.toFixed(1)}</span>
            <span class="aby-rv__stars" role="img" aria-label=${`${sum.average}/5`}>${[1, 2, 3, 4, 5].map((n) => html`<span class=${n <= Math.round(sum.average) ? "" : "off"}>★</span>`)}</span>
            <span class="aby-rv__count">${t({ ar: `${sum.count} تقييم`, en: `${sum.count} reviews` })}</span>
            <div class="aby-rv__dist">${sum.dist.map((n, k) => html`<div class="aby-rv__distrow"><span>${5 - k}</span>
              <span class="aby-rv__distbar"><span style=${`width:${(n / max) * 100}%`}></span></span><span>${n}</span></div>`)}</div>
          </div>`
        : nothing}
      <div>
        ${said ? html`<p class="aby-rv__said">${said}</p>` : nothing}
        ${questions.length
          ? html`<div class="aby-rv__qs">${questions.map((q, k) => html`<button type="button" class="aby-rv__q" aria-expanded=${this.question === k ? "true" : "false"}
              aria-controls=${this.answerId} @click=${() => (this.question = this.question === k ? -1 : k)}>${q.q}</button>`)}</div>
            ${this.question >= 0 && questions[this.question]
              ? html`<p class="aby-rv__answer" id=${this.answerId} aria-live="polite">${questions[this.question].a}</p>`
              : nothing}`
          : nothing}
      </div>
    </div>`;
  }

  private renderFilters(reviews: Review[]) {
    const counts = { short: 0, mid: 0, tall: 0 } as Record<HeightBucket, number>;
    for (const r of reviews) {
      const b = heightBucket(r.height);
      if (b) counts[b]++;
    }
    // Filtering helps only when the reviews spread over more than one height group
    if (Object.values(counts).filter(Boolean).length < 2) return nothing;
    const buttons: [HeightBucket | "", { ar: string; en: string }][] = [
      ["", { ar: "الكل", en: "All" }],
      ["short", { ar: "أقل من 155 سم", en: "Under 155 cm" }],
      ["mid", { ar: "155 – 165 سم", en: "155 – 165 cm" }],
      ["tall", { ar: "أطول من 165 سم", en: "Over 165 cm" }],
    ];
    return html`<div class="aby-rv__filters" role="group" aria-label=${t({ ar: "آراء حسب الطول", en: "Reviews by height" })}>
      ${buttons.filter(([b]) => !b || counts[b]).map(([b, label]) => html`<button type="button" class="aby-rv__filter" aria-pressed=${this.bucket === b ? "true" : "false"}
        @click=${() => (this.bucket = b)}>${t(label)}</button>`)}
    </div>`;
  }

  render() {
    const reviews = this.reviews();
    const summary = this.renderSummary(reviews);
    if (!reviews.length && summary === nothing) return nothing;
    // Indexes stay those of the full list, so each voice player keeps its card
    const shown = reviews.map((r, i) => [r, i] as const).filter(([r]) => !this.bucket || heightBucket(r.height) === this.bucket);
    return this.frame(html`${summary}
      ${reviews.length ? this.renderFilters(reviews) : nothing}
      ${reviews.length
        ? shown.length
          ? html`<ul class="aby-rv__grid">${shown.map(([r, i]) => this.renderCard(r, i))}</ul>`
          : html`<p class="aby-rv__none">${t({ ar: "مفيش آراء للطول ده لسه", en: "No reviews for this height yet" })}</p>`
        : nothing}
      ${this.photo
        ? html`<dialog class="aby-rv__dialog" @close=${() => (this.photo = "")} @click=${(e: Event) => { if (e.target === e.currentTarget) this.closePhoto(); }}>
            <img src=${this.photo} alt="" /><button type="button" class="aby-rv__close" aria-label=${t({ ar: "إغلاق", en: "Close" })} @click=${() => this.closePhoto()}>×</button>
          </dialog>`
        : nothing}`, { extraClass: "aby-rv" });
  }
}
