import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { ClientsTable } from "../components/Clients/ClientsTable";
import { COLORS } from "../theme/COLORS";

const Clients = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Clients
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Customers and delivery contacts for your company
          </Typography>
        </Box>
        <ClientsTable />
      </Box>
    </PrivateLayout>
  );
};

export default Clients;
