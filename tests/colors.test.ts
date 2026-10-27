import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULTS,
  contrastRatio,
  derivePalette,
  getColorMode,
  pagePaletteVars,
  resolveColorMode,
  storeAccentVars,
  readableOn,
  schemeClass,
  sectionStyle,
  setColorMode,
} from "../src/utils/colors";

afterEach(() => {
  vi.restoreAllMocks();
  try {
    localStorage.clear();
  } catch {
    // storage may be stubbed by a test
  }
});

describe("contrast", () => {
  it("measures black on white as 21", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("picks dark text on white", () => {
    expect(readableOn("#ffffff")).toBe("#111111");
  });

  it("picks dark text on a very light store color", () => {
    expect(readableOn("#ffff00")).toBe("#111111");
  });

  it("picks white text on black", () => {
    expect(readableOn("#000000")).toBe("#ffffff");
  });
});

describe("derivePalette", () => {
  for (const base of ["#8a5a2b", "#ffff00", "#0a0a0a", "#3b82f6", "#d4af37", "#e8b4c8", "#5b3a29"]) {
    for (const mode of ["light", "dark"] as const) {
      it(`keeps ${base} readable in ${mode} mode`, () => {
        const p = derivePalette(base)[mode];
        expect(contrastRatio(p.title, p.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.text, p.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.text, p.card)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.accentText, p.accent)).toBeGreaterThanOrEqual(4.5);
        // Accent used as text or an outline must read on the page and on cards
        expect(contrastRatio(p.accentInk, p.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.accentInk, p.card)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it("falls back to the defaults without a color", () => {
    expect(derivePalette(null)).toEqual(DEFAULTS);
  });

  it("falls back to the defaults for an invalid color", () => {
    expect(derivePalette("nope")).toEqual(DEFAULTS);
  });
});

describe("sectionStyle", () => {
  it("sets only light variables when only light colors are filled", () => {
    const style = sectionStyle({ l_bg: "#000000" });
    expect(style).toContain("--aby-s-l-bg:#000000");
    expect(style).toContain("--aby-s-l-text:#ffffff");
    expect(style).toContain("--aby-s-l-title:#ffffff");
    expect(style).not.toContain("--aby-s-d-");
  });

  it("sets only dark variables when only dark colors are filled", () => {
    const style = sectionStyle({ d_bg: "#ffffff" });
    expect(style).toContain("--aby-s-d-text:#111111");
    expect(style).not.toContain("--aby-s-l-");
  });

  it("keeps the merchant's own text color", () => {
    expect(sectionStyle({ l_bg: "#000000", l_text: "#ff0000" })).toContain("--aby-s-l-text:#ff0000");
  });

  it("gives an accent its readable button text", () => {
    expect(sectionStyle({ l_accent: "#ffff00" })).toContain("--aby-s-l-accent-text:#111111");
  });

  it("ignores invalid colors", () => {
    expect(sectionStyle({ l_bg: "red; background:url(x)" })).toBe("");
  });
});

describe("pagePaletteVars", () => {
  it("writes nothing without a perfume color or overrides, so store colors apply", () => {
    expect(pagePaletteVars({})).toEqual({});
  });

  it("writes every token of the derived palette for both modes", () => {
    const vars = pagePaletteVars({ brand_color: "#8a5a2b" });
    expect(vars["--aby-l-accent"]).toBe("#8a5a2b");
    expect(Object.keys(vars).filter((k) => k.startsWith("--aby-d-"))).toHaveLength(7);
  });

  it("lets the merchant's page colors win over the derived palette", () => {
    const vars = pagePaletteVars({ brand_color: "#8a5a2b", l_bg: "#000000" });
    expect(vars["--aby-l-bg"]).toBe("#000000");
    expect(vars["--aby-l-text"]).toBe("#ffffff");
  });

  it("works from overrides alone", () => {
    const vars = pagePaletteVars({ d_accent: "#ffff00" });
    expect(vars).toMatchObject({ "--aby-d-accent": "#ffff00", "--aby-d-accent-text": "#111111" });
    expect(Object.keys(vars).sort()).toEqual(["--aby-d-accent", "--aby-d-accent-ink", "--aby-d-accent-text"]);
  });
});

describe("schemeClass", () => {
  it("forces dark", () => {
    expect(schemeClass({ color_scheme: [{ value: "dark" }] })).toBe("aby-dark");
  });

  it("forces light", () => {
    expect(schemeClass({ color_scheme: "light" })).toBe("");
  });

  it("follows the page by default", () => {
    expect(schemeClass({})).toBe("aby-auto");
  });
});

describe("color mode", () => {
  it("remembers the shopper's choice", () => {
    setColorMode("dark");
    expect(getColorMode()).toBe("dark");
    expect(JSON.parse(localStorage.getItem("aby-mode") || "null")).toEqual({ mode: "dark" });
  });

  it("keeps working for the session when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => setColorMode("light")).not.toThrow();
    expect(getColorMode()).toBe("light");
  });
});

describe("resolveColorMode", () => {
  const darkDevice = (dark: boolean) => {
    window.matchMedia = ((q: string) => ({ matches: dark && q.includes("dark"), media: q })) as any;
  };

  it("uses the merchant's default without a saved choice", () => {
    darkDevice(true);
    expect(resolveColorMode("light", true, null)).toBe("light");
  });

  it("follows the device for the system default", () => {
    darkDevice(true);
    expect(resolveColorMode("system", true, null)).toBe("dark");
  });

  it("uses the shopper's saved choice when the switch is shown", () => {
    darkDevice(false);
    expect(resolveColorMode("light", true, "dark")).toBe("dark");
  });

  it("ignores a saved choice when the switch is hidden", () => {
    expect(resolveColorMode("light", false, "dark")).toBe("light");
  });
});

describe("storeAccentVars", () => {
  it("lifts a black store color so dark-mode buttons stay visible", () => {
    const vars = storeAccentVars("#000000");
    expect(contrastRatio(vars["--aby-d-accent"], DEFAULTS.dark.bg)).toBeGreaterThanOrEqual(3);
    expect(vars["--aby-d-accent-text"]).toBe(readableOn(vars["--aby-d-accent"]));
  });

  it("leaves a store color that already stands out on dark", () => {
    expect(storeAccentVars("#d9a46a")["--aby-d-accent"]).toBeUndefined();
  });

  it("gives a light store color a readable ink for text on light pages", () => {
    const vars = storeAccentVars("#d4af37");
    expect(contrastRatio(vars["--aby-l-accent-ink"], DEFAULTS.light.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(vars["--aby-l-accent-ink"], DEFAULTS.light.card)).toBeGreaterThanOrEqual(4.5);
  });

  it("ignores a missing or invalid store color", () => {
    expect(storeAccentVars("")).toEqual({});
    expect(storeAccentVars("var(--x)")).toEqual({});
  });
});

describe("section background without a card color", () => {
  it("derives a card from the background so text stays readable on cards", () => {
    const style = sectionStyle({ l_bg: "#000000" });
    const card = /--aby-s-l-card:(#[0-9a-f]{6})/.exec(style)?.[1] || "";
    const text = /--aby-s-l-text:(#[0-9a-f]{6})/.exec(style)?.[1] || "";
    expect(card).not.toBe("");
    expect(contrastRatio(text, card)).toBeGreaterThanOrEqual(4.5);
  });

  it("gives a section accent its readable ink", () => {
    const style = sectionStyle({ l_accent: "#d4af37" });
    const ink = /--aby-s-l-accent-ink:(#[0-9a-f]{6})/.exec(style)?.[1] || "";
    expect(contrastRatio(ink, DEFAULTS.light.bg)).toBeGreaterThanOrEqual(4.5);
  });
});
