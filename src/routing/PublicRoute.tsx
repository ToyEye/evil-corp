import { Navigate } from "react-router-dom";

import { useSessionSync } from "../hooks";
import { getCompanyNameForUser } from "../utils/companyAccess";
import { paths } from "./routes";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useSessionSync();

  if (isAuthenticated && user) {
    return (
      <Navigate to={paths.dashboard(getCompanyNameForUser(user))} replace />
    );
  }

  return children;
};
