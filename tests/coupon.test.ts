import { describe, expect, it } from "vitest";
import { isExpired, parseDate, revealedKey } from "../src/utils/coupon";

const now = new Date("2026-06-01T12:00:00");

describe("isExpired", () => {
  it("is true after the editor's date and time", () => {
    expect(isExpired("2026-01-01 00:00", now)).toBe(true);
  });

  it("is false before an ISO date", () => {
    expect(isExpired("2027-01-01T00:00", now)).toBe(false);
  });

  it("is false without a date", () => {
    expect(isExpired("", now)).toBe(false);
    expect(isExpired(null, now)).toBe(false);
  });

  it("is false for a date it cannot read", () => {
    expect(isExpired("bad", now)).toBe(false);
  });
});

describe("parseDate", () => {
  it("reads the editor's space-separated format", () => {
    expect(parseDate("2026-12-01 18:30")?.getHours()).toBe(18);
  });
});

describe("revealedKey", () => {
  it("is per code", () => {
    expect(revealedKey("ABY15")).toBe("aby-coupon:ABY15");
  });
});
