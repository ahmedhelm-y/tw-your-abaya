import { describe, expect, it } from "vitest";
import {
  classify, findOption, fitSummary, heightBucket, lowStock, matchValue, measurementMessage, recommendLength, remaining, swatchFor, whatsappLink,
} from "../src/utils/fit";

const size = { id: 1, name: "المقاس", type: "single-option", required: true, details: [{ id: 11, name: "38 - S" }, { id: 12, name: "40 - M" }] };
const length = { id: 2, name: "الطول", type: "single-option", required: true, details: [{ id: 21, name: "54" }, { id: 22, name: "56" }, { id: 23, name: "58" }] };
const color = { id: 3, name: "اللون", type: "color", required: true, details: [{ id: 31, name: "أسود" }] };
const rows = [
  { length: "54", min: 153, max: 158 },
  { length: "56", min: 159, max: 164 },
  { length: "58", min: 165, max: 172 },
];

describe("findOption", () => {
  it("finds each option by its name", () => {
    const product = { options: [length, size, color] };
    expect(findOption(product, "size")?.id).toBe(1);
    expect(findOption(product, "length")?.id).toBe(2);
    expect(findOption(product, "color")?.id).toBe(3);
  });
  it("falls back to the first required choice for size, and never for length", () => {
    const product = { options: [{ ...size, name: "Variant" }] };
    expect(findOption(product, "size")?.id).toBe(1);
    expect(findOption(product, "length")).toBeNull();
  });
  it("skips options without values", () => {
    expect(findOption({ options: [{ ...size, details: [] }] }, "size")).toBeNull();
  });
});

describe("matchValue", () => {
  it("matches whole numbers only", () => {
    expect(matchValue(length, "56")?.id).toBe(22);
    expect(matchValue(length, "5")).toBeNull();
    expect(matchValue(length, "٥٨")?.id).toBe(23);
  });
  it("matches text inside the name", () => {
    expect(matchValue(size, "m")?.id).toBe(12);
  });
});

describe("recommendLength", () => {
  it("picks the row that holds the height", () => {
    expect(recommendLength(160, rows)).toBe(1);
  });
  it("moves one length up with heels, but not past the last", () => {
    expect(recommendLength(160, rows, true)).toBe(2);
    expect(recommendLength(170, rows, true)).toBe(2);
  });
  it("clamps heights outside the table and rejects impossible ones", () => {
    expect(recommendLength(140, rows)).toBe(0);
    expect(recommendLength(185, rows)).toBe(2);
    expect(recommendLength(20, rows)).toBe(-1);
    expect(recommendLength(160, [])).toBe(-1);
  });
});

describe("remaining and lowStock", () => {
  it("prefers the value's own quantity", () => {
    expect(remaining({ quantity: 40, can_show_remained_quantity: true }, { quantity: 3 })).toBe(3);
  });
  it("uses the product quantity only when the merchant shows it", () => {
    expect(remaining({ quantity: 4, can_show_remained_quantity: true }, { quantity: null })).toBe(4);
    expect(remaining({ quantity: 4, can_show_remained_quantity: false })).toBeNull();
    expect(remaining({ quantity: 4, can_show_remained_quantity: true, is_hidden_quantity: true })).toBeNull();
    expect(remaining({ quantity: -1, can_show_remained_quantity: true })).toBeNull();
  });
  it("shows only low, non-zero stock", () => {
    expect(lowStock(3, 5)).toBe(3);
    expect(lowStock(0, 5)).toBeNull();
    expect(lowStock(9, 5)).toBeNull();
    expect(lowStock(null, 5)).toBeNull();
  });
});

describe("fitSummary and heightBucket", () => {
  it("counts the fits and ignores anything else", () => {
    expect(fitSummary(["true", "true", "small", "x", ""])).toEqual({ small: 1, true: 2, large: 0, count: 3, truePercent: 67 });
    expect(fitSummary([]).truePercent).toBe(0);
  });
  it("groups heights", () => {
    expect(heightBucket(150)).toBe("short");
    expect(heightBucket(165)).toBe("mid");
    expect(heightBucket(170)).toBe("tall");
    expect(heightBucket("")).toBeNull();
  });
});

describe("swatchFor", () => {
  it("uses a given hex, then the color name, then a neutral", () => {
    expect(swatchFor("أي", "#123456")).toBe("#123456");
    expect(swatchFor("أسود")).toBe("#111111");
    expect(swatchFor("Navy Blue")).toBe("#1f2a44");
    expect(swatchFor("لون غريب")).toBe("#bdb6ad");
  });
});

describe("measurements", () => {
  it("writes filled measurements and notes as lines", () => {
    const text = measurementMessage([{ label: "الصدر", value: "92", unit: "سم" }, { label: "الكم", value: " " }], "زراير مخفية", "عباية ليل");
    expect(text).toBe("عباية ليل\nالصدر: 92 سم\nزراير مخفية");
  });
  it("builds WhatsApp links from Saudi and international numbers", () => {
    expect(whatsappLink("0551234567", "hi")).toBe("https://wa.me/966551234567?text=hi");
    expect(whatsappLink("+966 55 123 4567", "a b")).toBe("https://wa.me/966551234567?text=a%20b");
    expect(whatsappLink("12", "x")).toBe("");
  });
});

describe("classify", () => {
  it("reads options by their values, whatever their names say", () => {
    const swapped = {
      options: [
        { id: 7, name: "المقاس", type: "single-option", required: true, details: [{ id: 1, name: "اسود" }, { id: 2, name: "بيج" }] },
        { id: 8, name: "اللون", type: "single-option", required: true, details: [{ id: 3, name: "44 - XL" }, { id: 4, name: "36 - XS" }] },
      ],
    };
    expect(findOption(swapped, "color")?.id).toBe(7);
    expect(findOption(swapped, "size")?.id).toBe(8);
    expect(findOption(swapped, "length")).toBeNull();
  });
  it("tells abaya lengths from EU sizes", () => {
    expect(classify({ details: [{ name: "52" }, { name: "54" }, { name: "56" }] })).toBe("length");
    expect(classify({ details: [{ name: "38" }, { name: "40" }] })).toBe("size");
    expect(classify({ details: [{ name: "قطن" }] })).toBeNull();
  });
});
