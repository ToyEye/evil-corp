import { toCssVarPalette } from "./applyTheme";
import { LIGHT_COLORS } from "./palettes";

export const COLORS = toCssVarPalette(LIGHT_COLORS);

export { LIGHT_COLORS, DARK_COLORS, getPalette } from "./palettes";
export type { ColorPalette, ThemeMode } from "./palettes";
export {
  applyThemeMode,
  getActivePalette,
  readStoredThemeMode,
  writeStoredThemeMode,
} from "./applyTheme";
