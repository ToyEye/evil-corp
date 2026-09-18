import { z } from "zod";

import { userRoleSchema } from "./users.schema";

export const notificationSchema = z
  .object({
    id: z.string().min(1),
    companyId: z.string().min(1),
    recipientUserId: z.string().min(1).optional(),
    recipientRole: userRoleSchema.optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    href: z.string().optional(),
    read: z.boolean(),
    createdAt: z.iso.datetime(),
  })
  .refine((item) => Boolean(item.recipientUserId || item.recipientRole), {
    message: "Notification must have a recipient",
  });

export const notificationsSchema = z.array(notificationSchema);

export type AppNotification = z.infer<typeof notificationSchema>;
