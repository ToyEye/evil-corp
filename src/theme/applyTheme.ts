import { DARK_COLORS, LIGHT_COLORS, type ColorPalette, type ThemeMode } from "./palettes";

export type { ThemeMode, ColorPalette };

export const THEME_STORAGE_KEY = "evil-corp-theme-mode";

type NestedColors = { [key: string]: string | NestedColors };

const walkPalette = (
  node: NestedColors,
  visit: (path: string[], value: string) => void,
  path: string[] = [],
) => {
  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...path, key];

    if (typeof value === "string") {
      visit(nextPath, value);
    } else {
      walkPalette(value, visit, nextPath);
    }
  }
};

export const toCssVarPalette = <T>(node: T, path: string[] = []): T => {
  if (typeof node === "string") {
    return `var(--color-${path.join("-")})` as T;
  }

  const result = {} as T;

  for (const [key, value] of Object.entries(node as object)) {
    (result as Record<string, unknown>)[key] = toCssVarPalette(value, [...path, key]);
  }

  return result;
};

export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark";

export const readStoredThemeMode = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "light";
  } catch {
    return "light";
  }
};

export const writeStoredThemeMode = (mode: ThemeMode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }
};

export const applyThemeMode = (mode: ThemeMode) => {
  const palette = mode === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const root = document.documentElement;

  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  walkPalette(palette as NestedColors, (path, value) => {
    root.style.setProperty(`--color-${path.join("-")}`, value);
  });
};

export const getActivePalette = (): ColorPalette => {
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  return mode === "dark" ? DARK_COLORS : LIGHT_COLORS;
};

applyThemeMode(readStoredThemeMode());
