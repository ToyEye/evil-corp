import { routes } from "../../routing/routes";

export const publicNavPages = [
  { to: routes.Home, label: "Home", end: true },
  { to: routes.About, label: "About", end: false },
] as const;
