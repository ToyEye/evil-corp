import { createSlice } from "@reduxjs/toolkit";
import { login } from "./auth.operations";
import type { AuthState } from "./auth.interface";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    }),

  selectors: {
    selectUser: (state) => state.user,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated,
  },
});

export default authSlice.reducer;

export const {
  selectUser,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} = authSlice.selectors;
