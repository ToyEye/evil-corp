import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { isUnauthorizedError } from "../api/http";
import { usePermissionsQuery } from "../hooks";
import { selectUser } from "../store/auth/auth.slice";
import { getCompanyNameForUser } from "../utils/companyAccess";
import { paths, routes } from "./routes";
import { canAccessSupportChat, EMPTY_PAGE_ACCESS } from "./supportAccess";

type SupportRouteProps = {
  children: React.ReactNode;
};

export const SupportRoute = ({ children }: SupportRouteProps) => {
  const user = useSelector(selectUser);
  const { data: permissions, isLoading, isError, error } = usePermissionsQuery();
  const pageAccess = permissions?.pageAccess ?? EMPTY_PAGE_ACCESS;

  if (!user) {
    return <Navigate to={routes.Home} replace />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    if (isUnauthorizedError(error)) {
      return <Navigate to={routes.Home} replace />;
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography color="text.secondary">
          Couldn&apos;t load page access. Refresh and try again.
        </Typography>
      </Box>
    );
  }

  if (canAccessSupportChat(user, pageAccess)) {
    return children;
  }

  return (
    <Navigate to={paths.dashboard(getCompanyNameForUser(user))} replace />
  );
};
