import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { AsideLink } from "./aside.types";

export const ASIDE_LINKS: AsideLink[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardOutlinedIcon,
  },
  {
    id: "users",
    label: "Users",
    icon: PeopleOutlinedIcon,
    access: "admin",
    children: [
      { id: "users-all", label: "All users", href: "/users" },
      { id: "users-roles", label: "Roles", href: "/users/roles", access: "admin" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsOutlinedIcon,
    access: ["admin", "user"],
    children: [
      { id: "settings-general", label: "General", href: "/settings" },
      {
        id: "settings-security",
        label: "Security",
        access: "admin",
        children: [
          { id: "settings-password", label: "Password", href: "/settings/password" },
          { id: "settings-sessions", label: "Sessions", href: "/settings/sessions" },
        ],
      },
    ],
  },
];
