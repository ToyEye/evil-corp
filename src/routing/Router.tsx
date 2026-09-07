import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

import { AccessRoute } from "./AccessRoute";
import { LegacyCompanyRedirect, ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { routes } from "./routes";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/Users"));
const Settings = lazy(() => import("../pages/Settings"));

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

      <Route path="/dashboard" element={<LegacyCompanyRedirect page="dashboard" />} />
      <Route path="/users" element={<LegacyCompanyRedirect page="users" />} />
      <Route path="/settings" element={<LegacyCompanyRedirect page="settings" />} />

      <Route path="/:companyName" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <AccessRoute pageId="dashboard">
              <Dashboard />
            </AccessRoute>
          }
        />
        <Route
          path="users"
          element={
            <AccessRoute pageId="users">
              <Users />
            </AccessRoute>
          }
        />
        <Route
          path="settings"
          element={
            <AccessRoute pageId="settings">
              <Settings />
            </AccessRoute>
          }
        />
      </Route>

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
