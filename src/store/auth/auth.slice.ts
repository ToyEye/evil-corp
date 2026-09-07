import { createSlice } from "@reduxjs/toolkit";
import { dummyUsers } from "../../data/users.dummy";
import { login } from "./auth.operations";
import type { AuthState } from "./auth.interface";

const initialState: AuthState = {
  user: dummyUsers[4],
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: true,
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
    selectUserRole: (state) => state.user?.role ?? null,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated,
  },
});

export default authSlice.reducer;

export const {
  selectUser,
  selectUserRole,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} = authSlice.selectors;
