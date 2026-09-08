import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { SuppliersTable } from "../components/Suppliers/SuppliersTable";
import { COLORS } from "../theme/COLORS";

const Suppliers = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Suppliers
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Supplier directory for the supply department
          </Typography>
        </Box>
        <SuppliersTable />
      </Box>
    </PrivateLayout>
  );
};

export default Suppliers;
