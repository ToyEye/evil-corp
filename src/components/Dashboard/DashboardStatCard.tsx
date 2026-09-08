import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

import { COLORS } from "../../theme/COLORS";

const ACCENTS = {
  primary: {
    background: COLORS.primary[50],
    color: COLORS.primary[700],
  },
  info: {
    background: COLORS.info[50],
    color: COLORS.info[700],
  },
  warning: {
    background: COLORS.warning[50],
    color: COLORS.warning[700],
  },
} as const;

type DashboardStatCardProps = {
  label: string;
  value: number;
  description: string;
  icon?: SvgIconComponent;
  accent?: keyof typeof ACCENTS;
};

export const DashboardStatCard = ({
  label,
  value,
  description,
  icon: Icon,
  accent = "primary",
}: DashboardStatCardProps) => {
  const tone = ACCENTS[accent];

  return (
    <Box
      sx={{
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        p: 2.5,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        {Icon ? (
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backgroundColor: tone.background,
              color: tone.color,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        ) : null}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: COLORS.text.tertiary,
            minWidth: 0,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", md: "2.25rem" },
          lineHeight: 1.1,
          color: COLORS.text.primary,
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: COLORS.text.secondary,
          mt: "auto",
          overflowWrap: "anywhere",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
