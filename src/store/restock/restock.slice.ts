import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyRestockRequests } from "../../data/restock.dummy";
import { getNextRestockStatus, type RestockRequest, type RestockStatus } from "../../data/restock.schema";

type RestockState = {
  items: RestockRequest[];
};

type UpdateRestockStatusPayload = {
  id: string;
  status: RestockStatus;
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
    updateRestockStatus: (state, action: PayloadAction<UpdateRestockStatusPayload>) => {
      const request = state.items.find((item) => item.id === action.payload.id);
      const nextStatus = request ? getNextRestockStatus(request.status) : undefined;

      if (!request || nextStatus !== action.payload.status) {
        return;
      }

      request.status = action.payload.status;
    },
  },
  selectors: {
    selectRestockRequests: (state) => state.items,
  },
});

export const { addRestockRequest, updateRestockStatus } = restockSlice.actions;

export const { selectRestockRequests } = restockSlice.selectors;

export default restockSlice.reducer;
