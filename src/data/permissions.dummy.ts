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
    description: "Stock, bins, pick lists, and warehouse receipts",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Supplier directory for the supply department",
  },
  {
    id: "clients",
    label: "Clients",
    description: "Customer directory with contacts and delivery addresses",
  },
  {
    id: "deliveries",
    label: "Deliveries",
    description: "Dispatch board, fleet, and assigned deliveries",
  },
  {
    id: "orders",
    label: "Orders",
    description: "Client orders, payment, and warehouse reservation",
  },
  {
    id: "invoices",
    label: "Invoices",
    description: "Invoices issued from paid client orders",
  },
  {
    id: "support",
    label: "Support",
    description: "Chat between client companies and platform Support",
  },
];

export const appPages = appPagesData.map((page) => appPageSchema.parse(page));

export const defaultPageAccess: PageAccess = pageAccessSchema.parse({
  dashboard: [...USER_ROLES],
  users: ["Admin", "SEO", "Staff"],
  settings: ["Admin", "SEO"],
  warehouse: ["SEO", "Storekeeper"],
  suppliers: ["SEO", "Supply"],
  clients: ["SEO", "Staff"],
  deliveries: ["SEO", "Staff", "Driver"],
  orders: ["Staff", "Accountant"],
  invoices: ["SEO", "Accountant"],
  support: [...USER_ROLES],
});

export const isPageAccessLocked = (pageId: AppPageId, role: UserRole) =>
  pageId === "settings" && role === "Admin";
