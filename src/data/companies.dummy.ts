import {
  FORBIDDEN_ROLES_IN_ADMIN_COMPANY,
  USER_ROLES,
  type UserRole,
} from "./users.schema";
import { companiesSchema, type Company } from "./companies.schema";

const dummyCompaniesData: Company[] = [
  { id: "company-1", name: "Vertex Capital", type: "platform" },
  { id: "company-2", name: "RapidRoute Logistics", type: "client" },
  { id: "company-3", name: "Peak Storage", type: "client" },
];

export const dummyCompanies = companiesSchema.parse(dummyCompaniesData);

export const getPlatformCompany = () => {
  const platformCompany = dummyCompanies.find((company) => company.type === "platform");

  if (!platformCompany) {
    throw new Error("Platform company is missing");
  }

  return platformCompany;
};

export const getCompanyById = (companyId: string) =>
  dummyCompanies.find((company) => company.id === companyId);

export const isPlatformCompanyId = (companyId: string) =>
  getCompanyById(companyId)?.type === "platform";

export const isPlatformUser = (user: { companyId?: string } | null | undefined) =>
  Boolean(user?.companyId && isPlatformCompanyId(user.companyId));

export const getAssignableRoles = (companyId: string): UserRole[] =>
  isPlatformCompanyId(companyId)
    ? [...USER_ROLES]
    : USER_ROLES.filter((role) => role !== "admin");

export const canAssignCompanyRoles = (role: UserRole | null | undefined) =>
  role === "SEO" || role === "Staff" || role === "admin";

export const getAssignableMemberRoles = (companyId: string): UserRole[] => {
  const roles = getAssignableRoles(companyId).filter((role) => role !== "admin");

  if (!isPlatformCompanyId(companyId)) {
    return roles;
  }

  const forbidden = new Set<string>(FORBIDDEN_ROLES_IN_ADMIN_COMPANY);
  return roles.filter((role) => !forbidden.has(role));
};
