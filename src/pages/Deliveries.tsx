import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { DeliveriesTable } from "../components/Deliveries/DeliveriesTable";
import { COLORS } from "../theme/COLORS";

const Deliveries = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Assigned deliveries
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Deliveries scheduled for your company
          </Typography>
        </Box>
        <DeliveriesTable />
      </Box>
    </PrivateLayout>
  );
};

export default Deliveries;
