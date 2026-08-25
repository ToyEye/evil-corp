import { Navigate } from "react-router-dom";
import { routes } from "./routes";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/auth/auth.slice";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={routes.Dashboard} replace />;
  }

  return children;
};
