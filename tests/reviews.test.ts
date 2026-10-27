import { describe, expect, it } from "vitest";
import { formatTime, peaksFrom, ratingSummary, seededBars } from "../src/utils/reviews";

describe("ratingSummary", () => {
  it("averages to one decimal and counts each star", () => {
    expect(ratingSummary([5, 4, 5])).toEqual({ average: 4.7, count: 3, dist: [2, 1, 0, 0, 0] });
  });

  it("is empty without ratings", () => {
    expect(ratingSummary([])).toEqual({ average: 0, count: 0, dist: [0, 0, 0, 0, 0] });
  });

  it("ignores ratings outside 1 to 5", () => {
    expect(ratingSummary([5, 0, 9, NaN]).count).toBe(1);
  });
});

describe("formatTime", () => {
  it("shows minutes and seconds", () => {
    expect(formatTime(75)).toBe("1:15");
  });

  it("shows zero for unknown durations", () => {
    expect(formatTime(NaN)).toBe("0:00");
    expect(formatTime(Infinity)).toBe("0:00");
  });
});

describe("seededBars", () => {
  it("is the same for the same link", () => {
    expect(seededBars("https://x/a.mp3", 40)).toEqual(seededBars("https://x/a.mp3", 40));
  });

  it("has the requested number of bars between 0.2 and 1", () => {
    const bars = seededBars("abc", 40);
    expect(bars).toHaveLength(40);
    expect(bars.every((b) => b >= 0.2 && b <= 1)).toBe(true);
  });

  it("differs between links", () => {
    expect(seededBars("a", 10)).not.toEqual(seededBars("b", 10));
  });
});

describe("peaksFrom", () => {
  it("normalizes the loudest bar to 1", () => {
    const data = new Float32Array(100);
    for (let i = 0; i < 100; i++) data[i] = i < 50 ? 0.1 : 0.5;
    const peaks = peaksFrom(data, 4);
    expect(peaks).toHaveLength(4);
    expect(Math.max(...peaks)).toBe(1);
    expect(peaks[0]).toBeCloseTo(0.2, 1);
  });

  it("returns low flat bars for silence", () => {
    expect(peaksFrom(new Float32Array(20), 4).every((p) => p === 0.2)).toBe(true);
  });
});
