import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyActivityEvents } from "../../data/activity.dummy";
import type { ActivityEvent } from "../../data/activity.schema";

type ActivityState = {
  items: ActivityEvent[];
};

const initialState: ActivityState = {
  items: dummyActivityEvents,
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<ActivityEvent>) => {
      state.items.unshift(action.payload);
    },
  },
  selectors: {
    selectActivity: (state) => state.items,
  },
});

export const { addActivity } = activitySlice.actions;

export const { selectActivity } = activitySlice.selectors;

export default activitySlice.reducer;
