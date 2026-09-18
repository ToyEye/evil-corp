import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { OrdersTable } from "../components/Orders/OrdersTable";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { getCompanyNameForUser } from "../utils/companyAccess";
import { paths } from "../routing/routes";
import { selectUser } from "../store/auth/auth.slice";
import { COLORS } from "../theme/COLORS";

const Orders = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const canCreate = user?.role === "Staff";

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
            >
              Orders
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
              {canCreate
                ? "Create and manage client orders"
                : "Review orders and mark them as paid"}
            </Typography>
          </Box>
          {canCreate && user ? (
            <Button
              variant="contained"
              onClick={() => navigate(paths.createOrder(getCompanyNameForUser(user)))}
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: COLORS.primary[600],
                boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
                "&:hover": { backgroundColor: COLORS.primary[700] },
              }}
            >
              Create order
            </Button>
          ) : null}
        </Box>
        <OrdersTable />
      </Box>
    </PrivateLayout>
  );
};

export default Orders;
