import { USER_ROLES, type UserRole } from "./users.schema";
import {
  appPageSchema,
  pageAccessSchema,
  type AppPage,
  type AppPageId,
  type PageAccess,
} from "./permissions.schema";

const appPagesData: AppPage[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Company overview and main workspace",
  },
  {
    id: "users",
    label: "Users",
    description: "User list, roles, and company membership",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Company settings and page access",
  },
  {
    id: "warehouse",
    label: "Warehouse",
    description: "Stock nomenclature, quantities, and categories",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Supplier directory for the supply department",
  },
];

export const appPages = appPagesData.map((page) => appPageSchema.parse(page));

export const defaultPageAccess: PageAccess = pageAccessSchema.parse({
  dashboard: [...USER_ROLES],
  users: ["admin", "SEO"],
  settings: ["admin", "SEO"],
  warehouse: ["SEO", "Storekeeper"],
  suppliers: ["SEO", "Supply"],
});

export const isPageAccessLocked = (pageId: AppPageId, role: UserRole) =>
  pageId === "settings" && role === "admin";
