import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { UsersTable } from "../components/UsersTable/UsersTable";
import { useCompaniesQuery, useUsersQuery } from "../hooks";
import { selectUser } from "../store/auth/auth.slice";
import {
  getVisibleUsers,
  isPlatformUser,
} from "../utils/companyAccess";
import { COLORS } from "../theme/COLORS";

const Users = () => {
  const user = useSelector(selectUser);
  const { data: companiesData } = useCompaniesQuery();
  const { data: usersData } = useUsersQuery();
  const companies = companiesData ?? [];
  const allUsers = usersData ?? [];
  const visibleUsers = getVisibleUsers(user, allUsers, companies);
  const companyName =
    companies.find((company) => company.id === user?.companyId)?.name ??
    user?.companyName ??
    "your company";
  const subtitle = isPlatformUser(user, companies)
    ? `${visibleUsers.length} people across all companies`
    : `${visibleUsers.length} people in ${companyName}`;

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
            {subtitle}
          </Typography>
        </Box>
        <UsersTable key={user?.id ?? "anonymous"} />
      </Box>
    </PrivateLayout>
  );
};

export default Users;
