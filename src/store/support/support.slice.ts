import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummySupportMessages, dummySupportThreads } from "../../data/support.dummy";
import type { SupportMessage, SupportThread } from "../../data/support.schema";

type SupportState = {
  threads: SupportThread[];
  messages: SupportMessage[];
};

type MarkSupportThreadReadPayload = {
  threadId: string;
  as: "support" | "requester";
  readAt: string;
};

const initialState: SupportState = {
  threads: dummySupportThreads,
  messages: dummySupportMessages,
};

export const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    ensureSupportThread: (state, action: PayloadAction<SupportThread>) => {
      if (state.threads.some((item) => item.id === action.payload.id)) {
        return;
      }

      state.threads.unshift(action.payload);
    },
    addSupportMessage: (state, action: PayloadAction<SupportMessage>) => {
      const thread = state.threads.find((item) => item.id === action.payload.threadId);

      if (!thread) {
        return;
      }

      state.messages.push(action.payload);
      thread.updatedAt = action.payload.createdAt;
    },
    markSupportThreadRead: (state, action: PayloadAction<MarkSupportThreadReadPayload>) => {
      const thread = state.threads.find((item) => item.id === action.payload.threadId);

      if (!thread) {
        return;
      }

      if (action.payload.as === "support") {
        thread.supportLastReadAt = action.payload.readAt;
        return;
      }

      thread.requesterLastReadAt = action.payload.readAt;
    },
  },
  selectors: {
    selectSupportThreads: (state) => state.threads,
    selectSupportMessages: (state) => state.messages,
  },
});

export const { ensureSupportThread, addSupportMessage, markSupportThreadRead } =
  supportSlice.actions;

export const { selectSupportThreads, selectSupportMessages } = supportSlice.selectors;

export default supportSlice.reducer;
