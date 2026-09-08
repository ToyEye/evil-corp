import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { selectRestockRequests } from "../../store/restock/restock.slice";
import { selectSuppliers } from "../../store/suppliers/suppliers.slice";
import { selectUsers } from "../../store/users/users.slice";
import { COLORS } from "../../theme/COLORS";
import { DashboardStatCard } from "./DashboardStatCard";

type ClientDashboardProps = {
  companyId: string;
  companyName: string;
};

export const ClientDashboard = ({ companyId, companyName }: ClientDashboardProps) => {
  const users = useSelector(selectUsers);
  const suppliers = useSelector(selectSuppliers);
  const restockRequests = useSelector(selectRestockRequests);

  const employeeCount = users.filter((user) => user.companyId === companyId).length;
  const supplierCount = suppliers.filter((item) => item.companyId === companyId).length;
  const requestCount = restockRequests.filter((item) => item.companyId === companyId).length;

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
          Overview for {companyName}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        <DashboardStatCard
          label="Employees"
          value={employeeCount}
          description={`People in ${companyName}`}
          icon={PeopleOutlinedIcon}
          accent="primary"
        />
        <DashboardStatCard
          label="Suppliers"
          value={supplierCount}
          description="Partners in the supplier directory"
          icon={LocalShippingOutlinedIcon}
          accent="info"
        />
        <DashboardStatCard
          label="Restock requests"
          value={requestCount}
          description="Requests sent to the supply department"
          icon={AssignmentOutlinedIcon}
          accent="warning"
        />
      </Box>
    </Box>
  );
};
