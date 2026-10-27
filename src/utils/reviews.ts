const MIN_BAR = 0.2;

/** Average to one decimal, and how many reviews gave 5, 4, 3, 2 and 1 stars. */
export function ratingSummary(rates: number[]): { average: number; count: number; dist: number[] } {
  const valid = rates.map(Number).filter((r) => Number.isInteger(r) && r >= 1 && r <= 5);
  const dist = [5, 4, 3, 2, 1].map((star) => valid.filter((r) => r === star).length);
  const average = valid.length ? Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10 : 0;
  return { average, count: valid.length, dist };
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** A stable waveform drawn from the link itself, for audio that cannot be read back. */
export function seededBars(seed: string, n: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const bars: number[] = [];
  for (let i = 0; i < n; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    const r = ((h >>> 0) % 1000) / 1000;
    // A gentle swell so it reads like speech rather than noise
    const swell = 0.55 + 0.45 * Math.sin((i / n) * Math.PI);
    bars.push(Math.round((MIN_BAR + (1 - MIN_BAR) * r * swell) * 100) / 100);
  }
  return bars;
}

/** Peak level per bar from decoded samples, scaled so the loudest bar is 1. */
export function peaksFrom(data: Float32Array, n: number): number[] {
  const size = Math.max(1, Math.floor(data.length / n));
  const peaks: number[] = [];
  for (let i = 0; i < n; i++) {
    let peak = 0;
    for (let j = i * size; j < Math.min((i + 1) * size, data.length); j++) peak = Math.max(peak, Math.abs(data[j]));
    peaks.push(peak);
  }
  const max = Math.max(...peaks);
  if (!max) return peaks.map(() => MIN_BAR);
  return peaks.map((p) => Math.max(MIN_BAR, Math.round((p / max) * 100) / 100));
}
