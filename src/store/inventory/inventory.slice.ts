import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyInventoryItems } from "../../data/inventory.dummy";
import type { InventoryItem } from "../../data/inventory.schema";

type InventoryState = {
  items: InventoryItem[];
};

type AdjustInventoryQuantityPayload = {
  id: string;
  delta: number;
};

const initialState: InventoryState = {
  items: dummyInventoryItems,
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      state.items.unshift(action.payload);
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    adjustInventoryQuantity: (state, action: PayloadAction<AdjustInventoryQuantityPayload>) => {
      const item = state.items.find((entry) => entry.id === action.payload.id);

      if (!item) {
        return;
      }

      item.quantity = Math.max(0, item.quantity + action.payload.delta);
    },
  },
  selectors: {
    selectInventoryItems: (state) => state.items,
  },
});

export const { addInventoryItem, updateInventoryItem, adjustInventoryQuantity } =
  inventorySlice.actions;

export const { selectInventoryItems } = inventorySlice.selectors;

export default inventorySlice.reducer;
