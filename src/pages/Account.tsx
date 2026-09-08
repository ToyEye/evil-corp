import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AccountSettingsForm } from "../components/Account/AccountSettingsForm";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { COLORS } from "../theme/COLORS";

const Account = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Account settings
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Update your profile details
          </Typography>
        </Box>
        <AccountSettingsForm />
      </Box>
    </PrivateLayout>
  );
};

export default Account;
