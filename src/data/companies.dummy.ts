import {
  FORBIDDEN_ROLES_IN_ADMIN_COMPANY,
  PLATFORM_ONLY_ROLES,
  USER_ROLES,
  type UserRole,
} from "./users.schema";
import { companiesSchema, type Company } from "./companies.schema";

const dummyCompaniesData: Company[] = [
  { id: "company-1", name: "Vertex Capital", type: "platform" },
  {
    id: "company-2",
    name: "RapidRoute Logistics",
    type: "client",
    depotLat: 47.4812,
    depotLng: 19.1303,
  },
  {
    id: "company-3",
    name: "Peak Storage",
    type: "client",
    depotLat: 44.4949,
    depotLng: 11.3426,
  },
];

export const dummyCompanies = companiesSchema.parse(dummyCompaniesData);

export const getPlatformCompany = () => {
  const platformCompany = dummyCompanies.find(
    (company) => company.type === "platform",
  );

  if (!platformCompany) {
    throw new Error("Platform company is missing");
  }

  return platformCompany;
};

export const getCompanyById = (companyId: string) =>
  dummyCompanies.find((company) => company.id === companyId);

export const isPlatformCompanyId = (companyId: string) =>
  getCompanyById(companyId)?.type === "platform";

export const isPlatformUser = (
  user: { companyId?: string } | null | undefined,
) => Boolean(user?.companyId && isPlatformCompanyId(user.companyId));

export const getAssignableRoles = (companyId: string): UserRole[] =>
  isPlatformCompanyId(companyId)
    ? [...USER_ROLES]
    : USER_ROLES.filter(
        (role) => !(PLATFORM_ONLY_ROLES as readonly string[]).includes(role),
      );

export const canAssignCompanyRoles = (role: UserRole | null | undefined) =>
  role === "SEO" || role === "Staff" || role === "Admin";

export const getAssignableMemberRoles = (companyId: string): UserRole[] => {
  const roles = getAssignableRoles(companyId).filter(
    (role) => role !== "Admin",
  );

  if (!isPlatformCompanyId(companyId)) {
    return roles;
  }

  const forbidden = new Set<string>(FORBIDDEN_ROLES_IN_ADMIN_COMPANY);
  return roles.filter((role) => !forbidden.has(role));
};
