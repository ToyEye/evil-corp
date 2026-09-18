import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { InvoicesTable } from "../components/Invoices/InvoicesTable";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { COLORS } from "../theme/COLORS";

const Invoices = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Invoices
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Paid client orders issued as invoices
          </Typography>
        </Box>
        <InvoicesTable />
      </Box>
    </PrivateLayout>
  );
};

export default Invoices;
