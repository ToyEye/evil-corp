import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { COLORS } from "../../theme/COLORS";

type DashboardStatCardProps = {
  label: string;
  value: number;
  description: string;
};

export const DashboardStatCard = ({
  label,
  value,
  description,
}: DashboardStatCardProps) => {
  return (
    <Box
      sx={{
        maxWidth: 420,
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        p: 2.5,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: COLORS.text.tertiary,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "2.5rem",
          lineHeight: 1.1,
          color: COLORS.text.primary,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
        {description}
      </Typography>
    </Box>
  );
};
