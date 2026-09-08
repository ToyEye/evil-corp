import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { RestockRequestsTable } from "../components/Warehouse/RestockRequestsTable";
import { COLORS } from "../theme/COLORS";

const RestockRequests = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Restock requests
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Incoming requests from storekeepers to reorder stock
          </Typography>
        </Box>
        <RestockRequestsTable />
      </Box>
    </PrivateLayout>
  );
};

export default RestockRequests;
