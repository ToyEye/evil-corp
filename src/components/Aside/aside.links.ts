import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { PageAccess } from "../../data/permissions.schema";
import { paths } from "../../routing/routes";
import type { AsideLink } from "./aside.types";

export const getAsideLinks = (
  companyName: string,
  pageAccess: PageAccess,
): AsideLink[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    href: paths.dashboard(companyName),
    icon: DashboardOutlinedIcon,
    access: pageAccess.dashboard,
  },
  {
    id: "users",
    label: "Users",
    href: paths.users(companyName),
    icon: PeopleOutlinedIcon,
    access: pageAccess.users,
  },
  {
    id: "warehouse",
    label: "Warehouse",
    href: paths.warehouse(companyName),
    icon: Inventory2OutlinedIcon,
    access: pageAccess.warehouse,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    href: paths.suppliers(companyName),
    icon: LocalShippingOutlinedIcon,
    access: pageAccess.suppliers,
    children: [
      {
        id: "suppliers-directory",
        label: "Directory",
        href: paths.suppliersDirectory(companyName),
        access: pageAccess.suppliers,
      },
      {
        id: "suppliers-requests",
        label: "Restock requests",
        href: paths.suppliersRequests(companyName),
        access: pageAccess.suppliers,
      },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    href: paths.clients(companyName),
    icon: GroupOutlinedIcon,
    access: pageAccess.clients,
  },
  {
    id: "deliveries",
    label: "Deliveries",
    href: paths.deliveries(companyName),
    icon: RouteOutlinedIcon,
    access: pageAccess.deliveries,
    children: [
      {
        id: "deliveries-assigned",
        label: "Assigned",
        href: paths.deliveries(companyName),
        access: pageAccess.deliveries,
      },
      {
        id: "deliveries-create",
        label: "Create delivery",
        href: paths.createDelivery(companyName),
        access: pageAccess.deliveries,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    href: paths.settings(companyName),
    icon: SettingsOutlinedIcon,
    access: pageAccess.settings,
  },
];
