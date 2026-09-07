import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCompanyNameForUser } from "../data/users.dummy";
import { selectIsAuthenticated, selectUser } from "../store/auth/auth.slice";
import { paths } from "./routes";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (isAuthenticated && user) {
    return <Navigate to={paths.dashboard(getCompanyNameForUser(user))} replace />;
  }

  return children;
};
