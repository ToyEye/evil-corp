import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CreateOrderForm } from "../components/Orders/CreateOrderForm";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { getCompanyNameForUser } from "../data/users.dummy";
import { paths } from "../routing/routes";
import { selectUser } from "../store/auth/auth.slice";
import { COLORS } from "../theme/COLORS";

const CreateOrder = () => {
  const user = useSelector(selectUser);

  if (user && user.role !== "Staff") {
    return <Navigate to={paths.orders(getCompanyNameForUser(user))} replace />;
  }

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Create order
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Reserve warehouse stock for a client order
          </Typography>
        </Box>
        <CreateOrderForm />
      </Box>
    </PrivateLayout>
  );
};

export default CreateOrder;
