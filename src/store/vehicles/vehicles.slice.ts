import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyVehicles } from "../../data/vehicles.dummy";
import type { Vehicle } from "../../data/vehicles.schema";

type VehiclesState = {
  items: Vehicle[];
};

const initialState: VehiclesState = {
  items: dummyVehicles,
};

export const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.items.unshift(action.payload);
    },
  },
  selectors: {
    selectVehicles: (state) => state.items,
  },
});

export const { addVehicle } = vehiclesSlice.actions;

export const { selectVehicles } = vehiclesSlice.selectors;

export default vehiclesSlice.reducer;
