import { COLORS } from "../../theme/COLORS";

export const ASIDE_EXPANDED_WIDTH = 268;
export const ASIDE_COLLAPSED_WIDTH = 80;
export const ASIDE_TRANSITION = "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)";

export const getNavItemSx = (collapsed: boolean, depth: number, active: boolean) => ({
  mx: 1,
  mb: 0.5,
  borderRadius: "10px",
  minHeight: 44,
  justifyContent: collapsed ? "center" : "flex-start",
  pl: collapsed ? 1 : 1.5 + depth * 1.75,
  pr: collapsed ? 1 : 1.25,
  color: active ? COLORS.primary[700] : COLORS.text.secondary,
  backgroundColor: active ? COLORS.primary[50] : "transparent",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor: active ? COLORS.primary[100] : COLORS.background.subtle,
    color: active ? COLORS.primary[800] : COLORS.text.primary,
  },
  "&.active": {
    backgroundColor: COLORS.primary[50],
    color: COLORS.primary[700],
  },
});
