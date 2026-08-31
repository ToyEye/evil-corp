import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

export const Router = () => {
  return (
    <Routes>
      <Route
        path={routes.Home}
        index
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path={routes.Dashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
