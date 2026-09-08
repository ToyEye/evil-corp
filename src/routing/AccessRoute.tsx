import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { hasAccess } from "../components/Aside/aside.utils";
import { appPages } from "../data/permissions.dummy";
import type { AppPageId } from "../data/permissions.schema";
import { getCompanyNameForUser } from "../data/users.dummy";
import { selectUser } from "../store/auth/auth.slice";
import { selectPageAccess } from "../store/permissions/permissions.slice";
import { paths, routes } from "./routes";

const pagePaths = {
  dashboard: paths.dashboard,
  users: paths.users,
  settings: paths.settings,
  warehouse: paths.warehouse,
  suppliers: paths.suppliersDirectory,
} as const;

type AccessRouteProps = {
  pageId: AppPageId;
  children: React.ReactNode;
};

export const AccessRoute = ({ pageId, children }: AccessRouteProps) => {
  const user = useSelector(selectUser);
  const pageAccess = useSelector(selectPageAccess);

  if (!user) {
    return <Navigate to={routes.Home} replace />;
  }

  if (hasAccess(pageAccess[pageId], user.role)) {
    return children;
  }

  const fallback = appPages.find(
    (page) => page.id !== pageId && hasAccess(pageAccess[page.id], user.role),
  );

  if (!fallback) {
    return <Navigate to={routes.Home} replace />;
  }

  return (
    <Navigate to={pagePaths[fallback.id](getCompanyNameForUser(user))} replace />
  );
};
