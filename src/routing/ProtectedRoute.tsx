import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCompanyNameForUser } from "../data/users.dummy";
import { selectIsAuthenticated, selectUser } from "../store/auth/auth.slice";
import { paths, routes, toCompanySlug } from "./routes";

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { companyName } = useParams();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={routes.Home} replace />;
  }

  const userCompanySlug = toCompanySlug(getCompanyNameForUser(user));

  if (!userCompanySlug) {
    return <Navigate to={routes.Home} replace />;
  }

  if (companyName && companyName !== userCompanySlug) {
    const suffix = location.pathname.replace(`/${companyName}`, "") || "/dashboard";
    return <Navigate to={`/${userCompanySlug}${suffix}${location.search}`} replace />;
  }

  return <Outlet />;
};

type LegacyCompanyRedirectProps = {
  page:
    | "dashboard"
    | "users"
    | "settings"
    | "warehouse"
    | "account"
    | "suppliersDirectory"
    | "suppliersRequests"
    | "clients"
    | "deliveries"
    | "createDelivery";
};

export const LegacyCompanyRedirect = ({ page }: LegacyCompanyRedirectProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated || !user) {
    return <Navigate to={routes.Home} replace />;
  }

  return <Navigate to={paths[page](getCompanyNameForUser(user))} replace />;
};
