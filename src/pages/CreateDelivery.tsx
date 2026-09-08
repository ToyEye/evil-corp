import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CreateDeliveryForm } from "../components/Deliveries/CreateDeliveryForm";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { COLORS } from "../theme/COLORS";

const CreateDelivery = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 760 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Create delivery
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Plan a delivery from warehouse stock to a client address
          </Typography>
        </Box>
        <CreateDeliveryForm />
      </Box>
    </PrivateLayout>
  );
};

export default CreateDelivery;
