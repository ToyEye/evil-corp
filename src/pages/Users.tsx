import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { UsersTable } from "../components/UsersTable/UsersTable";
import { dummyUsers } from "../data/users.dummy";
import { COLORS } from "../theme/COLORS";

const Users = () => {
  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Users
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {dummyUsers.length} people across all companies
          </Typography>
        </Box>
        <UsersTable />
      </Box>
    </PrivateLayout>
  );
};

export default Users;
