import { z } from "zod";

import { userRoleSchema } from "./users.schema";

export const APP_PAGE_IDS = [
  "dashboard",
  "users",
  "settings",
  "warehouse",
  "suppliers",
] as const;

export const appPageIdSchema = z.enum(APP_PAGE_IDS);

export const appPageSchema = z.object({
  id: appPageIdSchema,
  label: z.string().min(1),
  description: z.string().min(1),
});

export const pageAccessSchema = z.object({
  dashboard: z.array(userRoleSchema),
  users: z.array(userRoleSchema),
  settings: z.array(userRoleSchema),
  warehouse: z.array(userRoleSchema),
  suppliers: z.array(userRoleSchema),
});

export type AppPageId = z.infer<typeof appPageIdSchema>;
export type AppPage = z.infer<typeof appPageSchema>;
export type PageAccess = z.infer<typeof pageAccessSchema>;
