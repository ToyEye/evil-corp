import { generatePath } from "react-router-dom";

export const routes = {
  Home: "/",
  Dashboard: "/:companyName/dashboard",
  Users: "/:companyName/users",
  UsersRoles: "/:companyName/users/roles",
  Settings: "/:companyName/settings",
  SettingsPassword: "/:companyName/settings/password",
  SettingsSessions: "/:companyName/settings/sessions",
  Warehouse: "/:companyName/warehouse",
  Account: "/:companyName/account",
  Suppliers: "/:companyName/suppliers",
  SuppliersDirectory: "/:companyName/suppliers/directory",
  SuppliersRequests: "/:companyName/suppliers/requests",
} as const;

export const toCompanySlug = (companyName: string | null | undefined) => {
  if (!companyName) {
    return "";
  }

  return companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const withCompany = (route: string, companyName: string) =>
  generatePath(route, { companyName: toCompanySlug(companyName) });

export const paths = {
  dashboard: (companyName: string) => withCompany(routes.Dashboard, companyName),
  users: (companyName: string) => withCompany(routes.Users, companyName),
  usersRoles: (companyName: string) => withCompany(routes.UsersRoles, companyName),
  settings: (companyName: string) => withCompany(routes.Settings, companyName),
  settingsPassword: (companyName: string) =>
    withCompany(routes.SettingsPassword, companyName),
  settingsSessions: (companyName: string) =>
    withCompany(routes.SettingsSessions, companyName),
  warehouse: (companyName: string) => withCompany(routes.Warehouse, companyName),
  account: (companyName: string) => withCompany(routes.Account, companyName),
  suppliers: (companyName: string) => withCompany(routes.Suppliers, companyName),
  suppliersDirectory: (companyName: string) =>
    withCompany(routes.SuppliersDirectory, companyName),
  suppliersRequests: (companyName: string) =>
    withCompany(routes.SuppliersRequests, companyName),
};
