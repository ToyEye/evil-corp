import { addActivity } from "../activity/activity.slice";
import { addNotification } from "../notifications/notifications.slice";
import type { ActivityEntityType } from "../../data/activity.schema";
import type { UserRole } from "../../data/users.schema";
import type { AppDispatch } from "../types";

type NotifyTarget =
  | {
      userId: string;
      title: string;
      body: string;
      href?: string;
    }
  | {
      role: UserRole;
      title: string;
      body: string;
      href?: string;
    };

type LogOpsEventInput = {
  companyId: string;
  entityType: ActivityEntityType;
  entityId: string;
  entityNumber: string;
  message: string;
  actorId: string;
  actorName: string;
  notify?: NotifyTarget[];
};

export const logOpsEvent = (input: LogOpsEventInput) => (dispatch: AppDispatch) => {
  const createdAt = new Date().toISOString();

  dispatch(
    addActivity({
      id: crypto.randomUUID(),
      companyId: input.companyId,
      entityType: input.entityType,
      entityId: input.entityId,
      entityNumber: input.entityNumber,
      message: input.message,
      actorId: input.actorId,
      actorName: input.actorName,
      createdAt,
    }),
  );

  for (const target of input.notify ?? []) {
    dispatch(
      addNotification({
        id: crypto.randomUUID(),
        companyId: input.companyId,
        recipientUserId: "userId" in target ? target.userId : undefined,
        recipientRole: "role" in target ? target.role : undefined,
        title: target.title,
        body: target.body,
        href: target.href,
        read: false,
        createdAt,
      }),
    );
  }
};
