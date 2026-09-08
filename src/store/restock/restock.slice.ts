import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyRestockRequests } from "../../data/restock.dummy";
import type { RestockRequest } from "../../data/restock.schema";

type RestockState = {
  items: RestockRequest[];
};

const initialState: RestockState = {
  items: dummyRestockRequests,
};

export const restockSlice = createSlice({
  name: "restock",
  initialState,
  reducers: {
    addRestockRequest: (state, action: PayloadAction<RestockRequest>) => {
      state.items.unshift(action.payload);
    },
  },
  selectors: {
    selectRestockRequests: (state) => state.items,
  },
});

export const { addRestockRequest } = restockSlice.actions;

export const { selectRestockRequests } = restockSlice.selectors;

export default restockSlice.reducer;
