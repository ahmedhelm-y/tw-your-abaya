import { pagePaletteVars, resolveColorMode, type Mode } from "./colors";
import { unwrapValue } from "./config";

let appliedKey = "";
let appliedVars: string[] = [];

/**
 * The page colors set on the hero: the brand color's palette for every section, and the page mode
 * (light, dark or the visitor's device). Bundles can't ship a page header, so the first section owns them.
 */
export function applyPageTheme(cfg: Record<string, any>): Mode {
  const vars = pagePaletteVars(cfg);
  const base = String(unwrapValue(cfg.default_mode) || "light");
  const key = `${JSON.stringify(vars)}|${base}`;
  const root = document.documentElement;
  const mode = resolveColorMode(base, false, null);
  if (key === appliedKey) return mode;
  appliedKey = key;
  for (const name of appliedVars) root.style.removeProperty(name);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  appliedVars = Object.keys(vars);
  root.classList.toggle("aby-mode-dark", mode === "dark");
  root.classList.toggle("aby-mode-light", mode === "light");
  return mode;
}

/** Removes the page colors when the hero leaves the page. */
export function clearPageTheme(): void {
  const root = document.documentElement;
  for (const name of appliedVars) root.style.removeProperty(name);
  appliedVars = [];
  appliedKey = "";
  root.classList.remove("aby-mode-dark", "aby-mode-light");
}
