import { hasAccess } from "../components/Aside/aside.utils";
import type { PageAccess } from "../data/permissions.schema";
import type { User } from "../data/users.schema";
import { isPlatformUser } from "../utils/companyAccess";

export const EMPTY_PAGE_ACCESS: PageAccess = {
  dashboard: [],
  users: [],
  settings: [],
  warehouse: [],
  suppliers: [],
  clients: [],
  deliveries: [],
  orders: [],
  invoices: [],
  support: [],
};

export const canAccessSupportChat = (
  user: User | null | undefined,
  pageAccess: PageAccess,
) => {
  if (!user || !hasAccess(pageAccess.support, user.role)) {
    return false;
  }

  if (isPlatformUser(user)) {
    return user.role === "Support" || user.role === "Admin";
  }

  return true;
};
