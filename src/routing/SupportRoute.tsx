import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCompanyNameForUser } from "../data/users.dummy";
import { selectUser } from "../store/auth/auth.slice";
import { selectPageAccess } from "../store/permissions/permissions.slice";
import { paths, routes } from "./routes";
import { canAccessSupportChat } from "./supportAccess";

type SupportRouteProps = {
  children: React.ReactNode;
};

export const SupportRoute = ({ children }: SupportRouteProps) => {
  const user = useSelector(selectUser);
  const pageAccess = useSelector(selectPageAccess);

  if (!user) {
    return <Navigate to={routes.Home} replace />;
  }

  if (canAccessSupportChat(user, pageAccess)) {
    return children;
  }

  return <Navigate to={paths.dashboard(getCompanyNameForUser(user))} replace />;
};
