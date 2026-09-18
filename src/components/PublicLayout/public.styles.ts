import { COLORS } from "../../theme/COLORS";

export const PUBLIC_PAGE_MAX_WIDTH = 1200;

export const publicPrimaryButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  borderRadius: "10px",
  px: { xs: 1.5, sm: 2.5 },
  py: 1,
  backgroundColor: COLORS.primary[600],
  boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
  "&:hover": {
    backgroundColor: COLORS.primary[700],
    boxShadow: `0 6px 20px ${COLORS.ui.shadowStrong}`,
  },
};

export const publicSecondaryButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  borderRadius: "10px",
  px: { xs: 1.5, sm: 2.5 },
  py: 1,
  color: COLORS.text.primary,
  borderColor: COLORS.border.default,
  backgroundColor: COLORS.background.surface,
  "&:hover": {
    borderColor: COLORS.border.strong,
    backgroundColor: COLORS.background.subtle,
  },
};

export const publicNavButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  fontSize: "0.95rem",
  color: COLORS.text.secondary,
  borderRadius: "10px",
  px: 2,
  py: 1,
  minWidth: 0,
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor: COLORS.background.subtle,
    color: COLORS.text.primary,
  },
  "&.active": {
    backgroundColor: COLORS.primary[50],
    color: COLORS.primary[700],
  },
};

export const publicCardSx = {
  borderRadius: "16px",
  border: `1px solid ${COLORS.border.default}`,
  backgroundColor: COLORS.background.surface,
  boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
};
