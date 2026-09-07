import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { getCompanyUserCount } from "../../data/users.dummy";
import { COLORS } from "../../theme/COLORS";
import { DashboardStatCard } from "./DashboardStatCard";

type ClientDashboardProps = {
  companyId: string;
  companyName: string;
};

export const ClientDashboard = ({ companyId, companyName }: ClientDashboardProps) => {
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
            label="Client"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: COLORS.background.muted,
              color: COLORS.text.secondary,
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Workforce for {companyName}
        </Typography>
      </Box>

      <DashboardStatCard
        label="Employees"
        value={getCompanyUserCount(companyId)}
        description={`People in ${companyName}`}
      />
    </Box>
  );
};
