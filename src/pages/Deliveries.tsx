import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DeliveriesTable } from "../components/Deliveries/DeliveriesTable";
import { DispatchBoard } from "../components/Deliveries/DispatchBoard";
import { DriverDeliveries } from "../components/Deliveries/DriverDeliveries";
import { ReadyOrdersTable } from "../components/Deliveries/ReadyOrdersTable";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { selectUser } from "../store/auth/auth.slice";
import { COLORS } from "../theme/COLORS";

const Deliveries = () => {
  const user = useSelector(selectUser);
  const isDriver = user?.role === "Driver";

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            {isDriver ? "My trips" : "Dispatch"}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {isDriver
              ? "Depart, arrive on site, then complete with proof of delivery"
              : "Pick packed orders, assign vehicles, then sequence multi-stop routes"}
          </Typography>
        </Box>
        {isDriver ? (
          <DriverDeliveries />
        ) : (
          <>
            <DispatchBoard />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                Ready to schedule
              </Typography>
              <ReadyOrdersTable />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                Scheduled
              </Typography>
              <DeliveriesTable />
            </Box>
          </>
        )}
      </Box>
    </PrivateLayout>
  );
};

export default Deliveries;
