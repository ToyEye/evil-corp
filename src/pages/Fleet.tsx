import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FleetTable } from "../components/Deliveries/FleetTable";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { paths } from "../routing/routes";
import { selectUser } from "../store/auth/auth.slice";
import { COLORS } from "../theme/COLORS";

const Fleet = () => {
  const user = useSelector(selectUser);

  if (user?.role === "Driver") {
    return <Navigate to={paths.deliveries(user.companyName)} replace />;
  }

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Fleet
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Vehicles and remaining unit capacity on open trips
          </Typography>
        </Box>
        <FleetTable />
      </Box>
    </PrivateLayout>
  );
};

export default Fleet;
