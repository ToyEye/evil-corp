import { z } from "zod";

export const ACTIVITY_ENTITY_TYPES = ["order", "delivery", "restock", "invoice"] as const;

export const activityEntityTypeSchema = z.enum(ACTIVITY_ENTITY_TYPES);

export const activityEventSchema = z.object({
  id: z.string().min(1),
  companyId: z.string().min(1),
  entityType: activityEntityTypeSchema,
  entityId: z.string().min(1),
  entityNumber: z.string().min(1),
  message: z.string().min(1),
  actorId: z.string().min(1),
  actorName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const activityEventsSchema = z.array(activityEventSchema);

export type ActivityEntityType = z.infer<typeof activityEntityTypeSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
