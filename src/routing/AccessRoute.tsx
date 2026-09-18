import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { hasAccess } from "../components/Aside/aside.utils";
import { appPages } from "../data/permissions.defaults";
import type { AppPageId } from "../data/permissions.schema";
import { usePermissionsQuery } from "../hooks";
import { selectUser } from "../store/auth/auth.slice";
import { getCompanyNameForUser } from "../utils/companyAccess";
import { EMPTY_PAGE_ACCESS } from "./supportAccess";
import { paths, routes } from "./routes";

const pagePaths = {
  dashboard: paths.dashboard,
  users: paths.users,
  settings: paths.settings,
  warehouse: paths.warehouse,
  suppliers: paths.suppliersDirectory,
  clients: paths.clients,
  deliveries: paths.deliveries,
  orders: paths.orders,
  invoices: paths.invoices,
  support: paths.support,
} as const;

type AccessRouteProps = {
  pageId: AppPageId;
  children: React.ReactNode;
};

export const AccessRoute = ({ pageId, children }: AccessRouteProps) => {
  const user = useSelector(selectUser);
  const { data: permissions, isLoading } = usePermissionsQuery();
  const pageAccess = permissions?.pageAccess ?? EMPTY_PAGE_ACCESS;
  const pages = permissions?.pages ?? appPages;

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

  if (hasAccess(pageAccess[pageId], user.role)) {
    return children;
  }

  const fallback = pages.find(
    (page) => page.id !== pageId && hasAccess(pageAccess[page.id], user.role),
  );

  if (!fallback) {
    return <Navigate to={routes.Home} replace />;
  }

  return (
    <Navigate
      to={pagePaths[fallback.id](getCompanyNameForUser(user))}
      replace
    />
  );
};
