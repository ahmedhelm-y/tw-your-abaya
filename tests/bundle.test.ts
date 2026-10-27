import { describe, expect, it } from "vitest";
import { bundleTotal, isAvailable, missingOptions, toItems, validateLines, type BundleLine } from "../src/utils/bundle";

const sizeOption = { id: 640693139, name: "الحجم", required: true, type: "single-option", details: [{ id: 117579512, name: "50 مل" }] };
const perfume = (id: number, price: number, extra: Record<string, any> = {}) => ({ id, price, sale_price: price, options: [sizeOption], ...extra });
const line = (product: any, selected = true, options: Record<string, number> = {}, quantity = 1): BundleLine => ({ product, selected, quantity, options });

describe("missingOptions", () => {
  it("lists required options without a value", () => {
    expect(missingOptions(line(perfume(1, 174)))).toEqual([640693139]);
  });

  it("does not block on a required option that has no values to choose", () => {
    const product = perfume(1, 174, { options: [{ ...sizeOption, details: [] }] });
    expect(missingOptions(line(product))).toEqual([]);
  });

  it("is empty once the option has a value", () => {
    expect(missingOptions(line(perfume(1, 174), true, { 640693139: 117579512 }))).toEqual([]);
  });
});

describe("validateLines", () => {
  it("fails when a picked product misses its size", () => {
    const result = validateLines([line(perfume(1, 174))]);
    expect(result.ok).toBe(false);
    expect(result.missing).toEqual({ "1": [640693139] });
  });

  it("ignores products that are not picked", () => {
    expect(validateLines([line(perfume(1, 174), false)]).ok).toBe(true);
  });

  it("fails when nothing is picked", () => {
    expect(validateLines([line(perfume(1, 174), false)], 1).ok).toBe(false);
  });
});

describe("bundleTotal", () => {
  it("adds the picked products and their regular prices", () => {
    const total = bundleTotal([
      line(perfume(1, 174)),
      line(perfume(2, 144, { regular_price: 189 })),
      line(perfume(3, 83), false),
    ]);
    expect(total).toEqual({ total: 318, regular: 363, count: 2 });
  });
});

describe("toItems", () => {
  it("turns only the picked lines into cart items with their options", () => {
    expect(toItems([line(perfume(1, 174), true, { 640693139: 117579512 }), line(perfume(2, 144), false)])).toEqual([
      { id: "1", quantity: 1, options: { 640693139: 117579512 }, max: undefined },
    ]);
  });
});

describe("bundleTotal with sized prices", () => {
  it("adds the chosen value's extra price", () => {
    const product = perfume(1, 100, { options: [{ ...sizeOption, details: [{ id: 5, name: "100 مل", additional_price: 20 }] }] });
    expect(bundleTotal([line(product, true, { 640693139: 5 }, 2)]).total).toBe(240);
  });
});

describe("isAvailable", () => {
  it("rejects sold out and unavailable products", () => {
    expect(isAvailable({ status: "out" })).toBe(false);
    expect(isAvailable({ is_available: false })).toBe(false);
    expect(isAvailable({ is_out_of_stock: true })).toBe(false);
    expect(isAvailable({ status: "sale", is_available: true })).toBe(true);
  });
});
