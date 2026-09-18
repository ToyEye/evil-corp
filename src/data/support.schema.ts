import { z } from "zod";

import { userRoleSchema } from "./users.schema";

export const supportMessageSchema = z.object({
  id: z.string().min(1),
  threadId: z.string().min(1),
  authorId: z.string().min(1),
  authorName: z.string().min(1),
  authorRole: userRoleSchema,
  body: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const supportThreadSchema = z.object({
  id: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  requesterId: z.string().min(1),
  requesterName: z.string().min(1),
  requesterRole: userRoleSchema,
  supportLastReadAt: z.iso.datetime().optional(),
  requesterLastReadAt: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const supportThreadsSchema = z.array(supportThreadSchema);
export const supportMessagesSchema = z.array(supportMessageSchema);

export type SupportMessage = z.infer<typeof supportMessageSchema>;
export type SupportThread = z.infer<typeof supportThreadSchema>;

export const isPlatformSupportReply = (role: string) =>
  role === "Support" || role === "Admin";

export const getThreadMessages = (messages: SupportMessage[], threadId: string) =>
  messages
    .filter((item) => item.threadId === threadId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

export const getLastThreadMessage = (messages: SupportMessage[], threadId: string) => {
  const items = getThreadMessages(messages, threadId);
  return items[items.length - 1];
};

export const isThreadUnreadFor = (
  thread: SupportThread,
  messages: SupportMessage[],
  viewer: "support" | "requester",
) => {
  const last = getLastThreadMessage(messages, thread.id);

  if (!last) {
    return false;
  }

  if (viewer === "support") {
    if (isPlatformSupportReply(last.authorRole)) {
      return false;
    }

    return !thread.supportLastReadAt || last.createdAt > thread.supportLastReadAt;
  }

  if (!isPlatformSupportReply(last.authorRole)) {
    return false;
  }

  return !thread.requesterLastReadAt || last.createdAt > thread.requesterLastReadAt;
};
