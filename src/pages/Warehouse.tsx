import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { PickLists } from "../components/Warehouse/PickLists";
import { RestockRequestsTable } from "../components/Warehouse/RestockRequestsTable";
import { WarehouseTable } from "../components/Warehouse/WarehouseTable";
import { COLORS } from "../theme/COLORS";

const Warehouse = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Warehouse
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Bins, pick lists, and stock nomenclature for your company
          </Typography>
        </Box>
        <PickLists />
        <WarehouseTable />
        <RestockRequestsTable
          incomingOnly
          title="Incoming receipts"
          description="Supplier deliveries waiting to be put on the shelf"
        />
        <RestockRequestsTable
          title="Restock requests"
          description="Requests sent to the supply department"
        />
      </Box>
    </PrivateLayout>
  );
};

export default Warehouse;
