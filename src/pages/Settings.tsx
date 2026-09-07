import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { RolePageAccess } from "../components/Settings/RolePageAccess";
import { COLORS } from "../theme/COLORS";

const Settings = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Manage who can see each page in the app
          </Typography>
        </Box>
        <RolePageAccess />
      </Box>
    </PrivateLayout>
  );
};

export default Settings;
