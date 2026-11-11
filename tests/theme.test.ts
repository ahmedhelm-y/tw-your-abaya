import { afterEach, describe, expect, it } from "vitest";
import { applyPageTheme, clearPageTheme } from "../src/utils/theme";

describe("page theme from the hero", () => {
  afterEach(() => clearPageTheme());

  it("sets the brand palette and the page mode on the document", () => {
    expect(applyPageTheme({ brand_color: "#c8102e", default_mode: [{ value: "dark" }] })).toBe("dark");
    const root = document.documentElement;
    expect(root.classList.contains("aby-mode-dark")).toBe(true);
    expect(root.style.getPropertyValue("--aby-l-accent")).not.toBe("");
  });

  it("clears everything it set", () => {
    applyPageTheme({ brand_color: "#c8102e", default_mode: "light" });
    clearPageTheme();
    const root = document.documentElement;
    expect(root.style.getPropertyValue("--aby-l-accent")).toBe("");
    expect(root.classList.contains("aby-mode-light")).toBe(false);
  });

  it("leaves the store colors alone without a brand color", () => {
    applyPageTheme({ default_mode: "light" });
    expect(document.documentElement.style.getPropertyValue("--aby-l-accent")).toBe("");
  });
});
