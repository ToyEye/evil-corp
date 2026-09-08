import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyInventoryItems } from "../../data/inventory.dummy";
import type { InventoryItem } from "../../data/inventory.schema";

type InventoryState = {
  items: InventoryItem[];
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
  },
  selectors: {
    selectInventoryItems: (state) => state.items,
  },
});

export const { addInventoryItem, updateInventoryItem } = inventorySlice.actions;

export const { selectInventoryItems } = inventorySlice.selectors;

export default inventorySlice.reducer;
