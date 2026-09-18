import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { isDeliveryTerminal } from "../../data/deliveries.schema";
import { getOrderTotal } from "../../data/orders.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { selectClients } from "../../store/clients/clients.slice";
import { selectDeliveries } from "../../store/deliveries/deliveries.slice";
import { selectOrders } from "../../store/orders/orders.slice";
import { selectRestockRequests } from "../../store/restock/restock.slice";
import { selectSuppliers } from "../../store/suppliers/suppliers.slice";
import { selectUsers } from "../../store/users/users.slice";
import { COLORS } from "../../theme/COLORS";
import { formatMoney } from "../../utils/formatMoney";
import { DashboardStatCard } from "./DashboardStatCard";
import { OpsExceptions } from "./OpsExceptions";

type ClientDashboardProps = {
  companyId: string;
  companyName: string;
};

export const ClientDashboard = ({ companyId, companyName }: ClientDashboardProps) => {
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const clients = useSelector(selectClients);
  const orders = useSelector(selectOrders);
  const deliveries = useSelector(selectDeliveries);
  const suppliers = useSelector(selectSuppliers);
  const restockRequests = useSelector(selectRestockRequests);

  const employeeCount = users.filter((item) => item.companyId === companyId).length;
  const clientCount = clients.filter((item) => item.companyId === companyId).length;
  const soldToClients = orders
    .filter((order) => order.companyId === companyId && order.status === "Paid")
    .reduce((total, order) => total + getOrderTotal(order.items), 0);
  const supplierCount = suppliers.filter((item) => item.companyId === companyId).length;
  const requestCount = restockRequests.filter((item) => item.companyId === companyId).length;
  const myOpenTrips = deliveries.filter(
    (item) =>
      item.companyId === companyId &&
      item.driverId === user?.id &&
      !isDeliveryTerminal(item.status),
  ).length;
  const isDriver = user?.role === "Driver";
  const isSeo = user?.role === "SEO";

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
            lg: "repeat(4, minmax(0, 1fr))",
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
          label="Clients"
          value={clientCount}
          detail={formatMoney(soldToClients)}
          description="Total sold to clients"
          icon={GroupOutlinedIcon}
          accent="success"
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
        {isDriver ? (
          <DashboardStatCard
            label="My open trips"
            value={myOpenTrips}
            description="Assigned deliveries still in progress"
            icon={RouteOutlinedIcon}
            accent="info"
          />
        ) : null}
      </Box>

      {isSeo ? <OpsExceptions companyId={companyId} /> : null}
    </Box>
  );
};
