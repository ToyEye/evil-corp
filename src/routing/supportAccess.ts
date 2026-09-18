import { hasAccess } from "../components/Aside/aside.utils";
import { isPlatformUser } from "../data/companies.dummy";
import type { PageAccess } from "../data/permissions.schema";
import type { User } from "../data/users.schema";

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
