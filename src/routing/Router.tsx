import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";

import { AccessRoute } from "./AccessRoute";
import { ClientCompanyRoute } from "./ClientCompanyRoute";
import { LegacyCompanyRedirect, ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { routes } from "./routes";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/Users"));
const Settings = lazy(() => import("../pages/Settings"));
const Account = lazy(() => import("../pages/Account"));
const Warehouse = lazy(() => import("../pages/Warehouse"));
const Suppliers = lazy(() => import("../pages/Suppliers"));
const RestockRequests = lazy(() => import("../pages/RestockRequests"));
const Clients = lazy(() => import("../pages/Clients"));
const Deliveries = lazy(() => import("../pages/Deliveries"));
const CreateDelivery = lazy(() => import("../pages/CreateDelivery"));

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
      <Route path="/account" element={<LegacyCompanyRedirect page="account" />} />
      <Route path="/warehouse" element={<LegacyCompanyRedirect page="warehouse" />} />
      <Route
        path="/suppliers"
        element={<LegacyCompanyRedirect page="suppliersDirectory" />}
      />
      <Route
        path="/suppliers/directory"
        element={<LegacyCompanyRedirect page="suppliersDirectory" />}
      />
      <Route
        path="/suppliers/requests"
        element={<LegacyCompanyRedirect page="suppliersRequests" />}
      />
      <Route path="/clients" element={<LegacyCompanyRedirect page="clients" />} />
      <Route path="/deliveries" element={<LegacyCompanyRedirect page="deliveries" />} />
      <Route
        path="/deliveries/new"
        element={<LegacyCompanyRedirect page="createDelivery" />}
      />

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
        <Route path="account" element={<Account />} />
        <Route
          path="warehouse"
          element={
            <AccessRoute pageId="warehouse">
              <Warehouse />
            </AccessRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <AccessRoute pageId="suppliers">
              <Navigate to="directory" replace />
            </AccessRoute>
          }
        />
        <Route
          path="suppliers/directory"
          element={
            <AccessRoute pageId="suppliers">
              <Suppliers />
            </AccessRoute>
          }
        />
        <Route
          path="suppliers/requests"
          element={
            <AccessRoute pageId="suppliers">
              <RestockRequests />
            </AccessRoute>
          }
        />
        <Route
          path="clients"
          element={
            <ClientCompanyRoute>
              <AccessRoute pageId="clients">
                <Clients />
              </AccessRoute>
            </ClientCompanyRoute>
          }
        />
        <Route
          path="deliveries"
          element={
            <ClientCompanyRoute>
              <AccessRoute pageId="deliveries">
                <Deliveries />
              </AccessRoute>
            </ClientCompanyRoute>
          }
        />
        <Route
          path="deliveries/new"
          element={
            <ClientCompanyRoute>
              <AccessRoute pageId="deliveries">
                <CreateDelivery />
              </AccessRoute>
            </ClientCompanyRoute>
          }
        />
      </Route>

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
