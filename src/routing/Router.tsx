import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route
        path={routes.Home}
        index
        element={
          <PublicRoute>
            <div>Home</div>
          </PublicRoute>
        }
      />

      <Route
        path={routes.Dashboard}
        element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
