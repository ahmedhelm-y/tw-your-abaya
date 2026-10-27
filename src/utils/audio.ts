import { peaksFrom, seededBars } from "./reviews";

export type AudioLike = Pick<HTMLAudioElement, "play" | "pause" | "paused" | "currentTime" | "duration" | "playbackRate" | "addEventListener" | "removeEventListener">;
export type PlayerState = { playing: boolean; time: number; duration: number; rate: number; error: boolean };

/** The voice note playing right now; starting another one pauses it. */
let current: VoicePlayer | null = null;

export class VoicePlayer {
  state: PlayerState = { playing: false, time: 0, duration: 0, rate: 1, error: false };
  private listeners: ((state: PlayerState) => void)[] = [];
  private events: [string, () => void][];

  constructor(private audio: AudioLike) {
    const sync = () => this.set({ playing: !audio.paused, time: audio.currentTime || 0, duration: Number.isFinite(audio.duration) ? audio.duration : 0 });
    this.events = [
      ["play", sync],
      ["pause", sync],
      ["timeupdate", sync],
      ["loadedmetadata", sync],
      ["ended", () => this.set({ playing: false, time: 0 })],
      ["error", () => this.set({ playing: false, error: true })],
    ];
    for (const [type, fn] of this.events) audio.addEventListener(type, fn);
  }

  onState(fn: (state: PlayerState) => void): void {
    this.listeners.push(fn);
  }

  private set(change: Partial<PlayerState>) {
    this.state = { ...this.state, ...change };
    this.listeners.forEach((fn) => fn(this.state));
  }

  async play(): Promise<void> {
    if (current && current !== this) current.pause();
    current = this;
    try {
      await this.audio.play();
      this.set({ playing: true, error: false });
    } catch {
      this.set({ playing: false, error: true });
    }
  }

  pause(): void {
    this.audio.pause();
    this.set({ playing: false });
    if (current === this) current = null;
  }

  toggle(): Promise<void> | void {
    return this.state.playing ? this.pause() : this.play();
  }

  seek(ratio: number): void {
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    if (!duration) return;
    this.audio.currentTime = Math.min(Math.max(ratio, 0), 1) * duration;
    this.set({ time: this.audio.currentTime });
  }

  setRate(rate: number): void {
    this.audio.playbackRate = rate;
    this.set({ rate });
  }

  destroy(): void {
    if (current === this) this.pause();
    for (const [type, fn] of this.events) this.audio.removeEventListener(type, fn);
    this.listeners = [];
  }
}

/** The real waveform when the file can be read; a stable drawn one when it cannot (CORS, format). */
export async function loadPeaks(url: string, n: number): Promise<number[]> {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) throw new Error("no audio context");
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.arrayBuffer();
    const ctx = new Ctx();
    try {
      const buffer = await ctx.decodeAudioData(data);
      return peaksFrom(buffer.getChannelData(0), n);
    } finally {
      ctx.close?.();
    }
  } catch {
    return seededBars(url, n);
  }
}
