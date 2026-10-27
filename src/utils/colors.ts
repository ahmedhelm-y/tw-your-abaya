import { unwrapValue } from "./config";

export type Mode = "light" | "dark";
export type Tokens = { bg: string; card: string; title: string; text: string; accent: string; accentText: string; accentInk: string };

const TOKENS = ["bg", "card", "title", "text", "accent"] as const;
const DARK_TEXT = "#111111";
const WHITE = "#ffffff";
const MIN_CONTRAST = 4.5;

type RGB = [number, number, number];

function parse(color: unknown): RGB | null {
  if (typeof color !== "string") return null;
  const hex = color.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
}

function toHex([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function normalize(color: unknown): string | null {
  const rgb = parse(color);
  return rgb ? toHex(rgb) : null;
}

function luminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const ra = parse(a);
  const rb = parse(b);
  if (!ra || !rb) return 1;
  const [hi, lo] = [luminance(ra), luminance(rb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Text color for a background: near black or white, whichever reads better. */
export function readableOn(bg: string): string {
  const best = contrastRatio(DARK_TEXT, bg) >= contrastRatio(WHITE, bg) ? DARK_TEXT : WHITE;
  return contrastRatio(best, bg) >= MIN_CONTRAST ? best : "#000000";
}

function mix(a: string, b: string, amount: number): string {
  const ra = parse(a)!;
  const rb = parse(b)!;
  return toHex(ra.map((v, i) => v + (rb[i] - v) * amount) as RGB);
}

/** Moves a color toward black or white until it reads on every given background. */
function ensureContrast(color: string, backgrounds: string[], toward: string, min = MIN_CONTRAST): string {
  let out = color;
  for (let step = 0; step < 20 && backgrounds.some((bg) => contrastRatio(out, bg) < min); step++) {
    out = mix(out, toward, 0.05 * (step + 1));
  }
  return backgrounds.every((bg) => contrastRatio(out, bg) >= min) ? out : toward;
}

const BLACK = "#000000";
const towardText = (mode: Mode) => (mode === "light" ? BLACK : WHITE);

/** Button text on the accent, and the accent as ink: text and outlines that read on the page and on cards. */
function withAccents(tokens: Omit<Tokens, "accentText" | "accentInk">, mode: Mode): Tokens {
  return {
    ...tokens,
    accentText: readableOn(tokens.accent),
    accentInk: ensureContrast(tokens.accent, [tokens.bg, tokens.card], towardText(mode)),
  };
}

export const DEFAULTS: Record<Mode, Tokens> = {
  light: withAccents({ bg: "#ffffff", card: "#f7f4f0", title: "#1a1714", text: "#4a4440", accent: "#8a5a2b" }, "light"),
  dark: withAccents({ bg: "#141210", card: "#1f1b18", title: "#f5efe8", text: "#c9bfb4", accent: "#d9a46a" }, "dark"),
};

/** Builds the light and dark page palettes from the brand color. */
export function derivePalette(base?: string | null): Record<Mode, Tokens> {
  const color = normalize(base);
  if (!color) return structuredClone(DEFAULTS);

  const lBg = mix(color, WHITE, 0.94);
  const lCard = mix(color, WHITE, 0.88);
  const dBg = mix(color, "#000000", 0.88);
  const dCard = mix(color, "#000000", 0.8);

  return {
    light: withAccents({
      bg: lBg,
      card: lCard,
      title: ensureContrast(mix(color, "#000000", 0.8), [lBg, lCard], "#000000"),
      text: ensureContrast(mix(color, "#000000", 0.65), [lBg, lCard], "#000000"),
      accent: color,
    }, "light"),
    dark: withAccents({
      bg: dBg,
      card: dCard,
      title: ensureContrast(mix(color, WHITE, 0.92), [dBg, dCard], WHITE),
      text: ensureContrast(mix(color, WHITE, 0.75), [dBg, dCard], WHITE),
      // An accent that disappears into the dark background is lifted until it stands out
      accent: ensureContrast(color, [dBg], WHITE, 3),
    }, "dark"),
  };
}

const cssName = (token: string) => (token === "accentText" ? "accent-text" : token === "accentInk" ? "accent-ink" : token);

/**
 * The filled, valid l_* / d_* colors of a config as CSS variables named `${varPrefix}${l|d}-${token}`.
 * A background without its text colors gets readable ones, and an accent gets its button text.
 */
function overrideVars(cfg: Record<string, any>, varPrefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const prefix of ["l", "d"] as const) {
    const values: Record<string, string> = {};
    for (const token of TOKENS) {
      const value = normalize(cfg[`${prefix}_${token}`]);
      if (value) values[token] = value;
    }
    const mode: Mode = prefix === "l" ? "light" : "dark";
    if (values.bg) {
      // A section painted with its own background gets matching cards, so its text reads on both
      const ink = readableOn(values.bg);
      values.card ??= mix(values.bg, ink, 0.08);
      values.title ??= ensureContrast(ink, [values.bg, values.card], ink === WHITE ? WHITE : BLACK);
      values.text ??= ensureContrast(ink, [values.bg, values.card], ink === WHITE ? WHITE : BLACK);
    }
    if (values.accent) {
      values["accent-text"] = readableOn(values.accent);
      const surfaces = [values.bg || DEFAULTS[mode].bg, values.card || DEFAULTS[mode].card];
      values["accent-ink"] = ensureContrast(values.accent, surfaces, readableOn(surfaces[0]) === WHITE ? WHITE : BLACK);
    }
    for (const [token, value] of Object.entries(values)) out[`${varPrefix}${prefix}-${token}`] = value;
  }
  return out;
}

/**
 * The page palette as --aby-l-* / --aby-d-* variables: derived from the header's brand color, with the
 * header's own colors on top. Empty when neither is set, so the store's colors and the defaults apply.
 */
export function pagePaletteVars(cfg: Record<string, any>): Record<string, string> {
  const out: Record<string, string> = {};
  if (normalize(cfg.brand_color)) {
    const palette = derivePalette(cfg.brand_color);
    for (const [mode, prefix] of [["light", "l"], ["dark", "d"]] as const) {
      for (const [token, value] of Object.entries(palette[mode])) out[`--aby-${prefix}-${cssName(token)}`] = value;
    }
  }
  return { ...out, ...overrideVars(cfg, "--aby-") };
}

/**
 * Without a brand color, buttons use the store's primary color. A dark store color would vanish on the
 * dark page, so this returns a lifted dark accent (and its text) for that case only.
 */
export function storeAccentVars(primary: string): Record<string, string> {
  const color = normalize(primary);
  if (!color) return {};
  const out: Record<string, string> = {};
  let dark = color;
  if (contrastRatio(color, DEFAULTS.dark.bg) < 3) {
    dark = ensureContrast(color, [DEFAULTS.dark.bg], WHITE, 3);
    out["--aby-d-accent"] = dark;
    out["--aby-d-accent-text"] = readableOn(dark);
  }
  // Text and outlines in the store color stay readable in both modes
  out["--aby-l-accent-ink"] = ensureContrast(color, [DEFAULTS.light.bg, DEFAULTS.light.card], BLACK);
  out["--aby-d-accent-ink"] = ensureContrast(dark, [DEFAULTS.dark.bg, DEFAULTS.dark.card], WHITE);
  return out;
}

/** A section's own colors; empty fields fall through to the page palette. */
export function sectionStyle(cfg: Record<string, any>): string {
  return Object.entries(overrideVars(cfg, "--aby-s-"))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

/** Section color scheme: follows the page mode by default, or stays light or dark. */
export function schemeClass(cfg: Record<string, any>): "" | "aby-dark" | "aby-auto" {
  const scheme = String(unwrapValue(cfg.color_scheme) || "auto");
  return scheme === "dark" ? "aby-dark" : scheme === "light" ? "" : "aby-auto";
}

const STORAGE_KEY = "aby-mode";
let sessionMode: Mode | null = null;

/** The mode the shopper picked, if it was picked under the same merchant default. */
export function getColorMode(base?: string): Mode | null {
  if (sessionMode) return sessionMode;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if ((saved?.mode === "light" || saved?.mode === "dark") && saved.base === base) return saved.mode;
  } catch {
    // storage blocked or corrupt: no saved choice
  }
  return null;
}

/** The page mode: the shopper's saved choice when the switch is shown, else the merchant's default. */
export function resolveColorMode(base: string, allowSaved: boolean, saved: Mode | null): Mode {
  if (allowSaved && saved) return saved;
  if (base === "system") return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return base === "dark" ? "dark" : "light";
}

/** Remembers the shopper's choice; base is the merchant's default mode at the time. */
export function setColorMode(mode: Mode, base?: string): void {
  sessionMode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, base }));
  } catch {
    // storage blocked: the choice still holds for this page view
  }
}
