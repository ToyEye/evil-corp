import {
  FORBIDDEN_ROLES_IN_ADMIN_COMPANY,
  PLATFORM_ONLY_ROLES,
  USER_ROLES,
  type UserRole,
} from "../data/users.schema";
import type { Company, CompanyType } from "../data/companies.schema";

export const isPlatformCompanyType = (
  type: CompanyType | string | null | undefined,
) => type === "platform";

export const isPlatformCompany = (
  company: Pick<Company, "type"> | null | undefined,
) => isPlatformCompanyType(company?.type);

export const findCompanyById = <T extends Pick<Company, "id" | "type">>(
  companies: T[],
  companyId: string | undefined,
) => companies.find((company) => company.id === companyId);

export const isPlatformCompanyId = (
  companies: Array<Pick<Company, "id" | "type">>,
  companyId: string | undefined,
) => isPlatformCompany(findCompanyById(companies, companyId));

export const isPlatformUser = (
  user:
    | {
        companyId?: string;
        companyType?: CompanyType | string | null;
      }
    | null
    | undefined,
  companies?: Array<Pick<Company, "id" | "type">>,
) => {
  if (!user) {
    return false;
  }

  if (user.companyType != null) {
    return isPlatformCompanyType(user.companyType);
  }

  if (!companies || !user.companyId) {
    return false;
  }

  return isPlatformCompanyId(companies, user.companyId);
};

export const getPlatformCompany = <T extends Pick<Company, "type">>(
  companies: T[],
) => {
  const platformCompany = companies.find((company) =>
    isPlatformCompany(company),
  );

  if (!platformCompany) {
    throw new Error("Platform company is missing");
  }

  return platformCompany;
};

export const getAssignableRoles = (
  companyType: CompanyType | string,
): UserRole[] =>
  isPlatformCompanyType(companyType)
    ? [...USER_ROLES]
    : USER_ROLES.filter(
        (role) => !(PLATFORM_ONLY_ROLES as readonly string[]).includes(role),
      );

export const canAssignCompanyRoles = (role: UserRole | null | undefined) =>
  role === "SEO" || role === "Staff" || role === "Admin";

export const getAssignableMemberRoles = (
  companyType: CompanyType | string,
): UserRole[] => {
  const roles = getAssignableRoles(companyType).filter(
    (role) => role !== "Admin",
  );

  if (!isPlatformCompanyType(companyType)) {
    return roles;
  }

  const forbidden = new Set<string>(FORBIDDEN_ROLES_IN_ADMIN_COMPANY);
  return roles.filter((role) => !forbidden.has(role));
};

export const getVisibleUsers = <T extends { companyId: string }>(
  user: { companyId?: string; companyType?: CompanyType | string | null } | null | undefined,
  allUsers: T[],
  companies?: Array<Pick<Company, "id" | "type">>,
) => {
  if (!user?.companyId) {
    return [];
  }

  if (isPlatformUser(user, companies)) {
    return allUsers;
  }

  return allUsers.filter((item) => item.companyId === user.companyId);
};

export const getCompanyNameForUser = (user: {
  companyName?: string;
}) => user.companyName ?? "";
