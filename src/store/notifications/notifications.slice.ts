import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyNotifications } from "../../data/notifications.dummy";
import type { AppNotification } from "../../data/notifications.schema";

type NotificationsState = {
  items: AppNotification[];
};

const initialState: NotificationsState = {
  items: dummyNotifications,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.items.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((entry) => entry.id === action.payload);

      if (item) {
        item.read = true;
      }
    },
    markAllNotificationsRead: (
      state,
      action: PayloadAction<{ companyId: string; userId: string; role: string }>,
    ) => {
      for (const item of state.items) {
        const matchesUser = item.recipientUserId === action.payload.userId;
        const matchesRole =
          item.recipientRole === action.payload.role && item.companyId === action.payload.companyId;

        if (item.companyId === action.payload.companyId && (matchesUser || matchesRole)) {
          item.read = true;
        }
      }
    },
  },
  selectors: {
    selectNotifications: (state) => state.items,
  },
});

export const { addNotification, markNotificationRead, markAllNotificationsRead } =
  notificationsSlice.actions;

export const { selectNotifications } = notificationsSlice.selectors;

export default notificationsSlice.reducer;
