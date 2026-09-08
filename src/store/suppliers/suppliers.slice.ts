import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummySuppliers } from "../../data/suppliers.dummy";
import type { Supplier } from "../../data/suppliers.schema";

type SuppliersState = {
  items: Supplier[];
};

const initialState: SuppliersState = {
  items: dummySuppliers,
};

export const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.items.unshift(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
  },
  selectors: {
    selectSuppliers: (state) => state.items,
  },
});

export const { addSupplier, updateSupplier } = suppliersSlice.actions;

export const { selectSuppliers } = suppliersSlice.selectors;

export default suppliersSlice.reducer;
