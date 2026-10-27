import { describe, expect, it } from "vitest";
import { eta, formatCountdown, formatDay } from "../src/utils/eta";

// Saudi time is UTC+3; Friday is day 5
const base = { cutoffHour: 13, prepDays: 1, shipDays: 2, offDays: [5], tzOffset: 3 };
const at = (iso: string) => new Date(iso);

describe("eta", () => {
  it("counts down to today's cut-off before it passes", () => {
    // Tuesday 28 Oct 2026, 10:00 in Riyadh
    const r = eta(at("2026-10-28T07:00:00Z"), base);
    expect(r.msLeft).toBe(3 * 3600000);
    expect(r.cutoff.toISOString()).toBe("2026-10-28T10:00:00.000Z");
    // 3 working days from Wednesday, skipping Friday: Thu, Sat, Sun
    expect(r.arrival.toISOString().slice(0, 10)).toBe("2026-11-01");
  });
  it("moves to the next working day after the cut-off", () => {
    // Thursday 29 Oct, 14:00 in Riyadh: Friday is off, so Saturday starts
    const r = eta(at("2026-10-29T11:00:00Z"), base);
    expect(r.cutoff.toISOString()).toBe("2026-10-31T10:00:00.000Z");
    expect(r.arrival.toISOString().slice(0, 10)).toBe("2026-11-03");
  });
  it("treats a week with every day off as all working", () => {
    const r = eta(at("2026-10-28T07:00:00Z"), { ...base, offDays: [0, 1, 2, 3, 4, 5, 6], prepDays: 0, shipDays: 0 });
    expect(r.arrival.toISOString().slice(0, 10)).toBe("2026-10-28");
  });
});

describe("formatting", () => {
  it("formats the countdown", () => {
    expect(formatCountdown(2 * 3600000 + 14 * 60000 + 5000)).toBe("2:14:05");
    expect(formatCountdown(-5)).toBe("0:00:00");
  });
  it("names the arrival day", () => {
    expect(formatDay(new Date("2026-10-29T00:00:00Z"), "en")).toBe("Thursday 29 October");
  });
});
