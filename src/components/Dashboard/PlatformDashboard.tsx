import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { dummyUsers } from "../../data/users.dummy";
import { COLORS } from "../../theme/COLORS";
import { DashboardStatCard } from "./DashboardStatCard";

export const PlatformDashboard = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary }}
          >
            Dashboard
          </Typography>
          <Chip
            label="Platform"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: COLORS.primary[50],
              color: COLORS.primary[700],
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Overview of everyone using the platform
        </Typography>
      </Box>

      <DashboardStatCard
        label="Total users"
        value={dummyUsers.length}
        description="People across all companies"
      />
    </Box>
  );
};
