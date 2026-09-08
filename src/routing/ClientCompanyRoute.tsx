import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { isPlatformUser } from "../data/companies.dummy";
import { getCompanyNameForUser } from "../data/users.dummy";
import { selectUser } from "../store/auth/auth.slice";
import { paths, routes } from "./routes";

type ClientCompanyRouteProps = {
  children: React.ReactNode;
};

export const ClientCompanyRoute = ({ children }: ClientCompanyRouteProps) => {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to={routes.Home} replace />;
  }

  if (isPlatformUser(user)) {
    return <Navigate to={paths.dashboard(getCompanyNameForUser(user))} replace />;
  }

  return children;
};
