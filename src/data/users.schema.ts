import { z } from "zod";

export const USER_ROLES = [
  "SEO",
  "driver",
  "Storekeeper",
  "Supply",
  "Accountant",
  "Staff",
  "admin",
] as const;

export const userRoleSchema = z.enum(USER_ROLES);

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  role: userRoleSchema,
  companyName: z.string().min(1),
  companyId: z.string().min(1),
  avatarUrl: z.string().optional(),
});

export const FORBIDDEN_ROLES_IN_ADMIN_COMPANY = [
  "driver",
  "Storekeeper",
  "Supply",
] as const;

const forbiddenRolesInAdminCompany = new Set<string>(FORBIDDEN_ROLES_IN_ADMIN_COMPANY);

export const usersSchema = z
  .array(userSchema)
  .min(1)
  .refine(
    (users) => new Set(users.map((user) => user.companyId)).size >= 3,
    { message: "Users must belong to at least 3 companies" },
  )
  .refine(
    (users) => {
      const namesByCompanyId = new Map<string, string>();

      for (const user of users) {
        const existingName = namesByCompanyId.get(user.companyId);

        if (existingName && existingName !== user.companyName) {
          return false;
        }

        namesByCompanyId.set(user.companyId, user.companyName);
      }

      return true;
    },
    { message: "Users with the same companyId must share the same companyName" },
  )
  .refine(
    (users) => {
      const adminCompanyIds = new Set(
        users.filter((user) => user.role === "admin").map((user) => user.companyId),
      );

      return adminCompanyIds.size === 1;
    },
    { message: "Admin role can belong to only one company" },
  )
  .refine(
    (users) => {
      const adminCompanyIds = new Set(
        users.filter((user) => user.role === "admin").map((user) => user.companyId),
      );

      return !users.some(
        (user) =>
          adminCompanyIds.has(user.companyId) &&
          forbiddenRolesInAdminCompany.has(user.role),
      );
    },
    { message: "A company with an admin cannot have driver, Storekeeper, or Supply roles" },
  );

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
