import { afterEach, describe, expect, it } from "vitest";
import { productIdFrom } from "../src/utils/section";

function setupSalla(settings: Record<string, any>, landing = true) {
  const config: Record<string, any> = { "page.is_landing_page": landing, "theme.settings": settings };
  (window as any).Salla = { config: { get: (key: string) => config[key] } };
}

afterEach(() => {
  delete (window as any).Salla;
});

describe("productIdFrom", () => {
  it("uses the section's product on a promotion page", () => {
    setupSalla({ page_for_product: [{ value: "promotion" }] });
    expect(productIdFrom({ product: [{ value: 55 }] })).toBe("55");
  });

  it("prefers the page's own product on a product page", () => {
    setupSalla({ page_for_product: [{ value: "product" }], product: { value: ["77"] } });
    expect(productIdFrom({ product: [{ value: 55 }] })).toBe("77");
  });

  it("returns null without any product", () => {
    setupSalla({ page_for_product: [{ value: "promotion" }] });
    expect(productIdFrom({})).toBeNull();
  });

  it("reads another field when asked", () => {
    setupSalla({}, false);
    expect(productIdFrom({ hero_product: [{ value: "9" }] }, "hero_product")).toBe("9");
  });
});
