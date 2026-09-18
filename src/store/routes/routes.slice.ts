import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyDispatchRoutes } from "../../data/routes.dummy";
import type { DispatchRoute } from "../../data/routes.schema";

type RoutesState = {
  items: DispatchRoute[];
};

const initialState: RoutesState = {
  items: dummyDispatchRoutes,
};

export const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    addDispatchRoute: (state, action: PayloadAction<DispatchRoute>) => {
      state.items.unshift(action.payload);
    },
  },
  selectors: {
    selectDispatchRoutes: (state) => state.items,
  },
});

export const { addDispatchRoute } = routesSlice.actions;

export const { selectDispatchRoutes } = routesSlice.selectors;

export default routesSlice.reducer;
