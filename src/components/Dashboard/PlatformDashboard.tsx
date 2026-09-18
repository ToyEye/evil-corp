import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { COLORS } from "../../theme/COLORS";
import { selectSupportThreads } from "../../store/support/support.slice";
import { selectUsers } from "../../store/users/users.slice";
import { DashboardStatCard } from "./DashboardStatCard";

export const PlatformDashboard = () => {
  const users = useSelector(selectUsers);
  const threads = useSelector(selectSupportThreads);

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 360px))" },
          gap: 2,
        }}
      >
        <DashboardStatCard
          label="Total users"
          value={users.length}
          description="People across all companies"
          icon={PeopleOutlinedIcon}
        />
        <DashboardStatCard
          label="Support chats"
          value={threads.length}
          description="Client company conversations"
          icon={SupportAgentOutlinedIcon}
          accent="info"
        />
      </Box>
    </Box>
  );
};
