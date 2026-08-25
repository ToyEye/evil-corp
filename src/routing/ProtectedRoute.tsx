import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/auth/auth.slice";
import { routes } from "./routes";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={routes.Home} replace />;
  }

  return children;
};
